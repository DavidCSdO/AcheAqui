import asyncio
from playwright.async_api import async_playwright
import re

async def test():
    import urllib.parse
    query = "Green Fire Rua Professor Stroeller Petrópolis"
    url = f"https://www.google.com/maps/search/{urllib.parse.quote(query)}?hl=pt-BR"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()
        print("Loading Maps URL...")
        await page.goto(url, wait_until="load", timeout=15000)
        
        try:
            btn = page.locator("button:has-text('Rejeitar tudo'), button:has-text('Reject all'), button:has-text('Aceitar tudo')").first
            if await btn.is_visible():
                await btn.click()
        except:
            pass
            
        print("Waiting...")
        await page.wait_for_timeout(3000)
        
        # Phone
        phone_elem = page.locator("button[data-item-id^='phone:']").first
        if await phone_elem.is_visible():
            phone_text = await phone_elem.get_attribute("aria-label") or ""
            print("Phone:", phone_text.replace("Telefone: ", "").strip())
        else:
            print("Phone not visible")
            
        content = await page.content()
        with open("maps.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("HTML saved to maps.html")
        await page.screenshot(path="maps_debug.png")
        print("Screenshot saved to maps_debug.png")
        await browser.close()

asyncio.run(test())
