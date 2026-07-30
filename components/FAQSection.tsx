"use client";

import React, { useState } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "Como o AcheAqui obtém as informações?", a: "Realizamos varredura em tempo real em bases públicas oficiais, Google Maps e registros corporativos abertos, validando e-mails via SMTP e telefones via teste de linha." },
  { q: "O uso está em conformidade com a LGPD?", a: "100%. Processamos apenas dados públicos de pessoas jurídicas (PJ) e contatos comerciais, respeitando integralmente as diretrizes da LGPD para prospecção B2B." },
  { q: "Posso exportar para Excel ou Google Sheets?", a: "Sim. Baixe nos formatos CSV e XLSX, ou configure exportação automática para Google Sheets, HubSpot, Pipedrive e Zapier." },
  { q: "Existe integração com WhatsApp?", a: "Sim. Cada empresa com WhatsApp cadastrado tem um botão direto que abre a conversa no WhatsApp Web ou App." },
  { q: "Como funciona a API?", a: "Nossa API REST permite requisições HTTP/JSON com termos de busca e filtros, retornando dados estruturados em milissegundos." },
  { q: "Posso testar gratuitamente?", a: "Oferecemos teste gratuito com créditos de busca, sem necessidade de cartão de crédito." },
];

export default function FAQSection() {
  const ref = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-white relative">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-16 reveal" ref={ref}>
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            FAQ
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            Perguntas frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 text-[0.9375rem] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-secondary)] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--color-secondary)]" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-[0.875rem] text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-subtle)] pt-4 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
