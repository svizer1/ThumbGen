# Инструкция по проверке истории

## Проблема: Новые генерации не появляются в истории

### Шаг 1: Проверьте логи сервера

1. Откройте терминал где запущен `npm run dev`
2. Сгенерируйте новое изображение
3. Ищите в логах:

```
[generate] === API CALLED ===
[generate] Request body mode: api
[generate] API mode - checking auth...
[generate] Auth successful, userId: FtuY2PgqUQPw2KmlT05EkdzOi1q1
[generate] User credits: X
[generate] Saving to Firestore for user: FtuY2PgqUQPw2KmlT05EkdzOi1q1
[generate] History saved to Firestore with ID: xxxxx
```

### Шаг 2: Проверьте Firebase Console

1. Зайдите: https://console.firebase.google.com/project/thumbgen-3319c/firestore
2. Откройте: `users` → `FtuY2PgqUQPw2KmlT05EkdzOi1q1` → `generations`
3. Проверьте, есть ли новые документы с текущей датой

### Шаг 3: Если документы есть в Firestore, но не отображаются

Проблема в чтении. Проверьте консоль браузера (F12):

```javascript
// Откройте консоль и выполните:
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const snapshot = await getDocs(collection(db, 'users', 'FtuY2PgqUQPw2KmlT05EkdzOi1q1', 'generations'));
console.log('Documents:', snapshot.docs.length);
snapshot.docs.forEach(doc => console.log(doc.id, doc.data()));
```

### Шаг 4: Если документов нет в Firestore

Проблема в сохранении. Проверьте:

1. **userId передается в API?**
   - Лог должен показывать: `[generate] Auth successful, userId: ...`
   
2. **Есть ли ошибки при сохранении?**
   - Лог должен показывать: `[generate] History saved to Firestore with ID: ...`
   - Если есть ошибка: `[generate] Failed to save history: ...`

3. **Правильные ли credentials Firebase Admin SDK?**
   - Проверьте `.env.local`:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY`

---

## Временное решение

Пока ищем проблему, можете проверить старые 7 записей - они точно работают!

Нажмите кнопку "Обновить" на странице `/history` после каждой генерации.
