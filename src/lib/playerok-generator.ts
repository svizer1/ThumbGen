import { BytezProvider } from '@/lib/providers/bytez';
import type {
  PlayerokBannerStyle,
  PlayerokCard,
  PlayerokCategory,
} from '@/lib/playerok-cards';

export interface PlayerokGenerationPayload {
  productName: string;
  category: PlayerokCategory;
  description: string;
  count: number;
  style?: PlayerokBannerStyle;
  topText?: string;
  middleText?: string;
  bottomText?: string;
  accentText?: string;
}

const CATEGORY_LABELS: Record<PlayerokCategory, string> = {
  accounts: 'Аккаунты',
  skins: 'Скины',
  boost: 'Буст',
  services: 'Услуги',
};

const STATUS_ROTATION: Array<PlayerokCard['status']> = ['new', 'hot', 'discount'];

const STYLE_DIRECTIVES: Record<PlayerokBannerStyle, string> = {
  original:
    'кинематографичный стиль premium game-cover, выразительный игровой фон (карта/арена/город), атмосферный свет, глубина и объем, аккуратные UI-плашки в стиле маркетплейса',
  orange_pro:
    'теплая оранжево-коричневая палитра, толстая оранжевая рамка, мягкая абстрактная текстура фона, контрастные темные и светлые плашки',
  neon_blue:
    'неоновая синяя палитра, кибер glow-эффекты, яркие световые линии, чистая технологичная композиция, глубокий темный фон',
  dark_market:
    'темный маркетплейс стиль, графитовый фон, красно-оранжевые акценты скидок, плотная контрастная типографика и агрессивная промо-подача',
  chrome_impact:
    'черно-графитовый фон, хромированные и серебристые акценты, premium глянец, четкие отражения и контрастная металлическая стилистика',
  glitch_magenta:
    'темный киберпанк фон, фиолетово-розовые неоновые блики, цифровой шум, энергичные световые полосы, эффект динамичного глитча',
  retro_comic:
    'яркий ретро-комикс стиль, halftone текстуры, резкие контуры, взрывные формы, контрастные желто-красно-черные акценты',
  ultra_gold:
    'богатая золотисто-оранжевая палитра, сияющие блики, дорогой премиум вид, мягкие светоореолы и плотная композиция под продажу',
  ice_frost:
    'ледяная сине-бирюзовая палитра, морозные текстуры, кристаллические блики, холодный glow и чистая технологичная атмосфера',
  toxic_acid:
    'черный фон с кислотно-зелеными акцентами, дерзкий уличный стиль, высокая контрастность, агрессивные диагонали и энергичная графика',
};

