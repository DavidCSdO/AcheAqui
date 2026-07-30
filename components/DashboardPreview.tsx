"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { LayoutDashboard, Building2, Search, Download, Key, Settings, Plus, BarChart3 } from "lucide-react";

export default function DashboardPreview() {
  const ref = useScrollReveal();
  const [tab, setTab] = useState("Dashboard");

  return (
    <section id="dashboard" className="section-padding bg-[var(--color-primary)] text-white relative overflow-hidden">
      <div className="absolute left-[-8%] top-1/3 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={700} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal" ref={ref}>
          <div className="section-tag bg-white/[0.06] border-white/[0.08] text-white/60 mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-blue-400" />
            Dashboard
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-white mb-4">
            Gestão completa de prospecção
          </h2>
          <p className="text-[1rem] text-white/40 leading-relaxed">
            Monitore capturas, pesquisas e exportações com uma interface inspirada no Linear e Vercel.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="rounded-[var(--radius-lg)] border border-white/[0.06] bg-white/[0.02] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.4)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">

          {/* Sidebar */}
          <div className="lg:col-span-3 bg-white/[0.02] border-r border-white/[0.06] p-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-[8px] bg-[var(--color-secondary)] flex items-center justify-center text-white">
                  <Crosshair size={14} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[0.875rem] font-bold text-white tracking-[-0.01em]">AcheAqui</span>
                  <span className="block text-[0.5625rem] text-white/25 font-mono">v2.4 Enterprise</span>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { n: "Dashboard", i: LayoutDashboard },
                  { n: "Empresas", i: Building2 },
                  { n: "Pesquisas", i: Search },
                  { n: "Exportações", i: Download },
                  { n: "API", i: Key },
                  { n: "Configurações", i: Settings },
                ].map(({ n, i: Icon }) => (
                  <button key={n} onClick={() => setTab(n)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-[0.8125rem] font-medium transition-all duration-200 ${
                      tab === n ? "bg-[var(--color-secondary)]/15 text-blue-400 border border-blue-500/20" : "text-white/35 hover:text-white/60 hover:bg-white/[0.03] border border-transparent"
                    }`}>
                    <Icon size={15} />
                    {n}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-3 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] text-white text-[0.625rem] font-bold flex items-center justify-center">AC</div>
              <div className="text-[0.6875rem] overflow-hidden">
                <span className="font-semibold text-white block truncate">Sua Empresa</span>
                <span className="text-emerald-400 font-mono text-[0.5625rem]">● Enterprise</span>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-9 p-6 space-y-6 overflow-y-auto">
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div>
                <h3 className="text-[1.125rem] font-bold text-white tracking-[-0.01em]">Painel Geral</h3>
                <p className="text-[0.75rem] text-white/30">Visão consolidada de capturas e contatos</p>
              </div>
              <div className="flex items-center gap-2.5">
                <a href="/auth" className="px-3.5 py-2 rounded-[var(--radius-sm)] bg-white/[0.04] border border-white/[0.06] text-white/60 text-[0.75rem] font-medium hover:border-white/15 transition flex items-center gap-2">
                  <Download size={13} />
                  Exportar
                </a>
                <a href="/auth" className="px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--color-secondary)] text-white text-[0.75rem] font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                  <Plus size={13} />
                  Nova Busca
                </a>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total Prospecções", value: "148.520", change: "+14.2%", color: "text-white" },
                { label: "Telefones Válidos", value: "124.910", change: "84.1%", color: "text-emerald-400" },
                { label: "E-mails Decisores", value: "98.400", change: "99.2%", color: "text-blue-400" },
                { label: "Tempo Médio", value: "0.4s", change: "Rápido", color: "text-purple-400" },
              ].map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.05] space-y-1.5">
                  <span className="text-[0.625rem] uppercase tracking-[0.08em] text-white/25 font-mono font-semibold">{kpi.label}</span>
                  <div className={`text-[1.5rem] font-bold font-numbers tracking-[-0.02em] ${kpi.color}`}>{kpi.value}</div>
                  <span className="text-[0.625rem] text-emerald-400 font-mono">{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="p-5 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center justify-between mb-4 text-[0.75rem]">
                <span className="font-semibold text-white flex items-center gap-2">
                  <BarChart3 size={14} className="text-blue-400" />
                  Volume de Captura Semanal
                </span>
                <span className="text-emerald-400 font-mono text-[0.6875rem]">Meta: 128%</span>
              </div>
              <div className="h-36 w-full relative">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 640 144">
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 110 Q 80 30, 160 80 T 320 40 T 480 70 T 640 15 L 640 144 L 0 144 Z" fill="url(#cg)" />
                  <path d="M 0 110 Q 80 30, 160 80 T 320 40 T 480 70 T 640 15" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="p-4 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between text-[0.6875rem] font-mono text-white/25 mb-2">
                <span className="font-semibold text-white text-[0.8125rem]">Últimas Pesquisas</span>
                <span className="text-blue-400 cursor-pointer hover:underline">Ver tudo</span>
              </div>
              {[
                { q: "Restaurantes em São Paulo", n: "2.483", t: "2 min" },
                { q: "Academias em Curitiba", n: "1.204", t: "12 min" },
                { q: "Clínicas em BH", n: "980", t: "45 min" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/[0.04]">
                  <span className="flex items-center gap-2 text-[0.8125rem] text-white/70">
                    <Crosshair size={12} className="text-blue-400" />
                    {s.q}
                  </span>
                  <div className="flex items-center gap-4 text-[0.6875rem] font-mono">
                    <span className="text-emerald-400">{s.n}</span>
                    <span className="text-white/20">há {s.t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
