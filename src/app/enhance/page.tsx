'use client';

import { useState } from 'react';
import { Upload, Wand2, Sparkles, Download, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { EnhancementType } from '@/lib/image-enhancer';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
}

export default function EnhancePage() {
  const { user, userData } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementType[]>([]);
  const [upscaleLevel, setUpscaleLevel] = useState<'2x' | '4x' | '8x'>('2x');
  const [isProcessing, setIsProcessing] = useState(false);

  // Check subscription access
  const hasAccess = userData?.subscription.plan && ['starter', 'pro', 'unlimited'].includes(userData.subscription.plan);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('Поддерживаются PNG, JPG, WebP, GIF и AVIF');
        e.target.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('Размер файла не должен превышать 15 MB');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEnhancement = (enhancement: EnhancementType) => {
    setSelectedEnhancements(prev => {
      if (prev.includes(enhancement)) {
        return prev.filter(e => e !== enhancement);
      } else {
        return [...prev, enhancement];
      }
    });
  };

  const handleEnhance = async () => {
    if (!imageFile || selectedEnhancements.length === 0) {
      toast.error('Выберите изображение и хотя бы одно улучшение');
      return;
    }

    if (!user) {
      toast.error('Войдите в систему');
      return;
    }

    setIsProcessing(true);

    try {
      // Upload image first
      const formData = new FormData();
      formData.append('files', imageFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const { urls } = await uploadRes.json();
      const imageUrl = urls[0];

      // Enhance image
      const token = await user.getIdToken();
      const enhanceRes = await fetch('/api/enhance-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl,
          enhancements: selectedEnhancements,
          upscaleLevel: selectedEnhancements.includes('upscale') ? upscaleLevel : undefined,
        }),
      });

      if (!enhanceRes.ok) {
        const error = await enhanceRes.json();
        throw new Error(error.error || 'Enhancement failed');
      }

      const result = await enhanceRes.json();
      setEnhancedImage(result.enhancedUrl);
      
      toast.success(`Изображение улучшено! Осталось ${result.creditsRemaining} кредитов`);
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка улучшения');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `enhanced-${Date.now()}.png`;
      link.click();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Wand2 className="w-10 h-10 text-[var(--text-primary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Улучшение Изображений
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Войдите в систему для доступа к AI улучшению изображений
          </p>
          <Link href="/">
            <Button size="lg" className="w-full">
              Войти
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Требуется Подписка
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Улучшение изображений доступно с подпиской Starter и выше
          </p>
          <Link href="/pricing">
            <Button size="lg" className="w-full">
              Выбрать План
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          <span className="gradient-text">Улучшение Изображений</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg">
          AI-powered улучшение качества, upscaling, face enhancement и удаление фона
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Загрузить Изображение
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    PNG поддерживается полноценно, включая прозрачность после удаления фона
                  </p>
                </div>
                <div className="rounded-full border border-[var(--border-default)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  До 15 MB
                </div>
              </div>
              
              {!imagePreview ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-12 text-center hover:border-[var(--accent)] transition-colors">
                    <Upload className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--text-primary)] font-medium mb-2">
                      Нажмите для загрузки
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      PNG, JPG, WebP, GIF, AVIF до 15MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
                    <div className="img-checkerboard overflow-hidden rounded-lg">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full rounded-lg"
                      />
                    </div>
                  </div>
                  {imageFile && (
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[var(--border-default)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        Формат: {imageFile.type.replace('image/', '').toUpperCase()}
                      </span>
                      <span className="rounded-full border border-[var(--border-default)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        Размер: {formatFileSize(imageFile.size)}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setEnhancedImage(null);
                    }}
                    className="w-full"
                  >
                    Загрузить другое изображение
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {imagePreview && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Выберите Улучшения
                </h2>

                <div className="space-y-3">
                  <label className={cn(
                    'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedEnhancements.includes('upscale')
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-default)] hover:border-[var(--accent)]'
                  )}>
                    <input
                      type="checkbox"
                      checked={selectedEnhancements.includes('upscale')}
                      onChange={() => toggleEnhancement('upscale')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        🔍 Upscaling (Увеличение разрешения)
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Увеличение до 4K/8K с сохранением деталей
                      </p>
                      {selectedEnhancements.includes('upscale') && (
                        <div className="mt-3 flex gap-2">
                          {(['2x', '4x', '8x'] as const).map(level => (
                            <button
                              key={level}
                              onClick={(e) => {
                                e.preventDefault();
                                setUpscaleLevel(level);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                upscaleLevel === level
                                  ? 'bg-[var(--accent)] text-white'
                                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>

                  <label className={cn(
                    'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedEnhancements.includes('face-enhance')
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-default)] hover:border-[var(--accent)]'
                  )}>
                    <input
                      type="checkbox"
                      checked={selectedEnhancements.includes('face-enhance')}
                      onChange={() => toggleEnhancement('face-enhance')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        😊 Face Enhancement (Улучшение лиц)
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Улучшение портретов, кожи, глаз и деталей лица
                      </p>
                    </div>
                  </label>

                  <label className={cn(
                    'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedEnhancements.includes('background-remove')
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-default)] hover:border-[var(--accent)]'
                  )}>
                    <input
                      type="checkbox"
                      checked={selectedEnhancements.includes('background-remove')}
                      onChange={() => toggleEnhancement('background-remove')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        🎨 Background Removal (Удаление фона)
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Автоматическое удаление фона с изображения
                      </p>
                    </div>
                  </label>

                  <label className={cn(
                    'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedEnhancements.includes('quality-enhance')
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-default)] hover:border-[var(--accent)]'
                  )}>
                    <input
                      type="checkbox"
                      checked={selectedEnhancements.includes('quality-enhance')}
                      onChange={() => toggleEnhancement('quality-enhance')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        ✨ Quality Enhancement (Улучшение качества)
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Шумоподавление, резкость, цветокоррекция
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Выбрано улучшений: {selectedEnhancements.length}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    После обработки вкладка покажет готовый результат и сохранит PNG без потери прозрачности там, где это поддерживает модель.
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6"
                  onClick={handleEnhance}
                  disabled={isProcessing || selectedEnhancements.length === 0}
                  loading={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Улучшить Изображение (1 кредит)
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Результат
              </h2>

              {!enhancedImage ? (
                <div className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-12 text-center">
                  <Wand2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">
                    Результат появится здесь после обработки
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">До</p>
                      <div className="img-checkerboard overflow-hidden rounded-lg border border-[var(--border-default)]">
                        <img
                          src={imagePreview || ''}
                          alt="Original"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">После</p>
                      <div className="img-checkerboard overflow-hidden rounded-lg border border-[var(--border-default)]">
                        <img
                          src={enhancedImage}
                          alt="Enhanced"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5" />
                    Скачать Результат
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
