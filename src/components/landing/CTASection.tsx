'use client';

import { useInView } from '@/hooks/useInView';
import { ArrowRight, Shield, Sparkles, Zap, Star } from 'lucide-react';

interface CTASectionProps {
  onOpenSignup: () => void;
}

export function CTASection({ onOpenSignup }: CTASectionProps) {
  const { ref, isInView } = useInView();

  return (
    <section className="landing-section relative overflow-hidden" style={{ background: 'var(--landing-bg-alt)' }}>
      {/* Animated background objects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large red glow top-right */}
        <div
          className="landing-blob absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--landing-brand)' }}
        />
        {/* Amber glow bottom-left */}
        <div
          className="landing-blob-delay absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--landing-accent)' }}
        />
        {/* Red glow center */}
        <div
          className="landing-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: 'var(--landing-brand-light)' }}
        />

        {/* Floating decorative icons */}
        <div className="landing-float absolute top-16 left-[8%] opacity-10">
          <Sparkles className="w-12 h-12" style={{ color: 'var(--landing-brand)' }} />
        </div>
        <div className="landing-float absolute top-32 right-[12%] opacity-10" style={{ animationDelay: '1.5s' }}>
          <Zap className="w-10 h-10" style={{ color: 'var(--landing-accent)' }} />
        </div>
        <div className="landing-float absolute bottom-24 left-[20%] opacity-8" style={{ animationDelay: '3s' }}>
          <Star className="w-8 h-8" style={{ color: 'var(--landing-brand-light)' }} />
        </div>
        <div className="landing-float absolute bottom-16 right-[25%] opacity-8" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-10 h-10" style={{ color: 'var(--landing-brand)' }} />
        </div>

        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(var(--landing-brand) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Decorative border frames */}
        <div className="landing-spin-slow absolute top-20 right-[8%] w-20 h-20 rounded-2xl opacity-[0.06]"
          style={{ border: '2px solid var(--landing-brand)' }} />
        <div className="landing-spin-slow absolute bottom-20 left-[10%] w-16 h-16 rounded-full opacity-[0.06]"
          style={{ border: '2px solid var(--landing-accent)', animationDirection: 'reverse' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div
          ref={ref}
          className={`landing-reveal-scale ${isInView ? 'in-view' : ''}`}
        >
          <div
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
            style={{
              background: 'transparent',
              border: '1px solid var(--landing-border)',
              boxShadow: '0 0 80px rgba(220,38,38,0.06)',
            }}
          >
            {/* Inner glow line at top */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, var(--landing-brand), transparent)' }}
            />

            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: 'var(--landing-text)' }}
              >
                <span className="landing-gradient-text">Готовы начать?</span>
              </h2>
              <p
                className="text-lg sm:text-xl max-w-2xl mx-auto mb-8"
                style={{ color: 'var(--landing-text-secondary)' }}
              >
                Присоединяйтесь к 2,500+ создателям контента, которые уже используют ThumbGen AI для профессиональных миниатюр
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onOpenSignup}
                  className="landing-btn-primary text-lg"
                >
                  Создать аккаунт бесплатно
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-5 text-sm" style={{ color: 'var(--landing-text-muted)' }}>
                <Shield className="w-4 h-4" />
                Кредитная карта не требуется
              </div>
            </div>

            {/* Bottom glow line */}
            <div
              className="absolute bottom-0 left-1/4 right-1/4 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, var(--landing-brand), transparent)', opacity: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
