"use client";

import React, { useState, useEffect } from "react";
import Crosshair from "./Crosshair";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-primary)]/70 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              scrolled ? "bg-[var(--color-secondary)] text-white" : "bg-white text-[var(--color-primary)]"
            }`}
          >
            <Crosshair size={17} strokeWidth={2} />
          </div>
          <span className="text-[1.15rem] font-bold tracking-[-0.02em] text-white transition-colors">
            Ache<span style={{ color: scrolled ? "var(--color-secondary)" : "rgba(255,255,255,0.7)" }}>Aqui</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Produto", href: "/" },
            { label: "Preço", href: "/pricing" },
            { label: "API", href: "/api-docs" },
            { label: "Docs", href: "/api-docs" }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.875rem] font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/auth"
            className="text-[0.875rem] font-medium px-3 py-2 text-white/70 hover:text-white transition-colors"
          >
            Login
          </a>
          <a 
            href="/auth" 
            className={`flex items-center gap-2 text-[0.8125rem] font-semibold !py-[10px] !px-5 rounded-[var(--radius-sm)] transition-all hover:scale-105 active:scale-95 ${
              scrolled
              ? "bg-[var(--color-secondary)] text-white hover:bg-purple-500"
              : "bg-white text-[var(--color-primary)] hover:bg-white/90"
            }`}
          >
            Começar grátis
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 ${scrolled ? "text-[var(--color-text-secondary)]" : "text-white"}`}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[var(--color-border)] px-6 py-8 space-y-5 animate-fade-in">
          {["Produto", "Preço", "API", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="block text-[0.9375rem] font-medium text-[var(--color-text-primary)]"
            >
              {item}
            </a>
          ))}
          <div className="pt-5 border-t border-[var(--color-border)] space-y-3">
            <a href="/dashboard" className="block text-center text-[0.875rem] font-medium py-2.5 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)]">
              Login
            </a>
            <a href="#comecar" className="btn-primary w-full justify-center text-[0.875rem]">
              Começar grátis
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
