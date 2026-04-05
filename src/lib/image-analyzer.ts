/**
 * Анализирует изображение и возвращает его описание через AI
 * Использует серверный API для обхода CORS
 */
export async function analyzeImage(imageUrl: string): Promise<string> {
  try {
    console.log('[ImageAnalyzer] Analyzing image via server API');
    
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      console.warn('[ImageAnalyzer] Server API failed:', response.status);
      return '';
    }

    const data = await response.json();
    
    if (data.description) {
      console.log('[ImageAnalyzer] Success:', data.description);
      return data.description;
    }

    return '';
  } catch (error) {
    console.error('[ImageAnalyzer] Error:', error);
    return '';
  }
}

/**
 * Анализирует несколько изображений и возвращает их описания
 */
export async function analyzeImages(imageUrls: string[]): Promise<string[]> {
  const descriptions = await Promise.all(
    imageUrls.map(url => analyzeImage(url))
  );
  return descriptions;
}
