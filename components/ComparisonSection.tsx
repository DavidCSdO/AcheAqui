"use client";

import React from "react";
import Crosshair from "./Crosshair";
import { XCircle, CheckCircle2, Zap, Clock, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#171523] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <Crosshair size={700} strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 font-mono text-[11px] mb-4 tracking-wider">
            <Zap size={13} className="text-violet-400" />
            <span>EFICIÊNCIA B2B</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Prospecção Manual vs. Inteligência AcheAqui
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Veja como a automação de inteligência de dados transforma o ritmo de trabalho da sua equipe de vendas.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Prospecção Tradicional (Antes) */}
          <div className="rounded-2xl bg-white/[0.02] border border-red-500/20 p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                    <XCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Prospecção Manual</h3>
                    <span className="text-xs text-red-400 font-mono">Processo Lento & Arcaico</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>15h+ por semana</strong> perdidas buscando contatos manualmente em listas públicas e redes sociais.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Dados desatualizados:</strong> telefones inexistentes e e-mails gerais que caem na caixa de spam.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Sem validação de CNPJ:</strong> risco de abordar empresas inativas ou sem capacidade financeira.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Planilhas desorganizadas:</strong> perda de leads e ausência de integração automatizada com CRM.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span>SLA Resposta: 45 min / lead</span>
              <span className="text-red-400">Ineficiente</span>
            </div>
          </div>

          {/* Card 2: Com AcheAqui (Depois) */}
          <div className="rounded-2xl bg-[#171523] border border-violet-400/40 p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_rgba(167,139,250,0.15)] glow-border-trace group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/40 text-violet-300 flex items-center justify-center">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Com AcheAqui IA</h3>
                    <span className="text-xs text-emerald-400 font-mono">100% Automatizado & Síncrono</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                  RECOMENDADO
                </span>
              </div>

              <ul className="space-y-4 text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Varredura em 14ms:</strong> milhares de empresas mapeadas em segundos com filtros geográficos exatos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Contatos verificados:</strong> telefones de decisão, WhatsApps ativos e e-mails institucionais diretos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dados oficiais RFB:</strong> validação completa de CNPJ, quadro de sócios, faturamento e porte.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Exportação em 1 clique:</strong> integração instantânea via Webhook, Google Sheets, HubSpot e Pipedrive.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>SLA Resposta: 14 ms</span>
              <a href="/auth" className="text-violet-300 font-semibold flex items-center gap-1 hover:underline">
                Experimentar grátis <ArrowRight size={13} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
