'use client';

import { useInView } from '@/hooks/useInView';
import { Upload, Wand2, Image, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Загрузите референс',
    description: 'Добавьте пример миниатюры или изображения, которое вам нравится, или начните с нуля.',
    color: '#DC2626',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'Опишите идею',
    description: 'Напишите, что хотите получить. Наш AI-бустер автоматически обогатит промпт.',
    color: '#EF4444',
  },
  {
    number: '03',
    icon: Image,
    title: 'AI генерирует',
    description: 'Выберите модель (или оставьте авто-выбор) и получите результат за несколько секунд.',
    color: '#F59E0B',
  },
  {
    number: '04',
    icon: Download,
    title: 'Скачайте и используйте',
    description: 'Сохраните в HD, улучшите разрешение или сгенерируйте новый вариант одним кликом.',
    color: '#DC2626',
  },
];

export function HowItWorksSection() {
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
              Как это работает
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              <span className="landing-gradient-text">4 простых шага</span> к&nbsp;идеальной миниатюре
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--landing-text-secondary)' }}
            >
              От идеи до готового изображения — меньше минуты
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Connector line between steps (desktop) */}
          <div className="hidden lg:block absolute top-4 left-[14%] right-[14%] pointer-events-none z-0">
            <div className="h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, var(--landing-brand) 20%, var(--landing-brand) 80%, transparent)', opacity: 0.15 }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, isInView } = useInView();
  const Icon = step.icon;
  const staggerClass = `landing-stagger-${index + 1}`;

  return (
    <div
      ref={ref}
      className={`landing-reveal ${staggerClass} ${isInView ? 'in-view' : ''} relative`}
    >
      <div className="relative z-10 text-center p-6">
        {/* Number + Icon */}
        <div className="relative mx-auto mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-6"
            style={{
              background: `${step.color}15`,
              border: `2px solid ${step.color}30`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: step.color }} />
          </div>
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
            style={{ background: step.color }}
          >
            {step.number}
          </div>
        </div>

        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--landing-text)' }}
        >
          {step.title}
        </h3>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--landing-text-secondary)' }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}
