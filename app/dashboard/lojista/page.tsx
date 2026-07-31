"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Building2, MapPin, Phone, Star, TrendingUp, Users, MousePointerClick, 
  Sparkles, Search as SearchIcon, FileText, ChevronRight
} from "lucide-react";

const Instagram = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function LojistaDashboard() {
  // Simulação de dados de uma empresa recém-cadastrada
  const [activeTab, setActiveTab] = useState("marketing");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState<any>(null);

  const mockCompany = {
    Nome: "Pizzaria Bella Napoli",
    Categoria: "Restaurante Italiano",
    "Nota Google": "4.8",
    Avaliações: "342",
    Endereço: "Av. Paulista, 1000 - Bela Vista, SP"
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/generate_marketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_data: mockCompany })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setAiGenerated(data.data);
      } else {
        alert("Erro ao gerar o plano de marketing.");
      }
    } catch (e) {
      console.error(e);
      alert("Falha de conexão com a IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 container-wide px-6 py-24 mt-8">
        
        {/* Header do Lojista */}
        <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--color-secondary)] to-purple-600" />
          <div>
            <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-white/50 text-xs font-mono uppercase tracking-wider mb-4 border border-white/10">
              Painel do Proprietário
            </div>
            <h1 className="text-3xl font-bold mb-2">{mockCompany.Nome}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Building2 size={16} /> {mockCompany.Categoria}</span>
              <span className="flex items-center gap-1 text-amber-400"><Star size={16} className="fill-amber-400" /> {mockCompany["Nota Google"]} ({mockCompany.Avaliações})</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {mockCompany.Endereço}</span>
            </div>
          </div>
          
          <button className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2">
            Ver Perfil Público <ChevronRight size={18} />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]' : 'text-white/50 hover:text-white'}`}
          >
            Analytics & CRM
          </button>
          <button 
            onClick={() => setActiveTab("marketing")}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'marketing' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/50 hover:text-white'}`}
          >
            <Sparkles size={16} /> Assistente de Marketing (IA)
          </button>
        </div>

        {/* Tab: Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1C1C1E]/50 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Users size={24} /></div>
                  <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp size={14} className="mr-1" /> +12%</span>
                </div>
                <h3 className="text-white/50 text-sm mb-1">Visualizações do Perfil</h3>
                <p className="text-3xl font-bold">1.248</p>
              </div>

              <div className="bg-[#1C1C1E]/50 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Phone size={24} /></div>
                  <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp size={14} className="mr-1" /> +34%</span>
                </div>
                <h3 className="text-white/50 text-sm mb-1">Cliques no WhatsApp</h3>
                <p className="text-3xl font-bold text-emerald-400">86</p>
              </div>

              <div className="bg-[#1C1C1E]/50 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><MousePointerClick size={24} /></div>
                  <span className="text-rose-400 text-sm font-bold flex items-center"><TrendingUp size={14} className="mr-1 rotate-180" /> -2%</span>
                </div>
                <h3 className="text-white/50 text-sm mb-1">Cliques no Site</h3>
                <p className="text-3xl font-bold text-purple-400">42</p>
              </div>
            </div>

            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><SearchIcon size={20} className="text-[var(--color-secondary)]" /> Termos mais buscados</h2>
              <p className="text-white/60 mb-6 text-sm">Estas são as palavras que as pessoas digitaram no AcheAqui antes de encontrarem sua empresa nesta semana.</p>
              
              <div className="flex flex-wrap gap-3">
                {["pizzaria centro", "pizza napolitana", "jantar romantico sp", "restaurante italiano barato"].map((term) => (
                  <span key={term} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium">
                    "{term}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Assistente IA */}
        {activeTab === "marketing" && (
          <div className="animate-fade-in">
            
            {!aiGenerated ? (
              <div className="bg-[#1C1C1E] border border-emerald-500/30 rounded-3xl p-12 text-center shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className={isGenerating ? "animate-spin" : ""} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Gere sua estratégia de marketing em segundos</h2>
                <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
                  Nossa IA vai ler o perfil da sua empresa e criar <strong>ideias de posts para o Instagram</strong>, <strong>textos otimizados para o Google (SEO)</strong> e <strong>respostas para dúvidas comuns</strong> dos seus clientes.
                </p>
                
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isGenerating ? "A Inteligência Artificial está escrevendo..." : "Gerar Marketing com IA"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SEO Card */}
                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[var(--color-secondary)]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-lg"><SearchIcon size={20} /></div>
                    <h3 className="text-xl font-bold">SEO & Apresentação</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    {aiGenerated.seo_description}
                  </p>
                  <div>
                    <h4 className="text-xs font-mono text-white/40 uppercase mb-3">Palavras-Chave Otimizadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiGenerated.seo_keywords?.map((k: string) => (
                        <span key={k} className="text-xs bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-2 py-1 rounded-md">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instagram Card */}
                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-pink-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Instagram size={20} /></div>
                    <h3 className="text-xl font-bold">Ideias para o Instagram</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {aiGenerated.instagram_posts?.slice(0, 2).map((post: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <h4 className="font-bold text-pink-400 text-sm mb-1">Post {i+1}: {post.title}</h4>
                        <p className="text-white/60 text-xs mb-2"><strong>Ideia:</strong> {post.idea}</p>
                        <p className="text-white/60 text-xs italic border-l-2 border-pink-500/30 pl-2">&quot; {post.caption} &quot;</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Card */}
                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 lg:col-span-2 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><FileText size={20} /></div>
                    <h3 className="text-xl font-bold">Respostas para WhatsApp (FAQ)</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiGenerated.faqs?.map((faq: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <p className="text-amber-400 text-sm font-bold mb-2">Q: &quot;{faq.question}&quot;</p>
                        <p className="text-white/60 text-xs italic">&quot; {faq.answer} &quot;</p>
                      </div>
                    ))}
                  </div>

              </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
