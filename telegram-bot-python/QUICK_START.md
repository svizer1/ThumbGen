# 🚀 Быстрый старт на Render.com

## Что изменилось?

Бот теперь работает через **webhook** вместо polling для стабильной работы 24/7 на Render.com.

## Новые возможности:

✅ **Webhook режим** - мгновенные ответы  
✅ **Автоматический перезапуск** - бот не падает  
✅ **Keep-alive механизм** - не засыпает на free tier  
✅ **Health check** - мониторинг статуса  
✅ **Улучшенная обработка ошибок** - логирование всех проблем  

---

## 📝 Инструкция для Render.com

### 1. Добавьте переменные окружения в Render Dashboard:

```
PORT=10000
WEBHOOK_URL=https://thumbgen-uqqm.onrender.com
WEBHOOK_PATH=/webhook
```

**Важно:** Остальные переменные (TELEGRAM_BOT_TOKEN, FIREBASE_ADMIN_PRIVATE_KEY и т.д.) должны быть уже добавлены.

### 2. Убедитесь что тип сервиса - **Web Service** (не Background Worker)

### 3. Задеплойте изменения

Render автоматически обнаружит изменения в коде и перезапустит бот.

### 4. Проверьте логи

Должны увидеть:
```
Bot starting... (restart #0)
Webhook set to: https://thumbgen-uqqm.onrender.com/webhook
Keep-alive task started
Starting webhook server on port 10000
```

### 5. Проверьте health check

```bash
curl https://thumbgen-uqqm.onrender.com/health
```

Ответ:
```json
{"status":"ok","bot":"ThumbnailGen","mode":"webhook"}
```

### 6. Протестируйте бота

Отправьте `/start` в Telegram - бот должен ответить мгновенно!

---

## 🔧 Локальная разработка

Для локального тестирования просто запустите:

```bash
python bot.py
```

Бот автоматически определит что `PORT` не задан и запустится в **polling режиме**.

---

## 📊 Мониторинг

- **Health check:** `https://thumbgen-uqqm.onrender.com/health`
- **Логи:** Render Dashboard → Logs
- **Keep-alive пинги:** Каждые 10 минут в логах

---

## ❓ Проблемы?

Смотрите полную документацию в `RENDER_DEPLOY.md`
