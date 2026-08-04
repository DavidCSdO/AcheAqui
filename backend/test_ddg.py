import asyncio
import aiohttp
import urllib.parse
import re

async def test():
    company_name = "Oficina Mecânica Mundo Off Road - Santos, SP"
    city_query = "Santos"
    search_term = f"{company_name} {city_query}"
    search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(search_term)}"
    
    print(f"URL: {search_url}")
    
    async with aiohttp.ClientSession() as s:
        async with s.get(search_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}) as r:
            html = await r.text()
            print('STATUS:', r.status)
            print('HTML LENGTH:', len(html))
            
            # Check for Instagram
            insta_matches = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', html)
            print("Insta matches:", insta_matches)
            
            # Check for Phone
            phone_match = re.search(r'\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}', html)
            print("Phone match:", phone_match.group(0) if phone_match else None)
            
            # Check for website
            urls = re.findall(r'uddg=(https?%3A%2F%2F[^&"\']+)', html)
            print("URLs found:", [urllib.parse.unquote(u) for u in urls][:5])

asyncio.run(test())
