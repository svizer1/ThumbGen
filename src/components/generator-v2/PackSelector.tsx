'use client';

import { useState, useMemo } from 'react';
import { YouTubePack, getAllPacks, getAllCategories } from '@/lib/youtube-packs';
import { PackPreview } from './PackPreview';
import { Crown, Filter, Search, Sparkles, Wand2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PackSelectorProps {
  onSelectPack: (pack: YouTubePack) => void;
}

export function PackSelector({ onSelectPack }: PackSelectorProps) {
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allPacks = getAllPacks();
  const categories = getAllCategories();
  const premiumCount = allPacks.filter((pack) => pack.tier === 'premium').length;
  const freeCount = allPacks.length - premiumCount;

  // Check if user has access to Pro features
  const hasProAccess = userData?.subscription.plan === 'pro' || userData?.subscription.plan === 'unlimited';

  // Filter packs
  const filteredPacks = useMemo(() => {
    let packs = allPacks;

    // Filter by category
    if (selectedCategory !== 'all') {
      packs = packs.filter(pack => pack.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      packs = packs.filter(pack =>
        pack.name.toLowerCase().includes(query) ||
        pack.description.toLowerCase().includes(query)
      );
    }

    return packs;
  }, [allPacks, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-surface))] p-6 sm:p-8 animate-fadeInUp">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              Библиотека паков
            </div>
            <div>
              <h2 className="font-display text-4xl leading-tight text-[var(--text-primary)] sm:text-5xl">
                Обложки, стили и готовые идеи для сильных миниатюр
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                Подбирайте готовые визуальные концепции, красивые текстовые акценты и стильные обложки без ручной настройки каждой детали.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Всего паков</p>
              <p className="mt-2 font-display text-4xl text-[var(--text-primary)]">{allPacks.length}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Premium</p>
              <p className="mt-2 font-display text-4xl text-[var(--text-primary)]">{premiumCount}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Free</p>
              <p className="mt-2 font-display text-4xl text-[var(--text-primary)]">{freeCount}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Категорий</p>
              <p className="mt-2 font-display text-4xl text-[var(--text-primary)]">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:p-5 animate-fadeInUp stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Поиск паков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] py-3 pl-10 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-w-[220px] cursor-pointer appearance-none rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] py-3 pl-10 pr-8 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          <Wand2 className="h-4 w-4 text-[var(--accent)]" />
          Найдено {filteredPacks.length}
        </div>
      </div>

      {!hasProAccess && (
        <div className="rounded-[28px] border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-5 animate-fadeInUp stagger-2">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl text-[var(--text-primary)]">
                Откройте все визуальные пакы через Pro
              </h3>
              <p className="mb-3 mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                В Pro доступны самые сильные концепты, премиальные обложки и более выразительные стили миниатюр.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Перейти на Pro
              </a>
            </div>
          </div>
        </div>
      )}

      {filteredPacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacks.map((pack, i) => (
            <div key={pack.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s` }}>
              <PackPreview
                pack={pack}
                onSelect={onSelectPack}
                isLocked={!hasProAccess}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)] text-lg">
            Паки не найдены. Попробуйте изменить фильтры.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1.5 text-sm text-[var(--text-secondary)]">
          Показано {filteredPacks.length} из {allPacks.length}
        </span>
        <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1.5 text-sm text-[var(--text-secondary)]">
          {selectedCategory === 'all' ? 'Все категории' : selectedCategory}
        </span>
        <span
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm',
            hasProAccess
              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
          )}
        >
          {hasProAccess ? 'Pro доступ активен' : 'Часть паков заблокирована'}
        </span>
      </div>
    </div>
  );
}
