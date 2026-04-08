'use client';

import { useState } from 'react';
import { YouTubePack } from '@/lib/youtube-packs';
import { PackSelector } from '@/components/generator-v2/PackSelector';
import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProBadge } from '@/components/ui/ProBadge';
import Link from 'next/link';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';

export default function GeneratorV2Page() {
  const { user, loading } = useAuth();
  const [selectedPack, setSelectedPack] = useState<YouTubePack | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  // Require authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-[var(--text-primary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Генератор V2
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Войдите в систему для доступа к профессиональным пакам примеров
          </p>
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowSignup(true)}
            >
              Создать аккаунт
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setShowLogin(true)}
            >
              Войти
            </Button>
          </div>
          <Link href="/" className="inline-block mt-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            ← Вернуться на главную
          </Link>
        </div>

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Вернуться к Генератору V1
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">Генератор V2</span>
          </h1>
          <ProBadge />
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-3xl">
          Используйте профессиональные паки примеров для создания идеальных YouTube миниатюр
        </p>
      </div>

      {/* Content */}
      {!selectedPack ? (
        // Pack Selection View
        <PackSelector onSelectPack={setSelectedPack} />
      ) : (
        // Generator View with Selected Pack
        <div className="space-y-6">
          {/* Selected Pack Info */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {selectedPack.name}
                  </h2>
                  <span className="text-2xl">{selectedPack.name.split(' ')[0]}</span>
                </div>
                <p className="text-[var(--text-secondary)] mb-3">
                  {selectedPack.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="capitalize">Категория: {selectedPack.category}</span>
                  <span>•</span>
                  <span>Популярность: {selectedPack.popularity}%</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPack(null)}
              >
                Выбрать другой пак
              </Button>
            </div>
          </div>

          {/* Generator Form with Pack Config */}
          <GeneratorForm packConfig={selectedPack.config} />
        </div>
      )}
    </div>
  );
}
