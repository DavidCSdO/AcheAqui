import asyncio
import urllib.parse
import re
import aiohttp
import sys
import os
import json
from typing import AsyncGenerator

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config
from src.utils import setup_logger

logger = setup_logger(config.LOG_FILE)


async def _extract_detail_from_page(page, place_info: dict) -> dict:
    """Extract business details from the currently loaded Google Maps detail page."""
    
    # Name
    if not place_info["Nome"]:
        try:
            h1 = page.locator("h1").first
            if await h1.count() > 0:
                place_info["Nome"] = (await h1.text_content()).strip()
        except Exception:
            pass

    # Rating
    try:
        rating_elem = page.locator("div.F7L82c span.ceA1da, span[aria-label*='estrelas']").first
        if await rating_elem.count() > 0:
            aria = await rating_elem.get_attribute("aria-label") or await rating_elem.text_content()
            match = re.search(r"(\d+[.,]\d+)", aria)
            if match:
                place_info["Nota Google"] = match.group(1).replace(",", ".")
    except Exception:
        pass
    
    # Reviews count
    try:
        reviews_elem = page.locator("button[aria-label*='avaliações'], span[aria-label*='avaliações']").first
        if await reviews_elem.count() > 0:
            aria_rev = await reviews_elem.get_attribute("aria-label") or await reviews_elem.text_content()
            rev_match = re.search(r"([\d\.\s]+)\s*avaliaç", aria_rev, re.IGNORECASE)
            if rev_match:
                place_info["Avaliações"] = rev_match.group(1).replace(".", "").strip()
    except Exception:
        pass

    # Category
    try:
        cat_elem = page.locator("button[jsaction*='category']").first
        if await cat_elem.count() > 0:
            place_info["Categoria"] = (await cat_elem.text_content()).strip()
    except Exception:
        pass

    # Address
    try:
        addr_btn = page.locator("button[data-item-id='address']").first
        if await addr_btn.count() > 0:
            aria_addr = await addr_btn.get_attribute("aria-label") or await addr_btn.text_content()
            place_info["Endereço"] = aria_addr.replace("Endereço:", "").strip()
    except Exception:
        pass

    # Phone
    try:
        phone_btn = page.locator("button[data-item-id*='phone']").first
        if await phone_btn.count() > 0:
            aria_phone = await phone_btn.get_attribute("aria-label") or await phone_btn.text_content()
            place_info["Telefone Maps"] = aria_phone.replace("Telefone:", "").strip()
    except Exception:
        pass

    # Website
    try:
        site_link = page.locator("a[data-item-id='authority']").first
        if await site_link.count() > 0:
            site_url = await site_link.get_attribute("href")
            if site_url:
                place_info["Site Oficial Maps"] = site_url
    except Exception:
        pass

    return place_info


