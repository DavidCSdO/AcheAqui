"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Cpu, ShieldCheck, Zap, Layers, Terminal } from "lucide-react";

export default function BentoGridSection() {
  return (
    <section id="recursos" className="relative py-28 bg-[#07080a] border-t border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Tag & Headline */}
        <div className="flex items-center gap-2 font-tech-mono text-[11px] text-cyan-400 mb-3 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>[ ECOSSISTEMA DE RECURSOS ]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-14">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-normal text-white leading-tight font-sans">
              Engenharia de precisão para <span className="font-serif-display text-cyan-300">times comerciais</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
            Unificamos busca síncrona por IA, dados de contato verificados e geradores de abordagem automática em uma única plataforma minimalista.
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bento Item 1: Main Platform & Brand Asset */}
          <div className="md:col-span-2 card-editorial p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group bg-[#090b10]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-tech-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  PLATAFORMA MULTI-HUB
                </span>
                <span className="font-tech-mono text-[10px] text-slate-500">AI ENGINE GROUNDING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-normal text-white mb-3 leading-tight font-sans">
                Hub unificado para <span className="font-serif-display text-cyan-300">empresas, vagas & serviços</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mb-6 leading-relaxed">
                Alterne instantaneamente entre captar empresas B2B, localizar vagas abertas com e-mail direto do RH e solicitar orçamentos para prestadores autônomos sem sair do mesmo ambiente.
              </p>
            </div>

            {/* Visual Asset from public/images */}
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-cyan-500/30 transition-all duration-300">
              <Image
                src="/images/acheaqui.png"
                alt="AcheAqui Platform Visual"
                fill
                className="object-cover object-top filter contrast-105"
              />
            </div>
          </div>

          {/* Bento Item 2: Performance */}
          <div className="card-editorial p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group bg-[#090b10]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mb-6 font-tech-mono text-xs">
                &lt;/&gt;
              </div>

              <span className="font-tech-mono text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">
                EXECUÇÃO SÍNCRONA
              </span>
              <h3 className="text-xl font-normal text-white mb-2 font-sans">
                Zero Scraping Lento
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Consultas diretamente integradas ao motor de Inteligência Artificial para entregar dados atualizados e precisos sem atrasos de navegadores síncronos.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-between text-xs font-tech-mono text-slate-300">
              <span>RESPOSTA MÉDIA</span>
              <span className="text-cyan-400">&lt; 14ms SLA</span>
            </div>
          </div>

          {/* Bento Item 3: BaseKit & CRM Asset */}
          <div className="card-editorial p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group bg-[#090b10]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mb-6">
                <ShieldCheck size={20} />
              </div>

              <span className="font-tech-mono text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">
                INTEGRAÇÃO PROPRIA
              </span>
              <h3 className="text-xl font-normal text-white mb-2 font-sans">
                CRM & Exportação
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Organize e salve os contatos capturados diretamente no seu painel de gerenciamento de leads com suporte a exportação CSV/JSON.
              </p>
            </div>

            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-all">
              <Image
                src="/images/basekit.png"
                alt="BaseKit CRM Interface"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Bento Item 4: AI Copywriter */}
          <div className="md:col-span-2 card-editorial p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 group bg-[#090b10]">
            <div className="max-w-md">
              <span className="font-tech-mono text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">
                GERAÇÃO DE SCRIPTS
              </span>
              <h3 className="text-2xl font-normal text-white mb-3 font-sans">
                Pitches sob medida para <span className="font-serif-display text-cyan-300">WhatsApp & E-mail</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Crie abordagens comerciais B2B, cartas de apresentação formais para RH ou pedidos de orçamento sob medida em segundos.
              </p>

              <a href="/auth" className="btn-pill-cyan">
                <span>Testar Busca Inteligente</span>
                <ArrowRight size={13} />
              </a>
            </div>

            <div className="relative w-full sm:w-72 h-44 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#050608] p-2">
              <Image
                src="/images/iconsf.png"
                alt="AcheAqui Iconography & UI Elements"
                fill
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