const STYLE_TYPOGRAPHY: Record<PlayerokBannerStyle, string> = {
  original:
    'крупный современный жирный шрифт, чистая иерархия, комбинированные эффекты (мягкая тень + контур + легкий glow), максимальная читаемость кириллицы',
  orange_pro:
    'жирный геометрический шрифт, легкая тень и четкая обводка, высокая читаемость на плашках',
  neon_blue:
    'техно-типографика с неоновым свечением, двойной контур и мягкий outer glow',
  dark_market:
    'массивные символы, плотная черная обводка, грубый маркетплейс акцент и высокий контраст',
  chrome_impact:
    'металлический 3D-текст, светлые верхние блики, темный низ, толстый контур и ударная тень',
  glitch_magenta:
    'глитч-типографика с RGB-смещением контуров, легкий digital ghosting и резкая читаемость',
  retro_comic:
    'комиксный жирный шрифт, толстая черная обводка, ударные белые внутренние блики и pop-art подача',
  ultra_gold:
    'золотой объемный текст с мягким внутренним свечением, яркой кромкой и премиальной глубиной',
  ice_frost:
    'ледяной текст с бело-голубым градиентом, кристаллическими отблесками и чистой контурной обводкой',
  toxic_acid:
    'кислотный стрит-стиль шрифта, неровные агрессивные формы, толстая темная обводка и контрастный glow',
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildPrompt(input: PlayerokGenerationPayload, index: number): string {
  const angleText = ['center product focus', 'dynamic angle', 'minimal clean angle'][index % 3];
  const style = input.style ?? 'orange_pro';
  const isOriginalStyle = style === 'original';
  const topText = (input.topText || input.productName || 'PREMIUM ПОДПИСКА').trim();
  const middleText = (input.middleText || '1 МЕСЯЦ').trim();
  const bottomText = (input.bottomText || 'ПОДПИСКА PRO').trim();
  const accentText = (input.accentText || '★').trim();
  const typography = STYLE_TYPOGRAPHY[style];

  const compositionDirective = isOriginalStyle
    ? 'герой-персонаж размещен по правилу третей (не перекрывает текст), игровой фон с глубиной резкости, foreground/midground/background слои, динамичные световые акценты, чистая зона под текстовые плашки'
    : `${angleText}, modern ecommerce banner, 4:3 card cover, high contrast, professional product ad image`;

  return `Создай продающее изображение карточки товара для marketplace Playerok.
Товар: ${input.productName}
Категория: ${CATEGORY_LABELS[input.category]}
Описание: ${input.description}
Стиль: ${STYLE_DIRECTIVES[style]}.
Типографика: ${typography}.
Композиция: ${compositionDirective}.
Критично: на баннере должен быть читаемый текст тремя блоками, кириллица, жирный шрифт, выразительные эффекты текста (обводка, тень, свечение или 3D-объем в зависимости от стиля).
Текст верхней строки: "${topText}".
Текст центральной плашки (самый крупный): "${middleText}".
Текст нижней кнопки/плашки: "${bottomText}".
Дополнительный акцент справа: "${accentText}".
Сделай визуально похоже на промо-карточки Playerok: крупные плашки, рамка, четкая иерархия текста, без посторонних логотипов.
Нельзя искажать буквы: кириллица должна быть корректной, легко читаемой и без артефактов.`;
}

async function generateImage(prompt: string, seed: number): Promise<string> {
  const bytezKey = process.env.BYTEZ_API_KEY;
  if (!bytezKey) {
    return `https://picsum.photos/seed/playerok-ai-fallback-${seed}/1365/1024`;
  }

  const provider = new BytezProvider(bytezKey, 'google/gemini-3.1-flash-image-preview');
  const result = await provider.generate({
    prompt,
    negativePrompt: 'watermark, blurry, low quality, random logo, unreadable typography, distorted letters',
    width: 1365,
    height: 1024,
    generationType: 'text-to-image',
  });

  if (!result.imageUrl) {
    return `https://picsum.photos/seed/playerok-ai-empty-${seed}/1365/1024`;
  }
  return result.imageUrl;
}

export async function generatePlayerokCardsWithImages(
  input: PlayerokGenerationPayload
): Promise<PlayerokCard[]> {
  const safeCount = 1;
  const generationId = Date.now().toString(36);
  const trimmedName = input.productName.trim() || 'Игровой оффер';
  const trimmedDescription =
    input.description.trim() || 'Быстрая передача, проверенный продавец, безопасная сделка.';
  const hasBytez = Boolean(process.env.BYTEZ_API_KEY);
  const aiImageCount = hasBytez ? Math.min(safeCount, 12) : 0;

  const cards: PlayerokCard[] = [];
  for (let index = 0; index < safeCount; index += 1) {
    const seed = index + 1;
    const prompt = buildPrompt(input, index);
    const imageUrl =
      index < aiImageCount
        ? await generateImage(prompt, seed)
        : `https://picsum.photos/seed/playerok-batch-${seed}/1365/1024`;
    const priceRub = Math.round(120 + pseudoRandom(seed * 11) * 10880);

    cards.push({
      id: `playerok-generated-${generationId}-${seed}`,
      title: `${trimmedName} • Вариант ${seed}`,
      description: `${trimmedDescription} Категория: ${CATEGORY_LABELS[input.category]}.`,
      imageUrl,
      link: imageUrl,
      category: input.category,
      status: STATUS_ROTATION[seed % STATUS_ROTATION.length],
      priceRub,
    });
  }

  return cards;
}