async def scrape_google_maps_streaming(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> AsyncGenerator[dict, None]:
    """Streaming scraper: yields enriched place data one at a time.
    
    Uses a SINGLE Playwright page throughout:
    1. Scroll the search results to collect links
    2. Navigate the SAME page to each detail URL (no new tabs)
    3. Extract data and yield each lead
    4. Close browser only after all leads are processed
    
    Memory usage: ~200MB constant (one page), never spikes.
    """
    from playwright.async_api import async_playwright
    
    logger.info(f"Busca streaming: '{query}' (máx: {max_results}, modo: {mode})")
    
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.google.com/maps/search/{encoded_query}?hl=pt-BR"
    
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
            
            # Block heavy resources to save memory
            async def route_intercept(route):
                if route.request.resource_type in ["image", "stylesheet", "font", "media"]:
                    await route.abort()
                else:
                    await route.continue_()
            await context.route("**/*", route_intercept)
            
            page = await context.new_page()
            
            try:
                # === PHASE 1: Collect the list ===
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(3000)
                
                # Dismiss cookie consent
                try:
                    reject_btn = page.locator("button:has-text('Rejeitar tudo'), button:has-text('Reject all')").first
                    if await reject_btn.is_visible():
                        await reject_btn.click()
                        await page.wait_for_timeout(1000)
                except Exception:
                    pass

                feed_selector = "div[role='feed']"
                try:
                    await page.wait_for_selector(feed_selector, timeout=10000)
                except Exception:
                    pass

                # Scroll to collect results
                prev_count = 0
                scroll_attempts = 0
                max_scroll_attempts = 15

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
                        
                    await page.wait_for_timeout(int(config.MAPS_SCROLL_DELAY_SEC * 1000))
                    
                    end_of_list = await page.locator("text='Você chegou ao fim da lista'").count() > 0
                    if end_of_list:
                        break

                # Collect all links
                items = page.locator("a[href*='/maps/place/']")
                total_items = await items.count()
                
                place_links = []
                for i in range(min(total_items, max_results)):
                    href = await items.nth(i).get_attribute("href")
                    aria_label = await items.nth(i).get_attribute("aria-label")
                    if href and href not in [pl["href"] for pl in place_links]:
                        place_links.append({"href": href, "name": aria_label or ""})
                
                logger.info(f"[Phase 1] {len(place_links)} locais coletados. Iniciando enriquecimento...")

                # === PHASE 2: Enrich each place using the SAME page ===
                if mode == "simples":
                    # Simple mode: just return basic info, no detail navigation
                    for pl in place_links:
                        yield {
                            "Nome": pl.get("name", ""),
                            "Google Maps URL": pl.get("href", ""),
                            "Nota Google": "",
                            "Avaliações": "",
                            "Categoria": "",
                            "Endereço": "",
                            "Telefone Maps": "",
                            "Site Oficial Maps": ""
                        }
                else:
                    # Direcionada/Completa: navigate to each detail page
                    for pl in place_links:
                        place_info = {
                            "Nome": pl.get("name", ""),
                            "Google Maps URL": pl.get("href", ""),
                            "Nota Google": "",
                            "Avaliações": "",
                            "Categoria": "",
                            "Endereço": "",
                            "Telefone Maps": "",
                            "Site Oficial Maps": ""
                        }
                        
                        detail_url = pl["href"] if pl["href"].startswith("http") else f"https://www.google.com{pl['href']}"
                        
                        try:
                            await page.goto(detail_url, wait_until="domcontentloaded", timeout=15000)
                            await page.wait_for_timeout(1500)
                            
                            place_info = await _extract_detail_from_page(page, place_info)
                        except Exception as e:
                            logger.warning(f"Erro ao navegar para detalhe de '{pl.get('name')}': {e}")
                        
                        # Apply filters
                        skip = False
                        if min_rating > 0:
                            try:
                                rating_val = float(place_info.get("Nota Google", 0) or 0)
                                if rating_val < min_rating:
                                    skip = True
                            except ValueError:
                                pass
                        if has_website_filter and not place_info.get("Site Oficial Maps"):
                            skip = True
                        if has_phone_filter and not place_info.get("Telefone Maps"):
                            skip = True
                        
                        if not skip:
                            # For "direcionada": also try to grab Instagram from site via HTTP
                            if mode == "direcionada" and place_info.get("Site Oficial Maps"):
                                try:
                                    async with aiohttp.ClientSession() as session:
                                        async with session.get(
                                            place_info["Site Oficial Maps"],
                                            timeout=aiohttp.ClientTimeout(total=5),
                                            headers={"User-Agent": config.HTTP_USER_AGENT},
                                            ssl=False
                                        ) as resp:
                                            if resp.status == 200:
                                                site_html = await resp.text(errors="replace")
                                                insta_match = re.search(
                                                    r'href=[\'\"](https?://(?:www\.)?instagram\.com/[^\'\"]+)[\'"]',
                                                    site_html
                                                )
                                                if insta_match:
                                                    place_info["Instagram"] = insta_match.group(1)
                                except Exception:
                                    pass
                            
                            yield place_info
                
            finally:
                await page.close()
            
            await browser.close()
            logger.info("Browser fechado. Scraping completo.")
    
    except Exception as e:
        logger.error(f"Erro fatal no scraper: {e}")


async def scrape_google_maps(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> list[dict]:
    """Non-streaming version: collects all results and returns them as a list."""
    results = []
    async for place in scrape_google_maps_streaming(
        query, max_results, min_rating,
        has_website_filter, has_phone_filter, mode
    ):
        results.append(place)
    return results
