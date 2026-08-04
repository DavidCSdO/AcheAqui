import asyncio
import time
import aiohttp
from typing import List, Dict, Any, Optional, AsyncGenerator
from app.collectors.base import BaseCollector, RawLead
from app.collectors.google_maps import GoogleMapsCollector
from app.collectors.openstreetmap import OpenStreetMapCollector
from app.collectors.duckduckgo import DuckDuckGoCollector
from app.processors.deduplicator import is_duplicate
from app.processors.classifier import calculate_lead_score
from app.services.enrichment import crawl_and_enrich_lead
from app.utils.phone_formatter import format_phone_br, categorize_phones, generate_whatsapp_link
from app.core.logging import logger


class ProspectingPipeline:
    """7-Step Automated Scraping & Processing Pipeline for AcheAqui."""

    def __init__(self, collectors: Optional[List[BaseCollector]] = None):
        self.collectors = collectors or [
            GoogleMapsCollector(),
            OpenStreetMapCollector(),
            DuckDuckGoCollector()
        ]

    async def run(
        self, 
        query: str, 
        city: Optional[str] = None, 
        state: Optional[str] = None, 
        limit: int = 20,
        mode: str = "direcionada"
    ) -> List[Dict[str, Any]]:
        start_time = time.time()
        logger.info(f"[Pipeline] Starting 7-step execution: '{query}' in '{city or 'Brasil'}' (limit: {limit})")

        # Step 1: Descoberta (Multi-Collector Discovery)
        raw_leads: List[RawLead] = []
        # Query primary collector (Google Maps) first
        for collector in self.collectors:
            try:
                discovered = await collector.search(query, city=city, state=state, limit=limit)
                raw_leads.extend(discovered)
                if len(raw_leads) >= limit:
                    break
            except Exception as e:
                logger.warning(f"[Pipeline] Collector '{collector.name}' failed: {e}")

        # Step 2: Validação & Filter out empty names
        valid_leads = [lead.to_dict() for lead in raw_leads if lead.name and len(lead.name.strip()) > 1]
        
        # Step 3: Deduplicação (In-Memory Deduplication)
        deduped_leads: List[Dict[str, Any]] = []
        for lead in valid_leads:
            if not is_duplicate(lead, deduped_leads):
                deduped_leads.append(lead)

        final_leads = deduped_leads[:limit]

        # Step 4: Enriquecimento (Crawl Site & Search Links)
        if mode != "simples":
            async with aiohttp.ClientSession() as session:
                tasks = [crawl_and_enrich_lead(item, session) for item in final_leads]
                final_leads = await asyncio.gather(*tasks)

        # Step 5: Classificação & Lead Score
        for lead in final_leads:
            lead["lead_score"] = calculate_lead_score(lead)
            # Format phones
            if lead.get("phone"):
                lead["phone"] = format_phone_br(lead["phone"])
                lead["whatsapp"] = generate_whatsapp_link(lead["phone"])

        elapsed = round(time.time() - start_time, 2)
        logger.info(f"[Pipeline Concluído] {len(final_leads)} leads processados em {elapsed}s.")
        return final_leads

    async def run_streaming(
        self, 
        query: str, 
        city: Optional[str] = None, 
        limit: int = 20,
        mode: str = "direcionada"
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Streaming version for real-time SSE UI rendering."""
        google_collector = GoogleMapsCollector()
        discovered = await google_collector.search(query, city=city, limit=limit)
        
        seen: List[Dict[str, Any]] = []
        for idx, raw in enumerate(discovered):
            item = raw.to_dict()
            if is_duplicate(item, seen):
                continue
            seen.append(item)
            
            # Emit basic
            yield {"_phase": "basic", "index": idx + 1, "data": item}

        if mode == "extrema":
            import queue
            import sys
            import threading
            from app.services.deep_enrichment import deep_crawl_and_enrich_lead
            
            q = asyncio.Queue()
            main_loop = asyncio.get_running_loop()
            
            def run_extrema_in_thread(seen_leads, city_name):
                logger.info("[Extrema] Thread started")
                if sys.platform == 'win32':
                    new_loop = asyncio.WindowsProactorEventLoopPolicy().new_event_loop()
                else:
                    new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                logger.info("[Extrema] Event loop created in thread")
                
                async def _worker():
                    from playwright.async_api import async_playwright
                    try:
                        logger.info("[Extrema] Starting async_playwright context")
                        async with async_playwright() as p:
                            logger.info("[Extrema] Launching chromium")
                            browser = await p.chromium.launch(
                                headless=True,
                                args=["--disable-dev-shm-usage", "--no-sandbox", "--disable-gpu", "--disable-software-rasterizer"]
                            )
                            logger.info("[Extrema] Chromium launched")
                            sem = asyncio.Semaphore(3)
                            
                            async def process_item(idx, item):
                                async with sem:
                                    try:
                                        logger.info(f"[Extrema] Processing lead {idx}")
                                        enriched = await deep_crawl_and_enrich_lead(item, browser, city_query=city_name)
                                        enriched["lead_score"] = calculate_lead_score(enriched)
                                        if enriched.get("phone"):
                                            enriched["phone"] = format_phone_br(enriched["phone"])
                                            enriched["whatsapp"] = generate_whatsapp_link(enriched["phone"])
                                        # send to main thread
                                        logger.info(f"[Extrema] Sending lead {idx} to queue")
                                        asyncio.run_coroutine_threadsafe(
                                            q.put({"_phase": "enriched", "index": idx + 1, "data": enriched}), 
                                            main_loop
                                        )
                                    except Exception as e:
                                        logger.error(f"Erro extrema no lead {idx}: {e}")
                                        
                            tasks = [process_item(idx, item) for idx, item in enumerate(seen_leads)]
                            await asyncio.gather(*tasks)
                            logger.info("[Extrema] All tasks gathered")
                    except Exception as e:
                        logger.error(f"Erro fatal no worker do extrema: {e}")
                        
                try:
                    new_loop.run_until_complete(_worker())
                finally:
                    logger.info("[Extrema] Thread finishing, putting None to queue")
                    asyncio.run_coroutine_threadsafe(q.put(None), main_loop)
                    new_loop.close()
                    
            threading.Thread(target=run_extrema_in_thread, args=(seen, city)).start()
            
            while True:
                res = await q.get()
                if res is None:
                    break
                yield res

        elif mode != "simples":
            async with aiohttp.ClientSession() as session:
                concurrency = 15
                sem = asyncio.Semaphore(concurrency)
                
                async def enrich_task(idx, item, session):
                    async with sem:
                        enriched = await crawl_and_enrich_lead(item, session, city_query=city)
                        enriched["lead_score"] = calculate_lead_score(enriched)
                        if enriched.get("phone"):
                            enriched["phone"] = format_phone_br(enriched["phone"])
                            enriched["whatsapp"] = generate_whatsapp_link(enriched["phone"])
                        return {"_phase": "enriched", "index": idx + 1, "data": enriched}
                
                tasks = [enrich_task(idx, item, session) for idx, item in enumerate(seen)]
                for completed_task in asyncio.as_completed(tasks):
                    res = await completed_task
                    yield res
