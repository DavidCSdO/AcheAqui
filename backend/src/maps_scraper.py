import asyncio
import urllib.parse
import re
import aiohttp
import sys
import os
from typing import AsyncGenerator

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config
from src.utils import setup_logger

logger = setup_logger(config.LOG_FILE)


async def _extract_feed_item_data(page, index: int) -> dict:
    """Extract basic data from a single feed item card in the Google Maps list view."""
    info = {
        "Nome": "",
        "Nota Google": "",
        "Avaliações": "",
        "Categoria": "",
        "Endereço": "",
        "Telefone Maps": "",
        "Site Oficial Maps": "",
        "Google Maps URL": "",
        "Instagram": "",
        "Facebook": "",
        "Email": ""
    }
    
    try:
        links = page.locator("a[href*='/maps/place/']")
        if index >= await links.count():
            return info
        
        link = links.nth(index)
        info["Google Maps URL"] = await link.get_attribute("href") or ""
        info["Nome"] = await link.get_attribute("aria-label") or ""
        
        try:
            card = link.locator("xpath=ancestor::div[contains(@class, 'Nv2PK')]")
            if await card.count() == 0:
                card = link.locator("xpath=ancestor::div[contains(@jsaction, 'mouseover')]")
            
            if await card.count() > 0:
                card_text = await card.text_content() or ""
                
                # Rating
                rating_match = re.search(r'(\d[.,]\d)\s*\(', card_text)
                if rating_match:
                    info["Nota Google"] = rating_match.group(1).replace(",", ".")
                
                # Reviews
                reviews_match = re.search(r'\((\d[\d\.\s]*)\)', card_text)
                if reviews_match:
                    info["Avaliações"] = reviews_match.group(1).replace(".", "").replace(" ", "").strip()
                
                # Category
                try:
                    cat_spans = card.locator("span").all()
                    spans = await cat_spans
                    for span in spans:
                        span_text = (await span.text_content() or "").strip()
                        if (span_text and 2 < len(span_text) < 40 
                            and not re.match(r'^[\d.,()]+$', span_text)
                            and '·' not in span_text
                            and span_text != info["Nome"]
                            and not span_text.startswith("Aberto")
                            and not span_text.startswith("Fechado")):
                            if not re.search(r'\d{3,}', span_text) and ',' not in span_text:
                                if not info["Categoria"]:
                                    info["Categoria"] = span_text
                except Exception:
                    pass
                    
                # Address snippet
                addr_match = re.search(r'·\s*([^·]*(?:R\.|Rua|Av\.|Avenida|Praça|Al\.|Alameda|Trav\.)[^·]+)', card_text)
                if addr_match:
                    info["Endereço"] = addr_match.group(1).strip()
        except Exception:
            pass
    
    except Exception:
        pass
    
    return info


