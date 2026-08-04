import asyncio
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from src.maps_scraper import collect_basic_leads_from_maps

async def test():
    results = await collect_basic_leads_from_maps("Green office Petrópolis Rio de Janeiro", max_results=5)
    with open("results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    asyncio.run(test())
