import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("https://www.bing.com/search?q=Pujol+Propaganda+instagram")
        content = await page.content()
        with open("bing.html", "w", encoding="utf-8") as f:
            f.write(content)
        await browser.close()

asyncio.run(test())
