"use client";

import React, { useState, useEffect } from "react";
import Crosshair from "./Crosshair";
import { X, ArrowRight, Settings } from "lucide-react";
import SettingsModal from "./SettingsModal";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatting date/time to match the Aveon style
  // E.g. "Tuesday, August 4, 2026"
  const dateFormatted = currentTime.toLocaleDateString("en-US", {
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });
  
  // E.g. "15:07:16"
  const timeFormatted = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-transparent">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
          
          {/* LEFT: Menu Button */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => setMobileOpen(true)}
              className={`pl-3 pr-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center gap-3 text-white shadow-lg backdrop-blur-md group`}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <Crosshair 
                  size={20} 
                  strokeWidth={2.5} 
                  className={`transition-all duration-500 ${mobileOpen ? 'rotate-180 scale-90' : 'animate-[spin_4s_linear_infinite]'}`}
                />
              </div>
              <span className="text-[11px] font-mono tracking-[0.2em] font-semibold text-white/70 group-hover:text-white transition-colors">
                MENU
              </span>
            </button>
          </div>

          {/* CENTER: Branding Text */}
          <div className="flex-1 flex justify-center hidden sm:flex">
            <span className="text-[11px] font-mono tracking-[0.15em] text-white/50 uppercase whitespace-nowrap">
              AcheAqui - B2B Prospecting
            </span>
          </div>

          {/* RIGHT: Clock & Date */}
          <div className="flex-1 flex justify-end items-center gap-2 text-[11px] font-mono tracking-widest text-white/50 uppercase">
            {mounted ? (
              <>
                <span className="hidden lg:block whitespace-nowrap">{dateFormatted}</span>
                <span className="text-white/80 w-[70px] text-right">{timeFormatted}</span>
              </>
            ) : (
              <span className="w-[70px]"></span>
            )}
          </div>

        </div>
      </header>

      {/* OFFCANVAS SIDEBAR MENU */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`absolute top-0 left-0 h-full w-[85vw] md:w-[45vw] max-w-[500px] bg-[#110f1a] border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header of Sidebar */}
          <div className="flex items-center justify-between p-6 md:p-10 border-b border-white/5">
            <div className="flex flex-col gap-1">
              <a href="/" className="flex items-center gap-2 group w-max">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-secondary)] text-white flex items-center justify-center">
                  <Crosshair size={14} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  AcheAqui
                </span>
              </a>
              <span className="text-[9px] font-mono tracking-[0.1em] text-white/40 uppercase">
                Plataforma de Prospecção - Est. 2024
              </span>
            </div>
            
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Large Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-8 gap-4 overflow-y-auto">
            <Link 
              href="/" 
              onClick={() => setMobileOpen(false)}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/60 hover:text-white transition-colors duration-300 w-max"
            >
              Home
            </Link>
            <Link 
              href="/prospecting" 
              onClick={() => setMobileOpen(false)}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/60 hover:text-[var(--color-secondary)] transition-colors duration-300 w-max"
            >
              Prospecção
            </Link>
            <Link 
              href="/crm" 
              onClick={() => setMobileOpen(false)}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/60 hover:text-white transition-colors duration-300 w-max"
            >
              Meu CRM
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setMobileOpen(false)}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/60 hover:text-white transition-colors duration-300 w-max"
            >
              Preço
            </Link>
            
            <button 
              onClick={() => { setSettingsOpen(true); setMobileOpen(false); }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-violet-500/60 hover:text-violet-400 transition-colors duration-300 w-max text-left flex items-center gap-4 mt-4"
            >
              Pitches <Settings size={32} className="opacity-50" />
            </button>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-6 md:p-10 border-t border-white/5 flex flex-col sm:flex-row gap-8 justify-between mt-auto bg-[#171523]/50">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--color-secondary)] uppercase">
                [ Suporte ]
              </span>
              <div className="flex flex-col text-sm text-white/50 font-medium">
                <a href="mailto:contato@acheaqui.com" className="hover:text-white transition-colors">
                  contato@acheaqui.com
                </a>
                <span>+55 (11) 9999-9999</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold font-mono tracking-widest text-violet-400 uppercase">
                [ Acesso ]
              </span>
              <div className="flex flex-col text-sm text-white/50 font-medium gap-1">
                {isLoggedIn ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 text-white hover:text-violet-300 transition-colors">
                    Dashboard <ArrowRight size={14} />
                  </Link>
                ) : (
                  <>
                    <Link href="/auth" onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">
                      Fazer Login
                    </Link>
                    <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 text-white hover:text-violet-300 transition-colors">
                      Começar grátis <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="px-6 md:px-10 pb-6 pt-2 text-[10px] font-medium text-white/30 uppercase tracking-wider bg-[#171523]/50">
            © {new Date().getFullYear()} ACHEAQUI B2B
          </div>
        </div>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
