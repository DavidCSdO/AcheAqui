from typing import Dict, Any, List
from src.ai_assistant import generate_marketing_materials, semantic_match
from app.core.logging import logger


class AIService:
    @staticmethod
    def generate_marketing(company_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate SEO descriptions, Instagram ideas, and FAQs for a company using Gemini AI."""
        logger.info(f"[AI Service] Generating marketing materials for {company_data.get('name') or company_data.get('Nome')}")
        return generate_marketing_materials(company_data)

    @staticmethod
    def semantic_search(query: str, companies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Rank and explain company recommendations based on semantic match."""
        logger.info(f"[AI Service] Performing semantic match for query: '{query}' with {len(companies)} candidates")
        return semantic_match(query, companies)
