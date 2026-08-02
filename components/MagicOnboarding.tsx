"use client";

import React, { useState } from "react";
import Crosshair from "./Crosshair";
import { ArrowRight, Search, Sparkles } from "lucide-react";

export default function MagicOnboarding({ onComplete }: { onComplete: () => void }) {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;
    
    setLoading(true);
    setStep(1); // Buscando no Maps
    
    setTimeout(() => setStep(2), 2500); // Gerando IA...
    
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName })
      });
      
      if (res.ok) {
        setStep(3); // Concluído!
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        alert("Ocorreu um erro. Tente novamente.");
        setLoading(false);
        setStep(0);
      }
    } catch (err) {
      console.error(err);
      alert("Falha na conexão.");
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-secondary)] opacity-[0.03] pointer-events-none">
        <Crosshair size={800} strokeWidth={0.5} className={loading ? "animate-slow-spin" : ""} />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-accent)] rounded-[16px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(167,139,250,0.4)]">
          <Sparkles size={32} className="text-white" />
        </div>
        
        <h1 className="text-[2rem] font-bold text-white tracking-tight mb-4">
          Qual o nome da sua empresa?
        </h1>
        <p className="text-[1.125rem] text-white/60 mb-10">
          Nossa Inteligência Artificial vai buscar seus dados na internet e criar o seu Assistente de Marketing e Perfil Otimizado em 30 segundos.
        </p>

        {!loading ? (
          <form onSubmit={handleSubmit} className="relative animate-fade-in-up">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Pizzaria do Zé, São Paulo..."
              className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1.125rem] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors shadow-2xl"
              required
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-[12px] font-semibold flex items-center gap-2 hover:bg-white/90 transition-transform active:scale-95"
            >
              Criar Mágica <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in text-left bg-white/5 border border-white/10 p-8 rounded-[24px]">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
                {step > 1 ? <Search size={16} /> : <Crosshair size={16} className="animate-spin" />}
              </div>
              <span className={`text-[1.125rem] font-medium ${step >= 1 ? 'text-white' : 'text-white/40'}`}>
                Rastreando {companyName} nas bases públicas...
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/30'}`}>
                {step > 2 ? <Sparkles size={16} /> : (step === 2 ? <Crosshair size={16} className="animate-spin" /> : <span className="w-2 h-2 rounded-full bg-white/20" />)}
              </div>
              <span className={`text-[1.125rem] font-medium ${step >= 2 ? 'text-white' : 'text-white/40'}`}>
                IA AcheAqui escrevendo SEO e Posts...
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/30'}`}>
                {step === 3 ? <ArrowRight size={16} /> : <span className="w-2 h-2 rounded-full bg-white/20" />}
              </div>
              <span className={`text-[1.125rem] font-medium ${step >= 3 ? 'text-white' : 'text-white/40'}`}>
                Concluído! Redirecionando...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