async def collect_basic_leads_from_maps(query: str, max_results: int = 15) -> list[dict]:
    """Phase 1: Uses Playwright for ~3 seconds to scroll Maps list view and collect basic cards.
    
    CLOSES BROWSER IMMEDIATELY to free memory before returning.
    """
    from playwright.async_api import async_playwright
    
    logger.info(f"[Phase 1] Coletando lista rápida no Maps: '{query}' (máx: {max_results})")
    
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.google.com/maps/search/{encoded_query}?hl=pt-BR"
    feed_data = []
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-gpu",
                    "--single-process",
                    "--disable-software-rasterizer",
                    "--disable-extensions",
                    "--js-flags=--max-old-space-size=128"
                ]
            )
            
            context = await browser.new_context(
                user_agent=config.HTTP_USER_AGENT,
                viewport={"width": 1280, "height": 720}
            )
            
            async def route_intercept(route):
                if route.request.resource_type in ["image", "font", "media", "stylesheet"]:
                    await route.abort()
                else:
                    await route.continue_()
            await context.route("**/*", route_intercept)
            
            page = await context.new_page()
            
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=25000)
                await page.wait_for_timeout(2000)
                
                try:
                    reject_btn = page.locator("button:has-text('Rejeitar tudo'), button:has-text('Reject all')").first
                    if await reject_btn.is_visible():
                        await reject_btn.click()
                        await page.wait_for_timeout(500)
                except Exception:
                    pass

                feed_selector = "div[role='feed']"
                try:
                    await page.wait_for_selector(feed_selector, timeout=8000)
                except Exception:
                    pass

                prev_count = 0
                scroll_attempts = 0
                max_scroll_attempts = 12

                while scroll_attempts < max_scroll_attempts:
                    items = page.locator("a[href*='/maps/place/']")
                    count = await items.count()
                    
                    if count >= max_results:
                        break
                        
                    if count == prev_count:
                        scroll_attempts += 1
                    else:
                        scroll_attempts = 0
                        prev_count = count
                        
                    feed_exists = await page.locator(feed_selector).count() > 0
                    if feed_exists:
                        await page.evaluate(f"""
                            const feed = document.querySelector("{feed_selector}");
                            if (feed) feed.scrollTop += 1500;
                        """)
                    else:
                        await page.evaluate("window.scrollBy(0, 1000);")
                        
                    await page.wait_for_timeout(1000)
                    
                    end_of_list = await page.locator("text='Você chegou ao fim da lista'").count() > 0
                    if end_of_list:
                        break

                total_items = await page.locator("a[href*='/maps/place/']").count()
                items_count = min(total_items, max_results)
                
                for i in range(items_count):
                    item_data = await _extract_feed_item_data(page, i)
                    if item_data["Google Maps URL"]:
                        feed_data.append(item_data)
                        
            finally:
                await page.close()
            
            # CRITICAL: Close browser immediately
            await browser.close()
            logger.info(f"[Phase 1 Concluída] Navegador FECHADO. {len(feed_data)} leads básicos na memória.")
    
    except Exception as e:
        logger.error(f"Erro na Phase 1 (Maps list): {e}")
        
    return feed_data


async def enrich_lead_via_http_search(lead: dict, city_query: str, session: aiohttp.ClientSession) -> dict:
    """Phase 2: 100% Lightweight HTTP Search Enrichment (ZERO Browser, ZERO RAM spike).
    
    Performs a fast HTTP search for '{company_name} {city_query}' on DuckDuckGo HTML
    to extract Phone, Instagram, Facebook, and Official Website links.
    """
    enriched = dict(lead)
    company_name = enriched.get("Nome", "")
    if not company_name:
        return enriched
        
    search_term = f"{company_name} {city_query}"
    search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(search_term)}"
    
    try:
        async with session.get(
            search_url,
            timeout=aiohttp.ClientTimeout(total=5),
            headers={"User-Agent": config.HTTP_USER_AGENT}
        ) as resp:
            if resp.status == 200:
                raw_html = await resp.text(errors="replace")
                html = urllib.parse.unquote(raw_html)
                
                # 1. Extract Instagram Link
                if not enriched.get("Instagram"):
                    insta_matches = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', html)
                    for insta in insta_matches:
                        clean_insta = insta.rstrip('.')
                        if not any(x in clean_insta.lower() for x in ['/p/', '/reel/', '/stories/', '/explore/', '/developer/']):
                            enriched["Instagram"] = clean_insta
                            break

                # 2. Extract Facebook Link
                if not enriched.get("Facebook"):
                    fb_matches = re.findall(r'https?://(?:www\.)?facebook\.com/[a-zA-Z0-9_.]+', html)
                    for fb in fb_matches:
                        clean_fb = fb.rstrip('.')
                        if not any(x in clean_fb.lower() for x in ['/sharer', '/share', '/dialog', '/policies']):
                            enriched["Facebook"] = clean_fb
                            break

                # 3. Extract Phone (if missing from Maps list)
                if not enriched.get("Telefone Maps"):
                    phone_match = re.search(r'\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}', html)
                    if phone_match:
                        enriched["Telefone Maps"] = phone_match.group(0).strip()

                # 4. Extract Website (if missing from Maps list)
                if not enriched.get("Site Oficial Maps"):
                    urls = re.findall(r'uddg=(https?%3A%2F%2F[^&"\']+)', raw_html)
                    for u in urls:
                        decoded = urllib.parse.unquote(u)
                        if not any(x in decoded.lower() for x in [
                            'instagram.com', 'facebook.com', 'google.com', 'youtube.com', 
                            'duckduckgo.com', 'tripadvisor.com', 'cnpj.biz', 'econodata.com', 'solutudo.com.br'
                        ]):
                            enriched["Site Oficial Maps"] = decoded
                            break

    except Exception as e:
        logger.warning(f"Search enrichment error for '{company_name}': {e}")

    # 5. If Website exists, do a quick HTTP GET to grab Email
    if enriched.get("Site Oficial Maps") and not enriched.get("Email"):
        try:
            async with session.get(
                enriched["Site Oficial Maps"],
                timeout=aiohttp.ClientTimeout(total=4),
                headers={"User-Agent": config.HTTP_USER_AGENT},
                ssl=False
            ) as site_resp:
                if site_resp.status == 200:
                    site_html = await site_resp.text(errors="replace")
                    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', site_html)
                    if email_match:
                        email = email_match.group(0)
                        if not email.endswith(('.png', '.jpg', '.gif', '.webp', '.svg')):
                            enriched["Email"] = email
        except Exception:
            pass

    return enriched


