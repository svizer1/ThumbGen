/**
 * ThumbBot AI Assistant
 * Intelligent chatbot that helps users with the website
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  userId?: string;
  currentPage?: string;
  userPlan?: string;
}

// Site knowledge base
const SITE_KNOWLEDGE = {
  features: {
    'генератор v1': 'Основной генератор миниатюр с детальными настройками, поддержка референсных изображений и AI промптов',
    'генератор v2': 'Продвинутый генератор с 15 профессиональными паками примеров (Майнкрафт, стант вело, питбайк, AI технологии и др.). Доступен с Pro подпиской',
    'улучшение изображений': 'AI улучшение: upscaling до 8K, face enhancement, удаление фона, улучшение качества. Доступно с Starter подпиской',
    'wildberries': 'Генератор карточек товаров для Wildberries: основное изображение, инфографика, множественные ракурсы, SEO описания. Доступен с Pro подпиской',
    'prompt enhancer x2': 'Усиленное улучшение промптов - превращает короткие описания в детальные профессиональные промпты',
  },
  subscriptions: {
    free: {
      price: 0,
      features: ['10 генераций при регистрации', 'Базовые модели', 'Watermark', 'История 7 дней'],
    },
    starter: {
      price: 5,
      features: ['200 генераций/месяц', 'Все модели', 'Без watermark', 'История 30 дней', 'Базовое улучшение изображений'],
    },
    pro: {
      price: 15,
      features: ['600 генераций/месяц', 'Генерация V2 с 15 паками', 'Prompt Enhancer X2', 'Полное улучшение изображений', 'Wildberries генератор (базовый)', 'ThumbBot AI помощник', 'API доступ'],
    },
    unlimited: {
      price: 30,
      features: ['∞ Безлимитные генерации', 'Все функции Pro', 'Wildberries расширенный', 'Batch processing', 'Персональная поддержка 24/7'],
    },
  },
  models: {
    bytez: 'Google Imagen 4, Gemini Flash, FLUX - лучшее качество',
    huggingface: 'Stable Diffusion XL - бесплатные кредиты',
    'google-ai': 'Nano Banana 2 - требует биллинг',
    puter: 'Бесплатная генерация без API ключей',
  },
};

/**
 * Process user message and generate response
 */
export async function processMessage(
  message: string,
  context: ChatContext = {}
): Promise<string> {
  try {
    const lowerMessage = message.toLowerCase();

    // Quick responses for common questions
    if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
      return `Привет! 👋 Я ThumbBot, ваш AI помощник. Я помогу вам с:
• Созданием промптов для миниатюр
• Выбором подходящей подписки
• Объяснением функций сайта
• Советами по улучшению миниатюр

Чем могу помочь?`;
    }

    if (lowerMessage.includes('подписк') || lowerMessage.includes('тариф') || lowerMessage.includes('план')) {
      return explainSubscriptions(context.userPlan);
    }

    if (lowerMessage.includes('генератор v2') || lowerMessage.includes('паки') || lowerMessage.includes('примеры')) {
      return `**Генератор V2** 🎨

15 профессиональных паков примеров:
• Майнкрафт читы ⛏️
• Стант на вело 🚴
• Стант на питбайке 🏍️
• AI технологии 🤖
• Кликбейт реакции 😱
• Финансовый успех 💰
• Игровой геймплей 🎮
• И многое другое!

Каждый пак содержит готовые настройки для идеальной миниатюры.

**Требуется:** Pro или Unlimited подписка
**Стоимость:** 1 кредит за генерацию`;
    }

    if (lowerMessage.includes('улучшение') || lowerMessage.includes('upscale') || lowerMessage.includes('качество')) {
      return `**Улучшение Изображений** ✨

Доступные функции:
• 🔍 **Upscaling** - увеличение до 8K (2x, 4x, 8x)
• 😊 **Face Enhancement** - улучшение портретов
• 🎨 **Background Removal** - удаление фона
• ✨ **Quality Enhancement** - шумоподавление, резкость

**Требуется:** Starter+ подписка
**Стоимость:** 2 кредита за улучшение`;
    }

    if (lowerMessage.includes('wildberries') || lowerMessage.includes('вб') || lowerMessage.includes('карточк')) {
      return `**Wildberries Генератор** 🛍️

Создание профессиональных карточек товаров:
• Основное изображение (700×900, белый фон)
• Инфографика с характеристиками (Unlimited)
• Множественные ракурсы (Unlimited)
• SEO-оптимизированные описания

**Требуется:** Pro+ подписка
**Стоимость:** 3 кредита (базовый), 5 кредитов (расширенный)`;
    }

    if (lowerMessage.includes('промпт') || lowerMessage.includes('как написать') || lowerMessage.includes('как создать')) {
      return helpWithPrompt(message);
    }

    if (lowerMessage.includes('кредит') || lowerMessage.includes('баланс')) {
      return `**Система Кредитов** 💳

• 1 кредит = 1 генерация миниатюры
• 2 кредита = улучшение изображения
• 3-5 кредитов = Wildberries карточка

**Как получить кредиты:**
• 10 бесплатных при регистрации
• Подписка (обновляются каждый месяц)
• Покупка пакетов кредитов

Кредиты из подписки обновляются ежемесячно, купленные кредиты не сгорают!`;
    }

    // Try AI-powered response
    return await generateAIResponse(message, context);
  } catch (error) {
    console.error('[ThumbBot] Error processing message:', error);
    return 'Извините, произошла ошибка. Попробуйте переформулировать вопрос или обратитесь в поддержку.';
  }
}

