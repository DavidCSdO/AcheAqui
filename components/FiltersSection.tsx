"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { Filter, RefreshCw } from "lucide-react";

export default function FiltersSection() {
  const ref = useScrollReveal();
  const [estado, setEstado] = useState("SP");
  const [categoria, setCategoria] = useState("Restaurantes");
  const [rating, setRating] = useState("4.0");
  const [phone, setPhone] = useState(true);
  const [email, setEmail] = useState(true);
  const [insta, setInsta] = useState(false);
  const [linkedin, setLinkedin] = useState(false);

  const leads = () => {
    let b = 4850;
    if (estado === "RJ") b = 3200;
    if (estado === "MG") b = 2700;
    if (categoria === "Academias") b = 1900;
    if (rating === "4.5") b = Math.floor(b * 0.7);
    if (phone) b = Math.floor(b * 0.9);
    if (email) b = Math.floor(b * 0.85);
    if (insta) b = Math.floor(b * 0.6);
    if (linkedin) b = Math.floor(b * 0.5);
    return b;
  };

  return (
    <section className="section-padding bg-white relative">
      <div className="container-wide px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal" ref={ref}>
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Filtros Avançados
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Defina seu ICP com precisão cirúrgica
          </h2>
          <p className="text-body-lg">
            Combine filtros de localização, segmento, rating e canais de contato em tempo real.
          </p>
        </div>

        {/* Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Filter Panel */}
          <div className="lg:col-span-5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] p-8 border border-white/[0.06] text-white space-y-7">
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.06]">
              <span className="flex items-center gap-2 font-semibold text-[0.9375rem]">
                <Filter size={16} className="text-blue-400" />
                Filtros
              </span>
              <button
                onClick={() => { setEstado("SP"); setCategoria("Restaurantes"); setRating("4.0"); setPhone(true); setEmail(true); setInsta(false); setLinkedin(false); }}
                className="text-[0.75rem] text-white/30 hover:text-white/60 flex items-center gap-1 transition"
              >
                <RefreshCw size={11} />
                Resetar
              </button>
            </div>

            {/* Estado */}
            <div className="space-y-2.5">
              <label className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/30 font-mono font-semibold">Estado</label>
              <div className="grid grid-cols-3 gap-2">
                {["SP", "RJ", "MG", "PR", "SC", "RS"].map((uf) => (
                  <button key={uf} onClick={() => setEstado(uf)}
                    className={`py-2.5 text-[0.75rem] font-semibold rounded-[var(--radius-sm)] border transition-all duration-200 ${
                      estado === uf ? "bg-[var(--color-secondary)] border-[var(--color-secondary)] text-white" : "bg-white/[0.04] border-white/[0.06] text-white/40 hover:border-white/15"
                    }`}>
                    {uf}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-2.5">
              <label className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/30 font-mono font-semibold">Segmento</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-[var(--radius-sm)] px-4 py-3 text-[0.8125rem] text-white/80 focus:outline-none focus:border-[var(--color-secondary)]">
                <option value="Restaurantes">Restaurantes</option>
                <option value="Academias">Academias</option>
                <option value="Dentistas">Dentistas</option>
                <option value="Advogados">Advogados</option>
                <option value="Clínicas">Clínicas</option>
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2.5">
              <label className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/30 font-mono font-semibold">Avaliação Mínima</label>
              <div className="grid grid-cols-3 gap-2">
                {["3.5", "4.0", "4.5"].map((r) => (
                  <button key={r} onClick={() => setRating(r)}
                    className={`py-2.5 text-[0.75rem] font-semibold rounded-[var(--radius-sm)] border transition-all duration-200 ${
                      rating === r ? "bg-[var(--color-secondary)] border-[var(--color-secondary)] text-white" : "bg-white/[0.04] border-white/[0.06] text-white/40 hover:border-white/15"
                    }`}>
                    ⭐ {r}+
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="space-y-3 pt-5 border-t border-white/[0.06]">
              <label className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/30 font-mono font-semibold">Canais Obrigatórios</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Telefone", val: phone, set: setPhone },
                  { label: "E-mail", val: email, set: setEmail },
                  { label: "Instagram", val: insta, set: setInsta },
                  { label: "LinkedIn", val: linkedin, set: setLinkedin },
                ].map(({ label, val, set }) => (
                  <label key={label} className="flex items-center gap-2.5 text-[0.75rem] text-white/50 cursor-pointer hover:text-white/80 transition">
                    <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)}
                      className="rounded-[4px] bg-white/[0.04] border-white/[0.1] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] w-4 h-4" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Preview */}
          <div className="lg:col-span-7 space-y-5">
            {/* Lead Count Hero */}
            <div className="p-8 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] text-white flex items-center justify-between">
              <div>
                <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/60 font-mono font-semibold">
                  Leads com os Filtros Atuais
                </span>
                <div className="text-[3rem] font-bold font-numbers tracking-[-0.03em] mt-1">
                  {leads().toLocaleString("pt-BR")}
                  <span className="text-[1.25rem] font-normal text-white/60 ml-2">empresas</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-[var(--radius)] bg-white/10 flex items-center justify-center">
                <Crosshair size={28} className="text-white animate-slow-spin" />
              </div>
            </div>

            {/* Preview Cards */}
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] border border-white/[0.06] p-6 text-white space-y-4">
              <div className="flex items-center justify-between text-[0.6875rem] font-mono text-white/25 pb-3 border-b border-white/[0.06]">
                <span>PREVIEW</span>
                <span className="text-emerald-400">ATUALIZADO</span>
              </div>

              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-[var(--radius-sm)] bg-white/[0.03] border border-white/[0.05] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[0.8125rem] font-semibold text-white">
                        {i === 1 ? `${categoria} Premium ${estado}` : `Grupo ${categoria} Brasil`}
                      </h4>
                      <span className="text-[0.6875rem] text-white/30">{i === 1 ? "São Paulo" : "Campinas"}, {estado}</span>
                    </div>
                    <span className="text-[0.6875rem] text-amber-400 font-semibold">⭐ {i === 1 ? rating : "4.9"}+</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phone && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[0.625rem] font-mono border border-emerald-500/15">✓ Telefone</span>}
                    {email && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[0.625rem] font-mono border border-blue-500/15">✓ E-mail</span>}
                    {insta && <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[0.625rem] font-mono border border-pink-500/15">✓ Instagram</span>}
                    {linkedin && <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[0.625rem] font-mono border border-indigo-500/15">✓ LinkedIn</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
