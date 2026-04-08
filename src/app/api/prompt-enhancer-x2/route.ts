import { NextRequest, NextResponse } from 'next/server';
import { enhancePromptX2 } from '@/lib/prompt-enhancer';

/**
 * Prompt Enhancer X2 API Endpoint
 * Uses Groq API for fast and high-quality prompt enhancement
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }
    
    if (prompt.length < 3) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 });
    }
    
    console.log('[prompt-enhancer-x2] Enhancing prompt with Groq:', prompt.substring(0, 50) + '...');
    
    const enhanced = await enhancePromptX2(prompt);
    
    const improvement = Math.round((enhanced.length / prompt.length) * 100);
    const wordsOriginal = prompt.split(/\s+/).length;
    const wordsEnhanced = enhanced.split(/\s+/).length;
    const wordsAdded = wordsEnhanced - wordsOriginal;
    
    console.log('[prompt-enhancer-x2] Enhancement complete:', {
      originalLength: prompt.length,
      enhancedLength: enhanced.length,
      improvement: `${improvement}%`,
      wordsAdded
    });
    
    return NextResponse.json({ 
      original: prompt,
      enhanced,
      improvement: `${improvement}% more detailed`,
      stats: {
        originalLength: prompt.length,
        enhancedLength: enhanced.length,
        originalWords: wordsOriginal,
        enhancedWords: wordsEnhanced,
        wordsAdded,
      }
    });
  } catch (error) {
    console.error('[prompt-enhancer-x2] Error:', error);
    return NextResponse.json({ 
      error: 'Enhancement failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
