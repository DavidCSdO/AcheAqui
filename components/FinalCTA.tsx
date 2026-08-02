"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  const ref = useScrollReveal();

  return (
    <section id="comecar" className="section-padding bg-[var(--color-primary)] text-white relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none">
        <Crosshair size={900} strokeWidth={0.75} />
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10 reveal" ref={ref}>

        <h2 className="text-display text-[clamp(2rem,4.5vw,3.25rem)] text-white mb-6">
          Pronto para transformar sua prospecção?
        </h2>

        <p className="text-[1.125rem] text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
          Crie sua conta gratuitamente e faça suas primeiras buscas com dados validados.
        </p>

        <a
          href="/auth"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-[var(--radius)] bg-white text-[var(--color-primary)] font-bold text-[1rem] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 shadow-[0_12px_40px_-4px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_45px_rgba(167,139,250,0.4)]"
        >
          <Crosshair size={18} className="text-violet-500 group-hover:rotate-180 transition-transform duration-700 ease-out" />
          Começar gratuitamente
          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </a>

        <div className="flex items-center justify-center gap-6 text-[0.75rem] text-white/30 mt-8 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            Sem cartão
          </span>
          <span>·</span>
          <span>100 créditos grátis</span>
          <span>·</span>
          <span>Suporte 24/7</span>
        </div>

      </div>
    </section>
  );
}
