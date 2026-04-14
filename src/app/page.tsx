'use client';

import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PortfolioSection } from '@/components/landing/PortfolioSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingPreviewSection } from '@/components/landing/PricingPreviewSection';
import { CTASection } from '@/components/landing/CTASection';
import { openSignupModal } from '@/lib/landing-events';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <>
        <HeroSection onOpenSignup={openSignupModal} />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PortfolioSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingPreviewSection onOpenSignup={openSignupModal} />
        <CTASection onOpenSignup={openSignupModal} />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="animate-fadeInUp">
        <GeneratorForm />
      </div>
    </div>
  );
}
