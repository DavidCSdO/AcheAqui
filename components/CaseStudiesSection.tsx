"use client";

import React from "react";
import { Sparkles, ArrowUpRight, TrendingUp, Award, Building2, CheckCircle2 } from "lucide-react";

const CASE_STUDIES = [
  {
    category: "AGÊNCIAS B2B",
    title: "Como a ScaleDigital triplicou a captação de clientes locais.",
    metrics: "+340% CONVERSÃO",
    desc: "Utilizando a busca por bairro e enriquecimento automático de WhatsApp para prospectar clínicas e comércios no Estado de SP.",
    client: "ScaleDigital Inc.",
    badge: "CASE VERIFICADO"
  },
  {
    category: "OUTBOUND SALES",
    title: "Automação de prospecção para times de inside sales.",
    metrics: "< 14MS SLA",
    desc: "Alimentação contínua de cadências de prospecção no HubSpot via API REST do AcheAqui com zero bounce de e-mail.",
    client: "Nexis Cloud B2B",
    badge: "INTEGRAÇÃO API"
  },
  {
    category: "REDE DE FRANQUIAS",
    title: "Mapeamento territorial para expansão de 45 filiais.",
    metrics: "99.8% PRECISÃO",
    desc: "Análise de densidade de concorrentes por raio de 500m para decisões cirúrgicas de abertura de novos pontos comerciais.",
    client: "Grupo OdontoPrime",
    badge: "EXPANSÃO LOCAL"
  }
];

export default function CaseStudiesSection() {
  return (
    <section className="py-24 bg-[#12101c] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Claura Pill Badge Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="claura-badge">
            <Award size={14} className="text-pink-300" />
            <span>RESULTADOS COMPROVADOS DE CLIENTES</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-normal text-white mb-4 font-serif-editorial leading-tight">
            Casos de sucesso que geram impacto real.
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-sans max-w-xl mx-auto">
            Descubra como operações de vendas e expansão utilizam a inteligência local do AcheAqui para acelerar resultados.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((item, idx) => (
            <div 
              key={idx}
              className="claura-card glow-border-trace p-7 flex flex-col justify-between h-full group bg-[#171523]/80 hover:-translate-y-2 hover:border-pink-400/50 hover:shadow-[0_20px_50px_-10px_rgba(244,114,182,0.22)] transition-all duration-300 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="text-pink-300 font-semibold tracking-wider text-[10px] group-hover:text-pink-200 transition-colors">
                    {item.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300 group-hover:border-pink-400/40 group-hover:bg-pink-500/20 transition-all">
                    {item.badge}
                  </span>
                </div>

                {/* Big Metric Box (Claura Style) */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-5 group-hover:bg-white/[0.08] group-hover:border-pink-400/30 transition-all duration-300">
                  <span className="text-[10px] font-mono text-white/40 block mb-1">
                    RESULTADO OBTIDO:
                  </span>
                  <span className="text-2xl font-bold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-violet-300 to-white">
                    {item.metrics}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3 leading-snug group-hover:text-pink-300 transition-colors font-sans">
                  {item.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed font-sans mb-6 group-hover:text-white/80 transition-colors">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                <span className="text-white/40 group-hover:text-white/60 transition-colors">{item.client}</span>
                <span className="text-pink-300 font-semibold flex items-center gap-1">
                  Ler Case <ArrowUpRight size={13} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
