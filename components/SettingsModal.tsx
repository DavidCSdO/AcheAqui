"use client";

import React, { useState, useEffect } from "react";
import { X, Save, MessageSquare, Briefcase } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [cvPitch, setCvPitch] = useState("Olá, admiro o trabalho da {empresa} e gostaria de enviar meu currículo!");
  const [salesPitch, setSalesPitch] = useState("Olá, sou especialista em soluções para {categoria} e tenho uma proposta para a {empresa}.");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedSettings = localStorage.getItem("crm_settings");
      if (savedSettings) {
        const { cv, sales } = JSON.parse(savedSettings);
        if (cv) setCvPitch(cv);
        if (sales) setSalesPitch(sales);
      }
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("crm_settings", JSON.stringify({ cv: cvPitch, sales: salesPitch }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Configurações de Pitch</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="space-y-2">
            <p className="text-sm text-white/50 mb-4">
              Defina as mensagens padrão que serão abertas no WhatsApp.
              Use <span className="text-[var(--color-secondary)] font-mono">{"{empresa}"}</span> ou <span className="text-[var(--color-secondary)] font-mono">{"{categoria}"}</span> para campos dinâmicos.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <Briefcase size={16} className="text-emerald-400" />
                Mensagem Padrão: Enviar Currículo
              </label>
              <textarea
                value={cvPitch}
                onChange={(e) => setCvPitch(e.target.value)}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors resize-none"
                placeholder="Ex: Olá, admiro a {empresa}..."
              />
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <MessageSquare size={16} className="text-blue-400" />
                Mensagem Padrão: Prospectar Vendas (B2B)
              </label>
              <textarea
                value={salesPitch}
                onChange={(e) => setSalesPitch(e.target.value)}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors resize-none"
                placeholder="Ex: Olá, sou especialista para {categoria}..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
            Fechar
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white transition-all text-sm font-bold shadow-lg shadow-[var(--color-secondary)]/20"
          >
            <Save size={16} />
            {isSaved ? "Salvo!" : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </div>
  );
}
