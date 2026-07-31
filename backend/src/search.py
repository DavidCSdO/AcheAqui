import asyncio
from ddgs import DDGS
import tldextract
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import config

def sync_search_query(query: str, max_results=config.DUCKDUCKGO_MAX_RESULTS):
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(r)
        return results
    except Exception:
        return []

async def search_query(query: str, max_results=config.DUCKDUCKGO_MAX_RESULTS):
    return await asyncio.to_thread(sync_search_query, query, max_results)

def is_valid_company_site(url: str, title: str, company_name: str) -> bool:
    banned_domains = [
        "linkedin.com", "facebook.com", "instagram.com", "glassdoor", 
        "catho.com", "vagas.com", "infojobs", "youtube.com", "gupy.io",
        "solides.jobs", "cnpj.biz", "casadosdados", "wikipedia.org",
        "guiamais.com.br", "econodata.com.br", "transparencia.cc",
        "empresascnpj.com", "apontador.com.br", "solutudo.com.br"
    ]
    extracted = tldextract.extract(url)
    domain = f"{extracted.domain}.{extracted.suffix}"
    
    for banned in banned_domains:
        if banned in domain:
            return False
            
    cleaned = company_name.split('-')[0].strip().lower()
    if len(cleaned) <= 4:
        if cleaned not in domain.lower() and cleaned not in title.lower():
            return False
            
    return True

def clean_company_name(name: str) -> str:
    name = name.split('-')[0].strip()
    terms_to_remove = [" ltda", " s.a.", " s/a", " me", " epp", " soluções em ti"]
    lower_name = name.lower()
    for term in terms_to_remove:
        if lower_name.endswith(term):
            name = name[:len(name)-len(term)].strip()
            lower_name = lower_name[:len(lower_name)-len(term)].strip()
    return name

async def find_company_urls(company_name: str):
    site_url = ""
    linkedin_url = ""
    cleaned_name = clean_company_name(company_name)
    
    site_query = f"{cleaned_name} {config.SEARCH_SUFFIX}".strip()
    site_results = await search_query(site_query)
    
    for res in site_results:
        url = res.get("href", "")
        title = res.get("title", "")
        if is_valid_company_site(url, title, company_name):
            site_url = url
            break
            
    linkedin_query = f"{company_name} linkedin company"
    linkedin_results = await search_query(linkedin_query)
    
    for res in linkedin_results:
        url = res.get("href", "")
        if "linkedin.com/company" in url or "linkedin.com/in" in url:
            linkedin_url = url
            break
            
    return site_url, linkedin_url

async def find_instagram_url(company_name: str) -> str:
    query = f"{company_name} instagram"
    try:
        results = await search_query(query, max_results=3)
        for res in results:
            url = res.get("href", "")
            if "instagram.com/" in url and "/p/" not in url and "/reel/" not in url:
                return url
    except Exception:
        pass
    return ""
