'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Алексей Моргунов',
    role: 'YouTube-блогер',
    company: '1.2M подписчиков',
    text: 'ThumbGen полностью изменил мой процесс создания миниатюр. Раньше я тратил по 30-40 минут в Photoshop, а теперь генерирую кликабельные превью за 10 секунд. CTR вырос на 35%!',
    avatarSrc: 'https://picsum.photos/seed/alexei/80/80',
    rating: 5,
  },
  {
    name: 'Кристина Долинская',
    role: 'SELLER на WB',
    company: 'Топ-10 в категории',
    text: 'Для карточек Wildberries это просто мастхэв. Генерирую инфографику и стильные фоны для товаров. Конверсия в корзину увеличилась на 28%. За цену одного дизайна получаю сотни вариантов.',
    avatarSrc: 'https://picsum.photos/seed/kristina/80/80',
    rating: 5,
  },
  {
    name: 'Игорь Волков',
    role: 'SMM-менеджер',
    company: 'Digital агентство',
    text: 'У нас 15 клиентов, и каждому нужен визуальный контент. ThumbGen экономит команде 20+ часов в неделю. Пресеты и история — то, чего не хватало в других AI-инструментах.',
    avatarSrc: 'https://picsum.photos/seed/igor/80/80',
    rating: 5,
  },
  {
    name: 'Ольга Сидорова',
    role: 'TikTok-креатор',
    company: '800K подписчиков',
    text: 'Я использую ThumbGen для обложек видео и сторис. AI-бустер промптов — гениальная фича, даже короткое описание превращается в идеальный результат. Рекомендую всем!',
    avatarSrc: 'https://picsum.photos/seed/olga/80/80',
    rating: 4,
  },
  {
    name: 'Дмитрий Кузнецов',
    role: 'Фрилансер',
    company: 'Graphic Design',
    text: 'Как фрилансер, я постоянно ищу инструменты для ускорения работы. ThumbGen — лучший из тех, что я пробовал. Качество на уровне Midjourney, но проще в использовании.',
    avatarSrc: 'https://picsum.photos/seed/dmitry/80/80',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { ref: titleRef, isInView: titleInView } = useInView();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: 'smooth' });
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % testimonials.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [scrollToIndex]);

  return (
    <section id="testimonials" className="landing-section" style={{ background: 'var(--landing-bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            ref={titleRef}
            className={`landing-reveal ${titleInView ? 'in-view' : ''}`}
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}
            >
              Отзывы
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              Что говорят <span className="landing-gradient-text">наши пользователи</span>
            </h2>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} index={i} />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: i === activeIndex ? 'var(--landing-brand)' : 'var(--landing-border)',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const { ref, isInView } = useInView();
  const staggerClass = `landing-stagger-${Math.min(index + 1, 5)}`;

  return (
    <div
      ref={ref}
      className={`landing-reveal-scale ${staggerClass} ${isInView ? 'in-view' : ''} flex-shrink-0 w-[300px] sm:w-[350px] snap-start`}
    >
      <div className="landing-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              fill={i < testimonial.rating ? '#F59E0B' : 'transparent'}
              stroke={i < testimonial.rating ? '#F59E0B' : '#D1D5DB'}
            />
          ))}
        </div>

        <div className="relative mb-4">
          <Quote
            className="absolute -top-1 -left-1 w-6 h-6 opacity-10"
            style={{ color: 'var(--landing-brand)' }}
          />
          <p
            className="text-sm leading-relaxed pl-5"
            style={{ color: 'var(--landing-text-secondary)' }}
          >
            {testimonial.text}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--landing-border)' }}
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden shrink-0"
            style={{ border: '2px solid var(--landing-border)' }}
          >
            <img
              src={testimonial.avatarSrc}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--landing-text)' }}>
              {testimonial.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--landing-text-muted)' }}>
              {testimonial.role} · {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
