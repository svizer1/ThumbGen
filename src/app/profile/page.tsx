'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Coins, TrendingUp, CreditCard, Settings as SettingsIcon, Shield, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';
import { SpendingTable } from '@/components/profile/SpendingTable';
import { BalanceModeSwitch } from '@/components/profile/BalanceModeSwitch';
import { FavoriteModel } from '@/components/profile/FavoriteModel';
import { TelegramLinkCard } from '@/components/profile/TelegramLinkCard';

export default function ProfilePage() {
  const { user, userData, loading, refreshUserData } = useAuth();
  const router = useRouter();
  const [sendingVerification, setSendingVerification] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const handleSendVerification = async () => {
    if (!user) return;
    
    setSendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast.success('Письмо для подтверждения отправлено!');
    } catch (error: any) {
      toast.error('Ошибка отправки: ' + error.message);
    } finally {
      setSendingVerification(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'text-[var(--text-muted)]';
      case 'starter':
        return 'text-blue-400';
      case 'pro':
        return 'text-purple-400';
      case 'unlimited':
        return 'text-amber-400';
      default:
        return 'text-[var(--text-muted)]';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'Бесплатный';
      case 'starter':
        return 'Starter';
      case 'pro':
        return 'Pro';
      case 'unlimited':
        return 'Unlimited';
      default:
        return plan;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Профиль
        </h1>
        <p className="text-[var(--text-secondary)]">
          Управляйте своим аккаунтом и подпиской
        </p>
      </div>

      {/* Email Verification Warning */}
      {!userData.emailVerified && (
        <div className="mb-6 bg-amber-950/30 border border-amber-700/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-300 mb-1">
                Подтвердите ваш email
              </h3>
              <p className="text-xs text-amber-200 mb-3">
                Для полного доступа ко всем функциям подтвердите ваш email адрес
              </p>
              <Button
                size="sm"
                onClick={handleSendVerification}
                loading={sendingVerification}
                disabled={sendingVerification}
              >
                Отправить письмо повторно
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* User Card */}
          <Card className="animate-slideInLeft overflow-hidden border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors duration-300 card-hover">
            <div className="relative h-32 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex items-center justify-center overflow-hidden">
               <div className="absolute top-0 w-full h-full bg-gradient-to-b from-transparent to-[var(--bg-card)]/80"></div>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-[var(--bg-surface)] border-4 border-[var(--bg-card)] flex items-center justify-center text-white text-3xl font-bold -mt-12 mb-4 relative z-10 shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden">
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white flex items-center justify-center">
                      {userData.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {/* Name & Email */}
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                  {userData.displayName || 'Пользователь'}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-4 break-all">
                  {userData.email}
                </p>

                {/* Verification Badge */}
                {userData.emailVerified ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-950/30 border border-green-700/30 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs font-medium text-green-300">
                      Подтверждён
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/30 border border-amber-700/30 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-300">
                      Не подтверждён
                    </span>
                  </div>
                )}

                {/* Member Since */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] w-full">
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    <span>С {formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="animate-fadeInUp stagger-1 card-hover">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-surface)] transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Всего генераций
                  </span>
                </div>
                <span className="text-lg font-bold text-[var(--text-primary)]">
                  {userData.totalGenerations}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-surface)] transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Кредиты
                  </span>
                </div>
                <span className="text-lg font-bold text-[var(--accent)]">
                  {userData.credits}
                </span>
              </div>
            </div>
          </Card>

          {/* Favorite Model */}
          <div className="animate-fadeInUp stagger-2">
            <FavoriteModel />
          </div>
        </div>

        {/* Right Column - Subscription & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Balance Mode Switch */}
          <div className="animate-slideInRight">
            <BalanceModeSwitch />
          </div>

          {/* Subscription Card */}
          <Card className="animate-fadeInUp stagger-1 card-hover">
            <CardHeader>
              <CardTitle>Подписка</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="bg-[var(--bg-surface)] rounded-xl p-8 border border-[var(--border-default)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${getPlanColor(userData.subscription.plan)}`}>
                      {getPlanName(userData.subscription.plan)}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Текущий план
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData.subscription.status === 'active'
                      ? 'bg-green-950/30 border border-green-700/30 text-green-300'
                      : 'bg-red-950/30 border border-red-700/30 text-red-300'
                  }`}>
                    {userData.subscription.status === 'active' ? 'Активна' : 'Неактивна'}
                  </div>
                </div>

                {userData.subscription.currentPeriodEnd && (
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Действует до: {formatDate(userData.subscription.currentPeriodEnd)}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[var(--bg-card)] rounded-lg p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      Доступно кредитов
                    </p>
                    <p className="text-2xl font-bold text-[var(--accent)]">
                      {userData.credits}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-card)] rounded-lg p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      Использовано
                    </p>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {userData.totalGenerations}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/pricing" className="flex-1">
                    <Button className="w-full gap-2">
                      <CreditCard className="w-4 h-4" />
                      {userData.subscription.plan === 'free' ? 'Выбрать план' : 'Изменить план'}
                    </Button>
                  </Link>
                  {userData.credits < 10 && (
                    <Link href="/pricing#credits" className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Coins className="w-4 h-4" />
                        Купить кредиты
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Telegram Link Card */}
          <div className="animate-fadeInUp stagger-2">
            <TelegramLinkCard />
          </div>

          {/* Account Settings */}
          <Card className="animate-fadeInUp stagger-2 card-hover">
            <CardHeader>
              <CardTitle>Настройки аккаунта</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Email адрес
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Отображаемое имя
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {userData.displayName || 'Не указано'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 cursor-pointer" onClick={() => toast.success('Функция в разработке', { icon: '🚧' })}>
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Дополнительные настройки (API Ключи)
                    </p>
                     <p className="text-xs text-[var(--text-muted)]">
                      Нажмите, чтобы добавить свои ключи
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Spending History - Full Width */}
      <div className="mt-8 animate-fadeInUp stagger-4">
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[var(--accent)]" />
              <CardTitle>История трат</CardTitle>
            </div>
          </CardHeader>
          <div className="px-6 pb-6">
            <SpendingTable />
          </div>
        </Card>
      </div>
    </div>
  );
}
