# 🔥 Обновление Firestore правил вручную

## Проблема: История не сохраняется

### Решение: Обновите правила Firestore

1. **Откройте Firebase Console:**
   https://console.firebase.google.com/project/thumbgen-3319c/firestore/rules

2. **Замените правила на следующие:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's generation history
      match /generations/{generationId} {
        // Users can read their own history
        allow read: if request.auth != null && request.auth.uid == userId;
        // Server can write (Admin SDK bypasses rules anyway, but explicit for clarity)
        allow write: if true;
      }
      
      // User's spending history
      match /spending_history/{transactionId} {
        // Users can read their own spending
        allow read: if request.auth != null && request.auth.uid == userId;
        // Server can write
        allow write: if true;
      }
    }
  }
}
```

3. **Нажмите "Опубликовать"**

4. **Проверьте:**
   - Сгенерируйте новое изображение
   - Перейдите на `/history`
   - Нажмите "Обновить"
   - Новая генерация должна появиться!

---

## Про ошибку Google входа

Ошибка `auth/popup-closed-by-user` - это нормально, когда пользователь закрывает окно Google входа до завершения. Это не баг, просто пользователь отменил вход.

---

## Про reCAPTCHA

reCAPTCHA v2 ключи уже настроены в `.env.local`, но не интегрированы в формы. Это опционально для MVP, можно добавить позже.
