'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Image, Calendar, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 2500,
    suffix: '+',
    label: 'Активных пользователей',
    color: '#6366F1',
  },
  {
    icon: Image,
    value: 10000,
    suffix: '+',
    label: 'Созданных миниатюр',
    color: '#8B5CF6',
  },
  {
    icon: Calendar,
    value: 2,
    suffix: '+',
    label: 'Лет на рынке',
    color: '#F97316',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '',
    label: 'Средний рейтинг',
    color: '#F59E0B',
    isDecimal: true,
  },
];

export function StatsSection() {
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
              Инфографика
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              ThumbGen AI <span className="landing-gradient-text">в цифрах</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref: viewRef, isInView } = useInView();
  const { count, ref: countRef } = useCountUp(
    stat.isDecimal ? stat.value * 10 : stat.value,
    2000,
    true
  );
  const Icon = stat.icon;
  const staggerClass = `landing-stagger-${index + 1}`;

  const displayValue = stat.isDecimal
    ? (count / 10).toFixed(1)
    : count.toLocaleString('ru-RU');

  return (
    <div
      ref={viewRef}
      className={`landing-reveal ${staggerClass} ${isInView ? 'in-view' : ''}`}
    >
      <div
        className="text-center p-6 lg:p-8 rounded-2xl"
        style={{
          background: 'var(--landing-card)',
          border: '1px solid var(--landing-border)',
          boxShadow: 'var(--landing-shadow-sm)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}25` }}
        >
          <Icon className="w-7 h-7" style={{ color: stat.color }} />
        </div>

        <div
          ref={countRef}
          className="text-4xl sm:text-5xl font-extrabold mb-2"
          style={{ color: stat.color }}
        >
          {displayValue}{stat.suffix}
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: 'var(--landing-text-secondary)' }}
        >
          {stat.label}
        </p>
      </div>
    </div>
  );
}
