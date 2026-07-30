"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { FileSpreadsheet, Database, Cpu, Zap, Code, Send, Share2, Layers } from "lucide-react";

const INTEGRATIONS = [
  { name: "Google Sheets", type: "Planilhas", icon: FileSpreadsheet },
  { name: "Microsoft Excel", type: "Exportação", icon: FileSpreadsheet },
  { name: "HubSpot CRM", type: "CRM", icon: Database },
  { name: "Pipedrive", type: "Vendas", icon: Layers },
  { name: "Zapier", type: "Automação", icon: Zap },
  { name: "n8n", type: "Open Source", icon: Cpu },
  { name: "Make", type: "No-Code", icon: Share2 },
  { name: "API REST", type: "Developers", icon: Code },
  { name: "Webhooks", type: "Tempo Real", icon: Send },
];

export default function IntegrationsSection() {
  const containerRef = useStaggerReveal();

  return (
    <section id="api" className="section-padding bg-[var(--color-surface)] relative">
      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Integrações
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Conecte com seu stack atual
          </h2>
          <p className="text-body-lg">
            Envie leads enriquecidos diretamente para seu CRM, planilhas ou ferramentas de automação.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {INTEGRATIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className={`reveal reveal-delay-${Math.min(idx + 1, 8)} card p-6 flex items-center gap-5`}>
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] shrink-0">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
                  <span className="text-[0.6875rem] text-[var(--color-text-muted)] font-mono uppercase tracking-[0.06em]">{item.type}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
