'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  Layers3,
  Loader2,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProBadge } from '@/components/ui/ProBadge';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { WBVisualStyle } from '@/lib/wildberries-generator';

type Spec = { label: string; value: string };

type GenerationResult = {
  mainImage?: string;
  infographic?: string;
  additionalAngles?: string[];
  seoDescription?: string;
  creditsRemaining?: number;
};

const STYLE_PRESETS: Record<
  WBVisualStyle,
  {
    title: string;
    subtitle: string;
    badge: string;
    previewNote: string;
    tone: string;
    chipClassName: string;
    panelClassName: string;
    accentClassName: string;
  }
> = {
  minimal: {
    title: 'Минимализм',
    subtitle: 'Чистая подача без визуального шума',
    badge: 'Чисто',
    previewNote: 'Минимум блоков, максимум фокуса на товаре',
    tone: 'Лаконичная и строгая карточка',
    chipClassName: 'border-slate-300/80 bg-white/90 text-slate-700',
    panelClassName:
      'border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 shadow-[0_24px_80px_rgba(148,163,184,0.18)]',
    accentClassName: 'from-slate-900 via-slate-700 to-slate-500',
  },
  standard: {
    title: 'Стандарт',
    subtitle: 'Типовой WB-интерфейс с привычными блоками',
    badge: 'WB',
    previewNote: 'Фильтры, переключатели и понятная структура',
    tone: 'Понятная карточка в духе маркетплейса',
    chipClassName: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100',
    panelClassName:
      'border-fuchsia-500/30 bg-[linear-gradient(180deg,rgba(117,32,140,0.96),rgba(61,16,80,0.98))] text-white shadow-[0_28px_90px_rgba(192,38,211,0.22)]',
    accentClassName: 'from-fuchsia-200 via-white to-pink-200',
  },
  premium: {
    title: 'Премиум',
    subtitle: 'Современные эффекты, навигация и вау-подача',
    badge: 'Pro Max',
    previewNote: 'Глубина, стекло, подсветка и усиленная иерархия',
    tone: 'Имиджевая карточка с премиальным фокусом',
    chipClassName: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
    panelClassName:
      'border-cyan-400/30 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_30%),linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.95),rgba(17,24,39,0.98))] text-white shadow-[0_28px_100px_rgba(14,165,233,0.22)]',
    accentClassName: 'from-cyan-200 via-sky-100 to-violet-200',
  },
};

function ResultImageCard({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
          3:4
        </span>
      </div>
      <img
        src={imageUrl}
        alt={title}
        className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] object-cover"
      />
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => window.open(imageUrl, '_blank')}
      >
        <Download className="w-4 h-4" />
        Скачать
      </Button>
    </div>
  );
}

function ToggleOption({
  title,
  description,
  checked,
  disabled,
  badge,
  onChange,
  children,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all',
        checked
          ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
          : 'border-[var(--border-default)] bg-[var(--bg-base)]',
        disabled && 'opacity-60'
      )}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--accent)]"
        />
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">{title}</span>
            {badge && (
              <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-yellow-400">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
      </label>
      {children}
    </div>
  );
}

