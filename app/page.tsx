"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveFeed from "@/components/LiveFeed";
import HowItWorks from "@/components/HowItWorks";
import SmartSearchMockup from "@/components/SmartSearchMockup";
import AvailableDataGrid from "@/components/AvailableDataGrid";
import FiltersSection from "@/components/FiltersSection";
import DashboardPreview from "@/components/DashboardPreview";
import IntegrationsSection from "@/components/IntegrationsSection";
import UseCasesSection from "@/components/UseCasesSection";
import StatsBar from "@/components/StatsBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar Minimalista */}
      <Navbar />

      {/* 1. Hero (Layout 60/40, Perplexity Search, Live Demo, Crosshair Watermark) */}
      <Hero />

      {/* 2. Empresas Encontradas em Tempo Real (Live Feed) */}
      <LiveFeed />

      {/* 3. Como Funciona (4 Cards Conectados) */}
      <HowItWorks />

      {/* 4. Pesquisa Inteligente (Mockup Enorme da Aplicação) */}
      <SmartSearchMockup />

      {/* 5. Todos os Dados Disponíveis (Grid de Dados) */}
      <AvailableDataGrid />

      {/* 6. Filtros (Painel de Filtros e Preview de Resultados) */}
      <FiltersSection />

      {/* 7. Dashboard Preview (Estilo Linear App) */}
      <DashboardPreview />

      {/* 8. Integrações (Google Sheets, CRM, Webhooks, etc) */}
      <IntegrationsSection />

      {/* 9. Casos de Uso (Agências, Vendas, RH, Imobiliárias, etc) */}
      <UseCasesSection />

      {/* 10. Estatísticas (Em uma única linha) */}
      <StatsBar />

      {/* 11. Depoimentos (Cards Enormes) */}
      <TestimonialsSection />

      {/* 12. FAQ (Accordion Minimalista) */}
      <FAQSection />

      {/* CTA Final (Fundo Azul Petróleo & Título Branco) */}
      <FinalCTA />

      {/* Footer (Estilo Stripe) */}
      <Footer />
    </main>
  );
}
