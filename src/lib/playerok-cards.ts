export type PlayerokCategory = 'accounts' | 'skins' | 'boost' | 'services';
export type PlayerokStatus = 'new' | 'hot' | 'discount';
export type PlayerokBannerStyle =
  | 'orange_pro'
  | 'neon_blue'
  | 'dark_market'
  | 'chrome_impact'
  | 'glitch_magenta'
  | 'retro_comic'
  | 'ultra_gold'
  | 'ice_frost'
  | 'toxic_acid'
  | 'original';

export interface PlayerokCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: PlayerokCategory;
  status: PlayerokStatus;
  priceRub: number;
}

export interface PlayerokGenerationInput {
  productName: string;
  description: string;
  category: PlayerokCategory;
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

const TITLE_TEMPLATES: Record<PlayerokCategory, string[]> = {
  accounts: ['Прокачанный аккаунт', 'Соло-аккаунт', 'Турнирный аккаунт', 'Премиум профиль'],
  skins: ['Редкий скин', 'Легендарный набор', 'Коллекционный предмет', 'Эксклюзивный дроп'],
  boost: ['Быстрый буст', 'Рейтинговый буст', 'Сезонный буст', 'Комплексный буст'],
  services: ['Коучинг с тренером', 'Разбор матчей', 'Настройка профиля', 'Помощь с квестами'],
};

const DESCRIPTION_SNIPPETS = [
  'Мгновенная выдача после оплаты.',
  'Безопасная передача и проверенный продавец.',
  'Поддержка в чате 24/7.',
  'Гарантия возврата при спорной ситуации.',
  'Подходит для большинства регионов.',
];

const STATUS_ROTATION: PlayerokStatus[] = ['new', 'hot', 'discount'];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickBySeed<T>(list: T[], seed: number): T {
  const index = Math.floor(pseudoRandom(seed) * list.length);
  return list[index];
}

function buildImageUrl(seed: number): string {
  const imageId = (seed % 1000) + 1;
  return `https://picsum.photos/seed/playerok-${imageId}/1365/1024`;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function generatePlayerokCards(count: number, searchQuery?: string): PlayerokCard[] {
  const safeCount = Math.max(0, Math.min(2000, count));
  const categories = Object.keys(CATEGORY_LABELS) as PlayerokCategory[];
  const query = searchQuery ? normalizeText(searchQuery) : '';

  const cards = Array.from({ length: safeCount }, (_, index) => {
    const seed = index + 1;
    const category = categories[seed % categories.length];
    const titleBase = pickBySeed(TITLE_TEMPLATES[category], seed * 17);
    const status = STATUS_ROTATION[seed % STATUS_ROTATION.length];
    const priceRub = Math.round(150 + pseudoRandom(seed * 29) * 11850);
    const offerCode = `PLR-${String(seed).padStart(5, '0')}`;

    const title = `${titleBase} ${CATEGORY_LABELS[category]} #${seed}`;
    const description = [
      pickBySeed(DESCRIPTION_SNIPPETS, seed * 13),
      `${CATEGORY_LABELS[category]} • ${offerCode}.`,
      'Ссылка ведет на карточку внутри Playerok.',
    ].join(' ');

    return {
      id: `playerok-${seed}`,
      title,
      description,
      imageUrl: buildImageUrl(seed),
      link: `https://playerok.com/offers/${offerCode.toLowerCase()}`,
      category,
      status,
      priceRub,
    };
  });

  if (!query) {
    return cards;
  }

  return cards.filter((card) => {
    const haystack = `${card.title} ${card.description} ${card.category}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function generatePlayerokCardsFromInput(input: PlayerokGenerationInput): PlayerokCard[] {
  const safeCount = Math.max(1, Math.min(1200, input.count));
  const cleanName = input.productName.trim() || 'Игровой оффер';
  const cleanDescription =
    input.description.trim() || 'Быстрая выдача, безопасная сделка и поддержка продавца.';

  return Array.from({ length: safeCount }, (_, index) => {
    const seed = index + 1;
    const status = STATUS_ROTATION[seed % STATUS_ROTATION.length];
    const priceRub = Math.round(120 + pseudoRandom(seed * 11) * 10880);
    const offerCode = `PLR-GEN-${String(seed).padStart(4, '0')}`;

    return {
      id: `playerok-gen-${seed}`,
      title: `${cleanName} • Вариант ${seed}`,
      description: `${cleanDescription} Категория: ${CATEGORY_LABELS[input.category]}. Лот #${seed}.`,
      imageUrl: `https://picsum.photos/seed/playerok-generated-${seed}/1365/1024`,
      link: `https://playerok.com/offers/${offerCode.toLowerCase()}`,
      category: input.category,
      status,
      priceRub,
    };
  });
}
