# 🔥 Последний шаг - получите Firebase Client Config

## Откройте Firebase Console:

https://console.firebase.google.com/project/thumbgen-3319c/settings/general

## Шаги:

1. **Прокрутите вниз** до раздела "Ваши приложения" / "Your apps"

2. **Если нет веб-приложения:**
   - Нажмите кнопку **"</>"** (Web)
   - Введите название: "ThumbGen Web"
   - Нажмите "Зарегистрировать приложение"

3. **Скопируйте значения из firebaseConfig:**

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Скопируйте это
  authDomain: "thumbgen-3319c.firebaseapp.com",
  projectId: "thumbgen-3319c",
  storageBucket: "thumbgen-3319c.appspot.com",
  messagingSenderId: "123456789", // ← Скопируйте это
  appId: "1:123456789:web:abc123" // ← Скопируйте это
};
```

4. **Откройте `.env.local` и замените:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...              # ← Вставьте apiKey
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 # ← Вставьте messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123 # ← Вставьте appId
```

5. **Включите Authentication:**
   - https://console.firebase.google.com/project/thumbgen-3319c/authentication/providers
   - Включите **Email/Password**
   - Включите **Google** (добавьте support email)

6. **Создайте Firestore:**
   - https://console.firebase.google.com/project/thumbgen-3319c/firestore
   - Нажмите "Создать базу данных"
   - Выберите "Начать в производственном режиме"
   - Регион: europe-west1
   - В Rules вставьте:

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

7. **Перезапустите сервер:**

```bash
npm run dev
```

## Готово! 🎉

Откройте http://localhost:3000 и протестируйте регистрацию!
