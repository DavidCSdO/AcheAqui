"use client";

import React from "react";
import { Sparkles, MapPin, Database, Zap, ArrowUpRight, ShieldCheck, Cpu, Code2 } from "lucide-react";

const SERVICES = [
  {
    icon: MapPin,
    tag: "PROSPECÇÃO GEOGRÁFICA",
    title: "Indexação por Raio & Bairro",
    desc: "Mapeamento em grade de empresas locais por polígonos urbanos exatos com geolocalização e raio de atendimento.",
    badge: "PRECISÃO DE 15M",
    accent: "text-violet-400 bg-violet-500/10 border-violet-500/30"
  },
  {
    icon: Database,
    tag: "ENRIQUECIMENTO B2B",
    title: "CNPJ, Decisor & WhatsApp",
    desc: "Validação síncrona de contatos de sócios, diretores e executivos com checagem telefônica instantânea.",
    badge: "100% LGPD COMPLIANT",
    accent: "text-pink-400 bg-pink-500/10 border-pink-500/30"
  },
  {
    icon: Zap,
    tag: "AGILARES COMERCIAL",
    title: "Scripts & Abordagens IA",
    desc: "Geração em tempo real de copys persuasivas para WhatsApp e e-mail via Inteligência Artificial.",
    badge: "3.4X CONVERSÃO",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    icon: Code2,
    tag: "INTEGRAÇÃO DIRETA",
    title: "API REST & Webhooks",
    desc: "SDK TypeScript nativo para alimentar HubSpot, Pipedrive ou CRM proprietário em milissegundos.",
    badge: "LATÊNCIA < 14MS",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  }
];

export default function ServicesGridSection() {
  return (
    <section className="py-24 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] claura-glow-purple pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Claura Pill Badge Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="claura-badge">
            <Sparkles size={14} className="text-violet-300" />
            <span>SOLUÇÕES & SERVIÇOS DE PROSPECÇÃO</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-normal text-white mb-4 font-serif-editorial leading-tight">
            Engenharia de dados para quem não pode perder tempo.
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-sans max-w-xl mx-auto">
            Módulos integrados criados para transformar a busca local em vendas diretas e parcerias comerciais.
          </p>
        </div>

        {/* Modular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="claura-card glow-border-trace p-6 flex flex-col justify-between h-full group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(167,139,250,0.25)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${item.accent} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                      <Icon size={20} className="transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 group-hover:border-violet-400/40 group-hover:text-violet-300 group-hover:bg-violet-500/10 transition-all duration-300">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-violet-300 tracking-wider uppercase block mb-1 group-hover:text-violet-200 transition-colors">
                    {item.tag}
                  </span>

                  <h3 className="text-lg font-semibold text-white mb-2 font-sans group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/60 leading-relaxed font-sans mb-6 group-hover:text-white/80 transition-colors">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-white/70 group-hover:text-violet-300 transition-colors font-mono">
                  <span>Saber mais</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
