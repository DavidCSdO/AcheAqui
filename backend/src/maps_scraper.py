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


async def _extract_feed_item_data(page, index: int, is_single_place: bool = False) -> dict:
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
        if not is_single_place:
            await page.locator(f"a[href*='/maps/place/']").nth(index).click(timeout=5000)
            await page.wait_for_timeout(2000)
    except Exception:
        pass
    
    try:
        if is_single_place:
            info["Google Maps URL"] = page.url
            title_elem = page.locator("h1").first
            info["Nome"] = await title_elem.inner_text() if await title_elem.is_visible() else ""
            
            # Extract from the open details panel
            try:
                # Rating
                rating_elem = page.locator("div.F7nice > span > span[aria-hidden='true']").first
                if await rating_elem.is_visible():
                    info["Nota Google"] = (await rating_elem.inner_text()).replace(",", ".")
                
                # Reviews
                reviews_elem = page.locator("button[aria-label*='avaliaç']").first
                if await reviews_elem.is_visible():
                    rev_text = await reviews_elem.inner_text()
                    rev_match = re.search(r'([\d\.\s]+)', rev_text)
                    if rev_match:
                        info["Avaliações"] = rev_match.group(1).replace(".", "").replace(" ", "").strip()
                
                # Category
                cat_elem = page.locator("button[jsaction*='pane.rating.category']").first
                if await cat_elem.is_visible():
                    info["Categoria"] = await cat_elem.inner_text()
                
                # Address
                addr_elem = page.locator("button[data-item-id='address']").first
                if await addr_elem.is_visible():
                    addr_text = await addr_elem.get_attribute("aria-label") or ""
                    info["Endereço"] = addr_text.replace("Endereço: ", "").strip()
                
                # Phone
                phone_elem = page.locator("button[data-item-id^='phone:']").first
                if await phone_elem.is_visible():
                    phone_text = await phone_elem.get_attribute("aria-label") or ""
                    info["Telefone Maps"] = phone_text.replace("Telefone: ", "").strip()
                    
                # Website
                web_elem = page.locator("a[data-item-id='authority']").first
                if await web_elem.is_visible():
                    info["Site Oficial Maps"] = await web_elem.get_attribute("href") or ""
            except Exception:
                pass

        else:
            links = page.locator("a[href*='/maps/place/']")
            if index >= await links.count():
                return info
            
            link = links.nth(index)
            info["Google Maps URL"] = await link.get_attribute("href") or ""
            info["Nome"] = await link.get_attribute("aria-label") or ""
            
            try:
                card = link.locator("xpath=ancestor::div[contains(@class, 'Nv2PK')]")
                if await card.count() == 0:
                    card = page.locator(f".Nv2PK >> nth={index}")
                
                # Logic for card extraction
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
                    
                addr_match = re.search(r'·\s*([^·]*(?:R\.|Rua|Av\.|Avenida|Praça|Al\.|Alameda|Trav\.)[^·]+)', card_text)
                if addr_match:
                    info["Endereço"] = addr_match.group(1).strip()
            except Exception:
                pass
    
    except Exception:
        pass
    
    return info


async def _collect_basic_leads_from_maps_async(query: str, max_results: int = 15) -> list[dict]:
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
                    "--disable-software-rasterizer",
                    "--disable-extensions"
                ]
            )
            
            context = await browser.new_context(
                user_agent=config.HTTP_USER_AGENT,
                viewport={"width": 1280, "height": 720}
            )
            
            async def route_intercept(route):
                if route.request.resource_type in ["image", "media", "font"]:
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

                # If no feed, check if it redirected to a single place page
                if await page.locator("a[href*='/maps/place/']").count() == 0:
                    # Maybe it's already a single place
                    title_elem = page.locator("h1").first
                    if await title_elem.is_visible():
                        # Extract data for the single place
                        item_data = await _extract_feed_item_data(page, 0, is_single_place=True)
                        if item_data["Nome"] or item_data["Google Maps URL"]:
                            feed_data.append(item_data)
                        
                        # Cleanup and return
                        await page.close()
                        await browser.close()
                        logger.info(f"[Phase 1 Concluída] Navegador FECHADO. 1 lead básico na memória (Redirecionamento direto).")
                        return feed_data

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
                        
                final_items = page.locator("a[href*='/maps/place/']")
                final_count = await final_items.count()
                limit = min(final_count, max_results)
                
                for i in range(limit):
                    item_data = await _extract_feed_item_data(page, i)
                    if item_data["Nome"] or item_data["Google Maps URL"]:
                        feed_data.append(item_data)
                        
            except Exception as e:
                logger.error(f"[Phase 1] Map Collection Error: {e}")
            finally:
                await page.close()
            
            # CRITICAL: Close browser immediately
            await browser.close()
            logger.info(f"[Phase 1 Concluída] Navegador FECHADO. {len(feed_data)} leads básicos na memória.")
    
    except Exception as e:
        logger.error(f"Erro na Phase 1 (Maps list): {e}")
        
    return feed_data


async def collect_basic_leads_from_maps(query: str, max_results: int = 15) -> list[dict]:
    """Wraps the async Playwright scraper in a dedicated thread and Proactor event loop to prevent Uvicorn Windows bugs."""
    def _run_in_new_loop():
        if sys.platform == 'win32':
            loop = asyncio.WindowsProactorEventLoopPolicy().new_event_loop()
        else:
            loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(_collect_basic_leads_from_maps_async(query, max_results))
        finally:
            loop.close()
            
    return await asyncio.to_thread(_run_in_new_loop)


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
    search_url = "https://www.bing.com/search"
    
    try:
        async with session.get(
            search_url,
            params={"q": search_term},
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

                # 3. Extract Website (if missing from Maps list)
                if not enriched.get("Site Oficial Maps"):
                    urls = re.findall(r'href="(https?://[^"]+)"', raw_html)
                    for u in urls:
                        decoded = urllib.parse.unquote(u)
                        if not any(x in decoded.lower() for x in [
                            'instagram.com', 'facebook.com', 'google.com', 'youtube.com', 'bing.com', 'microsoft.com',
                            'duckduckgo.com', 'tripadvisor.com', 'cnpj.biz', 'econodata.com', 'solutudo.com.br', 'casadosdados.com.br'
                        ]):
                            enriched["Site Oficial Maps"] = decoded
                            break

    except Exception as e:
        logger.warning(f"Search enrichment error for '{company_name}': {e}")

    # 5. If Website exists, do a quick HTTP GET to grab Email and Phone
    if enriched.get("Site Oficial Maps") and (not enriched.get("Email") or not enriched.get("Telefone Maps")):
        try:
            async with session.get(
                enriched["Site Oficial Maps"],
                timeout=aiohttp.ClientTimeout(total=4),
                headers={"User-Agent": config.HTTP_USER_AGENT},
                ssl=False
            ) as site_resp:
                if site_resp.status == 200:
                    site_html = await site_resp.text(errors="replace")
                    
                    if not enriched.get("Email"):
                        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', site_html)
                        if email_match:
                            email = email_match.group(0)
                            if not email.endswith(('.png', '.jpg', '.gif', '.webp', '.svg')):
                                enriched["Email"] = email
                                
                    if not enriched.get("Telefone Maps"):
                        # Look for a typical Brazilian phone format, requiring some boundary or formatting to avoid false positives
                        phone_match = re.search(r'(?:\+?55\s?)?(?:\(?0?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-\s]?\d{4}', site_html)
                        if phone_match:
                            enriched["Telefone Maps"] = phone_match.group(0).strip()
                            
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
        
        sem = asyncio.Semaphore(15)  # 15 parallel HTTP searches
        
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
