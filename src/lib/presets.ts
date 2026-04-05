import { DetailedFields } from '@/types';

export interface Preset {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  config: {
    generalDescription?: string;
    details: Partial<DetailedFields>;
    imageSize?: string;
    generationType?: 'text-to-image' | 'image-to-image';
    apiProvider?: 'default' | 'puter' | 'bytez' | 'huggingface';
    bytezModel?: string;
    huggingfaceModel?: string;
    puterModel?: string;
    puterQuality?: string;
  };
}

const PRESETS_KEY = 'thumbnail-gen-presets';

/**
 * Получить все пресеты из localStorage
 */
export function getPresets(): Preset[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    if (!stored) return getDefaultPresets();
    
    const presets = JSON.parse(stored);
    if (!Array.isArray(presets)) return getDefaultPresets();
    
    // Миграция: заменяем старые модели на новые
    const migratedPresets = presets.map(preset => {
      if (preset.config?.bytezModel === 'google/imagen-4.0-ultra-generate-001') {
        return {
          ...preset,
          config: {
            ...preset.config,
            bytezModel: 'google/gemini-3.1-flash-image-preview'
          }
        };
      }
      return preset;
    });
    
    // Добавляем новые дефолтные пресеты, если их нет
    const defaultPresets = getDefaultPresets();
    const existingIds = new Set(migratedPresets.map(p => p.id));
    
    const newDefaultPresets = defaultPresets.filter(dp => !existingIds.has(dp.id));
    
    if (newDefaultPresets.length > 0) {
      // Добавляем новые дефолтные пресеты в конец
      const updatedPresets = [...migratedPresets, ...newDefaultPresets];
      localStorage.setItem(PRESETS_KEY, JSON.stringify(updatedPresets));
      return updatedPresets;
    }
    
    // Сохраняем мигрированные пресеты
    if (JSON.stringify(presets) !== JSON.stringify(migratedPresets)) {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(migratedPresets));
    }
    
    return migratedPresets;
  } catch {
    return getDefaultPresets();
  }
}

/**
 * Сохранить пресет
 */
