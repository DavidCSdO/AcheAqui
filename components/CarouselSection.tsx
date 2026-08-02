"use client";

import React from "react";
import { Building2, Briefcase, Wrench, Star, ArrowRight, Zap, CheckCircle2, Sparkles } from "lucide-react";

export default function CarouselSection() {
  const liveItems = [
    {
      type: "empresa",
      title: "Padaria Bella Vista",
      category: "Alimentação B2B",
      city: "São Paulo, SP",
      rating: "4.9 ★",
      badge: "Lead Verificado",
      badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      borderGlow: "hover:border-sky-400 hover:shadow-sky-500/20"
    },
    {
      type: "vaga",
      title: "Dev React Senior Remoto",
      category: "TechSolutions BR",
      city: "Remoto / CLT",
      rating: "R$ 8.500",
      badge: "Vaga Ativa",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      borderGlow: "hover:border-emerald-400 hover:shadow-emerald-500/20"
    },
    {
      type: "servico",
      title: "Carlos Andrade Elétrica 24h",
      category: "Eletricista Residencial",
      city: "Curitiba, PR",
      rating: "5.0 ★",
      badge: "Prestador Premium",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      borderGlow: "hover:border-amber-400 hover:shadow-amber-500/20"
    },
    {
      type: "empresa",
      title: "Clínica OdontoSmile",
      category: "Saúde & Odontologia",
      city: "Rio de Janeiro, RJ",
      rating: "4.8 ★",
      badge: "WhatsApp Direto",
      badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      borderGlow: "hover:border-sky-400 hover:shadow-sky-500/20"
    },
    {
      type: "vaga",
      title: "Gerente de Vendas B2B",
      category: "Inovação Comercial",
      city: "Belo Horizonte, MG",
      rating: "R$ 5.000 + Comissões",
      badge: "RH Direto",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      borderGlow: "hover:border-emerald-400 hover:shadow-emerald-500/20"
    },
    {
      type: "servico",
      title: "Studio Design Freelance",
      category: "Branding & UI/UX",
      city: "Florianópolis, SC",
      rating: "5.0 ★",
      badge: "Orçamento Rápido",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      borderGlow: "hover:border-amber-400 hover:shadow-amber-500/20"
    }
  ];

  const carouselItems = [...liveItems, ...liveItems];

  return (
    <section className="py-20 bg-[#090D16] border-y border-white/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-amber-500/30 text-xs text-amber-400 font-semibold mb-3">
            <Sparkles size={14} className="animate-pulse" />
            <span>Radar em Tempo Real — IA AcheAqui</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Oportunidades Capturadas <span className="gradient-text-holding">Agora na Rede</span>
          </h2>
        </div>

        <p className="text-xs text-slate-400 max-w-md">
          Passe o mouse sobre qualquer cartão para pausar o carrossel síncrono e explorar os dados retornados pela IA.
        </p>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex gap-6">
          {carouselItems.map((item, idx) => (
            <div
              key={idx}
              className={`w-80 shrink-0 glass-panel p-6 rounded-3xl border border-white/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer ${item.borderGlow}`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                  {item.badge}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  {item.rating}
                </span>
              </div>

              <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors truncate">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{item.category} • {item.city}</p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-sky-400">
                <span>Verificar no Hub</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
