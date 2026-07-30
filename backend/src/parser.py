import re
from bs4 import BeautifulSoup

EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PHONE_PATTERN = re.compile(r'\(?\d{2}\)?\s?(?:9\d{4}|\d{4})[-.\s]?\d{4}')

def parse_html_for_data(html: str):
    soup = BeautifulSoup(html, 'html.parser')
    text_content = soup.get_text(separator=' ')
    
    emails = set(EMAIL_PATTERN.findall(text_content))
    for a in soup.find_all('a', href=True):
        if a['href'].startswith('mailto:'):
            email = a['href'].replace('mailto:', '').split('?')[0].strip()
            if EMAIL_PATTERN.match(email):
                emails.add(email)
                
    phones = set(PHONE_PATTERN.findall(text_content))
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('tel:'):
            num = href.replace('tel:', '').strip()
            if len(re.sub(r'\D', '', num)) >= 8:
                phones.add(num)
        elif 'wa.me/' in href or 'api.whatsapp.com/send' in href or 'whatsapp.com' in href:
            match = re.search(r'(?:phone=|wa\.me/)(55\d{10,11}|\d{10,11})', href)
            if match:
                phones.add(match.group(1))
    
    career_keywords = ['career', 'carreira', 'vagas', 'job', 'trabalhe-conosco', 'recrutamento', 'talentos']
    career_links = set()
    instagram_links = set()
    facebook_links = set()
    
    for a in soup.find_all('a', href=True):
        href = a['href']
        href_lower = href.lower()
        
        if any(keyword in href_lower for keyword in career_keywords):
            career_links.add(href)
            
        if 'instagram.com/' in href_lower and not any(x in href_lower for x in ['/p/', '/reel/', '/stories/']):
            instagram_links.add(href)
            
        if 'facebook.com/' in href_lower and not any(x in href_lower for x in ['/sharer', '/share', '/dialog']):
            facebook_links.add(href)
            
    return emails, phones, career_links, instagram_links, facebook_links

def generate_whatsapp_links(celulares: set) -> list[str]:
    links = []
    for cel in celulares:
        digits = re.sub(r'\D', '', cel)
        if len(digits) == 11:
            links.append(f"https://wa.me/55{digits}")
        elif len(digits) == 13 and digits.startswith('55'):
            links.append(f"https://wa.me/{digits}")
    return links

def clean_phone_number(phone_raw: str) -> str:
    digits = re.sub(r'\D', '', phone_raw)
    if digits.startswith('55') and len(digits) in (12, 13):
        digits = digits[2:]
    if digits.startswith('0') and len(digits) in (11, 12) and not digits.startswith(('0800', '0300')):
        digits = digits[1:]

    if len(digits) == 11 and digits[2] == '9':
        return f"({digits[:2]}) {digits[2:7]}-{digits[7:]}"
    elif len(digits) == 10 and digits[2] in '2345':
        return f"({digits[:2]}) {digits[2:6]}-{digits[6:]}"
    elif digits.startswith(('0800', '0300')):
        if len(digits) == 11:
            return f"{digits[:4]} {digits[4:7]} {digits[7:]}"
        return f"{digits[:4]} {digits[4:]}"
    return phone_raw.strip()

def classify_phone_number(phone_raw: str) -> str:
    digits = re.sub(r'\D', '', phone_raw)
    if digits.startswith('55') and len(digits) in (12, 13):
        digits = digits[2:]
    if digits.startswith('0') and len(digits) in (11, 12) and not digits.startswith(('0800', '0300')):
        digits = digits[1:]

    if len(digits) == 11 and digits[2] == '9':
        return 'celular'
    elif len(digits) == 10 and digits[2] in '2345':
        return 'fixo'
    elif digits.startswith(('0800', '0300')):
        return 'fixo'
    return 'desconhecido'

def categorize_phones(phones: set):
    celulares = set()
    fixos = set()
    for phone in phones:
        if not phone:
            continue
        c_type = classify_phone_number(phone)
        formatted = clean_phone_number(phone)
        if c_type == 'celular':
            celulares.add(formatted)
        elif c_type == 'fixo':
            fixos.add(formatted)
        else:
            digits = re.sub(r'\D', '', phone)
            if len(digits) >= 11:
                celulares.add(formatted)
            elif len(digits) == 10:
                fixos.add(formatted)
    return celulares, fixos

def categorize_emails(emails: set):
    hr_keywords = ['rh', 'curriculo', 'jobs', 'talentos', 'recrutamento', 'vagas']
    hr_emails = set()
    general_emails = set()
    for email in emails:
        email_lower = email.lower()
        if any(email_lower.startswith(kw + '@') for kw in hr_keywords):
            hr_emails.add(email)
        else:
            if not email_lower.endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                general_emails.add(email)
    return hr_emails, general_emails

def calculate_rating(has_site: bool, has_email: bool, has_hr_email: bool, has_career_page: bool) -> str:
    if not has_site:
        return "⭐"
    if not has_email and not has_career_page:
        return "⭐⭐"
    if has_email and not has_hr_email and not has_career_page:
        return "⭐⭐⭐"
    if has_hr_email and not has_career_page:
        return "⭐⭐⭐⭐"
    if has_career_page:
        return "⭐⭐⭐⭐⭐"
    return "⭐⭐"
