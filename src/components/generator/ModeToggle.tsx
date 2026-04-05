'use client';
import { GenerationMode } from '@/types';
import { Wand2, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  value: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

const modes: { id: GenerationMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'prompt',
    label: 'Режим промпта',
    description: 'Получить готовый промпт для генерации',
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    id: 'api',
    label: 'Режим API',
    description: 'Сгенерировать изображение напрямую через AI',
    icon: <Image className="w-4 h-4" />,
  },
];

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={cn(
            'flex-1 flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150',
            value === mode.id
              ? 'border-[var(--accent)] bg-[var(--accent-glow)] glow-border'
              : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)]'
          )}
          aria-pressed={value === mode.id}
        >
          <div
            className={cn(
              'mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
              value === mode.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            )}
          >
            {mode.icon}
          </div>
          <div>
            <p
              className={cn(
                'text-sm font-semibold',
                value === mode.id ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
              )}
            >
              {mode.label}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{mode.description}</p>
          </div>
          {/* Radio dot */}
          <div className="ml-auto mt-1 shrink-0">
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2 transition-all',
                value === mode.id
                  ? 'border-[var(--accent)] bg-[var(--accent)]'
                  : 'border-[var(--border-strong)] bg-transparent'
              )}
            >
              {value === mode.id && (
                <div className="w-full h-full rounded-full bg-white scale-[0.4] block" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}