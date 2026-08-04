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
            
            # Check for Phone
            phone_match = re.search(r'\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}', html)
            print("Phone match:", phone_match.group(0) if phone_match else None)
            
            # Print snippets (tr.result-snippet)
            snippets = re.findall(r'<td class=\'result-snippet\'>([^<]+)</td>', html)
            for s in snippets[:3]:
                print("Snippet:", s.strip())

asyncio.run(test())
