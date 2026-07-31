import asyncio
import sys
import os
import json

if sys.platform == 'win32':
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import aiohttp
import re

# Setup paths
sys.path.append(os.path.dirname(__file__))
import config
from src.utils import setup_logger
from src.maps_scraper import scrape_google_maps, scrape_google_maps_streaming
from src.crawler import crawl_company_site
from src.parser import (
    parse_html_for_data, categorize_emails, categorize_phones, 
    generate_whatsapp_links, calculate_rating
)
from src.ai_assistant import generate_marketing_materials, semantic_match
from src.validator import validate_email_list

logger = setup_logger(config.LOG_FILE)

app = FastAPI(
    title="AcheAqui API - Business Prospecting Scraper",
    version="2.0.0",
    description="API assíncrona para prospecção automática de empresas no Google Maps. Agora com streaming SSE."
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Request Models ===

class ScrapeRequest(BaseModel):
    query: str = Field(..., example="Padarias em São Paulo")
    limit: int = Field(10, ge=1, le=500)
    min_rating: float = Field(0.0, ge=0.0, le=5.0)
    has_website: bool = Field(False)
    has_phone: bool = Field(False)
    mode: str = Field("direcionada")  # "simples", "direcionada", "completa"

class OnboardingRequest(BaseModel):
    company_name: str = Field(..., example="Nome da Empresa LTDA")

class MarketingRequest(BaseModel):
    company_data: dict

class SemanticRequest(BaseModel):
    query: str
    companies: list


# === Helper Functions ===

def format_lead(item: dict) -> dict:
    """Convert raw scraper output into the standardized lead format."""
    raw_phone = item.get("Telefone Maps", "")
    celulares, fixos = categorize_phones({raw_phone}) if raw_phone else (set(), set())
    wa_links = generate_whatsapp_links(celulares)
    
    return {
        "Nome": item.get("Nome", ""),
        "Categoria": item.get("Categoria", ""),
        "Endereço": item.get("Endereço", ""),
        "Telefone Celular": ", ".join(sorted(celulares)),
        "WhatsApp Direct": wa_links[0] if wa_links else "",
        "WhatsApp Links": wa_links,
        "Telefone Fixo": ", ".join(sorted(fixos)),
        "Nota Google": item.get("Nota Google", ""),
        "Avaliações": item.get("Avaliações", ""),
        "Site": item.get("Site Oficial Maps", ""),
        "Email RH": "",
        "Email Geral": "",
        "LinkedIn": "",
        "Instagram": item.get("Instagram", ""),
        "Facebook": "",
        "Página de Carreiras": "",
        "Google Maps URL": item.get("Google Maps URL", ""),
        "Status": 1
    }


async def deep_enrich_lead(lead: dict, session: aiohttp.ClientSession) -> dict:
    """For 'completa' mode: crawl the company website via HTTP to extract more data."""
    site_url = lead.get("Site", "")
    if not site_url:
        return lead
    
    try:
        html_pages = await crawl_company_site(session, site_url)
        
        emails = set()
        phones = set()
        if lead.get("Telefone Celular"):
            phones.add(lead["Telefone Celular"])
        if lead.get("Telefone Fixo"):
            phones.add(lead["Telefone Fixo"])
        
        career_pages = set()
        instagram_pages = set()
        facebook_pages = set()
        
        for html in html_pages:
            p_emails, p_phones, p_careers, p_insta, p_fb = parse_html_for_data(html)
            emails.update(p_emails)
            phones.update(p_phones)
            career_pages.update(p_careers)
            instagram_pages.update(p_insta)
            facebook_pages.update(p_fb)
        
        hr_emails, general_emails = categorize_emails(emails)
        celulares, fixos = categorize_phones(phones)
        wa_links = generate_whatsapp_links(celulares)
        
        hr_validated = validate_email_list(", ".join(hr_emails))
        gen_validated = validate_email_list(", ".join(general_emails))
        
        status = calculate_rating(
            has_site=bool(site_url),
            has_email=bool(emails),
            has_hr_email=bool(hr_emails),
            has_career_page=bool(career_pages)
        )
        
        lead.update({
            "Telefone Celular": ", ".join(sorted(celulares)),
            "WhatsApp Direct": wa_links[0] if wa_links else lead.get("WhatsApp Direct", ""),
            "WhatsApp Links": wa_links if wa_links else lead.get("WhatsApp Links", []),
            "Telefone Fixo": ", ".join(sorted(fixos)),
            "Email RH": hr_validated if hr_validated else ", ".join(sorted(hr_emails)),
            "Email Geral": gen_validated if gen_validated else ", ".join(sorted(general_emails)),
            "Instagram": ", ".join(sorted(instagram_pages)) if instagram_pages else lead.get("Instagram", ""),
            "Facebook": ", ".join(sorted(facebook_pages)),
            "Página de Carreiras": ", ".join(sorted(career_pages)),
            "Status": status
        })
    except Exception as e:
        logger.warning(f"Deep enrich error for {lead.get('Nome')}: {e}")
    
    return lead


# === API Endpoints ===

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AcheAqui Scraper API", "version": "2.0"}


@app.get("/api/scrape/stream")
async def scrape_stream(request: Request):
    """SSE streaming endpoint — sends each lead as it's found.
    
    The frontend connects via EventSource and receives leads one by one,
    allowing progressive rendering on the UI.
    """
    query = request.query_params.get("q", "")
    limit = int(request.query_params.get("limit", "10"))
    min_rating = float(request.query_params.get("min_rating", "0"))
    has_website = request.query_params.get("has_website", "false").lower() == "true"
    has_phone = request.query_params.get("has_phone", "false").lower() == "true"
    mode = request.query_params.get("mode", "direcionada")
    
    if not query:
        async def error_stream():
            yield f"data: {json.dumps({'error': 'Query parameter q is required'})}\n\n"
        return StreamingResponse(error_stream(), media_type="text/event-stream")
    
    logger.info(f"[SSE] Busca streaming: '{query}' (limite: {limit}, modo: {mode})")
    
    async def event_generator():
        count = 0
        try:
            # Send initial status
            yield f"data: {json.dumps({'type': 'status', 'message': 'Coletando lista do Google Maps...'})}\n\n"
            
            async for raw_place in scrape_google_maps_streaming(
                query=query,
                max_results=limit,
                min_rating=min_rating,
                has_website_filter=has_website,
                has_phone_filter=has_phone,
                mode=mode
            ):
                # Check if client disconnected
                if await request.is_disconnected():
                    logger.info("[SSE] Client disconnected, stopping.")
                    break
                
                lead = format_lead(raw_place)
                
                # For "completa" mode, deep enrich via HTTP
                if mode == "completa":
                    async with aiohttp.ClientSession() as session:
                        lead = await deep_enrich_lead(lead, session)
                
                count += 1
                yield f"data: {json.dumps({'type': 'lead', 'index': count, 'data': lead}, ensure_ascii=False)}\n\n"
            
            # Send completion signal
            yield f"data: {json.dumps({'type': 'done', 'total': count})}\n\n"
        
        except Exception as e:
            logger.error(f"[SSE] Erro no streaming: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Important for Render/nginx
        }
    )


