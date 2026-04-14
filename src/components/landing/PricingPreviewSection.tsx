'use client';

import { useInView } from '@/hooks/useInView';
import { Check, Zap, Sparkles, Crown, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: '$0',
    period: '',
    icon: Zap,
    color: '#6B7280',
    popular: false,
    features: [
      '10 генераций при регистрации',
      'Базовые AI-модели',
      'История 7 дней',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$5',
    period: '/мес',
    icon: Sparkles,
    color: '#3B82F6',
    popular: false,
    features: [
      '200 генераций в месяц',
      'Все модели (FLUX, Imagen, SDXL)',
      'Без watermark',
      'История 30 дней',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$15',
    period: '/мес',
    icon: Crown,
    color: '#6366F1',
    popular: true,
    features: [
      '600 генераций в месяц',
      'Все модели + ранний доступ',
      'Генератор V2 с 15 паками',
      'Prompt Enhancer X2',
      'Улучшение изображений',
      'Wildberries генератор',
      'API доступ',
    ],
  },
];

interface PricingPreviewSectionProps {
  onOpenSignup: () => void;
}

export function PricingPreviewSection({ onOpenSignup }: PricingPreviewSectionProps) {
  const { ref: titleRef, isInView: titleInView } = useInView();

  return (
    <section className="landing-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <div
            ref={titleRef}
            className={`landing-reveal ${titleInView ? 'in-view' : ''}`}
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}
            >
              Тарифы
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              Начните <span className="landing-gradient-text">бесплатно</span>, масштабируйтесь
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--landing-text-secondary)' }}
            >
              Выберите план, который подходит вашему потоку контента
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} onOpenSignup={onOpenSignup} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  index,
  onOpenSignup,
}: {
  plan: typeof plans[0];
  index: number;
  onOpenSignup: () => void;
}) {
  const { ref, isInView } = useInView();
  const Icon = plan.icon;
  const staggerClass = `landing-stagger-${index + 1}`;

  return (
    <div
      ref={ref}
      className={`landing-reveal ${staggerClass} ${isInView ? 'in-view' : ''}`}
    >
      <div
        className={`relative p-8 rounded-2xl h-full flex flex-col transition-all duration-300 ${
          plan.popular ? 'scale-[1.03]' : 'hover:-translate-y-2'
        }`}
        style={{
          background: 'var(--landing-card)',
          border: plan.popular
            ? `2px solid var(--landing-brand)`
            : `1px solid var(--landing-border)`,
          boxShadow: plan.popular
            ? '0 0 40px rgba(99,102,241,0.15), var(--landing-shadow-lg)'
            : 'var(--landing-shadow-sm)',
        }}
      >
        {plan.popular && (
          <>
            <div
              className="absolute top-0 inset-x-0 h-1 rounded-t-2xl"
              style={{ background: 'var(--landing-gradient-brand)' }}
            />
            <div
              className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
              style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}
            >
              Популярный
            </div>
          </>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}25` }}
          >
            <Icon className="w-6 h-6" style={{ color: plan.color }} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--landing-text)' }}>
            {plan.name}
          </h3>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold" style={{ color: 'var(--landing-text)' }}>
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-sm font-medium" style={{ color: 'var(--landing-text-muted)' }}>
                {plan.period}
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#10B981' }} />
              <span className="text-sm" style={{ color: 'var(--landing-text-secondary)' }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {plan.popular ? (
          <button onClick={onOpenSignup} className="landing-btn-primary w-full justify-center">
            Начать работу
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href="/pricing"
            className="landing-btn-secondary w-full justify-center"
          >
            Подробнее
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
