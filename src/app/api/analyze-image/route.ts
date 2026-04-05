import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    }

    const bytezApiKey = process.env.BYTEZ_API_KEY;
    
    if (!bytezApiKey) {
      console.error('[AnalyzeImage] No Bytez API key configured');
      return NextResponse.json({ error: 'Bytez API key not configured' }, { status: 500 });
    }

    console.log('[AnalyzeImage] Using Bytez Gemini for image analysis');

    try {
      const response = await fetch('https://api.bytez.com/models/v2/google/gemini-3.1-flash-image-preview', {
        method: 'POST',
        headers: {
          'Authorization': bytezApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'What is in this image? List the main subjects/objects you see. Be specific and accurate. Answer in one short sentence.',
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AnalyzeImage] Bytez API error:', response.status, errorText);
        return NextResponse.json({ description: '' });
      }

      const data = await response.json();
      console.log('[AnalyzeImage] Bytez response:', JSON.stringify(data).substring(0, 300));

      // Извлекаем описание из Gemini формата
      let description = '';
      
      if (data.provider?.candidates?.[0]?.content?.parts?.[0]?.text) {
        description = data.provider.candidates[0].content.parts[0].text;
      } else if (data.output) {
        description = data.output;
      }

      if (description && description.length > 10) {
        // Очищаем описание
        description = description
          .replace(/^(The image shows?|This image shows?|I see|In this image|The main subjects? (?:is|are))\s*/i, '')
          .replace(/\.$/, '')
          .trim();
        
        console.log(`[AnalyzeImage] ✅ Success: ${description}`);
        return NextResponse.json({ description: description });
      }

      console.warn('[AnalyzeImage] No valid description found');
      return NextResponse.json({ description: '' });
    } catch (error) {
      console.error('[AnalyzeImage] Error:', error);
      return NextResponse.json({ description: '' });
    }
  } catch (error) {
    console.error('[AnalyzeImage] Fatal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
