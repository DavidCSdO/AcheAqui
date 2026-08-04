import aiohttp
import urllib.parse
from typing import List, Optional
from app.collectors.base import BaseCollector, RawLead
from app.core.logging import logger


class OpenStreetMapCollector(BaseCollector):
    name = "openstreetmap"
    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    async def search(
        self, 
        query: str, 
        city: Optional[str] = None, 
        state: Optional[str] = None, 
        limit: int = 20
    ) -> List[RawLead]:
        """Query OpenStreetMap Overpass API for registered business nodes and ways."""
        search_area = f"{city}, Brazil" if city else "Brazil"
        logger.info(f"[OSM Collector] Querying Overpass API for '{query}' in '{search_area}'")
        
        # Construct Overpass QL query
        overpass_query = f"""
        [out:json][timeout:15];
        area["name"="{city}"]->.searchArea;
        (
          node["name"~"{query}", i](area.searchArea);
          way["name"~"{query}", i](area.searchArea);
        );
        out body {limit};
        >;
        out skel qt;
        """
        
        leads: List[RawLead] = []
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.OVERPASS_URL, 
                    data={"data": overpass_query},
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        elements = data.get("elements", [])
                        for el in elements:
                            tags = el.get("tags", {})
                            name = tags.get("name")
                            if not name:
                                continue
                                
                            street = tags.get("addr:street", "")
                            housenumber = tags.get("addr:housenumber", "")
                            addr = f"{street} {housenumber}".strip() if street else None
                            
                            phone = tags.get("phone") or tags.get("contact:phone")
                            website = tags.get("website") or tags.get("contact:website")
                            
                            lead = RawLead(
                                name=name,
                                category=tags.get("amenity") or tags.get("shop") or query,
                                address=addr,
                                city=city,
                                state=state,
                                phone=phone,
                                website=website,
                                latitude=el.get("lat"),
                                longitude=el.get("lon"),
                                collector_source=self.name
                            )
                            leads.append(lead)
        except Exception as e:
            logger.warning(f"[OSM Collector] Failed to fetch data: {e}")
            
        return leads[:limit]
