'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { openLoginModal, openSignupModal } from '@/lib/landing-events';

const navLinks = [
  { label: 'О нас', href: '#about' },
  { label: 'Преимущества', href: '#features' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Отзывы', href: '#testimonials' },
  { label: 'Контакты', href: '#contacts' },
];

export function LandingHeader({ onOpenLogin, onOpenSignup }: { onOpenLogin?: () => void; onOpenSignup?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => { setMobileOpen(false); onOpenLogin ? onOpenLogin() : openLoginModal(); };
  const handleSignup = () => { setMobileOpen(false); onOpenSignup ? onOpenSignup() : openSignupModal(); };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl border-b border-[var(--landing-border)]'
            : ''
        }`}
        style={scrolled ? { background: 'rgba(12,10,10,0.75)' } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 group"
            >
              <img
                src="/logo-red.png"
                alt="ThumbGen"
                className="w-9 h-9 rounded-xl shadow-lg object-cover"
              />
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--landing-text)' }}>
                Thumb<span style={{ color: 'var(--landing-brand)' }}>Gen</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: 'var(--landing-brand)', background: 'var(--landing-brand-subtle)', border: '1px solid var(--landing-border-hover)' }}>
                AI
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--landing-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--landing-brand)';
                    e.currentTarget.style.background = 'var(--landing-brand-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--landing-text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button onClick={handleLogin} className="landing-btn-ghost">
                Войти
              </button>
              <button onClick={handleSignup} className="landing-btn-primary !py-2.5 !px-5 !text-sm">
                Попробовать бесплатно
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--landing-text)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 z-50 lg:hidden w-[280px] h-full transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--landing-card)', boxShadow: 'var(--landing-shadow-xl)' }}
      >
        <div className="p-6 pt-20 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
              style={{ color: 'var(--landing-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--landing-brand)';
                e.currentTarget.style.background = 'var(--landing-brand-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--landing-text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}

          <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--landing-border)' }}>
            <button onClick={handleLogin} className="landing-btn-ghost w-full justify-center">
              Войти
            </button>
            <button onClick={handleSignup} className="landing-btn-primary w-full">
              Попробовать бесплатно
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
