"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { Megaphone, Briefcase, UserCheck, TrendingUp, Store, Home, Users, UserPlus, Target } from "lucide-react";

const CASES = [
  { title: "Agências de Marketing", desc: "Prospecção ativa de novos clientes para contratos de gestão e tráfego.", icon: Megaphone },
  { title: "Consultores B2B", desc: "Mapeamento rápido de empresas alvo com contatos diretos.", icon: Briefcase },
  { title: "Representantes Comerciais", desc: "Encontre distribuidores e pontos de venda em qualquer cidade.", icon: UserCheck },
  { title: "Equipes de Marketing", desc: "Alimente campanhas de Outbound e ABM com listas verificadas.", icon: TrendingUp },
  { title: "Franquias & Expansão", desc: "Mapeie praças potenciais e a concorrência do segmento.", icon: Store },
  { title: "Imobiliárias", desc: "Encontre proprietários e empresas em expansão na região.", icon: Home },
  { title: "RH & Headhunters", desc: "Mapeie empresas para recrutamento cirúrgico de talentos.", icon: Users },
  { title: "Recrutamento", desc: "Acesse contatos de RH em milhares de corporações.", icon: UserPlus },
  { title: "Times de Vendas", desc: "Alimente o CRM com leads prontos para abordagem.", icon: Target },
];

export default function UseCasesSection() {
  const containerRef = useStaggerReveal();

  return (
    <section className="section-padding bg-white relative">
      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Casos de Uso
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Para quem precisa gerar receita B2B
          </h2>
          <p className="text-body-lg">
            Diferentes perfis, um objetivo em comum: mais pipeline, mais receita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`reveal reveal-delay-${Math.min(idx + 1, 8)} group card p-7 space-y-4 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(167,139,250,0.18)] hover:border-violet-400/50 transition-all duration-300 cursor-pointer`}>
                <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] group-hover:scale-110 group-hover:bg-violet-500/10 group-hover:border-violet-400/40 group-hover:text-violet-600 transition-all duration-300 shadow-sm">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="text-[1rem] font-semibold text-[var(--color-text-primary)] tracking-[-0.01em] group-hover:text-violet-600 transition-colors">{item.title}</h3>
                <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-relaxed group-hover:text-slate-700 transition-colors">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
