import { BytezProvider } from './providers/bytez';
import { GoogleAIProvider } from './providers/google-ai';

export type EnhancementType = 'upscale' | 'face-enhance' | 'background-remove' | 'quality-enhance';

export interface EnhanceImageRequest {
  imageUrl: string;
  enhancements: EnhancementType[];
  upscaleLevel?: '2x' | '4x' | '8x';
  targetResolution?: string;
}

export interface EnhanceImageResponse {
  originalUrl: string;
  enhancedUrl: string;
  enhancements: EnhancementType[];
  processingTime: number;
  status: 'success' | 'error';
  error?: string;
}

type PreparedImage = {
  buffer: Buffer;
  mimeType: string;
  dataUrl: string;
};

const DEFAULT_IMAGE_MIME = 'image/png';

function toDataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

function getBaseUrl() {
  const explicitBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
  }

  return 'http://127.0.0.1:3000';
}

function normalizeImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${getBaseUrl()}${imageUrl}`;
  }

  return imageUrl;
}

async function prepareImage(imageUrl: string): Promise<PreparedImage> {
  if (imageUrl.startsWith('data:')) {
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);

    if (!matches) {
      throw new Error('Invalid data URL image');
    }

    const mimeType = matches[1] || DEFAULT_IMAGE_MIME;
    const buffer = Buffer.from(matches[2], 'base64');

    return {
      buffer,
      mimeType,
      dataUrl: imageUrl,
    };
  }

  const normalizedUrl = normalizeImageUrl(imageUrl);
  const response = await fetch(normalizedUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch source image: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get('content-type')?.split(';')[0] || DEFAULT_IMAGE_MIME;

  return {
    buffer,
    mimeType,
    dataUrl: toDataUrl(buffer, mimeType),
  };
}

async function runHuggingFaceImageModel(model: string, imageUrl: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY not configured');
  }

  const image = await prepareImage(imageUrl);
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': image.mimeType,
    },
    body: new Uint8Array(image.buffer),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Hugging Face model ${model} failed`);
  }

  const contentType = response.headers.get('content-type')?.split(';')[0] || DEFAULT_IMAGE_MIME;
  const arrayBuffer = await response.arrayBuffer();
  return toDataUrl(Buffer.from(arrayBuffer), contentType);
}

async function runGenerativeEnhancement(
  imageUrl: string,
  instruction: string,
  strength: number
): Promise<string> {
  const preparedImage = await prepareImage(imageUrl);

  if (process.env.BYTEZ_API_KEY) {
    const provider = new BytezProvider(process.env.BYTEZ_API_KEY, 'google/gemini-3.1-flash-image-preview');
    const result = await provider.generate({
      prompt: instruction,
      negativePrompt:
        'do not change the product identity, do not replace subject, do not crop aggressively, no artifacts, no text, no watermark, no extra objects',
      generationType: 'image-to-image',
      sourceImageUrls: [preparedImage.dataUrl],
      strength,
    });

    if (!result.imageUrl) {
      throw new Error('Bytez enhancement returned empty image');
    }

    return result.imageUrl;
  }

  if (process.env.GOOGLE_AI_API_KEY) {
    const provider = new GoogleAIProvider(process.env.GOOGLE_AI_API_KEY, 'gemini-3.1-flash-image-preview');
    const result = await provider.generate({
      prompt: instruction,
      negativePrompt:
        'do not change the product identity, do not replace subject, do not crop aggressively, no artifacts, no text, no watermark, no extra objects',
      generationType: 'image-to-image',
      sourceImageUrls: [preparedImage.dataUrl],
      strength,
    });

    if (!result.imageUrl) {
      throw new Error('Google AI enhancement returned empty image');
    }

    return result.imageUrl;
  }

  throw new Error('No enhancement provider configured');
}

