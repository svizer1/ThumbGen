'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Download, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SpendingTransaction {
  id: string;
  timestamp: Date;
  model: string;
  source: string;
  tokens: number;
  duration: number;
  spent: number;
  currency: 'credits' | 'dollars';
  requestId: string;
  status: 'success' | 'failed';
}

type SortField = 'timestamp' | 'model' | 'source' | 'duration' | 'spent';
type SortDirection = 'asc' | 'desc';

export function SpendingTable() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<SpendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterSource, setFilterSource] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(db, 'users', user.uid, 'spending_history');
        const q = query(transactionsRef, orderBy('timestamp', 'desc'), limit(100));
        const snapshot = await getDocs(q);

        const data: SpendingTransaction[] = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            timestamp: docData.timestamp?.toDate() || new Date(),
            model: docData.model || 'unknown',
            source: docData.source || 'unknown',
            tokens: docData.tokens || 0,
            duration: docData.duration || 0,
            spent: docData.spent || 0,
            currency: docData.currency || 'credits',
            requestId: docData.requestId || doc.id,
            status: docData.status || 'success',
          };
        });

        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'timestamp') {
      aVal = a.timestamp.getTime();
      bVal = b.timestamp.getTime();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const filteredTransactions = filterSource === 'all' 
    ? sortedTransactions 
    : sortedTransactions.filter(t => t.source === filterSource);

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.spent, 0);
  const avgDuration = filteredTransactions.length > 0
    ? filteredTransactions.reduce((sum, t) => sum + t.duration, 0) / filteredTransactions.length
    : 0;

  const exportToCSV = () => {
    const headers = ['Time', 'Model', 'Source', 'Tokens', 'Duration (ms)', 'Spent', 'Currency', 'Request ID', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.timestamp.toISOString(),
      t.model,
      t.source,
      t.tokens,
      t.duration,
      t.spent,
      t.currency,
      t.requestId,
      t.status,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spending-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-muted)]">Нет истории трат</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeInUp">
      {/* Header with filters and export */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-200"
          >
            <option value="all">Все источники</option>
            <option value="bytez">Bytez</option>
            <option value="huggingface">Hugging Face</option>
            <option value="puter">Puter</option>
          </select>
        </div>

        <Button size="sm" variant="outline" onClick={exportToCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Экспорт CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
        <table className="w-full">
          <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
                onClick={() => handleSort('timestamp')}
              >
                Время <SortIcon field="timestamp" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
                onClick={() => handleSort('model')}
              >
                Модель <SortIcon field="model" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
                onClick={() => handleSort('source')}
              >
                Источник <SortIcon field="source" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Токены
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
                onClick={() => handleSort('duration')}
              >
                Длительность <SortIcon field="duration" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
                onClick={() => handleSort('spent')}
              >
                Потрачено <SortIcon field="spent" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Request ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-subtle)]">
            {filteredTransactions.map((transaction, index) => (
              <tr 
                key={transaction.id}
                className={`hover:bg-[var(--bg-surface)] transition-all duration-300 hover:shadow-md animate-fadeIn stagger-${(index % 8) + 1}`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                  {transaction.timestamp.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                  <span className="font-mono text-xs bg-[var(--bg-elevated)] px-2 py-1 rounded">
                    {transaction.model.split('/').pop()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.source === 'bytez' ? 'bg-orange-950/30 text-orange-300 border border-orange-700/30' :
                    transaction.source === 'huggingface' ? 'bg-yellow-950/30 text-yellow-300 border border-yellow-700/30' :
                    transaction.source === 'puter' ? 'bg-blue-950/30 text-blue-300 border border-blue-700/30' :
                    'bg-gray-950/30 text-gray-300 border border-gray-700/30'
                  }`}>
                    {transaction.source}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {transaction.tokens || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {(transaction.duration / 1000).toFixed(2)}s
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span className="text-[var(--accent)]">
                    {transaction.spent} {transaction.spent === 1 ? 'кредит' : 'кредитов'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-muted)] font-mono">
                  {transaction.requestId.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-4 animate-scaleIn stagger-1 hover:border-[var(--border-strong)] transition-all duration-200">
          <p className="text-xs text-[var(--text-muted)] mb-1">Всего генераций</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {filteredTransactions.length}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-4 animate-scaleIn stagger-2 hover:border-[var(--border-strong)] transition-all duration-200">
          <p className="text-xs text-[var(--text-muted)] mb-1">Всего потрачено</p>
          <p className="text-2xl font-bold text-[var(--accent)]">
            {totalSpent} {totalSpent === 1 ? 'кредит' : 'кредитов'}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-4 animate-scaleIn stagger-3 hover:border-[var(--border-strong)] transition-all duration-200">
          <p className="text-xs text-[var(--text-muted)] mb-1">Среднее время</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {(avgDuration / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-4 animate-scaleIn stagger-4 hover:border-[var(--border-strong)] transition-all duration-200">
          <p className="text-xs text-[var(--text-muted)] mb-1">Средняя затрата</p>
          <p className="text-2xl font-bold text-purple-400">
            {filteredTransactions.length > 0 ? (totalSpent / filteredTransactions.length).toFixed(2) : '0'} кр/ген
          </p>
        </div>
      </div>
    </div>
  );
}
