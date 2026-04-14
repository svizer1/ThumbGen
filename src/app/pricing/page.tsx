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
    color: 'text-[var(--text-muted)]',
    bgColor: 'bg-[var(--bg-elevated)]',
    borderColor: 'border-[var(--border-subtle)]',
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
    yearlyPrice: 48,
    yearlyPeriod: '/год',
    icon: Sparkles,
    color: 'text-[var(--tag-blue-text)]',
    bgColor: 'bg-[var(--tag-blue-bg)]',
    borderColor: 'border-[var(--tag-blue-border)]',
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
    yearlyPrice: 144,
    yearlyPeriod: '/год',
    icon: Crown,
    color: 'text-[var(--accent)]',
    bgColor: 'bg-[var(--accent-glow)]',
    borderColor: 'border-[var(--accent)]',
    popular: true,
    features: [
      '600 генераций в месяц',
      'Все модели + ранний доступ',
      'Без watermark',
      'История 90 дней',
      'Генератор V2 с 15 паками примеров',
      'Prompt Enhancer X2',
      'Полное улучшение изображений',
      'Playerok генератор карточек',
      'Wildberries генератор (базовый)',
      'Паки примеров: GEN + Playerok + WB',
      'ThumbBot AI помощник',
      'API доступ',
      'Приоритетная генерация',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 30,
    period: '/месяц',
    yearlyPrice: 288,
    yearlyPeriod: '/год',
    icon: Infinity,
    color: 'text-[var(--tag-orange-text)]',
    bgColor: 'bg-[var(--tag-orange-bg)]',
    borderColor: 'border-[var(--tag-orange-border)]',
    features: [
      'Безлимитные генерации',
      'Все модели + эксклюзивные',
      'Без watermark',
      'Бессрочная история',
      'Все функции Pro',
      'Playerok расширенный режим',
      'Wildberries расширенный (инфографика)',
      'ThumbBot с расширенным контекстом',
      'Batch processing для улучшения',
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

const pricingExamples = [
  { src: '/examples/gen1.png', alt: 'GEN пример 1' },
  { src: '/examples/gen3.png', alt: 'GEN пример 2' },
  { src: '/examples/playerok_Claud.png', alt: 'Playerok Claude' },
  { src: '/examples/playerok_Roblox.png', alt: 'Playerok Roblox' },
  { src: '/examples/wb_protein.png', alt: 'WB Protein' },
  { src: '/examples/wb_protein2.png', alt: 'WB Protein 2' },
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
    const periodSuffix = billingPeriod === 'yearly' ? '_yearly' : '';
    const startParam = `subscribe_${planId}${periodSuffix}`;
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
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
            <span className="gradient-text">Выберите свой план</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Начните бесплатно или выберите план, который подходит именно вам
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
              Ежемесячно
            </span>
            <button
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-[var(--accent)] transition-transform duration-200 ease-in-out ${
                  billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${billingPeriod === 'yearly' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
              Ежегодно
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500 border border-emerald-500/20">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = userData?.subscription.plan === plan.id;
            const price = billingPeriod === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
            const period = billingPeriod === 'yearly' && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period;
            const monthlyEquivalent = billingPeriod === 'yearly' && plan.yearlyPrice ? Math.round(plan.yearlyPrice / 12) : null;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 animate-fadeInUp stagger-${index + 1} group ${
                  plan.popular ? 'ring-2 ring-[var(--accent)] shadow-[0_0_40px_var(--accent-glow)] scale-105 z-10 border-[var(--accent)]/50 hover:shadow-[0_0_60px_var(--accent-glow)]' : 'hover:-translate-y-2 border-[var(--border-default)]'
                }`}
                hover={true}
              >
                {/* Decorative background element */}
                <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${
                  plan.popular ? 'bg-[var(--accent)]' : 'bg-current text-[var(--text-muted)]'
                }`} />

                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hover)] to-[var(--accent)]" />
                )}
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--accent)]/20 animate-glow">
                    Популярный
                  </div>
                )}

                <div className="p-8 h-full flex flex-col relative z-10">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-2xl ${plan.bgColor} ${plan.color} ring-1 ring-inset ${plan.borderColor} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
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
                      <span className="text-5xl font-extrabold text-[var(--text-primary)] tracking-tighter transition-all duration-300 group-hover:scale-105 origin-left">
                        ${price}
                      </span>
                      <span className="text-[var(--text-muted)] font-medium">
                        {period}
                      </span>
                    </div>
                    {monthlyEquivalent && (
                      <p className="text-sm text-[var(--text-secondary)] mt-2 font-medium bg-[var(--bg-surface)] inline-block px-2 py-1 rounded-md border border-[var(--border-default)]">
                        Всего ${monthlyEquivalent} / мес
                      </p>
                    )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {pricingExamples.map((example, index) => (
              <div key={example.src} className={`group animate-scaleIn stagger-${Math.min(index + 1, 6)}`}>
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-[var(--accent)]">
                  <div className="aspect-video relative">
                    <img
                      src={example.src}
                      alt={example.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
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
