"use client";

import React, { useState } from "react";
import Crosshair from "@/components/Crosshair";
import { LayoutDashboard, Building2, Search, Download, Key, Settings, Plus, BarChart3, LogOut, Bell, User, CheckCircle2, FileText, Activity, Sparkles } from "lucide-react";

export default function DashboardClient({ company, aiData }: { company: any, aiData: any }) {
  const [tab, setTab] = useState("Dashboard");

  return (
    <div className="h-screen w-screen bg-[var(--color-primary)] text-white flex overflow-hidden fixed inset-0">
      
      {/* Background elements */}
      <div className="absolute left-[-8%] top-1/3 text-white opacity-[0.02] pointer-events-none">
        <Crosshair size={1000} strokeWidth={0.5} />
      </div>

      {/* Sidebar */}
      <div className="w-[260px] bg-white/[0.02] border-r border-white/[0.06] flex flex-col justify-between shrink-0 h-screen z-10 backdrop-blur-xl">
        <div className="p-5 space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--color-secondary)] flex items-center justify-center text-white">
              <Crosshair size={16} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[1rem] font-bold text-white tracking-[-0.01em]">AcheAqui</span>
              <span className="block text-[0.625rem] text-white/40 font-mono">v2.4 Enterprise</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {[
              { n: "Dashboard", i: LayoutDashboard },
              { n: "Empresas", i: Building2 },
              { n: "Pesquisas", i: Search },
              { n: "Exportações", i: Download },
              { n: "API", i: Key },
              { n: "Configurações", i: Settings },
            ].map(({ n, i: Icon }) => (
              <button 
                key={n} 
                onClick={() => setTab(n)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[0.875rem] font-medium transition-all duration-200 ${
                  tab === n 
                  ? "bg-[var(--color-secondary)]/15 text-blue-400 border border-blue-500/20" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <Icon size={16} />
                {n}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-5">
          <div className="p-4 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white text-[0.75rem] font-bold flex items-center justify-center">
                {company?.name ? company.name.substring(0, 2).toUpperCase() : 'CO'}
              </div>
              <div className="text-[0.75rem] overflow-hidden">
                <span className="font-semibold text-white block truncate">{company?.name || "Sua Empresa"}</span>
                <span className="text-emerald-400 font-mono text-[0.625rem]">● Plano {company?.plan || "Free"}</span>
              </div>
            </div>
            <form action="/auth/actions" method="POST">
              <button formAction={async () => {
                const { signout } = await import('@/app/auth/actions');
                await signout();
              }} className="text-white/30 hover:text-white/80 transition p-2">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        
        {/* Top Header */}
        <header className="h-[72px] border-b border-white/[0.06] bg-white/[0.01] px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[1.125rem] font-bold text-white tracking-[-0.01em]">{tab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white/80 transition p-2">
              <Search size={18} />
            </button>
            <button className="text-white/40 hover:text-white/80 transition p-2 relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <div className="w-px h-6 bg-white/10 mx-2" />
            <a href="/" className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-secondary)] text-white text-[0.75rem] font-semibold hover:bg-blue-700 transition">
              Acessar Busca (B2C)
            </a>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {tab === "Dashboard" && (
            <>
              {/* Welcome Message */}
              <div>
                <h2 className="text-[1.5rem] font-bold text-white tracking-tight">Bem-vindo, {company?.name}!</h2>
                <p className="text-[0.875rem] text-white/40 mt-1">Aqui está o resumo da sua aquisição de clientes com IA.</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Visualizações do Perfil", value: "1.420", change: "+14.2% em relação ao mês anterior", color: "text-white" },
                  { label: "Cliques no WhatsApp", value: "110", change: "8.1% de conversão", color: "text-emerald-400" },
                  { label: "Acessos ao Site", value: "400", change: "28.5% do tráfego total", color: "text-blue-400" },
                  { label: "Leads Gerados", value: "45", change: "Nesta semana", color: "text-purple-400" },
                ].map((kpi) => (
                  <div key={kpi.label} className="p-6 rounded-[var(--radius-lg)] bg-white/[0.03] border border-white/[0.05] space-y-3 hover:bg-white/[0.04] transition">
                    <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40 font-mono font-semibold">{kpi.label}</span>
                    <div className={`text-[2rem] font-bold font-numbers tracking-[-0.02em] leading-none ${kpi.color}`}>{kpi.value}</div>
                    <span className="text-[0.6875rem] text-white/30 font-mono">{kpi.change}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Marketing Assistant Panel */}
                <div className="lg:col-span-2 p-6 rounded-[var(--radius-lg)] bg-white/[0.03] border border-[var(--color-secondary)]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={120} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className="font-semibold text-[1.125rem] text-white flex items-center gap-2">
                      <Sparkles size={18} className="text-blue-400" />
                      Seu Assistente de Marketing (IA)
                    </span>
                    <span className="text-[var(--color-secondary)] font-mono text-[0.75rem] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full border border-[var(--color-secondary)]/20">
                      Otimizado hoje
                    </span>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h4 className="text-[0.8125rem] text-white/50 uppercase tracking-wider mb-2 font-semibold">SEO e Descrição Otimizada</h4>
                      <p className="text-[0.9375rem] text-white/90 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                        {aiData?.seo_description || "Sua empresa ainda não possui uma descrição otimizada. Edite seu perfil para gerar."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[0.8125rem] text-white/50 uppercase tracking-wider mb-2 font-semibold">Ideias de Posts (Instagram)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {aiData?.instagram_post_ideas ? (
                          aiData.instagram_post_ideas.map((post: any, i: number) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-white/20 transition">
                              <span className="text-[0.625rem] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block font-mono">
                                {post.type}
                              </span>
                              <h5 className="font-semibold text-[0.9375rem] text-white mb-1">{post.title}</h5>
                              <p className="text-[0.8125rem] text-white/60 line-clamp-2">{post.caption}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-white/40 text-sm p-4 bg-white/5 rounded-lg">Nenhuma ideia de post gerada ainda.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Visitors Panel */}
                <div className="p-6 rounded-[var(--radius-lg)] bg-white/[0.03] border border-white/[0.05] flex flex-col">
                  <div className="flex items-center justify-between text-[0.75rem] font-mono text-white/40 mb-6">
                    <span className="font-semibold text-white text-[0.9375rem] font-sans">Últimos Visitantes</span>
                    <span className="text-emerald-400 cursor-pointer hover:underline">Ver CRM</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    {[
                      { source: "Busca Orgânica", location: "São Paulo, SP", action: "Visualizou Perfil", t: "2 min" },
                      { source: "Link Direto", location: "Campinas, SP", action: "Clicou no WhatsApp", t: "12 min" },
                      { source: "Busca 'Pizzarias'", location: "Curitiba, PR", action: "Acessou Site", t: "45 min" },
                      { source: "Redes Sociais", location: "Rio de Janeiro, RJ", action: "Visualizou Perfil", t: "2 horas" },
                    ].map((s, i) => (
                      <div key={i} className="group flex items-center justify-between p-3.5 rounded-[12px] bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition cursor-pointer">
                        <span className="flex items-center gap-3 text-[0.875rem] text-white/80 group-hover:text-white">
                          <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center">
                            <User size={12} className="text-blue-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.8125rem] font-medium leading-none mb-1">{s.action}</span>
                            <span className="text-[0.6875rem] text-white/40 leading-none">{s.source}</span>
                          </div>
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-emerald-400 font-mono text-[0.6875rem]">{s.location}</span>
                          <span className="text-white/30 text-[0.625rem]">há {s.t}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 mt-4 rounded-[var(--radius-sm)] border border-white/[0.06] text-[0.8125rem] text-white/60 hover:text-white hover:bg-white/[0.02] transition font-semibold">
                    Acessar CRM Completo
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "Empresas" && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[1.25rem] font-bold">Leads Capturados</h3>
                <div className="flex gap-3">
                  <input type="text" placeholder="Buscar empresa..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[0.875rem] focus:outline-none focus:border-[var(--color-secondary)]" />
                  <button className="bg-white/10 px-4 py-2 rounded-lg text-[0.875rem] hover:bg-white/20">Filtros</button>
                </div>
              </div>
              <table className="w-full text-left text-[0.875rem]">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[0.75rem] uppercase tracking-wider">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Localização</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { n: "TechCorp Soluções", c: "Tecnologia", l: "São Paulo, SP", s: "Enriquecido" },
                    { n: "Padaria do Bairro", c: "Alimentação", l: "Curitiba, PR", s: "Básico" },
                    { n: "Clínica Sorriso", c: "Saúde", l: "Rio de Janeiro, RJ", s: "Enriquecido" },
                    { n: "Auto Escola Fast", c: "Serviços", l: "Belo Horizonte, MG", s: "Processando" },
                  ].map((e, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 font-semibold">{e.n}</td>
                      <td className="py-4 text-white/60">{e.c}</td>
                      <td className="py-4 text-white/60">{e.l}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-1 rounded text-[0.75rem] ${
                          e.s === "Enriquecido" ? "bg-emerald-500/20 text-emerald-400" :
                          e.s === "Básico" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"
                        }`}>{e.s}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Pesquisas" && (
            <div className="space-y-6">
              <h3 className="text-[1.25rem] font-bold mb-4">Suas Pesquisas Salvas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-5 hover:bg-white/[0.05] transition cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-[1.125rem]">Clínicas Odontológicas</h4>
                        <p className="text-[0.875rem] text-white/50 mt-1">São Paulo, SP • 2.483 leads</p>
                      </div>
                      <button className="text-[var(--color-secondary)] hover:text-white transition"><Search size={18} /></button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[0.75rem] text-white/40 font-mono">
                      <span>Atualizado há 2h</span>
                      <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12} /> Auto-sincronização On</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Exportações" && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-6">
              <h3 className="text-[1.25rem] font-bold mb-6">Arquivos Gerados</h3>
              <div className="space-y-3">
                {[
                  { name: "leads_sp_odontologia_jul2026.csv", date: "30/07/2026 10:45", size: "2.4 MB" },
                  { name: "restaurantes_curitiba.xlsx", date: "28/07/2026 14:20", size: "1.1 MB" },
                  { name: "export_geral_q3.csv", date: "15/07/2026 09:00", size: "15.8 MB" },
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center"><FileText size={20} /></div>
                      <div>
                        <p className="font-medium text-[0.9375rem]">{file.name}</p>
                        <p className="text-[0.75rem] text-white/40">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-[0.875rem] transition">
                      <Download size={14} /> Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "API" && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-6">
                <h3 className="text-[1.25rem] font-bold mb-2">Chaves de API</h3>
                <p className="text-[0.875rem] text-white/50 mb-6">Gerencie suas chaves para integração direta com seu sistema.</p>
                <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-lg border border-white/10 mb-4">
                  <div>
                    <p className="text-[0.75rem] text-white/40 font-mono uppercase mb-1">Chave de Produção</p>
                    <p className="font-mono text-emerald-400 text-[0.9375rem]">sk_live_8f92************************3b4c</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-[0.8125rem]">Copiar</button>
                    <button className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-[0.8125rem]">Revogar</button>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] hover:bg-blue-600 rounded-md text-[0.875rem] font-medium transition">
                  <Plus size={16} /> Gerar Nova Chave
                </button>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-6">
                <h3 className="text-[1.125rem] font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-amber-400" /> Uso da API (Este mês)</h3>
                <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-[0.875rem] text-white/60">45.000 / 100.000 requisições (Plano Enterprise)</p>
              </div>
            </div>
          )}

          {tab === "Configurações" && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[var(--radius-lg)] p-6 max-w-2xl">
              <h3 className="text-[1.25rem] font-bold mb-6">Configurações da Conta</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.8125rem] text-white/60">Nome da Empresa</label>
                    <input type="text" defaultValue={company?.name || "Sua Empresa"} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9375rem] focus:outline-none focus:border-[var(--color-secondary)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.8125rem] text-white/60">CNPJ</label>
                    <input type="text" defaultValue={company?.cnpj || ""} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9375rem] font-mono focus:outline-none focus:border-[var(--color-secondary)]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] text-white/60">E-mail Administrativo</label>
                  <input type="email" defaultValue={company?.email || ""} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9375rem] focus:outline-none focus:border-[var(--color-secondary)]" />
                </div>
                <div className="pt-4 border-t border-white/10">
                  <button type="button" className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
