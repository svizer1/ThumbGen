'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Play, Sparkles, Zap, Wand2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenSignup: () => void;
}

function useTypewriter(text: string, speed: number = 55, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let started = false;
    const startTimer = setTimeout(() => {
      started = true;
      const interval = setInterval(() => {
        if (!started) return;
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export function HeroSection({ onOpenSignup }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fullText = 'Создавайте миниатюры за секунды с AI';
  const { displayed, done } = useTypewriter(fullText, 50, 400);

  const gradientPart = 'Создавайте миниатюры';
  const showGradient = displayed.length > 0;
  const gradientVisible = displayed.slice(0, gradientPart.length);
  const restVisible = displayed.length > gradientPart.length ? displayed.slice(gradientPart.length) : '';

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--landing-gradient-hero)' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="landing-blob absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--landing-brand-lighter)' }}
        />
        <div
          className="landing-blob-delay absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: '#991B1B' }}
        />
        <div
          className="landing-blob absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--landing-accent)', animationDelay: '4s' }}
        />

        {/* Geometric shapes */}
        <div className="landing-spin-slow absolute top-20 right-[15%] w-24 h-24 rounded-2xl opacity-10 border-2"
          style={{ borderColor: 'var(--landing-brand-light)', transform: 'rotate(45deg)' }} />
        <div className="landing-float-slow absolute bottom-32 left-[10%] w-16 h-16 rounded-full opacity-10"
          style={{ background: 'var(--landing-brand-light)' }} />
        <div className="landing-float absolute top-1/2 left-[20%] w-4 h-4 rounded-full opacity-20"
          style={{ background: 'var(--landing-accent)' }} />
        <div className="landing-float absolute top-1/3 right-[30%] w-3 h-3 rounded-full opacity-15"
          style={{ background: 'var(--landing-brand)', animationDelay: '1s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--landing-brand) 1px, transparent 1px), linear-gradient(90deg, var(--landing-brand) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text */}
          <div
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            {/* Badge */}
            <div className="hero-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                color: 'var(--landing-brand)',
                background: 'var(--landing-brand-subtle)',
                border: '1px solid var(--landing-border-hover)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-генератор миниатюр нового поколения</span>
            </div>

            {/* H1 - Typewriter effect */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="landing-gradient-text">
                {gradientVisible}
              </span>
              <span style={{ color: 'var(--landing-text)' }}>
                {restVisible}
              </span>
              <span
                className="inline-block w-[3px] ml-1 align-middle"
                style={{
                  background: 'var(--landing-brand)',
                  height: '0.85em',
                  animation: done ? 'none' : 'typewriter-blink 0.6s step-end infinite',
                  opacity: done ? 0 : 1,
                  transition: 'opacity 0.5s ease',
                }}
              />
            </h1>

            {/* Subtitle */}
            <p className="hero-fade-up text-lg sm:text-xl leading-relaxed max-w-xl mb-8"
              style={{ color: 'var(--landing-text-secondary)', animationDelay: '0.8s' }}
            >
              Загружайте референс, описывайте идею&nbsp;&mdash; и&nbsp;получайте профессиональные миниатюры
              для YouTube, Wildberries и&nbsp;соцсетей с&nbsp;помощью лучших AI-моделей.
            </p>

            {/* CTA Buttons */}
            <div className="hero-fade-up flex flex-col sm:flex-row gap-4 mb-10"
              style={{ animationDelay: '1s' }}
            >
              <button onClick={onOpenSignup} className="landing-btn-primary text-lg">
                Начать работу бесплатно
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="landing-btn-secondary text-lg"
              >
                <Play className="w-5 h-5" />
                Посмотреть примеры
              </a>
            </div>

            {/* Social proof mini */}
            <div className="hero-fade-up flex items-center gap-4 flex-wrap"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="flex -space-x-2">
                {[
                  'https://picsum.photos/seed/user1/64/64',
                  'https://picsum.photos/seed/user2/64/64',
                  'https://picsum.photos/seed/user3/64/64',
                  'https://picsum.photos/seed/user4/64/64',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Пользователь ${i + 1}`}
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ border: '2px solid var(--landing-bg)' }}
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="text-sm" style={{ color: 'var(--landing-text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--landing-text)' }}>2,500+</span> создателей уже с&nbsp;нами
              </div>
            </div>
          </div>

          {/* Right column - Mockup */}
          <div
            className="relative"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <div className="landing-float-slow relative">
              {/* Main card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border"
                style={{
                  background: 'var(--landing-card)',
                  borderColor: 'var(--landing-border)',
                  boxShadow: 'var(--landing-shadow-xl)',
                }}
              >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{ borderColor: 'var(--landing-border)' }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs ml-2" style={{ color: 'var(--landing-text-muted)' }}>
                    ThumbGen AI Generator
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Input mock */}
                  <div className="mb-4 p-3 rounded-xl"
                    style={{ background: 'var(--landing-bg-alt)', border: '1px solid var(--landing-border)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className="w-4 h-4" style={{ color: 'var(--landing-brand)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--landing-text-secondary)' }}>
                        Опишите идею миниатюры
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: 'var(--landing-text-muted)' }}>
                      Взрыв эмоций на лице, яркие цвета, 3D текст &laquo;ШОК&raquo;...
                    </div>
                  </div>

                  {/* Generated image preview */}
                  <div className="relative rounded-xl overflow-hidden aspect-video mb-4"
                    style={{ border: '1px solid var(--landing-border)' }}
                  >
                    <img
                      src="/examples/1.png"
                      alt="AI-сгенерированная миниатюра"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'rgba(220,38,38,0.9)', backdropFilter: 'blur(4px)' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Generated
                    </div>
                  </div>

                  {/* Action buttons mock */}
                  <div className="flex gap-2">
                    <div className="flex-1 py-2.5 rounded-lg text-center text-sm font-medium text-white"
                      style={{ background: 'var(--landing-gradient-cta)' }}>
                      <Zap className="w-4 h-4 inline mr-1" />
                      Скачать HD
                    </div>
                    <div className="py-2.5 px-4 rounded-lg text-sm font-medium"
                      style={{ background: 'var(--landing-bg-alt)', color: 'var(--landing-text-secondary)', border: '1px solid var(--landing-border)' }}>
                      Ещё вариант
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge left */}
              <div className="absolute -left-4 top-1/4 p-3 rounded-xl shadow-lg landing-float"
                style={{
                  background: 'var(--landing-card)',
                  border: '1px solid var(--landing-border)',
                  boxShadow: 'var(--landing-shadow-lg)',
                  animationDelay: '1s',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--landing-brand-subtle)' }}>
                    <Zap className="w-4 h-4" style={{ color: 'var(--landing-brand)' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--landing-text)' }}>~5 сек</div>
                    <div className="text-[10px]" style={{ color: 'var(--landing-text-muted)' }}>генерация</div>
                  </div>
                </div>
              </div>

              {/* Floating badge right */}
              <div className="absolute -right-4 bottom-1/4 p-3 rounded-xl shadow-lg landing-float"
                style={{
                  background: 'var(--landing-card)',
                  border: '1px solid var(--landing-border)',
                  boxShadow: 'var(--landing-shadow-lg)',
                  animationDelay: '2s',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.2))' }}>
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--landing-accent)' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--landing-text)' }}>FLUX + Imagen</div>
                    <div className="text-[10px]" style={{ color: 'var(--landing-text-muted)' }}>AI модели</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 72C96 64 192 48 288 40C384 32 480 32 576 36C672 40 768 48 864 52C960 56 1056 56 1152 48C1248 40 1344 24 1392 16L1440 8V80H0Z" fill="var(--landing-bg)" />
        </svg>
      </div>
    </section>
  );
}
