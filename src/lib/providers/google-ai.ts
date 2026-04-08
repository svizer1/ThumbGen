import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ImageProvider, GenerationRequest, GenerationResponse } from './types';

export class GoogleAIProvider implements ImageProvider {
  name = 'google-ai';
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-2.5-flash-image') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();

    try {
      console.log(`[GoogleAIProvider] Generating with model: ${this.model}`);
      console.log(`[GoogleAIProvider] Type: ${request.generationType || 'text-to-image'}`);

      const model = this.genAI.getGenerativeModel({ model: this.model });

      // Подготовка промпта с negative prompt
      let fullPrompt = request.prompt;
      if (request.negativePrompt) {
        fullPrompt += `\n\nAvoid these elements: ${request.negativePrompt}`;
      }

      let result;

      // Image-to-Image генерация (только для Nano Banana 2)
      if (
        request.generationType === 'image-to-image' &&
        request.sourceImageUrls &&
        request.sourceImageUrls.length > 0 &&
        this.model === 'gemini-3.1-flash-image-preview'
      ) {
        console.log(`[GoogleAIProvider] Using image-to-image with source: ${request.sourceImageUrls[0]}`);

        // Загружаем исходное изображение
        const sourceImageUrl = request.sourceImageUrls[0];
        let imageData: string;
        let mimeType: string = 'image/png';

        if (sourceImageUrl.startsWith('data:')) {
          // Если это data URL, извлекаем base64
          const matches = sourceImageUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (!matches) {
            throw new Error('Invalid data URL format');
          }
          mimeType = matches[1];
          imageData = matches[2];
        } else {
          // Если это относительный URL, делаем его абсолютным и загружаем
          let fullUrl = sourceImageUrl;
          if (sourceImageUrl.startsWith('/uploads/')) {
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL ||
              (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
            fullUrl = `${baseUrl}${sourceImageUrl}`;
          }

          console.log(`[GoogleAIProvider] Fetching image from: ${fullUrl}`);
          const response = await fetch(fullUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }

          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          imageData = Buffer.from(arrayBuffer).toString('base64');
          mimeType = blob.type || 'image/png';
        }

        // Генерация с исходным изображением
        result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: imageData,
                  },
                },
                { text: fullPrompt },
              ],
            },
          ],
        });
      } else {
        // Text-to-Image генерация
        result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: fullPrompt }],
            },
          ],
        });
      }

      const response = await result.response;
      
      // Проверяем наличие candidates
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No candidates returned from Google AI');
      }

      const candidate = response.candidates[0];
      
      // Проверяем наличие content и parts
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('No content parts in response');
      }

      const part = candidate.content.parts[0];
      
      // Проверяем наличие inlineData
      if (!part.inlineData) {
        throw new Error('No inline data in response part');
      }

      const imageInlineData = part.inlineData;
      const imageUrl = `data:${imageInlineData.mimeType};base64,${imageInlineData.data}`;

      const timingMs = Date.now() - startTime;

      console.log(`[GoogleAIProvider] Success! Generated in ${timingMs}ms`);

      return {
        imageUrl,
        model: this.model,
        timingMs,
      };
    } catch (error) {
      console.error('[GoogleAIProvider] Error:', error);
      throw new Error(
        `Google AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Доступные модели Google AI Studio
export const GOOGLE_AI_MODELS = [
  {
    value: 'gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash (Text, бесплатно) ⭐',
    supportsImageToImage: false,
    free: true,
    isTextOnly: true,
  },
  {
    value: 'gemini-2.5-flash-image',
    label: 'Nano Banana (Image, требует биллинг) 💳',
    supportsImageToImage: false,
    free: false,
  },
  {
    value: 'gemini-3.1-flash-image-preview',
    label: 'Nano Banana 2 (Image-to-Image, требует биллинг) 💳',
    supportsImageToImage: true,
    free: false,
  },
];
