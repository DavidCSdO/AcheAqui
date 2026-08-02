"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  const [billing, setBilling] = useState<"mensal" | "anual">("anual");

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[140px] pb-24">
        <div className="container-wide px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold tracking-tight text-white mb-6">
              Planos para impulsionar suas vendas
            </h1>
            <p className="text-[1.125rem] text-white/60">
              Escolha o plano ideal para a sua equipe. Teste gratuitamente por 7 dias, cancele quando quiser.
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-white/[0.04] p-1 rounded-full border border-white/[0.06] flex items-center">
              <button 
                onClick={() => setBilling("mensal")}
                className={`px-6 py-2.5 rounded-full text-[0.875rem] font-semibold transition-all duration-200 ${
                  billing === "mensal" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setBilling("anual")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[0.875rem] font-semibold transition-all duration-200 ${
                  billing === "anual" ? "bg-[var(--color-secondary)] text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                Anual
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[0.6875rem] uppercase tracking-wider font-bold">20% off</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col hover:bg-white/[0.06] hover:border-violet-400/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(167,139,250,0.18)] transition-all duration-300">
              <h3 className="text-[1.25rem] font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">Starter</h3>
              <p className="text-[0.875rem] text-white/60 h-10">Ideal para profissionais autônomos e validações rápidas.</p>
              <div className="my-6">
                <span className="text-[2.5rem] font-bold tracking-tight text-white font-mono">R$ 0</span>
                <span className="text-white/50 text-[0.875rem]">/mês</span>
              </div>
              <a href="/auth" className="w-full text-center py-3 rounded-[12px] bg-white/10 text-white font-semibold text-[0.9375rem] hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition-all duration-200 mb-8 border border-white/10">
                Começar grátis
              </a>
              <ul className="space-y-4 flex-1">
                {[
                  "1.000 leads por mês",
                  "Pesquisa por categorias e locais",
                  "Exportação em CSV",
                  "Suporte por e-mail"
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.875rem] text-white/80">
                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="group rounded-[24px] border-2 border-violet-400 bg-white/[0.06] p-8 flex flex-col shadow-2xl scale-105 relative z-10 hover:border-violet-300 hover:shadow-[0_25px_60px_-10px_rgba(167,139,250,0.4)] hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[0.75rem] font-bold tracking-wide uppercase shadow-md shadow-violet-500/30">
                Mais Popular
              </div>
              <h3 className="text-[1.25rem] font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">Pro</h3>
              <p className="text-[0.875rem] text-white/70 h-10">Para times em crescimento focados em conversão B2B.</p>
              <div className="my-6">
                <span className="text-[2.5rem] font-bold tracking-tight text-white font-mono">
                  R$ {billing === "anual" ? "239" : "299"}
                </span>
                <span className="text-white/50 text-[0.875rem]">/mês</span>
              </div>
              <a href="/auth" className="w-full text-center py-3 rounded-[12px] bg-violet-500 text-white font-semibold text-[0.9375rem] hover:bg-violet-600 hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] transition-all duration-200 mb-8 shadow-lg">
                Começar grátis
              </a>
              <ul className="space-y-4 flex-1">
                {[
                  "Leads ilimitados",
                  "Filtros avançados (E-mail, WhatsApp)",
                  "Integração CRM (HubSpot, RD Station)",
                  "Acesso à API (1.000 req/dia)",
                  "Suporte prioritário (SLA 4h)"
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.875rem] text-white/90">
                    <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise */}
            <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col hover:bg-white/[0.06] hover:border-violet-400/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(167,139,250,0.18)] transition-all duration-300">
              <h3 className="text-[1.25rem] font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">Enterprise</h3>
              <p className="text-[0.875rem] text-white/60 h-10">Solução sob medida para operações em grande escala.</p>
              <div className="my-6">
                <span className="text-[2.5rem] font-bold tracking-tight text-white font-mono">
                  Customizado
                </span>
              </div>
              <a href="/auth" className="w-full text-center py-3 rounded-[12px] bg-white text-[#171523] font-semibold text-[0.9375rem] hover:bg-white/90 hover:scale-[1.03] active:scale-95 transition-all duration-200 mb-8 shadow-md">
                Falar com consultor
              </a>
              <ul className="space-y-4 flex-1">
                {[
                  "Tudo do plano Pro",
                  "Acesso irrestrito à API",
                  "Dados enriquecidos via Serasa",
                  "Infraestrutura dedicada",
                  "Gerente de conta exclusivo"
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.875rem] text-white/80">
                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
