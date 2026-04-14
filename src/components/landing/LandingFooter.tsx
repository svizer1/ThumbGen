'use client';

import { useState } from 'react';
import { Layers, Twitter, Mail, Send, Heart } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Генератор', href: '/' },
    { label: 'Улучшение', href: '/enhance' },
    { label: 'WB Карточки', href: '/wildberries' },
    { label: 'Тарифы', href: '/pricing' },
  ],
  resources: [
    { label: 'Документация', href: '/docs' },
    { label: 'API', href: '/docs' },
    { label: 'Changelog', href: '#' },
  ],
  support: [
    { label: 'FAQ', href: '/pricing' },
    { label: 'Контакты', href: 'mailto:support@thumbgen.ai' },
    { label: 'Telegram Bot', href: 'https://t.me/ThumbGenAI_BOT' },
  ],
};

export function LandingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="contacts" style={{ background: 'var(--landing-bg)', borderTop: '1px solid var(--landing-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand + Subscribe */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 relative overflow-hidden">
            {/* Decorative animated heart - large, in top-left corner */}
            <div className="absolute -top-6 -left-4 z-10 pointer-events-none">
              <div className="relative">
                <Heart
                  className="w-24 h-24"
                  style={{
                    color: 'var(--landing-brand)',
                    opacity: 0.12,
                    animation: 'landing-heart-beat 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute inset-0 w-24 h-24 rounded-full"
                  style={{
                    background: 'var(--landing-brand)',
                    opacity: 0.06,
                    filter: 'blur(20px)',
                    animation: 'landing-heart-beat 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
            <a href="#" className="flex items-center gap-2.5 mb-4 relative z-20">
              <img
                src="/logo-red.png"
                alt="ThumbGen"
                className="w-9 h-9 rounded-xl shadow-lg object-cover"
              />
              <span className="font-bold text-lg" style={{ color: 'var(--landing-text)' }}>
                Thumb<span style={{ color: 'var(--landing-brand)' }}>Gen</span>
              </span>
            </a>
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--landing-text-secondary)' }}>
              AI-платформа для генерации профессиональных миниатюр, карточек товаров и визуального контента.
            </p>

            {/* Email subscribe */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--landing-text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email для новостей"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: 'var(--landing-bg-alt)',
                    border: '1px solid var(--landing-border)',
                    color: 'var(--landing-text)',
                  }}
                  onFocus={(e) => e.currentTarget.style.setProperty('--tw-ring-color', 'var(--landing-brand)')}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: 'var(--landing-gradient-cta)' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs mt-2 font-medium" style={{ color: '#10B981' }}>
                Спасибо! Вы подписаны на обновления.
              </p>
            )}
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--landing-text)' }}>
              Продукт
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: 'var(--landing-text-secondary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--landing-text)' }}>
              Ресурсы
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: 'var(--landing-text-secondary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 mt-6" style={{ color: 'var(--landing-text)' }}>
              Поддержка
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: 'var(--landing-text-secondary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--landing-text)' }}>
              Соцсети
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://t.me/ThumbGenAI_BOT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                style={{ color: 'var(--landing-text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                style={{ color: 'var(--landing-text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
              <a
                href="mailto:support@thumbgen.ai"
                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                style={{ color: 'var(--landing-text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-brand)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-text-secondary)'}
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--landing-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--landing-text-muted)' }}>
            &copy; {currentYear} ThumbGen AI. Все права защищены.
          </p>
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--landing-text-muted)' }}>
            Сделано с <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" /> для создателей контента
          </p>
        </div>
      </div>
    </footer>
  );
}
