# Telegram Bot Setup Guide

## 🤖 Telegram Bot с криптовалютными платежами

Этот проект включает Telegram бота для покупки кредитов и подписок через криптовалюту (TON, USDT, BTC, ETH).

---

## 📋 Что нужно для запуска

### 1. Токены и ключи

Добавьте в `.env.local`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY
TELEGRAM_WEBHOOK_SECRET=your_random_secret_string_here

# CryptoBot API
CRYPTOBOT_API_TOKEN=563261:AACkAIRGpD2wQPFp41OUzElzC78xN7e56oH
```

**Генерация TELEGRAM_WEBHOOK_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Настройка Webhook

### Локальная разработка (с ngrok)

1. Установите ngrok: https://ngrok.com/download

2. Запустите проект локально:
```bash
npm run dev
```

3. В другом терминале запустите ngrok:
```bash
ngrok http 3000
```

4. Скопируйте HTTPS URL (например: `https://abc123.ngrok.io`)

5. Установите webhook для Telegram:
```bash
curl -X POST "https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/setWebhook?url=https://abc123.ngrok.io/api/telegram-webhook&secret_token=YOUR_SECRET"
```

6. Установите webhook для CryptoBot (в настройках CryptoBot API):
```
Webhook URL: https://abc123.ngrok.io/api/cryptobot-webhook
```

### Production (Vercel)

1. Деплой на Vercel:
```bash
vercel --prod
```

2. Получите production URL (например: `https://thumbnail-gen.vercel.app`)

3. Установите webhook для Telegram:
```bash
curl -X POST "https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/setWebhook?url=https://thumbnail-gen.vercel.app/api/telegram-webhook&secret_token=YOUR_SECRET"
```

4. Установите webhook для CryptoBot:
   - Откройте @CryptoBot в Telegram
   - Перейдите в настройки API
   - Установите Webhook URL: `https://thumbnail-gen.vercel.app/api/cryptobot-webhook`

---

## 🧪 Тестирование

### Проверка webhook статуса

**Telegram:**
```bash
curl "https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/getWebhookInfo"
```

**Health check endpoints:**
```bash
curl https://thumbnail-gen.vercel.app/api/telegram-webhook
curl https://thumbnail-gen.vercel.app/api/cryptobot-webhook
```

### Тестирование бота

1. Откройте бота в Telegram: https://t.me/YOUR_BOT_USERNAME
2. Отправьте `/start`
3. Попробуйте команды:
   - `/balance` - проверить баланс
   - `/buy` - купить кредиты/подписку
   - `/help` - помощь
   - `/language` - сменить язык

---

## 📊 Структура данных Firestore

### Коллекция `telegram_users`
```
telegram_users/{telegramId}/
  - telegramId: number
  - username: string
  - firstName: string
  - lastName: string
  - language: 'ru' | 'en'
  - firebaseUid: string | null
  - linkedAt: Timestamp | null
  - createdAt: Timestamp
  - lastInteraction: Timestamp
```

### Коллекция `users` (обновлена)
```
users/{uid}/
  - telegramId: number (новое)
  - telegramUsername: string (новое)
  - credits: number
  - subscription: {...}
  - ...
```

### Коллекция `processed_invoices`
```
processed_invoices/{invoiceId}/
  - invoiceId: string
  - processedAt: Timestamp
  - userId: string
  - status: 'paid'
```

---

## 💰 Процесс оплаты

1. Пользователь выбирает пакет в боте
2. Бот создает счет через CryptoBot API
3. Пользователь оплачивает в CryptoBot
4. CryptoBot отправляет webhook на `/api/cryptobot-webhook`
5. Сервер проверяет подпись и начисляет кредиты/активирует подписку
6. Бот отправляет уведомление пользователю

---

## 🔐 Безопасность

- ✅ Проверка HMAC подписи от CryptoBot
- ✅ Secret token для Telegram webhook
- ✅ Защита от дублирования платежей
- ✅ Логирование всех транзакций

---

## 🐛 Отладка

### Логи Vercel
```bash
vercel logs
```

### Проверка ошибок
- Проверьте Vercel Function Logs
- Проверьте Firestore для записей транзакций
- Проверьте консоль браузера для ошибок

---

## 📝 Команды бота

- `/start` - Главное меню
- `/balance` - Проверить баланс
- `/buy` - Купить кредиты или подписку
- `/help` - Помощь
- `/language` - Сменить язык (RU/EN)

---

## 🌐 Поддерживаемые криптовалюты

- 💎 TON
- 💵 USDT (TRC20)
- ₿ BTC
- Ξ ETH

---

## 📦 Пакеты кредитов

- 50 кредитов - $3
- 150 кредитов + 10 бонус - $8 ⭐
- 400 кредитов + 50 бонус - $20

## ⭐ Подписки

- Starter - $5/месяц (200 генераций)
- Pro - $15/месяц (600 генераций) ⭐
- Unlimited - $30/месяц (∞ безлимит)

---

## ❓ FAQ

**Q: Как удалить webhook?**
```bash
curl -X POST "https://api.telegram.org/bot8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY/deleteWebhook"
```

**Q: Webhook не работает?**
- Проверьте что URL доступен извне (не localhost)
- Проверьте что используется HTTPS
- Проверьте логи Vercel
- Проверьте что токены правильные в `.env.local`

**Q: Платежи не обрабатываются?**
- Проверьте что webhook установлен в CryptoBot
- Проверьте подпись webhook
- Проверьте логи в `/api/cryptobot-webhook`

---

## 🎉 Готово!

Ваш Telegram бот готов к работе! Пользователи могут покупать кредиты и подписки через криптовалюту.
