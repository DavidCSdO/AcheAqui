"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Crosshair from "@/components/Crosshair";
import { Search, MapPin, Phone, Smartphone, Mail, Copy, Briefcase, MessageSquare, PlusSquare, Flame, Loader2, Users, Building, XCircle, Download, Globe, CheckCircle2 } from "lucide-react";
import { calculateLeadScore, LeadScore } from "@/utils/scoring";

const InstagramIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function ProspectingContent() {
  const searchParams = useSearchParams();
  const nicheParams = searchParams.get("niche") || "";
  const regionParams = searchParams.get("region") || "";
  const limitStr = searchParams.get("limit") || "20";
  const limit = parseInt(limitStr, 10);
  const modeParams = searchParams.get("mode") || "completa";
  
  const query = nicheParams ? `${nicheParams} em ${regionParams}` : regionParams ? `Empresas em ${regionParams}` : "";

  const [niche, setNiche] = useState(nicheParams);
  const [region, setRegion] = useState(regionParams);
  const [mode, setMode] = useState(modeParams);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0);
  
  const [filterWa, setFilterWa] = useState(false);
  const [filterIg, setFilterIg] = useState(false);
  const [filterHot, setFilterHot] = useState(false);
  const [filterEmail, setFilterEmail] = useState(false);
  const [filterSite, setFilterSite] = useState(false);
  
  const [cvPitchTemplate, setCvPitchTemplate] = useState("Olá, admiro o trabalho da {empresa} e gostaria de enviar meu currículo!");
  const [salesPitchTemplate, setSalesPitchTemplate] = useState("Olá, sou especialista em soluções para {categoria} e tenho uma proposta para a {empresa}.");

  useEffect(() => {
    const savedSettings = localStorage.getItem("crm_settings");
    if (savedSettings) {
      try {
        const { cv, sales } = JSON.parse(savedSettings);
        if (cv) setCvPitchTemplate(cv);
        if (sales) setSalesPitchTemplate(sales);
      } catch (e) {
        console.error("Failed to parse crm_settings");
      }
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    let eventSource: EventSource | null = null;
    
    const fetchData = async () => {
      setLoading(true);
      setData([]);
      setLoadingStage("Iniciando coleta de leads...");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const sseUrl = `${apiUrl}/api/scrape/stream?q=${encodeURIComponent(query)}&limit=${limit}&mode=${modeParams}`;
      
      const collectedLeads: any[] = [];
      
      try {
        eventSource = new EventSource(sseUrl);
        
        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            
            if (payload.type === "status") {
              setLoadingStage(payload.message);
            } else if (payload.type === "basic_lead" || payload.type === "lead" || payload.type === "lead_update") {
              setLoading(false);
              setLoadingStage("Buscando contatos, vagas e redes sociais...");
              
              const item = payload.data;
              const targetIdx = payload.index - 1;
              const mappedLead = {
                id: `scraped-${payload.index}`,
                name: item.Nome || "Empresa Encontrada",
                category: item.Categoria,
                address: item["Endereço"],
                cellphone: item["Telefone Celular"] || "",
                landline: item["Telefone Fixo"] || "",
                whatsapp: item["WhatsApp Direct"] || (item["Telefone Celular"] ? `https://wa.me/55${item["Telefone Celular"].replace(/\D/g, '')}` : ""),
                whatsapp_verificado: item["whatsapp_verificado"] || false,
                email: item["Email Geral"] || item["Email RH"] || item["Email"] || "",
                website: item.Site || item["Site Oficial Maps"] || "",
                google_rating: item["Nota Google"] ? parseFloat(item["Nota Google"].toString().replace(',','.')) : null,
                instagram: item["Instagram"] || "",
                linkedin: item["LinkedIn"] || "",
                maps_url: item["Google Maps URL"] || "",
                has_open_jobs: item.has_open_jobs,
                jobs_url: item.jobs_url
              };
              
              const existingIdx = collectedLeads.findIndex(l => l.id === mappedLead.id);
              if (existingIdx >= 0) {
                collectedLeads[existingIdx] = { ...collectedLeads[existingIdx], ...mappedLead };
              } else {
                collectedLeads.push(mappedLead);
              }
              setData([...collectedLeads]);
              setProgress(Math.min(95, Math.round(((collectedLeads.length) / limit) * 100)));
              
            } else if (payload.type === "done") {
              setLoading(false);
              setLoadingStage("");
              setProgress(100);
              if (eventSource) eventSource.close();
            } else if (payload.type === "error") {
              console.error("SSE error from server:", payload.message);
              setLoading(false);
              setLoadingStage("");
              if (eventSource) eventSource.close();
            }
          } catch (parseErr: any) {
            console.warn("SSE parse error:", parseErr.message || parseErr);
          }
        };
        
        eventSource.onerror = (err: any) => {
          console.warn("SSE connection error:", err.message || "Connection failed");
          if (eventSource) eventSource.close();
          setLoading(false);
        };
        
      } catch (e: any) {
        console.warn("SSE setup failed:", e.message || e);
        setLoading(false);
      }
    };

    fetchData();
    
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [query, limit]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado: " + text); 
  };

  const saveToCRM = async (company: any) => {
    const existing = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    existing.push({ ...company, status: 'novo', saved_at: new Date().toISOString() });
    localStorage.setItem('crm_leads', JSON.stringify(existing));
    
    try {
      const supabase = createClient();
      await supabase.from("companies").insert({
        name: company.name,
        category: company.category,
        address: company.address,
        phone: company.cellphone || company.landline,
        website: company.website,
        email: company.email,
        instagram: company.instagram,
        linkedin: company.linkedin,
        maps_url: company.maps_url
      });
      alert(`${company.name} salvo no CRM e no Banco de Dados!`);
    } catch (e) {
      alert(`${company.name} salvo apenas localmente!`);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = ["Nome", "Categoria", "Endereco", "Celular", "Fixo", "Email", "Site", "Instagram", "LinkedIn", "Score"];
    const csvContent = [
      headers.join(","),
      ...data.map(item => {
        const score = calculateLeadScore(item).score;
        return `"${item.name || ''}","${item.category || ''}","${item.address || ''}","${item.cellphone || ''}","${item.landline || ''}","${item.email || ''}","${item.website || ''}","${item.instagram || ''}","${item.linkedin || ''}","${score}"`;
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_${region.replace(/\W+/g, "_") || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 container-wide px-6 py-24 mt-16 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight mb-4">
            Prospecção de <span className="text-[var(--color-secondary)]">Leads</span>
          </h1>
          <p className="text-white/60 text-lg">
            Encontre empresas qualificadas, descubra contatos estratégicos e veja se há vagas em aberto.
          </p>
        </div>

        <form action="/prospecting" method="GET" className="bg-[#1C1C1E]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Nicho / Palavra-chave
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  name="niche"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Clínicas (Opcional)..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Região
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  name="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Campinas, SP"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Qtd
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="number"
                  name="limit"
                  defaultValue={limitStr}
                  min="1"
                  max="100"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Modo
              </label>
              <div className="relative">
                <Flame className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" size={20} />
                <select
                  name="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors appearance-none"
                >
                  <option value="completa" className="bg-[#1C1C1E]">Rápida (Padrão)</option>
                  <option value="extrema" className="bg-[#1C1C1E]">Extrema (Profunda)</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-1">
              <button type="submit" className="w-full h-[50px] bg-[var(--color-secondary)] text-white rounded-xl flex items-center justify-center hover:bg-[var(--color-secondary)]/80 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="text-white/50 text-sm">{data.length > 0 ? `${data.length} leads prospectados` : ''}</p>
              {loadingStage && !loading && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full border border-[var(--color-secondary)]/20 animate-pulse">
                  <Loader2 size={12} className="animate-spin" /> {loadingStage}
                </span>
              )}
            </div>
            
            {data.length > 0 && (
              <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors">
                <Download size={16} /> Exportar CSV
              </button>
            )}
          </div>
          
          {(loading || loadingStage) && (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-secondary)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {data.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-white/40 text-sm mr-2 font-medium">Filtros:</span>
              <button 
                onClick={() => setFilterWa(!filterWa)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${filterWa ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                <Smartphone size={12} /> Com WhatsApp
              </button>
              <button 
                onClick={() => setFilterIg(!filterIg)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${filterIg ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                <InstagramIcon size={12} /> Com Instagram
              </button>
              <button 
                onClick={() => setFilterHot(!filterHot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${filterHot ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                <Flame size={12} /> Score &gt; 75
              </button>
              <button 
                onClick={() => setFilterEmail(!filterEmail)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${filterEmail ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                <Mail size={12} /> Com E-mail
              </button>
              <button 
                onClick={() => setFilterSite(!filterSite)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${filterSite ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                <Globe size={12} /> Com Site
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-16 border border-white/10 rounded-[24px] bg-[#1C1C1E]/80 backdrop-blur-md animate-pulse">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Crosshair size={96} className="text-[var(--color-secondary)] animate-slow-spin opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-mono text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-white">
                Garimpando Leads
              </h3>
              <p className="text-white/50 font-mono text-sm">{loadingStage}</p>
            </div>
          ) : data.length === 0 && query ? (
            <div className="text-center p-12 border border-white/10 rounded-[24px] bg-white/5 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-white/50">Tente buscar com outros parâmetros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.filter(company => {
                if (filterWa && !company.cellphone) return false;
                if (filterIg && !company.instagram) return false;
                if (filterEmail && !company.email) return false;
                if (filterSite && !company.website) return false;
                if (filterHot && calculateLeadScore(company).score < 75) return false;
                return true;
              }).map((company, index) => {
                const hasCellphone = !!company.cellphone;
                const hasEmail = !!company.email;
                const hasInstagram = !!company.instagram;
                const hasWebsite = !!company.website;
                const activePhone = company.cellphone || company.landline;
                const leadScore: LeadScore = calculateLeadScore(company);
                
                const cvMessage = cvPitchTemplate.replace(/{empresa}/g, company.name || "empresa").replace(/{categoria}/g, company.category || "seu nicho");
                const salesMessage = salesPitchTemplate.replace(/{empresa}/g, company.name || "empresa").replace(/{categoria}/g, company.category || "seu nicho");
                
                return (
                  <div key={company.id} className="p-5 rounded-[20px] bg-[#1C1C1E]/90 border border-white/[0.08] backdrop-blur-md hover:border-white/20 transition-all group flex flex-col relative overflow-hidden">
                    {company.has_open_jobs && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[0.625rem] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/20">
                        <Briefcase size={10} /> Vagas Abertas
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.625rem] text-white/40 font-mono uppercase tracking-[0.1em]">Lead Capturado</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${leadScore.color} bg-opacity-10 backdrop-blur-sm ${company.has_open_jobs ? 'mr-28' : ''}`}>
                        <Flame size={12} className={leadScore.color.split(' ')[0]} />
                        <span className="text-[0.6875rem] font-bold uppercase tracking-wider">
                          Score: {leadScore.score}
                        </span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-[1.25rem] font-bold text-white leading-tight group-hover:text-[var(--color-secondary)] transition-colors line-clamp-1">
                          {company.name}
                        </h2>
                      </div>
                      <p className="text-white/40 text-[0.8125rem] font-medium flex items-center gap-1.5 line-clamp-1">
                        {company.category || "Empresa"} • {company.address || "Endereço não encontrado"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mb-5">
                      <div className="grid grid-cols-2 gap-2">
                        {hasCellphone ? (
                          <button onClick={() => copyToClipboard(company.cellphone)} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/50 transition-colors group/btn cursor-pointer">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Smartphone size={13} className="text-emerald-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80 truncate">{company.cellphone}</span>
                            </div>
                            <Copy size={14} className="text-white/20 group-hover/btn:text-emerald-400 shrink-0 ml-2" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <Smartphone size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">Celular</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}
                        
                        {hasEmail ? (
                          <button onClick={() => copyToClipboard(company.email)} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-secondary)]/50 transition-colors group/btn cursor-pointer">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Mail size={13} className="text-amber-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80 truncate">{company.email}</span>
                            </div>
                            <Copy size={14} className="text-white/20 group-hover/btn:text-[var(--color-secondary)] shrink-0 ml-2" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">E-mail</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}
                        
                        {hasInstagram ? (
                          <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-fuchsia-500/50 transition-colors group/btn cursor-pointer">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <InstagramIcon size={13} className="text-fuchsia-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80 truncate">Instagram</span>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <InstagramIcon size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">Instagram</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}

                        {hasWebsite ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/50 transition-colors group/btn cursor-pointer">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Globe size={13} className="text-blue-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80 truncate">Site Oficial</span>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <Globe size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">Site Oficial</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-auto">
                      <div className="flex gap-2">
                        {company.has_open_jobs && company.jobs_url && (
                          <a 
                            href={company.jobs_url} 
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-[0.8125rem] font-bold transition-all bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                            title="Ver vagas abertas no site oficial"
                          >
                            <Briefcase size={14} /> Ver Vagas
                          </a>
                        )}
                        <a 
                          href={activePhone ? `https://wa.me/55${activePhone.replace(/\D/g, '')}?text=${encodeURIComponent(company.has_open_jobs ? cvMessage : salesMessage)}` : '#'} 
                          target="_blank" rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-[0.8125rem] font-bold transition-all ${activePhone ? (company.whatsapp_verificado ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20') : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                          <MessageSquare size={14} /> {company.has_open_jobs ? "Mandar Currículo" : (company.whatsapp_verificado ? "WhatsApp Verificado" : "WhatsApp")}
                          {company.whatsapp_verificado && <CheckCircle2 size={14} className="text-emerald-400 ml-1" />}
                        </a>
                      </div>
                      <button 
                        onClick={() => saveToCRM(company)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-[0.8125rem] font-bold transition-all"
                      >
                        <PlusSquare size={14} /> Salvar no CRM
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProspectingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)] selection:text-white flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Crosshair size={48} className="animate-spin text-white/20" /></div>}>
        <ProspectingContent />
      </Suspense>
      <Footer />
    </main>
  );
}
