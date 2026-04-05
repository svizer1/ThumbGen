# 🎨 ThumbGen AI - AI-Powered YouTube Thumbnail Generator

Профессиональный генератор миниатюр для YouTube с использованием искусственного интеллекта.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![Firebase](https://img.shields.io/badge/Firebase-12.x-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Основные возможности

### 🎯 Генерация изображений
- **Множество AI моделей**: FLUX, Google Imagen 4, Stable Diffusion XL
- **Text-to-Image**: Создание с нуля по описанию
- **Image-to-Image**: Модификация существующих изображений
- **Референсный анализ**: AI анализирует стиль референсных миниатюр
- **Умное улучшение промптов**: Автоматическое улучшение описаний

### 👤 Система пользователей
- **Firebase Authentication**: Email/Password + Google OAuth
- **Подтверждение email**: Верификация через почту
- **Профили пользователей**: Аватары, статистика, история
- **Защита от ботов**: Готово к интеграции reCAPTCHA v3

### 💰 Монетизация
- **Система кредитов**: 1 генерация = 1 кредит
- **4 плана подписки**:
  - 🆓 **Free**: 10 кредитов при регистрации
  - ⚡ **Starter** ($5/мес): 200 генераций
  - 👑 **Pro** ($15/мес): 600 генераций + API
  - ♾️ **Unlimited** ($30/мес): Безлимит
- **Дополнительные кредиты**: Пакеты от $3
- **Telegram Crypto Payments**: Готово к интеграции

### 🎨 Дизайн
- **3 темы оформления**: Молочная, Коричневая, Темная
- **Адаптивный дизайн**: Работает на всех устройствах
- **Современный UI**: Плавные анимации и переходы
- **Toast уведомления**: Красивые уведомления о действиях

---

## 🚀 Быстрый старт

### 1. Установка

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd thumbnail-gen

# Установите зависимости
npm install
```

### 2. Настройка Firebase

**Важно!** Следуйте инструкциям в файле `QUICKSTART.md`

Кратко:
1. Получите Firebase config из консоли
2. Обновите `.env.local`
3. Включите Email/Password и Google в Authentication
4. Создайте Firestore Database

### 3. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## 📁 Структура проекта

```
thumbnail-gen/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Главная страница
│   │   ├── profile/              # Страница профиля
│   │   ├── pricing/              # Страница тарифов
│   │   ├── history/              # История генераций
│   │   └── api/                  # API endpoints
│   ├── components/
│   │   ├── auth/                 # Компоненты аутентификации
│   │   ├── profile/              # Компоненты профиля
│   │   ├── generator/            # Компоненты генератора
│   │   ├── layout/               # Layout компоненты
│   │   └── ui/                   # UI компоненты
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Firebase Auth
│   │   └── ThemeContext.tsx      # Управление темами
│   ├── lib/
│   │   ├── firebase.ts           # Firebase client
│   │   ├── firebase-admin.ts     # Firebase admin
│   │   └── providers/            # AI провайдеры
│   └── hooks/                    # React hooks
├── public/                       # Статические файлы
├── .env.local                    # Переменные окружения
├── SETUP.md                      # Полная документация
└── QUICKSTART.md                 # Быстрая настройка
```

---

## 🔧 Технологии

### Frontend
- **Next.js 14.2.5** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Lucide React** - Иконки
- **React Hot Toast** - Уведомления

### Backend
- **Firebase Authentication** - Аутентификация
- **Firestore** - База данных
- **Firebase Admin SDK** - Серверные операции

### AI Провайдеры
- **Bytez.js** - Google Imagen 4, FLUX
- **Hugging Face** - FLUX, SDXL
- **Puter.js** - Бесплатная генерация

---

## 🎯 Что реализовано

### ✅ Аутентификация
- [x] Email/Password регистрация
- [x] Google OAuth вход
- [x] Подтверждение email
- [x] Защита приватных маршрутов
- [x] Управление сессиями

### ✅ Профили пользователей
- [x] Страница профиля
- [x] Аватары и информация
- [x] Статистика использования
- [x] Управление подпиской
- [x] Баланс кредитов

### ✅ Система кредитов
- [x] Firestore схема пользователей
- [x] Автоматическое списание кредитов
- [x] 10 бесплатных кредитов при регистрации
- [x] Отслеживание использования

### ✅ Страница тарифов
- [x] 4 плана подписки
- [x] Пакеты дополнительных кредитов
- [x] FAQ секция
- [x] Сравнение планов

### ✅ UI/UX
- [x] Модальные окна входа/регистрации
- [x] Кнопка профиля в Header
- [x] Улучшенные темы
- [x] Адаптация результатов под темы
- [x] Toast уведомления

---

## 🔮 Что нужно доделать

### 🚧 Высокий приоритет

#### 1. Telegram Crypto Payments
```typescript
// Нужно создать:
- Telegram бота через @BotFather
- /api/payment/create endpoint
- /api/payment/webhook endpoint
- Интеграцию с кнопками на /pricing
```

#### 2. Интеграция кредитов с генерацией
```typescript
// В GeneratorForm.tsx добавить:
const { useCredit } = useAuth();

const generate = async () => {
  // Проверка кредитов
  const hasCredit = await useCredit();
  if (!hasCredit) return;
  
  // Генерация...
};
```

### 🔧 Средний приоритет

#### 3. reCAPTCHA v3
- Получить ключи из Google reCAPTCHA
- Добавить скрипт в layout
- Интегрировать в формы

#### 4. Email уведомления
- Настроить SendGrid
- Уведомления о покупках
- Уведомления о низком балансе

---

## 🔒 Безопасность

### Что защищено
- ✅ Firebase Admin SDK ключи в .env.local
- ✅ Credentials файл в .gitignore
- ✅ Firestore правила доступа
- ✅ Серверная валидация

### Важные напоминания
- ⚠️ **НЕ КОММИТЬТЕ** `.env.local`
- ⚠️ **НЕ КОММИТЬТЕ** `*firebase*.json` файлы
- ⚠️ Используйте переменные окружения для production

---

## 📖 Документация

- **QUICKSTART.md** - Быстрая настройка (5 минут)
- **SETUP.md** - Полная документация
- **Firebase Console** - https://console.firebase.google.com/project/thumbgen-3319c

---

## 🐛 Troubleshooting

### Firebase не инициализируется
```bash
# Проверьте .env.local
# Перезапустите сервер
npm run dev
```

### Email не отправляется
- Проверьте Email/Password провайдер в Firebase Console
- Проверьте спам папку

### Ошибка "Permission denied" в Firestore
- Проверьте Firestore Rules
- Убедитесь, что пользователь авторизован

---

## 🤝 Вклад в проект

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 Лицензия

MIT License - см. файл LICENSE

---

## 👨‍💻 Автор

Создано с ❤️ для создателей контента

---

## 🎉 Changelog

### v2.0.0 (2026-04-05)
- ✨ Добавлена Firebase Authentication (Email + Google)
- ✨ Система профилей пользователей
- ✨ Система кредитов и подписок
- ✨ Страница тарифов с 4 планами
- ✨ Улучшенный UI/UX с 3 темами
- ✨ Toast уведомления
- ✨ Адаптация результатов под темы
- 🔒 Защита Firebase credentials
- 📖 Полная документация

### v1.0.0
- 🎨 Базовая генерация миниатюр
- 🤖 Интеграция AI провайдеров
- 📝 Система промптов
- 🎨 3 темы оформления

---

**Готово к использованию!** 🚀

Следуйте инструкциям в `QUICKSTART.md` для завершения настройки.
