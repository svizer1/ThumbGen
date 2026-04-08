import type { GenerationInput } from '@/types';
import { callGroq } from './groq-client';

/**
 * Улучшает промпт с помощью AI (Groq API)
 * Использует Groq для быстрого и качественного улучшения
 */
export async function enhancePromptWithAI(prompt: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert at writing prompts for AI image generation models. Your task is to enhance prompts for YouTube thumbnail generation.

Rules:
1. Keep the core idea but make it more detailed and specific
2. Add visual details: lighting, colors, composition, camera angle
3. Add quality modifiers: "high quality", "professional", "detailed"
4. For YouTube thumbnails emphasize: high contrast, bold colors, eye-catching, dramatic
5. Keep it concise (under 200 words)
6. Return ONLY the enhanced prompt, no explanations
7. Do NOT include phrases like "Enhanced prompt:" or "Here is:"`;

    const userPrompt = `Enhance this YouTube thumbnail prompt:\n\n${prompt}`;

    try {
      const enhanced = await callGroq(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        'llama-3.1-70b-versatile',
        0.7,
        500
      );

      // Очистка результата
      const cleaned = cleanEnhancedPrompt(enhanced, prompt);

      if (cleaned && cleaned.length > 20 && cleaned !== prompt) {
        console.log(`[PromptEnhancer] ✅ Successfully enhanced with Groq`);
        console.log(`[PromptEnhancer] Original length: ${prompt.length}, Enhanced length: ${cleaned.length}`);
        return cleaned;
      } else {
        console.warn(`[PromptEnhancer] Groq returned invalid result, using fallback`);
        return smartEnhancePrompt(prompt);
      }
    } catch (groqError) {
      console.warn('[PromptEnhancer] Groq failed, using fallback:', groqError);
      return smartEnhancePrompt(prompt);
    }
  } catch (error) {
    console.error('[PromptEnhancer] Error:', error);
    return smartEnhancePrompt(prompt);
  }
}

/**
 * DEPRECATED: Old HuggingFace implementation (kept for reference)
 */
async function enhancePromptWithAI_OLD_HF(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      console.warn('[PromptEnhancer] No HF API key, using fallback');
      return smartEnhancePrompt(prompt);
    }

    const models = [
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'meta-llama/Meta-Llama-3-8B-Instruct',
      'microsoft/Phi-3-mini-4k-instruct',
    ];

    let lastError: any = null;

    for (const model of models) {
      try {
        const systemPrompt = `You are an expert at writing prompts for AI image generation models. Your task is to enhance prompts for YouTube thumbnail generation.

Rules:
1. Keep the core idea but make it more detailed and specific
2. Add visual details: lighting, colors, composition, camera angle
3. Add quality modifiers: "high quality", "professional", "detailed"
4. For YouTube thumbnails emphasize: high contrast, bold colors, eye-catching, dramatic
5. Keep it concise (under 200 words)
6. Return ONLY the enhanced prompt, no explanations
7. Do NOT include phrases like "Enhanced prompt:" or "Here is:"`;

        const userPrompt = `Enhance this YouTube thumbnail prompt:\n\n${prompt}`;

        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`,
              parameters: {
                max_new_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                do_sample: true,
                return_full_text: false,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[PromptEnhancer] Model ${model} failed:`, errorText);
          lastError = new Error(errorText);
          continue;
        }

        const data = await response.json();
        
        // Обработка ответа
        let enhanced = '';
        if (Array.isArray(data) && data[0]?.generated_text) {
          enhanced = data[0].generated_text;
        } else if (data.generated_text) {
          enhanced = data.generated_text;
        } else if (typeof data === 'string') {
          enhanced = data;
        } else {
          console.warn(`[PromptEnhancer] Unexpected response format from ${model}`);
          continue;
        }

        // Агрессивная очистка результата
        enhanced = cleanEnhancedPrompt(enhanced, prompt);

        if (enhanced && enhanced.length > 20 && enhanced !== prompt) {
          console.log(`[PromptEnhancer] ✅ Successfully enhanced with ${model}`);
          console.log(`[PromptEnhancer] Original length: ${prompt.length}, Enhanced length: ${enhanced.length}`);
          console.log(`[PromptEnhancer] Original: ${prompt.substring(0, 100)}...`);
          console.log(`[PromptEnhancer] Enhanced: ${enhanced.substring(0, 100)}...`);
          return enhanced;
        } else {
          console.warn(`[PromptEnhancer] Model ${model} returned invalid result`);
        }
      } catch (error) {
        console.warn(`[PromptEnhancer] Error with model ${model}:`, error);
        lastError = error;
        continue;
      }
    }

    // Если все модели не сработали, используем fallback
    console.warn('[PromptEnhancer] All AI models failed, using fallback');
    return smartEnhancePrompt(prompt);
  } catch (error) {
    console.error('[PromptEnhancer] Error:', error);
    return smartEnhancePrompt(prompt);
  }
}

/**
 * Очищает улучшенный промпт от мусора
 */
function cleanEnhancedPrompt(enhanced: string, original: string): string {
  // Удаляем системные фразы
  enhanced = enhanced
    .replace(/^<s>\[INST\][\s\S]*?\[\/INST\]/, '')
    .replace(/^.*?Enhanced prompt:?\s*/i, '')
    .replace(/^.*?Here is:?\s*/i, '')
    .replace(/^.*?Improved prompt:?\s*/i, '')
    .replace(/^.*?Better prompt:?\s*/i, '')
    .replace(/^Enhance this.*?prompt:\s*/i, '')
    .replace(/^YouTube thumbnail prompt:\s*/i, '')
    .replace(/^Prompt:\s*/i, '')
    .replace(/^Output:\s*/i, '')
    .replace(/^Result:\s*/i, '')
    .trim();

  // Удаляем кавычки в начале и конце
  enhanced = enhanced.replace(/^["']|["']$/g, '');

  // Удаляем повторяющийся оригинальный промпт
  if (enhanced.toLowerCase().startsWith(original.toLowerCase())) {
    enhanced = enhanced.slice(original.length).trim();
  }

  // Удаляем лишние пробелы и переносы строк
  enhanced = enhanced
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  return enhanced;
}

/**
 * Улучшает промпт для генерации изображений
 * Добавляет детали, улучшает структуру и делает промпт более эффективным
 */
export function enhancePrompt(input: GenerationInput): string {
  const parts: string[] = [];
  
  // 1. Основное описание (если есть)
  if (input.generalDescription.trim()) {
    parts.push(input.generalDescription.trim());
  }

  // 2. Детали лица/персонажа
  if (input.details.face.trim()) {
    parts.push(`Subject: ${input.details.face.trim()}`);
  }

  // 3. Эмоция
  if (input.details.emotion.trim()) {
    parts.push(`with ${input.details.emotion} expression, highly expressive and dramatic`);
  }

  // 4. Объекты
  if (input.details.objects.trim()) {
    parts.push(`featuring ${input.details.objects.trim()}`);
  }

  // 5. Фон
  if (input.details.background.trim()) {
    parts.push(`background: ${input.details.background.trim()}`);
  }

  // 6. Цвета
  if (input.details.colors.trim()) {
    parts.push(`color palette: ${input.details.colors.trim()}, highly saturated`);
  }

  // 7. Текст на миниатюре
  if (input.details.thumbnailText.trim()) {
    parts.push(`bold impactful text overlay reading "${input.details.thumbnailText.trim()}", large sans-serif font, white text with drop shadow`);
  }

  // 8. Композиция
  if (input.details.composition.trim()) {
    parts.push(`composition: ${input.details.composition.trim()}`);
  }

  // 9. Стиль
  if (input.details.style.trim()) {
    parts.push(`style: ${input.details.style.trim()}`);
  }

  // 10. Дополнительные детали
  if (input.details.extraDetails.trim()) {
    parts.push(input.details.extraDetails.trim());
  }

  // 11. Добавляем упоминание об исходных изображениях
  if (input.sourceImageUrls && input.sourceImageUrls.length > 0) {
    parts.push('incorporating visual elements from the provided source images');
  }

  // 12. Добавляем упоминание о референсе
  if (input.referenceImageUrl) {
    parts.push('matching the visual style and layout of the reference thumbnail provided');
  }

  // 13. Общие улучшения для YouTube миниатюр
  const youtubeEnhancements = [
    'YouTube thumbnail',
    'ultra high contrast',
    'eye-catching clickbait composition',
    'vivid oversaturated colors',
    'studio-quality photography',
    '16:9 aspect ratio',
    'pin-sharp focus on subject',
    'dramatic cinematic lighting',
    'strong visual hierarchy',
    'professional retouching'
  ];

  parts.push(youtubeEnhancements.join(', '));

  // Объединяем все части
  let enhancedPrompt = parts.join(', ');

  // Очистка и форматирование
  enhancedPrompt = enhancedPrompt
    .replace(/,\s*,/g, ',') // Убираем двойные запятые
    .replace(/\s+/g, ' ') // Убираем лишние пробелы
    .trim();

  return enhancedPrompt;
}

/**
 * Создает негативный промпт для улучшения качества
 */
export function createNegativePrompt(): string {
  const negativeElements = [
    'blurry',
    'out of focus',
    'low quality',
    'pixelated',
    'jpeg artifacts',
    'watermark',
    'text errors',
    'typos',
    'bad anatomy',
    'distorted face',
    'deformed',
    'ugly',
    'dull colors',
    'flat lighting',
    'boring composition',
    'cluttered background',
    'amateurish',
    'overexposed',
    'underexposed',
    'noise',
    'grain'
  ];

  return negativeElements.join(', ');
}

/**
 * Улучшает промпт с помощью простых эвристик (fallback)
 */
export function smartEnhancePrompt(prompt: string): string {
  let enhanced = prompt.trim();

  // Удаляем лишние пробелы и переносы строк
  enhanced = enhanced.replace(/\s+/g, ' ').trim();

  // Добавляем качественные модификаторы если их нет
  const qualityKeywords = ['high quality', 'detailed', 'professional', '4k', '8k', 'hd', 'ultra', 'sharp'];
  const hasQuality = qualityKeywords.some(kw => enhanced.toLowerCase().includes(kw));
  
  if (!hasQuality) {
    enhanced = `${enhanced}, professional high quality, extremely detailed, ultra sharp focus`;
  }

  // Добавляем освещение если не указано
  const lightingKeywords = ['lighting', 'light', 'illuminated', 'bright', 'dark', 'cinematic', 'dramatic'];
  const hasLighting = lightingKeywords.some(kw => enhanced.toLowerCase().includes(kw));
  
  if (!hasLighting) {
    enhanced = `${enhanced}, dramatic cinematic lighting, studio quality`;
  }

  // Добавляем камеру/перспективу если не указано
  const cameraKeywords = ['shot', 'angle', 'view', 'perspective', 'camera', 'composition'];
  const hasCamera = cameraKeywords.some(kw => enhanced.toLowerCase().includes(kw));
  
  if (!hasCamera) {
    enhanced = `${enhanced}, professional composition, perfect framing`;
  }

  // Добавляем цветовые модификаторы для YouTube миниатюр
  const colorKeywords = ['vibrant', 'saturated', 'vivid', 'bold colors', 'color'];
  const hasColor = colorKeywords.some(kw => enhanced.toLowerCase().includes(kw));
  
  if (!hasColor) {
    enhanced = `${enhanced}, vibrant saturated colors, high contrast`;
  }

  // Добавляем специфичные модификаторы для YouTube
  const youtubeKeywords = ['youtube', 'thumbnail', 'clickbait', 'eye-catching', 'attention'];
  const hasYoutube = youtubeKeywords.some(kw => enhanced.toLowerCase().includes(kw));
  
  if (!hasYoutube) {
    enhanced = `${enhanced}, eye-catching YouTube thumbnail style, attention-grabbing composition`;
  }

  // Оптимизируем промпт
  enhanced = optimizePrompt(enhanced);

  return enhanced;
}

/**
 * Оптимизирует промпт: удаляет дубликаты, сокращает длину
 */
function optimizePrompt(prompt: string): string {
  // Разбиваем на части по запятым
  const parts = prompt.split(',').map(p => p.trim()).filter(p => p.length > 0);
  
  // Удаляем дубликаты (case-insensitive)
  const seen = new Set<string>();
  const unique: string[] = [];
  
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      unique.push(part);
    }
  }
  
  // Объединяем обратно
  let optimized = unique.join(', ');
  
  // Удаляем двойные запятые и лишние пробелы
  optimized = optimized
    .replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Ограничиваем длину (некоторые модели имеют лимиты)
  const maxLength = 500;
  if (optimized.length > maxLength) {
    // Обрезаем по последней запятой перед лимитом
    const truncated = optimized.substring(0, maxLength);
    const lastComma = truncated.lastIndexOf(',');
    if (lastComma > 0) {
      optimized = truncated.substring(0, lastComma);
    } else {
      optimized = truncated;
    }
  }
  
  return optimized;
}

/**
 * Prompt Enhancer X2 - Усиленное улучшение промптов
 * Превращает короткие описания в детальные профессиональные промпты
 * Использует Groq API для быстрого и качественного улучшения
 */
export async function enhancePromptX2(prompt: string): Promise<string> {
  try {
    const systemPrompt = `Ты эксперт по написанию промптов для генерации изображений ИИ. Твоя задача — превратить короткое описание в высокодетализированный, кинематографичный и атмосферный промпт на русском языке.

Правила:
1. Используй художественный и выразительный стиль.
2. Обязательно добавь описание освещения (динамичный свет, отражения, тени).
3. Добавь описание деталей объекта (текстура, взгляд, фактура).
4. Опиши окружение (глубина, природные или другие элементы, ощущение живого пространства).
5. Завершай промпт фразой о композиции (кинематографично и гармонично).
6. Верни ТОЛЬКО улучшенный промпт, без каких-либо вводных слов или объяснений.
7. Промпт должен быть на русском языке.
8. Обязательно сохраняй исходный объект, бренды, имена, числа и денежные суммы без потери смысла.
9. Не пиши общий текст "добавьте объект", если в исходнике уже указан конкретный объект.

Пример:
Input: "добавь крокодила"
Output: "Создай высокодетализированную, атмосферную сцену, в которой сочетаются реализм и художественная выразительность. На переднем плане присутствует крокодил — мощный, детализированный, с текстурой влажной чешуи и выразительным взглядом. Окружение наполнено динамичным светом и глубиной: добавь природные элементы, отражения в воде, тени и мелкие детали, создающие ощущение живого пространства. Композиция должна выглядеть кинематографично и гармонично!"`;

    const userPrompt = `Улучши этот промпт, сохранив конкретику и смысл исходного запроса:\n\n${prompt}`;

    try {
      console.log(`[PromptEnhancerX2] Enhancing with Groq...`);
      
      const enhanced = await callGroq(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        'openai/gpt-oss-120b',
        0.6,
        800
      );

      // Очистка результата
      const cleaned = cleanEnhancedPromptX2(enhanced, prompt);

      if (cleaned && cleaned.length > 20 && cleaned !== prompt) {
        console.log(`[PromptEnhancerX2] ✅ Enhanced with Groq`);
        console.log(`[PromptEnhancerX2] Original: ${prompt.substring(0, 50)}...`);
        console.log(`[PromptEnhancerX2] Enhanced: ${cleaned.substring(0, 100)}...`);
        return cleaned;
      } else {
        console.warn('[PromptEnhancerX2] Groq returned invalid result, using fallback');
        return smartEnhancePromptX2(prompt);
      }
    } catch (groqError) {
      console.warn('[PromptEnhancerX2] Groq failed, using fallback:', groqError);
      return smartEnhancePromptX2(prompt);
    }
  } catch (error) {
    console.error('[PromptEnhancerX2] Error:', error);
    return smartEnhancePromptX2(prompt);
  }
}

/**
 * Очистка улучшенного промпта X2
 */
function cleanEnhancedPromptX2(enhanced: string, original: string): string {
  // Удаляем системные фразы
  enhanced = enhanced
    .replace(/^<s>\[INST\][\s\S]*?\[\/INST\]/, '')
    .replace(/^.*?Enhanced prompt:?\s*/i, '')
    .replace(/^.*?Here is:?\s*/i, '')
    .replace(/^.*?Improved prompt:?\s*/i, '')
    .replace(/^.*?Better prompt:?\s*/i, '')
    .replace(/^Enhance this.*?prompt:\s*/i, '')
    .replace(/^Output:\s*/i, '')
    .replace(/^Result:\s*/i, '')
    .trim();

  // Удаляем кавычки
  enhanced = enhanced.replace(/^["']|["']$/g, '');

  // Удаляем повторяющийся оригинальный промпт
  if (enhanced.toLowerCase().startsWith(original.toLowerCase())) {
    enhanced = enhanced.slice(original.length).trim();
  }

  // Удаляем лишние пробелы
  enhanced = enhanced
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  return enhanced;
}

/**
 * Fallback X2 enhancement без AI
 */
function smartEnhancePromptX2(prompt: string): string {
  const enhanced = prompt.trim();
  
  // Определяем язык
  const isRussian = /[а-яА-Я]/.test(enhanced);
  
  // Позиции
  const positions = isRussian 
    ? [
        'левом нижнем углу изображения',
        'правом верхнем углу композиции',
        'центре кадра',
        'на переднем плане',
        'на заднем плане слева',
      ]
    : [
        'bottom left corner of the image',
        'top right corner of the composition',
        'center of the frame',
        'in the foreground',
        'in the background on the left',
      ];
  
  const position = positions[Math.floor(Math.random() * positions.length)];
  
  // Шаблоны для русского языка
  if (isRussian) {
    // Определяем тип объекта
    const lowerPrompt = enhanced.toLowerCase();
    
    if (lowerPrompt.includes('крокодил') || lowerPrompt.includes('животн') || lowerPrompt.includes('птиц') || lowerPrompt.includes('зверь')) {
      return `Добавьте реалистичного ${enhanced}, расположенного в ${position}, с детализированной текстурой кожи и шерсти, естественным освещением создающим мягкие тени и блики, чтобы он органично вписался в композицию и создавал эффект присутствия, профессиональная фотография дикой природы, высокая детализация каждой текстуры, 4K качество, резкий фокус на главном объекте, кинематографическое освещение`;
    } else if (lowerPrompt.includes('человек') || lowerPrompt.includes('персон') || lowerPrompt.includes('люд') || lowerPrompt.includes('модель')) {
      return `Добавьте ${enhanced}, расположенного в ${position}, с естественным выражением лица и позой, профессиональное студийное освещение подчеркивающее детали, детализированная текстура кожи и одежды, чтобы создать реалистичный эффект присутствия, портретная фотография высокого качества, 4K разрешение, резкий фокус на глазах, кинематографическая композиция`;
    } else {
      return `Добавьте ${enhanced}, расположенный в ${position}, с реалистичной текстурой и материалами, профессиональное освещение подчеркивающее все детали и формы, чтобы органично вписаться в сцену и создать гармоничную композицию, коммерческая фотография высокого качества, высокая детализация, 4K качество, резкий фокус, драматическое освещение`;
    }
  } else {
    // Английский шаблон
    const lowerPrompt = enhanced.toLowerCase();
    
    if (lowerPrompt.includes('animal') || lowerPrompt.includes('creature') || lowerPrompt.includes('bird')) {
      return `Add a realistic ${enhanced}, positioned in the ${position}, with detailed skin and fur texture, natural lighting creating soft shadows and highlights, to organically fit into the composition and create a sense of presence, professional wildlife photography, high detail of every texture, 4K quality, sharp focus on the main subject, cinematic lighting`;
    } else if (lowerPrompt.includes('person') || lowerPrompt.includes('human') || lowerPrompt.includes('model')) {
      return `Add ${enhanced}, positioned in the ${position}, with natural facial expression and pose, professional studio lighting highlighting details, detailed skin and clothing texture, to create a realistic sense of presence, high-quality portrait photography, 4K resolution, sharp focus on eyes, cinematic composition`;
    } else {
      return `Add ${enhanced}, positioned in the ${position}, with realistic texture and materials, professional lighting emphasizing all details and forms, to organically fit into the scene and create a harmonious composition, high-quality commercial photography, high detail, 4K quality, sharp focus, dramatic lighting`;
    }
  }
}
