"use client";

import React from "react";
import { useCountUp } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";

export default function StatsBar() {
  const s1 = useCountUp(40, 2200);
  const s2 = useCountUp(200, 2200);
  const s3 = useCountUp(190, 2200);

  return (
    <section className="section-padding bg-[var(--color-primary)] text-white relative overflow-hidden">
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={400} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 items-center text-center md:divide-x md:divide-white/[0.06]" ref={s1.ref}>
          <div className="space-y-2 px-4">
            <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold font-numbers tracking-[-0.03em] text-white leading-none">
              +{s1.count}M
            </div>
            <div className="text-[0.6875rem] uppercase tracking-[0.1em] text-blue-400 font-semibold">
              Empresas Mapeadas
            </div>
          </div>

          <div className="space-y-2 px-4" ref={s2.ref}>
            <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold font-numbers tracking-[-0.03em] text-white leading-none">
              +{s2.count}M
            </div>
            <div className="text-[0.6875rem] uppercase tracking-[0.1em] text-indigo-400 font-semibold">
              Contatos Validados
            </div>
          </div>

          <div className="space-y-2 px-4" ref={s3.ref}>
            <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold font-numbers tracking-[-0.03em] text-white leading-none">
              {s3.count}
            </div>
            <div className="text-[0.6875rem] uppercase tracking-[0.1em] text-purple-400 font-semibold">
              Países Cobertos
            </div>
          </div>

          <div className="space-y-2 px-4">
            <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold font-numbers tracking-[-0.03em] text-emerald-400 leading-none">
              99,9%
            </div>
            <div className="text-[0.6875rem] uppercase tracking-[0.1em] text-emerald-400 font-semibold">
              Disponibilidade
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
