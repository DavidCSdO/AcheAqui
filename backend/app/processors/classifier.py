from typing import Dict, Any


def calculate_lead_score(lead: Dict[str, Any]) -> int:
    """Calculate lead score (0-100) based on completeness and contact availability."""
    score = 20  # Base score for existing
    
    if lead.get("phone") or lead.get("Telefone Celular"):
        score += 25
    if lead.get("whatsapp") or lead.get("WhatsApp Direct"):
        score += 15
    if lead.get("email") or lead.get("Email Geral"):
        score += 20
    if lead.get("website") or lead.get("Site"):
        score += 10
    if lead.get("instagram") or lead.get("Instagram"):
        score += 5
    if lead.get("linkedin") or lead.get("LinkedIn"):
        score += 5

    return min(100, score)
