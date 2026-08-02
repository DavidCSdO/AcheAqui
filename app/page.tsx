"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CityMarquee from "@/components/CityMarquee";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import PerspectiveDeckSection from "@/components/PerspectiveDeckSection";
import ServicesGridSection from "@/components/ServicesGridSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ComparisonSection from "@/components/ComparisonSection";
import HowItWorks from "@/components/HowItWorks";
import SmartSearchMockup from "@/components/SmartSearchMockup";
import AvailableDataGrid from "@/components/AvailableDataGrid";
import FiltersSection from "@/components/FiltersSection";
import DashboardPreview from "@/components/DashboardPreview";
import RoiCalculatorSection from "@/components/RoiCalculatorSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import UseCasesSection from "@/components/UseCasesSection";
import StatsBar from "@/components/StatsBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import CinematicLoader from "@/components/CinematicLoader";
import ThreeCinematicCanvas from "@/components/ThreeCinematicCanvas";
import CinematicScroll3D from "@/components/CinematicScroll3D";
import DynamicIslandBar from "@/components/DynamicIslandBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090812] text-slate-900 font-sans selection:bg-violet-600 selection:text-white relative">
      {/* 1. Dynamic Island Floating Bar */}
      <DynamicIslandBar />

      {/* 3. Tela de Carregamento Cinematográfica Holográfica */}
      <CinematicLoader />

      {/* 4. WebGL Three.js 3D Interactive Canvas Scene */}
      <ThreeCinematicCanvas />

      {/* 5. Cinematic Motion Wrapper */}
      <CinematicScroll3D>
        {/* Navbar Minimalista */}
        <Navbar />

        {/* 1. Hero com Céu em Tela Cheia */}
        <Hero />

        {/* 2. Marquee Infinito de Metrópoles & Validação de Dados */}
        <CityMarquee />

      {/* 3. Showcase dos Recursos Principais (Geolocalização, CNPJ & IA) */}
      <FeaturesShowcase />

      {/* 4. Cards em Perspectiva 3D (Ref. Instagram / Avatune) */}
      <PerspectiveDeckSection />

      {/* 5. Grid de Soluções & Serviços (Ref. Template Claura Framer) */}
      <ServicesGridSection />

      {/* 6. Case Studies de Impacto (Ref. Template Claura Framer CMS) */}
      <CaseStudiesSection />

      {/* 7. Seção Comparativa (Manual vs AcheAqui IA) */}
      <ComparisonSection />

      {/* 8. Como Funciona (4 Cards Conectados) */}
      <HowItWorks />

      {/* 9. Pesquisa Inteligente (Mockup Enorme da Aplicação) */}
      <SmartSearchMockup />

      {/* 10. Todos os Dados Disponíveis (Grid de Dados) */}
      <AvailableDataGrid />

      {/* 11. Filtros (Painel de Filtros e Preview de Resultados) */}
      <FiltersSection />

      {/* 12. Dashboard Preview com Abas Interativas (Estilo Linear App) */}
      <DashboardPreview />

      {/* 13. Calculadora Interativa de ROI & Economia de Tempo */}
      <RoiCalculatorSection />

      {/* 14. Integrações (Google Sheets, CRM, Webhooks, etc) */}
      <IntegrationsSection />

      {/* 15. Casos de Uso (Agências, Vendas, RH, Imobiliárias, etc) */}
      <UseCasesSection />

      {/* 16. Estatísticas com Contadores Animados */}
      <StatsBar />

      {/* 17. Depoimentos (Cards Enormes) */}
      <TestimonialsSection />

      {/* 18. FAQ (Accordion Minimalista) */}
      <FAQSection />

      {/* CTA Final */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
      </CinematicScroll3D>
    </main>
  );
}
