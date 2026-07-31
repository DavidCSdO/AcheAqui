import asyncio
from urllib.parse import urljoin, urlparse
import aiohttp
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config


async def fetch_page_content(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch page HTML via HTTP request (no browser needed)."""
    try:
        async with session.get(
            url,
            timeout=aiohttp.ClientTimeout(total=config.CRAWL_TIMEOUT_SEC),
            headers={"User-Agent": config.HTTP_USER_AGENT},
            ssl=False
        ) as response:
            if response.status == 200:
                return await response.text(errors="replace")
    except Exception:
        pass
    return ""


async def crawl_company_site(session: aiohttp.ClientSession, base_url: str) -> list[str]:
    """Crawl a company website using HTTP requests (no browser).
    
    Visits the base URL and common subpages to extract contact info.
    """
    parsed_base = urlparse(base_url)
    domain = parsed_base.netloc
    scheme = parsed_base.scheme or "https"
    
    urls_to_visit = set()
    for path in config.CANDIDATE_PATHS:
        full_url = f"{scheme}://{domain}{path}"
        urls_to_visit.add(full_url)
    
    sem = asyncio.Semaphore(2)  # Limit to 2 concurrent paths per company
    
    async def fetch_with_sem(url):
        async with sem:
            return await fetch_page_content(session, url)
            
    tasks = [fetch_with_sem(url) for url in urls_to_visit]
    html_contents = await asyncio.gather(*tasks)
    
    return [html for html in html_contents if html]
