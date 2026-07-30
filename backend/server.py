import asyncio
import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from playwright.async_api import async_playwright

# Setup paths
sys.path.append(os.path.dirname(__file__))
import config
from src.utils import setup_logger
from src.maps_scraper import scrape_google_maps
from src.search import find_company_urls
from src.crawler import crawl_company_site
from src.parser import (
    parse_html_for_data, categorize_emails, categorize_phones, 
    generate_whatsapp_links, calculate_rating
)
from src.validator import validate_email_list
from src.linkedin import clean_linkedin_url
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    query: str = Field(..., example="Padarias em São Paulo")
    limit: int = Field(10, ge=1, le=50)
    min_rating: float = Field(0.0, ge=0.0, le=5.0)
    has_website: bool = Field(False)
    has_phone: bool = Field(False)

async def process_company(company_input: dict, context, semaphore: asyncio.Semaphore) -> dict:
    async with semaphore:
        maps_data = company_input
        company_name = maps_data.get("Nome", "")
        site_url = maps_data.get("Site Oficial Maps", "")
        
        linkedin_url = ""
        if not site_url:
            found_site, linkedin_url = await find_company_urls(company_name)
            site_url = found_site
        else:
            _, linkedin_url = await find_company_urls(company_name)
            
        linkedin_clean = clean_linkedin_url(linkedin_url)
        
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
            "LinkedIn": linkedin_clean,
            "Instagram": ", ".join(sorted(instagram_pages)),
            "Facebook": ", ".join(sorted(facebook_pages)),
            "Página de Carreiras": ", ".join(sorted(career_pages)),
            "Google Maps URL": maps_data.get("Google Maps URL", ""),
            "Status": status
        }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AcheAqui Scraper API"}

@app.post("/api/scrape")
async def scrape_companies(req: ScrapeRequest):
    logger.info(f"Recebida requisição de busca API: '{req.query}' (limite: {req.limit})")
    
    semaphore = asyncio.Semaphore(config.MAX_CONCURRENT_PAGES)
    results = []
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            
            maps_results = await scrape_google_maps(
                context,
                query=req.query,
                max_results=req.limit,
                min_rating=req.min_rating,
                has_website_filter=req.has_website,
                has_phone_filter=req.has_phone
            )
            
            if not maps_results:
                await browser.close()
                return {"status": "success", "total": 0, "data": []}
                
            tasks = [process_company(item, context, semaphore) for item in maps_results]
            results = await asyncio.gather(*tasks)
            await browser.close()
            
        # Save output to Excel
        save_to_excel(results)
        return {"status": "success", "total": len(results), "data": results}
        
    except Exception as e:
        logger.error(f"Erro na API de raspagem: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
