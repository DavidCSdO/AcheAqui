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


async def _extract_from_detail_page(page) -> dict:
    """Extract ALL available data from the currently loaded Google Maps detail page.
    
    Uses multiple selector strategies for each field to handle Google's varying DOM.
    """
    info = {
        "Nome": "",
        "Nota Google": "",
        "Avaliações": "",
        "Categoria": "",
        "Endereço": "",
        "Telefone Maps": "",
        "Site Oficial Maps": "",
        "Google Maps URL": page.url
    }
    
    # === NAME ===
    for selector in ["h1.DUwDvf", "h1", "[data-attrid='title']"]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = (await el.text_content() or "").strip()
                if text:
                    info["Nome"] = text
                    break
        except Exception:
            pass

    # === RATING ===
    for selector in [
        "div.F7nice span[aria-hidden='true']",
        "div.F7L82c span.ceA1da",
        "span.ceNzKf[aria-label]",
        "span[aria-label*='estrela']",
        "div.fontDisplayLarge"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = await el.get_attribute("aria-label") or await el.text_content() or ""
                match = re.search(r"(\d[.,]\d)", text)
                if match:
                    info["Nota Google"] = match.group(1).replace(",", ".")
                    break
        except Exception:
            pass

    # === REVIEWS COUNT ===
    for selector in [
        "div.F7nice span[aria-label*='avaliação']",
        "span[aria-label*='avaliações']",
        "button[aria-label*='avaliação']",
        "button[jsaction*='reviews'] span"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = await el.get_attribute("aria-label") or await el.text_content() or ""
                rev_match = re.search(r"([\d\.\s,]+)", text)
                if rev_match:
                    cleaned = rev_match.group(1).replace(".", "").replace(",", "").replace(" ", "").strip()
                    if cleaned.isdigit() and int(cleaned) > 0:
                        info["Avaliações"] = cleaned
                        break
        except Exception:
            pass

    # === CATEGORY ===
    for selector in [
        "button[jsaction*='category']",
        "button[jsaction*='pane.rating.category']",
        ".DkEaL",
        "span.DkEaL"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = (await el.text_content() or "").strip()
                if text and len(text) < 80:
                    info["Categoria"] = text
                    break
        except Exception:
            pass

    # === ADDRESS ===
    for selector in [
        "button[data-item-id='address']",
        "button[data-item-id='oloc']",
        "[data-item-id='address'] .fontBodyMedium",
        "button[aria-label*='Endereço']",
        "button[aria-label*='endereço']"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = await el.get_attribute("aria-label") or await el.text_content() or ""
                cleaned = text.replace("Endereço:", "").replace("endereço:", "").strip()
                if cleaned and len(cleaned) > 3:
                    info["Endereço"] = cleaned
                    break
        except Exception:
            pass

    # === PHONE ===
    for selector in [
        "button[data-item-id*='phone']",
        "button[data-item-id*='tel:']",
        "button[aria-label*='Telefone']",
        "button[aria-label*='telefone']",
        "a[data-item-id*='phone']",
        "a[href^='tel:']"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                text = await el.get_attribute("aria-label") or await el.text_content() or ""
                cleaned = text.replace("Telefone:", "").replace("telefone:", "").strip()
                # Extract just the phone number
                phone_match = re.search(r'[\(\+]?[\d\s\(\)\-\.]{8,}', cleaned)
                if phone_match:
                    info["Telefone Maps"] = phone_match.group(0).strip()
                    break
        except Exception:
            pass

    # === WEBSITE ===
    for selector in [
        "a[data-item-id='authority']",
        "a[data-item-id*='authority']",
        "a[aria-label*='site']",
        "a[aria-label*='Site']",
        "a[aria-label*='Website']"
    ]:
        try:
            el = page.locator(selector).first
            if await el.count() > 0:
                href = await el.get_attribute("href")
                if href and href.startswith("http") and "google" not in href:
                    info["Site Oficial Maps"] = href
                    break
        except Exception:
            pass

    return info


async def _extract_feed_item_data(page, index: int) -> dict:
    """Extract data from a single feed item card in the Google Maps list view.
    
    This extracts basic data directly from the list without clicking into details.
    """
    info = {
        "Nome": "",
        "Nota Google": "",
        "Avaliações": "",
        "Categoria": "",
        "Endereço": "",
        "Telefone Maps": "",
        "Site Oficial Maps": "",
        "Google Maps URL": ""
    }
    
    try:
        # Each feed item is inside a div with role='article' or similar
        # Get the link first
        links = page.locator("a[href*='/maps/place/']")
        if index >= await links.count():
            return info
        
        link = links.nth(index)
        info["Google Maps URL"] = await link.get_attribute("href") or ""
        info["Nome"] = await link.get_attribute("aria-label") or ""
        
        # Try to get the parent card container
        # The card text usually contains: rating, reviews, category, address, price
        try:
            # Navigate up to the containing card
            card = link.locator("xpath=ancestor::div[contains(@class, 'Nv2PK')]")
            if await card.count() == 0:
                card = link.locator("xpath=ancestor::div[contains(@jsaction, 'mouseover')]")
            
            if await card.count() > 0:
                card_text = await card.text_content() or ""
                
                # Extract rating (e.g., "4,7" or "4.7")
                rating_match = re.search(r'(\d[.,]\d)\s*\(', card_text)
                if rating_match:
                    info["Nota Google"] = rating_match.group(1).replace(",", ".")
                
                # Extract reviews count (e.g., "(149)")
                reviews_match = re.search(r'\((\d[\d\.\s]*)\)', card_text)
                if reviews_match:
                    info["Avaliações"] = reviews_match.group(1).replace(".", "").replace(" ", "").strip()
                
                # Try to get individual elements within the card
                # Category is often in a span after the reviews
                try:
                    cat_spans = card.locator("span").all()
                    spans = await cat_spans
                    for span in spans:
                        span_text = (await span.text_content() or "").strip()
                        # Category is usually a short text like "Academia", "Restaurante"
                        if (span_text and 2 < len(span_text) < 40 
                            and not re.match(r'^[\d.,()]+$', span_text)
                            and '·' not in span_text
                            and span_text != info["Nome"]
                            and not span_text.startswith("Aberto")
                            and not span_text.startswith("Fechado")):
                            # Check if it looks like a category (no numbers, not an address)
                            if not re.search(r'\d{3,}', span_text) and ',' not in span_text:
                                if not info["Categoria"]:
                                    info["Categoria"] = span_text
                except Exception:
                    pass
                    
                # Address: often contains comma and numbers
                addr_match = re.search(r'·\s*([^·]*(?:R\.|Rua|Av\.|Avenida|Praça|Al\.|Alameda|Trav\.)[^·]+)', card_text)
                if addr_match:
                    info["Endereço"] = addr_match.group(1).strip()
        except Exception:
            pass
    
    except Exception:
        pass
    
    return info


async def scrape_google_maps_streaming(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> AsyncGenerator[dict, None]:
    """Streaming scraper: yields enriched place data one at a time.
    
    Strategy (inspired by Apify):
    1. Scroll Google Maps feed to collect results
    2. Extract basic data from each feed card (name, rating, category, address)
    3. Navigate the SAME page to each detail URL for complete data (phone, website)
    4. Yield each lead as it's ready (SSE streaming)
    5. Close browser at the end
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
            
            # Block images and media to save memory (keep CSS for proper rendering)
            async def route_intercept(route):
                if route.request.resource_type in ["image", "font", "media"]:
                    await route.abort()
                else:
                    await route.continue_()
            await context.route("**/*", route_intercept)
            
            page = await context.new_page()
            
            try:
                # === PHASE 1: Scroll and collect list data ===
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

                # Extract basic data from feed items
                total_items = await page.locator("a[href*='/maps/place/']").count()
                items_count = min(total_items, max_results)
                
                feed_data = []
                for i in range(items_count):
                    item_data = await _extract_feed_item_data(page, i)
                    if item_data["Google Maps URL"]:
                        feed_data.append(item_data)
                
                logger.info(f"[Phase 1] {len(feed_data)} itens extraídos da lista.")

                # === PHASE 2: Navigate to each detail for complete data ===
                if mode == "simples":
                    for item in feed_data:
                        yield item
                else:
                    for item in feed_data:
                        detail_url = item["Google Maps URL"]
                        if not detail_url.startswith("http"):
                            detail_url = f"https://www.google.com{detail_url}"
                        
                        try:
                            await page.goto(detail_url, wait_until="domcontentloaded", timeout=15000)
                            await page.wait_for_timeout(2000)
                            
                            detail_data = await _extract_from_detail_page(page)
                            
                            # Merge: detail data takes priority, but keep feed data as fallback
                            merged = {}
                            for key in item:
                                feed_val = item.get(key, "")
                                detail_val = detail_data.get(key, "")
                                merged[key] = detail_val if detail_val else feed_val
                            
                        except Exception as e:
                            logger.warning(f"Erro ao navegar para '{item.get('Nome')}': {e}")
                            merged = item
                        
                        # Apply filters
                        skip = False
                        if min_rating > 0:
                            try:
                                rating_val = float(merged.get("Nota Google", 0) or 0)
                                if rating_val < min_rating:
                                    skip = True
                            except ValueError:
                                pass
                        if has_website_filter and not merged.get("Site Oficial Maps"):
                            skip = True
                        if has_phone_filter and not merged.get("Telefone Maps"):
                            skip = True
                        
                        if not skip:
                            async with aiohttp.ClientSession() as session:
                                # First try official website if available
                                if merged.get("Site Oficial Maps"):
                                    try:
                                        async with session.get(
                                            merged["Site Oficial Maps"],
                                            timeout=aiohttp.ClientTimeout(total=5),
                                            headers={"User-Agent": config.HTTP_USER_AGENT},
                                            ssl=False,
                                            allow_redirects=True
                                        ) as resp:
                                            if resp.status == 200:
                                                site_html = await resp.text(errors="replace")
                                                # Instagram
                                                insta_match = re.search(
                                                    r'href=[\'\"](https?://(?:www\.)?instagram\.com/[^\'\"\s?#]+)',
                                                    site_html
                                                )
                                                if insta_match:
                                                    merged["Instagram"] = insta_match.group(1)
                                                # Facebook
                                                fb_match = re.search(
                                                    r'href=[\'\"](https?://(?:www\.)?facebook\.com/[^\'\"\s?#]+)',
                                                    site_html
                                                )
                                                if fb_match:
                                                    merged["Facebook"] = fb_match.group(1)
                                                # Email
                                                email_match = re.search(
                                                    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
                                                    site_html
                                                )
                                                if email_match:
                                                    email = email_match.group(0)
                                                    if not email.endswith(('.png', '.jpg', '.gif', '.webp', '.svg')):
                                                        merged["Email"] = email
                                    except Exception:
                                        pass
                                
                                # Instant Search Fallback if Instagram/Facebook still missing
                                if not merged.get("Instagram") and merged.get("Nome"):
                                    try:
                                        search_term = f"{merged['Nome']} {query} instagram"
                                        search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(search_term)}"
                                        async with session.get(
                                            search_url,
                                            timeout=aiohttp.ClientTimeout(total=4),
                                            headers={"User-Agent": config.HTTP_USER_AGENT}
                                        ) as search_resp:
                                            if search_resp.status == 200:
                                                s_html = await search_resp.text(errors="replace")
                                                unquoted_s = urllib.parse.unquote(s_html)
                                                
                                                insta_matches = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', unquoted_s)
                                                for insta in insta_matches:
                                                    clean_insta = insta.rstrip('.')
                                                    if not any(x in clean_insta.lower() for x in ['/p/', '/reel/', '/stories/', '/explore/']):
                                                        merged["Instagram"] = clean_insta
                                                        break
                                                        
                                                if not merged.get("Facebook"):
                                                    fb_matches = re.findall(r'https?://(?:www\.)?facebook\.com/[a-zA-Z0-9_.]+', unquoted_s)
                                                    for fb in fb_matches:
                                                        clean_fb = fb.rstrip('.')
                                                        if not any(x in clean_fb.lower() for x in ['/sharer', '/share', '/dialog']):
                                                            merged["Facebook"] = clean_fb
                                                            break
                                    except Exception:
                                        pass
                            
                            yield merged
                
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
