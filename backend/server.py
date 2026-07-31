import asyncio
import sys
import os

if sys.platform == 'win32':
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
import concurrent.futures
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from playwright.async_api import async_playwright

# Setup paths
sys.path.append(os.path.dirname(__file__))
import config
from src.utils import setup_logger
from src.maps_scraper import scrape_google_maps
import aiohttp
import re
from src.crawler import crawl_company_site
from src.parser import (
    parse_html_for_data, categorize_emails, categorize_phones, 
    generate_whatsapp_links, calculate_rating
)
from src.ai_assistant import generate_marketing_materials, semantic_match
from src.validator import validate_email_list
from src.excel import save_to_excel

logger = setup_logger(config.LOG_FILE)

app = FastAPI(
    title="AcheAqui API - Business Prospecting Scraper",
    version="1.0.0",
    description="API assíncrona para prospecção automática de empresas no Google Maps."
)

# Enable CORS for Next.js (localhost:3000) and production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    query: str = Field(..., example="Padarias em São Paulo")
    limit: int = Field(10, ge=1, le=500)
    min_rating: float = Field(0.0, ge=0.0, le=5.0)
    has_website: bool = Field(False)
    has_phone: bool = Field(False)
    mode: str = Field("direcionada") # "simples", "direcionada", "completa"

class OnboardingRequest(BaseModel):
    company_name: str = Field(..., example="Nome da Empresa LTDA")

class MarketingRequest(BaseModel):
    company_data: dict

class SemanticRequest(BaseModel):
    query: str
    companies: list

async def process_company(company_input: dict, context, semaphore: asyncio.Semaphore) -> dict:
    async with semaphore:
        maps_data = company_input
        company_name = maps_data.get("Nome", "")
        site_url = maps_data.get("Site Oficial Maps", "")
        
        emails = set()
        phones = set()
        if maps_data.get("Telefone Maps"):
            phones.add(maps_data["Telefone Maps"])
            
        career_pages = set()
        instagram_pages = set()
        facebook_pages = set()
        
        if site_url:
            html_pages = await crawl_company_site(context, site_url)
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
        
        return {
            "Nome": company_name,
            "Categoria": maps_data.get("Categoria", ""),
            "Endereço": maps_data.get("Endereço", ""),
            "Telefone Celular": ", ".join(sorted(celulares)),
            "WhatsApp Direct": wa_links[0] if wa_links else "",
            "WhatsApp Links": wa_links,
            "Telefone Fixo": ", ".join(sorted(fixos)),
            "Nota Google": maps_data.get("Nota Google", ""),
            "Avaliações": maps_data.get("Avaliações", ""),
            "Site": site_url,
            "Email RH": hr_validated if hr_validated else ", ".join(sorted(hr_emails)),
            "Email Geral": gen_validated if gen_validated else ", ".join(sorted(general_emails)),
            "LinkedIn": "",
            "Instagram": ", ".join(sorted(instagram_pages)),
            "Facebook": ", ".join(sorted(facebook_pages)),
            "Página de Carreiras": ", ".join(sorted(career_pages)),
            "Google Maps URL": maps_data.get("Google Maps URL", ""),
            "Status": status
        }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AcheAqui Scraper API"}

