import asyncio
import urllib.parse
import re
import aiohttp
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config
from src.utils import setup_logger

logger = setup_logger(config.LOG_FILE)


async def collect_places_list(query: str, max_results: int = 15) -> list[dict]:
    """Phase 1: Use a single Playwright page to scroll Google Maps and collect place links.
    
    Opens ONE browser page, scrolls to collect results, then CLOSES the browser
    immediately — freeing all memory before returning.
    
    Returns a list of dicts with basic info: name, href (Google Maps URL).
    """
    from playwright.async_api import async_playwright
    
    logger.info(f"[Phase 1] Coletando lista do Google Maps: '{query}' (máx: {max_results})")
    
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.google.com/maps/search/{encoded_query}?hl=pt-BR"
    
    place_links = []
    
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
                    "--disable-background-timer-throttling",
                    "--disable-backgrounding-occluded-windows",
                    "--disable-renderer-backgrounding",
                    "--js-flags=--max-old-space-size=128"
                ]
            )
            
            context = await browser.new_context(
                user_agent=config.HTTP_USER_AGENT,
                viewport={"width": 1280, "height": 720}
            )
            
            # Block heavy resources to save memory
            async def route_intercept(route):
                if route.request.resource_type in ["image", "stylesheet", "font", "media", "other"]:
                    await route.abort()
                else:
                    await route.continue_()
            await context.route("**/*", route_intercept)
            
            page = await context.new_page()
            
            try:
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

                # Wait for feed
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

                # Collect links
                items = page.locator("a[href*='/maps/place/']")
                total_items = await items.count()
                
                for i in range(min(total_items, max_results)):
                    href = await items.nth(i).get_attribute("href")
                    aria_label = await items.nth(i).get_attribute("aria-label")
                    if href and href not in [p["href"] for p in place_links]:
                        place_links.append({"href": href, "name": aria_label or ""})
                
            finally:
                await page.close()
            
            # CRITICAL: Close browser immediately to free memory
            await browser.close()
            logger.info(f"[Phase 1] Browser fechado. {len(place_links)} locais coletados.")
    
    except Exception as e:
        logger.error(f"[Phase 1] Erro na coleta: {e}")
    
    return place_links


