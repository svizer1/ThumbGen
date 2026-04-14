'use client';

import { useInView } from '@/hooks/useInView';
import {
  Zap,
  Sparkles,
  Wand2,
  Shield,
  Clock,
  Layers,
  BarChart3,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Мгновенная генерация',
    description: 'Результат за 5-15 секунд. Несколько AI-моделей работают параллельно для максимальной скорости.',
    color: '#6366F1',
  },
  {
    icon: Sparkles,
    title: 'Лучшие AI-модели',
    description: 'Google Imagen 4, FLUX.1 Dev, SDXL — выбирайте модель под задачу или используйте авто-выбор.',
    color: '#8B5CF6',
  },
  {
    icon: Wand2,
    title: 'Умный промпт-бустер',
    description: 'AI автоматически обогащает ваш промпт, добавляя стиль, освещение и композицию для идеального результата.',
    color: '#F97316',
  },
  {
    icon: Layers,
    title: 'Готовые паки примеров',
    description: '15+ тематических паков с примерами промптов для YouTube, Wildberries, блогов и соцсетей.',
    color: '#10B981',
  },
  {
    icon: Shield,
    title: 'Безопасность и приватность',
    description: 'Данные защищены, изображения не попадают в открытый доступ. Кредиты и баланс под вашим контролем.',
    color: '#3B82F6',
  },
  {
    icon: Clock,
    title: 'История и пресеты',
    description: 'Все генерации сохраняются. Создавайте пресеты для повторяющихся задач и экономьте время.',
    color: '#EC4899',
  },
  {
    icon: BarChart3,
    title: 'Улучшение изображений',
    description: 'AI-апскейлер повышает разрешение, убирает артефакты и улучшает детализацию любых изображений.',
    color: '#14B8A6',
  },
  {
    icon: Globe,
    title: 'Wildberries карточки',
    description: 'Специализированный генератор для карточек товаров WB с инфографикой и соответственным форматом.',
    color: '#F59E0B',
  },
];

export function FeaturesSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="features" className="landing-section" style={{ background: 'var(--landing-bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <div
            ref={ref}
            className={`landing-reveal ${isInView ? 'in-view' : ''}`}
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}
            >
              Преимущества
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              Почему выбирают <span className="landing-gradient-text">ThumbGen</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--landing-text-secondary)' }}
            >
              Всё, что нужно для создания визуального контента профессионального уровня
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FeatureCard key={i} feature={feature} index={i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, isInView } = useInView();
  const Icon = feature.icon;
  const staggerClass = `landing-stagger-${Math.min(index + 1, 8)}`;

  return (
    <div
      ref={ref}
      className={`landing-reveal ${staggerClass} ${isInView ? 'in-view' : ''}`}
    >
      <div className="landing-card p-6 h-full group cursor-default">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${feature.color}12`,
            border: `1px solid ${feature.color}25`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: feature.color }} />
        </div>

        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--landing-text)' }}
        >
          {feature.title}
        </h3>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--landing-text-secondary)' }}
        >
          {feature.description}
        </p>

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-[var(--landing-radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}08, transparent 60%)`,
          }}
        />
      </div>
    </div>
  );
}
