"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { LayoutDashboard, Building2, Search, Download, Key, Settings, Plus, BarChart3, MapPin, Zap, CheckCircle2 } from "lucide-react";

export default function DashboardPreview() {
  const ref = useScrollReveal();
  const [tab, setTab] = useState("Dashboard");

  const tabData: Record<string, { kpis: Array<{ label: string; value: string; change: string; color: string }>; chartMeta: string }> = {
    Dashboard: {
      kpis: [
        { label: "Total Prospecções", value: "148.520", change: "+14.2%", color: "text-white" },
        { label: "Telefones Válidos", value: "124.910", change: "84.1%", color: "text-emerald-400" },
        { label: "E-mails Decisores", value: "98.400", change: "99.2%", color: "text-violet-400" },
        { label: "Tempo Médio", value: "0.4s", change: "Síncrono", color: "text-pink-400" },
      ],
      chartMeta: "Meta Global: 128%",
    },
    Empresas: {
      kpis: [
        { label: "Empresas com CNPJ", value: "2.400.000", change: "100% RFB", color: "text-white" },
        { label: "Endereços Geolocalizados", value: "2.350.000", change: "98.0%", color: "text-emerald-400" },
        { label: "Sócios & Sócios-Administradores", value: "1.920.000", change: "Completo", color: "text-violet-400" },
        { label: "Faturamento Presumido", value: "R$ 4.2B", change: "+18%", color: "text-amber-400" },
      ],
      chartMeta: "Bases Atualizadas: Hoje",
    },
    Pesquisas: {
      kpis: [
        { label: "Consultas por Minuto", value: "4.850", change: "Alta Vel.", color: "text-white" },
        { label: "Assertividade de Filtros", value: "99.8%", change: "+0.4%", color: "text-emerald-400" },
        { label: "Buscas por RAIO/GPS", value: "85.200", change: "Geofence", color: "text-violet-400" },
        { label: "Palavras-Chave IA", value: "12.400", change: "Semântico", color: "text-cyan-400" },
      ],
      chartMeta: "SLA de Resposta: 14ms",
    },
    Exportações: {
      kpis: [
        { label: "CSV / Excel Gerados", value: "42.100", change: "Direto", color: "text-white" },
        { label: "Integrações CRM", value: "18.400", change: "Webhooks", color: "text-emerald-400" },
        { label: "Leads Enviados ao HubSpot", value: "35.900", change: "1-Click", color: "text-violet-400" },
        { label: "Taxa de Erro", value: "0.00%", change: "Zero Falhas", color: "text-emerald-400" },
      ],
      chartMeta: "Formatos: CSV, JSON, Webhook",
    },
  };

  const activeContent = tabData[tab] || tabData["Dashboard"];

  return (
    <section id="dashboard" className="section-padding bg-[var(--color-primary)] text-white relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute left-[-8%] top-1/3 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={700} strokeWidth={0.5} />
      </div>

      <div className="container-wide px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal" ref={ref}>
          <div className="mb-6">
            <span className="bracket-label">05 / Interface</span>
          </div>
          <h2 className="editorial-title text-[clamp(2.5rem,5vw,3.5rem)] text-white mb-6">
            O centro de comando.
          </h2>
          <p className="text-[1rem] text-white/40 leading-relaxed">
            Clique nas abas do painel abaixo para alternar visualizações e métricas em tempo real.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[#171523]/80 backdrop-blur-xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">

          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white/[0.02] border-r border-white/10 p-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-[8px] bg-violet-500 flex items-center justify-center text-white shadow-sm">
                  <Crosshair size={14} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[0.875rem] font-bold text-white tracking-[-0.01em]">AcheAqui</span>
                  <span className="block text-[0.5625rem] text-violet-300/60 font-mono">v2.4 Enterprise</span>
                </div>
              </div>

              <nav className="space-y-1.5">
                {[
                  { n: "Dashboard", i: LayoutDashboard, desc: "Painel Geral" },
                  { n: "Empresas", i: Building2, desc: "Base de Dados" },
                  { n: "Pesquisas", i: Search, desc: "Filtros & Raio" },
                  { n: "Exportações", i: Download, desc: "CRM & CSV" },
                ].map(({ n, i: Icon, desc }) => (
                  <button
                    key={n}
                    onClick={() => setTab(n)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      tab === n
                        ? "bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm"
                        : "text-white/40 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <div className="text-left">
                        <span className="block font-semibold">{n}</span>
                        <span className="text-[10px] text-white/30 font-mono">{desc}</span>
                      </div>
                    </div>
                    {tab === n && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5 mt-6">
              <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-[0.625rem] font-bold flex items-center justify-center">AA</div>
              <div className="text-[0.6875rem] overflow-hidden">
                <span className="font-semibold text-white block truncate">Sua Empresa</span>
                <span className="text-emerald-400 font-mono text-[0.5625rem]">● Plano Enterprise</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 p-6 space-y-6 overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <h3 className="text-[1.125rem] font-bold text-white tracking-tight flex items-center gap-2">
                  Visão: {tab}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-400/20">
                    Ao Vivo
                  </span>
                </h3>
                <p className="text-[0.75rem] text-white/40">Exibição de métricas e parâmetros em tempo real</p>
              </div>
              <div className="flex items-center gap-2.5">
                <a href="/auth" className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-[0.75rem] font-medium hover:bg-white/10 transition flex items-center gap-2">
                  <Download size={13} />
                  Exportar Dados
                </a>
                <a href="/auth" className="px-3.5 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[0.75rem] font-semibold transition flex items-center gap-2 shadow-md">
                  <Plus size={13} />
                  Nova Busca
                </a>
              </div>
            </div>

            {/* KPIs Grid Dynamic */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {activeContent.kpis.map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 transition-all hover:border-violet-400/30">
                  <span className="text-[0.625rem] uppercase tracking-[0.08em] text-white/40 font-mono font-semibold">{kpi.label}</span>
                  <div className={`text-[1.375rem] font-bold font-mono tracking-tight ${kpi.color}`}>{kpi.value}</div>
                  <span className="text-[0.625rem] text-emerald-400 font-mono">{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Chart Container */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-4 text-[0.75rem]">
                <span className="font-semibold text-white flex items-center gap-2 font-mono">
                  <BarChart3 size={14} className="text-violet-400" />
                  Volume Teleférico de Prospecção // {tab}
                </span>
                <span className="text-emerald-400 font-mono text-[0.6875rem]">{activeContent.chartMeta}</span>
              </div>
              <div className="h-36 w-full relative">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 640 144">
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 110 Q 80 30, 160 80 T 320 40 T 480 70 T 640 15 L 640 144 L 0 144 Z" fill="url(#cg)" />
                  <path d="M 0 110 Q 80 30, 160 80 T 320 40 T 480 70 T 640 15" fill="none" stroke="#A78BFA" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[0.6875rem] font-mono text-white/40 mb-2">
                <span className="font-semibold text-white text-[0.8125rem]">Últimas Consultas no Servidor</span>
                <span className="text-violet-400 cursor-pointer hover:underline">Ver histórico</span>
              </div>
              {[
                { q: "Restaurantes em São Paulo, SP", n: "2.483 contatos", t: "há 2 min" },
                { q: "Academias em Curitiba, PR", n: "1.204 contatos", t: "há 12 min" },
                { q: "Clínicas Médicas em BH, MG", n: "980 contatos", t: "há 45 min" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="flex items-center gap-2 text-[0.8125rem] text-white/80">
                    <Crosshair size={12} className="text-violet-400" />
                    {s.q}
                  </span>
                  <div className="flex items-center gap-4 text-[0.6875rem] font-mono">
                    <span className="text-emerald-400">{s.n}</span>
                    <span className="text-white/30">{s.t}</span>
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