async def enrich_place_via_http(
    session: aiohttp.ClientSession, 
    place: dict,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False
) -> dict | None:
    """Phase 2: Enrich a single place's details via HTTP request (no browser).
    
    Fetches the Google Maps place page via HTTP and parses embedded data
    from the HTML response using regex patterns.
    """
    name = place.get("name", "")
    href = place.get("href", "")
    
    place_info = {
        "Nome": name,
        "Google Maps URL": href,
        "Nota Google": "",
        "Avaliações": "",
        "Categoria": "",
        "Endereço": "",
        "Telefone Maps": "",
        "Site Oficial Maps": ""
    }
    
    full_url = href if href.startswith("http") else f"https://www.google.com{href}"
    
    try:
        async with session.get(
            full_url,
            timeout=aiohttp.ClientTimeout(total=config.DETAIL_TIMEOUT_SEC),
            headers={
                "User-Agent": config.HTTP_USER_AGENT,
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            allow_redirects=True
        ) as response:
            if response.status != 200:
                logger.warning(f"HTTP {response.status} for {name}")
                return place_info
                
            html = await response.text(errors="replace")
            
            # Parse rating from HTML
            rating_match = re.search(r'(\d[.,]\d)\s*estrelas?', html)
            if not rating_match:
                rating_match = re.search(r'"averageRating":\s*(\d[.,]\d)', html)
            if not rating_match:
                # Try aria-label pattern
                rating_match = re.search(r'(\d[.,]\d) de 5', html)
            if rating_match:
                place_info["Nota Google"] = rating_match.group(1).replace(",", ".")
            
            # Parse reviews count
            reviews_match = re.search(r'([\d.]+)\s*avaliaç(?:ão|ões)', html, re.IGNORECASE)
            if not reviews_match:
                reviews_match = re.search(r'"userRatingCount":\s*(\d+)', html)
            if reviews_match:
                place_info["Avaliações"] = reviews_match.group(1).replace(".", "").strip()
            
            # Parse category
            cat_match = re.search(r'"categoryName":\s*"([^"]+)"', html)
            if cat_match:
                place_info["Categoria"] = cat_match.group(1)
            
            # Parse address
            addr_match = re.search(r'"addressLines":\s*\["([^"]+)"', html)
            if not addr_match:
                addr_match = re.search(r'Endereço:\s*([^"<]+)', html)
            if addr_match:
                place_info["Endereço"] = addr_match.group(1).strip()
            
            # Parse phone
            phone_match = re.search(r'"phoneNumber":\s*"([^"]+)"', html)
            if not phone_match:
                phone_match = re.search(r'Telefone:\s*([^"<]+)', html)
            if not phone_match:
                # Try to find phone in tel: links
                phone_match = re.search(r'tel:(\+?\d[\d\s\-().]+)', html)
            if phone_match:
                place_info["Telefone Maps"] = phone_match.group(1).strip()
            
            # Parse website
            site_match = re.search(r'"websiteUrl":\s*"([^"]+)"', html)
            if not site_match:
                site_match = re.search(r'"website":\s*"(https?://[^"]+)"', html)
            if site_match:
                place_info["Site Oficial Maps"] = site_match.group(1)
    
    except asyncio.TimeoutError:
        logger.warning(f"Timeout fetching details for: {name}")
    except Exception as e:
        logger.warning(f"Error fetching details for {name}: {e}")
    
    # Apply filters
    if min_rating > 0:
        try:
            rating_val = float(place_info.get("Nota Google", 0) or 0)
            if rating_val < min_rating:
                return None
        except ValueError:
            pass

    if has_website_filter and not place_info.get("Site Oficial Maps"):
        return None

    if has_phone_filter and not place_info.get("Telefone Maps"):
        return None
    
    return place_info


async def scrape_google_maps_streaming(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
):
    """Generator that yields enriched place data one at a time.
    
    Used for SSE streaming — each place is yielded as soon as it's ready.
    """
    # Phase 1: Collect the list (uses Playwright briefly, then frees it)
    place_links = await collect_places_list(query, max_results)
    
    if not place_links:
        return
    
    logger.info(f"[Phase 2] Enriquecendo {len(place_links)} locais via HTTP...")
    
    # Phase 2: Enrich one by one via HTTP (zero browser memory)
    async with aiohttp.ClientSession() as session:
        for place in place_links:
            if mode == "simples":
                # Return basic info without enrichment
                yield {
                    "Nome": place.get("name", ""),
                    "Google Maps URL": place.get("href", ""),
                    "Nota Google": "",
                    "Avaliações": "",
                    "Categoria": "",
                    "Endereço": "",
                    "Telefone Maps": "",
                    "Site Oficial Maps": ""
                }
            else:
                enriched = await enrich_place_via_http(
                    session, place,
                    min_rating=min_rating,
                    has_website_filter=has_website_filter,
                    has_phone_filter=has_phone_filter
                )
                if enriched is not None:
                    # For "direcionada" mode: also try to grab Instagram from site
                    if mode == "direcionada" and enriched.get("Site Oficial Maps"):
                        try:
                            async with session.get(
                                enriched["Site Oficial Maps"],
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
                                        enriched["Instagram"] = insta_match.group(1)
                        except Exception:
                            pass
                    
                    yield enriched


async def scrape_google_maps(
    query: str,
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> list[dict]:
    """Non-streaming version: collects all results and returns them as a list.
    
    Kept for backward compatibility with the POST /api/scrape endpoint.
    """
    results = []
    async for place in scrape_google_maps_streaming(
        query, max_results, min_rating,
        has_website_filter, has_phone_filter, mode
    ):
        results.append(place)
    return results
