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
      
      // Определяем тип генерации
      const isImageToImage = 
        request.generationType === 'image-to-image' && 
        request.sourceImageUrls && 
        request.sourceImageUrls.length > 0;

      // Подготовка запроса
      const body: any = {};

      // Для image-to-image с Gemini Flash
      if (isImageToImage) {
        let imageSource = request.sourceImageUrls![0];
        
        // Если это относительный URL, конвертируем в base64
        if (imageSource.startsWith('/uploads/')) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
          const fullUrl = `${baseUrl}${imageSource}`;
          
          console.log(`[BytezProvider] Fetching image from: ${fullUrl}`);
          const response = await fetch(fullUrl);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch source image: ${response.status} ${response.statusText}`);
          }
          
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const mimeType = blob.type || 'image/png';
          
          imageSource = `data:${mimeType};base64,${base64}`;
          console.log(`[BytezProvider] Converted to base64, size: ${(base64.length / 1024).toFixed(1)}KB`);
        }
        
        // Для Gemini Flash image-to-image используем формат text-to-image с дополнительным параметром
        // Bytez API может не поддерживать прямой image-to-image для Gemini Flash
        // Попробуем альтернативный формат
        body.text = request.prompt;
        body.init_image = imageSource; // Альтернативное поле для исходного изображения
        
        // Параметры для image-to-image
        body.strength = request.strength || 0.75;
        body.guidance_scale = 7.5;
        body.num_inference_steps = 50;
        
        if (request.negativePrompt) {
          body.negative_prompt = request.negativePrompt;
        }
        
        // Добавляем размеры если есть
        if (request.width && request.height) {
          body.width = request.width;
          body.height = request.height;
        }
        
        console.log(`[BytezProvider] Image-to-Image mode, strength: ${body.strength}`);
      } else {
        // Text-to-Image режим
        body.text = request.prompt;
        
        // Добавляем параметры если есть
        if (request.width && request.height) {
          body.width = request.width;
          body.height = request.height;
        }

        // Добавляем negative prompt и параметры генерации
        if (request.negativePrompt) {
          body.negative_prompt = request.negativePrompt;
        }
        
        // Параметры для улучшения качества генерации
        body.guidance_scale = 7.5;
        body.num_inference_steps = 50;
      }

      console.log(`[BytezProvider] Generating with model: ${this.model}`);
      console.log(`[BytezProvider] Type: ${isImageToImage ? 'image-to-image' : 'text-to-image'}`);
      console.log(`[BytezProvider] Request body:`, JSON.stringify(body, null, 2).substring(0, 500) + '...');

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
        console.error(`[BytezProvider] API error response:`, errorText);
        throw new Error(`Bytez API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log(`[BytezProvider] Response keys:`, Object.keys(data));
      
      // Bytez возвращает изображение в base64 или URL
      let imageUrl: string;
      
      // Проверяем различные возможные форматы ответа
      if (data.output) {
        // Если это base64 data URL
        if (data.output.startsWith('data:image')) {
          imageUrl = data.output;
        } else if (data.output.startsWith('http')) {
          // Если это URL
          imageUrl = data.output;
        } else {
          // Если это просто base64 без префикса
          imageUrl = `data:image/png;base64,${data.output}`;
        }
      } else if (data.image) {
        // Альтернативный формат ответа
        if (data.image.startsWith('data:image') || data.image.startsWith('http')) {
          imageUrl = data.image;
        } else {
          imageUrl = `data:image/png;base64,${data.image}`;
        }
      } else if (data.images && data.images.length > 0) {
        // Массив изображений
        const img = data.images[0];
        if (typeof img === 'string') {
          imageUrl = img.startsWith('data:image') || img.startsWith('http') ? img : `data:image/png;base64,${img}`;
        } else if (img.url) {
          imageUrl = img.url;
        } else if (img.b64_json) {
          imageUrl = `data:image/png;base64,${img.b64_json}`;
        } else {
          throw new Error('Invalid image format in response');
        }
      } else {
        console.error(`[BytezProvider] Unexpected response:`, JSON.stringify(data).substring(0, 500));
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
    supportsImageToImage: false,
  },
  { 
    value: 'black-forest-labs/FLUX.1-dev', 
    label: 'FLUX.1 Dev (Лучший для текста)',
    supportsImageToImage: false,
  },
  { 
    value: 'black-forest-labs/FLUX.1-schnell', 
    label: 'FLUX.1 Schnell (Быстрый)',
    supportsImageToImage: false,
  },
  { 
    value: 'stabilityai/stable-diffusion-xl-base-1.0', 
    label: 'Stable Diffusion XL (Стабильный)',
    supportsImageToImage: false,
  },
  { 
    value: 'runwayml/stable-diffusion-v1-5', 
    label: 'Stable Diffusion 1.5 (Классика)',
    supportsImageToImage: false,
  },
];
