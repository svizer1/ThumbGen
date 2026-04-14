'use client';

import { YouTubePack } from '@/lib/youtube-packs';
import { ArrowUpRight, Crown, Flame, LockKeyhole, Sparkles, Stars } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface PackPreviewProps {
  pack: YouTubePack;
  onSelect: (pack: YouTubePack) => void;
  isLocked?: boolean;
}

const categoryStyles: Record<string, { shell: string; glow: string; chip: string }> = {
  gaming: {
    shell: 'from-emerald-500 via-cyan-500 to-blue-600',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.3),transparent_40%)]',
    chip: 'bg-emerald-400/15 border-emerald-300/25 text-emerald-50',
  },
  'extreme-sports': {
    shell: 'from-orange-500 via-rose-500 to-fuchsia-600',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.4),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.28),transparent_45%)]',
    chip: 'bg-orange-300/15 border-orange-200/20 text-orange-50',
  },
  technology: {
    shell: 'from-sky-500 via-indigo-500 to-violet-600',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.35),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.32),transparent_40%)]',
    chip: 'bg-sky-300/15 border-sky-200/20 text-sky-50',
  },
  business: {
    shell: 'from-amber-500 via-orange-500 to-red-500',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.35),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.25),transparent_42%)]',
    chip: 'bg-amber-300/15 border-amber-200/20 text-amber-50',
  },
  entertainment: {
    shell: 'from-fuchsia-500 via-pink-500 to-rose-500',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.35),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.26),transparent_42%)]',
    chip: 'bg-fuchsia-300/15 border-fuchsia-200/20 text-fuchsia-50',
  },
  vlog: {
    shell: 'from-yellow-400 via-orange-400 to-pink-500',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.38),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_42%)]',
    chip: 'bg-yellow-200/15 border-yellow-100/20 text-yellow-50',
  },
  design: {
    shell: 'from-slate-300 via-slate-500 to-slate-900',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.3),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.3),transparent_40%)]',
    chip: 'bg-white/10 border-white/20 text-white',
  },
  motivation: {
    shell: 'from-cyan-400 via-blue-500 to-indigo-700',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.35),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.32),transparent_42%)]',
    chip: 'bg-cyan-300/15 border-cyan-200/20 text-cyan-50',
  },
};

export function PackPreview({ pack, onSelect, isLocked = false }: PackPreviewProps) {
  const style = categoryStyles[pack.category] ?? {
    shell: 'from-violet-500 via-fuchsia-500 to-indigo-600',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.28),transparent_42%)]',
    chip: 'bg-white/10 border-white/20 text-white',
  };
  const headline = pack.config.details.thumbnailText || pack.name.toUpperCase();

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--bg-card),var(--bg-surface))] p-0 card-hover',
        isLocked ? 'opacity-80' : 'cursor-pointer'
      )}
      onClick={() => !isLocked && onSelect(pack)}
      hover={!isLocked}
    >
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/72 backdrop-blur-md">
          <div className="mb-3 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] p-4 shadow-lg shadow-[var(--accent-glow)]">
            <LockKeyhole className="h-8 w-8 text-white" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-3 text-center shadow-xl">
            <p className="text-sm font-bold tracking-wide text-white">Pro подписка</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Открывает все пакы
            </p>
          </div>
        </div>
      )}

      <div className={cn('relative aspect-video overflow-hidden bg-gradient-to-br', style.shell)}>
        <div className={cn('absolute inset-0', style.glow)} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%,rgba(2,6,23,0.52))]" />
        <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]', style.chip)}>
              {pack.tier === 'premium' ? 'Premium' : 'Free'}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
              {pack.category.replace('-', ' ')}
            </span>
          </div>
          {pack.popularity >= 90 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-lg">
              <Flame className="h-3 w-3 text-orange-500" />
              Hot
            </div>
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4 z-10">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-2xl leading-none tracking-wide text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:text-[1.85rem]">
                  {headline}
                </p>
                <p className="mt-2 max-w-[85%] text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                  {pack.config.details.style || pack.description}
                </p>
              </div>
              <div className="hidden h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:flex sm:items-center sm:justify-center">
                <Stars className="h-7 w-7 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="font-display text-2xl leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
            {pack.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
            {pack.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2.5">
            <p className="uppercase tracking-[0.2em] text-[var(--text-muted)]">Популярность</p>
            <p className="mt-1 flex items-center gap-1 font-semibold text-[var(--text-primary)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              {pack.popularity}%
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2.5">
            <p className="uppercase tracking-[0.2em] text-[var(--text-muted)]">Формат</p>
            <p className="mt-1 font-semibold text-[var(--text-primary)]">{pack.config.imageSize}</p>
          </div>
        </div>

        {!isLocked ? (
          <button className="inline-flex w-full items-center justify-between rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-glow)]/80">
            <span>Использовать пак</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="inline-flex w-full items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
            <span>Открывается в Pro</span>
            <Crown className="h-4 w-4 text-yellow-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
