import asyncio
import re
from typing import Dict, Any
from urllib.parse import quote
from playwright.async_api import async_playwright

from app.core.config import settings
from app.core.logging import logger
from app.utils.email_extractor import extract_emails_from_html, categorize_emails
from app.utils.social_extractor import extract_social_links
from app.services.enrichment import enrich_lead_via_http_search

async def _search_maps_for_missing_data(page, query: str, enriched: Dict[str, Any]):
    """Uses Google Maps search to find a specific company and bypass bot detection."""
    try:
        url = f"https://www.google.com/maps/search/{quote(query)}?hl=pt-BR"
        await page.goto(url, wait_until="load", timeout=15000)
        
        try:
            btn = page.locator("button:has-text('Rejeitar tudo'), button:has-text('Reject all'), button:has-text('Aceitar tudo')").first
            if await btn.is_visible():
                await btn.click()
                await page.wait_for_timeout(1000)
        except:
            pass
            
        await page.wait_for_timeout(2000)
        
        # Check Phone
        if not enriched.get("phone"):
            phone_elem = page.locator("button[data-item-id^='phone:']").first
            if await phone_elem.is_visible():
                phone_text = await phone_elem.get_attribute("aria-label") or ""
                enriched["phone"] = phone_text.replace("Telefone: ", "").strip()
                
        # Check Website
        if not enriched.get("website"):
            web_elem = page.locator("a[data-item-id='authority']").first
            if await web_elem.is_visible():
                enriched["website"] = await web_elem.get_attribute("href") or ""
                
    except Exception as e:
        logger.debug(f"[Deep Enrichment] Maps Search failed for {query}: {e}")

async def deep_crawl_and_enrich_lead(lead_data: Dict[str, Any], browser, city_query: str = "") -> Dict[str, Any]:
    """
    Extrema Mode: Uses Playwright to deeply crawl the official website, execute JS, and find missing data.
    """
    import aiohttp
    
    legacy_format = {
        "Nome": lead_data.get("name") or lead_data.get("Nome", ""),
        "Telefone Maps": lead_data.get("phone") or lead_data.get("Telefone Maps", ""),
        "Site Oficial Maps": lead_data.get("website") or lead_data.get("Site", ""),
        "Instagram": lead_data.get("instagram") or lead_data.get("Instagram", ""),
        "Facebook": lead_data.get("facebook") or lead_data.get("Facebook", ""),
        "Email": lead_data.get("email") or lead_data.get("Email Geral", "")
    }

    # Step 1: Base HTTP Enrichment (fast Bing search)
    async with aiohttp.ClientSession() as session:
        search_enriched = await enrich_lead_via_http_search(legacy_format, city_query, session)
    
    enriched = dict(lead_data)
    for k, v in [("phone", "Telefone Maps"), ("website", "Site Oficial Maps"), 
                 ("instagram", "Instagram"), ("facebook", "Facebook"), ("email", "Email")]:
        if search_enriched.get(v) and not enriched.get(k):
            enriched[k] = search_enriched[v]

    # Step 2: Deep Playwright Crawl
    company_name = enriched.get("name") or enriched.get("Nome") or ""
    website = enriched.get("website") or enriched.get("Site Oficial Maps") or ""
    
    if not company_name or not browser:
        logger.info(f"[Deep Enrichment] Skipping {company_name} - Missing data or browser")
        return enriched

    try:
        logger.info(f"[Deep Enrichment] Starting Playwright context for {company_name}")
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720}
        )
        
        # Abort images/media to save bandwidth/memory
        async def route_intercept(route):
            if route.request.resource_type in ["image", "media", "font"]:
                await route.abort()
            else:
                await route.continue_()
        await context.route("**/*", route_intercept)
        
        page = await context.new_page()

        # Crawl Website if exists
        if website:
            try:
                await page.goto(website, wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(2000) # Wait for JS rendering
                
                html = await page.content()
                
                # Emails
                discovered_emails = extract_emails_from_html(html)
                hr_emails, gen_emails = categorize_emails(discovered_emails)
                if hr_emails and not enriched.get("email_rh"):
                    enriched["email_rh"] = list(hr_emails)[0]
                if gen_emails and not enriched.get("email"):
                    enriched["email"] = list(gen_emails)[0]
                elif discovered_emails and not enriched.get("email"):
                    enriched["email"] = list(discovered_emails)[0]
                    
                # Socials
                socials = extract_social_links(html)
                for platform, url in socials.items():
                    if url and not enriched.get(platform):
                        enriched[platform] = url
                        
                # Jobs
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

                # Try to find a "Contato" page and click it if phone/email is missing
                if not enriched.get("phone") or not enriched.get("email"):
                    contato_links = page.locator("a:has-text('Contato'), a:has-text('Fale Conosco')")
                    if await contato_links.count() > 0:
                        await contato_links.first.click(timeout=5000)
                        await page.wait_for_timeout(2000)
                        contato_html = await page.content()
                        
                        # Re-extract
                        if not enriched.get("email"):
                            d_emails = extract_emails_from_html(contato_html)
                            if d_emails: enriched["email"] = list(d_emails)[0]
                        
                        if not enriched.get("phone"):
                            phone_match = re.search(r'(?:\+?55\s?)?(?:\(?0?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-\s]?\d{4}', contato_html)
                            if phone_match:
                                enriched["phone"] = phone_match.group(0)

                        # Look for WhatsApp specifically
                        wa_match = re.search(r'href=[\'"](https?://(?:wa\.me|api\.whatsapp\.com)[^\'"]*)[\'"]', contato_html)
                        if wa_match and not enriched.get("whatsapp"):
                            enriched["whatsapp"] = wa_match.group(1)
                            enriched["whatsapp_verificado"] = True

            except Exception as e:
                logger.debug(f"[Deep Enrichment] Website crawl failed for {website}: {e}")

        # Active Maps Search for missing core data (phone/website)
        # If the original maps feed missed it, search specifically for the name + address to force the Knowledge Panel
        if not enriched.get("phone") or not enriched.get("website"):
            endereco = enriched.get("Endereço") or city_query
            maps_query = f"{company_name} {endereco}".strip()
            await _search_maps_for_missing_data(page, maps_query, enriched)
            
            # If we found a website via this secondary maps search, try visiting it briefly to scrape emails/socials
            website_found = enriched.get("website")
            if website_found and not website:
                try:
                    await page.goto(website_found, wait_until="domcontentloaded", timeout=10000)
                    await page.wait_for_timeout(2000)
                    html = await page.content()
                    
                    if not enriched.get("email"):
                        discovered_emails = extract_emails_from_html(html)
                        if discovered_emails: enriched["email"] = list(discovered_emails)[0]
                    
                    socials = extract_social_links(html)
                    for platform, url in socials.items():
                        if url and not enriched.get(platform):
                            enriched[platform] = url
                except Exception:
                    pass

        await page.close()
    except Exception as e:
        logger.error(f"[Deep Enrichment] Fatal Playwright error for {company_name}: {e}")

    return enriched
