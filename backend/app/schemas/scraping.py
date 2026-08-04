from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ScrapeRequestSchema(BaseModel):
    query: str = Field(..., description="Termo de busca ou categoria (ex: Padarias)")
    city: Optional[str] = Field(None, description="Cidade (ex: São Paulo)")
    state: Optional[str] = Field(None, description="UF (ex: SP)")
    limit: int = Field(20, ge=1, le=500, description="Quantidade máxima de empresas")
    mode: str = Field("direcionada", description="Modo: simples, direcionada ou completa")


class ScrapeResponseSchema(BaseModel):
    status: str
    total: int
    data: List[Dict[str, Any]]
