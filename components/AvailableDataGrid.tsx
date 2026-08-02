"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/useAnimations";
import Crosshair from "./Crosshair";
import {
  Phone, Mail, Globe, MessageSquare, MapPin, Building,
  Navigation, Star, MessageCircle, Clock, Compass, Map,
} from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";

const DATA_POINTS = [
  { label: "Telefone", desc: "Fixo e celular direto", icon: Phone },
  { label: "E-mail", desc: "Validado via SMTP", icon: Mail },
  { label: "Instagram", desc: "Conta oficial", icon: InstagramIcon },
  { label: "LinkedIn", desc: "Perfil corporativo", icon: LinkedinIcon },
  { label: "Website", desc: "URL completa", icon: Globe },
  { label: "WhatsApp", desc: "Link direto", icon: MessageSquare },
  { label: "CEP", desc: "Código postal", icon: MapPin },
  { label: "Cidade & Estado", desc: "Localização", icon: Navigation },
  { label: "Categoria", desc: "Segmento exato", icon: Building },
  { label: "Avaliação da Empresa", desc: "Nota 0–5.0", icon: Star },
  { label: "Avaliações", desc: "Volume de reviews", icon: MessageCircle },
  { label: "Horário", desc: "Funcionamento", icon: Clock },
  { label: "Latitude", desc: "GPS preciso", icon: Compass },
  { label: "Longitude", desc: "GPS preciso", icon: Map },
];

export default function AvailableDataGrid() {
  const containerRef = useStaggerReveal();

  return (
    <section className="section-padding bg-[var(--color-surface)] relative">
      <div className="container-wide px-6 lg:px-8" ref={containerRef}>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="section-tag mb-6 mx-auto w-fit">
            <Crosshair size={13} className="text-[var(--color-secondary)]" />
            Dados Disponíveis
          </div>
          <h2 className="text-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--color-text-primary)] mb-4">
            15+ pontos de dados por empresa
          </h2>
          <p className="text-body-lg">
            Enriquecimento completo em uma única busca — telefones, e-mails, redes e geolocalização.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DATA_POINTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`reveal reveal-delay-${Math.min(idx + 1, 8)} card group p-5 flex flex-col items-center text-center gap-3`}
              >
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-secondary)] transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
