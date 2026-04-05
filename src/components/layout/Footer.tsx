'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              ThumbGen AI
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Создавайте профессиональные миниатюры для YouTube с помощью искусственного интеллекта
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 hover:scale-110"
              >
                <Github className="w-5 h-5" />
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

          {/* Product */}
          <div className="animate-fadeIn stagger-1">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Продукт
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Генератор
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Тарифы
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  История
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Профиль
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="animate-fadeIn stagger-2">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Компания
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Блог
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Карьера
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="animate-fadeIn stagger-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Правовая информация
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Условия использования
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Политика Cookie
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Возврат средств
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-muted)] text-center md:text-left">
            © {currentYear} ThumbGen AI. Все права защищены.
          </p>
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-1">
            Сделано с <Heart className="w-4 h-4 text-red-400 animate-pulse" /> для создателей контента
          </p>
        </div>
      </div>
    </footer>
  );
}
