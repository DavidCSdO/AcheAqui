import requests
import json
import codecs

response = requests.get('http://127.0.0.1:8000/api/scrape/stream?q=Empresas%20em%20Green%20Office%20em%20Petr%C3%B3polis%2C%20RJ&limit=3&mode=extrema')
with codecs.open('api_output.txt', 'w', 'utf-8') as f:
    f.write(response.text)
