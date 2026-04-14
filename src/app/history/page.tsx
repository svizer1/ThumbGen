'use client';

import Link from 'next/link';
import { ArrowLeft, History, RefreshCw } from 'lucide-react';
import { HistoryCard } from '@/components/history/HistoryCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HistoryEntry } from '@/types';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchHistory() {
    if (!user) {
      setLoadingHistory(false);
      return;
    }

    setRefreshing(true);
    try {
      const historyRef = collection(db, 'users', user.uid, 'generations');
      const q = query(historyRef, orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      const entries: HistoryEntry[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id || doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          mode: data.mode,
          input: data.input || { generalDescription: '', mode: data.mode || 'prompt' },
          result: data.result || {},
          playerokCard: data.playerokCard,
          status: data.status,
          error: data.error,
        };
      });
      
      setHistory(entries);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, [user]);

  if (loading || loadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-[var(--bg-card)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--border-default)]">
            <History className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Требуется авторизация</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Войдите в систему, чтобы увидеть историю генераций.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeIn">
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
            <p className="text-[var(--text-muted)] text-sm mt-0.5">{history.length} записей</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          loading={refreshing}
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </Button>
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
          {history.map((entry, i) => (
            <div key={entry.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <HistoryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
