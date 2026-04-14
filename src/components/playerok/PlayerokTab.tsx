'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  ExternalLink,
  Filter,
  Loader2,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageModal } from '@/components/ui/ImageModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingBuilderGame } from '@/components/generator/LoadingBuilderGame';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type {
  PlayerokBannerStyle,
  PlayerokCard,
  PlayerokCategory,
  PlayerokStatus,
} from '@/lib/playerok-cards';

type SortMode = 'relevance' | 'price_asc' | 'price_desc' | 'new_first';
type SavedPlayerokCard = PlayerokCard & { savedAt: string };
const STORAGE_KEY = 'playerok_saved_cards_v1';

const CATEGORY_OPTIONS: { value: PlayerokCategory; label: string }[] = [
  { value: 'accounts', label: 'Аккаунты' },
  { value: 'skins', label: 'Скины' },
  { value: 'boost', label: 'Буст' },
  { value: 'services', label: 'Услуги' },
];

const STYLE_OPTIONS: { value: PlayerokBannerStyle; label: string; hint: string }[] = [
  { value: 'original', label: 'Original', hint: 'Самый крутой: игровой фон + выразительный персонаж + кинематографичная глубина' },
  { value: 'orange_pro', label: 'Orange Pro', hint: 'Как в твоем примере: оранжевые плашки и рамка' },
  { value: 'neon_blue', label: 'Neon Blue', hint: 'Неоновый синий кибер-стиль' },
  { value: 'dark_market', label: 'Dark Market', hint: 'Темный агрессивный маркетплейс стиль' },
  { value: 'chrome_impact', label: 'Chrome Impact', hint: 'Металлик/хром + объемный текст и тень' },
  { value: 'glitch_magenta', label: 'Glitch Magenta', hint: 'Глитч и RGB-смещение в фиолетово-розовой палитре' },
  { value: 'retro_comic', label: 'Retro Comic', hint: 'Комикс-стиль с толстой обводкой и взрывной подачей' },
  { value: 'ultra_gold', label: 'Ultra Gold', hint: 'Премиальный золотой стиль с ярким свечением' },
  { value: 'ice_frost', label: 'Ice Frost', hint: 'Ледяной синий стиль с кристальным текстом' },
  { value: 'toxic_acid', label: 'Toxic Acid', hint: 'Кислотный зелёный стрит-стиль, дерзкий контраст' },
];

const STATUS_LABELS: Record<PlayerokStatus, string> = {
  new: 'Новая',
  hot: 'Хит',
  discount: 'Скидка',
};

