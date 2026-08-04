"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
// import CityMarquee from "@/components/CityMarquee";
import FeaturesShowcase from "@/components/FeaturesShowcase"; // Will become ValueProps
// import PerspectiveDeckSection from "@/components/PerspectiveDeckSection";
import ServicesGridSection from "@/components/ServicesGridSection"; // Will become Platform Capabilities
// import CaseStudiesSection from "@/components/CaseStudiesSection";
// import ComparisonSection from "@/components/ComparisonSection";
import HowItWorks from "@/components/HowItWorks"; // Will become Process/Integration
// import SmartSearchMockup from "@/components/SmartSearchMockup";
// import AvailableDataGrid from "@/components/AvailableDataGrid";
// import FiltersSection from "@/components/FiltersSection";
import DashboardPreview from "@/components/DashboardPreview"; // Interface Previews
// import RoiCalculatorSection from "@/components/RoiCalculatorSection";
// import IntegrationsSection from "@/components/IntegrationsSection";
// import UseCasesSection from "@/components/UseCasesSection";
import StatsBar from "@/components/StatsBar"; // Platform Stats
import TestimonialsSection from "@/components/TestimonialsSection"; // Client Stories
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import CinematicLoader from "@/components/CinematicLoader";
import ThreeCinematicCanvas from "@/components/ThreeCinematicCanvas";
import CinematicScroll3D from "@/components/CinematicScroll3D";
import DynamicIslandBar from "@/components/DynamicIslandBar";
import TheDataPromise from "@/components/TheDataPromise";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090812] text-slate-900 font-sans selection:bg-violet-600 selection:text-white relative">
      <DynamicIslandBar />
      <CinematicLoader />
      <ThreeCinematicCanvas />

      <CinematicScroll3D>
        <Navbar />

        {/* 01 / HERO */}
        <Hero />

        {/* 02 / VALUE PROPS */}
        <FeaturesShowcase />

        {/* 03 / CAPABILITIES */}
        <ServicesGridSection />

        {/* 04 / THE DATA PROMISE */}
        <TheDataPromise />

        {/* 05 / INTERFACE PREVIEWS */}
        <DashboardPreview />

        {/* 06 / CLIENT STORIES */}
        <TestimonialsSection />

        {/* 07 / PLATFORM STATS */}
        <StatsBar />

        {/* 08 / INTEGRATION PROCESS */}
        <HowItWorks />

        {/* 09 / FAQ */}
        <FAQSection />

        {/* 10 / CTA */}
        <FinalCTA />

        <Footer />
      </CinematicScroll3D>
    </main>
  );
}
