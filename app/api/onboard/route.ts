import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Validate Session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { companyName } = body;
    if (!companyName) {
      return NextResponse.json({ error: "Nome da empresa é obrigatório" }, { status: 400 });
    }

    // 3. Call Python FastAPI Scraper
    // In production this URL would be an env var pointing to your hosted Python service.
    // For local dev, we assume it's running on port 8000.
    let scraperData = null;
    try {
      const pyResponse = await fetch("http://127.0.0.1:8000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: companyName,
          limit: 1,
          min_rating: 0,
          has_website: false,
          has_phone: false
        }),
      });

      if (!pyResponse.ok) {
        console.error("Python scraper returned error:", await pyResponse.text());
      } else {
        const pyResult = await pyResponse.json();
        if (pyResult.status === "success" && pyResult.data && pyResult.data.length > 0) {
          scraperData = pyResult.data[0];
        }
      }
    } catch (e) {
      console.warn("Python scraper is not reachable or failed. Proceeding with basic data.", e);
    }

    // 4. Fallback if scraping failed or returned nothing
    if (!scraperData) {
      scraperData = {
        Nome: companyName,
        Categoria: "",
        Endereço: "",
        "Telefone Celular": "",
        "WhatsApp Direct": "",
        "Telefone Fixo": "",
        "Nota Google": null,
        Site: "",
        "Email Geral": "",
        "Google Maps URL": ""
      };
    }

    // 5. Insert Company into Supabase
    const { data: companyData, error: dbError } = await supabase
      .from("companies")
      .insert({
        owner_id: user.id,
        name: scraperData.Nome || companyName,
        category: scraperData.Categoria,
        address: scraperData.Endereço,
        phone: scraperData["Telefone Fixo"] || scraperData["Telefone Celular"],
        whatsapp: scraperData["WhatsApp Direct"],
        email: scraperData["Email Geral"] || scraperData["Email RH"],
        website: scraperData.Site,
        google_maps_url: scraperData["Google Maps URL"],
        google_rating: scraperData["Nota Google"] ? parseFloat(scraperData["Nota Google"].toString().replace(',','.')) : null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error inserting company:", dbError);
      return NextResponse.json({ error: "Erro ao salvar empresa" }, { status: 500 });
    }

    // 6. Generate AI Marketing Materials with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Você é um especialista em Marketing Digital. Uma empresa acabou de se cadastrar no nosso sistema e precisa de materiais de marketing automatizados.
      
      Nome da Empresa: ${companyData.name}
      Categoria: ${companyData.category || 'Empresa local'}
      Endereço: ${companyData.address || 'Não informado'}
      Site: ${companyData.website || 'Não possui'}
      
      Gere um JSON VÁLIDO com a seguinte estrutura EXATA, sem markdown, apenas o JSON:
      {
        "seo_description": "Uma meta descrição atrativa (máx 160 chars) focada em conversão e SEO local.",
        "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "instagram_post_ideas": [
          {"title": "Título do Post 1", "caption": "Legenda persuasiva...", "type": "Carrossel educativo"},
          {"title": "Título do Post 2", "caption": "Legenda chamativa...", "type": "Reels de bastidores"}
        ],
        "faq_responses": [
          {"question": "Pergunta comum do nicho 1?", "answer": "Resposta gerada pela IA."},
          {"question": "Pergunta comum do nicho 2?", "answer": "Resposta gerada pela IA."}
        ]
      }
    `;

    let aiDataPayload = null;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      // clean backticks if model returned markdown json block
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '');
      aiDataPayload = JSON.parse(cleanJsonStr);
    } catch (e) {
      console.error("Failed to generate AI data:", e);
      // Fallback AI data
      aiDataPayload = {
        seo_description: `${companyData.name} - Soluções em ${companyData.category || 'serviços locais'}.`,
        seo_keywords: [companyData.name, companyData.category],
        instagram_post_ideas: [],
        faq_responses: []
      };
    }

    // 7. Insert AI Data into Supabase
    await supabase
      .from("ai_data")
      .insert({
        company_id: companyData.id,
        seo_description: aiDataPayload.seo_description,
        seo_keywords: aiDataPayload.seo_keywords,
        instagram_post_ideas: aiDataPayload.instagram_post_ideas,
        faq_responses: aiDataPayload.faq_responses
      });

    return NextResponse.json({ success: true, company: companyData }, { status: 200 });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
