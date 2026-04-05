'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Star, TrendingUp } from 'lucide-react';

export function FavoriteModel() {
  const { userData } = useAuth();

  if (!userData) return null;

  const modelUsage = userData.modelUsage || {};
  const favoriteModel = userData.favoriteModel;

  // Get top 3 models
  const topModels = Object.entries(modelUsage)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3);

  const totalGenerations = Object.values(modelUsage).reduce((sum, count) => sum + (count as number), 0);

  const getModelDisplayName = (model: string) => {
    const parts = model.split('/');
    return parts[parts.length - 1];
  };

  const getModelColor = (index: number) => {
    const colors = [
      'bg-amber-950/30 text-amber-300 border-amber-700/30',
      'bg-gray-950/30 text-gray-300 border-gray-700/30',
      'bg-orange-950/30 text-orange-300 border-orange-700/30',
    ];
    return colors[index] || colors[2];
  };

  if (topModels.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Любимая модель
          </h3>
        </div>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] text-sm">
            Начните генерировать, чтобы увидеть статистику
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-[var(--accent)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Любимая модель
        </h3>
      </div>

      {/* Favorite Model Highlight */}
      {favoriteModel && (
        <div className="bg-gradient-to-br from-[var(--accent-glow)] to-transparent border-2 border-[var(--accent)] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Ваша любимая модель</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {getModelDisplayName(favoriteModel)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Использовано раз:</span>
            <span className="text-[var(--accent)] font-bold text-lg">
              {typeof modelUsage[favoriteModel] === 'number' ? modelUsage[favoriteModel] : 0}
            </span>
          </div>
        </div>
      )}

      {/* Top Models List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Топ моделей
        </p>
        {topModels.map(([model, count], index) => {
          const percentage = totalGenerations > 0 ? ((count as number) / totalGenerations) * 100 : 0;
          
          return (
            <div key={model} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${getModelColor(index)}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm text-[var(--text-primary)] font-medium">
                    {getModelDisplayName(model)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">
                    {typeof count === 'number' ? count : 0} раз
                  </span>
                  <span className="text-xs font-semibold text-[var(--accent)]">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Stats */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-muted)]">Всего генераций:</span>
          <span className="text-[var(--text-primary)] font-bold">{totalGenerations}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-[var(--text-muted)]">Моделей использовано:</span>
          <span className="text-[var(--text-primary)] font-bold">{Object.keys(modelUsage).length}</span>
        </div>
      </div>
    </div>
  );
}
