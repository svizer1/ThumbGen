# Как получить reCAPTCHA ключи

## Шаг 1: Перейдите на сайт Google reCAPTCHA
Откройте в браузере: https://www.google.com/recaptcha/admin

## Шаг 2: Войдите в аккаунт Google
Используйте свой Google аккаунт для входа

## Шаг 3: Создайте новый сайт
Нажмите кнопку "+" или "Создать"

## Шаг 4: Заполните форму регистрации

### Название:
```
Thumbnail Generator
```

### Тип reCAPTCHA:
Выберите: **reCAPTCHA v2** → "Я не робот" (Checkbox)

### Домены:
Добавьте ваши домены:
```
localhost
yourdomain.com
```

### Владельцы:
Оставьте ваш email

### Примите условия использования
Поставьте галочку

## Шаг 5: Получите ключи

После создания вы получите:

1. **Site Key (Ключ сайта)** - используется на клиенте
2. **Secret Key (Секретный ключ)** - используется на сервере

## Шаг 6: Добавьте ключи в .env.local

Откройте файл `.env.local` и добавьте:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=ваш_site_key_здесь
RECAPTCHA_SECRET_KEY=ваш_secret_key_здесь
```

## Шаг 7: Перезапустите сервер

```bash
npm run dev
```

## Готово! 🎉

Теперь reCAPTCHA готова к использованию в формах регистрации и входа.

---

## Примечание:

Пакет `react-google-recaptcha` уже установлен в проекте.
Для интеграции в формы нужно будет добавить компонент ReCAPTCHA в:
- `src/components/auth/SignupModal.tsx`
- `src/components/auth/LoginModal.tsx`
