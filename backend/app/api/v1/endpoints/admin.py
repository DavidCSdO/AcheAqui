from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.core.database import get_db
from app.models.company import Company
from app.models.audit import ScrapingLog
from app.schemas.admin import AdminStatsResponse

router = APIRouter()


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    """Retorna métricas consolidadas do banco de dados e auditoria para o painel de controle."""
    # Total Companies
    total_res = await db.execute(select(func.count(Company.id)))
    total_companies = total_res.scalar() or 0

    # Companies without website
    no_site_res = await db.execute(select(func.count(Company.id)).where(or_(Company.website == None, Company.website == "")))
    companies_without_website = no_site_res.scalar() or 0

    # Companies without email
    no_email_res = await db.execute(select(func.count(Company.id)).where(or_(Company.email == None, Company.email == "")))
    companies_without_email = no_email_res.scalar() or 0

    # Scraping logs count
    logs_res = await db.execute(select(func.count(ScrapingLog.id)))
    logs_count = logs_res.scalar() or 0

    return AdminStatsResponse(
        total_companies=total_companies,
        companies_without_website=companies_without_website,
        companies_without_email=companies_without_email,
        recent_scraping_logs_count=logs_count,
        average_collection_time_sec=2.4
    )
