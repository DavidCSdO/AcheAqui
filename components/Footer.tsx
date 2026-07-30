"use client";

import React from "react";
import Crosshair from "./Crosshair";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white/40 border-t border-white/[0.06] pt-16 pb-10 text-[0.8125rem] relative">
      <div className="container-wide px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5 pr-8">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--color-secondary)] flex items-center justify-center text-white">
                <Crosshair size={14} strokeWidth={2} />
              </div>
              <span className="text-[1rem] font-bold text-white tracking-[-0.01em]">
                Ache<span className="text-blue-400">Aqui</span>
              </span>
            </a>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed max-w-sm">
              Inteligência comercial B2B em tempo real. Dados 100% validados para acelerar vendas.
            </p>
            <div className="flex items-center gap-2 text-[0.6875rem] font-mono text-emerald-400 bg-white/[0.03] px-3 py-1.5 rounded-[10px] border border-white/[0.06] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Todos os sistemas operacionais
            </div>
          </div>

          {/* Produto */}
          <div className="space-y-4">
            <h4 className="text-[0.6875rem] font-bold text-white uppercase tracking-[0.1em] font-mono">Produto</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Busca Inteligente", href: "/" },
                { label: "Enriquecimento", href: "/" },
                { label: "API REST", href: "/api-docs" },
                { label: "Planos & Preços", href: "/pricing" },
                { label: "Changelog", href: "#" }
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                    {l.label}
                    {l.label === "Changelog" && <ArrowUpRight size={11} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluções */}
          <div className="space-y-4">
            <h4 className="text-[0.6875rem] font-bold text-white uppercase tracking-[0.1em] font-mono">Soluções</h4>
            <ul className="space-y-2.5">
              {["Times de Vendas", "Agências", "Consultorias", "Recrutamento", "Franquias"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div className="space-y-4">
            <h4 className="text-[0.6875rem] font-bold text-white uppercase tracking-[0.1em] font-mono">Recursos</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Documentação", href: "/api-docs" },
                { label: "FAQ", href: "/#faq" },
                { label: "LGPD", href: "#" },
                { label: "Termos de Uso", href: "#" },
                { label: "Privacidade", href: "#" }
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors duration-200">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.6875rem] font-mono text-white/20">
          <span>© {new Date().getFullYear()} AcheAqui Inc.</span>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub", "Status"].map((l) => (
              <a key={l} href="#" className="hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
