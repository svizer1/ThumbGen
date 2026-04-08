/**
 * Wildberries Product Card Generator
 * Generates product images and descriptions for Wildberries marketplace
 */
import { callGroq } from './groq-client';
import { BytezProvider } from './providers/bytez';

export type WBVisualStyle = 'minimal' | 'standard' | 'premium';

export interface WBProductCard {
  productName: string;
  category: string;
  description: string;
  features: string[];
  style?: WBVisualStyle;
  images?: string[];
  infographicData?: {
    title: string;
    specs: { label: string; value: string }[];
  };
}

export interface WBGenerationResult {
  mainImage: string;
  infographic?: string;
  additionalAngles?: string[];
  seoDescription: string;
  status: 'success' | 'error';
  error?: string;
}

function getStyleDescriptor(style: WBVisualStyle = 'standard') {
  switch (style) {
    case 'minimal':
      return 'minimalist Wildberries product card, ultra clean composition, generous whitespace, restrained typography, no visual clutter, precise product focus';
    case 'premium':
      return 'premium Wildberries product card, elevated art direction, modern gradients, layered lighting, high-end UI details, premium navigation accents, visually rich but readable';
    case 'standard':
    default:
      return 'standard Wildberries marketplace card, familiar interface blocks, clean filters and switches, balanced content hierarchy, informative and easy to scan';
  }
}

function getStyleVoice(style: WBVisualStyle = 'standard') {
  switch (style) {
    case 'minimal':
      return 'Сделай подачу лаконичной, чистой и уверенной.';
    case 'premium':
      return 'Сделай подачу премиальной, эмоциональной и визуально выразительной.';
    case 'standard':
    default:
      return 'Сделай подачу понятной, привычной для Wildberries и хорошо структурированной.';
  }
}

/**
 * Generate main product image for Wildberries
 * Requirements: 700x900 minimum, 3:4 aspect ratio, white background
 */
export async function generateWBProductImage(
  product: WBProductCard,
  apiProvider: 'bytez' | 'huggingface' = 'bytez'
): Promise<string> {
  try {
    console.log('[WBGenerator] Generating main product image');

    const styleDescriptor = getStyleDescriptor(product.style);
    const prompt = `Professional product photography of ${product.productName}, ${product.description}, 
    clean white background, studio lighting, high quality commercial photography, 
    centered composition, 3:4 aspect ratio, sharp focus, detailed texture, 
    e-commerce product shot, professional lighting setup, no shadows on background,
    ${styleDescriptor},
    ${product.features.join(', ')}, 4K quality, professional product photography`;

    const negativePrompt = 'blurry, low quality, bad lighting, shadows on background, cluttered, messy, amateur, distorted, watermark, text, words, letters, labels, writing, typography, logo, signature';

    if (apiProvider === 'bytez') {
      console.log('[WBGenerator] Calling Bytez provider for main image...');
      const imageUrl = await generateWithBytez(prompt, {
        negativePrompt,
        width: 768,
        height: 1024,
      });
      console.log('[WBGenerator] ✅ Main image generated with Bytez');
      return imageUrl;
    }

    throw new Error(`Provider ${apiProvider} is not supported`);
  } catch (error) {
    console.error('[WBGenerator] Main image generation error:', error);
    throw error;
  }
}

/**
 * Generate infographic with product specifications
 */
export async function generateWBInfographic(
  product: WBProductCard
): Promise<string> {
  try {
    console.log('[WBGenerator] Generating infographic');

    if (!product.infographicData) {
      throw new Error('Infographic data not provided');
    }

    const styleDescriptor = getStyleDescriptor(product.style);
    const specsText = product.infographicData.specs
      .map(spec => `${spec.label}: ${spec.value}`)
      .join(', ');

    const prompt = `Product infographic banner for ${product.productName}, 
    clean modern design, white background, product specifications overlay, 
    ${product.infographicData.title}, ${specsText}, 
    professional e-commerce infographic, clear typography, 
    icons for features, organized layout, 3:4 aspect ratio, 
    Wildberries marketplace style, clean and professional,
    ${styleDescriptor},
    high contrast text, easy to read, marketing banner`;

    const imageUrl = await generateWithBytez(prompt, {
      width: 768,
      height: 1024,
    });

    console.log('[WBGenerator] ✅ Infographic generated');
    return imageUrl;
  } catch (error) {
    console.error('[WBGenerator] Infographic generation error:', error);
    throw error;
  }
}

/**
 * Generate multiple product angles
 */
export async function generateWBMultipleAngles(
  product: WBProductCard,
  count: number = 3
): Promise<string[]> {
  try {
    console.log(`[WBGenerator] Generating ${count} additional angles`);

    const styleDescriptor = getStyleDescriptor(product.style);
    const angles = ['front view', 'side view', 'back view', 'top view', '45 degree angle'];
    const selectedAngles = angles.slice(0, count);

    const results: string[] = [];

    for (const angle of selectedAngles) {
      const prompt = `Professional product photography of ${product.productName}, ${angle}, 
      ${product.description}, clean white background, studio lighting, 
      high quality commercial photography, centered composition, 3:4 aspect ratio, 
      sharp focus, detailed texture, e-commerce product shot, 
      ${styleDescriptor},
      ${product.features.join(', ')}, 4K quality`;

      try {
        const imageUrl = await generateWithBytez(prompt, {
          width: 768,
          height: 1024,
        });
        if (imageUrl) {
          results.push(imageUrl);
        }
      } catch (angleError) {
        console.warn(`[WBGenerator] Failed to generate angle "${angle}":`, angleError);
      }
    }

    console.log(`[WBGenerator] ✅ Generated ${results.length} additional angles`);
    return results;
  } catch (error) {
    console.error('[WBGenerator] Multiple angles generation error:', error);
    return [];
  }
}

