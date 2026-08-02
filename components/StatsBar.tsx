"use client";

import React from "react";
import { useCountUp } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";

export default function StatsBar() {
  const s1 = useCountUp(24, 2000);
  const s2 = useCountUp(5570, 2000);
  const s3 = useCountUp(100, 2000);

  return (
    <section className="py-20 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={400} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center text-center md:divide-x md:divide-white/10" ref={s1.ref}>
          <div className="space-y-2 px-4">
            <div className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold font-mono tracking-tight text-white leading-none">
              +{(s1.count / 10).toFixed(1)}M
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-violet-400 font-semibold font-mono">
              Empresas Mapeadas
            </div>
          </div>

          <div className="space-y-2 px-4" ref={s2.ref}>
            <div className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold font-mono tracking-tight text-white leading-none">
              {s2.count.toLocaleString()}
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-pink-400 font-semibold font-mono">
              Municípios Brasileiros
            </div>
          </div>

          <div className="space-y-2 px-4" ref={s3.ref}>
            <div className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold font-mono tracking-tight text-white leading-none">
              {s3.count}%
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-amber-400 font-semibold font-mono">
              LGPD Compliant
            </div>
          </div>

          <div className="space-y-2 px-4">
            <div className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold font-mono tracking-tight text-emerald-400 leading-none">
              99.9%
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
              Assertividade de Dados
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
