"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "O AcheAqui transformou nossa prospecção. Em 10 minutos montamos uma lista de 500 academias com telefone direto e e-mail dos sócios. Fechamos 14 novos contratos no primeiro mês.",
    name: "Rodrigo Alencar",
    role: "Head de Growth",
    company: "Nexus Marketing",
    initials: "RA",
  },
  {
    quote: "A qualidade dos telefones celulares e o link direto para WhatsApp economiza 3 horas por dia do nosso time de SDRs. Não perdemos tempo com números que não atendem.",
    name: "Camila Vasconcelos",
    role: "Diretora Comercial",
    company: "SaaS Flow",
    initials: "CV",
  },
  {
    quote: "Usamos a API para enriquecer cadastros no CRM via n8n. O retorno do investimento foi imediato na primeira semana de operação.",
    name: "Lucas Mendes",
    role: "CTO & Co-founder",
    company: "Fintech ScaleUp",
    initials: "LM",
  },
];

export default function TestimonialsSection() {
  const containerRef = useStaggerReveal();

  return (
    <section className="section-padding bg-[var(--color-surface)] relative">
      <div className="absolute right-[-5%] top-1/3 text-[var(--color-text-primary)] opacity-[0.015] pointer-events-none">
        <Crosshair size={500} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Depoimentos
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Quem usa, recomenda
          </h2>
          <p className="text-body-lg">
            Líderes comerciais que utilizam a plataforma diariamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className={`reveal reveal-delay-${idx + 1} group card p-8 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(167,139,250,0.18)] hover:border-violet-400/50 transition-all duration-300 cursor-pointer`}>
              <div className="space-y-5">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>

                <p className="text-[0.9375rem] text-[var(--color-text-secondary)] leading-[1.75] italic group-hover:text-slate-900 transition-colors">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white text-[0.6875rem] font-bold flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md shadow-violet-500/20">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold text-[var(--color-text-primary)] group-hover:text-violet-600 transition-colors">{t.name}</h4>
                  <p className="text-[0.75rem] text-[var(--color-text-muted)]">
                    {t.role} · <span className="text-[var(--color-secondary)] font-medium">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
