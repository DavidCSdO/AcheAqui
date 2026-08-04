import re
from typing import List, Dict, Any, Optional
from difflib import SequenceMatcher
from app.utils.phone_formatter import clean_digits


def normalize_name(name: str) -> str:
    if not name:
        return ""
    low = name.lower()
    low = re.sub(r'\b(ltda|eireli|me|epp|sa|s/a|grupo|servicos|serviços)\b', '', low)
    low = re.sub(r'[^\w\s]', '', low)
    return " ".join(low.split())


def is_duplicate(candidate: Dict[str, Any], existing_list: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Check if candidate lead is a duplicate of any lead in existing_list."""
    cand_phone = clean_digits(candidate.get("phone") or candidate.get("Telefone Celular") or "")
    cand_name_norm = normalize_name(candidate.get("name") or candidate.get("Nome") or "")
    cand_website = (candidate.get("website") or candidate.get("Site") or "").replace("www.", "").rstrip("/")

    for item in existing_list:
        item_phone = clean_digits(item.get("phone") or item.get("Telefone Celular") or "")
        item_name_norm = normalize_name(item.get("name") or item.get("Nome") or "")
        item_website = (item.get("website") or item.get("Site") or "").replace("www.", "").rstrip("/")

        # Exact Phone match
        if cand_phone and item_phone and len(cand_phone) >= 8 and cand_phone == item_phone:
            return item

        # Exact Website match
        if cand_website and item_website and len(cand_website) > 7 and cand_website == item_website:
            return item

        # Fuzzy Name similarity (>88%)
        if cand_name_norm and item_name_norm:
            ratio = SequenceMatcher(None, cand_name_norm, item_name_norm).ratio()
            if ratio >= 0.88:
                return item

    return None
