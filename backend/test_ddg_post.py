import asyncio
import aiohttp

async def test():
    search_url = "https://html.duckduckgo.com/html/"
    data = {"q": "Oficina Mecânica Mundo Off Road - Santos, SP Santos"}
    
    async with aiohttp.ClientSession() as s:
        async with s.post(search_url, data=data, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}) as r:
            html = await r.text()
            print('STATUS:', r.status)
            print('LENGTH:', len(html))

asyncio.run(test())
