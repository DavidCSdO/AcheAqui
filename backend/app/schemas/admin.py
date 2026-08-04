from typing import Dict, Any, List
from pydantic import BaseModel


class AdminStatsResponse(BaseModel):
    total_companies: int
    companies_without_website: int
    companies_without_email: int
    recent_scraping_logs_count: int
    average_collection_time_sec: float
