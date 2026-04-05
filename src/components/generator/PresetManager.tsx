'use client';
import { useState } from 'react';
import { Save, Bookmark, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { getPresets, savePreset, deletePreset, type Preset } from '@/lib/presets';
import type { DetailedFields } from '@/types';

interface PresetManagerProps {
  currentConfig: {
    generalDescription?: string;
    details: DetailedFields;
    imageSize?: string;
    generationType?: 'text-to-image' | 'image-to-image';
    apiProvider?: 'default' | 'puter' | 'bytez' | 'huggingface';
    bytezModel?: string;
    huggingfaceModel?: string;
    puterModel?: string;
    puterQuality?: string;
  };
  onApplyPreset: (preset: Preset) => void;
}

export function PresetManager({ currentConfig, onApplyPreset }: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(getPresets());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [saving, setSaving] = useState(false);

  function handleSavePreset() {
    if (!presetName.trim()) return;

    setSaving(true);
    try {
      const newPreset = savePreset({
        name: presetName.trim(),
        description: presetDescription.trim() || undefined,
        config: currentConfig,
      });

      setPresets(getPresets());
      setShowSaveDialog(false);
      setPresetName('');
      setPresetDescription('');
    } finally {
      setSaving(false);
    }
  }

  function handleDeletePreset(id: string) {
    if (id.startsWith('default-')) {
      // Не удаляем дефолтные пресеты
      return;
    }
    deletePreset(id);
    setPresets(getPresets());
  }

  function handleApplyPreset(preset: Preset) {
    onApplyPreset(preset);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[var(--accent)]" />
            Пресеты настроек
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Сохраняйте и применяйте свои любимые настройки
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Сохранить текущие
        </Button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              Сохранить пресет
            </h4>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Input
            label="Название пресета"
            placeholder="например: Моя кликбейт миниатюра"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />

          <Textarea
            label="Описание (опционально)"
            placeholder="Краткое описание этого пресета..."
            value={presetDescription}
            onChange={(e) => setPresetDescription(e.target.value)}
            className="min-h-[60px]"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSavePreset}
              loading={saving}
              disabled={!presetName.trim()}
              className="flex-1"
            >
              <Check className="w-4 h-4" />
              Сохранить
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSaveDialog(false)}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-3 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {preset.name}
                </h4>
                {preset.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {preset.description}
                  </p>
                )}
              </div>
              {!preset.id.startsWith('default-') && (
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Preset Info */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {preset.config.apiProvider && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]">
                  {preset.config.apiProvider === 'bytez' && '🔥 Bytez'}
                  {preset.config.apiProvider === 'huggingface' && '🤗 HuggingFace'}
                  {preset.config.apiProvider === 'puter' && '⚡ Puter'}
                  {preset.config.apiProvider === 'default' && '🧪 Mock'}
                </span>
              )}
              {preset.config.imageSize && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]">
                  {preset.config.imageSize}
                </span>
              )}
              {preset.config.details.style && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]">
                  {preset.config.details.style}
                </span>
              )}
            </div>

            <Button
              size="xs"
              onClick={() => handleApplyPreset(preset)}
              className="w-full"
            >
              Применить
            </Button>
          </div>
        ))}
      </div>

      {presets.length === 0 && (
        <div className="text-center py-8 text-[var(--text-muted)] text-sm">
          Нет сохранённых пресетов. Создайте свой первый пресет!
        </div>
      )}
    </div>
  );
}
