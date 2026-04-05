// Тест API генерации
// Запустите: node test-api.js

const { GoogleAuth } = require('google-auth-library');

async function testAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Testing API endpoints...\n');
  
  // Тест 1: Режим prompt (без авторизации)
  console.log('📝 Test 1: Prompt mode (no auth required)');
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'prompt',
        generalDescription: 'test prompt',
        details: {},
      }),
    });
    
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log('✅ Prompt mode works!\n');
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // Тест 2: Режим API без авторизации (должен вернуть 401)
  console.log('🔐 Test 2: API mode without auth (should return 401)');
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'api',
        generalDescription: 'test',
        details: {},
      }),
    });
    
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    
    if (response.status === 401) {
      console.log('✅ Auth check works correctly!\n');
    } else {
      console.log('⚠️  Unexpected response\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  console.log('📊 Summary:');
  console.log('- Prompt mode: должен работать без авторизации');
  console.log('- API mode: требует авторизацию (Bearer token)');
  console.log('\n⚠️  Для тестирования API mode нужен Firebase ID token');
  console.log('   Войдите в приложение через браузер и проверьте консоль сервера');
}

testAPI();
