import { DetailedFields } from '@/types';

export interface YouTubePack {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  tier: 'free' | 'premium'; // NEW: tier system
  config: {
    generalDescription: string;
    details: DetailedFields;
    imageSize: string;
    generationType: 'text-to-image' | 'image-to-image';
    apiProvider: 'default' | 'puter' | 'bytez' | 'huggingface' | 'google-ai';
    bytezModel?: string;
    huggingfaceModel?: string;
    googleAIModel?: string;
    puterModel?: string;
    puterQuality?: string;
  };
  requiredPlan: 'free' | 'starter' | 'pro' | 'unlimited';
  popularity: number;
}

export const YOUTUBE_PACKS: YouTubePack[] = [
  // 1. Майнкрафт читы (PREMIUM)
  {
    id: 'minecraft-cheats',
    name: 'Майнкрафт Читы',
    category: 'gaming',
    description: 'Секретные читы и хаки для Minecraft',
    thumbnail: '/packs/minecraft-cheats.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'Minecraft gameplay with cheat codes overlay, hacker aesthetic, glowing green matrix code',
      details: {
        face: '',
        emotion: 'excited and mischievous',
        objects: 'Minecraft blocks, diamond sword, cheat menu interface, glowing items',
        background: 'Minecraft world, dark cave with glowing ores, mysterious atmosphere',
        colors: 'neon green, electric blue, dark purple, matrix code aesthetic',
        thumbnailText: 'СЕКРЕТНЫЕ ЧИТЫ',
        composition: 'split screen - gameplay left, cheat menu right',
        style: 'gaming screenshot, hacker aesthetic, glowing UI elements',
        extraDetails: 'matrix code overlay, glowing cheat interface, unlimited diamonds, god mode activated',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 95,
  },

  // 2. Стант на велосипеде (PREMIUM)
  {
    id: 'bmx-stunts',
    name: 'Стант на Вело',
    category: 'extreme-sports',
    description: 'Экстремальные трюки на BMX велосипеде',
    thumbnail: '/packs/bmx-stunts.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'extreme BMX bicycle stunt, rider doing backflip in mid-air, urban skatepark',
      details: {
        face: '',
        emotion: 'adrenaline-filled, fearless',
        objects: 'BMX bike, helmet, protective gear, ramps',
        background: 'urban skatepark, concrete ramps, graffiti walls, sunset lighting',
        colors: 'vibrant orange sunset, deep blue sky, urban grays',
        thumbnailText: 'БЕЗУМНЫЙ ТРЮК',
        composition: 'action shot, rider in mid-air center frame, motion blur',
        style: 'extreme sports photography, GoPro POV, high speed action',
        extraDetails: 'backflip stunt, mid-air rotation, extreme height, perfect form, adrenaline rush',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 88,
  },

  // 3. Стант на питбайке (PREMIUM)
  {
    id: 'pitbike-stunts',
    name: 'Стант на Питбайке',
    category: 'extreme-sports',
    description: 'Опасные трюки на питбайке',
    thumbnail: '/packs/pitbike-stunts.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'extreme pit bike wheelie stunt, rider standing on seat, urban street chase',
      details: {
        face: '',
        emotion: 'fearless, extreme adrenaline',
        objects: 'pit bike, racing helmet, knee pads, wheelie bar',
        background: 'city street, traffic, motion blur, high speed',
        colors: 'dramatic blue and red, motion blur streaks, bright daylight',
        thumbnailText: 'ОПАСНЫЙ СТАНТ',
        composition: 'dynamic action shot, rider center frame doing wheelie',
        style: 'action sports photography, motion blur, extreme sports aesthetic',
        extraDetails: 'standing wheelie, extreme balance, high speed, dangerous maneuver, urban setting',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 92,
  },

  // 4. AI Технологии (PREMIUM)
  {
    id: 'ai-technology',
    name: 'AI Технологии',
    category: 'technology',
    description: 'Искусственный интеллект и нейросети',
    thumbnail: '/packs/ai-tech.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'futuristic AI brain visualization, neural network connections, holographic interface',
      details: {
        face: '',
        emotion: 'amazed, futuristic wonder',
        objects: 'AI brain hologram, neural network visualization, glowing circuits, data streams',
        background: 'dark tech laboratory, holographic displays, futuristic interface',
        colors: 'electric blue, neon purple, cyan glow, dark background',
        thumbnailText: 'БУДУЩЕЕ УЖЕ ЗДЕСЬ',
        composition: 'center focus on AI brain, symmetrical layout',
        style: 'sci-fi technology, holographic aesthetic, futuristic visualization',
        extraDetails: 'glowing neural connections, data flowing, AI consciousness, matrix aesthetic',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 90,
  },

  // 5. Кликбейт Реакция (FREE)
  {
    id: 'shocked-reaction',
    name: 'Шокирующая Реакция',
    category: 'clickbait',
    description: 'Драматичная шокированная реакция',
    thumbnail: '/packs/shocked.jpg',
    tier: 'free',
    config: {
      generalDescription: 'person with extremely shocked expression, hands on face, dramatic lighting',
      details: {
        face: 'young person with wide open mouth and eyes',
        emotion: 'extremely shocked and surprised',
        objects: 'dramatic lighting, explosive background effect',
        background: 'bright explosion of colors, dramatic rays of light',
        colors: 'bright red, electric yellow, high contrast',
        thumbnailText: 'НЕ МОГУ ПОВЕРИТЬ',
        composition: 'close-up face, rule of thirds, dramatic angle',
        style: 'dramatic photography, high contrast, clickbait aesthetic',
        extraDetails: 'exaggerated expression, hands on cheeks, wide eyes, open mouth',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'free',
    popularity: 98,
  },

  // 6. Финансовый Успех (PREMIUM)
  {
    id: 'money-success',
    name: 'Заработок Денег',
    category: 'finance',
    description: 'Деньги, богатство, финансовый успех',
    thumbnail: '/packs/money.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'person holding huge stack of dollar bills, luxury lifestyle, success',
      details: {
        face: '',
        emotion: 'excited and wealthy',
        objects: 'stacks of money, gold coins, luxury items, cash rain',
        background: 'luxury office, expensive car, mansion',
        colors: 'green dollars, gold accents, luxury browns',
        thumbnailText: 'Я ЗАРАБОТАЛ $10,000',
        composition: 'split layout - person left, money graphic right',
        style: 'luxury lifestyle photography, wealth aesthetic',
        extraDetails: 'cash everywhere, success symbols, rich lifestyle, money rain',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 96,
  },

  // 7. Игровой Геймплей (PREMIUM)
  {
    id: 'gaming-gameplay',
    name: 'Игровой Геймплей',
    category: 'gaming',
    description: 'Яркий игровой контент',
    thumbnail: '/packs/gaming.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'epic gaming moment, victory screen, competitive esports aesthetic',
      details: {
        face: '',
        emotion: 'victorious and pumped',
        objects: 'gaming controller, headset, victory graphics',
        background: 'gaming setup, RGB lights, multiple monitors',
        colors: 'neon blue, electric purple, RGB rainbow',
        thumbnailText: 'ЭПИЧНАЯ ПОБЕДА',
        composition: 'gaming setup background, player reaction foreground',
        style: 'gaming content, esports aesthetic, RGB lighting',
        extraDetails: 'victory moment, epic win, competitive gaming, pro player setup',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 93,
  },

  // 8. Обучающий Туториал (FREE)
  {
    id: 'tutorial-howto',
    name: 'Как Сделать',
    category: 'education',
    description: 'Обучающий контент и туториалы',
    thumbnail: '/packs/tutorial.jpg',
    tier: 'free',
    config: {
      generalDescription: 'step-by-step tutorial visualization, clear instructions, educational content',
      details: {
        face: '',
        emotion: 'helpful and clear',
        objects: 'arrows, numbers, step indicators, tools',
        background: 'clean workspace, organized setup',
        colors: 'bright educational colors, clear contrast',
        thumbnailText: 'КАК ЭТО СДЕЛАТЬ',
        composition: 'clear step-by-step layout, numbered sequence',
        style: 'educational content, clean design, tutorial aesthetic',
        extraDetails: 'clear instructions, easy to follow, professional tutorial',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'free',
    popularity: 85,
  },

  // 9. Челлендж (PREMIUM)
  {
    id: 'challenge',
    name: 'Челлендж',
    category: 'entertainment',
    description: 'Вызовы и эксперименты',
    thumbnail: '/packs/challenge.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'person attempting extreme challenge, determined expression, dramatic setup',
      details: {
        face: '',
        emotion: 'determined and brave',
        objects: 'challenge props, timer, dramatic elements',
        background: 'challenge setup, dramatic lighting',
        colors: 'intense red, dramatic orange, high energy',
        thumbnailText: '24 ЧАСА ЧЕЛЛЕНДЖ',
        composition: 'person center frame, challenge elements around',
        style: 'challenge content, dramatic photography, high energy',
        extraDetails: 'extreme challenge, time pressure, dramatic moment',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 89,
  },

  // 10. Влог Стиль (FREE)
  {
    id: 'vlog-style',
    name: 'Влог',
    category: 'vlog',
    description: 'Личный влог контент',
    thumbnail: '/packs/vlog.jpg',
    tier: 'free',
    config: {
      generalDescription: 'vlogger with camera, casual friendly atmosphere, daily life content',
      details: {
        face: '',
        emotion: 'friendly and relatable',
        objects: 'camera, microphone, casual props',
        background: 'casual home setting, natural lighting',
        colors: 'warm natural tones, friendly atmosphere',
        thumbnailText: 'МОЙ ДЕНЬ',
        composition: 'casual selfie angle, natural pose',
        style: 'vlog aesthetic, casual photography, relatable content',
        extraDetails: 'daily life, personal story, authentic moment',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'free',
    popularity: 82,
  },

  // 11. Технологии и Гаджеты (PREMIUM)
  {
    id: 'tech-review',
    name: 'Обзор Техники',
    category: 'technology',
    description: 'Обзоры гаджетов и техники',
    thumbnail: '/packs/tech-review.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'latest smartphone or gadget showcase, clean product photography, tech review',
      details: {
        face: '',
        emotion: 'impressed and analytical',
        objects: 'smartphone, laptop, tech gadgets, specs overlay',
        background: 'clean tech setup, minimalist desk',
        colors: 'tech blue, clean white, premium black',
        thumbnailText: 'СТОИТ ЛИ ПОКУПАТЬ?',
        composition: 'product center focus, clean layout',
        style: 'tech review, product photography, professional setup',
        extraDetails: 'detailed product shot, specs visible, premium quality',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 87,
  },

  // 12. Мотивация (PREMIUM)
  {
    id: 'motivation',
    name: 'Мотивация',
    category: 'motivation',
    description: 'Мотивационный контент',
    thumbnail: '/packs/motivation.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'motivational scene, person achieving goals, inspirational atmosphere',
      details: {
        face: '',
        emotion: 'inspired and determined',
        objects: 'success symbols, achievement graphics',
        background: 'inspiring landscape, sunrise, mountain peak',
        colors: 'inspiring gold, sunrise orange, powerful blue',
        thumbnailText: 'НЕ СДАВАЙСЯ',
        composition: 'powerful stance, inspiring background',
        style: 'motivational content, inspirational photography',
        extraDetails: 'achievement moment, success story, inspiring message',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 84,
  },

  // 13. Минималистичный (FREE)
  {
    id: 'minimalist',
    name: 'Минимализм',
    category: 'design',
    description: 'Чистый минималистичный дизайн',
    thumbnail: '/packs/minimalist.jpg',
    tier: 'free',
    config: {
      generalDescription: 'minimalist clean design, simple composition, elegant aesthetic',
      details: {
        face: '',
        emotion: '',
        objects: '',
        background: '',
        colors: 'black and white, minimal accent color',
        thumbnailText: 'ПРОСТО',
        composition: 'center focus, lots of negative space',
        style: 'minimalist design, clean aesthetic, modern',
        extraDetails: 'clean lines, simple shapes, elegant simplicity',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'free',
    popularity: 78,
  },

  // 14. Яркие Цветовые Блоки (2026 тренд) (PREMIUM)
  {
    id: 'color-blocks',
    name: 'Цветовые Блоки',
    category: 'design',
    description: 'Современный стиль с яркими блоками',
    thumbnail: '/packs/color-blocks.jpg',
    tier: 'premium',
    config: {
      generalDescription: 'bold color block design, modern 2026 aesthetic, geometric shapes',
      details: {
        face: '',
        emotion: '',
        objects: '',
        background: '',
        colors: 'vibrant pink, electric blue, neon yellow',
        thumbnailText: 'ТРЕНД 2026',
        composition: 'geometric color blocks, asymmetric layout',
        style: 'modern 2026 design, bold graphics, trendy aesthetic',
        extraDetails: 'geometric shapes, bold colors, modern collage style',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'pro',
    popularity: 91,
  },

  // 15. Новости и Тренды (FREE - last one)
  {
    id: 'news-trending',
    name: 'Новости',
    category: 'news',
    description: 'Новостной контент',
    thumbnail: '/packs/news.jpg',
    tier: 'free',
    config: {
      generalDescription: 'breaking news style, serious journalism aesthetic, news broadcast look',
      details: {
        face: '',
        emotion: 'serious and informative',
        objects: '',
        background: 'news studio, professional setup',
        colors: 'news blue, professional red, clean white',
        thumbnailText: 'СРОЧНЫЕ НОВОСТИ',
        composition: 'news broadcast layout, professional framing',
        style: 'news broadcast, journalism, professional',
        extraDetails: 'breaking news, urgent information, professional journalism',
      },
      imageSize: '1920x1080',
      generationType: 'text-to-image',
      apiProvider: 'bytez',
      bytezModel: 'google/gemini-3.1-flash-image-preview',
    },
    requiredPlan: 'free',
    popularity: 80,
  },
];

/**
 * Get free packs
 */
export function getFreePacks(): YouTubePack[] {
  return YOUTUBE_PACKS.filter(pack => pack.tier === 'free');
}

/**
 * Get premium packs
 */
export function getPremiumPacks(): YouTubePack[] {
  return YOUTUBE_PACKS.filter(pack => pack.tier === 'premium');
}

/**
 * Получить все паки
 */
export function getAllPacks(): YouTubePack[] {
  return YOUTUBE_PACKS;
}

/**
 * Получить пак по ID
 */
export function getPackById(id: string): YouTubePack | null {
  return YOUTUBE_PACKS.find(pack => pack.id === id) || null;
}

/**
 * Получить паки по категории
 */
export function getPacksByCategory(category: string): YouTubePack[] {
  return YOUTUBE_PACKS.filter(pack => pack.category === category);
}

/**
 * Получить популярные паки
 */
export function getPopularPacks(limit: number = 5): YouTubePack[] {
  return [...YOUTUBE_PACKS]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * Поиск паков по названию или описанию
 */
export function searchPacks(query: string): YouTubePack[] {
  const lowerQuery = query.toLowerCase();
  return YOUTUBE_PACKS.filter(pack => 
    pack.name.toLowerCase().includes(lowerQuery) ||
    pack.description.toLowerCase().includes(lowerQuery) ||
    pack.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Получить все категории
 */
export function getAllCategories(): string[] {
  const categories = new Set(YOUTUBE_PACKS.map(pack => pack.category));
  return Array.from(categories);
}
