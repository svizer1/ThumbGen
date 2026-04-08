# Render.com Deployment Guide

## 🚀 Деплой на Render.com

### Шаг 1: Подготовка

Все файлы уже готовы:
- ✅ `bot.py` - основной код бота с webhook поддержкой
- ✅ `requirements.txt` - зависимости Python
- ✅ `Procfile` - команда запуска
- ✅ `runtime.txt` - версия Python
- ✅ `.env` - переменные окружения (не загружается в Git)

### Шаг 2: Создание сервиса на Render

1. Зарегистрируйтесь на https://render.com
2. Нажмите **New +** → **Web Service** (важно: именно Web Service, не Background Worker!)
3. Подключите ваш GitHub репозиторий `ThumbGen`

### Шаг 3: Настройка сервиса

**Build & Deploy:**
- **Name:** `thumbgen-telegram-bot`
- **Region:** `Frankfurt (EU Central)` (ближе к России)
- **Branch:** `main`
- **Root Directory:** `telegram-bot-python`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python bot.py`

### Шаг 4: Добавьте переменные окружения

В разделе **Environment Variables** добавьте:

```
TELEGRAM_BOT_TOKEN=8666147272:AAFRTan-PUnbtTZP3sOWKPC_9tSg3e1tXKY

CRYPTOBOT_API_TOKEN=563261:AACkAIRGpD2wQPFp41OUzElzC78xN7e56oH

FIREBASE_ADMIN_PROJECT_ID=thumbgen-3319c

FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@thumbgen-3319c.iam.gserviceaccount.com

FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0sxQTle22S8j4
2N8Dpro4n3atMGvwBe44Uh0oyT5M1DFGMULcLqp3A20JKwRuV04yKrXp/6JAnKh6
wSPUxijkPNk0XSDcYDX873AQpnxkxahJC+6UBrQVyfdbP7HtpwzEW+gqLGTdMre3
asFGphx5qIvwQJx37YET1cI5fafdgGd1dzt/13vw4ZlxYpZSGgA+xAUhcTnIkleW
wvg91pG1h7sdONjH4KHpNTKO8MJpmwHI1Mvb6wUmVlfbZsHbBE7DDyATgx01uAeM
7uZWi0QR4ufyMFx4VUrqbZeYq5lkH+1L70qYiquCYOvmNyfKLN4z4MQJscruiNvK
C9pG88HLAgMBAAECggEAScJ1lf8Tvt9VhFqGQgfLKPTSrSRAUwQgtuWx2GW5JART
rrrJ93WnCJih5+Wi0+WYWjr78a3zDZvE3AK9vQs8QtohsVG4aaxuLTaRkIJc8YeL
R3Hy64KG/QPpj9pCp2cSe46miJyBeZdLzbdqeIuywOhPYv0EwaF1mGKfevczT+L7
+LgRGya132+EqymCLTDxFh2VS9pIDZ9psnfVdUP43EavO39vJKjMfblJp1xWIL0s
x9H4M0Vy1AEGaZ8MlHVdRnYOI0lguyFv1an/ahKSv8aCT2fdk8qnxnYTiyMNtFEZ
K5p3kccP6wd1RhXH/c77HibqSjxMgGzgOhPmnJrNBQKBgQDbYiH8seC7tl86mHof
9rcJE+m1t8mn1m0h/73HG/qR+OhvNJ/IWwJxm0e/7PxWJjuG6aK3wu7NcgvCV3lo
l4MNOjcav+hyxOfC0nTpmuwFRH3HBg8KrjxIZ7TJ/bNag+8VJBohdtVhxD5PkIj/
kHn1ijpXlcqPNGD52EjL52Gt5QKBgQDS3A3YAGIBmgFBzU2jVPz65iMPDtzXBk8I
6SpBafY8zDrSJNAQV9DBodwEnCpQYHOzQ+rnnHgx7fMHNvH5QJPAcCfvayjTf7AU
46V3PKYEejHgxg+O/XNTnv8exbTYDVZKR7tBFPl/fAZs6Y7iEfJ66H449R/6f7mp
7LU+1po17wKBgQCHBg8FCDXZUpWp6s6/fYmJ/MeLIGLs+fyRQGX9diryTNBCIZF2
Lw2B/qBab/Ge1Eku7/1GPKPdrqOuKUiAJ0Bxk7L2s8bNXIOIVR+/56n8U/tV01TO
rg5MQgfzikIpI6qyyFWM4ybR1YbEUaEAKlvl0/20imzxVruZCpVDalWkQQKBgCO1
xtZtAiwZQ9s8BMkDjLCFJyzWrInx9JKiwlg/tMcJI3ERcPdDmAQjAFr7g6MHIrEa
cH73Hdf+32i6YnJ/AEbX97txX4GqH0z6XLx71fXuJ+JUSLBDtjNUOwqgGwd4AsQj
r8/O2I5Bl+j8CQm6VmGAXFgTE25eETh48R0KRSWbAoGAJxlQ5xTxd7cU/Nippjts
TCRaKuFhIo9T9qbNxl5peP0BKQ/+Kzfo0slNiFsBdkeDE4ox5fOgtt2hoT731FGh
1ZrT+xIa19At897192M9/0bqtvWl+Yn7s9BXE7eIhpCqwNoUHnO0I6UFkD4JIZbP
tC0G5YjeQnJCzNlodTrHcX0=
-----END PRIVATE KEY-----

PORT=10000

WEBHOOK_URL=https://thumbgen-uqqm.onrender.com

