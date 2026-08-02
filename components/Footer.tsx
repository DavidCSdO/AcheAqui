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
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-[8px] bg-violet-500 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-180 transition-all duration-500 shadow-md shadow-violet-500/30">
                <Crosshair size={14} strokeWidth={2} />
              </div>
              <span className="text-[1rem] font-bold text-white tracking-[-0.01em] group-hover:text-violet-200 transition-colors">
                Ache<span className="text-violet-400 group-hover:text-violet-300 transition-colors">Aqui</span>
              </span>
            </a>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed max-w-sm">
              Inteligência comercial B2B em tempo real. Dados 100% validados para acelerar vendas.
            </p>
            <div className="flex items-center gap-2 text-[0.6875rem] font-mono text-emerald-400 bg-white/[0.03] px-3 py-1.5 rounded-[10px] border border-white/[0.06] w-fit hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all cursor-default">
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
                  <a href={l.href} className="group text-white/50 hover:text-violet-300 hover:translate-x-1 transition-all duration-200 flex items-center gap-1">
                    {l.label}
                    {l.label === "Changelog" && <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
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
                  <a href="#" className="text-white/50 hover:text-violet-300 hover:translate-x-1 transition-all duration-200 inline-block">{l}</a>
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
                  <a href={l.href} className="text-white/50 hover:text-violet-300 hover:translate-x-1 transition-all duration-200 inline-block">{l.label}</a>
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
              <a key={l} href="#" className="hover:text-violet-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
