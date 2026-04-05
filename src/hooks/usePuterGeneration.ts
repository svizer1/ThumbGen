'use client';

import { useState } from 'react';

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

export function usePuterGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (
    prompt: string,
    model: string = 'gpt-image-1',
    quality?: string,
    width?: number,
    height?: number
  ): Promise<string | null> => {
    if (typeof window === 'undefined' || !window.puter) {
      setError('Puter.js не загружен. Перезагрузите страницу.');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const options: any = { model };
      
      if (quality && ['gpt-image-1', 'gpt-image-1-mini', 'dall-e-3'].includes(model)) {
        options.quality = quality;
      }

      const imgElement = await window.puter.ai.txt2img(prompt, options);

      // Конвертируем HTMLImageElement в data URL
      const canvas = document.createElement('canvas');
      
      // Используем переданные размеры или fallback на naturalWidth/Height
      canvas.width = width || imgElement.naturalWidth || 1280;
      canvas.height = height || imgElement.naturalHeight || 720;
      
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Не удалось создать canvas context');
      }

      // Ждем загрузки изображения
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
      });

      ctx.drawImage(imgElement, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');

      setIsGenerating(false);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка генерации изображения';
      setError(errorMessage);
      setIsGenerating(false);
      return null;
    }
  };

  return { generateImage, isGenerating, error };
}