@app.post("/api/scrape")
async def scrape_companies(req: ScrapeRequest):
    """Classic non-streaming endpoint (backward compatibility).
    
    Collects all results and returns them at once.
    """
    logger.info(f"[POST] Busca: '{req.query}' (limite: {req.limit})")
    
    try:
        maps_results = await scrape_google_maps(
            query=req.query,
            max_results=req.limit,
            min_rating=req.min_rating,
            has_website_filter=req.has_website,
            has_phone_filter=req.has_phone,
            mode=req.mode
        )
        
        results = []
        for item in maps_results:
            lead = format_lead(item)
            results.append(lead)
        
        # For "completa" mode, deep enrich all leads
        if req.mode == "completa" and results:
            async with aiohttp.ClientSession() as session:
                enriched = []
                for lead in results:
                    enriched_lead = await deep_enrich_lead(lead, session)
                    enriched.append(enriched_lead)
                results = enriched
        
        return {"status": "success", "total": len(results), "data": results}
    
    except Exception as e:
        logger.error(f"Erro na API de raspagem: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/onboarding")
async def onboarding_company(req: OnboardingRequest):
    logger.info(f"Recebida requisição de onboarding: '{req.company_name}'")
    
    try:
        maps_results = await scrape_google_maps(
            query=req.company_name,
            max_results=1,
            mode="direcionada"
        )
        
        if not maps_results:
            raise HTTPException(status_code=404, detail="Empresa não encontrada no Google Maps")
        
        lead = format_lead(maps_results[0])
        return {"status": "success", "company": lead}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no onboarding: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate_marketing")
async def api_generate_marketing(req: MarketingRequest):
    logger.info(f"Gerando marketing AI para: {req.company_data.get('Nome')}")
    try:
        result = await asyncio.to_thread(generate_marketing_materials, req.company_data)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {"status": "success", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro em generate_marketing: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/semantic_search")
async def api_semantic_search(req: SemanticRequest):
    logger.info(f"Busca semântica AI para a query: '{req.query}' com {len(req.companies)} empresas")
    try:
        result = await asyncio.to_thread(semantic_match, req.query, req.companies)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {"status": "success", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro em semantic_search: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
