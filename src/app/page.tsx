"use client";

import { PageTracker } from "@/components/Analytics";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import YieldComparison from "@/components/landing/YieldComparison";
import EarningsCalculator from "@/components/landing/EarningsCalculator";
import TrustSection from "@/components/landing/TrustSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <>
      <PageTracker page="/" />
      <LandingNav />
      <main className="max-w-6xl mx-auto px-6">
        <HeroSection />
        <HowItWorks />
        <YieldComparison />
        <EarningsCalculator />
        <TrustSection />
        <LandingFooter />
      </main>
    </>
  );
}
