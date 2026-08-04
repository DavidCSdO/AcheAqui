import aiohttp
from typing import Dict, Any
from app.utils.phone_formatter import format_phone_br, generate_whatsapp_link
from app.utils.email_extractor import extract_emails_from_html, categorize_emails
from app.utils.social_extractor import extract_social_links
from app.core.config import settings
from app.core.logging import logger
from src.maps_scraper import enrich_lead_via_http_search


async def crawl_and_enrich_lead(lead_data: Dict[str, Any], session: aiohttp.ClientSession, city_query: str = "") -> Dict[str, Any]:
    """1. HTTP Search Enrichment (DuckDuckGo lookup for phone, site, instagram, facebook)
       2. Crawl official website (if found) for email, HR contacts, description.
    """
    # Convert lead_data to format expected by enrich_lead_via_http_search
    legacy_format = {
        "Nome": lead_data.get("name") or lead_data.get("Nome", ""),
        "Telefone Maps": lead_data.get("phone") or lead_data.get("Telefone Maps", ""),
        "Site Oficial Maps": lead_data.get("website") or lead_data.get("Site", ""),
        "Instagram": lead_data.get("instagram") or lead_data.get("Instagram", ""),
        "Facebook": lead_data.get("facebook") or lead_data.get("Facebook", ""),
        "Email": lead_data.get("email") or lead_data.get("Email Geral", "")
    }

    # Step 1: Perform fast DuckDuckGo HTTP search enrichment
    search_enriched = await enrich_lead_via_http_search(legacy_format, city_query, session)
    
    enriched = dict(lead_data)
    if search_enriched.get("Telefone Maps") and not enriched.get("phone"):
        enriched["phone"] = search_enriched["Telefone Maps"]
    if search_enriched.get("Site Oficial Maps") and not enriched.get("website"):
        enriched["website"] = search_enriched["Site Oficial Maps"]
    if search_enriched.get("Instagram") and not enriched.get("instagram"):
        enriched["instagram"] = search_enriched["Instagram"]
    if search_enriched.get("Facebook") and not enriched.get("facebook"):
        enriched["facebook"] = search_enriched["Facebook"]
    if search_enriched.get("Email") and not enriched.get("email"):
        enriched["email"] = search_enriched["Email"]

    # Step 2: If website exists, crawl website for deeper contact info
    website = enriched.get("website") or enriched.get("Site")
    if website:
        try:
            async with session.get(
                website,
                timeout=aiohttp.ClientTimeout(total=6),
                headers={"User-Agent": settings.HTTP_USER_AGENT},
                ssl=False
            ) as resp:
                if resp.status == 200:
                    html = await resp.text(errors="replace")
                    discovered_emails = extract_emails_from_html(html)
                    hr_emails, gen_emails = categorize_emails(discovered_emails)
                    if hr_emails and not enriched.get("email_rh"):
                        enriched["email_rh"] = list(hr_emails)[0]
                    if gen_emails and not enriched.get("email"):
                        enriched["email"] = list(gen_emails)[0]
                    elif discovered_emails and not enriched.get("email"):
                        enriched["email"] = list(discovered_emails)[0]
                        
                    socials = extract_social_links(html)
                    for platform, url in socials.items():
                        if url and not enriched.get(platform):
                            enriched[platform] = url
                            
                    # Check for careers / jobs pages
                    import re
                    jobs_match = re.search(r'href=[\'"]([^\'"]*(?:vagas|trabalhe-conosco|trabalheconosco|careers|jobs)[^\'"]*)[\'"]', html, re.IGNORECASE)
                    if jobs_match:
                        jobs_url = jobs_match.group(1)
                        if jobs_url.startswith('/'):
                            jobs_url = website.rstrip('/') + jobs_url
                        elif not jobs_url.startswith('http'):
                            jobs_url = website.rstrip('/') + '/' + jobs_url
                        enriched["has_open_jobs"] = True
                        enriched["jobs_url"] = jobs_url
                    else:
                        enriched["has_open_jobs"] = False
        except Exception as e:
            logger.debug(f"[Enrichment] Website crawl skipped for {website}: {e}")

    return enriched