export async function upscaleImage(
  imageUrl: string,
  level: '2x' | '4x' | '8x' = '2x'
): Promise<string> {
  console.log(`[ImageEnhancer] Upscaling image to ${level}`);

  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      const result = await runHuggingFaceImageModel('ai-forever/Real-ESRGAN', imageUrl);
      console.log('[ImageEnhancer] ✅ Upscaled with Hugging Face');
      return result;
    } catch (error) {
      console.warn('[ImageEnhancer] Hugging Face upscale failed:', error);
    }
  }

  return runGenerativeEnhancement(
    imageUrl,
    `Enhance the provided image for marketplace usage. Upscale to ${level}, increase clarity, sharpen edges, preserve original geometry, preserve colors, keep the product identical, maintain a clean studio look.`,
    0.18
  );
}

export async function enhanceFace(imageUrl: string): Promise<string> {
  console.log('[ImageEnhancer] Enhancing face');

  return runGenerativeEnhancement(
    imageUrl,
    'Enhance the provided portrait or product photo. Improve facial details, skin texture, eyes, local sharpness, and micro-contrast while preserving identity and natural realism.',
    0.16
  );
}

export async function removeBackground(imageUrl: string): Promise<string> {
  console.log('[ImageEnhancer] Removing background');

  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      const result = await runHuggingFaceImageModel('briaai/RMBG-1.4', imageUrl);
      console.log('[ImageEnhancer] ✅ Background removed with Hugging Face');
      return result;
    } catch (error) {
      console.warn('[ImageEnhancer] Hugging Face background removal failed:', error);
    }
  }

  return runGenerativeEnhancement(
    imageUrl,
    'Remove the background from the provided image, isolate the main subject cleanly, use a transparent or pure clean background look, keep edges accurate, preserve product details.',
    0.2
  );
}

export async function enhanceQuality(imageUrl: string): Promise<string> {
  console.log('[ImageEnhancer] Enhancing quality');

  return runGenerativeEnhancement(
    imageUrl,
    'Enhance the provided image for Wildberries or marketplace listing quality. Reduce noise, improve sharpness, balance contrast, correct colors, and keep the subject unchanged.',
    0.15
  );
}

export async function enhanceImage(request: EnhanceImageRequest): Promise<EnhanceImageResponse> {
  const startTime = Date.now();

  try {
    let currentUrl = request.imageUrl;
    const appliedEnhancements: EnhancementType[] = [];

    for (const enhancement of request.enhancements) {
      try {
        switch (enhancement) {
          case 'upscale':
            currentUrl = await upscaleImage(currentUrl, request.upscaleLevel || '2x');
            appliedEnhancements.push('upscale');
            break;
          case 'face-enhance':
            currentUrl = await enhanceFace(currentUrl);
            appliedEnhancements.push('face-enhance');
            break;
          case 'background-remove':
            currentUrl = await removeBackground(currentUrl);
            appliedEnhancements.push('background-remove');
            break;
          case 'quality-enhance':
            currentUrl = await enhanceQuality(currentUrl);
            appliedEnhancements.push('quality-enhance');
            break;
        }
      } catch (error) {
        console.error(`[ImageEnhancer] Failed to apply ${enhancement}:`, error);
      }
    }

    const processingTime = Date.now() - startTime;

    if (appliedEnhancements.length === 0 || currentUrl === request.imageUrl) {
      return {
        originalUrl: request.imageUrl,
        enhancedUrl: request.imageUrl,
        enhancements: [],
        processingTime,
        status: 'error',
        error: 'Не удалось применить выбранные улучшения. Проверьте ключи провайдеров и попробуйте другой режим.',
      };
    }

    return {
      originalUrl: request.imageUrl,
      enhancedUrl: currentUrl,
      enhancements: appliedEnhancements,
      processingTime,
      status: 'success',
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;

    return {
      originalUrl: request.imageUrl,
      enhancedUrl: request.imageUrl,
      enhancements: [],
      processingTime,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
