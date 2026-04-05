import type { ImageProvider, GenerationRequest, GenerationResponse } from './types';

export class BytezProvider implements ImageProvider {
  name = 'bytez';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'google/gemini-3.1-flash-image-preview') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();

    try {
      // Bytez API endpoint
      const url = `https://api.bytez.com/models/v2/${this.model}`;
      
      // Подготовка запроса
      const body: any = {
        text: request.prompt,
      };

      // Добавляем параметры если есть
      if (request.width && request.height) {
        body.width = request.width;
        body.height = request.height;
      }

      // Для image-to-image (если поддерживается)
      if (request.generationType === 'image-to-image' && request.sourceImageUrls && request.sourceImageUrls.length > 0) {
        let imageUrl = request.sourceImageUrls[0];
        
        // Если это относительный URL, делаем его абсолютным
        if (imageUrl.startsWith('/uploads/')) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
          imageUrl = `${baseUrl}${imageUrl}`;
        }
        
        body.image = imageUrl;
        console.log(`[BytezProvider] Using source image: ${imageUrl}`);
      }

      console.log(`[BytezProvider] Generating with model: ${this.model}`);
      console.log(`[BytezProvider] Request:`, { text: body.text.substring(0, 100) + '...', width: body.width, height: body.height });

      // Отправка запроса
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bytez API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      // Bytez возвращает изображение в base64 или URL
      let imageUrl: string;
      
      if (data.output) {
        // Если это base64
        if (data.output.startsWith('data:image')) {
          imageUrl = data.output;
        } else if (data.output.startsWith('http')) {
          // Если это URL
          imageUrl = data.output;
        } else {
          // Если это просто base64 без префикса
          imageUrl = `data:image/png;base64,${data.output}`;
        }
      } else {
        throw new Error('No image output from Bytez API');
      }

      const timingMs = Date.now() - startTime;

      console.log(`[BytezProvider] Success! Generated in ${timingMs}ms`);

      return {
        imageUrl,
        model: this.model,
        timingMs,
      };
    } catch (error) {
      console.error('[BytezProvider] Error:', error);
      throw new Error(
        `Bytez generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Доступные модели Bytez
export const BYTEZ_MODELS = [
  { 
    value: 'google/gemini-3.1-flash-image-preview', 
    label: 'Google Gemini Flash (Рекомендуется) ⭐',
  },
  { 
    value: 'black-forest-labs/FLUX.1-dev', 
    label: 'FLUX.1 Dev (Лучший для текста)',
  },
  { 
    value: 'black-forest-labs/FLUX.1-schnell', 
    label: 'FLUX.1 Schnell (Быстрый)',
  },
  { 
    value: 'stabilityai/stable-diffusion-xl-base-1.0', 
    label: 'Stable Diffusion XL (Стабильный)',
  },
];
