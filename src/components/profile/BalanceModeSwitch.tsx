'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Coins, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function BalanceModeSwitch() {
  const { userData } = useAuth();

  if (!userData) return null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            Баланс кредитов
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Используйте кредиты для генерации миниатюр
          </p>
        </div>
      </div>

      {/* Current Balance Display */}
      <div className="p-6 rounded-lg border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent-glow)] to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <Coins className="w-6 h-6 text-[var(--text-primary)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Доступно кредитов</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {userData.credits}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Zap className="w-4 h-4 text-[var(--accent)]" />
          <span>1 кредит = 1 генерация изображения</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Как это работает:</span> Каждая генерация изображения стоит 1 кредит. Это простая и понятная система оплаты.
            </p>
            <p className="text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Выгодно:</span> Подписки дают больше кредитов по лучшей цене, чем разовые покупки. Выберите подходящий план!
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-2">
              💡 Кредиты из подписки обновляются каждый месяц, а купленные отдельно не сгорают.
            </p>
          </div>
        </div>
      </div>

      {/* Top Up Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href="/pricing#credits" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Coins className="w-4 h-4" />
            Купить кредиты
          </Button>
        </Link>
        <Link href="/pricing" className="flex-1">
          <Button size="sm" className="w-full gap-2">
            <Zap className="w-4 h-4" />
            Выбрать подписку
          </Button>
        </Link>
      </div>
    </div>
  );
}
