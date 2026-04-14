'use client';

import Link from 'next/link';
import { Twitter, Mail, Heart, Send, Sparkles, Cpu, Zap } from 'lucide-react';

const aiModels = [
  { name: 'Google Imagen 4', badge: 'Top', badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  { name: 'FLUX.1 Dev', badge: 'Fast', badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
  { name: 'Stable Diffusion XL', badge: 'Classic', badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2 animate-fadeIn">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="ThumbGen" className="w-9 h-9 rounded-xl shadow-lg object-cover" />
              <span className="font-bold text-lg text-[var(--text-primary)]">
                Thumb<span className="text-[var(--accent)]">Gen</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-xs leading-relaxed">
              Создавайте профессиональные миниатюры для YouTube с помощью искусственного интеллекта
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/ThumbGenAI_BOT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@thumbgen.ai"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="animate-fadeIn stagger-1">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Продукт
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  Генератор
                </Link>
              </li>
              <li>
                <Link href="/enhance" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  Улучшение
                </Link>
              </li>
              <li>
                <Link href="/wildberries" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  WB Карточки
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  История
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fadeIn stagger-2">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Ресурсы
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  Документация
                </Link>
              </li>
              <li>
                <a href="mailto:support@thumbgen.ai" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200">
                  Поддержка
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/ThumbGenAI_BOT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram Bot
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fadeIn stagger-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--accent)]" />
              AI Модели
            </h4>
            <ul className="space-y-3">
              {aiModels.map((model) => (
                <li key={model.name} className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">{model.name}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${model.badgeColor}`}>
                    {model.badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-muted)] text-center md:text-left">
            &copy; {currentYear} ThumbGen AI. Все права защищены.
          </p>
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-1.5">
            Сделано с <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" /> для создателей контента
          </p>
        </div>
      </div>
    </footer>
  );
}
