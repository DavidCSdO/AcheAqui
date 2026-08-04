"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Crosshair from "./Crosshair";
import InteractiveCrosshair from "./InteractiveCrosshair";
import DotMatrixCanvas from "./DotMatrixCanvas";
import { Search, MapPin, Star, Phone, Mail, Paperclip, ArrowUp, Sparkles } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const allSuggestions = [
    "Clínicas odontológicas SP",
    "Advogados no Rio de Janeiro",
    "Agências de marketing PR",
    "Padarias artesanais BH",
    "Contabilidade Porto Alegre",
    "Crossfit em Salvador",
    "Restaurantes veganos",
    "Imobiliárias Florianópolis",
    "Veterinárias Curitiba",
    "Petshops em Fortaleza",
    "Salões de beleza Recife",
    "Lojas de carros Goiânia"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 3) % allSuggestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let loop = 0;
    let timer: NodeJS.Timeout;

    const type = () => {
      const current = allSuggestions[loop % allSuggestions.length];
      
      if (isDeleting) {
        setPlaceholder(current.substring(0, i - 1));
        i--;
      } else {
        setPlaceholder(current.substring(0, i + 1));
        i++;
      }

      let speed = isDeleting ? 30 : 70;

      if (!isDeleting && i === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        loop++;
        speed = 500;
      }

      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, 70);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    
    const limitInput = formRef.current?.elements.namedItem('limit') as HTMLInputElement;
    const modeInput = formRef.current?.elements.namedItem('mode') as HTMLSelectElement;
    
    const limit = limitInput?.value || '20';
    const mode = modeInput?.value || 'direcionada';
    
    router.push(`/search?q=${encodeURIComponent(query)}&limit=${limit}&mode=${mode}`);
    
    setTimeout(() => setIsSearching(false), 800);
  };

  const handlePillClick = (text: string) => {
    let i = 0;
    setQuery("");
    setIsFocused(true);
    const typeInterval = setInterval(() => {
      setQuery(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          if (formRef.current) formRef.current.submit();
        }, 400);
      }
    }, 30);
  };

  const showOptions = isFocused || query.length > 0;

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-center items-center pt-[120px] pb-20 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      {/* Interactive Dot Matrix Canvas Layer */}
      <DotMatrixCanvas />

      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Background Icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <Crosshair size={800} strokeWidth={0.5} />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full mt-10">
        
        <InteractiveCrosshair />

        {/* Display Headline — Editorial Serif Style */}
        <h1 
          className="animate-hero-rise-2 editorial-title text-[clamp(3rem,7vw,5.5rem)] text-white mb-6 drop-shadow-[0_10px_25px_rgba(167,139,250,0.2)]"
        >
          Ache a Empresa <span className="text-violet-400">Perfeita</span>.
        </h1>

        <p className="animate-hero-rise-3 text-[1.125rem] text-white/60 font-light mb-12 max-w-lg tracking-wide">
          Prospecção inteligente B2B com IA.
        </p>

        {/* Ultra-Minimalist Search Bar */}
        <form 
          ref={formRef}
          onSubmit={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsFocused(false);
            }
          }}
          className="animate-hero-rise-4 w-full max-w-2xl mb-6 relative group" 
        >
          <div className={`bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[24px] p-2 flex flex-col transition-all duration-500 ${
            showOptions 
              ? "ring-1 ring-violet-500/30 border-violet-500/50 bg-white/[0.05]" 
              : "hover:border-white/20 hover:bg-white/[0.05]"
          }`}>
            <div className="flex items-center gap-3 px-4 py-2">
              <input 
                type="text" 
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-transparent border-none text-white text-[1.125rem] placeholder:text-white/30 focus:outline-none font-light h-[52px]"
              />

              {/* Dynamic Reveal Filters Container (Emerge suavemente no lugar) */}
              {showOptions && (
                <div className="flex items-center gap-3 transition-all duration-300 animate-fade-in shrink-0">
                  {/* Leads Count Selector */}
                  <div className="hidden sm:flex items-center border-l border-white/12 pl-3 shrink-0">
                    <input 
                      type="number" 
                      name="limit" 
                      defaultValue="20" 
                      min="1" 
                      max="500"
                      className="bg-transparent text-[0.875rem] text-white/80 w-14 focus:outline-none text-center font-mono hover:text-white transition-colors"
                      placeholder="20"
                    />
                    <span className="text-[0.75rem] text-white/40 mr-2">Leads</span>
                  </div>

                  {/* Mode Selector */}
                  <select name="mode" defaultValue="direcionada" className="bg-transparent text-[0.875rem] text-white/80 border-l border-white/12 pl-2 focus:outline-none hidden md:block appearance-none cursor-pointer hover:text-white transition-colors">
                    <option value="simples" className="bg-[#1C1C1E]">⚡ Rápida</option>
                    <option value="direcionada" className="bg-[#1C1C1E]">📍 Direcionada</option>
                    <option value="completa" className="bg-[#1C1C1E]">🕵️ Completa</option>
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="group bg-violet-500 hover:bg-violet-600 hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] text-white p-3 rounded-xl transition-all duration-300 ml-1 cursor-pointer shadow-md shrink-0 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <Search size={17} className="group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Search Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 h-[40px]">
          {[0, 1, 2].map((offset) => {
            const index = (suggestionIndex + offset) % allSuggestions.length;
            const suggestion = allSuggestions[index];
            return (
              <button 
                key={`${index}-${suggestion}`}
                onClick={() => handlePillClick(suggestion)}
                className="group px-5 py-2 rounded-full bg-white/[0.07] backdrop-blur-md text-white text-[0.8125rem] font-medium hover:bg-violet-500/20 hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.25)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 border border-white/10 font-mono cursor-pointer flex items-center"
              >
                <span className="opacity-50 mr-2 group-hover:scale-125 transition-transform duration-300 inline-block">🔍</span> {suggestion}
              </button>
            );
          })}
        </div>

      </div>

      {/* Atmospheric Fog Gradient Fade Transition to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-36 hero-fog-gradient pointer-events-none z-30" />
    </section>
  );
}
