import asyncio
import aiohttp
import urllib.parse
import re

async def test():
    search_url = f"https://lite.duckduckgo.com/lite/"
    data = {"q": "Oficina Mecânica Mundo Off Road - Santos, SP Santos"}
    
    async with aiohttp.ClientSession() as s:
        async with s.post(search_url, data=data, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}) as r:
            html = await r.text()
            print('STATUS:', r.status)
            print('HTML LENGTH:', len(html))
            
            # Check for Instagram
            insta_matches = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', html)
            print("Insta matches:", insta_matches)
            
            # Check for website
            urls = re.findall(r'href="(https?://[^"]+)"', html)
            print("URLs found:", [urllib.parse.unquote(u) for u in urls][:10])

asyncio.run(test())
