from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class CompanyBase(BaseModel):
    name: str
    category: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    phone: Optional[str] = None
    landline: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    email_rh: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    google_rating: Optional[float] = None
    google_maps_url: Optional[str] = None
    lead_score: Optional[int] = 0


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
