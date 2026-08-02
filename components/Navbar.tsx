"use client";

import React, { useState, useEffect } from "react";
import Crosshair from "./Crosshair";
import { ArrowRight, Menu, X, Settings } from "lucide-react";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setIsLoggedIn(true);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsLoggedIn(!!session);
        });
        return () => subscription.unsubscribe();
      } catch (e) {
        // Fallback gracefully
      }
    };
    checkUser();
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#171523]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        {/* Brand Logo with Dynamic Colors on Scroll */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-[180deg] ${
              scrolled
                ? "bg-violet-500 text-white shadow-md shadow-violet-500/25"
                : "bg-white text-[#171523] shadow-md shadow-white/10"
            }`}
          >
            <Crosshair size={17} strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-sans group-hover:text-violet-200 transition-colors duration-300">
              Ache
              <span
                className={`transition-colors duration-300 ${
                  scrolled ? "text-violet-400" : "text-white/70 group-hover:text-white"
                }`}
              >
                Aqui
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          <a
            href="/"
            className="text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Produto
          </a>
          <a
            href="/pricing"
            className="text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Preço
          </a>
          <a
            href="/crm"
            className="text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Meu CRM
          </a>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-white/75 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/20 border border-transparent px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Settings size={13} className="transition-transform duration-300 group-hover:rotate-45" /> Pitches
          </button>
        </nav>

        {/* Action Buttons with Dynamic Styles on Scroll */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <a 
              href="/dashboard" 
              className={`group flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md ${
                scrolled
                  ? "bg-violet-500 text-white hover:bg-violet-600 hover:shadow-violet-500/30"
                  : "bg-white text-[#171523] hover:bg-white/95 hover:shadow-white/20"
              }`}
            >
              Acessar Dashboard
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          ) : (
            <>
              <a
                href="/auth"
                className="text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all duration-200"
              >
                Login
              </a>
              <a 
                href="/auth" 
                className={`group flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md ${
                  scrolled
                    ? "bg-violet-500 text-white hover:bg-violet-600 hover:shadow-violet-500/30"
                    : "bg-white text-[#171523] hover:bg-white/95 hover:shadow-white/20"
                }`}
              >
                Começar grátis
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#171523]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in text-slate-200 shadow-2xl">
          <div className="flex flex-col gap-3 text-xs">
            <a href="/" onClick={() => setMobileOpen(false)} className="font-medium text-white/80 hover:text-white">
              Produto
            </a>
            <a href="/pricing" onClick={() => setMobileOpen(false)} className="font-medium text-white/80 hover:text-white">
              Preço
            </a>
            <a href="/crm" onClick={() => setMobileOpen(false)} className="font-medium text-white/80 hover:text-white">
              Meu CRM
            </a>
            <button 
              onClick={() => { setSettingsOpen(true); setMobileOpen(false); }}
              className="text-left font-medium text-violet-400 flex items-center gap-1.5"
            >
              <Settings size={14} /> Configurar Pitches
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isLoggedIn ? (
              <a href="/dashboard" className="py-2.5 px-4 rounded-xl bg-violet-500 text-white font-semibold text-center text-xs flex items-center justify-center gap-1">
                Acessar Dashboard <ArrowRight size={13} />
              </a>
            ) : (
              <>
                <a href="/auth" className="py-2 text-center text-xs font-medium text-white/80 border border-white/10 rounded-xl">
                  Login
                </a>
                <a href="/auth" className="py-2.5 px-4 rounded-xl bg-white text-[#171523] font-semibold text-center text-xs flex items-center justify-center gap-1">
                  Começar grátis <ArrowRight size={13} />
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
