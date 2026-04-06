# Render.com Deployment Guide

## 🚀 Деплой на Render.com

### Шаг 1: Подготовка

Все файлы уже готовы:
- ✅ `bot.py` - основной код бота
- ✅ `requirements.txt` - зависимости Python
- ✅ `Procfile` - команда запуска
- ✅ `runtime.txt` - версия Python
- ✅ `.env` - переменные окружения (не загружается в Git)

### Шаг 2: Создание сервиса на Render

1. Зарегистрируйтесь на https://render.com
2. Нажмите **New +** → **Background Worker**
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
```

**ВАЖНО:** Для `FIREBASE_ADMIN_PRIVATE_KEY` скопируйте весь ключ включая `-----BEGIN PRIVATE KEY-----` и `-----END PRIVATE KEY-----` со всеми переносами строк.

### Шаг 5: Деплой

1. Нажмите **Create Background Worker**
2. Render автоматически:
   - Склонирует репозиторий
   - Установит зависимости
   - Запустит бота
3. Проверьте логи - должно быть: `Bot started!`

### Шаг 6: Проверка

Откройте бота в Telegram: https://t.me/ThumbGenAI_BOT
Отправьте `/start` - бот должен ответить мгновенно!

---

## 💰 Стоимость

**Free Tier:**
- ✅ 750 часов бесплатно в месяц
- ✅ Автоматический перезапуск при падении
- ⚠️ Засыпает после 15 минут неактивности
- ⚠️ Просыпается при первом сообщении (может быть задержка)

**Paid Plan ($7/месяц):**
- ✅ Всегда активен (не засыпает)
- ✅ Больше ресурсов
- ✅ Приоритетная поддержка

Для начала Free Tier достаточно!

---

## 🔧 Troubleshooting

### Бот не запускается?
Проверьте логи в Render Dashboard → Logs

### Ошибка Firebase?
Убедитесь что `FIREBASE_ADMIN_PRIVATE_KEY` скопирован полностью с переносами строк

### Бот не отвечает?
- Проверьте что сервис запущен (Status: Live)
- Проверьте логи на ошибки
- Попробуйте перезапустить: Manual Deploy → Clear build cache & deploy

---

## 🎉 Готово!

После деплоя бот будет работать 24/7 и отвечать мгновенно!
