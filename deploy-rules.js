const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function deployFirestoreRules() {
  try {
    // Загружаем ключ сервисного аккаунта
    const keyPath = path.join(__dirname, 'thumbgen-3319c-firebase-adminsdk-fbsvc-4b56f0d78f.json');
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    
    // Создаем JWT клиент
    const jwtClient = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Получаем токен доступа
    await jwtClient.authorize();
    const accessToken = (await jwtClient.getAccessToken()).token;

    // Формируем URL для развертывания правил
    const projectId = 'thumbgen-3319c';
    const url = `https://firebaserules.googleapis.com/v1/projects/${projectId}:release`;

    // Читаем правила из файла
    const rulesPath = path.join(__dirname, 'firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // Отправляем запрос на развертывание
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `projects/${projectId}/releases/firestore.rules`,
        ruleset: {
          source: {
            files: [
              {
                name: 'firestore.rules',
                content: rulesContent,
                fingerprint: Buffer.from('firestore').toString('base64'),
              },
            ],
          },
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Ошибка при развертывании правил:', data);
      process.exit(1);
    }

    console.log('✅ Правила Firestore успешно развернуты!');
    console.log('Результат:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Ошибка:', error.message);
    process.exit(1);
  }
}

deployFirestoreRules();
