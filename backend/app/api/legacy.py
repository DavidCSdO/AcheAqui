import json
import re
import asyncio
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from app.processors.pipeline import ProspectingPipeline
from app.services.ai_service import AIService

legacy_router = APIRouter()
pipeline = ProspectingPipeline()


def map_to_legacy(item: dict) -> dict:
    """Format lead dict to match exact key names expected by the Next.js frontend."""
    raw_name = item.get("name") or item.get("Nome") or "Empresa Encontrada"
    raw_cat = item.get("category") or item.get("Categoria") or ""
    raw_addr = item.get("address") or item.get("Endereço") or ""
    
    # Phone categorization
    raw_phone = item.get("phone") or item.get("Telefone Maps") or item.get("Telefone Celular") or item.get("Telefone Fixo") or ""
    celular = item.get("Telefone Celular") or ""
    fixo = item.get("Telefone Fixo") or ""
    
    if raw_phone and not celular and not fixo:
        digits = re.sub(r'\D', '', str(raw_phone))
        if len(digits) == 11 or (len(digits) > 0 and digits.startswith('9')):
            celular = raw_phone
        elif len(digits) == 10:
            fixo = raw_phone
        else:
            celular = raw_phone
            
    wa_direct = item.get("whatsapp") or item.get("WhatsApp Direct") or ""
    wa_link = wa_direct
    wa_verified = bool(item.get("whatsapp_verificado", False))
    
    if not wa_link and celular:
        c_digits = re.sub(r'\D', '', str(celular))
        if len(c_digits) >= 10:
            wa_link = f"https://wa.me/55{c_digits}"
            
    rating_val = item.get("rating") or item.get("google_rating") or item.get("Nota Google") or ""
    site_url = item.get("website") or item.get("Site") or item.get("Site Oficial Maps") or ""

    return {
        "Nome": raw_name,
        "Categoria": raw_cat,
        "Endereço": raw_addr,
        "Telefone Celular": celular,
        "Telefone Fixo": fixo,
        "Telefone Maps": raw_phone,
        "WhatsApp Direct": wa_link,
        "Nota Google": str(rating_val) if rating_val else "",
        "Site": site_url,
        "Site Oficial Maps": site_url,
        "Email Geral": item.get("email") or item.get("Email Geral") or "",
        "Email RH": item.get("email_rh") or item.get("Email RH") or "",
        "Instagram": item.get("instagram") or item.get("Instagram") or "",
        "Facebook": item.get("facebook") or item.get("Facebook") or "",
        "LinkedIn": item.get("linkedin") or item.get("LinkedIn") or "",
        "Google Maps URL": item.get("maps_url") or item.get("Google Maps URL") or "",
        "has_open_jobs": item.get("has_open_jobs", False),
        "jobs_url": item.get("jobs_url", ""),
        "whatsapp_verificado": wa_verified
    }


@legacy_router.get("/api/health")
def legacy_health():
    return {"status": "ok", "service": "AcheAqui Clean Architecture API", "version": "3.0"}


@legacy_router.get("/api/scrape/stream")
async def legacy_scrape_stream(request: Request):
    query = request.query_params.get("q", "")
    limit = int(request.query_params.get("limit", "10"))
    mode = request.query_params.get("mode", "direcionada")
    
    if not query:
        async def err_gen():
            yield f"data: {json.dumps({'error': 'Query q is required'})}\n\n"
        return StreamingResponse(err_gen(), media_type="text/event-stream")

    async def event_generator():
        try:
            yield f"data: {json.dumps({'type': 'status', 'message': 'Iniciando pipeline de coleta...'})}\n\n"
            async for payload in pipeline.run_streaming(query=query, limit=limit, mode=mode):
                if await request.is_disconnected():
                    break
                phase = payload.get("_phase")
                idx = payload.get("index")
                item = payload.get("data", {})
                
                legacy_lead = map_to_legacy(item)
                event_type = "basic_lead" if phase == "basic" else "lead_update"
                yield f"data: {json.dumps({'type': event_type, 'index': idx, 'data': legacy_lead}, ensure_ascii=False)}\n\n"
                
            yield f"data: {json.dumps({'type': 'done', 'total': limit})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )


@legacy_router.post("/api/scrape")
async def legacy_scrape(request: Request):
    body = await request.json()
    query = body.get("query", "")
    limit = body.get("limit", 10)
    mode = body.get("mode", "direcionada")
    
    results = await pipeline.run(query=query, limit=limit, mode=mode)
    mapped = [map_to_legacy(item) for item in results]
    return {"status": "success", "total": len(mapped), "data": mapped}


@legacy_router.post("/api/semantic_search")
async def legacy_semantic_search(request: Request):
    body = await request.json()
    query = body.get("query", "")
    companies = body.get("companies", [])
    res = AIService.semantic_search(query, companies)
    return {"status": "success", "data": res}


@legacy_router.post("/api/generate_marketing")
async def legacy_generate_marketing(request: Request):
    body = await request.json()
    company_data = body.get("company_data", {})
    res = AIService.generate_marketing(company_data)
    return {"status": "success", "data": res}
