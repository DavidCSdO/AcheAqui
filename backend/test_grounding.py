import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))

API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

def test():
    try:
        model = genai.GenerativeModel('gemini-1.5-flash', tools="google_search_retrieval")
        response = model.generate_content("Qual o telefone e instagram da Oficina Mecânica Mundo Off Road em Santos, SP? Responda em JSON: {'phone': '...', 'instagram': '...'}")
        print(response.text)
    except Exception as e:
        print("Failed:", e)

test()
