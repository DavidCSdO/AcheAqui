import asyncio
from urllib.parse import urljoin, urlparse
from playwright.async_api import BrowserContext
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config

async def fetch_page_content(context: BrowserContext, url: str) -> str:
    page = await context.new_page()
    content = ""
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=config.PAGE_TIMEOUT_MS)
        await page.wait_for_timeout(1000)
        content = await page.content()
    except Exception:
        pass
    finally:
        await page.close()
    return content

async def crawl_company_site(context: BrowserContext, base_url: str) -> list[str]:
    parsed_base = urlparse(base_url)
    domain = parsed_base.netloc
    scheme = parsed_base.scheme
    
    urls_to_visit = set()
    for path in config.CANDIDATE_PATHS:
        full_url = f"{scheme}://{domain}{path}"
        urls_to_visit.add(full_url)
        
    tasks = [fetch_page_content(context, url) for url in urls_to_visit]
    html_contents = await asyncio.gather(*tasks)
    
    return [html for html in html_contents if html]