WEBHOOK_PATH=/webhook
```

**ВАЖНО:** 
- Для `FIREBASE_ADMIN_PRIVATE_KEY` скопируйте весь ключ включая `-----BEGIN PRIVATE KEY-----` и `-----END PRIVATE KEY-----` со всеми переносами строк.
- `PORT` должен быть `10000` (стандартный порт для Render Web Service)
- `WEBHOOK_URL` должен быть вашим URL на Render (без слеша в конце)
- `WEBHOOK_PATH` должен быть `/webhook`

### Шаг 5: Деплой

1. Нажмите **Create Web Service**
2. Render автоматически:
   - Склонирует репозиторий
   - Установит зависимости
   - Запустит бота в webhook режиме
3. Проверьте логи - должно быть:
   ```
   Bot starting... (restart #0)
   Webhook set to: https://thumbgen-uqqm.onrender.com/webhook
   Keep-alive task started
   Starting webhook server on port 10000
   ```

### Шаг 6: Проверка

1. **Проверьте health check:**
   ```
   curl https://thumbgen-uqqm.onrender.com/health
   ```
   Должен вернуть: `{"status":"ok","bot":"ThumbnailGen","mode":"webhook"}`

2. **Откройте бота в Telegram:** https://t.me/ThumbGenAI_BOT

3. **Отправьте `/start`** - бот должен ответить мгновенно!

---

## 💰 Стоимость

**Free Tier:**
- ✅ 750 часов бесплатно в месяц
- ✅ Автоматический перезапуск при падении
- ✅ Keep-alive механизм (бот пингует сам себя каждые 10 минут)
- ✅ Работает 24/7 без засыпания благодаря self-ping
- ⚠️ Может быть небольшая задержка при первом запросе после неактивности

**Paid Plan ($7/месяц):**
- ✅ Всегда активен (гарантированно)
- ✅ Больше ресурсов
- ✅ Приоритетная поддержка
- ✅ Нет задержек

Для начала Free Tier достаточно!

---

## 🔧 Новые возможности

### Webhook режим
Бот теперь работает через webhook вместо polling:
- ✅ Мгновенные ответы (быстрее чем polling)
- ✅ Меньше нагрузки на Telegram API
- ✅ Эффективное использование ресурсов

### Автоматический перезапуск
Бот автоматически перезапускается при любых ошибках:
- ✅ Бесконечный цикл перезапуска
- ✅ Логирование всех ошибок
- ✅ Задержка 5 секунд между перезапусками

### Keep-alive механизм
Бот пингует сам себя каждые 10 минут:
- ✅ Предотвращает засыпание на free tier
- ✅ Автоматически работает в webhook режиме
- ✅ Логирует успешные пинги

### Health check endpoint
Доступен по адресу `/health`:
- ✅ Проверка статуса бота
- ✅ Информация о режиме работы
- ✅ Для мониторинга и отладки

### Улучшенная обработка ошибок
Все внешние сервисы обернуты в try-except:
- ✅ Firebase операции
- ✅ CryptoBot API вызовы
- ✅ Детальное логирование ошибок
- ✅ Бот не крашится при ошибках внешних сервисов

---

## 🔧 Troubleshooting

### Бот не запускается?
1. Проверьте логи в Render Dashboard → Logs
2. Убедитесь что все переменные окружения добавлены
3. Проверьте что `PORT=10000` установлен

### Ошибка Firebase?
1. Убедитесь что `FIREBASE_ADMIN_PRIVATE_KEY` скопирован полностью с переносами строк
2. Проверьте что ключ начинается с `-----BEGIN PRIVATE KEY-----`
3. Проверьте что ключ заканчивается на `-----END PRIVATE KEY-----`

### Бот не отвечает?
1. Проверьте что сервис запущен (Status: Live)
2. Проверьте логи на ошибки
3. Проверьте health check: `curl https://thumbgen-uqqm.onrender.com/health`
4. Попробуйте перезапустить: Manual Deploy → Clear build cache & deploy

### Webhook не работает?
1. Проверьте что `WEBHOOK_URL` правильный (без слеша в конце)
2. Проверьте что `WEBHOOK_PATH=/webhook`
3. Проверьте логи: должно быть "Webhook set to: ..."
4. Проверьте что Telegram может достучаться до вашего URL

### Бот засыпает?
1. Проверьте логи: должны быть "Keep-alive ping successful" каждые 10 минут
2. Убедитесь что `WEBHOOK_URL` правильный
3. Если keep-alive не работает, используйте внешний сервис типа UptimeRobot

### Бот постоянно перезапускается?
1. Проверьте логи на ошибки
2. Проверьте что все переменные окружения правильные
3. Проверьте что Firebase credentials валидны
4. Проверьте что CryptoBot API token валиден

---

## 📊 Мониторинг

### Логи
Все важные события логируются:
- Старт/стоп бота
- Установка/удаление webhook
- Keep-alive пинги
- Ошибки Firebase
- Ошибки CryptoBot API
- Перезапуски бота

### Health Check
Проверяйте статус бота:
```bash
curl https://thumbgen-uqqm.onrender.com/health
```

Ответ:
```json
{
  "status": "ok",
  "bot": "ThumbnailGen",
  "mode": "webhook"
}
```

### Внешний мониторинг (опционально)
Используйте UptimeRobot или подобные сервисы:
1. Создайте HTTP(s) монитор
2. URL: `https://thumbgen-uqqm.onrender.com/health`
3. Интервал: 5 минут
4. Получайте уведомления при downtime

---

## 🎉 Готово!

После деплоя бот будет работать 24/7 с:
- ✅ Webhook для мгновенных ответов
- ✅ Автоматическим перезапуском при ошибках
- ✅ Keep-alive для предотвращения засыпания
- ✅ Health check для мониторинга
- ✅ Улучшенной обработкой ошибок

Бот готов к продакшену! 🚀
