"use client";

import React from "react";
import { Building2, Briefcase, Wrench } from "lucide-react";

export type VerticalType = "empresas" | "vagas" | "servicos";

interface HubSelectorProps {
  activeVertical: VerticalType;
  onSelectVertical: (vertical: VerticalType) => void;
  className?: string;
}

export default function HubSelector({ activeVertical, onSelectVertical, className = "" }: HubSelectorProps) {
  const hubs = [
    {
      id: "empresas" as VerticalType,
      label: "Empresas & B2B",
      badge: "Captação B2B",
      icon: Building2,
      activeColor: "from-sky-500/30 to-blue-600/40 border-sky-400 text-sky-300 shadow-sky-500/25",
      hoverColor: "hover:border-sky-500/40 hover:bg-sky-500/10",
      description: "Leads comerciais, prospecção e dados cadastrais"
    },
    {
      id: "vagas" as VerticalType,
      label: "Vagas & Carreiras",
      badge: "Vagas Abertas",
      icon: Briefcase,
      activeColor: "from-emerald-500/30 to-teal-600/40 border-emerald-400 text-emerald-300 shadow-emerald-500/25",
      hoverColor: "hover:border-emerald-500/40 hover:bg-emerald-500/10",
      description: "Oportunidades de trabalho e contato direto com RH"
    },
    {
      id: "servicos" as VerticalType,
      label: "Prestadores & Serviços",
      badge: "Autônomos",
      icon: Wrench,
      activeColor: "from-amber-500/30 to-yellow-600/40 border-amber-400 text-amber-300 shadow-amber-500/25",
      hoverColor: "hover:border-amber-500/40 hover:bg-amber-500/10",
      description: "Especialistas, técnicos e freelancers verificados"
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 glass-panel rounded-2xl border border-white/10 ${className}`}>
      {hubs.map((hub) => {
        const Icon = hub.icon;
        const isActive = activeVertical === hub.id;

        return (
          <button
            key={hub.id}
            type="button"
            onClick={() => onSelectVertical(hub.id)}
            className={`group relative flex flex-col items-start p-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer ${
              isActive
                ? `bg-gradient-to-r ${hub.activeColor} border shadow-lg backdrop-blur-md scale-[1.02]`
                : `border border-transparent text-slate-400 ${hub.hoverColor} hover:text-white hover:scale-[1.01]`
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "" : "opacity-70"}`} />
                <span className="font-semibold text-xs sm:text-sm tracking-wide">{hub.label}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isActive ? "bg-white/15 border-white/20 text-white" : "bg-slate-800/80 border-slate-700 text-slate-400"
              }`}>
                {hub.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
              {hub.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