/**
 * Explain subscriptions
 */
function explainSubscriptions(currentPlan?: string): string {
  const plans = SITE_KNOWLEDGE.subscriptions;
  
  let response = '**Доступные Подписки** 💎\n\n';
  
  Object.entries(plans).forEach(([key, plan]) => {
    const isCurrent = currentPlan === key;
    const emoji = key === 'free' ? '🆓' : key === 'starter' ? '⭐' : key === 'pro' ? '👑' : '💫';
    
    response += `${emoji} **${key.toUpperCase()}** - $${plan.price}/мес${isCurrent ? ' (Ваш план)' : ''}\n`;
    plan.features.forEach(f => response += `  • ${f}\n`);
    response += '\n';
  });
  
  response += 'Выберите план на странице /pricing';
  
  return response;
}

/**
 * Help with prompt creation
 */
function helpWithPrompt(userMessage: string): string {
  return `**Советы по Созданию Промптов** 📝

**Структура хорошего промпта:**
1. **Главный объект** - что должно быть на миниатюре
2. **Эмоция** - shocked, excited, serious, happy
3. **Композиция** - close-up, split screen, center focus
4. **Цвета** - яркие, контрастные для YouTube
5. **Стиль** - cinematic, dramatic, professional
6. **Текст** - крупный, читаемый

**Пример:**
"Удивлённый человек смотрит на огромную стопку денег, драматичное освещение, яркие цвета (красный и жёлтый), текст 'Я ЗАРАБОТАЛ $10,000', кинематографичная композиция"

**Используйте:**
• Prompt Enhancer X2 для автоматического улучшения
• Генератор V2 с готовыми паками примеров
• Референсные изображения для стиля

Нужна помощь с конкретным промптом? Опишите вашу идею!`;
}

/**
 * Generate AI-powered response using Hugging Face
 */
async function generateAIResponse(
  message: string,
  context: ChatContext
): Promise<string> {
  try {
    const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    
    if (!hfKey) {
      return 'Извините, я не могу ответить на этот вопрос. Попробуйте спросить о подписках, функциях или создании промптов.';
    }

    const systemPrompt = `You are ThumbBot, an AI assistant for ThumbGen AI - a YouTube thumbnail generator website. 

Your knowledge:
- Features: Generator V1, Generator V2 (15 packs), Image Enhancement, Wildberries Generator, Prompt Enhancer X2
- Subscriptions: Free ($0), Starter ($5), Pro ($15), Unlimited ($30)
- Models: Bytez (best quality), Hugging Face, Google AI, Puter.js

Answer in Russian language. Be helpful, concise, and friendly. If you don't know something, suggest checking the pricing page or documentation.

User's current plan: ${context.userPlan || 'unknown'}
Current page: ${context.currentPage || 'unknown'}

User question: ${message}

Provide a helpful answer in Russian (max 200 words):`;

    const models = [
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'meta-llama/Meta-Llama-3-8B-Instruct',
    ];

    for (const model of models) {
      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: `<s>[INST] ${systemPrompt} [/INST]`,
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

        if (response.ok) {
          const data = await response.json();
          let answer = '';
          
          if (Array.isArray(data) && data[0]?.generated_text) {
            answer = data[0].generated_text;
          } else if (data.generated_text) {
            answer = data.generated_text;
          }

          if (answer && answer.length > 20) {
            return answer.trim();
          }
        }
      } catch (error) {
        console.warn(`[ThumbBot] Model ${model} failed:`, error);
        continue;
      }
    }

    // Fallback response
    return `Я могу помочь вам с:
• Выбором подписки
• Созданием промптов
• Объяснением функций
• Советами по миниатюрам

Задайте более конкретный вопрос, и я постараюсь помочь!`;
  } catch (error) {
    console.error('[ThumbBot] AI response error:', error);
    return 'Извините, произошла ошибка. Попробуйте переформулировать вопрос.';
  }
}

/**
 * Get quick action suggestions
 */
export function getQuickActions(context: ChatContext): string[] {
  const actions = [
    'Помощь с промптом',
    'Какую подписку выбрать?',
    'Как работает Генератор V2?',
    'Что такое Prompt Enhancer X2?',
  ];

  if (context.userPlan === 'free') {
    actions.push('Как получить больше кредитов?');
  }

  return actions;
}
