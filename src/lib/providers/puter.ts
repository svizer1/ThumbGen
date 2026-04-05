import type { ImageProvider, GenerationRequest, GenerationResponse } from './types';

// Объявляем глобальный тип для Puter.js
declare global {
  interface Window {
    puter?: {
      ai: {
        txt2img: (
          prompt: string,
          options?: {
            model?: string;
            quality?: 'low' | 'medium' | 'high' | 'hd' | 'standard';
          }
        ) => Promise<HTMLImageElement>;
      };
    };
  }
}

export class PuterProvider implements ImageProvider {
  name = 'puter';
  private model: string;
  private quality?: string;

  constructor(model = 'gpt-image-1', quality?: string) {
    this.model = model;
    this.quality = quality;
  }

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    if (typeof window === 'undefined' || !window.puter) {
      throw new Error('Puter.js не загружен. Убедитесь, что скрипт подключен в layout.');
    }

    const startTime = Date.now();

    try {
      const options: any = { model: this.model };
      
      // Добавляем quality только для поддерживаемых моделей
      if (this.quality && ['gpt-image-1', 'gpt-image-1-mini', 'dall-e-3'].includes(this.model)) {
        options.quality = this.quality;
      }

      // Генерируем изображение
      const imgElement = await window.puter.ai.txt2img(request.prompt, options);

      // Конвертируем HTMLImageElement в data URL
      const canvas = document.createElement('canvas');
      
      // Используем размеры из запроса или fallback на naturalWidth/Height
      canvas.width = request.width || imgElement.naturalWidth || 1280;
      canvas.height = request.height || imgElement.naturalHeight || 720;
      
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Не удалось создать canvas context');
      }

      ctx.drawImage(imgElement, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');

      const timingMs = Date.now() - startTime;

      return {
        imageUrl,
        model: this.model,
        timingMs,
      };
    } catch (error) {
      throw new Error(
        `Ошибка генерации Puter.js: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  }
}

// Доступные модели Puter.js
export const PUTER_MODELS = [
  { value: 'gpt-image-1', label: 'GPT Image 1' },
  { value: 'gpt-image-1.5', label: 'GPT Image 1.5' },
  { value: 'gpt-image-1-mini', label: 'GPT Image 1 Mini' },
  { value: 'dall-e-3', label: 'DALL-E 3' },
  { value: 'dall-e-2', label: 'DALL-E 2' },
  { value: 'gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash' },
  { value: 'black-forest-labs/FLUX.1-schnell', label: 'Flux.1 Schnell' },
  { value: 'black-forest-labs/FLUX.1.1-pro', label: 'Flux 1.1 Pro' },
  { value: 'stabilityai/stable-diffusion-3-medium', label: 'Stable Diffusion 3' },
  { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'Stable Diffusion XL' },
];

export const PUTER_QUALITY_OPTIONS = [
  { value: 'low', label: 'Низкое' },
  { value: 'medium', label: 'Среднее' },
  { value: 'high', label: 'Высокое' },
  { value: 'hd', label: 'HD' },
];
