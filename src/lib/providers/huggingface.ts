import { HfInference } from '@huggingface/inference';
import type { ImageProvider, GenerationRequest, GenerationResponse } from './types';

export class HuggingFaceProvider implements ImageProvider {
  name = 'huggingface';
  private hf: HfInference;
  private model: string;

  constructor(apiKey: string, model: string = 'black-forest-labs/FLUX.1-dev') {
    this.hf = new HfInference(apiKey);
    this.model = model;
  }

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();

    try {
      console.log(`[HuggingFaceProvider] Generating with model: ${this.model}`);
      console.log(`[HuggingFaceProvider] Type: ${request.generationType || 'text-to-image'}`);

      let blob: Blob;

      // Image-to-Image генерация
      if (request.generationType === 'image-to-image' && request.sourceImageUrls && request.sourceImageUrls.length > 0) {
        console.log(`[HuggingFaceProvider] Using image-to-image with source: ${request.sourceImageUrls[0]}`);
        
        // Загружаем исходное изображение
        const sourceImageUrl = request.sourceImageUrls[0];
        let imageBlob: Blob;

        if (sourceImageUrl.startsWith('data:')) {
          // Если это data URL, конвертируем в Blob
          const base64Data = sourceImageUrl.split(',')[1];
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          imageBlob = new Blob([bytes], { type: 'image/png' });
        } else {
          // Если это относительный URL, делаем его абсолютным
          let fullUrl = sourceImageUrl;
          if (sourceImageUrl.startsWith('/uploads/')) {
            // Получаем базовый URL из окружения или используем localhost
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                           (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
            fullUrl = `${baseUrl}${sourceImageUrl}`;
          }
          
          console.log(`[HuggingFaceProvider] Fetching image from: ${fullUrl}`);
          const response = await fetch(fullUrl);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
          
          imageBlob = await response.blob();
        }

        // Используем imageToImage
        const result = await this.hf.imageToImage({
          model: this.model,
          inputs: imageBlob,
          parameters: {
            prompt: request.prompt,
            negative_prompt: request.negativePrompt,
            strength: 0.75, // Насколько сильно изменять исходное изображение (0.0-1.0)
            guidance_scale: 7.5, // Насколько строго следовать промпту
            num_inference_steps: 50, // Количество шагов генерации
          } as any,
        });
        blob = result as Blob;
      } else {
        // Text-to-Image генерация
        const result = await this.hf.textToImage({
          model: this.model,
          inputs: request.prompt,
          parameters: {
            negative_prompt: request.negativePrompt,
            width: request.width,
            height: request.height,
          } as any,
        });
        blob = result as unknown as Blob;
      }

      // Конвертируем Blob в data URL
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const imageUrl = `data:${blob.type};base64,${base64}`;

      const timingMs = Date.now() - startTime;

      console.log(`[HuggingFaceProvider] Success! Generated in ${timingMs}ms`);

      return {
        imageUrl,
        model: this.model,
        timingMs,
      };
    } catch (error) {
      console.error('[HuggingFaceProvider] Error:', error);
      throw new Error(
        `Hugging Face generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Доступные модели Hugging Face
// ВАЖНО: В 2026 году Hugging Face изменил политику Inference API
// Большинство моделей требуют платные кредиты через провайдера fal-ai
// Используйте Google AI Studio или Bytez для бесплатной генерации
// Эти модели могут не работать без предоплаченных кредитов
export const HUGGINGFACE_MODELS = [
  { 
    value: 'stabilityai/stable-diffusion-xl-base-1.0', 
    label: 'Stable Diffusion XL 1.0 ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
  { 
    value: 'stabilityai/stable-diffusion-2-1', 
    label: 'Stable Diffusion 2.1 ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
  { 
    value: 'runwayml/stable-diffusion-v1-5', 
    label: 'Stable Diffusion 1.5 ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
  { 
    value: 'prompthero/openjourney', 
    label: 'OpenJourney (Midjourney style) ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
  { 
    value: 'SG161222/Realistic_Vision_V5.1_noVAE', 
    label: 'Realistic Vision 5.1 ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
  { 
    value: 'dreamlike-art/dreamlike-photoreal-2.0', 
    label: 'Dreamlike Photoreal 2.0 ⚠️',
    supportsImageToImage: false,
    warning: 'Может требовать платные кредиты',
  },
];
