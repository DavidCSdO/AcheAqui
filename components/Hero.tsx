"use client";

import React, { useState, useEffect, useRef } from "react";
import Crosshair from "./Crosshair";
import { Search, MapPin, Star, Phone, Mail, Paperclip, ArrowUp } from "lucide-react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState("");
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
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handlePillClick = (text: string) => {
    let i = 0;
    setQuery("");
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

  return (
    <section 
      className="relative min-h-screen flex flex-col items-center pt-[140px] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      {/* Very subtle dark overlay so the white text pops without destroying the sky colors */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Large Decorative Background Icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <Crosshair size={800} strokeWidth={0.5} />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        
        {/* Minimal Icon */}
        <div className="mb-6 animate-fade-in-up">
          <Crosshair size={32} className="text-white/90" strokeWidth={2} />
        </div>

        {/* Display Headline — Clean, Editorial, Minimalist */}
        <h1 
          className="text-[clamp(2.75rem,6vw,4.5rem)] text-white mb-2 animate-fade-in-up tracking-tight"
          style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
        >
          Ache a Empresa Perfeita
        </h1>

        <p className="text-[1.125rem] text-white/80 font-medium mb-12 max-w-lg animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          Prospecção inteligente B2B com IA. Sem esforço.
        </p>

        {/* Search Bar - Minimalist Dark Island */}
        <form 
          ref={formRef}
          action="/search" 
          method="GET" 
          className="w-full max-w-2xl mb-6 animate-fade-in-up relative group" 
          style={{ animationDelay: "300ms" }}
        >
          <div className="bg-[#1C1C1E] rounded-[16px] p-2 shadow-2xl flex flex-col transition-all duration-300 focus-within:ring-2 focus-within:ring-white/10">
            <div className="flex items-center gap-3 px-4 py-2">
              <input
                type="text"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || "O que você procura?"}
                className="flex-1 bg-transparent text-[0.9375rem] text-white placeholder:text-white/40 focus:outline-none"
              />
              <div className="hidden sm:flex items-center border-l border-white/10 pl-4 h-full shrink-0">
                <input 
                  type="number" 
                  name="limit" 
                  defaultValue="20" 
                  min="1" 
                  max="500"
                  className="bg-transparent text-[0.875rem] text-white/70 w-20 focus:outline-none text-center"
                  placeholder="20"
                />
                <span className="text-[0.75rem] text-white/40 mr-3">Leads</span>
              </div>
              <select name="mode" defaultValue="direcionada" className="bg-transparent text-[0.875rem] text-white/70 border-l border-white/10 pl-3 focus:outline-none hidden md:block appearance-none cursor-pointer">
                <option value="simples" className="bg-[#1C1C1E]">⚡ Rápida</option>
                <option value="direcionada" className="bg-[#1C1C1E]">📍 Direcionada</option>
                <option value="completa" className="bg-[#1C1C1E]">🕵️ Completa</option>
              </select>
              <button 
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all ml-2"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Search Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 h-[40px] animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          {[0, 1, 2].map((offset) => {
            const index = (suggestionIndex + offset) % allSuggestions.length;
            const suggestion = allSuggestions[index];
            return (
              <button 
                key={`${index}-${suggestion}`}
                onClick={() => handlePillClick(suggestion)}
                className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[0.8125rem] font-medium hover:bg-white/20 hover:scale-105 transition-all border border-transparent hover:border-white/10 animate-fade-in-up"
              >
                <span className="opacity-50 mr-2">🔍</span> {suggestion}
              </button>
            );
          })}
        </div>

      </div>

      {/* Very soft gradient to blend into the next dark section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-primary)] to-transparent pointer-events-none z-30" />
    </section>
  );
}
