"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Crosshair from "@/components/Crosshair";
import { Search, MapPin, Phone, Smartphone, Mail, CheckCircle2, XCircle, Copy, Download, Briefcase, MessageSquare, PlusSquare, Flame, Sparkles, Loader2 } from "lucide-react";
import { calculateLeadScore, LeadScore } from "@/utils/scoring";

const InstagramIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const limitStr = searchParams.get("limit") || "20";
  const limit = parseInt(limitStr, 10);
  const mode = searchParams.get("mode") || "direcionada";
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState("Buscando no banco de dados...");
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
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
    let eventSource: EventSource | null = null;
    
    const fetchData = async () => {
      setLoading(true);
      setData([]);
      setLoadingStage("Consultando Supabase...");
      const supabase = createClient();
      
      let localData: any[] = [];
      if (query) {
        const { data: results } = await supabase
          .from("companies")
          .select("*")
          .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
          .order("created_at", { ascending: false })
          .limit(limit);
        localData = results || [];
      } else {
        const { data: results } = await supabase
          .from("companies")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);
        localData = results || [];
      }

      if (localData.length > 0) {
        const mappedLocal = localData.map(item => {
          let cellphone = null;
          let landline = null;
          if (item.phone) {
             const digits = item.phone.replace(/\D/g, '');
             if (digits.length >= 11 || (digits.length === 10 && digits.startsWith('9'))) {
               cellphone = item.phone;
             } else {
               landline = item.phone;
             }
          }
          return {
            ...item,
            cellphone: item.cellphone || cellphone,
            landline: item.landline || landline
          };
        });
        setData(mappedLocal);
        setLoading(false);
        if (query) {
          fetchAiConsultant(query, mappedLocal);
        }
      } else if (query) {
        // === SSE STREAMING ===
        setLoadingStage("Coletando dados do Google Maps...");
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const sseUrl = `${apiUrl}/api/scrape/stream?q=${encodeURIComponent(query)}&limit=${limit}&mode=${mode}`;
        
        const collectedLeads: any[] = [];
        
        try {
          eventSource = new EventSource(sseUrl);
          
          eventSource.onmessage = (event) => {
            try {
              const payload = JSON.parse(event.data);
              
              if (payload.type === "status") {
                setLoadingStage(payload.message);
              } else if (payload.type === "lead") {
                setLoading(false);
                setLoadingStage("");
                
                const item = payload.data;
                const mappedLead = {
                  id: `scraped-${payload.index}`,
                  name: item.Nome || "Empresa Encontrada",
                  category: item.Categoria,
                  address: item["Endereço"],
                  cellphone: item["Telefone Celular"],
                  landline: item["Telefone Fixo"],
                  whatsapp: item["WhatsApp Direct"],
                  email: item["Email Geral"] || item["Email RH"],
                  website: item.Site,
                  google_rating: item["Nota Google"] ? parseFloat(item["Nota Google"].toString().replace(',','.')) : null,
                  instagram: item["Instagram"],
                  linkedin: item["LinkedIn"],
                  maps_url: item["Google Maps URL"]
                };
                
                collectedLeads.push(mappedLead);
                setData([...collectedLeads]);
                
              } else if (payload.type === "done") {
                setLoading(false);
                if (eventSource) eventSource.close();
                if (collectedLeads.length > 0 && query) {
                  fetchAiConsultant(query, collectedLeads);
                }
              } else if (payload.type === "error") {
                console.error("SSE error from server:", payload.message);
                setLoading(false);
                if (eventSource) eventSource.close();
              }
            } catch (parseErr) {
              console.error("SSE parse error:", parseErr);
            }
          };
          
          eventSource.onerror = (err) => {
            console.error("SSE connection error:", err);
            if (eventSource) eventSource.close();
            
            // If we got zero results via SSE, try fallback POST
            if (collectedLeads.length === 0) {
              fallbackPostScrape(query, limit, mode, collectedLeads);
            } else {
              setLoading(false);
            }
          };
          
        } catch (e) {
          console.error("SSE setup failed:", e);
          fallbackPostScrape(query, limit, mode, collectedLeads);
        }
      } else {
        setLoading(false);
      }
    };

    const fallbackPostScrape = async (q: string, lim: number, m: string, collected: any[]) => {
      setLoadingStage("Tentando via método alternativo...");
      try {
        const pyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, limit: lim, min_rating: 0, has_website: false, has_phone: false, mode: m }),
          cache: 'no-store'
        });
        
        if (pyResponse.ok) {
          const pyResult = await pyResponse.json();
          if (pyResult.status === "success" && pyResult.data && pyResult.data.length > 0) {
            const mappedData = pyResult.data.map((item: any, i: number) => ({
              id: `scraped-${i}`,
              name: item.Nome || "Empresa Encontrada",
              category: item.Categoria,
              address: item["Endereço"],
              cellphone: item["Telefone Celular"],
              landline: item["Telefone Fixo"],
              whatsapp: item["WhatsApp Direct"],
              email: item["Email Geral"] || item["Email RH"],
              website: item.Site,
              google_rating: item["Nota Google"] ? parseFloat(item["Nota Google"].toString().replace(',','.')) : null,
              instagram: item["Instagram"],
              linkedin: item["LinkedIn"],
              maps_url: item["Google Maps URL"]
            }));
            setData(mappedData);
            if (q) fetchAiConsultant(q, mappedData);
          }
        }
      } catch (e) {
        console.error("Fallback POST scraper also failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Cleanup: close SSE on unmount or re-render
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [query, limit]);

  const fetchAiConsultant = async (q: string, comps: any[]) => {
    setLoadingAi(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/semantic_search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, companies: comps.slice(0, 10) }) // envia os 10 primeiros
      });
      const aiData = await res.json();
      if (res.ok && aiData.status === "success") {
        setAiExplanation(aiData.data);
      }
    } catch (e) {
      console.error("AI Semantic Error:", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado: " + text); // Em um app real, use um Toast
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = ["Nome,Categoria,Endereço,Telefone,Email,Instagram,LinkedIn,Site"];
    const rows = data.map(c => 
      `"${c.name}","${c.category || ''}","${c.address || ''}","${c.phone || ''}","${c.email || ''}","${c.instagram || ''}","${c.linkedin || ''}","${c.website || ''}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${query}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToCRM = (company: any) => {
    const existing = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    existing.push({ ...company, status: 'novo', saved_at: new Date().toISOString() });
    localStorage.setItem('crm_leads', JSON.stringify(existing));
    alert(`${company.name} salvo no seu CRM!`);
  };

  return (
    <div className="flex-1 container-wide px-6 py-24 mt-16 relative">
      <div className="absolute left-[-10%] top-[-10%] text-[var(--color-secondary)] opacity-[0.03] pointer-events-none">
        <Crosshair size={800} strokeWidth={0.5} className="animate-slow-spin" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight mb-8">
          Resultados para <span className="text-[var(--color-secondary)]">"{query}"</span>
        </h1>

        <form action="/search" method="GET" className="relative group mb-12">
          <div className="flex w-full bg-[#1C1C1E]/80 border border-white/10 rounded-full p-2 backdrop-blur-md transition-all focus-within:border-white/20 shadow-xl items-center">
            
            <div className="pl-4 pr-2">
              <Search className="text-white/40 group-focus-within:text-[var(--color-secondary)] transition-colors" size={20} />
            </div>
            
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="O que você procura? (ex: Advogados, Clínicas...)"
              className="flex-1 bg-transparent py-3 text-[1.125rem] text-white placeholder:text-white/30 focus:outline-none"
            />
            
            <div className="hidden sm:flex items-center border-l border-white/10 pl-4 ml-2 shrink-0">
              <input 
                type="number" 
                name="limit" 
                defaultValue={limitStr} 
                min="1" 
                max="500"
                className="bg-transparent text-[0.875rem] text-white/70 w-16 focus:outline-none text-center"
                placeholder="20"
              />
              <span className="text-[0.75rem] text-white/40 mr-2">Leads</span>
            </div>

            <select name="mode" defaultValue={mode} className="bg-transparent text-[0.875rem] text-white/70 border-l border-white/10 pl-3 focus:outline-none hidden md:block appearance-none cursor-pointer">
              <option value="simples" className="bg-[#1C1C1E]">⚡ Rápida</option>
              <option value="direcionada" className="bg-[#1C1C1E]">📍 Direcionada</option>
              <option value="completa" className="bg-[#1C1C1E]">🕵️ Completa</option>
            </select>
            
            <button type="submit" className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all ml-4 mr-1">
              <Search size={16} />
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center mb-6">
          <p className="text-white/50 text-sm">{data.length > 0 ? `${data.length} resultados encontrados` : ''}</p>
          {data.length > 0 && (
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Download size={16} /> Exportar CSV
            </button>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-16 border border-white/10 rounded-[24px] bg-[#1C1C1E]/80 backdrop-blur-md animate-pulse">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Crosshair size={96} className="text-[var(--color-secondary)] animate-slow-spin opacity-50" />
                <div className="absolute inset-0 border-4 border-t-[var(--color-secondary)] border-white/10 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-mono text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-white">
                Buscando Leads Qualificados
              </h3>
              <p className="text-white/50 font-mono text-sm">{loadingStage}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center p-12 border border-white/10 rounded-[24px] bg-white/5 backdrop-blur-md">
              <Crosshair size={48} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma empresa encontrada</h3>
              <p className="text-white/50">Tente buscar por outras palavras-chave ou categorias.</p>
            </div>
          ) : (
            <>
              {/* AI Consultant Box */}
              {query && (loadingAi || aiExplanation) && (
                <div className="bg-[#1C1C1E] border border-emerald-500/30 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden animate-fade-in">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-blue-500" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </div>
                    <h3 className="font-bold text-lg text-emerald-400">Consultor IA</h3>
                  </div>
                  <div className="text-white/80 text-[0.9375rem] leading-relaxed pl-11">
                    {loadingAi ? (
                      <span className="animate-pulse">Analisando os resultados e cruzando as empresas com a sua necessidade...</span>
                    ) : (
                      aiExplanation?.explanation || "Aqui estão os melhores resultados para o que você precisa."
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.map((company, index) => {
                  const hasCellphone = !!company.cellphone;
                const hasLandline = !!company.landline;
                const hasEmail = !!company.email;
                const hasInstagram = !!company.instagram;
                const hasLinkedin = !!company.linkedin;
                const activePhone = company.cellphone || company.landline;
                
                const leadScore: LeadScore = calculateLeadScore(company);
                
                // Construct dynamic pitches
                const cvMessage = cvPitchTemplate
                  .replace(/{empresa}/g, company.name || "empresa")
                  .replace(/{categoria}/g, company.category || "seu nicho");
                  
                const salesMessage = salesPitchTemplate
                  .replace(/{empresa}/g, company.name || "empresa")
                  .replace(/{categoria}/g, company.category || "seu nicho");
                
                return (
                  <div 
                    key={company.id} 
                    className="p-5 rounded-[20px] bg-[#1C1C1E]/90 border border-white/[0.08] backdrop-blur-md hover:border-white/20 transition-all group animate-fade-in-up flex flex-col"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.625rem] text-white/40 font-mono uppercase tracking-[0.1em]">Empresa Encontrada</span>
                        <span className="bg-purple-500/20 text-purple-300 text-[0.625rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Novo</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${leadScore.color} bg-opacity-10 backdrop-blur-sm`}>
                        <Flame size={12} className={leadScore.color.split(' ')[0]} />
                        <span className="text-[0.6875rem] font-bold uppercase tracking-wider">
                          {leadScore.label} ({leadScore.score})
                        </span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-[1.25rem] font-bold text-white leading-tight group-hover:text-[var(--color-secondary)] transition-colors line-clamp-1">
                          {company.name}
                        </h2>
                        {company.maps_url && (
                          <a href={company.maps_url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--color-secondary)] transition-colors" title="Abrir no Google Maps">
                            <MapPin size={16} />
                          </a>
                        )}
                      </div>
                      <p className="text-white/40 text-[0.8125rem] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        {company.category || "Empresa Local"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mb-5">
                      {/* Telefones - 2 Colunas */}
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

                        {hasLandline ? (
                          <button onClick={() => copyToClipboard(company.landline)} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-secondary)]/50 transition-colors group/btn cursor-pointer">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Phone size={13} className="text-blue-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80 truncate">{company.landline}</span>
                            </div>
                            <Copy size={14} className="text-white/20 group-hover/btn:text-[var(--color-secondary)] shrink-0 ml-2" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <Phone size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">Fixo</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}
                      </div>

                      {/* Email - Largura Total */}
                      {hasEmail ? (
                        <a href={`mailto:${company.email}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-secondary)]/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Mail size={13} className="text-amber-400 shrink-0" />
                            <span className="text-[0.8125rem] font-medium text-white/80 truncate">{company.email}</span>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-white/20 shrink-0" />
                            <span className="text-[0.8125rem] font-medium text-white/30 line-through">E-mail</span>
                          </div>
                          <XCircle size={14} className="text-white/20 shrink-0" />
                        </div>
                      )}

                      {/* Redes Sociais - 2 Colunas */}
                      <div className="grid grid-cols-2 gap-2">
                        {hasInstagram ? (
                          <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-secondary)]/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                              <InstagramIcon size={13} className="text-pink-400 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80">Instagram</span>
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

                        {hasLinkedin ? (
                          <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-secondary)]/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                              <LinkedinIcon size={13} className="text-blue-500 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/80">LinkedIn</span>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
                            <div className="flex items-center gap-2">
                              <LinkedinIcon size={13} className="text-white/20 shrink-0" />
                              <span className="text-[0.8125rem] font-medium text-white/30 line-through">LinkedIn</span>
                            </div>
                            <XCircle size={14} className="text-white/20 shrink-0" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-auto">
                      <div className="flex gap-2">
                        <a 
                          href={hasCellphone ? `https://wa.me/55${company.cellphone.replace(/\D/g, '')}?text=${encodeURIComponent(cvMessage)}` : '#'} 
                          target="_blank" rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-[0.8125rem] font-bold transition-all ${hasCellphone ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                          title={hasCellphone ? "Enviar Currículo via WhatsApp" : "Sem WhatsApp"}
                        >
                          <Briefcase size={14} /> Currículo
                        </a>
                        <a 
                          href={hasCellphone ? `https://wa.me/55${company.cellphone.replace(/\D/g, '')}?text=${encodeURIComponent(salesMessage)}` : '#'} 
                          target="_blank" rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-[0.8125rem] font-bold transition-all ${hasCellphone ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                          title={hasCellphone ? "Mensagem B2B via WhatsApp" : "Sem WhatsApp"}
                        >
                          <MessageSquare size={14} /> Prospectar
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)] selection:text-white flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Crosshair size={48} className="animate-spin text-white/20" /></div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}
