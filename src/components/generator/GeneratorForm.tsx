'use client';
import { useState, useCallback } from 'react';
import { Zap, AlertCircle, Sparkles, Settings, Save } from 'lucide-react';
import type { DetailedFields, GenerationMode, GenerateApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CharacterUpload } from './CharacterUpload';
import { SourceUpload } from './SourceUpload';
import { ReferenceUpload } from './ReferenceUpload';
import { DetailedControls } from './DetailedControls';
import { ModeToggle } from './ModeToggle';
import { PromptResult } from './PromptResult';
import { ApiResult } from './ApiResult';
import { PresetManager } from './PresetManager';
import { SettingsPanel } from './SettingsPanel';
import { PUTER_MODELS, PUTER_QUALITY_OPTIONS } from '@/lib/providers/puter';
import { BYTEZ_MODELS } from '@/lib/providers/bytez';
import { HUGGINGFACE_MODELS } from '@/lib/providers/huggingface';
import { usePuterGeneration } from '@/hooks/usePuterGeneration';
import { smartEnhancePrompt, enhancePromptWithAI } from '@/lib/prompt-enhancer';
import { savePreset } from '@/lib/presets';
import type { Preset } from '@/lib/presets';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
 
 const EMPTY_DETAILS: DetailedFields = { 
   face: '', 
   emotion: '', 
   objects: '', 
   background: '', 
   colors: '', 
   thumbnailText: '', 
   composition: '', 
   style: '', 
   extraDetails: '', 
 }; 
 
