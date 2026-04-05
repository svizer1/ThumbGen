# Исправления проблем с кредитами и историей трат

## Дата: 2026-04-05

## Исправленные проблемы

### 1. ❌ Nested Button Hydration Error
**Файл:** `src/components/generator/PromptResult.tsx`
**Проблема:** Вложенный `<Button>` компонент внутри `<button>` элемента
**Решение:** Заменен на обычный `<button>` с inline стилями

### 2. ❌ Кредиты не списывались при генерации
**Файлы:** 
- `src/app/api/generate/route.ts`
- `src/app/api/track-generation/route.ts`

**Проблема:** Firestore не разрешает символ `/` в именах полей. Модели типа `google/gemini-3.1-flash-image-preview` вызывали ошибку.

**Решение:** Санитизация имен моделей перед сохранением в Firestore:
```javascript
const sanitizedModelName = modelUsed.replace(/\//g, '_');
// google/gemini-3.1-flash-image-preview → google_gemini-3.1-flash-image-preview
```

### 3. ❌ Undefined error field в Firestore
**Файл:** `src/app/api/generate/route.ts`
**Проблема:** Поле `error` было `undefined` при успешной генерации
**Решение:** Условное включение поля только если оно существует:
```javascript
...(error && { error })
```

### 4. ❌ FavoriteModel сохранялся как объект вместо строки
**Файлы:**
- `src/app/api/generate/route.ts`
- `src/app/api/track-generation/route.ts`

**Проблема:** `Object.entries().reduce()` возвращал массив `[key, value]` вместо строки
**Решение:** Переписан алгоритм поиска модели с максимальным использованием:
```javascript
let favoriteModel = sanitizedModelName;
let maxCount = currentModelUsage[sanitizedModelName];

for (const [model, count] of Object.entries(currentModelUsage)) {
  if ((count as number) > maxCount) {
    maxCount = count as number;
    favoriteModel = model;
  }
}
```

## Структура данных в Firestore

```
users/{userId}
  ├─ credits: number
  ├─ totalGenerations: number
  ├─ modelUsage: {
  │    "google_gemini-3.1-flash-image-preview": 1,  // Санитизированное имя
  │    "black-forest-labs_FLUX.1-dev": 2
  │  }
  ├─ favoriteModel: "black-forest-labs_FLUX.1-dev"  // Строка, не объект!
  │
  ├─ spending_history/{transactionId}
  │   ├─ timestamp: Timestamp
  │   ├─ model: "google/gemini-3.1-flash-image-preview"  // Оригинальное имя
  │   ├─ source: "bytez" | "huggingface" | "puter"
  │   ├─ spent: 1
  │   ├─ duration: number
  │   ├─ requestId: string
  │   └─ status: "success"
  │
  └─ generations/{generationId}
      ├─ createdAt: string (ISO)
      ├─ mode: "api"
      ├─ result: { generatedPrompt, generatedImageUrl }
      └─ status: "success"
```

## Измененные файлы

1. `src/components/generator/PromptResult.tsx` - исправлен nested button
2. `src/components/generator/GeneratorForm.tsx` - добавлен трекинг Puter.js генераций
3. `src/app/api/track-generation/route.ts` - новый endpoint для клиентских генераций
4. `src/app/api/generate/route.ts` - исправлены ошибки Firestore

## Тестирование

### Проверка списания кредитов:
1. Откройте http://localhost:3000
2. Войдите в аккаунт
3. Сгенерируйте изображение (любой провайдер)
4. Проверьте что кредиты уменьшились

### Проверка истории трат:
1. Перейдите в профиль
2. Прокрутите до раздела "История трат"
3. Должна появиться запись с деталями генерации

### Проверка любимой модели:
1. В профиле найдите раздел "Любимая модель"
2. Должна отображаться модель с наибольшим количеством использований

## Известные особенности

- Имена моделей в `modelUsage` и `favoriteModel` хранятся с `_` вместо `/`
- В `spending_history` сохраняется оригинальное имя модели с `/`
- При отображении в UI используется `getModelDisplayName()` для красивого форматирования

## Статус: ✅ Все проблемы исправлены
