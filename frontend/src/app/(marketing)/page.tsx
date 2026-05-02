// src/app/(marketing)/page.tsx
// Server Component — no "use client" directive
// This file is purely an aggregator; all interactivity is pushed into child components.
import { MotionProvider } from "@/components/ui/motion";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProtocolSurfacesSection from "@/components/landing/ProtocolSurfacesSection";
import ScaleSection from "@/components/landing/ScaleSection";
import DecisionSection from "@/components/landing/DecisionSection";
import TokenomicsSection from "@/components/landing/TokenomicsSection";
import DecisionEasySection from "@/components/landing/DecisionEasySection";
import BentoStatsSection from "@/components/landing/BentoStatsSection";
import ProtocolResourcesSection from "@/components/landing/ProtocolResourcesSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "NEMESIS Protocol — Productive EV Infrastructure DePIN",
  description:
    "A DePIN protocol for productive EV infrastructure assets, verified by telemetry and financed through cashflow products on Solana.",
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-white font-[family-name:var(--font-plus-jakarta)] selection:bg-[#2DD4BF]/30 selection:text-white">
      <MotionProvider>
        {/* ── Unified Seamless Background: Hero → Scale Transition ── */}
        {/* Kept here (server-side) so it renders instantly without any JS */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-0 flex flex-col">
          <div className="w-full h-[78vh] bg-[linear-gradient(180deg,#F6FFF9_0%,#F1FFF9_52%,#E1FAF1_100%)]" />
          <div className="w-full h-[46vh] bg-gradient-to-b from-[#E1FAF1] via-[#F1FFF9] to-white" />
          <div className="w-full h-[24vh] bg-white" />
        </div>

        {/* ── Navigation ── Server Component */}
        <Navbar />

        {/* ── Hero ── Client Component (framer-motion animations + static visual) */}
        <HeroSection />

        {/* ── Product Route Discovery ── Server Component */}
        <ProtocolSurfacesSection />

        {/* ── Productive Infrastructure Scale ── Client Component (whileInView cards) */}
        <ScaleSection />

        {/* ── Feature Cards ── Server Component */}
        <DecisionSection />

        {/* ── Future Protocol Layer ── Client Component (floating image animation) */}
        <TokenomicsSection />

        {/* ── EV Financing Gap ── Server Component */}
        <DecisionEasySection />

        {/* ── Market Opportunity Bento Grid ── Server Component */}
        <BentoStatsSection />

        {/* ── Protocol Resources ── Server Component */}
        <ProtocolResourcesSection />

        {/* ── Final CTA ── Server Component */}
        <FinalCtaSection />

        {/* ── Footer ── Server Component */}
        <Footer />
      </MotionProvider>
    </main>
  );
}
