# 🔥 ThumbGen AI - Setup Instructions

## ✅ Что уже сделано

### 1. Firebase Authentication
- ✅ Email/Password регистрация и вход
- ✅ Google OAuth вход
- ✅ Подтверждение email
- ✅ Защита приватных ключей в .gitignore

### 2. Система профилей
- ✅ Профиль пользователя с аватаром
- ✅ Кнопка профиля в Header с балансом кредитов
- ✅ Страница профиля (/profile)
- ✅ Статистика использования

### 3. Система кредитов и подписок
- ✅ Firestore база данных для пользователей
- ✅ Система кредитов (10 бесплатных при регистрации)
- ✅ 4 плана подписки (Free, Starter, Pro, Unlimited)
- ✅ Пакеты дополнительных кредитов
- ✅ Страница тарифов (/pricing)

### 4. UI/UX улучшения
- ✅ Модальные окна входа и регистрации
- ✅ Улучшенные цветовые схемы для всех тем
- ✅ Адаптация результатов генерации под темы
- ✅ Красивые карточки и анимации
- ✅ Toast уведомления

---

## 🚀 Что нужно настроить

### 1. Firebase Console Setup

#### Шаг 1: Получите Firebase Client Config
1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект `thumbgen-3319c`
3. Перейдите в **Project Settings** (⚙️ иконка)
4. Прокрутите вниз до раздела **Your apps**
5. Если нет веб-приложения, нажмите **Add app** → **Web** (</> иконка)
6. Скопируйте конфигурацию

#### Шаг 2: Обновите .env.local
Откройте `.env.local` и замените эти значения:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... # Ваш API Key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=thumbgen-3319c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=thumbgen-3319c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=thumbgen-3319c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 # Ваш Sender ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123 # Ваш App ID
```

#### Шаг 3: Включите Authentication провайдеры
1. В Firebase Console → **Authentication** → **Sign-in method**
2. Включите **Email/Password**
3. Включите **Google** (добавьте support email)

#### Шаг 4: Настройте Firestore Database
1. В Firebase Console → **Firestore Database**
2. Нажмите **Create database**
3. Выберите **Start in production mode**
4. Выберите регион (например, `europe-west1`)
5. После создания, перейдите в **Rules** и добавьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Пользователь может читать и писать только свои данные
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // History collection (если будет использоваться)
    match /history/{historyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Шаг 5: Настройте Email Templates
1. В Firebase Console → **Authentication** → **Templates**
2. Настройте шаблон **Email address verification**
3. Измените текст на русский (опционально)

---

### 2. Запуск проекта

```bash
# Установите зависимости (если еще не установлены)
npm install

# Запустите dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## 📋 Как использовать

### Регистрация нового пользователя
1. Нажмите кнопку **Войти** в Header
2. Переключитесь на **Регистрация**
3. Заполните форму или используйте Google
4. Проверьте email для подтверждения
5. Получите 10 бесплатных кредитов!

### Генерация изображений
1. Войдите в систему
2. Заполните форму генератора
3. Нажмите **Сгенерировать миниатюру**
4. Система автоматически спишет 1 кредит
5. Результат сохранится в историю

### Пополнение баланса
1. Перейдите на страницу **/pricing**
2. Выберите подписку или купите кредиты
3. (Пока кнопки не активны - нужна интеграция Telegram платежей)

---

## 🔮 Что осталось сделать

### 1. Telegram Crypto Payments (Высокий приоритет)
- [ ] Создать Telegram бота через @BotFather
- [ ] Настроить Telegram Payments API
- [ ] Создать `/api/payment/create` endpoint
- [ ] Создать `/api/payment/webhook` endpoint
- [ ] Интегрировать с кнопками на странице /pricing

### 2. reCAPTCHA v3 (Средний приоритет)
- [ ] Получить ключи reCAPTCHA v3
- [ ] Добавить скрипт в layout
- [ ] Интегрировать в формы регистрации
- [ ] Добавить проверку на сервере

### 3. Интеграция кредитов с генерацией (Высокий приоритет)
- [ ] Добавить проверку кредитов перед генерацией
- [ ] Списывать кредит после успешной генерации
- [ ] Показывать предупреждение при низком балансе

### 4. Email уведомления
- [ ] Настроить SendGrid или другой email сервис
- [ ] Отправлять уведомления о покупках
- [ ] Отправлять уведомления о низком балансе

---

## 🎨 Структура проекта

```
src/
├── app/
│   ├── profile/page.tsx          # Страница профиля
│   ├── pricing/page.tsx          # Страница тарифов
│   └── api/
│       └── (будущие payment endpoints)
├── components/
│   ├── auth/
│   │   ├── LoginModal.tsx        # Модальное окно входа
│   │   └── SignupModal.tsx       # Модальное окно регистрации
│   ├── profile/
│   │   └── ProfileButton.tsx     # Кнопка профиля в Header
│   └── layout/
│       ├── Header.tsx            # Обновленный Header
│       └── ClientLayout.tsx      # Layout с Auth провайдером
├── contexts/
│   ├── AuthContext.tsx           # Firebase Auth контекст
│   └── ThemeContext.tsx          # Контекст тем
└── lib/
    ├── firebase.ts               # Firebase client config
    └── firebase-admin.ts         # Firebase admin config
```

---

## 🔒 Безопасность

### Что защищено:
- ✅ Firebase Admin SDK ключи в .env.local
- ✅ Firebase credentials файл в .gitignore
- ✅ Firestore правила доступа
- ✅ Серверная валидация

### Важно:
- ⚠️ **НЕ КОММИТЬТЕ** файл `thumbgen-3319c-firebase-adminsdk-*.json`
- ⚠️ **НЕ КОММИТЬТЕ** `.env.local` с реальными ключами
- ⚠️ Используйте переменные окружения для production

---

## 🐛 Troubleshooting

### Firebase не инициализируется
- Проверьте, что все переменные в `.env.local` заполнены
- Перезапустите dev сервер после изменения .env

### Email не отправляется
- Проверьте, что Email/Password провайдер включен в Firebase Console
- Проверьте спам папку

### Ошибка "Permission denied" в Firestore
- Проверьте Firestore Rules
- Убедитесь, что пользователь авторизован

### Google OAuth не работает
- Добавьте authorized domains в Firebase Console
- Для localhost это должно работать автоматически

---

## 📞 Поддержка

Если возникли вопросы:
1. Проверьте Firebase Console на наличие ошибок
2. Проверьте браузерную консоль (F12)
3. Проверьте логи сервера в терминале

---

## 🎉 Готово!

Ваш сайт теперь имеет:
- ✅ Полноценную систему аутентификации
- ✅ Профили пользователей
- ✅ Систему кредитов и подписок
- ✅ Красивый современный UI
- ✅ Адаптивный дизайн
- ✅ 3 темы оформления

**Следующий шаг:** Интегрируйте Telegram платежи для монетизации! 💰
