"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, ArrowUp, Zap } from "lucide-react";

export default function DynamicIslandBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-fade-in-up">
      <div className="group bg-[#171523]/90 backdrop-blur-2xl border border-white/20 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-violet-400/60 hover:shadow-[0_0_35px_rgba(167,139,250,0.35)] transition-all duration-300 flex items-center gap-3 sm:gap-5">
        
        {/* Live Status Telemetry Indicator */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-white/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="hidden xs:inline-block text-white/60">REDE:</span>
          <span className="text-emerald-400 font-bold">2.483 LEADS HOJE</span>
        </div>

        <div className="w-px h-4 bg-white/15" />

        {/* Quick Action Button */}
        <button
          onClick={scrollToTop}
          className="group/btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500 hover:bg-violet-600 text-white font-semibold text-[11px] font-mono shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={12} className="text-violet-200 group-hover/btn:rotate-12 transition-transform" />
          <span>PROSPECÇÃO IA</span>
          <ArrowUp size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
}
