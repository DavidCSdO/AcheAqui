"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Crosshair, PlusSquare, Trash2, Smartphone, Mail, Briefcase, MessageSquare, Flame } from "lucide-react";
import { calculateLeadScore } from "@/utils/scoring";

const COLUMNS = [
  { id: "novo", title: "Novos Leads", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "contato", title: "Em Contato", color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  { id: "reuniao", title: "Reunião/Entrevista", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  { id: "concluido", title: "Concluído", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { id: "recusado", title: "Recusado", color: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
];

function CRMBoard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  
  const [cvPitchTemplate, setCvPitchTemplate] = useState("Olá, admiro o trabalho da {empresa} e gostaria de enviar meu currículo!");
  const [salesPitchTemplate, setSalesPitchTemplate] = useState("Olá, sou especialista em soluções para {categoria} e tenho uma proposta para a {empresa}.");

  useEffect(() => {
    const saved = localStorage.getItem("crm_leads");
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse CRM leads");
      }
    }
    
    const savedSettings = localStorage.getItem("crm_settings");
    if (savedSettings) {
      try {
        const { cv, sales } = JSON.parse(savedSettings);
        if (cv) setCvPitchTemplate(cv);
        if (sales) setSalesPitchTemplate(sales);
      } catch (e) {
        console.error("Failed to parse crm_settings");
      }
    }
  }, []);

  const saveLeads = (newLeads: any[]) => {
    setLeads(newLeads);
    localStorage.setItem("crm_leads", JSON.stringify(newLeads));
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este lead do CRM?")) {
      saveLeads(leads.filter(l => l.id !== id));
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const newLeads = leads.map(lead => {
      if (lead.id === draggedLeadId) {
        return { ...lead, status: columnId };
      }
      return lead;
    });

    saveLeads(newLeads);
    setDraggedLeadId(null);
  };

  return (
    <div className="flex-1 container-wide px-6 py-24 mt-16 relative flex flex-col h-screen">
      <div className="absolute left-[-10%] top-[-10%] text-[var(--color-secondary)] opacity-[0.03] pointer-events-none">
        <Crosshair size={800} strokeWidth={0.5} className="animate-slow-spin" />
      </div>

      <div className="relative z-10 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[2.5rem] font-bold tracking-tight mb-2">
            Meu <span className="text-[var(--color-secondary)]">CRM</span>
          </h1>
          <p className="text-white/50">Gerencie seus contatos, entrevistas e prospecções em um só lugar.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{leads.length}</p>
          <p className="text-[0.75rem] text-white/40 uppercase tracking-wider">Leads Totais</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 flex-1 snap-x">
        {COLUMNS.map((column) => {
          const columnLeads = leads.filter(l => (l.status || "novo") === column.id);
          
          return (
            <div 
              key={column.id}
              className="flex-shrink-0 w-[320px] bg-[#1C1C1E]/50 border border-white/5 rounded-2xl flex flex-col snap-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`p-4 border-b border-white/5 flex justify-between items-center ${column.color.split(' ')[0]} bg-opacity-5 rounded-t-2xl`}>
                <h3 className={`font-bold ${column.color.split(' ')[2]}`}>{column.title}</h3>
                <span className="bg-black/20 text-white/60 text-xs px-2 py-1 rounded-md font-mono">{columnLeads.length}</span>
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[200px]">
                {columnLeads.map((lead) => {
                  const score = calculateLeadScore(lead);
                  
                  const cvMessage = cvPitchTemplate
                    .replace(/{empresa}/g, lead.name || "empresa")
                    .replace(/{categoria}/g, lead.category || "seu nicho");
                    
                  const salesMessage = salesPitchTemplate
                    .replace(/{empresa}/g, lead.name || "empresa")
                    .replace(/{categoria}/g, lead.category || "seu nicho");
                    
                  return (
                    <div 
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-[#2C2C2E] border border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-white/30 transition-all shadow-lg group relative"
                    >
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="absolute top-3 right-3 text-white/20 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="mb-2 pr-6">
                        <h4 className="font-bold text-[0.9375rem] text-white leading-tight line-clamp-1">{lead.name}</h4>
                        <p className="text-[0.75rem] text-white/40 truncate">{lead.category || "Empresa"}</p>
                      </div>

                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${score.color} bg-opacity-10 mb-3`}>
                        <Flame size={10} className={score.color.split(' ')[0]} />
                        <span className="text-[0.625rem] font-bold uppercase tracking-wider">{score.label} ({score.score})</span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        {lead.cellphone && (
                          <div className="flex items-center gap-2 text-[0.75rem] text-white/70">
                            <Smartphone size={12} className="text-emerald-400" /> {lead.cellphone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-2 text-[0.75rem] text-white/70">
                            <Mail size={12} className="text-amber-400" /> <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                      </div>

                      {lead.cellphone && (
                        <div className="flex gap-2 pt-3 border-t border-white/5">
                          <a 
                            href={`https://wa.me/55${lead.cellphone.replace(/\D/g, '')}?text=${encodeURIComponent(cvMessage)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[0.6875rem] font-bold transition-all"
                          >
                            <Briefcase size={12} /> Currículo
                          </a>
                          <a 
                            href={`https://wa.me/55${lead.cellphone.replace(/\D/g, '')}?text=${encodeURIComponent(salesMessage)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center gap-1.5 p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[0.6875rem] font-bold transition-all"
                          >
                            <MessageSquare size={12} /> Prospectar
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CRMPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)] selection:text-white flex flex-col overflow-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Crosshair size={48} className="animate-spin text-white/20" /></div>}>
        <CRMBoard />
      </Suspense>
    </main>
  );
}
