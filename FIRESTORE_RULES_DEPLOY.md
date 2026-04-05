# Как развернуть Firestore правила вручную

## Способ 1: Через Firebase Console (Рекомендуется)

### Шаг 1: Откройте Firebase Console
Перейдите на: https://console.firebase.google.com/

### Шаг 2: Выберите проект
Выберите проект: **thumbgen-3319c**

### Шаг 3: Откройте Firestore Database
1. В левом меню найдите **Firestore Database**
2. Нажмите на него

### Шаг 4: Откройте Rules (Правила)
1. Перейдите на вкладку **Rules** (Правила)
2. Вы увидите редактор правил

### Шаг 5: Скопируйте и вставьте правила
Удалите все существующие правила и вставьте следующие:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's generation history
      match /generations/{generationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User's spending history
      match /spending_history/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Шаг 6: Опубликуйте правила
1. Нажмите кнопку **Publish** (Опубликовать)
2. Подтвердите изменения

### Шаг 7: Проверьте
Правила должны быть активны в течение нескольких секунд.

---

## Способ 2: Через Firebase CLI (Если установлен)

### Установите Firebase CLI:
```bash
npm install -g firebase-tools
```

### Войдите в Firebase:
```bash
firebase login
```

### Инициализируйте проект (если еще не сделано):
```bash
firebase init firestore
```

### Разверните правила:
```bash
firebase deploy --only firestore:rules
```

---

## Что делают эти правила?

### 1. Доступ к данным пользователя:
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
- Пользователь может читать и изменять только свои данные
- Требуется авторизация

### 2. Доступ к истории генераций:
```javascript
match /generations/{generationId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
- Пользователь может видеть только свои генерации
- Требуется авторизация

### 3. Доступ к истории трат:
```javascript
match /spending_history/{transactionId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
- Пользователь может видеть только свои траты
- Требуется авторизация

---

## ⚠️ ВАЖНО!

После развертывания правил:
1. Перезапустите приложение: `npm run dev`
2. Очистите кэш браузера (Ctrl+Shift+Delete)
3. Перезайдите в систему

---

## Проверка работы правил:

### В Firebase Console:
1. Откройте **Firestore Database**
2. Перейдите на вкладку **Rules**
3. Нажмите **Rules Playground**
4. Протестируйте правила

### Пример теста:
```
Location: /users/test-user-id
Auth: Authenticated as test-user-id
Operation: get
Result: ✅ Allow
```

---

## Готово! 🎉

После развертывания правил:
- История трат будет работать
- Любимая модель будет отображаться
- Кредиты будут списываться правильно
