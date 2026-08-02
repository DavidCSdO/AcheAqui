"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Compass 
} from "lucide-react";

export default function FeaturesShowcase() {
  const features = [
    {
      id: "geo",
      tag: "01 · ENGENHARIA DE GEOLOCALIZAÇÃO",
      title: "Prospecção Geográfica por Raio & Polígono Urbano",
      desc: "Mapeamento em milissegundos de estabelecimentos e empresas locais dentro de qualquer bairro ou raio de atendimento exato.",
      badge: "PRECISÃO 15M",
      badgeColor: "bg-violet-500/10 border-violet-400/30 text-violet-300",
      accentGlow: "group-hover:border-violet-400/60 group-hover:shadow-[0_20px_50px_-10px_rgba(167,139,250,0.25)]",
      visual: (
        <div className="bg-[#12101c] p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-violet-300 font-semibold flex items-center gap-1.5">
              <Compass size={14} className="text-violet-400 animate-spin" style={{ animationDuration: "12s" }} />
              POLÍGONO_URBANO // SP-CENTRO
            </span>
            <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              1.420 LEADS ENCONTRADOS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/5 space-y-1">
              <span className="text-white/40 block text-[9px]">RAIO DE BUSCA</span>
              <span className="text-white font-bold">2.5 km em torno</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/5 space-y-1">
              <span className="text-white/40 block text-[9px]">DENSIDADE</span>
              <span className="text-violet-300 font-bold">Alta Concorrência</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-400/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-violet-400" />
              <span className="text-white text-xs font-sans font-medium">Filtro Ativo: Bares, Restaurantes & Padarias</span>
            </div>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
        </div>
      )
    },
    {
      id: "enrich",
      tag: "02 · DADOS VERIFICADOS EM TEMPO REAL",
      title: "Enriquecimento Síncrono de CNPJ & Quadro de Sócios",
      desc: "Validação instantânea via consulta pública e checagem de telefones via teste de linha ativo para zerar leads inválidos.",
      badge: "100% LGPD COMPLIANT",
      badgeColor: "bg-pink-500/10 border-pink-400/30 text-pink-300",
      accentGlow: "group-hover:border-pink-400/60 group-hover:shadow-[0_20px_50px_-10px_rgba(244,114,182,0.25)]",
      visual: (
        <div className="bg-[#12101c] p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-pink-300 font-semibold flex items-center gap-1.5">
              <Database size={14} className="text-pink-400" />
              RECEITA_FEDERAL // CONSULTA SÍNCRONA
            </span>
            <span className="text-xs text-white/50">STATUS: ATIVA</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/5">
              <span className="text-white/60">Razão Social:</span>
              <span className="text-white font-semibold font-sans">Bella Vista Alimentos LTDA</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/5">
              <span className="text-white/60">Sócio Administrador:</span>
              <span className="text-pink-300 font-semibold font-sans">Carlos Eduardo Silva</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/5">
              <span className="text-white/60">WhatsApp Direto:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <PhoneCall size={11} /> (11) 98765-4321 ✓
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai",
      tag: "03 · INTELIGÊNCIA COMERCIAL IA",
      title: "Scripts & Abordagens Personalizadas com IA",
      desc: "A inteligência artificial analisa os dados do lead e gera uma copy de abordagem altamente persuasiva adaptada para WhatsApp e e-mail.",
      badge: "3.4X MAIOR RESPOSTA",
      badgeColor: "bg-amber-500/10 border-amber-400/30 text-amber-300",
      accentGlow: "group-hover:border-amber-400/60 group-hover:shadow-[0_20px_50px_-10px_rgba(251,191,36,0.25)]",
      visual: (
        <div className="bg-[#12101c] p-6 rounded-2xl border border-white/10 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              ACHEAQUI_IA // GENERATOR
            </span>
            <span className="text-[10px] text-white/40">COPY PARA WHATSAPP</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-white/90 leading-relaxed font-sans italic text-[0.8125rem]">
            &quot;Olá Carlos! Vi que a Bella Vista expandiu na região central de SP. Criamos uma solução de abastecimento B2B que reduz custos operacionais em até 22%. Podemos conversar 5 min no WhatsApp?&quot;
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
            <span>TOM: PROFISSIONAL & DIRETO</span>
            <span className="text-amber-400 font-semibold">98.4% SCORE DE RELEVÂNCIA</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-24 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-violet-600/15 via-pink-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Pill Header */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/12 text-xs font-semibold font-mono text-violet-300 tracking-wider uppercase hover:border-violet-400/40 transition-all cursor-default">
            <Sparkles size={13} className="text-violet-400" />
            <span>TECNOLOGIA DE PROSPECÇÃO B2B</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-normal text-white mb-5 font-serif-editorial leading-tight">
            Três pilares para dominar a prospecção comercial.
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-sans max-w-xl mx-auto leading-relaxed">
            Elimine planilhas manuais e descubra contatos verificados de tomadores de decisão em segundos.
          </p>
        </div>

        {/* Grid of 3 Main Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className={`group bg-[#171523]/80 backdrop-blur-xl border border-white/12 rounded-3xl p-7 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer ${item.accentGlow}`}
            >
              <div>
                {/* Header Tag & Badge */}
                <div className="flex items-center justify-between mb-4 font-mono">
                  <span className="text-[10px] text-white/40 tracking-widest font-semibold group-hover:text-violet-300 transition-colors">
                    {item.tag}
                  </span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-violet-200 transition-colors leading-snug font-sans">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-white/60 leading-relaxed font-sans mb-6 group-hover:text-white/80 transition-colors">
                  {item.desc}
                </p>

                {/* Interactive Visual Box */}
                <div className="mb-6 group-hover:scale-[1.01] transition-transform duration-300">
                  {item.visual}
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/70 group-hover:text-violet-300 transition-colors">
                <span>Explorar Recurso</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