async def scrape_google_maps_streaming(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> AsyncGenerator[dict, None]:
    """Ultra-Fast Zero-Browser-Enrichment Streaming Scraper:
    
    1. Phase 1 (Playwright ~3s): Collects basic leads from Maps list and CLOSES BROWSER IMMEDIATELY.
    2. Emits all basic leads to UI (UI shows 20 cards in 3s).
    3. Phase 2 (100% HTTP Search ~1s): Enriches Instagram, Facebook, Phone & Website via lightweight HTTP requests.
    4. Emits lead_update events live in real-time. Zero RAM spike on Render!
    """
    logger.info(f"Iniciando busca ultra-rápida: '{query}' (máx: {max_results})")
    
    # Phase 1: Collect list with Playwright (closes browser immediately)
    feed_data = await collect_basic_leads_from_maps(query, max_results)
    
    if not feed_data:
        return

    # EMIT ALL BASIC LEADS IMMEDIATELY TO THE UI (3 SECONDS TOTAL UX!)
    for idx, item in enumerate(feed_data):
        yield {
            "_phase": "basic",
            "index": idx + 1,
            "data": item
        }

    # Phase 2: HTTP Search Enrichment (Zero Browser!)
    if mode != "simples":
        logger.info(f"[Phase 2 - HTTP] Enriquecendo {len(feed_data)} leads via busca leve...")
        
        sem = asyncio.Semaphore(5)  # 5 parallel HTTP searches
        
        async def enrich_worker(idx: int, item: dict, session: aiohttp.ClientSession):
            async with sem:
                enriched = await enrich_lead_via_http_search(item, query, session)
                return {
                    "_phase": "enriched",
                    "index": idx + 1,
                    "data": enriched
                }

        async with aiohttp.ClientSession() as session:
            tasks = [enrich_worker(i, item, session) for i, item in enumerate(feed_data)]
            for completed_task in asyncio.as_completed(tasks):
                res = await completed_task
                yield res

    logger.info("Scraping completo. Browser fechado há muito tempo!")


async def scrape_google_maps(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> list[dict]:
    """Non-streaming version: returns all enriched results."""
    results_map = {}
    async for payload in scrape_google_maps_streaming(
        query, max_results, min_rating,
        has_website_filter, has_phone_filter, mode
    ):
        data = payload.get("data", {})
        idx = payload.get("index", 1)
        results_map[idx] = data
    return list(results_map.values())
