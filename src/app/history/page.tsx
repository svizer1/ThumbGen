import Link from 'next/link';
import { ArrowLeft, History } from 'lucide-react';
import { getHistory } from '@/lib/history-store';
import { HistoryCard } from '@/components/history/HistoryCard';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
              <History className="w-6 h-6 text-[var(--accent)]" />
              История генераций
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">{history.length} записей сохранено локально</p>
          </div>
        </div>

        {history.length > 0 && (
          <form
            action={async () => {
              'use server';
              // Clear via API is handled client-side; this is just a UI hint
            }}
          >
            <Link
              href="/history"
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors px-3 py-1.5 border border-red-500/20 rounded-lg hover:bg-red-500/10"
            >
              Очистить всё
            </Link>
          </form>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-[var(--bg-card)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--border-default)]">
            <History className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">История пуста</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Создайте свою первую миниатюру, чтобы увидеть её здесь.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Начать генерацию
          </Link>
        </div>
      )}

      {/* Grid */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {history.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}