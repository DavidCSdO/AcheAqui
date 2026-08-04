import asyncio
import aiohttp
import re

async def test():
    search_url = "https://www.bing.com/search"
    params = {"q": "Oficina Mecânica Mundo Off Road - Santos, SP"}
    
    async with aiohttp.ClientSession() as s:
        async with s.get(search_url, params=params, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}) as r:
            html = await r.text()
            print('STATUS:', r.status)
            print('LENGTH:', len(html))
            phone_match = re.search(r'\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}', html)
            print("Phone match:", phone_match.group(0) if phone_match else None)
            
            # Instagram
            insta_matches = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', html)
            print("Insta matches:", insta_matches[:2])

asyncio.run(test())
