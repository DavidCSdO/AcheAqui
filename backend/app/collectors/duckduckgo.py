import urllib.parse
import re
import aiohttp
from typing import List, Optional
from app.collectors.base import BaseCollector, RawLead
from app.core.config import settings
from app.core.logging import logger


class DuckDuckGoCollector(BaseCollector):
    name = "duckduckgo"

    async def search(
        self, 
        query: str, 
        city: Optional[str] = None, 
        state: Optional[str] = None, 
        limit: int = 20
    ) -> List[RawLead]:
        """Free HTML search via DuckDuckGo without API keys."""
        full_query = f"{query} em {city}" if city else query
        search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(full_query)}"
        logger.info(f"[DuckDuckGo Collector] Searching: '{full_query}'")
        
        leads: List[RawLead] = []
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    search_url,
                    headers={"User-Agent": settings.HTTP_USER_AGENT},
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        raw_html = await resp.text(errors="replace")
                        
                        # Extract title links
                        results = re.findall(
                            r'<a class="result__url" href="([^"]+)">(?:[^<]+)</a>.*?<a class="result__snippet"[^>]*>(.*?)</a>',
                            raw_html,
                            re.DOTALL
                        )
                        
                        for url_raw, snippet in results[:limit]:
                            decoded_url = urllib.parse.unquote(url_raw)
                            # Extract clean name from URL/snippet
                            if "uddg=" in decoded_url:
                                match = re.search(r'uddg=(https?%3A%2F%2F[^&]+)', url_raw)
                                if match:
                                    decoded_url = urllib.parse.unquote(match.group(1))
                                    
                            if any(ignored in decoded_url for ignored in ["duckduckgo.com", "google.com", "facebook.com", "instagram.com"]):
                                continue
                                
                            domain_name = decoded_url.split("//")[-1].split("/")[0].replace("www.", "")
                            clean_name = domain_name.split(".")[0].capitalize()
                            
                            # Extract phone from snippet if present
                            phone_match = re.search(r'\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}', snippet)
                            phone = phone_match.group(0) if phone_match else None
                            
                            lead = RawLead(
                                name=clean_name,
                                category=query,
                                city=city,
                                state=state,
                                phone=phone,
                                website=decoded_url,
                                collector_source=self.name
                            )
                            leads.append(lead)
        except Exception as e:
            logger.warning(f"[DuckDuckGo Collector] Error: {e}")
            
        return leads
