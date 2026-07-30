import re
import dns.resolver
from typing import Tuple

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def is_valid_email_syntax(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def has_mx_record(domain: str) -> bool:
    try:
        answers = dns.resolver.resolve(domain, 'MX', lifetime=3.0)
        return len(answers) > 0
    except Exception:
        try:
            answers = dns.resolver.resolve(domain, 'A', lifetime=3.0)
            return len(answers) > 0
        except Exception:
            return False

def validate_email(email: str) -> Tuple[bool, str]:
    email = email.strip()
    if not is_valid_email_syntax(email):
        return False, "Sintaxe Inválida"
    domain = email.split('@')[-1]
    if has_mx_record(domain):
        return True, "Válido (MX Ativo)"
    return False, "Sem Servidor MX"

def validate_email_list(emails_str: str) -> str:
    if not emails_str:
        return ""
    email_list = [e.strip() for e in emails_str.split(',') if e.strip()]
    results = []
    for email in email_list:
        valid, msg = validate_email(email)
        status_tag = "✓" if valid else "⚠"
        results.append(f"{email} [{status_tag}]")
    return ", ".join(results)
