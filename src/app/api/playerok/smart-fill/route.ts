import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq-client';
import type { PlayerokCategory } from '@/lib/playerok-cards';

interface SmartFillData {
  category: PlayerokCategory;
  description: string;
}

const CATEGORY_KEYWORDS: Array<{ category: PlayerokCategory; terms: string[] }> = [
  { category: 'accounts', terms: ['аккаунт', 'account', 'steam', 'epic', 'origin', 'uplay'] },
  { category: 'skins', terms: ['скин', 'skin', 'нож', 'ножик', 'кейс', 'кейсы'] },
  { category: 'boost', terms: ['буст', 'boost', 'ранг', 'mmr', 'elo', 'поднятие'] },
  { category: 'services', terms: ['подписк', 'service', 'услуг', 'настройк', 'помощ', 'коучинг'] },
];

function normalizeSmartFillDescription(value: string): string {
  const text = value.trim();
  if (text.length < 120) {
    return (
      `${text} ` +
      'Сделка проходит с подтверждением ключевых данных и понятными условиями для обеих сторон.'
    ).trim();
  }
  return text;
}

function inferCategoryFromName(productName: string): PlayerokCategory {
  const normalized = productName.trim().toLowerCase();
  for (const item of CATEGORY_KEYWORDS) {
    if (item.terms.some((term) => normalized.includes(term))) {
      return item.category;
    }
  }
  return 'services';
}

function buildFallbackDescription(productName: string, category: PlayerokCategory): string {
  const base = productName.trim();
  if (category === 'accounts') {
    return `${base} с быстрой и безопасной передачей данных владельцу. Проверка ключевых параметров перед выдачей снижает риски и ускоряет сделку. Подходит для тех, кто хочет сразу начать пользоваться аккаунтом без лишних ожиданий.`;
  }
  if (category === 'skins') {
    return `${base} с акцентом на быструю выдачу и прозрачные условия покупки. Продавец подтверждает комплект и статус предметов перед передачей, чтобы снизить риск спорных ситуаций. Оптимальный вариант для безопасной покупки скинов на Playerok.`;
  }
  if (category === 'boost') {
    return `${base} с понятным результатом, сроками и сопровождением на каждом этапе. Формат услуги позволяет быстро получить нужный прогресс без лишней рутины. Сделка проходит через безопасный сценарий передачи и контроля результата на Playerok.`;
  }
  return `${base} с быстрой обработкой заказа и поддержкой продавца до завершения сделки. Условия передачи заранее фиксируются, что повышает прозрачность и доверие между сторонами. Практичный вариант для безопасной покупки услуги на Playerok.`;
}

function parseSmartFillJson(response: string): Partial<SmartFillData> {
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned) as Partial<SmartFillData>;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const maybeJson = cleaned.slice(start, end + 1);
      return JSON.parse(maybeJson) as Partial<SmartFillData>;
    }
    throw new Error('Failed to parse smart fill JSON');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json();
    if (!productName || typeof productName !== 'string' || !productName.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const systemPrompt = `Ты senior-копирайтер по digital-товарам для маркетплейса Playerok.
Нужно определить подходящую категорию и написать сильное продающее описание карточки товара.
Требования к описанию:
- 3-4 предложения, 120-220 символов минимум;
- упор на выгоду, безопасность сделки, скорость передачи;
- без воды и общих фраз, конкретно и убедительно;
- русский язык, без эмодзи.
Верни ТОЛЬКО JSON:
{
  "category": "accounts|skins|boost|services",
  "description": "сильное продающее описание"
}
Категория должна быть строго из списка.`;

    const userPrompt = `Заполни карточку для товара: ${productName}`;
    const fallbackCategory = inferCategoryFromName(productName);
    const fallbackData: SmartFillData = {
      category: fallbackCategory,
      description: buildFallbackDescription(productName, fallbackCategory),
    };

    try {
      const response = await callGroq(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        'openai/gpt-oss-120b',
        0.5,
        400
      );

      const parsed = parseSmartFillJson(response);
      const category = parsed.category && ['accounts', 'skins', 'boost', 'services'].includes(parsed.category)
        ? parsed.category
        : fallbackCategory;

      const description = parsed.description
        ? normalizeSmartFillDescription(parsed.description)
        : fallbackData.description;

      return NextResponse.json({
        success: true,
        data: {
          category,
          description,
        },
      });
    } catch (error) {
      console.warn('[playerok/smart-fill] fallback due to AI error:', error);
      return NextResponse.json({ success: true, data: fallbackData, fallback: true });
    }
  } catch (error) {
    console.error('[playerok/smart-fill] Error:', error);
    return NextResponse.json(
      { error: 'Smart fill failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
