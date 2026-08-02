"use client";

import React, { useState } from "react";
import Crosshair from "./Crosshair";
import { Calculator, ArrowRight, Sparkles, Clock, TrendingUp, DollarSign } from "lucide-react";

export default function RoiCalculatorSection() {
  const [leadsCount, setLeadsCount] = useState<number>(2500);

  // Calculations:
  // 1 lead manual = ~12 mins (0.2 hours)
  // Saved hours = leadsCount * 0.2
  // Estimated Pipeline = leadsCount * ~R$ 150 average B2B deal value
  const savedHours = Math.round(leadsCount * 0.2);
  const pipelineValue = (leadsCount * 180).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section className="py-24 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <Crosshair size={700} strokeWidth={0.5} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 shadow-2xl glow-border-trace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Controls & Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 font-mono text-[11px] tracking-wider">
                <Calculator size={13} className="text-violet-400" />
                <span>SIMULADOR DE ROI & RETORNO</span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Calcule quanto tempo e dinheiro sua equipe economizará
              </h2>

              <p className="text-white/60 text-sm leading-relaxed">
                Ajuste o slider abaixo com a meta de contatos mensais que sua empresa precisa abordar para fechar novos contratos B2B.
              </p>

              {/* Slider Input */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">Meta de Leads Mensais:</span>
                  <span className="text-violet-300 font-bold text-base font-mono">{leadsCount.toLocaleString()} leads/mês</span>
                </div>
                
                <input
                  type="range"
                  min="200"
                  max="15000"
                  step="100"
                  value={leadsCount}
                  onChange={(e) => setLeadsCount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
                />

                <div className="flex justify-between text-[10px] font-mono text-white/30">
                  <span>200 leads</span>
                  <span>7.500 leads</span>
                  <span>15.000 leads</span>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Results Display */}
            <div className="lg:col-span-6 bg-[#171523]/90 rounded-2xl border border-violet-400/30 p-6 space-y-6 shadow-xl">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-violet-400/40 hover:bg-white/[0.07] transition-all duration-200">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                    <Clock size={13} className="text-violet-400" />
                    Horas Economizadas
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {savedHours} hrs/mês
                  </div>
                  <div className="text-[10px] text-white/30 font-mono">Economizadas em pesquisas</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-violet-400/40 hover:bg-white/[0.07] transition-all duration-200">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                    <TrendingUp size={13} className="text-pink-400" />
                    Assertividade
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-violet-300">
                    99.8%
                  </div>
                  <div className="text-[10px] text-white/30 font-mono">Contatos ativos testados</div>
                </div>
              </div>

              {/* Total Pipeline Generated Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/10 border border-violet-400/40 space-y-1.5 hover:border-violet-400/70 hover:shadow-[0_0_30px_rgba(167,139,250,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between text-xs text-violet-300 font-mono font-semibold">
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-emerald-400" />
                    Volume Estimado de Pipeline B2B
                  </span>
                  <Sparkles size={13} className="text-violet-400 animate-pulse" />
                </div>
                <div className="text-3xl font-bold font-mono text-white tracking-tight">
                  {pipelineValue}
                </div>
                <p className="text-[11px] text-white/50">
                  Potencial bruto de novos negócios gerados com prospecção ativa via AcheAqui.
                </p>
              </div>

              <a
                href="/auth"
                className="group w-full py-3.5 px-6 rounded-xl bg-violet-500 hover:bg-violet-600 hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] text-white font-semibold text-xs font-mono text-center flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                COMEÇAR COM ESSA META AGORA <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
