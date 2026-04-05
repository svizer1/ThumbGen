'use client';
import { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [autoEnhance, setAutoEnhance] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('auto-enhance') !== 'false';
  });

  const [saveHistory, setSaveHistory] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('save-history') !== 'false';
  });

  const [defaultProvider, setDefaultProvider] = useState(() => {
    if (typeof window === 'undefined') return 'bytez';
    return localStorage.getItem('default-provider') || 'bytez';
  });

  const [defaultSize, setDefaultSize] = useState(() => {
    if (typeof window === 'undefined') return '1920x1080';
    return localStorage.getItem('default-size') || '1920x1080';
  });

  function handleSave() {
    localStorage.setItem('auto-enhance', autoEnhance.toString());
    localStorage.setItem('save-history', saveHistory.toString());
    localStorage.setItem('default-provider', defaultProvider);
    localStorage.setItem('default-size', defaultSize);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Настройки
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Auto Enhance */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                Автоматическое улучшение промптов
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Автоматически улучшать промпты при генерации
              </p>
            </div>
            <button
              onClick={() => setAutoEnhance(!autoEnhance)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoEnhance ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoEnhance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Save History */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                Сохранять историю
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Автоматически сохранять все генерации в историю
              </p>
            </div>
            <button
              onClick={() => setSaveHistory(!saveHistory)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                saveHistory ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  saveHistory ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Provider */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
              Провайдер по умолчанию
            </h3>
            <select
              value={defaultProvider}
              onChange={(e) => setDefaultProvider(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="bytez">Bytez (Google Imagen, FLUX)</option>
              <option value="huggingface">Hugging Face (FLUX, SDXL)</option>
              <option value="puter">Puter.js (бесплатно)</option>
              <option value="default">Mock (тестовый)</option>
            </select>
          </div>

          {/* Default Size */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
              Размер по умолчанию
            </h3>
            <select
              value={defaultSize}
              onChange={(e) => setDefaultSize(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="512x512">512x512 (Маленький квадрат)</option>
              <option value="1024x1024">1024x1024 (Квадрат)</option>
              <option value="1024x576">1024x576 (Стандарт)</option>
              <option value="1280x720">1280x720 (HD)</option>
              <option value="1920x1080">1920x1080 (Full HD)</option>
              <option value="2560x1440">2560x1440 (2K)</option>
              <option value="3840x2160">3840x2160 (4K)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[var(--border-default)]">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Check className="w-4 h-4" />
            Сохранить
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Отмена
          </Button>
        </div>
      </Card>
    </div>
  );
}
