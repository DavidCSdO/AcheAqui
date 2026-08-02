"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { Search, Database, Download, DollarSign } from "lucide-react";

const STEPS = [
  { num: "01", title: "Pesquisar", desc: "Digite o segmento e a cidade. Nossa IA encontra automaticamente.", icon: Search },
  { num: "02", title: "Encontrar", desc: "Varredura inteligente em bases públicas com enriquecimento de contatos.", icon: Database },
  { num: "03", title: "Exportar", desc: "Baixe em CSV/Excel ou sincronize direto com seu CRM favorito.", icon: Download },
  { num: "04", title: "Vender", desc: "Aborde decisores com contatos validados. Multiplique reuniões.", icon: DollarSign },
];

export default function HowItWorks() {
  const containerRef = useStaggerReveal();

  return (
    <section id="como-funciona" className="section-padding bg-[var(--color-surface)] relative">
      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 reveal">
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Como funciona
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Da pesquisa ao fechamento em 4 passos
          </h2>
          <p className="text-body-lg">
            Um fluxo intuitivo pensado para maximizar a velocidade do seu pipeline comercial.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-violet-500/30 via-violet-400 to-pink-500/30 laser-stream-line rounded-full z-10 shadow-[0_0_10px_rgba(167,139,250,0.5)]" />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className={`reveal reveal-delay-${idx + 1} card p-8 relative`}>
                {/* Number & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)]">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="text-[2.5rem] font-bold text-[var(--color-border)] font-numbers leading-none">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-[1.125rem] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-2">
                  {step.title}
                </h3>
                <p className="text-[0.875rem] text-[var(--color-text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
