import asyncio
import aiohttp
import urllib.parse
import re

async def test():
    search_url = f"https://html.duckduckgo.com/html/?q=test"
    
    async with aiohttp.ClientSession() as s:
        async with s.get(search_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}) as r:
            html = await r.text()
            print('STATUS:', r.status)
            print(html[:500])

asyncio.run(test())
