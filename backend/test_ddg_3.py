import aiohttp
import asyncio

async def test():
    async with aiohttp.ClientSession() as s:
        async with s.get('https://html.duckduckgo.com/html/?q=Apia+Consultoria+Petropolis+RJ+instagram', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}) as r:
            print(r.status)
            text = await r.text()
            print(text[:500])

asyncio.run(test())
