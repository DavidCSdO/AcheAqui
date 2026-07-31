import asyncio
import urllib.parse
import re
from playwright.async_api import BrowserContext, Page
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config
from src.utils import setup_logger

logger = setup_logger(config.LOG_FILE)

async def scrape_google_maps(
    context: BrowserContext, 
    query: str, 
    max_results: int = 15,
    min_rating: float = 0.0,
    has_website_filter: bool = False,
    has_phone_filter: bool = False,
    mode: str = "direcionada"
) -> list[dict]:
    logger.info(f"Iniciando busca no Google Maps para: '{query}' (máx: {max_results})")
    
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.google.com/maps/search/{encoded_query}?hl=pt-BR"
    
    page: Page = await context.new_page()
    places_data = []
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        
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

        prev_count = 0
        scroll_attempts = 0
        max_scroll_attempts = 20

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

        items = page.locator("a[href*='/maps/place/']")
        total_items = await items.count()
        
        place_links = []
        for i in range(total_items):
            if len(place_links) >= max_results:
                break
            href = await items.nth(i).get_attribute("href")
            aria_label = await items.nth(i).get_attribute("aria-label")
            if href and href not in [p["href"] for p in place_links]:
                place_links.append({"href": href, "name": aria_label or ""})

        sem = asyncio.Semaphore(10)
        
        async def extract_detail(item):
            async with sem:
                name = item["name"]
                href = item["href"]
                
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
                
                if mode == "simples":
                    return place_info
                
                try:
                    full_url = href if href.startswith("http") else f"https://www.google.com{href}"
                    detail_page = await context.new_page()
                    await detail_page.goto(full_url, wait_until="domcontentloaded", timeout=15000)
                    
                    if not place_info["Nome"]:
                        h1 = detail_page.locator("h1").first
                        if await h1.count() > 0:
                            place_info["Nome"] = (await h1.text_content()).strip()

                    try:
                        rating_elem = detail_page.locator("div.F7L82c span.ceA1da, span[aria-label*='estrelas']").first
                        if await rating_elem.count() > 0:
                            aria = await rating_elem.get_attribute("aria-label") or await rating_elem.text_content()
                            match = re.search(r"(\d+[.,]\d+)", aria)
                            if match:
                                place_info["Nota Google"] = match.group(1).replace(",", ".")
                                
                        reviews_elem = detail_page.locator("button[aria-label*='avaliações'], span[aria-label*='avaliações']").first
                        if await reviews_elem.count() > 0:
                            aria_rev = await reviews_elem.get_attribute("aria-label") or await reviews_elem.text_content()
                            rev_match = re.search(r"([\d\.\s]+)\s*avaliaç", aria_rev, re.IGNORECASE)
                            if rev_match:
                                place_info["Avaliações"] = rev_match.group(1).replace(".", "").strip()
                    except Exception:
                        pass

                    try:
                        cat_elem = detail_page.locator("button[jsaction*='category']").first
                        if await cat_elem.count() > 0:
                            place_info["Categoria"] = (await cat_elem.text_content()).strip()
                    except Exception:
                        pass

                    try:
                        addr_btn = detail_page.locator("button[data-item-id='address']").first
                        if await addr_btn.count() > 0:
                            aria_addr = await addr_btn.get_attribute("aria-label") or await addr_btn.text_content()
                            place_info["Endereço"] = aria_addr.replace("Endereço:", "").strip()
                    except Exception:
                        pass

                    try:
                        phone_btn = detail_page.locator("button[data-item-id*='phone']").first
                        if await phone_btn.count() > 0:
                            aria_phone = await phone_btn.get_attribute("aria-label") or await phone_btn.text_content()
                            place_info["Telefone Maps"] = aria_phone.replace("Telefone:", "").strip()
                    except Exception:
                        pass

                    try:
                        site_link = detail_page.locator("a[data-item-id='authority']").first
                        if await site_link.count() > 0:
                            site_url = await site_link.get_attribute("href")
                            if site_url:
                                place_info["Site Oficial Maps"] = site_url
                    except Exception:
                        pass

                    await detail_page.close()
                except Exception:
                    pass
                    
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

        tasks = [extract_detail(item) for item in place_links]
        results = await asyncio.gather(*tasks)
        
        for r in results:
            if r is not None:
                places_data.append(r)

    except Exception as e:
        logger.error(f"Erro na raspagem do Google Maps: {e}")
    finally:
        await page.close()
        
    return places_data