async function generateWithBytez(
  prompt: string,
  options: { negativePrompt?: string; width: number; height: number }
): Promise<string> {
  const bytezKey = process.env.BYTEZ_API_KEY;
  if (!bytezKey) throw new Error('Bytez API key not configured');

  const provider = new BytezProvider(bytezKey, 'google/gemini-3.1-flash-image-preview');
  const result = await provider.generate({
    prompt,
    negativePrompt: options.negativePrompt,
    width: options.width,
    height: options.height,
    generationType: 'text-to-image',
  });

  if (!result.imageUrl) {
    throw new Error('No image URL returned from Bytez provider');
  }

  return result.imageUrl;
}

/**
 * Generate SEO-optimized product description
 */
export async function generateWBSEODescription(
  product: WBProductCard
): Promise<string> {
  try {
    console.log('[WBGenerator] Generating SEO description with Groq');

    const styleVoice = getStyleVoice(product.style);

    const prompt = `Напиши профессиональное SEO-оптимизированное описание товара для маркетплейса Wildberries.

Товар: ${product.productName}
Категория: ${product.category}
Описание: ${product.description}
Характеристики: ${product.features.join(', ')}
Стиль карточки: ${product.style || 'standard'}

Требования:
1. Напиши на русском языке
2. Объем 150-200 слов
3. Включи ключевые особенности и преимущества
4. Естественно используй SEO-ключи
5. Профессиональный и убедительный тон
6. Выдели уникальные торговые преимущества
7. Включи призыв к действию в конце
8. ${styleVoice}

Напиши ТОЛЬКО описание, без дополнительных вводных слов:`;

    try {
      const description = await callGroq(
        [{ role: 'user', content: prompt }],
        'openai/gpt-oss-120b',
        0.7,
        500
      );

      if (description && description.length > 50) {
        console.log('[WBGenerator] ✅ SEO description generated with Groq');
        return description.trim();
      }
    } catch (groqError) {
      console.warn(`[WBGenerator] Groq failed:`, groqError);
    }

    // Fallback
    return generateTemplateSEODescription(product);
  } catch (error) {
    console.error('[WBGenerator] SEO description error:', error);
    return generateTemplateSEODescription(product);
  }
}

/**
 * Template-based SEO description (fallback)
 */
function generateTemplateSEODescription(product: WBProductCard): string {
  const styleEnding = product.style === 'minimal'
    ? 'Подача карточки выполнена в чистом минималистичном стиле, чтобы покупатель сразу видел главное.'
    : product.style === 'premium'
      ? 'Премиальная подача карточки усиливает восприятие товара и помогает выгодно выделиться среди конкурентов.'
      : 'Стандартная структурированная подача карточки помогает быстро донести преимущества товара до покупателя.';

  return `${product.productName} - ${product.description}

Основные характеристики:
${product.features.map(f => `• ${f}`).join('\n')}

Этот товар идеально подходит для тех, кто ценит качество и функциональность. ${product.productName} сочетает в себе современный дизайн и надежность.

Преимущества:
• Высокое качество материалов
• Продуманный дизайн
• Отличное соотношение цены и качества
• Быстрая доставка

${styleEnding}

Закажите ${product.productName} прямо сейчас на Wildberries и получите качественный товар с гарантией!`;
}

/**
 * Generate complete Wildberries product card
 */
export async function generateWBProductCard(
  product: WBProductCard,
  options: {
    includeInfographic?: boolean;
    includeMultipleAngles?: boolean;
    anglesCount?: number;
  } = {}
): Promise<WBGenerationResult> {
  try {
    console.log('[WBGenerator] Generating complete product card');

    // Generate main image
    const mainImage = await generateWBProductImage(product);

    // Generate infographic if requested
    let infographic: string | undefined;
    if (options.includeInfographic && product.infographicData) {
      try {
        infographic = await generateWBInfographic(product);
      } catch (error) {
        console.warn('[WBGenerator] Infographic generation failed:', error);
      }
    }

    // Generate additional angles if requested
    let additionalAngles: string[] | undefined;
    if (options.includeMultipleAngles) {
      try {
        additionalAngles = await generateWBMultipleAngles(
          product,
          options.anglesCount || 3
        );
      } catch (error) {
        console.warn('[WBGenerator] Additional angles generation failed:', error);
      }
    }

    // Generate SEO description
    const seoDescription = await generateWBSEODescription(product);

    console.log('[WBGenerator] ✅ Complete product card generated');

    return {
      mainImage,
      infographic,
      additionalAngles,
      seoDescription,
      status: 'success',
    };
  } catch (error) {
    console.error('[WBGenerator] Product card generation error:', error);
    return {
      mainImage: '',
      seoDescription: '',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
