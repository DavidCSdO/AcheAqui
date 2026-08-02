"use client";

import React, { useState } from "react";
import { MapPin, Database, Terminal, Layers, ArrowUpRight, CheckCircle2, Zap } from "lucide-react";

export default function PerspectiveDeckSection() {
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    {
      id: "01",
      tag: "INDEXAÇÃO GEOGRÁFICA",
      title: "Mapeamento em grade vetorial de alta precisão.",
      desc: "Varredura contínua de polígonos urbanos. Encontre estabelecimentos e empresas por raio exato de atendimento, bairro ou densidade comercial.",
      badge: "LATÊNCIA < 14MS",
      icon: MapPin,
      preview: [
        { label: "ÁREA DE COBERTURA", val: "5.570 Municípios BR" },
        { label: "RESOLUÇÃO DE RAIO", val: "Precisão de 15 metros" },
        { label: "SISTEMA COORDENADAS", val: "WGS 84 GeoJSON" },
      ]
    },
    {
      id: "02",
      tag: "ENRIQUECIMENTO AUTOMÁTICO",
      title: "CNPJ, WhatsApp e decisor principal validados.",
      desc: "Cruzamento automático com fontes federais e redes comerciais para entregar telefones verificados e tomadores de decisão em tempo real.",
      badge: "LGPD COMPLIANT",
      icon: Database,
      preview: [
        { label: "CONTATOS VALIDADOS", val: "WhatsApp & E-mail Direto" },
        { label: "VERIFICAÇÃO CNPJ", val: "Status RFB Síncrono" },
        { label: "QUADRO SOCIETÁRIO", val: "Sócios & Cargos de Decisão" },
      ]
    },
    {
      id: "03",
      tag: "API & SDK DIRECT STREAM",
      title: "Conecte a inteligência de busca ao seu CRM.",
      desc: "SDK TypeScript nativo e Webhooks REST para alimentar HubSpot, Pipedrive, Salesforce ou seu próprio banco de dados sem esforço.",
      badge: "REST & GRAPHQL",
      icon: Terminal,
      preview: [
        { label: "SDK TYPESCRIPT", val: "npm i @acheaqui/sdk" },
        { label: "TEMPO DE RESPOSTA", val: "SLA < 14ms" },
        { label: "FORMATO DE SAÍDA", val: "JSON & Webhooks" },
      ]
    },
    {
      id: "04",
      tag: "DASHBOARD OPERACIONAL",
      title: "Estúdio completo para times de alta performance.",
      desc: "Gerencie listas de prospecção, exporte em CSV/JSON e acompanhe métricas de conversão com filtros de geolocalização.",
      badge: "MULTI-TENANT",
      icon: Layers,
      preview: [
        { label: "EXPORTAÇÃO", val: "CSV, XLSX, JSON API" },
        { label: "GESTÃO DE LISTAS", val: "Filtros Personalizados" },
        { label: "AUDITORIA DE DADOS", val: "Histórico de Consultas" },
      ]
    }
  ];

  return (
    <section id="engine" className="py-24 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Tag */}
        <div className="flex items-center gap-2 font-mono text-xs text-violet-400 mb-3 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span>[ MOTOR DE BUSCA & CAPACIDADES ]</span>
        </div>

        {/* Headline (Avatune Editorial Style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16">
          <div className="md:col-span-7">
            <h2 className="text-3xl sm:text-5xl font-normal text-white leading-tight font-serif-editorial">
              Uma infraestrutura de busca local para operações de alta demanda.
            </h2>
          </div>
          <div className="md:col-span-5 text-white/60 text-xs sm:text-sm font-normal leading-relaxed">
            Eliminamos listas desatualizadas. O AcheAqui une indexação geográfica de alta precisão, validação de contatos em tempo real e busca algorítmica.
          </div>
        </div>

        {/* 3D Interactive Deck Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start perspective-deck-container">
          
          {/* Card Selectors Column */}
          <div className="lg:col-span-5 space-y-4">
            {cards.map((card, idx) => {
              const isActive = activeCard === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCard(idx)}
                  className={`p-5 rounded-2xl cursor-pointer card-stacked-3d group ${
                    isActive
                      ? "bg-white/10 border-2 border-violet-400/80 text-white shadow-xl shadow-violet-500/10"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.09] hover:border-violet-400/50 hover:shadow-[0_12px_30px_-8px_rgba(167,139,250,0.2)] hover:-translate-y-1"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-violet-400 font-bold text-sm" : "text-white/40 group-hover:text-violet-300 transition-colors"}>
                        {card.id}
                      </span>
                      <span className="tracking-wider uppercase text-[10px] text-white/50 group-hover:text-white/70 transition-colors">
                        {card.tag}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/70 group-hover:border-violet-400/30 group-hover:text-violet-300 transition-all">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className={`text-base font-semibold mb-1.5 ${isActive ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                    {card.title}
                  </h3>

                  <p className="text-xs text-white/50 leading-relaxed font-sans group-hover:text-white/70 transition-colors">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Card Visual Preview Panel */}
          <div className="lg:col-span-7">
            <div className="bg-[#1e1a30] p-7 sm:p-9 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between hover:border-violet-400/40 transition-all duration-300">
              
              {/* Corner Telemetry */}
              <div className="absolute top-4 left-4 text-violet-400/50 font-mono text-[10px]">
                + CAPABILITY_DECK //{cards[activeCard].id}
              </div>
              <div className="absolute top-4 right-4 text-white/30 font-mono text-[10px]">
                SYS.STATUS // OK
              </div>

              <div className="mt-6 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 font-mono text-[11px] mb-4 hover:scale-105 transition-transform cursor-default">
                  <Zap size={13} />
                  <span>{cards[activeCard].tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
                  {cards[activeCard].title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
                  {cards[activeCard].desc}
                </p>
              </div>

              {/* Dynamic Content Preview */}
              <div className="bg-[#12101c] rounded-xl p-5 border border-white/10 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {cards[activeCard].preview.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/[0.04] border border-white/5 hover:border-violet-400/30 hover:bg-white/[0.07] transition-all duration-200">
                      <span className="text-[9px] text-white/40 block mb-1 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold text-violet-300">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-white/60 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Pronto para uso imediato em produção</span>
                </div>
                <a
                  href="/auth"
                  className="group text-violet-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  Documentação API <ArrowUpRight size={13} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
