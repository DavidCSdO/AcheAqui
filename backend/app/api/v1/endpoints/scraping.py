import json
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from app.schemas.scraping import ScrapeRequestSchema, ScrapeResponseSchema
from app.processors.pipeline import ProspectingPipeline

router = APIRouter()
pipeline = ProspectingPipeline()


@router.post("/collect", response_model=ScrapeResponseSchema)
async def trigger_scraping(req: ScrapeRequestSchema):
    """Executa o pipeline completo de 7 etapas e retorna todos os leads processados."""
    results = await pipeline.run(
        query=req.query,
        city=req.city,
        state=req.state,
        limit=req.limit,
        mode=req.mode
    )
    return {"status": "success", "total": len(results), "data": results}


@router.get("/stream")
async def stream_scraping(request: Request, q: str, city: str = "", limit: int = 20, mode: str = "direcionada"):
    """SSE streaming endpoint para renderização progressiva na UI."""
    async def event_generator():
        try:
            yield f"data: {json.dumps({'type': 'status', 'message': 'Iniciando pipeline de coleta...'})}\n\n"
            async for payload in pipeline.run_streaming(query=q, city=city, limit=limit, mode=mode):
                if await request.is_disconnected():
                    break
                phase = payload.get("_phase")
                idx = payload.get("index")
                data = payload.get("data")
                
                event_type = "basic_lead" if phase == "basic" else "lead_update"
                yield f"data: {json.dumps({'type': event_type, 'index': idx, 'data': data}, ensure_ascii=False)}\n\n"
                
            yield f"data: {json.dumps({'type': 'done', 'total': limit})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )
