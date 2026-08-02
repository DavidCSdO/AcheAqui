"use client";

import React, { useState, useEffect } from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { CheckCircle2, Phone, Mail, MapPin, Building2, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";

interface LiveCompany {
  id: number;
  name: string;
  category: string;
  timestamp: string;
  cnpj: string;
  location: string;
  score: number;
  phone: string;
}

const FEED_POOL: LiveCompany[] = [
  { id: 1, name: "Sorridents Odontologia", category: "Clínica Odontológica", timestamp: "agora", cnpj: "14.829.102/0001-88", location: "São Paulo, SP", score: 98, phone: "(11) 98412-****" },
  { id: 2, name: "Espaço Laser Moema", category: "Estética & Beleza", timestamp: "há 2s", cnpj: "09.112.441/0001-12", location: "São Paulo, SP", score: 96, phone: "(11) 97100-****" },
  { id: 3, name: "Dr. Consulta Pinheiros", category: "Centro de Saúde", timestamp: "há 4s", cnpj: "19.553.882/0001-05", location: "São Paulo, SP", score: 99, phone: "(11) 96311-****" },
  { id: 4, name: "St. Marche Moema", category: "Varejo Gourmet", timestamp: "há 6s", cnpj: "02.771.901/0001-44", location: "São Paulo, SP", score: 94, phone: "(11) 95521-****" },
  { id: 5, name: "Bio Ritmo Jardins", category: "Fitness", timestamp: "há 8s", cnpj: "01.442.990/0001-30", location: "São Paulo, SP", score: 97, phone: "(11) 94812-****" },
  { id: 6, name: "Toledo & Advogados", category: "Advocacia B2B", timestamp: "há 10s", cnpj: "28.301.552/0001-90", location: "Curitiba, PR", score: 95, phone: "(41) 99120-****" },
  { id: 7, name: "Agência Digital Growth", category: "Marketing & Tech", timestamp: "há 12s", cnpj: "34.190.221/0001-10", location: "Belo Horizonte, MG", score: 96, phone: "(31) 98774-****" },
  { id: 8, name: "Logística Express Ltd", category: "Transportes", timestamp: "há 14s", cnpj: "10.450.880/0001-66", location: "Rio de Janeiro, RJ", score: 93, phone: "(21) 99402-****" },
];

export default function LiveFeed() {
  const containerRef = useStaggerReveal();
  const [feed, setFeed] = useState<LiveCompany[]>(FEED_POOL.slice(0, 6));
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
            Passe o cursor sobre os registros para inspecionar os dados capturados em tempo real.
          </p>
        </div>

        {/* Live Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feed.map((item, idx) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`animate-fade-in card-dark p-6 space-y-4 relative group transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/60 hover:shadow-[0_12px_36px_rgba(167,139,250,0.22)] ${
                idx === 0 ? "ring-1 ring-violet-500/40 border-violet-500/50 shadow-[0_4px_20px_rgba(167,139,250,0.1)]" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40 font-mono font-semibold group-hover:text-violet-300 transition-colors">
                      Capturado pela IA
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[0.625rem] font-mono animate-pulse border border-violet-400/30">
                        AGORA
                      </span>
                    )}
                  </div>
                  <h3 className="text-[0.9375rem] font-semibold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1.5">
                    {item.name}
                  </h3>
                  <span className="text-[0.75rem] text-white/40 group-hover:text-white/60 transition-colors">{item.category}</span>
                </div>
                <span className="text-[0.6875rem] font-mono text-white/30 group-hover:text-white/50 transition-colors">{item.timestamp}</span>
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
                    className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.07] group-hover:border-violet-400/20 transition-all duration-200"
                  >
                    <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/50 group-hover:text-white/80 transition-colors">
                      <Icon size={11} className={`${color} group-hover:scale-110 transition-transform`} />
                      {label}
                    </span>
                    <CheckCircle2 size={13} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>

              {/* Inspection Glassmorphic Popover on Hover */}
              {hoveredId === item.id && (
                <div className="absolute inset-x-2 -bottom-16 z-30 bg-[#171523]/95 backdrop-blur-xl border border-violet-400/40 p-3.5 rounded-2xl shadow-2xl animate-fade-in flex items-center justify-between pointer-events-none">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/60">
                      <span className="text-emerald-400 font-bold">🟢 CNPJ:</span> {item.cnpj}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                      <MapPin size={11} className="text-violet-400" /> {item.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                    <div className="text-right">
                      <div className="text-[9px] font-mono uppercase text-white/40">Score Lead</div>
                      <div className="text-xs font-bold font-mono text-emerald-400">{item.score}/100</div>
                    </div>
                    <Sparkles size={14} className="text-violet-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
