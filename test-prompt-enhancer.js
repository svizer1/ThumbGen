// Тест улучшения промптов
// Запуск: node test-prompt-enhancer.js

const testPrompts = [
  'девушка в купальнике на пляже',
  'shocked person looking at money',
  'gaming thumbnail with neon lights',
];

async function testEnhancer() {
  console.log('🧪 Testing Prompt Enhancer\n');
  
  for (const prompt of testPrompts) {
    console.log(`\n📝 Original: "${prompt}"`);
    console.log('⏳ Enhancing...\n');
    
    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'prompt',
          generalDescription: prompt,
          details: {
            face: '',
            emotion: '',
            objects: '',
            background: '',
            colors: '',
            thumbnailText: '',
            composition: '',
            style: '',
            extraDetails: '',
          },
          sourceImageUrls: [],
          imageSize: '1920x1080',
          generationType: 'text-to-image',
          apiProvider: 'bytez',
        }),
      });
      
      if (!response.ok) {
        console.error('❌ Error:', response.status, response.statusText);
        continue;
      }
      
      const data = await response.json();
      console.log('✅ Enhanced:', data.generatedPrompt);
      console.log('\n📊 Stats:');
      console.log(`   Original length: ${prompt.length} chars`);
      console.log(`   Enhanced length: ${data.generatedPrompt.length} chars`);
      console.log(`   Improvement: ${Math.round((data.generatedPrompt.length / prompt.length) * 100)}%`);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

testEnhancer();
