"use client";

import React, { useState, useEffect } from "react";
import Crosshair from "./Crosshair";
import { Search, MapPin, Star, Phone, Mail, Paperclip, ArrowUp } from "lucide-react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Simulate scrolling to results or next section
      document.getElementById('live-feed')?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  const handlePillClick = (text: string) => {
    setQuery(text);
    setTimeout(() => {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        document.getElementById('live-feed')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }, 100);
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
          onSubmit={handleSearch}
          className="w-full max-w-2xl mb-6 animate-fade-in-up" 
          style={{ animationDelay: "300ms" }}
        >
          <div className="bg-[#1C1C1E] rounded-[16px] p-2 shadow-2xl flex flex-col transition-all duration-300 focus-within:ring-2 focus-within:ring-white/10">
            <div className="flex items-center gap-3 px-4 py-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Clínicas odontológicas em São Paulo..."
                className="flex-1 bg-transparent text-[0.9375rem] text-white placeholder:text-white/40 focus:outline-none"
              />
              <button type="button" className="text-white/40 hover:text-white transition-colors p-2 rounded-lg">
                <Paperclip size={16} />
              </button>
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                {isSearching ? (
                  <Crosshair size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Minimal Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          <button 
            onClick={() => handlePillClick("Leads Qualificados")}
            className="px-5 py-2.5 rounded-full bg-white text-black text-[0.8125rem] font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Leads Qualificados
          </button>
          <button 
            onClick={() => handlePillClick("Enriquecimento de Dados")}
            className="px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-md text-white text-[0.8125rem] font-medium hover:bg-black/50 transition-colors border border-transparent hover:border-white/10"
          >
            Enriquecimento
          </button>
          <button 
            onClick={() => handlePillClick("Integrações via API")}
            className="px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-md text-white text-[0.8125rem] font-medium hover:bg-black/50 transition-colors border border-transparent hover:border-white/10"
          >
            Integrações API
          </button>
        </div>

      </div>

      {/* Very soft gradient to blend into the next dark section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-primary)] to-transparent pointer-events-none z-30" />
    </section>
  );
}
