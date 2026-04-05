# 🚀 Руководство по деплою

## Подготовка к деплою

### 1. Создайте репозиторий на GitHub

```bash
# В папке проекта выполните:
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git branch -M main
git push -u origin main
```

### 2. Переменные окружения

Для деплоя вам понадобятся следующие переменные окружения:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=ваш-project-id
FIREBASE_CLIENT_EMAIL=ваш-client-email
FIREBASE_PRIVATE_KEY=ваш-private-key

# Firebase Client (публичные)
NEXT_PUBLIC_FIREBASE_API_KEY=ваш-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш-app-id

# AI Providers (опционально)
HUGGINGFACE_API_KEY=ваш-huggingface-key
BYTEZ_API_KEY=ваш-bytez-key
```

---

## Деплой на Vercel (Рекомендуется)

### Преимущества:
- ✅ Автоматический деплой при push в GitHub
- ✅ Бесплатный SSL сертификат
- ✅ CDN по всему миру
- ✅ Оптимизация для Next.js
- ✅ Бесплатный план для личных проектов

### Шаги:

1. **Зарегистрируйтесь на Vercel**
   - Перейдите на https://vercel.com
   - Войдите через GitHub

2. **Импортируйте проект**
   - Нажмите "Add New Project"
   - Выберите ваш GitHub репозиторий
   - Нажмите "Import"

3. **Настройте переменные окружения**
   - В разделе "Environment Variables" добавьте все переменные из `.env.local`
   - Важно: добавьте переменные для всех окружений (Production, Preview, Development)

4. **Деплой**
   - Нажмите "Deploy"
   - Vercel автоматически соберет и задеплоит проект
   - Получите URL вида: `https://ваш-проект.vercel.app`

5. **Настройте домен (опционально)**
   - В настройках проекта перейдите в "Domains"
   - Добавьте свой домен
   - Следуйте инструкциям для настройки DNS

### Автоматические деплои:
После настройки каждый push в main ветку будет автоматически деплоиться!

---

## Деплой на Netlify

### Преимущества:
- ✅ Простая настройка
- ✅ Бесплатный план
- ✅ Автоматические деплои

### Шаги:

1. **Зарегистрируйтесь на Netlify**
   - Перейдите на https://netlify.com
   - Войдите через GitHub

2. **Импортируйте проект**
   - Нажмите "Add new site" → "Import an existing project"
   - Выберите GitHub и ваш репозиторий

3. **Настройте сборку**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Добавьте переменные окружения**
   - Site settings → Environment variables
   - Добавьте все переменные из `.env.local`

5. **Деплой**
   - Нажмите "Deploy site"
   - Получите URL вида: `https://ваш-проект.netlify.app`

---

## Деплой на Railway

### Преимущества:
- ✅ Поддержка баз данных
- ✅ Простая настройка
- ✅ $5 бесплатно каждый месяц

### Шаги:

1. **Зарегистрируйтесь на Railway**
   - Перейдите на https://railway.app
   - Войдите через GitHub

2. **Создайте новый проект**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий

3. **Railway автоматически определит Next.js**
   - Настройки сборки будут установлены автоматически

4. **Добавьте переменные окружения**
   - В настройках проекта перейдите в "Variables"
   - Добавьте все переменные из `.env.local`

5. **Деплой**
   - Railway автоматически задеплоит проект
   - Получите URL вида: `https://ваш-проект.up.railway.app`

---

## Деплой на собственный VPS

### Требования:
- Ubuntu 20.04+ или другой Linux
- Node.js 18+
- Nginx (для reverse proxy)
- PM2 (для управления процессом)

### Шаги:

1. **Подключитесь к серверу**
   ```bash
   ssh user@your-server-ip
   ```

2. **Установите Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/ваш-username/ваш-репозиторий.git
   cd ваш-репозиторий
   ```

4. **Установите зависимости**
   ```bash
   npm install
   ```

5. **Создайте .env.local**
   ```bash
   nano .env.local
   # Вставьте все переменные окружения
   ```

6. **Соберите проект**
   ```bash
   npm run build
   ```

7. **Установите PM2**
   ```bash
   sudo npm install -g pm2
   ```

8. **Запустите приложение**
   ```bash
   pm2 start npm --name "thumbnail-gen" -- start
   pm2 save
   pm2 startup
   ```

9. **Настройте Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/thumbnail-gen
   ```
   
   Добавьте:
   ```nginx
   server {
       listen 80;
       server_name ваш-домен.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Активируйте конфигурацию**
    ```bash
    sudo ln -s /etc/nginx/sites-available/thumbnail-gen /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Настройте SSL (опционально)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d ваш-домен.com
    ```

---

## После деплоя

### 1. Обновите Firebase настройки

В Firebase Console добавьте ваш production домен в:
- **Authentication** → Settings → Authorized domains
- **Firestore** → Rules (если используете домен-специфичные правила)

### 2. Проверьте работу

- ✅ Регистрация/вход работает
- ✅ Генерация изображений работает
- ✅ История сохраняется
- ✅ Профиль отображается корректно

### 3. Мониторинг

- Vercel: встроенная аналитика
- Netlify: встроенная аналитика
- Railway: логи в реальном времени
- VPS: `pm2 logs thumbnail-gen`

---

## Обновление после деплоя

### Vercel/Netlify/Railway:
```bash
git add .
git commit -m "Update"
git push origin main
# Автоматический деплой!
```

### VPS:
```bash
ssh user@your-server-ip
cd ваш-репозиторий
git pull
npm install
npm run build
pm2 restart thumbnail-gen
```

---

## Troubleshooting

### Ошибка "Module not found"
```bash
# Убедитесь, что все зависимости установлены
npm install
npm run build
```

### Firebase ошибки
- Проверьте переменные окружения
- Убедитесь, что домен добавлен в Authorized domains

### Изображения не загружаются
- Проверьте CORS настройки
- Убедитесь, что API ключи корректны

---

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

**Готово! Ваш проект задеплоен! 🎉**
