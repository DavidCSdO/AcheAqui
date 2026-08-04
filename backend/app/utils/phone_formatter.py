import re
from typing import Tuple, List, Set


def clean_digits(phone: str) -> str:
    """Remove non-digit characters."""
    if not phone:
        return ""
    return re.sub(r"\D", "", phone)


def format_phone_br(phone: str) -> str:
    """Format Brazilian phone number to standard format (+55 DD NNNNN-NNNN or +55 DD NNNN-NNNN)."""
    digits = clean_digits(phone)
    
    # Strip leading 55 if present
    if len(digits) in (12, 13) and digits.startswith("55"):
        digits = digits[2:]
        
    if len(digits) == 11:
        # Cellphone (9 digits)
        return f"+55 {digits[:2]} {digits[2:7]}-{digits[7:]}"
    elif len(digits) == 10:
        # Landline (8 digits)
        return f"+55 {digits[:2]} {digits[2:6]}-{digits[6:]}"
    
    return phone.strip() if phone else ""


def categorize_phones(raw_phones: Set[str]) -> Tuple[Set[str], Set[str]]:
    """Categorize raw phone strings into Cellphones (WhatsApp potential) and Landlines."""
    cellphones = set()
    landlines = set()
    
    for raw in raw_phones:
        if not raw:
            continue
        digits = clean_digits(raw)
        if len(digits) in (12, 13) and digits.startswith("55"):
            digits = digits[2:]
            
        if len(digits) == 11 and digits[2] == "9":
            cellphones.add(format_phone_br(digits))
        elif len(digits) == 10:
            landlines.add(format_phone_br(digits))
        elif len(digits) == 11:
            cellphones.add(format_phone_br(digits))
        elif digits:
            landlines.add(raw.strip())
            
    return cellphones, landlines


def generate_whatsapp_link(phone: str) -> str:
    """Generate direct https://wa.me/55... link for a cellphone."""
    digits = clean_digits(phone)
    if not digits:
        return ""
    if not digits.startswith("55") and len(digits) in (10, 11):
        digits = "55" + digits
    if len(digits) in (12, 13):
        return f"https://wa.me/{digits}"
    return ""
