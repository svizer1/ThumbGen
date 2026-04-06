# 🎉 Telegram Bot - Быстрый старт

## ✅ Что уже сделано

Telegram бот для покупки кредитов и подписок через криптовалюту полностью реализован!

### Созданные файлы:

**Типы:**
- `src/types/telegram.ts` - типы Telegram Bot API
- `src/types/payment.ts` - типы платежей и CryptoBot

**Библиотеки:**
- `src/lib/telegram/bot.ts` - клиент Telegram Bot API
- `src/lib/telegram/handlers.ts` - обработчики команд и callback
- `src/lib/telegram/keyboards.ts` - inline клавиатуры
- `src/lib/telegram/messages.ts` - локализация (RU/EN)
- `src/lib/cryptobot/client.ts` - клиент CryptoBot API
- `src/lib/cryptobot/webhookVerifier.ts` - проверка подписи webhook
- `src/lib/payment/paymentManager.ts` - управление кредитами и подписками

**API Endpoints:**
- `src/app/api/telegram-webhook/route.ts` - webhook для Telegram
- `src/app/api/cryptobot-webhook/route.ts` - webhook для CryptoBot
- `src/app/api/payment/add-credits/route.ts` - начисление кредитов
- `src/app/api/payment/activate-subscription/route.ts` - активация подписки

---

## 🚀 Как запустить (3 шага)

### Шаг 1: Настройте переменные окружения

Создайте файл `.env.local` (если его нет) и добавьте:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY
TELEGRAM_WEBHOOK_SECRET=любая_случайная_строка_для_безопасности

# CryptoBot API
CRYPTOBOT_API_TOKEN=563261:AACkAIRGpD2wQPFp41OUzElzC78xN7e56oH
```

### Шаг 2: Деплой на Vercel

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Деплой
vercel --prod
```

После деплоя вы получите URL, например: `https://thumbnail-gen.vercel.app`

### Шаг 3: Настройте Webhooks

**A) Telegram Webhook:**

Откройте в браузере (замените YOUR_SECRET на вашу строку из .env.local):
```
https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/setWebhook?url=https://thumbnail-gen.vercel.app/api/telegram-webhook&secret_token=YOUR_SECRET
```

Вы должны увидеть: `{"ok":true,"result":true,"description":"Webhook was set"}`

**B) CryptoBot Webhook:**

1. Откройте @CryptoBot в Telegram
2. Отправьте команду `/api`
3. Выберите ваше приложение
4. Нажмите "Webhook Settings"
5. Введите URL: `https://thumbnail-gen.vercel.app/api/cryptobot-webhook`
6. Сохраните

---

## 🧪 Тестирование

### 1. Проверьте что webhook установлен:

```
https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/getWebhookInfo
```

### 2. Откройте бота в Telegram:

Найдите вашего бота по username (который вы указали при создании через @BotFather)

### 3. Протестируйте команды:

- `/start` - главное меню
- `/balance` - проверить баланс
- `/buy` - купить кредиты/подписку
- `/help` - помощь
- `/language` - сменить язык

### 4. Тестовая покупка:

1. Нажмите "💳 Купить кредиты"
2. Выберите пакет (например, 50 кредитов - $3)
3. Выберите криптовалюту (например, TON)
4. Нажмите кнопку "💳 Оплатить"
5. Оплатите в CryptoBot
6. Через несколько секунд бот пришлет уведомление об успешной оплате

---

## 📊 Как это работает

```
Пользователь → Telegram Bot → Выбор пакета → CryptoBot счет
                                                      ↓
                                                   Оплата
                                                      ↓
                                            CryptoBot Webhook
                                                      ↓
                                            Проверка подписи
                                                      ↓
                                         Начисление кредитов
                                                      ↓
                                    Уведомление пользователю
```

---

## 💰 Доступные пакеты

### Кредиты (одноразовая покупка):
- 50 кредитов - $3
- 150 кредитов + 10 бонус - $8 ⭐
- 400 кредитов + 50 бонус - $20

### Подписки (ежемесячно):
- Starter - $5/месяц (200 генераций)
- Pro - $15/месяц (600 генераций) ⭐
- Unlimited - $30/месяц (∞ безлимит)

### Поддерживаемые криптовалюты:
- 💎 TON
- 💵 USDT (TRC20)
- ₿ BTC
- Ξ ETH

---

## 🔧 Локальная разработка (опционально)

Если хотите тестировать локально:

### 1. Установите ngrok:
```bash
# Скачайте с https://ngrok.com/download
```

### 2. Запустите проект:
```bash
npm run dev
```

### 3. В другом терминале запустите ngrok:
```bash
ngrok http 3000
```

### 4. Установите webhook на ngrok URL:
```
https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/setWebhook?url=https://abc123.ngrok.io/api/telegram-webhook
```

---

## 🐛 Решение проблем

### Бот не отвечает?

1. Проверьте webhook статус:
```
https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/getWebhookInfo
```

2. Проверьте логи Vercel:
```bash
vercel logs
```

3. Проверьте что токены правильные в Vercel Environment Variables

### Платежи не обрабатываются?

1. Проверьте что CryptoBot webhook установлен правильно
2. Проверьте логи в `/api/cryptobot-webhook`
3. Убедитесь что `CRYPTOBOT_API_TOKEN` правильный

### Ошибка "Account not found"?

Это нормально для новых пользователей. При первой покупке бот автоматически создаст временный аккаунт.

---

## 📱 Команды бота

- `/start` - Главное меню и регистрация
- `/balance` - Проверить баланс кредитов и подписку
- `/buy` - Купить кредиты или подписку
- `/help` - Показать справку
- `/language` - Сменить язык (Русский/English)

---

## 🌐 Двуязычность

Бот автоматически определяет язык пользователя из Telegram.
Поддерживаются языки:
- 🇷🇺 Русский
- 🇬🇧 English

Пользователь может сменить язык командой `/language`

---

## 🔐 Безопасность

✅ Проверка HMAC подписи от CryptoBot
✅ Secret token для Telegram webhook
✅ Защита от дублирования платежей
✅ Логирование всех транзакций в Firestore
✅ Переменные окружения для токенов

---

## 📈 Мониторинг

### Firestore коллекции:

**telegram_users** - пользователи Telegram
**users** - основные пользователи (с кредитами)
**processed_invoices** - обработанные платежи
**users/{uid}/spending_history** - история транзакций

### Логи:

Все операции логируются в консоль и доступны через:
```bash
vercel logs --follow
```

---

## 🎉 Готово!

Ваш Telegram бот готов к работе! Пользователи могут:

✅ Покупать кредиты через криптовалюту
✅ Оформлять подписки
✅ Использовать бота на русском или английском
✅ Получать мгновенные уведомления об оплате

---

## 📞 Поддержка

Если возникли вопросы:
1. Проверьте логи Vercel
2. Проверьте Firestore данные
3. Проверьте webhook статус

Все работает автоматически! 🚀
