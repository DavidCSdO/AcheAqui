import asyncio
import sys
import os

from app.processors.pipeline import ProspectingPipeline

async def test():
    pipeline = ProspectingPipeline()
    async for payload in pipeline.run_streaming(query="TI em Petropolis, RJ", limit=2, mode="extrema"):
        print(payload["_phase"])

if __name__ == "__main__":
    asyncio.run(test())
