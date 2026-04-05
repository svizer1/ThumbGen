# 🎯 ВАЖНО: Завершите настройку Firebase!

## ⚠️ Сейчас нужно сделать:

### 1. Получите Firebase Client Config (5 минут)

1. Откройте: https://console.firebase.google.com/project/thumbgen-3319c/settings/general
2. Прокрутите вниз до раздела **"Ваши приложения"**
3. Если нет веб-приложения, нажмите **"Добавить приложение"** → выберите **Web** (</>)
4. Скопируйте значения из `firebaseConfig`

### 2. Обновите .env.local

Откройте `.env.local` и замените эти строки реальными значениями:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here          # ← Замените!
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here  # ← Замените!
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here            # ← Замените!
```

### 3. Включите Authentication (2 минуты)

1. Откройте: https://console.firebase.google.com/project/thumbgen-3319c/authentication/providers
2. Нажмите **Email/Password** → Включите → Сохраните
3. Нажмите **Google** → Включите → Добавьте support email → Сохраните

### 4. Создайте Firestore Database (3 минуты)

1. Откройте: https://console.firebase.google.com/project/thumbgen-3319c/firestore
2. Нажмите **"Создать базу данных"**
3. Выберите **"Начать в производственном режиме"**
4. Выберите регион (например, `europe-west1`)
5. После создания, перейдите в **"Правила"** и вставьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Нажмите **"Опубликовать"**

### 5. Перезапустите сервер

```bash
# Остановите текущий сервер (Ctrl+C)
# Запустите снова:
npm run dev
```

---

## ✅ После настройки вы сможете:

- 🔐 Регистрироваться и входить (Email + Google)
- 👤 Видеть свой профиль с балансом
- 💰 Получить 10 бесплатных кредитов
- 🎨 Генерировать изображения
- 📊 Просматривать статистику

---

## 🚀 Откройте сайт:

http://localhost:3000

---

## 📖 Полная документация:

См. файл `SETUP.md` для подробных инструкций.
