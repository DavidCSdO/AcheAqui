from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models.company import Company
from app.models.audit import CompanyHistory
from app.core.logging import logger


class CompanyService:
    @staticmethod
    async def get_by_id(db: AsyncSession, company_id: str) -> Optional[Company]:
        result = await db.execute(select(Company).where(Company.id == company_id))
        return result.scalars().first()

    @staticmethod
    async def search_companies(
        db: AsyncSession, 
        query: Optional[str] = None, 
        category: Optional[str] = None, 
        city: Optional[str] = None,
        limit: int = 20, 
        offset: int = 0
    ) -> List[Company]:
        stmt = select(Company)
        if query:
            stmt = stmt.where(or_(
                Company.name.ilike(f"%{query}%"),
                Company.category.ilike(f"%{query}%"),
                Company.description.ilike(f"%{query}%")
            ))
        if category:
            stmt = stmt.where(Company.category.ilike(f"%{category}%"))
        if city:
            stmt = stmt.where(Company.city.ilike(f"%{city}%"))

        stmt = stmt.order_by(Company.created_at.desc()).offset(offset).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def upsert_company(db: AsyncSession, data: Dict[str, Any]) -> Company:
        """Upsert company record: never delete existing fields, track history."""
        name = data.get("name") or data.get("Nome")
        if not name:
            raise ValueError("Company name is required for upsert")

        # Try finding by name or email or phone
        stmt = select(Company).where(Company.name.ilike(name))
        result = await db.execute(stmt)
        existing = result.scalars().first()

        if not existing:
            company = Company(
                name=name,
                category=data.get("category") or data.get("Categoria"),
                address=data.get("address") or data.get("Endereço"),
                city=data.get("city"),
                state=data.get("state"),
                phone=data.get("phone") or data.get("Telefone Celular"),
                landline=data.get("landline") or data.get("Telefone Fixo"),
                whatsapp=data.get("whatsapp") or data.get("WhatsApp Direct"),
                email=data.get("email") or data.get("Email Geral"),
                email_rh=data.get("email_rh") or data.get("Email RH"),
                website=data.get("website") or data.get("Site"),
                instagram=data.get("instagram") or data.get("Instagram"),
                facebook=data.get("facebook") or data.get("Facebook"),
                linkedin=data.get("linkedin") or data.get("LinkedIn"),
                google_rating=data.get("rating") or data.get("google_rating"),
                google_maps_url=data.get("maps_url") or data.get("Google Maps URL"),
                lead_score=data.get("lead_score", 0),
                source_collector=data.get("collector_source", "manual")
            )
            db.add(company)
            await db.flush()
            return company
        else:
            # Audit field changes
            changed = {}
            for field, val in data.items():
                if hasattr(existing, field) and val is not None:
                    old_val = getattr(existing, field)
                    if old_val != val:
                        changed[field] = {"old": old_val, "new": val}
                        setattr(existing, field, val)

            if changed:
                history = CompanyHistory(company_id=existing.id, changed_fields=changed)
                db.add(history)
                
            await db.flush()
            return existing
