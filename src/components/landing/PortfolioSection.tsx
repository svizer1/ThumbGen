'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const examples = [
  {
    src: '/examples/gen1.png',
    title: 'GEN: YouTube миниатюра',
    category: 'YouTube',
    model: 'FLUX.1 Dev',
  },
  {
    src: '/examples/gen2.png',
    title: 'GEN: Игровой обзор',
    category: 'YouTube',
    model: 'Imagen 4',
  },
  {
    src: '/examples/playerok_Claud.png',
    title: 'Playerok: Claude подписка',
    category: 'Playerok',
    model: 'Playerok Pro',
  },
  {
    src: '/examples/playerok_Fortnite.png',
    title: 'Playerok: Fortnite оффер',
    category: 'Playerok',
    model: 'Playerok Pro',
  },
  {
    src: '/examples/wb_protein.png',
    title: 'WB карточка: Protein',
    category: 'Wildberries',
    model: 'Imagen 4',
  },
  {
    src: '/examples/wb_protein2.png',
    title: 'WB карточка: Protein (вариант 2)',
    category: 'Wildberries',
    model: 'WB Pro',
  },
];

export function PortfolioSection() {
  const { ref: titleRef, isInView: titleInView } = useInView();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="landing-section" style={{ background: 'var(--landing-bg-alt)' }}>
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
              Портфолио
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--landing-text)' }}
            >
              Примеры <span className="landing-gradient-text">AI-генераций</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--landing-text-secondary)' }}
            >
              Посмотрите, что создают наши пользователи
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'var(--landing-card)', border: '1px solid var(--landing-border)', color: 'var(--landing-text)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'var(--landing-card)', border: '1px solid var(--landing-border)', color: 'var(--landing-text)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1 -mx-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {examples.map((example, i) => (
              <PortfolioCard key={i} example={example} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="/pricing"
            className="landing-btn-secondary"
          >
            Смотреть все примеры
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({ example, index }: { example: typeof examples[0]; index: number }) {
  const { ref, isInView } = useInView();
  const staggerClass = `landing-stagger-${Math.min(index + 1, 5)}`;

  return (
    <div
      ref={ref}
      className={`landing-reveal-scale ${staggerClass} ${isInView ? 'in-view' : ''} flex-shrink-0 w-[300px] sm:w-[340px] snap-start`}
    >
      <div className="landing-card overflow-hidden group cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={example.src}
            alt={example.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(to top, rgba(99,102,241,0.8), transparent 60%)' }}
          />
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs font-medium px-2 py-1 rounded-md"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              {example.model}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)' }}
            >
              {example.category}
            </span>
          </div>
          <h4
            className="text-sm font-semibold"
            style={{ color: 'var(--landing-text)' }}
          >
            {example.title}
          </h4>
        </div>
      </div>
    </div>
  );
}
