import asyncio
from playwright.async_api import async_playwright
import urllib.parse
import re

async def test():
    query = "Green Fire Rua Professor Stroeller Petrópolis RJ"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        print("Searching Google...")
        url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}"
        await page.goto(url, wait_until="domcontentloaded")
        
        # Check for captcha
        title = await page.title()
        print(f"Title: {title}")
        
        content = await page.content()
        # Find Instagram
        insta_links = page.locator("a[href*='instagram.com']")
        if await insta_links.count() > 0:
            print("Instagram:", await insta_links.first.get_attribute("href"))
            
        # Extract phone from text
        import bs4
        soup = bs4.BeautifulSoup(content, 'html.parser')
        text = soup.get_text(separator=' ')
        phones = re.findall(r'(?:\+?55\s?)?(?:\(?0?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-\s]?\d{4}', text)
        print("Phones found in text:", set(phones))
        
        await browser.close()

asyncio.run(test())
