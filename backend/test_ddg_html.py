import requests
from bs4 import BeautifulSoup

def test_lite():
    url = "https://lite.duckduckgo.com/lite/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {'q': 'Green Fire Rua Professor Stroeller Petrópolis RJ'}
    
    response = requests.post(url, headers=headers, data=data)
    print(f"Status: {response.status_code}")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    for a in soup.find_all('a', class_='result-url'):
        print("URL:", a.get('href'))
        
    text_content = soup.get_text()
    import re
    phone_matches = re.findall(r'(?:\+?55\s?)?(?:\(?0?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-\s]?\d{4}', text_content)
    print("Phones:", set(phone_matches))

test_lite()
