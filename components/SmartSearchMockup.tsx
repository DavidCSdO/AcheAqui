"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { List, MapPin, Table, Phone, Mail, Loader2, Play } from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const SmartSearchMap = dynamic(() => import("./SmartSearchMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] rounded-[18px] bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
      <span className="text-white/20 text-sm font-mono animate-pulse">Carregando mapa…</span>
    </div>
  ),
});

export default function SmartSearchMockup() {
  const ref = useScrollReveal();
  const [view, setView] = useState<"lista" | "mapa" | "tabela">("lista");
  
  const [realData, setRealData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "streaming" | "done">("idle");
  
  const eventSourceRef = useRef<EventSource | null>(null);

  // Listen for search events from the Hero component to avoid F5 full reloads
  useEffect(() => {
    const handleRemoteSearch = (e: any) => {
      const q = e.detail;
      setSearchInput(q);
      startStreamingSearch(q);
    };
    
    window.addEventListener('doSmartSearch', handleRemoteSearch);
    
    // Also parse URL on mount (fallback if they landed with ?q=...)
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchInput(query);
      startStreamingSearch(query);
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.toString());
    }
    
    return () => {
      window.removeEventListener('doSmartSearch', handleRemoteSearch);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const startStreamingSearch = (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsSearching(true);
    setSearchError("");
    setRealData([]); // Clear previous results
    setConnectionStatus("connecting");
    setLoading(true);

    try {
      const url = `http://localhost:8000/api/scrape/stream?q=${encodeURIComponent(queryToSearch)}&limit=15&mode=direcionada`;
      const source = new EventSource(url);
      eventSourceRef.current = source;

      source.onopen = () => {
        setConnectionStatus("streaming");
        setLoading(false); // Stop the main spinner once connected
      };

      source.onmessage = (event) => {
        if (event.data === "[DONE]") {
          source.close();
          setIsSearching(false);
          setConnectionStatus("done");
          return;
        }

        try {
          const data = JSON.parse(event.data);
          
          if (data.error) {
            setSearchError(data.error);
            source.close();
            setIsSearching(false);
            setConnectionStatus("done");
            return;
          }

          // Map the Python backend keys to our frontend structure
          const mappedLead = {
            name: data["Nome"] || "Empresa Desconhecida",
            category: data["Categoria"] || "Categoria Geral",
            address: data["Endereço"] || "Endereço não informado",
            phone: data["Telefone Celular"] || data["Telefone Fixo"] || "Não informado",
            email: data["Email Geral"] || data["Email RH"] || "Não informado",
            google_rating: data["Nota Google"] || "N/A",
            // Since the scraper might not return exact lat/lng immediately in standard mode, we mock it near SP for the map visual
            // OR if the API returns lat/lng, we use it.
            lat: data["lat"] || -23.55 + (Math.random() - 0.5) * 0.1,
            lng: data["lng"] || -46.63 + (Math.random() - 0.5) * 0.1,
          };

          // Append incrementally!
          setRealData(prev => [...prev, mappedLead]);
        } catch (err) {
          console.error("Error parsing stream data:", err);
        }
      };

      source.onerror = (err) => {
        console.error("SSE Error:", err);
        setSearchError("Erro ao conectar com o backend. Verifique se o servidor Python (uvicorn) está rodando na porta 8000.");
        source.close();
        setIsSearching(false);
        setConnectionStatus("done");
        setLoading(false);
      };

    } catch (error: any) {
      setSearchError(error.message);
      setIsSearching(false);
      setConnectionStatus("done");
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startStreamingSearch(searchInput);
  };

  return (
    <section id="pesquisa-inteligente" className="section-padding bg-white relative">
      <div className="container-wide px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal" ref={ref}>
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Pesquisa Inteligente (Dados Reais)
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Testando com Dados Reais (API Python)
          </h2>
          <p className="text-body-lg">
            Os resultados abaixo estão sendo raspados <strong>em tempo real</strong> do Google Maps pelo seu backend Python (FastAPI).
          </p>
        </div>

        {/* Mockup Frame */}
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] border border-white/[0.06] shadow-[0_32px_80px_-12px_rgba(13,27,42,0.3)] overflow-hidden">

          {/* App Bar */}
          <div className="px-6 py-4 bg-white/[0.03] border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-3 bg-white/[0.04] px-4 py-2.5 rounded-[var(--radius-sm)] border border-white/[0.06] search-glow max-w-xl focus-within:border-violet-500/50 transition-colors"
            >
              {isSearching ? (
                <Loader2 size={16} className="text-violet-400 animate-spin shrink-0" />
              ) : (
                <Crosshair size={16} className="text-[var(--color-secondary)] shrink-0" />
              )}
              <input
                type="text"
                placeholder="Ex: Clínicas Odontológicas em São Paulo..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={isSearching}
                className="bg-transparent border-none outline-none text-[0.8125rem] text-white w-full placeholder:text-white/40 font-medium"
              />
              <button 
                type="submit" 
                disabled={isSearching || !searchInput.trim()}
                className="text-[0.6875rem] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 py-1.5 rounded transition-colors font-semibold hidden sm:flex items-center gap-1.5"
              >
                <Play size={12} />
                Varrer Agora
              </button>
            </form>

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
          <div className="p-6 min-h-[400px] relative">
            {searchError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2 rounded-full backdrop-blur-md">
                {searchError}
              </div>
            )}
            
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                <p className="text-sm font-mono text-white/50">Conectando ao backend Python...</p>
              </div>
            ) : realData.length === 0 && connectionStatus !== "streaming" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-white/30">
                <Crosshair size={32} className="opacity-20" />
                <p className="text-sm font-mono">Pronto para iniciar varredura. Digite uma busca acima.</p>
              </div>
            ) : (
              <>
                {view === "lista" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {realData.map((r, i) => (
                      <div key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-violet-400/50 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(167,139,250,0.2)] transition-all duration-300 space-y-3 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="pr-4">
                            <h4 className="text-[0.9375rem] font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">{r.name}</h4>
                            <p className="text-[0.75rem] text-white/40 line-clamp-1" title={r.category}>{r.category}</p>
                          </div>
                          <span className="text-[0.6875rem] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono shrink-0">
                            ⭐ {r.google_rating}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-4 text-[0.6875rem] font-mono">
                          <span className="text-emerald-400/80 flex items-center gap-1 group-hover:text-emerald-300 transition-colors truncate max-w-[150px]"><Phone size={11} />{r.phone}</span>
                          <span className="text-blue-400/80 flex items-center gap-1 truncate max-w-[150px] group-hover:text-violet-300 transition-colors" title={r.email}><Mail size={11} />{r.email}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Ghost card skeleton during streaming */}
                    {isSearching && (
                      <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3 animate-pulse">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-white/5 rounded"></div>
                            <div className="h-3 w-24 bg-white/5 rounded"></div>
                          </div>
                          <div className="h-4 w-12 bg-white/5 rounded"></div>
                        </div>
                        <div className="pt-3 border-t border-white/[0.02] flex gap-4">
                          <div className="h-3 w-20 bg-white/5 rounded"></div>
                          <div className="h-3 w-32 bg-white/5 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {view === "mapa" && (
                  <SmartSearchMap results={realData} batchSize={4} />
                )}

                {view === "tabela" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[0.6875rem] uppercase tracking-[0.08em] text-white/25 font-mono">
                          <th className="p-3 min-w-[200px]">Empresa</th>
                          <th className="p-3 min-w-[150px]">Atividade</th>
                          <th className="p-3">Telefone</th>
                          <th className="p-3">E-mail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {realData.map((r, i) => (
                          <tr key={i} className="hover:bg-white/[0.06] hover:text-white transition-all duration-200 text-[0.8125rem] cursor-pointer group">
                            <td className="p-3 font-semibold text-white group-hover:text-violet-300 transition-colors truncate max-w-[200px]">{r.name}</td>
                            <td className="p-3 text-white/40 group-hover:text-white/60 transition-colors truncate max-w-[150px]" title={r.category}>{r.category}</td>
                            <td className="p-3 font-mono text-emerald-400/80 text-[0.75rem] group-hover:text-emerald-300 transition-colors">{r.phone}</td>
                            <td className="p-3 font-mono text-blue-400/80 text-[0.75rem] group-hover:text-violet-300 transition-colors truncate max-w-[150px]" title={r.email}>{r.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[0.6875rem] text-white/25 font-mono">
            <span>{realData.length} registros extraídos</span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isSearching ? 'bg-violet-400 animate-ping' : 'bg-white/20'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSearching ? 'bg-violet-500' : 'bg-white/20'}`}></span>
              </span>
              {isSearching ? "Varrendo a internet (SSE)..." : "Pronto."}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
