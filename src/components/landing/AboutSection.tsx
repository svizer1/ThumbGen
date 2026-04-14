'use client';

import { useInView } from '@/hooks/useInView';

export function AboutSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="landing-section">
      <div className="max-w-4xl mx-auto text-center">
        <div
          ref={ref}
          className={`landing-reveal ${isInView ? 'in-view' : ''}`}
        >
          <span
            className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
            style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}
          >
            О сервисе
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: 'var(--landing-text)' }}
          >
            Ваш AI-ассистент для
            <span className="landing-gradient-text"> визуального контента</span>
          </h2>
          <p
            className="text-lg sm:text-xl leading-relaxed mb-6"
            style={{ color: 'var(--landing-text-secondary)' }}
          >
            ThumbGen&nbsp;&mdash; это платформа, которая объединяет передовые генеративные модели
            (Google Imagen&nbsp;4, FLUX.1&nbsp;Dev, Stable Diffusion&nbsp;XL) в&nbsp;одном интерфейсе.
            Мы&nbsp;автоматизируем создание кликабельных миниатюр, карточек товаров и&nbsp;визуального контента,
            чтобы вы&nbsp;фокусировались на&nbsp;креативе, а&nbsp;не&nbsp;на&nbsp;ручном дизайне.
          </p>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--landing-text-secondary)' }}
          >
            Просто опишите идею словами или загрузите референсное изображение&nbsp;&mdash;
            наш AI-улучшатель промптов превратит короткое описание в&nbsp;оптимальный запрос,
            а&nbsp;модель сгенерирует результат за&nbsp;несколько секунд. 10&nbsp;бесплатных генераций
            при регистрации&nbsp;&mdash; попробуйте прямо сейчас.
          </p>
        </div>
      </div>
    </section>
  );
}