const STATUS_BADGE_CLASSES: Record<PlayerokStatus, string> = {
  new: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  hot: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  discount: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

function formatRub(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

export function PlayerokTab() {
  const { user, userData, refreshUserData, loading: authLoading } = useAuth();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PlayerokCategory>('accounts');
  const [style, setStyle] = useState<PlayerokBannerStyle>('orange_pro');
  const [topText, setTopText] = useState('CLAUDE AI');
  const [middleText, setMiddleText] = useState('1 МЕСЯЦ');
  const [bottomText, setBottomText] = useState('ПОДПИСКА PRO');
  const [accentText, setAccentText] = useState('✶');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlayerokStatus>('all');
  const [sortMode, setSortMode] = useState<SortMode>('relevance');

  const [cards, setCards] = useState<PlayerokCard[]>([]);
  const [savedCards, setSavedCards] = useState<SavedPlayerokCard[]>([]);
  const [savedView, setSavedView] = useState<'recent' | 'all'>('recent');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [isSmartFilling, setIsSmartFilling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterComputeMs, setFilterComputeMs] = useState(0);
  const hasProAccess = !!userData?.subscription?.plan && ['pro', 'unlimited'].includes(userData.subscription.plan);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as SavedPlayerokCard[];
      if (Array.isArray(parsed)) {
        setSavedCards(parsed);
      }
    } catch (error) {
      console.warn('Failed to load saved Playerok cards:', error);
    }
  }, []);

  useEffect(() => {
    const loadSavedFromServer = async () => {
      if (!user || !hasProAccess) {
        return;
      }

      setLoadingSaved(true);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/playerok/generate', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = (await response.json()) as { items?: PlayerokCard[] };
        if (!response.ok) {
          return;
        }
        const restored = payload.items ?? [];
        if (restored.length > 0) {
          setCards(restored);
        }
      } catch (error) {
        console.warn('Failed to load saved Playerok cards from server:', error);
      } finally {
        setLoadingSaved(false);
      }
    };

    void loadSavedFromServer();
  }, [hasProAccess, user]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
  }, [savedCards]);

  const saveGeneratedCard = (card: PlayerokCard) => {
    const savedCard: SavedPlayerokCard = {
      ...card,
      savedAt: new Date().toISOString(),
    };

    setSavedCards((current) => [savedCard, ...current].slice(0, 30));
  };

  const handleSmartFill = async () => {
    if (!productName.trim()) {
      setErrorMessage('Сначала введите название/заголовок товара для Smart Fill.');
      return;
    }

    setIsSmartFilling(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/playerok/smart-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
      });
      const payload = (await response.json()) as {
        data?: { category?: PlayerokCategory; description?: string };
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Ошибка Smart Fill');
      }

      if (payload.data?.category) {
        setCategory(payload.data.category);
      }
      if (payload.data?.description) {
        setDescription(payload.data.description);
      }
    } catch (error) {
      console.error('Playerok smart fill error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Ошибка Smart Fill');
    } finally {
      setIsSmartFilling(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      setErrorMessage('Войдите в аккаунт для генерации карточки.');
      return;
    }
    if (!hasProAccess) {
      setErrorMessage('Генерация доступна только с подписки Pro и выше.');
      return;
    }
    if (!productName.trim()) {
      setErrorMessage('Введите заголовок/название для генерации карточек.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/playerok/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName,
          description,
          category,
          count: 1,
          style,
          topText,
          middleText,
          bottomText,
          accentText,
        }),
      });

      const payload = (await response.json()) as { items?: PlayerokCard[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Ошибка генерации');
      }

      const generated = payload.items ?? [];
      setCards(generated);
      if (generated[0]) {
        saveGeneratedCard(generated[0]);
      }
      await refreshUserData();
    } catch (error) {
      console.error('Playerok generation error:', error);
      setCards([]);
      setErrorMessage(error instanceof Error ? error.message : 'Ошибка генерации карточек');
    } finally {
      setLoading(false);
    }
  };

  const visibleCards = useMemo(() => {
    const startedAt = performance.now();
    const q = search.trim().toLowerCase();
    let result = cards.filter((card) => {
      if (statusFilter !== 'all' && card.status !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return `${card.title} ${card.description}`.toLowerCase().includes(q);
    });

    result = [...result];
    if (sortMode === 'price_asc') {
      result.sort((a, b) => a.priceRub - b.priceRub);
    } else if (sortMode === 'price_desc') {
      result.sort((a, b) => b.priceRub - a.priceRub);
    } else if (sortMode === 'new_first') {
      const rank: Record<PlayerokStatus, number> = { new: 0, hot: 1, discount: 2 };
      result.sort((a, b) => rank[a.status] - rank[b.status]);
    }

    setFilterComputeMs(Number((performance.now() - startedAt).toFixed(1)));
    return result;
  }, [cards, search, sortMode, statusFilter]);

  const visibleSavedCards = useMemo(() => {
    if (savedView === 'recent') {
      return savedCards.slice(0, 5);
    }
    return savedCards;
  }, [savedCards, savedView]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {!authLoading && !user && (
        <Card className="mb-6 p-8 text-center">
          <p className="text-lg font-semibold text-[var(--text-primary)]">Нужен вход в аккаунт</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Войдите, чтобы генерировать и сохранять карточки Playerok.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Перейти ко входу</Button>
          </Link>
        </Card>
      )}

      {!authLoading && user && !hasProAccess && (
        <Card className="mb-6 p-8 text-center">
          <p className="text-lg font-semibold text-[var(--text-primary)]">Доступ с подписки Pro</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Для Playerok генерации требуется Pro или Unlimited. Списывается 1 кредит за генерацию.
          </p>
          <Link href="/pricing" className="mt-4 inline-block">
            <Button>Открыть тарифы</Button>
          </Link>
        </Card>
      )}

      {previewImageUrl && (
        <ImageModal imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      )}

      <div className="mb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться на главную
        </Link>

        <div className="rounded-3xl border border-[var(--border-default)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-surface))] p-6 sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Playerok</span> Генератор карточек
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--text-secondary)] sm:text-base">
            Режим как в WB: задайте параметры товара, сгенерируйте карточку и сразу работайте с результатом через поиск, фильтры и сортировку.
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Важно: для максимального совпадения с референсом задайте свои тексты в блоках ниже.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Параметры генерации</h2>
          <div className="relative">
            <Input
              label="Заголовок карточек"
              placeholder="Например: Аккаунт CS2 Prime с инвентарем"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
            />
            <button
              type="button"
              onClick={handleSmartFill}
              disabled={isSmartFilling || !productName.trim()}
              className="absolute right-2 top-8 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:border-amber-300/50 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSmartFilling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isSmartFilling ? 'Заполняю...' : 'Smart Fill'}
            </button>
          </div>
          <Textarea
            label="Описание"
            placeholder="Коротко опишите предложение, преимущества, условия..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-[120px]"
          />
          <div className="grid grid-cols-1 gap-4">
            <Select
              label="Категория"
              value={category}
              onChange={(event) => setCategory(event.target.value as PlayerokCategory)}
              options={CATEGORY_OPTIONS}
            />
            <Select
              label="Стиль карточки"
              value={style}
              onChange={(event) => setStyle(event.target.value as PlayerokBannerStyle)}
              options={STYLE_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
            />
            <p className="text-xs text-[var(--text-muted)]">
              {STYLE_OPTIONS.find((item) => item.value === style)?.hint}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Текст сверху"
              value={topText}
              onChange={(event) => setTopText(event.target.value.toUpperCase())}
              placeholder="CLAUDE AI"
            />
            <Input
              label="Текст центра (крупно)"
              value={middleText}
              onChange={(event) => setMiddleText(event.target.value.toUpperCase())}
              placeholder="1 МЕСЯЦ"
            />
            <Input
              label="Текст снизу"
              value={bottomText}
              onChange={(event) => setBottomText(event.target.value.toUpperCase())}
              placeholder="ПОДПИСКА PRO"
            />
            <Input
              label="Акцент справа"
              value={accentText}
              onChange={(event) => setAccentText(event.target.value)}
              placeholder="✶"
            />
          </div>
          <Button
            onClick={handleGenerate}
            loading={loading}
            disabled={!user || !hasProAccess}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Генерирую...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Сгенерировать карточку
              </>
            )}
          </Button>

          {!!errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Ошибка</span>
              </div>
              <p className="mt-2 text-sm text-red-100/90">{errorMessage}</p>
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Фильтры результата</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-[41px] h-4 w-4 text-[var(--text-muted)]" />
            <Input
              label="Поиск"
              placeholder="Ищите в сгенерированных карточках..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Статус"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | PlayerokStatus)}
              options={[
                { value: 'all', label: 'Все статусы' },
                { value: 'new', label: 'Новые' },
                { value: 'hot', label: 'Хиты' },
                { value: 'discount', label: 'Скидки' },
              ]}
            />
            <Select
              label="Сортировка"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              options={[
                { value: 'relevance', label: 'По релевантности' },
                { value: 'price_asc', label: 'Цена по возрастанию' },
                { value: 'price_desc', label: 'Цена по убыванию' },
                { value: 'new_first', label: 'Сначала новые' },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] px-2.5 py-1">
              <Filter className="h-3.5 w-3.5" />
              Всего сгенерировано: {cards.length}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] px-2.5 py-1">
              Показано: {visibleCards.length}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] px-2.5 py-1">
              Фильтрация: {filterComputeMs} ms
            </span>
          </div>
        </Card>
      </div>

      {loading && (
        <div className="mt-6">
          <LoadingBuilderGame />
        </div>
      )}

      {!loading && cards.length === 0 && !errorMessage && (
        <Card className="mt-6 p-10 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">
            {loadingSaved ? 'Загружаю сохраненные карточки...' : 'Пока нет сгенерированных карточек'}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {loadingSaved
              ? 'Проверяю сохранения из аккаунта.'
              : 'Заполните параметры и нажмите «Сгенерировать карточку». Карточка сохранится в вашем аккаунте.'}
          </p>
        </Card>
      )}

      {!loading && cards.length > 0 && visibleCards.length === 0 && (
        <Card className="mt-6 p-10 text-center">
          <Search className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">Ничего не найдено по фильтрам</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Измените параметры поиска или статус.</p>
          <div className="mt-5">
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setSortMode('relevance');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </Card>
      )}

      {!loading && visibleCards.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleCards.map((card) => (
            <Card key={card.id} className="flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <div
                  className={cn(
                    'absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold',
                    STATUS_BADGE_CLASSES[card.status]
                  )}
                >
                  {STATUS_LABELS[card.status]}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-[var(--text-primary)]">{card.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--text-secondary)]">{card.description}</p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                    {CATEGORY_OPTIONS.find((item) => item.value === card.category)?.label ?? card.category}
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">{formatRub(card.priceRub)}</span>
                </div>

                <a
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--accent)]/40 px-3 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-glow)]"
                >
                  Открыть изображение
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setPreviewImageUrl(card.imageUrl)}
                >
                  <Eye className="h-4 w-4" />
                  Предпросмотр
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {savedCards.length > 0 && (
        <Card className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Сохраненные карточки ({savedCards.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-1">
                <button
                  type="button"
                  onClick={() => setSavedView('recent')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    savedView === 'recent'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Последние 5
                </button>
                <button
                  type="button"
                  onClick={() => setSavedView('all')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    savedView === 'all'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Все
                </button>
              </div>
              <Button variant="ghost" onClick={() => setSavedCards([])}>
                <Trash2 className="h-4 w-4" />
                Очистить
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleSavedCards.map((card) => (
              <div
                key={`${card.id}-${card.savedAt}`}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="h-40 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="mt-3 line-clamp-2 font-medium text-[var(--text-primary)]">{card.title}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Сохранено: {new Date(card.savedAt).toLocaleString('ru-RU')}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setPreviewImageUrl(card.imageUrl)}
                  >
                    <Eye className="h-4 w-4" />
                    Просмотр
                  </Button>
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--accent)]/40 px-3 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-glow)]"
                  >
                    Ссылка
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
