'use client';

import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Lock, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div 
        className="mb-10 text-center animate-fadeIn"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          <span className="gradient-text">Генератор миниатюр с AI</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl mx-auto">
          Загружайте референсные изображения, описывайте свою идею и создавайте профессиональные миниатюры для YouTube одним кликом.
        </p>
      </div>

      {/* Auth Required Overlay */}
      {!user ? (
        <div className="relative">
          {/* Blurred Generator Form */}
          <div className="pointer-events-none blur-sm opacity-50 select-none">
            <GeneratorForm />
          </div>

          {/* Auth Required Card */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div 
              className="bg-[var(--bg-card)] border-2 border-[var(--accent)] rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl animate-scaleIn"
              style={{ 
                transform: `translateY(${scrollY * -0.05}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
                  <Lock className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                  Требуется регистрация
                </h2>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-6">
                  Для использования генератора миниатюр необходимо создать аккаунт. 
                  Получите <span className="text-[var(--accent)] font-semibold">10 бесплатных кредитов</span> при регистрации!
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6 text-left">
                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] animate-slideInLeft stagger-1">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <span>10 бесплатных генераций при регистрации</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] animate-slideInLeft stagger-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <span>Доступ ко всем AI моделям (FLUX, Imagen, SDXL)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] animate-slideInLeft stagger-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <span>История генераций и персональные пресеты</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full text-base font-semibold"
                    onClick={() => setShowSignup(true)}
                  >
                    Создать аккаунт бесплатно
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-base"
                    onClick={() => setShowLogin(true)}
                  >
                    Уже есть аккаунт? Войти
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fadeInUp">
          <GeneratorForm />
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}