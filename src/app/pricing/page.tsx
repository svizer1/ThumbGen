'use client';

import { Check, Zap, Sparkles, Crown, Infinity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    period: '',
    icon: Zap,
    color: 'text-gray-400',
    bgColor: 'bg-gray-950/30',
    borderColor: 'border-gray-700/30',
    features: [
      '10 генераций при регистрации',
      'Базовые модели',
      'Watermark на изображениях',
      'История 7 дней',
    ],
    limitations: [
      'Ограниченный выбор моделей',
      'Низкий приоритет генерации',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    period: '/месяц',
    icon: Sparkles,
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/30',
    borderColor: 'border-blue-700/30',
    popular: false,
    features: [
      '200 генераций в месяц',
      'Все модели (FLUX, Imagen, SDXL)',
      'Без watermark',
      'История 30 дней',
      'Приоритетная поддержка',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    period: '/месяц',
    icon: Crown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/30',
    borderColor: 'border-purple-700/30',
    popular: true,
    features: [
      '600 генераций в месяц',
      'Все модели + ранний доступ',
      'Без watermark',
      'История 90 дней',
      'Приоритетная генерация',
      'API доступ',
      'Расширенная аналитика',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 30,
    period: '/месяц',
    icon: Infinity,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/30',
    borderColor: 'border-amber-700/30',
    features: [
      '∞ Безлимитные генерации',
      'Все модели + эксклюзивные',
      'Без watermark',
      'Бессрочная история',
      'Максимальный приоритет',
      'API доступ',
      'Персональная поддержка 24/7',
      'Ранний доступ к новым функциям',
    ],
  },
];

const creditPackages = [
  {
    credits: 50,
    price: 3,
    bonus: 0,
    popular: false,
  },
  {
    credits: 150,
    price: 8,
    bonus: 10,
    popular: true,
  },
  {
    credits: 400,
    price: 20,
    bonus: 50,
    popular: false,
  },
];

export default function PricingPage() {
  const { user, userData } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscriptionClick = (planId: string) => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    
    // Redirect to Telegram bot for payment
    const botUsername = 'ThumbGenAI_BOT';
    const startParam = `subscribe_${planId}`;
    window.open(`https://t.me/${botUsername}?start=${startParam}`, '_blank');
  };

  const handleCreditPurchase = (credits: number) => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    
    // Redirect to Telegram bot for payment
    const botUsername = 'ThumbGenAI_BOT';
    const startParam = `credits_${credits}`;
    window.open(`https://t.me/${botUsername}?start=${startParam}`, '_blank');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
            <span className="gradient-text">Выберите свой план</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Начните бесплатно или выберите план, который подходит именно вам
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = userData?.subscription.plan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden animate-scaleIn stagger-${index + 1} group ${
                  plan.popular ? 'ring-2 ring-[var(--accent)] scale-105' : ''
                }`}
                hover={true}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                    Популярный
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl ${plan.bgColor} border ${plan.borderColor} flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}>
                      <Icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        {plan.name}
                      </h3>
                      {isCurrentPlan && (
                        <span className="text-xs text-[var(--accent)] font-medium animate-pulse">
                          Текущий план
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[var(--text-primary)] transition-all duration-300 hover:scale-110">
                        ${plan.price}
                      </span>
                      <span className="text-[var(--text-muted)]">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 animate-fadeIn" style={{ animationDelay: `${(idx + 1) * 0.05}s` }}>
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, idx) => (
                      <li key={`limit-${idx}`} className="flex items-start gap-2 opacity-50">
                        <span className="text-sm text-[var(--text-muted)]">
                          • {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {user ? (
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? 'outline' : 'primary'}
                      disabled={isCurrentPlan}
                      onClick={() => !isCurrentPlan && plan.id !== 'free' && handleSubscriptionClick(plan.id)}
                    >
                      {isCurrentPlan ? 'Активен' : plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
                    </Button>
                  ) : (
                    <Link href="/">
                      <Button className="w-full">
                        Начать
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Credit Packages */}
        <div id="credits" className="scroll-mt-20 animate-fadeInUp stagger-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Дополнительные кредиты
            </h2>
            <p className="text-[var(--text-secondary)]">
              Нужно больше генераций? Купите дополнительные кредиты для любого плана
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creditPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative animate-scaleIn stagger-${index + 6} ${
                  pkg.popular ? 'ring-2 ring-[var(--accent)] scale-105' : ''
                }`}
                hover={true}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                    Выгодно
                  </div>
                )}

                <div className="p-8 text-center">
                  {/* Credits Amount */}
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-[var(--accent)] mb-2 transition-all duration-300 hover:scale-110">
                      {pkg.credits}
                      {pkg.bonus > 0 && (
                        <span className="text-2xl text-green-400 animate-pulse">+{pkg.bonus}</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                      {pkg.bonus > 0 ? `${pkg.credits + pkg.bonus} генераций` : 'генераций'}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-[var(--text-primary)]">
                      ${pkg.price}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      ${(pkg.price / (pkg.credits + pkg.bonus)).toFixed(2)} за генерацию
                    </p>
                  </div>

                  {/* Bonus Badge */}
                  {pkg.bonus > 0 && (
                    <div className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 bg-green-950/30 border border-green-700/30 rounded-full animate-glow">
                      <Sparkles className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs font-medium text-green-300">
                        +{pkg.bonus} бонусных кредитов
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  {user ? (
                    <Button 
                      className="w-full"
                      onClick={() => handleCreditPurchase(pkg.credits)}
                    >
                      Купить
                    </Button>
                  ) : (
                    <Link href="/">
                      <Button className="w-full">
                        Войти для покупки
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto animate-fadeInUp stagger-7">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-10">
            Часто задаваемые вопросы
          </h2>

          <div className="space-y-4">
            <Card className="card-hover animate-slideUp stagger-1">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Как работает система кредитов?
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Каждая генерация изображения стоит 1 кредит. Кредиты из подписки обновляются каждый месяц, 
                  а купленные дополнительные кредиты не сгорают.
                </p>
              </div>
            </Card>

            <Card className="card-hover animate-slideUp stagger-2">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Могу ли я отменить подписку?
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Да, вы можете отменить подписку в любое время. Доступ к функциям сохранится до конца оплаченного периода.
                </p>
              </div>
            </Card>

            <Card className="card-hover animate-slideUp stagger-3">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Какие способы оплаты доступны?
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Мы принимаем оплату через Telegram Bot криптовалютой (TON, USDT, BTC, ETH). 
                  Это быстро, безопасно и анонимно.
                </p>
              </div>
            </Card>

            <Card className="card-hover animate-slideUp stagger-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Что такое приоритетная генерация?
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Платные планы получают более высокий приоритет в очереди генерации, 
                  что означает более быстрое создание изображений, особенно в часы пик.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-20 animate-fadeInUp stagger-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Примеры работ
            </h2>
            <p className="text-[var(--text-secondary)]">
              Посмотрите, что создают наши пользователи с помощью ThumbGen AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example 1 */}
            <div className="group animate-scaleIn stagger-1">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-[var(--accent)]">
                <div className="aspect-video relative">
                  <img 
                    src="/examples/1.png" 
                    alt="Пример миниатюры 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="group animate-scaleIn stagger-2">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-[var(--accent)]">
                <div className="aspect-video relative">
                  <img 
                    src="/examples/2.png" 
                    alt="Пример миниатюры 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Example 3 */}
            <div className="group animate-scaleIn stagger-3">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:border-[var(--accent)]">
                <div className="aspect-video relative">
                  <img 
                    src="/examples/3.png" 
                    alt="Пример миниатюры 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist CTA Banner */}
        <div className="mt-20 border-t border-b border-[var(--border-default)] py-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Начните создавать сегодня
              </h3>
              <p className="text-[var(--text-secondary)]">
                10 бесплатных кредитов при регистрации • Без привязки карты
              </p>
            </div>
            {!user && (
              <Link href="/">
                <Button size="lg" className="gap-2 whitespace-nowrap">
                  <Zap className="w-5 h-5" />
                  Попробовать бесплатно
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              ThumbGen AI в цифрах
            </h2>
            <p className="text-[var(--text-secondary)]">
              Присоединяйтесь к растущему сообществу создателей контента
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-scaleIn stagger-1">
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                10,000+
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Созданных миниатюр
              </p>
            </div>

            <div className="text-center animate-scaleIn stagger-2">
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                2,500+
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Активных пользователей
              </p>
            </div>

            <div className="text-center animate-scaleIn stagger-3">
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                98%
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Довольных клиентов
              </p>
            </div>

            <div className="text-center animate-scaleIn stagger-4">
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                24/7
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Поддержка
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
