"use client";

import React from "react";
import { MapPin, ShieldCheck, Zap, Building2, CheckCircle2 } from "lucide-react";

export default function CityMarquee() {
  const items = [
    { type: "city", label: "São Paulo, SP" },
    { type: "badge", label: "RFB CNPJ VALIDADOS", icon: ShieldCheck, color: "text-emerald-400" },
    { type: "city", label: "Rio de Janeiro, RJ" },
    { type: "badge", label: "PRECISÃO DE 15M", icon: MapPin, color: "text-violet-400" },
    { type: "city", label: "Curitiba, PR" },
    { type: "badge", label: "100% LGPD COMPLIANT", icon: CheckCircle2, color: "text-pink-400" },
    { type: "city", label: "Belo Horizonte, MG" },
    { type: "badge", label: "RESPOSTA SÍNCRONA", icon: Zap, color: "text-amber-400" },
    { type: "city", label: "Brasília, DF" },
    { type: "city", label: "Salvador, BA" },
    { type: "city", label: "Porto Alegre, RS" },
    { type: "city", label: "Fortaleza, CE" },
    { type: "city", label: "Recife, PE" },
    { type: "city", label: "Florianópolis, SC" }
  ];

  return (
    <section className="bg-[#171523] py-5 border-y border-white/10 overflow-hidden relative select-none">
      {/* Side Vignette Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#171523] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#171523] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee-continuous">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 mx-6 font-mono text-xs text-white/70"
            >
              {item.type === "badge" && Icon ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-xs hover:scale-105 hover:border-violet-400/50 hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(167,139,250,0.2)] transition-all duration-300 cursor-pointer">
                  <Icon size={13} className={`${item.color} transition-transform duration-300 group-hover:scale-110`} />
                  <span className="font-semibold text-[11px] text-white tracking-wider">
                    {item.label}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/[0.08] px-2.5 py-1 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer">
                  <Building2 size={13} className="text-violet-400/80" />
                  <span className="font-sans text-xs font-medium tracking-tight">
                    {item.label}
                  </span>
                  <span className="text-white/20 ml-2">•</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