export default function WildberriesPage() {
  const { user, userData } = useAuth();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [selectedStyle, setSelectedStyle] = useState<WBVisualStyle>('standard');
  const [includeInfographic, setIncludeInfographic] = useState(false);
  const [includeMultipleAngles, setIncludeMultipleAngles] = useState(false);
  const [slidesCount, setSlidesCount] = useState(3);
  const [infographicTitle, setInfographicTitle] = useState('');
  const [specs, setSpecs] = useState<Spec[]>([{ label: '', value: '' }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSmartFilling, setIsSmartFilling] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const hasBasicAccess =
    userData?.subscription.plan && ['pro', 'unlimited'].includes(userData.subscription.plan);
  const hasAdvancedAccess = userData?.subscription.plan === 'unlimited';

  const activeStyle = STYLE_PRESETS[selectedStyle];
  const filteredFeatures = features.filter((feature) => feature.trim());
  const visibleFeatures = filteredFeatures.length
    ? filteredFeatures.slice(0, 4)
    : ['Чёткая подача', 'Контрастные акценты', 'Готово к WB', 'Быстрый просмотр'];
  const visibleSpecs = specs.filter((spec) => spec.label.trim() && spec.value.trim()).slice(0, 4);
  const price = hasAdvancedAccess && (includeInfographic || includeMultipleAngles) ? 5 : 3;

  const addFeature = () => {
    setFeatures((current) => [...current, '']);
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures((current) => current.map((feature, currentIndex) => (currentIndex === index ? value : feature)));
  };

  const removeFeature = (index: number) => {
    setFeatures((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const addSpec = () => {
    setSpecs((current) => [...current, { label: '', value: '' }]);
  };

  const updateSpec = (index: number, field: keyof Spec, value: string) => {
    setSpecs((current) =>
      current.map((spec, currentIndex) =>
        currentIndex === index ? { ...spec, [field]: value } : spec
      )
    );
  };

  const removeSpec = (index: number) => {
    setSpecs((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSmartFill = async () => {
    if (!productName.trim()) {
      toast.error('Введите название товара');
      return;
    }

    setIsSmartFilling(true);

    try {
      const response = await fetch('/api/wildberries/smart-fill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      });

      if (!response.ok) {
        throw new Error('Smart fill failed');
      }

      const smartFillResult = await response.json();
      const data = smartFillResult.data;

      setCategory(data.category);
      setDescription(data.description);
      setFeatures(data.features);
      setInfographicTitle(data.infographicTitle);
      setSpecs(data.specs);

      toast.success('Поля заполнены автоматически');
    } catch (error) {
      console.error('Smart fill error:', error);
      toast.error('Не удалось заполнить поля автоматически');
    } finally {
      setIsSmartFilling(false);
    }
  };

  const handleGenerate = async () => {
    if (!productName.trim() || !category.trim() || !description.trim()) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    if (!user) {
      toast.error('Войдите в систему');
      return;
    }

    if (filteredFeatures.length === 0) {
      toast.error('Добавьте хотя бы одну характеристику');
      return;
    }

    setIsGenerating(true);

    try {
      const token = await user.getIdToken();

      const product = {
        productName,
        category,
        description,
        features: filteredFeatures,
        style: selectedStyle,
        infographicData: includeInfographic
          ? {
              title: infographicTitle || 'Ключевые характеристики',
              specs: specs.filter((spec) => spec.label.trim() && spec.value.trim()),
            }
          : undefined,
      };

      const response = await fetch('/api/wildberries/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product,
          options: {
            includeInfographic,
            includeMultipleAngles,
            anglesCount: slidesCount,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      setResult(data);
      toast.success(`Карточка создана! Осталось ${data.creditsRemaining} кредитов`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка генерации');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600">
            <ShoppingBag className="h-10 w-10 text-[var(--text-primary)]" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-[var(--text-primary)]">Wildberries Генератор</h1>
          <p className="mb-6 text-[var(--text-secondary)]">
            Войдите в систему для создания карточек товаров
          </p>
          <Link href="/">
            <Button size="lg" className="w-full">
              Войти
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasBasicAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-[var(--text-primary)]">Требуется Pro Подписка</h1>
          <p className="mb-6 text-[var(--text-secondary)]">
            Wildberries генератор доступен с подпиской Pro и выше
          </p>
          <Link href="/pricing">
            <Button size="lg" className="w-full">
              Выбрать план
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться на главную
        </Link>

        <div className="rounded-3xl border border-[var(--border-default)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-surface))] p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <span className="gradient-text">Wildberries Генератор</span>
                </h1>
                <ProBadge />
              </div>
              <p className="max-w-3xl text-base text-[var(--text-secondary)] sm:text-lg">
                Три режима оформления, мгновенный live-предпросмотр и улучшенная сетка управления для быстрой сборки карточки под Wildberries.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Активный стиль</p>
                <p className="mt-2 font-semibold text-[var(--text-primary)]">{activeStyle.title}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Стоимость</p>
                <p className="mt-2 font-semibold text-[var(--text-primary)]">{price} кредита</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Доступ</p>
                <p className="mt-2 font-semibold text-[var(--text-primary)]">
                  {hasAdvancedAccess ? 'Полный' : 'Базовый Pro'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <div className="space-y-6">
          <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--bg-card),var(--bg-surface))] p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Визуальный режим
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Выберите стиль карточки</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  <Eye className="h-4 w-4 text-[var(--accent)]" />
                  Live-предпросмотр обновляется мгновенно
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-6 md:grid-cols-3">
              {(Object.entries(STYLE_PRESETS) as [WBVisualStyle, (typeof STYLE_PRESETS)[WBVisualStyle]][]).map(
                ([styleKey, style]) => (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => setSelectedStyle(styleKey)}
                    className={cn(
                      'rounded-3xl border p-4 text-left transition-all',
                      selectedStyle === styleKey
                        ? 'border-[var(--accent)] bg-[var(--accent-glow)] shadow-[0_0_0_1px_var(--accent-glow)]'
                        : 'border-[var(--border-default)] bg-[var(--bg-base)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[var(--text-primary)]">{style.title}</p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">{style.subtitle}</p>
                      </div>
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full border',
                          selectedStyle === styleKey
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                            : 'border-[var(--border-default)] text-[var(--text-muted)]'
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      <span className="rounded-full border border-[var(--border-default)] px-2 py-1">{style.badge}</span>
                      <span>{style.tone}</span>
                    </div>
                  </button>
                )
              )}
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Контент
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Основная информация</h2>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <Input
                    label="Название товара"
                    placeholder="Например: Смартфон Samsung Galaxy S24"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSmartFill}
                    disabled={isSmartFilling || !productName.trim()}
                    className="absolute right-2 top-8 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:border-amber-300/50 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSmartFilling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {isSmartFilling ? 'Заполняем...' : 'Smart Fill'}
                  </button>
                </div>

                <Input
                  label="Категория"
                  placeholder="Например: Электроника"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                />
              </div>

              <Textarea
                label="Описание товара"
                placeholder="Опишите товар, позиционирование, ключевые преимущества и детали, которые важно показать в карточке."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-[124px]"
                required
              />
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    УТП
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Характеристики и преимущества</h2>
                </div>
                <Button size="sm" variant="secondary" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                  Добавить характеристику
                </Button>
              </div>
            </div>

            <div className="grid gap-3 p-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Характеристика ${index + 1}`}
                    value={feature}
                    onChange={(event) => updateFeature(index, event.target.value)}
                  />
                  {features.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => removeFeature(index)} aria-label="Удалить характеристику">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Дополнительно
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Модули карточки</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
                  Сгруппированные настройки и понятная иерархия
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <ToggleOption
                title="Множественные ракурсы"
                description="Подготовить несколько дополнительных изображений товара для слайдера карточки."
                checked={includeMultipleAngles}
                disabled={!hasAdvancedAccess}
                badge={!hasAdvancedAccess ? 'Unlimited' : undefined}
                onChange={setIncludeMultipleAngles}
              >
                {includeMultipleAngles && hasAdvancedAccess && (
                  <div className="ml-7 mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-[var(--text-primary)]">
                        Количество слайдов
                      </label>
                      <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                        {slidesCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={slidesCount}
                      onChange={(event) => setSlidesCount(parseInt(event.target.value, 10))}
                      className="mt-3 w-full accent-[var(--accent)]"
                    />
                    <div className="mt-1 flex justify-between text-xs text-[var(--text-muted)]">
                      <span>1</span>
                      <span>4</span>
                      <span>8</span>
                    </div>
                  </div>
                )}
              </ToggleOption>

              <ToggleOption
                title="Инфографика"
                description="Добавить отдельный визуал с заголовком и блоком характеристик."
                checked={includeInfographic}
                disabled={!hasAdvancedAccess}
                badge={!hasAdvancedAccess ? 'Unlimited' : undefined}
                onChange={setIncludeInfographic}
              >
                {includeInfographic && hasAdvancedAccess && (
                  <div className="ml-7 mt-4 space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                    <Input
                      label="Заголовок инфографики"
                      placeholder="Например: Основные преимущества"
                      value={infographicTitle}
                      onChange={(event) => setInfographicTitle(event.target.value)}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Спецификации</p>
                        <Button size="sm" variant="secondary" onClick={addSpec}>
                          <Plus className="h-4 w-4" />
                          Добавить
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {specs.map((spec, index) => (
                          <div key={index} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px]">
                            <Input
                              placeholder="Название"
                              value={spec.label}
                              onChange={(event) => updateSpec(index, 'label', event.target.value)}
                            />
                            <Input
                              placeholder="Значение"
                              value={spec.value}
                              onChange={(event) => updateSpec(index, 'value', event.target.value)}
                            />
                            {specs.length > 1 ? (
                              <Button size="sm" variant="ghost" onClick={() => removeSpec(index)} aria-label="Удалить спецификацию">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ToggleOption>
            </div>
          </Card>

          <Card className="border-[var(--border-strong)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-surface))] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Итог</p>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Готово к генерации</h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Стиль <span className="font-semibold text-[var(--text-primary)]">{activeStyle.title}</span>, {filteredFeatures.length || 0} характеристик, {includeInfographic ? 'с' : 'без'} инфографики.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full lg:w-auto lg:min-w-[300px]"
                onClick={handleGenerate}
                disabled={isGenerating}
                loading={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Сгенерировать карточку ({price} кредита)
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Предпросмотр
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Live preview карточки</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  <Eye className="h-4 w-4 text-[var(--accent)]" />
                  {activeStyle.badge}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className={cn('rounded-[28px] border p-4 sm:p-5', activeStyle.panelClassName)}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] opacity-70">Wildberries style</p>
                    <p className="mt-1 text-lg font-semibold">{activeStyle.title}</p>
                  </div>
                  <div className={cn('rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]', activeStyle.chipClassName)}>
                    {activeStyle.badge}
                  </div>
                </div>

                <div className="aspect-[3/4] overflow-hidden rounded-[24px] border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
                  <div className="flex h-full flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                        <Layers3 className="h-3.5 w-3.5" />
                        {category || 'Категория'}
                      </div>
                      <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                        {selectedStyle}
                      </div>
                    </div>

                    {selectedStyle === 'minimal' && (
                      <>
                        <div className="flex flex-1 items-center justify-center rounded-[22px] border border-slate-300/50 bg-white/85 p-5 text-slate-900">
                          <div className="space-y-5 text-center">
                            <div className="mx-auto h-40 w-40 rounded-full bg-gradient-to-br from-slate-200 to-white shadow-inner" />
                            <div>
                              <p className="text-xl font-semibold">{productName || 'Название товара'}</p>
                              <p className="mt-2 text-sm text-slate-500">
                                {description || 'Краткое и чистое позиционирование без лишнего визуального шума.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {visibleFeatures.map((feature, index) => (
                            <div key={index} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm">
                              {feature}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedStyle === 'standard' && (
                      <>
                        <div className="flex items-center gap-2 overflow-auto pb-1 text-xs text-white/80">
                          <span className="rounded-full bg-white px-3 py-1 font-semibold text-fuchsia-700">Главная</span>
                          <span className="rounded-full border border-white/15 px-3 py-1">Характеристики</span>
                          <span className="rounded-full border border-white/15 px-3 py-1">Отзывы</span>
                          <span className="rounded-full border border-white/15 px-3 py-1">Доставка</span>
                        </div>

                        <div className="grid flex-1 gap-3 md:grid-cols-[1.1fr_0.9fr]">
                          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
                            <div className="flex h-full flex-col justify-between gap-4">
                              <div className="h-44 rounded-[18px] bg-gradient-to-br from-white/95 to-fuchsia-100" />
                              <div>
                                <p className="text-lg font-semibold">{productName || 'Название товара'}</p>
                                <p className="mt-2 text-sm text-white/80">
                                  {description || 'Привычная структура WB-карточки с основными преимуществами и блоками.'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="rounded-[22px] border border-white/15 bg-black/15 p-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold">Фильтры</span>
                                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">ON</span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {visibleFeatures.slice(0, 3).map((feature, index) => (
                                  <span key={index} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/85">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
                              <p className="text-sm font-semibold">Быстрые преимущества</p>
                              <div className="mt-3 space-y-2">
                                {visibleFeatures.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-white/85">
                                    <Check className="h-4 w-4 text-fuchsia-200" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedStyle === 'premium' && (
                      <>
                        <div className="grid flex-1 gap-3 md:grid-cols-[0.42fr_0.58fr]">
                          <div className="rounded-[22px] border border-cyan-300/20 bg-white/5 p-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Навигация</p>
                            <div className="mt-4 space-y-2">
                              {['Hero', 'УТП', 'Сравнение', 'Инфографика'].map((item, index) => (
                                <div
                                  key={item}
                                  className={cn(
                                    'rounded-2xl px-3 py-2 text-sm',
                                    index === 0 ? 'bg-cyan-300/15 text-cyan-50' : 'bg-white/5 text-white/70'
                                  )}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="rounded-[24px] border border-cyan-300/20 bg-white/10 p-4 backdrop-blur">
                              <div className="h-36 rounded-[18px] bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.45),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(191,219,254,0.55))]" />
                              <div className="mt-4">
                                <div className={cn('inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900', activeStyle.accentClassName)}>
                                  Premium focus
                                </div>
                                <p className="mt-3 text-xl font-semibold">{productName || 'Название товара'}</p>
                                <p className="mt-2 text-sm text-white/80">
                                  {description || 'Продвинутая карточка с глубиной, эффектами и усиленной визуальной навигацией.'}
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {visibleFeatures.map((feature, index) => (
                                <div key={index} className="rounded-[20px] border border-cyan-300/15 bg-black/15 px-3 py-3 text-sm text-white/85">
                                  <div className="mb-2 flex items-center gap-2 text-cyan-200">
                                    <Star className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.18em]">Feature</span>
                                  </div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Что видно в preview</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{activeStyle.previewNote}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {visibleFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1 text-sm text-[var(--text-secondary)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                {includeInfographic && (
                  <div className="mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {infographicTitle || 'Ключевые характеристики'}
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {(visibleSpecs.length ? visibleSpecs : [{ label: 'Размер', value: 'По выбору' }, { label: 'Материал', value: 'Премиум' }]).map((spec, index) => (
                        <div key={index} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{spec.label}</p>
                          <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-[var(--border-default)] px-6 py-5">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Результат генерации</h2>
            </div>

            <div className="space-y-6 p-6">
              {!result ? (
                <div className="rounded-3xl border-2 border-dashed border-[var(--border-default)] p-12 text-center">
                  <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
                  <p className="font-medium text-[var(--text-primary)]">Результат появится здесь после генерации</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Текущий стиль: {activeStyle.title}. Предпросмотр уже показывает будущую структуру карточки.
                  </p>
                </div>
              ) : (
                <>
                  {result.mainImage && <ResultImageCard title="Основное изображение" imageUrl={result.mainImage} />}

                  {result.infographic && <ResultImageCard title="Инфографика" imageUrl={result.infographic} />}

                  {!!result.additionalAngles?.length && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Дополнительные ракурсы</h3>
                        <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                          {result.additionalAngles.length} шт.
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {result.additionalAngles.map((url, index) => (
                          <img
                            key={`${url}-${index}`}
                            src={url}
                            alt={`Ракурс ${index + 1}`}
                            className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {result.seoDescription && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">SEO-описание</h3>
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                          {result.seoDescription}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigator.clipboard.writeText(result.seoDescription || '');
                          toast.success('Описание скопировано');
                        }}
                      >
                        Копировать описание
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