export function GeneratorForm() {
  const { user, userData, refreshUserData } = useAuth();
  // ── Form state ────────────────────────────────────────────────────────────
  const [characterFile, setCharacterFile] = useState<File | null>(null);
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [generalDescription, setGeneralDescription] = useState('');
  const [details, setDetails] = useState<DetailedFields>(EMPTY_DETAILS);
  const [mode, setMode] = useState<GenerationMode>('prompt');
  const [apiProvider, setApiProvider] = useState<'default' | 'puter' | 'bytez' | 'huggingface'>('bytez');
  const [puterModel, setPuterModel] = useState('gpt-image-1');
  const [puterQuality, setPuterQuality] = useState<string>('low');
  const [bytezModel, setBytezModel] = useState('google/gemini-3.1-flash-image-preview');
  const [huggingfaceModel, setHuggingfaceModel] = useState('black-forest-labs/FLUX.1-dev');
  const [imageSize, setImageSize] = useState<string>('1920x1080');
  const [generationType, setGenerationType] = useState<'text-to-image' | 'image-to-image'>('text-to-image');
  const [showSettings, setShowSettings] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [referenceDescription, setReferenceDescription] = useState('');

  // ── Puter.js hook ────────────────────────────────────────────────────────
  const { generateImage: generateWithPuter } = usePuterGeneration();

  // Размеры изображений
  const imageSizes = [
    { value: '512x512', label: '512x512 (Маленький квадрат)' },
    { value: '1024x1024', label: '1024x1024 (Квадрат)' },
    { value: '1024x576', label: '1024x576 (Стандарт)' },
    { value: '1280x720', label: '1280x720 (HD)' },
    { value: '1920x1080', label: '1920x1080 (Full HD)' },
    { value: '2560x1440', label: '2560x1440 (2K)' },
    { value: '3840x2160', label: '3840x2160 (4K)' },
  ];
 
   // ── Generation state ─────────────────────────────────────────────────────── 
   const [isLoading, setIsLoading] = useState(false); 
   const [result, setResult] = useState<GenerateApiResponse | null>(null); 
   const [globalError, setGlobalError] = useState<string | null>(null); 
 
   // ── Validation ───────────────────────────────────────────────────────────── 
   const [validationError, setValidationError] = useState<string | null>(null); 
 
  function validate(): boolean {
    if (
      !generalDescription.trim() &&
      Object.values(details).every((v) => !v.trim())
    ) {
      setValidationError(
        'Пожалуйста, введите общее описание или заполните хотя бы одно детальное поле.'
      );
      return false;
    }
    setValidationError(null);
    return true;
  }
 
   // ── Upload helper ────────────────────────────────────────────────────────── 
   async function uploadFiles(files: File[]): Promise<string[]> { 
     if (files.length === 0) return []; 
     const fd = new FormData(); 
     files.forEach((f) => fd.append('files', f)); 
     const res = await fetch('/api/upload', { method: 'POST', body: fd }); 
     if (!res.ok) { 
       const err = await res.json().catch(() => ({})); 
       throw new Error(err.error ?? 'Upload failed'); 
     } 
     const data = await res.json(); 
     return data.urls as string[]; 
   } 
 
  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = useCallback(async () => {
    if (!validate()) return;

    // Check credits before generation for API mode
    if (mode === 'api' && userData) {
      if (userData.credits <= 0) {
        setGlobalError('Недостаточно кредитов. Пополните баланс!');
        toast.error('Недостаточно кредитов');
        return;
      }
    }

    const startTime = Date.now();
    setIsLoading(true);
    setResult(null);
    setGlobalError(null);

    try {
      // 1. Upload character image
      let characterImageUrl: string | undefined;
      if (characterFile) {
        const [url] = await uploadFiles([characterFile]);
        characterImageUrl = url;
      }

      // 2. Upload source images
      const sourceImageUrls = await uploadFiles(sourceFiles);

      // 3. Upload reference image
      let referenceImageUrl: string | undefined;
      if (referenceFile) {
        const [url] = await uploadFiles([referenceFile]);
        referenceImageUrl = url;
      }

      // 4. Если выбран Puter.js и режим API - генерируем на клиенте
      if (mode === 'api' && apiProvider === 'puter') {
        // Сначала получаем промпт с сервера (режим prompt не требует авторизации)
        const promptPayload = {
          generalDescription,
          details,
          mode: 'prompt' as GenerationMode,
          sourceImageUrls,
          referenceImageUrl,
          characterImageUrl,
          imageSize,
          generationType,
          apiProvider,
          bytezModel,
          huggingfaceModel,
        };

        const promptRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptPayload),
        });

        if (!promptRes.ok) {
          throw new Error('Не удалось создать промпт');
        }

        const promptData = await promptRes.json();
        
        // Парсим размер изображения
        let width = 1280;
        let height = 720;
        
        if (imageSize) {
          const [w, h] = imageSize.split('x').map(Number);
          if (w && h) {
            width = w;
            height = h;
          }
        }
        
        // Генерируем изображение с Puter.js на клиенте
        const imageUrl = await generateWithPuter(
          promptData.generatedPrompt,
          puterModel,
          puterQuality,
          width,
          height
        );

        if (!imageUrl) {
          throw new Error('Не удалось сгенерировать изображение с Puter.js');
        }

        // Track generation and deduct credits
        if (user) {
          try {
            const token = await user.getIdToken();
            
            const trackRes = await fetch('/api/track-generation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                model: puterModel,
                provider: 'puter',
                prompt: promptData.generatedPrompt,
                imageUrl: imageUrl,
                duration: Date.now() - startTime
              })
            });

            if (!trackRes.ok) {
              const error = await trackRes.json();
              console.error('Failed to track generation:', error);
              
              // Show image but warn about credit deduction failure
              toast.error('Изображение создано, но не удалось списать кредиты. Обратитесь в поддержку.');
            } else {
              const trackData = await trackRes.json();
              console.log('Generation tracked successfully:', trackData);
              
              // Refresh user data to update credits
              await refreshUserData();
              
              toast.success(`Изображение создано! Осталось ${trackData.creditsRemaining} кредитов`);
            }
          } catch (trackError) {
            console.error('Track generation error:', trackError);
            toast.error('Изображение создано, но возникла ошибка при списании кредитов');
          }
        }

        setResult({
          id: Date.now().toString(),
          generatedPrompt: promptData.generatedPrompt,
          negativePrompt: promptData.negativePrompt,
          generatedImageUrl: imageUrl,
          status: 'success',
        });
      } else {
        // Обычная генерация через сервер
        const payload = {
          generalDescription,
          details,
          mode,
          sourceImageUrls,
          referenceImageUrl,
          referenceDescription,
          characterImageUrl,
          imageSize,
          generationType,
          apiProvider,
          bytezModel,
          huggingfaceModel,
        };

        // Get auth token only for API mode
        const headers: any = { 'Content-Type': 'application/json' };
        
        if (mode === 'api') {
          const token = user ? await user.getIdToken() : null;
          if (!token) {
            throw new Error('Необходима авторизация');
          }
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? 'Generation request failed');
        }

        const data: GenerateApiResponse = await res.json();
        setResult(data);
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  }, [
    characterFile,
    sourceFiles,
    referenceFile,
    generalDescription,
    details,
    mode,
    apiProvider,
    puterModel,
    puterQuality,
    bytezModel,
    huggingfaceModel,
    generateWithPuter,
    user,
    userData,
    refreshUserData,
    imageSize,
    generationType,
    referenceDescription,
  ]);
 
  const hasResult = !!result; 
  const showPromptResult = hasResult && result.generatedPrompt; 
  const showApiResult = hasResult && mode === 'api';

  // Функция применения пресета
  function handleApplyPreset(preset: Preset) {
    // Применяем общее описание
    if (preset.config.generalDescription !== undefined) {
      setGeneralDescription(preset.config.generalDescription);
    }

    // Применяем детальные настройки
    if (preset.config.details) {
      const newDetails: DetailedFields = {
        face: preset.config.details.face || '',
        emotion: preset.config.details.emotion || '',
        objects: preset.config.details.objects || '',
        background: preset.config.details.background || '',
        colors: preset.config.details.colors || '',
        thumbnailText: preset.config.details.thumbnailText || '',
        composition: preset.config.details.composition || '',
        style: preset.config.details.style || '',
        extraDetails: preset.config.details.extraDetails || '',
      };
      setDetails(newDetails);
    }

    // Применяем размер изображения
    if (preset.config.imageSize) {
      setImageSize(preset.config.imageSize);
    }

    // Применяем тип генерации
    if (preset.config.generationType) {
      setGenerationType(preset.config.generationType);
    }

    // Применяем провайдер
    if (preset.config.apiProvider) {
      setApiProvider(preset.config.apiProvider);
    }

    // Применяем модели
    if (preset.config.bytezModel) {
      setBytezModel(preset.config.bytezModel);
    }
    if (preset.config.huggingfaceModel) {
      setHuggingfaceModel(preset.config.huggingfaceModel);
    }
    if (preset.config.puterModel) {
      setPuterModel(preset.config.puterModel);
    }
    if (preset.config.puterQuality) {
      setPuterQuality(preset.config.puterQuality);
    }
  }

  // Функция улучшения промпта
  async function handleEnhancePrompt() {
    setEnhancing(true);
    try {
      console.log('[GeneratorForm] Starting prompt enhancement...');
      console.log('[GeneratorForm] Original prompt:', generalDescription);
      
      // Улучшаем общее описание с помощью AI
      if (generalDescription.trim()) {
        const enhanced = await enhancePromptWithAI(generalDescription);
        console.log('[GeneratorForm] Enhanced prompt:', enhanced);
        setGeneralDescription(enhanced);
      }
    } catch (error) {
      console.error('[GeneratorForm] Enhancement error:', error);
      // Fallback на простое улучшение
      if (generalDescription.trim()) {
        console.log('[GeneratorForm] Using fallback enhancement');
        const enhanced = smartEnhancePrompt(generalDescription);
        setGeneralDescription(enhanced);
      }
    } finally {
      setTimeout(() => setEnhancing(false), 500);
    }
  }

  // Функция сохранения пресета
  function handleSavePreset() {
    if (!presetName.trim()) {
      alert('Введите название пресета');
      return;
    }

    try {
      savePreset({
        name: presetName.trim(),
        description: presetDescription.trim() || undefined,
        config: {
          generalDescription,
          details,
          imageSize,
          generationType,
          apiProvider,
          bytezModel,
          huggingfaceModel,
          puterModel,
          puterQuality,
        },
      });

      setShowSavePreset(false);
      setPresetName('');
      setPresetDescription('');
      alert('Пресет сохранён!');
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('Ошибка при сохранении пресета');
    }
  }
 
    return (
      <>
        {/* Settings Panel */}
        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* ── Left: Form ── */}
          <div className="space-y-5">
            {/* Presets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Пресеты</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSavePreset(true)}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Сохранить
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSettings(true)}
                      className="gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Настройки
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <div className="px-4 pb-4">
              
              {/* Save Preset Dialog */}
              {showSavePreset && (
                <div className="mb-4 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[var(--text-primary)]">
                      Сохранить текущие настройки как пресет
                    </h4>
                    <button
                      onClick={() => setShowSavePreset(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                      Название пресета
                    </label>
                    <input
                      type="text"
                      placeholder="например: Моя кликбейт миниатюра"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                      Описание (опционально)
                    </label>
                    <textarea
                      placeholder="Краткое описание этого пресета..."
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-h-[60px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePreset}
                      disabled={!presetName.trim()}
                      className="flex-1"
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSavePreset(false)}
                      className="flex-1"
                      size="sm"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
              
              <PresetManager
                currentConfig={{
                  generalDescription,
                  details,
                  imageSize,
                  generationType,
                  apiProvider,
                  bytezModel,
                  huggingfaceModel,
                  puterModel,
                  puterQuality,
                }}
                onApplyPreset={handleApplyPreset}
              />
            </div>
          </Card>

          {/* Character image */}
          <Card>
            <CharacterUpload file={characterFile} onChange={setCharacterFile} />
          </Card>

          {/* Source images */}
          <Card>
            <CardHeader>
              <CardTitle>Исходные изображения</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Загрузите лица, продукты или сцены, которые хотите видеть в миниатюре
              </p>
            </CardHeader>
            <SourceUpload files={sourceFiles} onChange={setSourceFiles} />
          </Card>

          {/* General description */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>Общее описание</CardTitle>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Опишите, что должна передавать эта миниатюра
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEnhancePrompt}
                  loading={enhancing}
                  disabled={!generalDescription.trim() || enhancing}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Улучшить
                </Button>
              </div>
            </CardHeader>
            <Textarea
              placeholder="Например: Удивлённый человек смотрит на огромную стопку денег с текстом 'Я ЗАРАБОТАЛ 10,000$ ЗА НЕДЕЛЮ' — драматично, кинематографично, высокий контраст..."
              value={generalDescription}
              onChange={(e) => setGeneralDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </Card>

          {/* Detailed controls */}
          <DetailedControls value={details} onChange={setDetails} />

          {/* Reference thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle>Референсный стиль миниатюры</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Загрузите миниатюру, стиль которой хотите повторить
              </p>
            </CardHeader>
            <ReferenceUpload 
              file={referenceFile} 
              onChange={setReferenceFile}
              onDescriptionGenerated={(desc) => setReferenceDescription(desc)}
            />
          </Card>
 
          {/* Mode toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Режим генерации</CardTitle>
            </CardHeader>
            <ModeToggle value={mode} onChange={setMode} />
            
            {mode === 'api' && (
              <div className="mt-4 space-y-3">
                {/* Generation Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Тип генерации
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGenerationType('text-to-image')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        generationType === 'text-to-image'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      Text-to-Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerationType('image-to-image')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        generationType === 'image-to-image'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      Image-to-Image
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {generationType === 'text-to-image' 
                      ? 'Генерация изображения с нуля по описанию'
                      : 'Модификация загруженного исходного изображения'}
                  </p>
                </div>

                {/* Image Size Selection */}
                <Select
                  label="Размер изображения"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  options={imageSizes}
                />

                {/* API Provider Selection */}
                <Select
                  label="API Провайдер"
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as 'default' | 'puter' | 'bytez' | 'huggingface')}
                  options={[
                    { value: 'bytez', label: 'Bytez (Google Imagen, FLUX) 🔥' },
                    { value: 'huggingface', label: 'Hugging Face (FLUX, SDXL)' },
                    { value: 'puter', label: 'Puter.js (бесплатно)' },
                    { value: 'default', label: 'Mock (тестовый)' },
                  ]}
                />

                {/* Bytez Model Selection */}
                {apiProvider === 'bytez' && (
                  <>
                    <Select
                      label="Модель Bytez"
                      value={bytezModel}
                      onChange={(e) => setBytezModel(e.target.value)}
                      options={BYTEZ_MODELS}
                    />
                    <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2">
                      <span className="text-[var(--accent)] font-medium">Bytez API</span> - доступ к Google Imagen 4, Gemini Flash, FLUX и другим моделям
                      {generationType === 'image-to-image' && (
                        <span className="block mt-1 text-amber-400">⚠️ Image-to-image может не поддерживаться всеми моделями Bytez</span>
                      )}
                    </p>
                  </>
                )}

                {/* Hugging Face Model Selection */}
                {apiProvider === 'huggingface' && (
                  <>
                    <Select
                      label="Модель Hugging Face"
                      value={huggingfaceModel}
                      onChange={(e) => setHuggingfaceModel(e.target.value)}
                      options={HUGGINGFACE_MODELS.filter(model => {
                        // Если выбран image-to-image, показываем только поддерживающие модели
                        if (generationType === 'image-to-image') {
                          return model.supportsImageToImage !== false;
                        }
                        return true;
                      })}
                    />
                    {generationType === 'image-to-image' ? (
                      <p className="text-xs text-amber-400 bg-amber-950/30 border border-amber-700/30 rounded-lg px-3 py-2">
                        ⚠️ <span className="font-medium">Hugging Face не поддерживает image-to-image</span> через Inference API.
                        <br />
                        Используйте <span className="text-[var(--accent)] font-medium">Bytez провайдер</span> для image-to-image генерации.
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2">
                        <span className="text-[var(--accent)] font-medium">Hugging Face</span> - бесплатные кредиты каждый месяц, отлично для text-to-image
                      </p>
                    )}
                  </>
                )}

                {/* Puter Model Selection */}
                {apiProvider === 'puter' && (
                  <>
                    <Select
                      label="Модель"
                      value={puterModel}
                      onChange={(e) => setPuterModel(e.target.value)}
                      options={PUTER_MODELS}
                    />

                    {/* Quality for supported models */}
                    {['gpt-image-1', 'gpt-image-1-mini', 'dall-e-3'].includes(puterModel) && (
                      <Select
                        label="Качество"
                        value={puterQuality}
                        onChange={(e) => setPuterQuality(e.target.value)}
                        options={PUTER_QUALITY_OPTIONS}
                      />
                    )}

                    <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2">
                      <span className="text-[var(--accent)] font-medium">Puter.js</span> — бесплатная генерация изображений без API ключей
                    </p>
                  </>
                )}

                {apiProvider === 'default' && (
                  <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2">
                    Используется <span className="text-[var(--accent)] font-medium">mock provider</span>. 
                    Установите <code className="bg-[var(--bg-elevated)] px-1 rounded text-[var(--accent)]">IMAGE_PROVIDER</code> в{' '}
                    <code className="bg-[var(--bg-elevated)] px-1 rounded text-[var(--accent)]">.env.local</code> для использования реального API.
                  </p>
                )}
              </div>
            )}
          </Card>
 
          {/* Validation error */}
          {validationError && (
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-950/30 border border-amber-700/30 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300">{validationError}</p>
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <div className="flex items-start gap-2 px-4 py-3 bg-red-950/30 border border-red-800/30 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{globalError}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            size="lg"
            className="w-full text-base font-semibold h-13 shadow-xl"
            onClick={generate}
            loading={isLoading}
            disabled={isLoading}
          >
            <Zap className="w-5 h-5" />
            {isLoading
              ? mode === 'api'
                ? 'Генерация изображения…'
                : 'Создание промпта…'
              : mode === 'api'
              ? 'Сгенерировать миниатюру'
              : 'Сгенерировать промпт'}
          </Button>
        </div> 
 
       {/* ── Right: Results ── */} 
        <div className="space-y-5"> 
          {/* Empty / waiting state */} 
          {!hasResult && !isLoading && ( 
            <div className="rounded-xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center"> 
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center mx-auto mb-4"> 
                <Zap className="w-6 h-6 text-[var(--text-muted)]" /> 
              </div> 
              <p className="text-sm font-medium text-[var(--text-secondary)]">Результат появится здесь</p> 
              <p className="text-xs text-[var(--text-muted)] mt-1"> 
                Заполните форму и нажмите Генерировать 
              </p> 
            </div> 
          )} 
  
          {/* API result (image) */} 
          {(mode === 'api') && (isLoading || showApiResult) && ( 
            <div> 
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3"> 
                Сгенерированное изображение 
              </p> 
              <ApiResult 
                imageUrl={result?.generatedImageUrl} 
                error={result?.error} 
                isLoading={isLoading} 
                onRegenerate={generate} 
              /> 
            </div> 
          )} 
  
          {/* Prompt result */} 
          {showPromptResult && ( 
            <div> 
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3"> 
                {mode === 'api' ? 'Использованный промпт' : 'Ваш промпт'} 
              </p> 
              <PromptResult 
                prompt={result!.generatedPrompt} 
                negativePrompt={result!.negativePrompt} 
              /> 
            </div> 
          )} 
  
          {/* Recently generated — only when we have a result */} 
          {hasResult && ( 
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4"> 
              <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium"> 
                Сохранено в{' '} 
                <a href="/history" className="text-[var(--accent)] hover:underline"> 
                  Историю ↗ 
                </a> 
              </p> 
              <div className="grid grid-cols-2 gap-2 text-xs"> 
                <div> 
                  <span className="text-[var(--text-muted)]">Режим</span> 
                  <p className="text-[var(--text-primary)] font-medium capitalize mt-0.5">{mode}</p> 
                </div> 
                <div> 
                  <span className="text-[var(--text-muted)]">Исходные изображения</span> 
                  <p className="text-[var(--text-primary)] font-medium mt-0.5">{sourceFiles.length}</p> 
                </div> 
                <div> 
                  <span className="text-[var(--text-muted)]">Референс</span> 
                  <p className="text-[var(--text-primary)] font-medium mt-0.5"> 
                    {referenceFile ? referenceFile.name : 'Нет'} 
                  </p> 
                </div> 
                <div> 
                  <span className="text-[var(--text-muted)]">Статус</span> 
                  <p 
                    className={`font-medium mt-0.5 ${
                      result?.status === 'success' ? 'text-green-400' : 'text-red-400' 
                    }`} 
                  > 
                    {result?.status === 'success' ? 'Успешно' : 'Ошибка'} 
                  </p> 
                </div> 
               </div> 
             </div> 
           )} 
         </div> 
       </div>
    </>
  ); 
 }