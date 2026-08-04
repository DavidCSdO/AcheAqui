from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.company import CompanyResponse, CompanyUpdate
from app.services.company_service import CompanyService

router = APIRouter()


@router.get("/search", response_model=List[CompanyResponse])
async def search_companies(
    q: Optional[str] = Query(None, description="Termo de busca"),
    category: Optional[str] = Query(None, description="Categoria"),
    city: Optional[str] = Query(None, description="Cidade"),
    limit: int = Query(20, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Busca empresas no banco de dados local por termo, categoria ou cidade."""
    return await CompanyService.search_companies(
        db, query=q, category=category, city=city, limit=limit, offset=offset
    )


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str, db: AsyncSession = Depends(get_db)):
    """Obtém os detalhes de uma empresa específica pelo ID."""
    company = await CompanyService.get_by_id(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return company
