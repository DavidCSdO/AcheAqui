"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Crosshair, Sparkles, Building2, MapPin, Phone, Star, ArrowRight, Loader2, CheckCircle2, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName })
      });
      
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setScrapedData(data.company);
        setStep(2);
      } else {
        alert("Não conseguimos localizar a empresa. Verifique o nome e a cidade.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com a IA de busca.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    // Aqui seria onde salvamos no Supabase em 'companies'
    // Como MVP, vamos apenas simular e jogar para o painel
    setLoading(true);
    setTimeout(() => {
      // Fake delay to simulate saving to DB
      router.push("/dashboard/lojista");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden mt-16">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none mix-blend-overlay">
          <Crosshair size={800} strokeWidth={0.5} className="animate-slow-spin" />
        </div>

        {step === 1 && (
          <div className="w-full max-w-2xl text-center z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
              <Sparkles size={16} /> Cadastro IA em 30 segundos
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Encontre sua empresa.
            </h1>
            <p className="text-lg text-white/60 mb-12">
              Não perca tempo preenchendo formulários longos. Digite o nome da sua empresa e a cidade, e a nossa IA puxa todos os dados públicos para você.
            </p>

            <form onSubmit={handleSearch} className="relative group max-w-xl mx-auto">
              <div className="flex w-full bg-[#1C1C1E] border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/30">
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nome da sua empresa ex: Sorridents..."
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 focus:outline-none text-base"
                />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade ex: São Paulo"
                  className="w-1/3 bg-transparent border-l border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none text-base hidden sm:block"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  {loading ? <Crosshair className="animate-spin" size={18} /> : <Search size={18} />}
                  <span>Buscar</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && scrapedData && (
          <div className="w-full max-w-lg z-10 animate-fade-in-up">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{scrapedData.Nome}</h3>
                  <div className="flex items-center gap-2 text-white/50">
                    <Building2 size={16} />
                    <span>{scrapedData.Categoria || "Empresa Local"}</span>
                  </div>
                </div>
                {(scrapedData["Nota Google"] || scrapedData["Avaliação"]) && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xl">
                      <Star size={20} className="fill-amber-400" /> {scrapedData["Nota Google"] || scrapedData["Avaliação"]}
                    </div>
                    <span className="text-white/40 text-sm">{scrapedData["Avaliações"]}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                  <MapPin size={18} className="text-[var(--color-secondary)]" />
                  <span className="flex-1 truncate">{scrapedData["Endereço"]}</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                
                <div className="flex items-center gap-3 text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                  <Phone size={18} className="text-[var(--color-secondary)]" />
                  <span className="flex-1">{scrapedData["Telefone Celular"] || scrapedData["Telefone Fixo"] || "Nenhum telefone encontrado nas bases públicas"}</span>
                  {scrapedData["Telefone Celular"] || scrapedData["Telefone Fixo"] ? <CheckCircle2 size={16} className="text-emerald-400" /> : null}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                  Não é essa
                </button>
                <button 
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Confirmar e Criar Painel <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
