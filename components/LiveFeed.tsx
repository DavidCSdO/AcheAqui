"use client";

import React, { useState, useEffect } from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";

interface LiveCompany {
  id: number;
  name: string;
  category: string;
  timestamp: string;
}

const FEED_POOL: LiveCompany[] = [
  { id: 1, name: "Sorridents Odontologia", category: "Clínica Odontológica", timestamp: "agora" },
  { id: 2, name: "Espaço Laser Moema", category: "Estética & Beleza", timestamp: "há 2s" },
  { id: 3, name: "Dr. Consulta Pinheiros", category: "Centro de Saúde", timestamp: "há 4s" },
  { id: 4, name: "St. Marche Moema", category: "Varejo Gourmet", timestamp: "há 6s" },
  { id: 5, name: "Bio Ritmo Jardins", category: "Fitness", timestamp: "há 8s" },
  { id: 6, name: "Toledo & Advogados", category: "Advocacia B2B", timestamp: "há 10s" },
  { id: 7, name: "Agência Digital Growth", category: "Marketing", timestamp: "há 12s" },
  { id: 8, name: "Logística Express", category: "Transportes", timestamp: "há 14s" },
];

export default function LiveFeed() {
  const containerRef = useStaggerReveal();
  const [feed, setFeed] = useState<LiveCompany[]>(FEED_POOL.slice(0, 6));

  useEffect(() => {
    let idx = 6;
    const interval = setInterval(() => {
      const item = { ...FEED_POOL[idx % FEED_POOL.length], id: Date.now(), timestamp: "agora" };
      setFeed((prev) => [item, ...prev.slice(0, 5)]);
      idx++;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live-feed" className="section-padding bg-[var(--color-primary)] relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={600} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        {/* Header */}
        <div className="max-w-2xl mb-16 reveal">
          <div className="section-tag bg-white/[0.06] border-white/[0.08] text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Painel de Captura ao Vivo
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-white mb-4">
            Empresas sendo encontradas agora
          </h2>
          <p className="text-[1rem] text-white/50 leading-relaxed">
            Varredura contínua de bases públicas, Google Maps e registros oficiais em todo o Brasil.
          </p>
        </div>

        {/* Live Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feed.map((item, idx) => (
            <div
              key={item.id}
              className={`animate-fade-in card-dark p-6 space-y-4 ${
                idx === 0 ? "ring-1 ring-[var(--color-secondary)]/20 border-[var(--color-secondary)]/30" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/30 font-mono font-semibold">
                      Empresa Encontrada
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] text-[0.625rem] font-mono animate-pulse">
                        NOVO
                      </span>
                    )}
                  </div>
                  <h3 className="text-[0.9375rem] font-semibold text-white">{item.name}</h3>
                  <span className="text-[0.75rem] text-white/35">{item.category}</span>
                </div>
                <span className="text-[0.6875rem] font-mono text-white/20">{item.timestamp}</span>
              </div>

              {/* Verified Data Badges */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Phone, label: "Telefone", color: "text-blue-400" },
                  { icon: Mail, label: "E-mail", color: "text-indigo-400" },
                  { icon: InstagramIcon, label: "Instagram", color: "text-pink-400" },
                  { icon: LinkedinIcon, label: "LinkedIn", color: "text-blue-300" },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-white/[0.03] border border-white/[0.05]"
                  >
                    <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/40">
                      <Icon size={11} className={color} />
                      {label}
                    </span>
                    <CheckCircle2 size={13} className="text-emerald-400/80" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
