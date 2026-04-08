import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq-client';

/**
 * Wildberries Smart Fill API Endpoint
 * Uses Groq AI to automatically fill product card fields
 */
export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json();

    if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    console.log(`[wildberries/smart-fill] Generating data for: "${productName}"`);

    const systemPrompt = `Ты эксперт по маркетплейсам и созданию карточек товаров для Wildberries. 
Твоя задача - создать полную информацию для карточки товара на основе названия товара.

Верни ответ СТРОГО в формате JSON без дополнительного текста:
{
  "category": "категория товара",
  "description": "краткое описание товара (2-3 предложения)",
  "features": ["характеристика 1", "характеристика 2", "характеристика 3", "характеристика 4", "характеристика 5"],
  "infographicTitle": "заголовок для инфографики",
  "specs": [
    {"label": "Материал", "value": "значение"},
    {"label": "Размер", "value": "значение"},
    {"label": "Вес", "value": "значение"},
    {"label": "Цвет", "value": "значение"}
  ]
}

Требования:
- Категория должна быть конкретной (например: "Электроника", "Одежда", "Косметика")
- Описание должно быть продающим и информативным
- Характеристики должны быть конкретными и полезными для покупателя
- Спецификации должны быть реалистичными для данного товара
- Все на русском языке`;

    const userPrompt = `Создай карточку товара для: ${productName}`;

    try {
      const response = await callGroq(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        'openai/gpt-oss-120b',
        0.7,
        1000
      );

      // Parse JSON response
      let data;
      try {
        // Remove markdown code blocks if present
        const cleanedResponse = response
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        data = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('[wildberries/smart-fill] Failed to parse JSON:', response);
        throw new Error('Failed to parse AI response');
      }

      // Validate response structure
      if (!data.category || !data.description || !Array.isArray(data.features)) {
        throw new Error('Invalid response structure from AI');
      }

      console.log('[wildberries/smart-fill] Successfully generated product data');

      return NextResponse.json({
        success: true,
        data: {
          category: data.category,
          description: data.description,
          features: data.features.slice(0, 7), // Max 7 features
          infographicTitle: data.infographicTitle || productName,
          specs: data.specs || [],
        }
      });
    } catch (groqError) {
      console.error('[wildberries/smart-fill] Groq error:', groqError);
      
      // Fallback: return basic structure
      return NextResponse.json({
        success: true,
        data: {
          category: 'Товары',
          description: `${productName} - качественный товар для ваших нужд. Отличное соотношение цены и качества.`,
          features: [
            'Высокое качество',
            'Надежность',
            'Современный дизайн',
            'Удобство использования',
            'Долговечность'
          ],
          infographicTitle: productName,
          specs: [
            { label: 'Качество', value: 'Премиум' },
            { label: 'Гарантия', value: '1 год' },
          ],
        },
        fallback: true,
      });
    }
  } catch (error) {
    console.error('[wildberries/smart-fill] Error:', error);
    return NextResponse.json(
      { 
        error: 'Smart fill failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
