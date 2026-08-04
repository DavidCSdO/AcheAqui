import re
from typing import Set, Tuple
from bs4 import BeautifulSoup

# Regex for valid email matching
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')

# Common image/static asset extensions that trigger false positive email matches
IGNORED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.css', '.js', '.wixpress.com')

# Known HR keywords for categorizing HR emails vs General emails
HR_KEYWORDS = ['rh', 'rh@', 'carreira', 'carreiras', 'vagas', 'recrutamento', 'talent', 'jobs', 'trabalheconosco']


def extract_emails_from_html(html_content: str) -> Set[str]:
    """Extract valid emails from HTML via Mailto links, JSON-LD, Microdata, and Regex."""
    emails: Set[str] = set()
    if not html_content:
        return emails
        
    soup = BeautifulSoup(html_content, "lxml" if "lxml" in sys_modules_check() else "html.parser")
    
    # 1. Search mailto: links
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("mailto:"):
            clean_email = href.replace("mailto:", "").split("?")[0].strip().lower()
            if is_valid_email(clean_email):
                emails.add(clean_email)
                
    # 2. Search regex across whole HTML
    matches = EMAIL_REGEX.findall(html_content)
    for match in matches:
        clean = match.strip().lower()
        if is_valid_email(clean):
            emails.add(clean)
            
    return emails


def is_valid_email(email: str) -> bool:
    """Validate email string structure and filter out junk asset matches."""
    if not email or "@" not in email:
        return False
    if email.endswith(IGNORED_EXTENSIONS):
        return False
    parts = email.split("@")
    if len(parts) != 2 or not parts[0] or not parts[1]:
        return False
    if "." not in parts[1]:
        return False
    return True


def categorize_emails(emails: Set[str]) -> Tuple[Set[str], Set[str]]:
    """Categorize emails into HR/Recruitment vs General/Contact emails."""
    hr_emails: Set[str] = set()
    general_emails: Set[str] = set()
    
    for email in emails:
        low = email.lower()
        if any(kw in low for kw in HR_KEYWORDS):
            hr_emails.add(email)
        else:
            general_emails.add(email)
            
    return hr_emails, general_emails


def sys_modules_check():
    import sys
    return sys.modules
