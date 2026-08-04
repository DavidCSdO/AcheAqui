import asyncio
import sys
import urllib.parse
from typing import List, Optional
from app.collectors.base import BaseCollector, RawLead
from app.core.logging import logger
from src.maps_scraper import collect_basic_leads_from_maps


class GoogleMapsCollector(BaseCollector):
    name = "google_maps"

    async def search(self, query: str, city: Optional[str] = None, state: Optional[str] = None, limit: int = 20) -> List[RawLead]:
        """Resilient Google Maps scraper executed in an isolated thread/event loop on Windows."""
        full_query = f"{query} em {city}" if city else query
        logger.info(f"[Google Maps Collector] Searching: '{full_query}' (limit: {limit})")
        
        # O _collect_basic_leads_from_maps_async gerencia a navegação e scrolling.
        raw_items = await collect_basic_leads_from_maps(full_query, max_results=limit)
        
        leads: List[RawLead] = []
        for item in raw_items:
            rating = None
            if item.get("Nota Google"):
                try:
                    rating = float(item["Nota Google"].replace(",", "."))
                except ValueError:
                    pass
                    
            reviews = None
            if item.get("Avaliações"):
                try:
                    reviews = int(item["Avaliações"].replace(".", "").replace(" ", ""))
                except ValueError:
                    pass
                    
            lead = RawLead(
                name=item.get("Nome", "Empresa Encontrada"),
                category=item.get("Categoria") or query,
                address=item.get("Endereço"),
                city=city,
                state=state,
                phone=item.get("Telefone Maps"),
                website=item.get("Site Oficial Maps"),
                rating=rating,
                reviews_count=reviews,
                maps_url=item.get("Google Maps URL"),
                collector_source=self.name
            )
            leads.append(lead)
            
        return leads
