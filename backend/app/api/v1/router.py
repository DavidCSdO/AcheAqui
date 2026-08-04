from fastapi import APIRouter
from app.api.v1.endpoints import companies, scraping, admin

api_router = APIRouter()
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(scraping.router, prefix="/scraping", tags=["scraping"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
