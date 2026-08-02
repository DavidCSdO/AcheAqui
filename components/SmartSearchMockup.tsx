"use client";

import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { Search, List, MapPin, Table, Star, Phone, Mail } from "lucide-react";

import { createClient } from "@/utils/supabase/client";

export default function SmartSearchMockup() {
  const ref = useScrollReveal();
  const [view, setView] = useState<"lista" | "mapa" | "tabela">("lista");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (data && data.length > 0) {
        setResults(data);
      } else {
        // Fallback to mock data if database is empty
        setResults([
          { name: "Sorridents Odontologia Paulista", category: "Clínica Odontológica", address: "Av. Paulista, 1000 — São Paulo", phone: "+55 11 3288-1200", email: "paulista@sorridents.com.br", google_rating: 4.9 },
          { name: "Dental Spec Pinheiros", category: "Implantes & Ortodontia", address: "R. dos Pinheiros, 450 — São Paulo", phone: "+55 11 3031-9988", email: "contato@dentalspec.com.br", google_rating: 4.8 },
          { name: "Instituto Odonto Moema", category: "Odontologia Estética", address: "Av. Moema, 310 — São Paulo", phone: "+55 11 5052-7700", email: "atendimento@iomoema.com.br", google_rating: 5.0 },
          { name: "OdontoCare Itaim Bibi", category: "Cirurgia & Geral", address: "R. Joaquim Floriano, 820 — São Paulo", phone: "+55 11 3168-4040", email: "itaim@odontocare.com.br", google_rating: 4.7 },
        ]);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section id="pesquisa-inteligente" className="section-padding bg-white relative">
      <div className="container-wide px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal" ref={ref}>
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Pesquisa Inteligente
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Uma experiência de busca que impressiona
          </h2>
          <p className="text-body-lg">
            Filtros avançados, visualização em lista, mapa ou tabela — tudo com velocidade de resposta instantânea.
          </p>
        </div>

        {/* Mockup Frame */}
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] border border-white/[0.06] shadow-[0_32px_80px_-12px_rgba(13,27,42,0.3)] overflow-hidden">

          {/* App Bar */}
          <div className="px-6 py-4 bg-white/[0.03] border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3 bg-white/[0.04] px-4 py-2.5 rounded-[var(--radius-sm)] border border-white/[0.06] search-glow max-w-xl">
              <Crosshair size={16} className="text-[var(--color-secondary)] shrink-0" />
              <span className="text-[0.8125rem] text-white/80 font-medium">Clínicas Odontológicas em São Paulo</span>
              <span className="text-[0.6875rem] text-white/20 font-mono ml-auto hidden sm:inline">⌘K</span>
            </div>

            <div className="flex items-center bg-white/[0.04] p-1 rounded-[var(--radius-sm)] border border-white/[0.06]">
              {(["lista", "mapa", "tabela"] as const).map((v) => {
                const icons = { lista: List, mapa: MapPin, tabela: Table };
                const Icon = icons[v];
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-[0.75rem] font-semibold transition-all duration-200 capitalize ${
                      view === v
                        ? "bg-[var(--color-secondary)] text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    <Icon size={13} />
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 min-h-[360px]">
            {view === "lista" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((r, i) => (
                  <div key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-violet-400/50 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(167,139,250,0.2)] transition-all duration-300 space-y-3 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-[0.9375rem] font-semibold text-white group-hover:text-violet-300 transition-colors">{r.name}</h4>
                        <p className="text-[0.75rem] text-white/40">{r.category}</p>
                      </div>
                      <span className="text-[0.6875rem] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                        ⭐ {r.google_rating || '5.0'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center gap-4 text-[0.6875rem] font-mono">
                      <span className="text-emerald-400/80 flex items-center gap-1 group-hover:text-emerald-300 transition-colors"><Phone size={11} />{r.phone || 'N/A'}</span>
                      <span className="text-blue-400/80 flex items-center gap-1 truncate group-hover:text-violet-300 transition-colors"><Mail size={11} />{r.email || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "mapa" && (
              <div className="relative h-[340px] rounded-[var(--radius)] bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundSize: "40px 40px",
                  backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)"
                }} />
                {results.map((r, i) => (
                  <div key={i} className="absolute group cursor-pointer" style={{ top: `${20 + i * 20}%`, left: `${15 + i * 22}%` }}>
                    <div className="flex items-center gap-2 bg-[#171523] border border-violet-500/50 px-3.5 py-1.5 rounded-full text-[0.6875rem] font-semibold text-white shadow-xl hover:bg-violet-600 hover:border-violet-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] hover:scale-105 transition-all duration-300">
                      <Crosshair size={12} className="text-violet-400 group-hover:rotate-180 transition-transform duration-500" />
                      {r.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "tabela" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[0.6875rem] uppercase tracking-[0.08em] text-white/25 font-mono">
                      <th className="p-3">Empresa</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">E-mail</th>
                      <th className="p-3 text-right">Nota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-white/[0.06] hover:text-white transition-all duration-200 text-[0.8125rem] cursor-pointer group">
                        <td className="p-3 font-semibold text-white group-hover:text-violet-300 transition-colors">{r.name}</td>
                        <td className="p-3 text-white/40 group-hover:text-white/60 transition-colors">{r.category || '-'}</td>
                        <td className="p-3 font-mono text-emerald-400/80 text-[0.75rem] group-hover:text-emerald-300 transition-colors">{r.phone || '-'}</td>
                        <td className="p-3 font-mono text-blue-400/80 text-[0.75rem] group-hover:text-violet-300 transition-colors">{r.email || '-'}</td>
                        <td className="p-3 text-right text-amber-400 font-semibold">⭐ {r.google_rating || '5.0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[0.6875rem] text-white/25 font-mono">
            <span>4 de 2.483 registros</span>
            <span className="flex items-center gap-2">
              <Crosshair size={11} className="text-blue-400" />
              Sincronização em tempo real
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