export function savePreset(preset: Omit<Preset, 'id' | 'createdAt'>): Preset {
  const presets = getPresets();
  
  const newPreset: Preset = {
    ...preset,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  presets.unshift(newPreset);
  
  // Ограничиваем до 20 пресетов
  const trimmed = presets.slice(0, 20);
  
  localStorage.setItem(PRESETS_KEY, JSON.stringify(trimmed));
  
  return newPreset;
}

/**
 * Удалить пресет
 */
export function deletePreset(id: string): void {
  const presets = getPresets();
  const filtered = presets.filter(p => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(filtered));
}

/**
 * Обновить пресет
 */
export function updatePreset(id: string, updates: Partial<Omit<Preset, 'id' | 'createdAt'>>): void {
  const presets = getPresets();
  const index = presets.findIndex(p => p.id === id);
  
  if (index !== -1) {
    presets[index] = {
      ...presets[index],
      ...updates,
    };
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }
}

/**
 * Получить пресет по ID
 */
export function getPresetById(id: string): Preset | null {
  const presets = getPresets();
  return presets.find(p => p.id === id) || null;
}

/**
 * Дефолтные пресеты
 */
function getDefaultPresets(): Preset[] {
  return [
    {
      id: 'default-1',
      name: '🔥 Кликбейт миниатюра',
      description: 'Драматичная миниатюра с шокированным лицом и ярким текстом',
      createdAt: new Date().toISOString(),
      config: {
        details: {
          emotion: 'shocked',
          composition: 'close-up face',
          style: 'realistic cinematic photography',
          colors: 'красный и жёлтый',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-2',
      name: '💰 Финансовая тема',
      description: 'Миниатюра про деньги и заработок',
      createdAt: new Date().toISOString(),
      config: {
        details: {
          emotion: 'excited',
          objects: 'стопка долларов, золотые монеты',
          background: 'роскошный офис',
          colors: 'зелёный и золотой',
          composition: 'split layout — person left, graphic right',
          style: 'realistic cinematic photography',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-3',
      name: '🎮 Игровой стиль',
      description: 'Яркая игровая миниатюра',
      createdAt: new Date().toISOString(),
      config: {
        details: {
          emotion: 'determined',
          composition: 'center focus',
          style: 'gaming',
          colors: 'неоновый синий и фиолетовый',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-4',
      name: '📰 Новостной стиль',
      description: 'Серьёзная миниатюра в стиле новостей',
      createdAt: new Date().toISOString(),
      config: {
        details: {
          emotion: 'serious',
          composition: 'rule of thirds',
          style: 'news broadcast',
          colors: 'синий и белый',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'huggingface',
        huggingfaceModel: 'stabilityai/stable-diffusion-xl-base-1.0',
      },
    },
    {
      id: 'default-5',
      name: '✨ Минималистичный',
      description: 'Чистый минималистичный дизайн',
      createdAt: new Date().toISOString(),
      config: {
        details: {
          composition: 'center focus',
          style: 'minimalist clean',
          colors: 'чёрный и белый',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-6',
      name: '🔥 Провокационный/Вызывающий',
      description: 'Сексуальная привлекательная миниатюра с моделью в купальнике',
      createdAt: new Date().toISOString(),
      config: {
        generalDescription: 'attractive fitness model in stylish swimwear, turned back to camera, looking over shoulder',
        details: {
          face: 'beautiful woman with confident seductive expression',
          emotion: 'confident and alluring',
          objects: 'luxury beach setting, tropical background',
          background: 'exotic beach paradise, turquoise water, palm trees, golden hour lighting',
          colors: 'warm sunset tones, orange and pink sky, golden highlights',
          composition: 'back view pose, looking over shoulder, rule of thirds, subject on right side',
          style: 'professional fashion photography, glamour shot, magazine quality',
          extraDetails: 'toned athletic body, perfect curves, sun-kissed skin, flowing hair, confident pose, beach lifestyle aesthetic',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-7',
      name: '🏍️ Погоня ДПС',
      description: 'Экстремальная погоня за питбайкерами от первого лица',
      createdAt: new Date().toISOString(),
      config: {
        generalDescription: 'first person POV from police car dashboard camera chasing dirt bike riders doing stunts',
        details: {
          emotion: 'intense and adrenaline-filled',
          objects: 'pit bikes, police car dashboard, speedometer, steering wheel',
          background: 'urban street, highway, motion blur, high speed chase',
          colors: 'dramatic blue and red police lights, dark asphalt, bright daylight',
          composition: 'first person POV, dashboard camera angle, motion blur on sides, pit bikes in center distance',
          style: 'action camera footage, GoPro style, realistic dashcam photography, high speed motion',
          extraDetails: 'pit bike wheelie stunt, extreme speed, motion blur, police pursuit, adrenaline rush, dangerous maneuvers, urban chase scene',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
    {
      id: 'default-8',
      name: '🏍️ Эндуро Killstreet',
      description: 'Экшн погоня на эндуро мотоциклах, killstreet стиль, мотоспорт',
      createdAt: new Date().toISOString(),
      config: {
        generalDescription: 'extreme enduro motorcycle chase scene, killstreet style action, police pursuit with dirt bikes',
        details: {
          emotion: 'adrenaline-filled, intense action, extreme sports energy',
          objects: 'enduro dirt bikes, police motorcycles, police cars, helmets, racing gear',
          background: 'urban street chase, city highway, motion blur, high speed pursuit',
          colors: 'dramatic blue and red police lights, high contrast, dark urban tones, bright headlights',
          composition: 'dynamic action shot, motion blur, chase scene perspective, multiple bikes in frame',
          style: 'action sports photography, GoPro POV, extreme motorsports, killstreet aesthetic, cinematic action',
          extraDetails: 'wheelie stunts, high speed maneuvers, police pursuit, killstreet vibes, dangerous tricks, urban motorsport, adrenaline rush, extreme enduro racing',
        },
        imageSize: '1920x1080',
        generationType: 'text-to-image',
        apiProvider: 'bytez',
        bytezModel: 'google/gemini-3.1-flash-image-preview',
      },
    },
  ];
}