def _run_scraper_in_thread(req_dict: dict):
    # This runs in a new thread, so we can set the policy safely
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        
    async def _do_scrape():
        query = req_dict["query"]
        limit = req_dict["limit"]
        min_rating = req_dict["min_rating"]
        has_website = req_dict["has_website"]
        has_phone = req_dict["has_phone"]
        mode = req_dict.get("mode", "direcionada")
        
        semaphore = asyncio.Semaphore(config.MAX_CONCURRENT_PAGES)
        results = []
        
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-dev-shm-usage",
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-gpu",
                        "--single-process",
                        "--disable-software-rasterizer"
                    ]
                )
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                
                # Speed Boost: Block images, css, fonts
                async def route_intercept(route):
                    if route.request.resource_type in ["image", "stylesheet", "font", "media"]:
                        await route.abort()
                    else:
                        await route.continue_()
                        
                await context.route("**/*", route_intercept)
                
                maps_results = await scrape_google_maps(
                    context,
                    query=query,
                    max_results=limit,
                    min_rating=min_rating,
                    has_website_filter=has_website,
                    has_phone_filter=has_phone,
                    mode=mode
                )
                
                if mode == "completa":
                    # Run deep crawl on the maps results
                    config.CANDIDATE_PATHS = ["/", "/contato", "/contact", "/sobre"]
                        
                    tasks = [process_company(item, context, semaphore) for item in maps_results]
                    deep_results = await asyncio.gather(*tasks)
                    await browser.close()
                    return {"status": "success", "total": len(deep_results), "data": deep_results}
                
                await browser.close()
                
                # For "simples" or "direcionada", build initial data
                results = []
                for item in maps_results:
                    raw_phone = item.get("Telefone Maps", "")
                    celulares, fixos = categorize_phones({raw_phone}) if raw_phone else (set(), set())
                    wa_links = generate_whatsapp_links(celulares)
                    
                    results.append({
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
                        "Instagram": "",
                        "Facebook": "",
                        "Página de Carreiras": "",
                        "Google Maps URL": item.get("Google Maps URL", ""),
                        "Status": 1
                    })
                    
                if mode == "direcionada":
                    # Fast Instagram Search via aiohttp on the official website
                    insta_sem = asyncio.Semaphore(10)
                    async def fetch_insta_with_sem(idx, site):
                        if not site:
                            return
                        async with insta_sem:
                            try:
                                async with aiohttp.ClientSession() as session:
                                    async with session.get(site, timeout=5) as response:
                                        html = await response.text()
                                        match = re.search(r'href=[\'"](https?://(?:www\.)?instagram\.com/[^\'"]+)[\'"]', html)
                                        if match:
                                            results[idx]["Instagram"] = match.group(1)
                            except Exception:
                                pass
                                
                    tasks = [fetch_insta_with_sem(i, r.get("Site")) for i, r in enumerate(results)]
                    await asyncio.gather(*tasks)
                
                return {"status": "success", "total": len(results), "data": results}
            
        except Exception as e:
            logger.error(f"Erro na API de raspagem: {e}")
            return {"status": "error", "detail": str(e)}
            
    return asyncio.run(_do_scrape())

@app.post("/api/scrape")
async def scrape_companies(req: ScrapeRequest):
    logger.info(f"Recebida requisição de busca API: '{req.query}' (limite: {req.limit})")
    
    req_dict = {
        "query": req.query,
        "limit": req.limit,
        "min_rating": req.min_rating,
        "has_website": req.has_website,
        "has_phone": req.has_phone,
        "mode": req.mode
    }
    
    loop = asyncio.get_running_loop()
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        result = await loop.run_in_executor(pool, _run_scraper_in_thread, req_dict)
        
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("detail"))
        
    return result

@app.post("/api/onboarding")
async def onboarding_company(req: OnboardingRequest):
    logger.info(f"Recebida requisição de onboarding: '{req.company_name}'")
    
    req_dict = {
        "query": req.company_name,
        "limit": 1,
        "min_rating": 0.0,
        "has_website": False,
        "has_phone": False,
        "mode": "direcionada"
    }
    
    loop = asyncio.get_running_loop()
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        result = await loop.run_in_executor(pool, _run_scraper_in_thread, req_dict)
        
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("detail"))
        
    data = result.get("data", [])
    if not data:
        raise HTTPException(status_code=404, detail="Empresa não encontrada no Google Maps")
        
    return {"status": "success", "company": data[0]}

@app.post("/api/generate_marketing")
async def api_generate_marketing(req: MarketingRequest):
    logger.info(f"Gerando marketing AI para: {req.company_data.get('Nome')}")
    try:
        loop = asyncio.get_running_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            result = await loop.run_in_executor(pool, generate_marketing_materials, req.company_data)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Erro em generate_marketing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/semantic_search")
async def api_semantic_search(req: SemanticRequest):
    logger.info(f"Busca semântica AI para a query: '{req.query}' com {len(req.companies)} empresas")
    try:
        loop = asyncio.get_running_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            result = await loop.run_in_executor(pool, semantic_match, req.query, req.companies)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Erro em semantic_search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
