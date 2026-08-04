import google.generativeai as genai
import json
import os
from typing import List

# Configurar a API Key
API_KEY = os.environ.get("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("WARNING: GEMINI_API_KEY não está configurada no ambiente.")

def generate_marketing_materials(company_data: dict) -> dict:
    """
    Usa o Gemini para gerar descrições SEO, FAQs e ideias de Instagram.
    """
    if not API_KEY:
        return {"error": "API Key não configurada"}

    prompt = f"""
    Você é um especialista em Marketing Digital e SEO para negócios locais.
    Baseado nas informações da empresa abaixo, crie um plano de marketing curto.

    Dados da Empresa:
    - Nome: {company_data.get('Nome', 'Empresa Local')}
    - Categoria: {company_data.get('Categoria', '')}
    - Endereço: {company_data.get('Endereço', '')}
    - Avaliação: {company_data.get('Nota Google', '')} estrelas

    Retorne APENAS um JSON válido com a seguinte estrutura:
    {{
        "seo_description": "Um parágrafo atraente de até 300 caracteres sobre a empresa para usar no site/google.",
        "seo_keywords": ["palavra1", "palavra2", "palavra3", "palavra4"],
        "instagram_posts": [
            {{"title": "Título do post 1", "idea": "Ideia do post 1", "caption": "Legenda 1"}},
            {{"title": "Título do post 2", "idea": "Ideia do post 2", "caption": "Legenda 2"}}
        ],
        "faqs": [
            {{"question": "Dúvida comum 1", "answer": "Resposta vendedora 1"}},
            {{"question": "Dúvida comum 2", "answer": "Resposta vendedora 2"}}
        ]
    }}
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        text = response.text.strip()
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}

def semantic_match(user_query: str, companies: List[dict]) -> dict:
    """
    Compara a query do usuário com as empresas retornadas e explica por que elas servem.
    """
    if not API_KEY:
        return {"error": "API Key não configurada"}

    if not companies:
        return {"explanation": "Nenhuma empresa encontrada para a sua busca.", "ranked_companies": []}

    company_summaries = [
        {
            "id": i, 
            "name": c.get("name") or c.get("Nome"), 
            "category": c.get("category") or c.get("Categoria"), 
            "rating": c.get("google_rating") or c.get("Nota Google")
        } for i, c in enumerate(companies)
    ]
    
    prompt = f"""
    O usuário pesquisou por: "{user_query}"
    
    Temos as seguintes empresas retornadas pela busca rápida:
    {json.dumps(company_summaries, ensure_ascii=False)}

    Sua missão é atuar como um "Consultor IA de Negócios Locais". 
    Você deve escrever um pequeno parágrafo explicando POR QUE a melhor empresa atende perfeitamente ao pedido do usuário.
    Se não houver uma relação perfeita, explique de forma amigável o que encontrou.

    Retorne APENAS um JSON válido com a seguinte estrutura:
    {{
        "explanation": "O parágrafo do consultor explicando a escolha.",
        "ranked_ids": [id1, id2] (lista dos IDs ordenados do mais recomendado para o menos recomendado)
    }}
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        text = response.text.strip()
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}
