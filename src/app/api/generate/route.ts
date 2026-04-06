import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { buildThumbnailPrompt } from '@/lib/prompt-builder';
import { saveToHistory } from '@/lib/history-store';
import { getProvider } from '@/lib/providers';
import { PuterProvider } from '@/lib/providers/puter';
import { BytezProvider } from '@/lib/providers/bytez';
import { HuggingFaceProvider } from '@/lib/providers/huggingface';
import type { GenerationInput, HistoryEntry, GenerateApiResponse } from '@/types';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  console.log('[generate] === API CALLED ===');
  
  let body: any;

  try {
    body = await request.json();
    console.log('[generate] Request body mode:', body.mode);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.mode || !['prompt', 'api'].includes(body.mode)) {
    return NextResponse.json({ error: 'Invalid generation mode' }, { status: 400 });
  }

  let userId: string | null = null;
  let userData: any = null;

  // Only require auth for API mode (actual image generation)
  if (body.mode === 'api') {
    console.log('[generate] API mode - checking auth...');
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    console.log('[generate] Auth header present:', !!authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[generate] No Bearer token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
      console.log('[generate] Auth successful, userId:', userId);
    } catch (error) {
      console.error('[generate] Auth error:', error);
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Get user data
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log('[generate] User not found in Firestore');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userData = userDoc.data()!;
    console.log('[generate] User credits:', userData.credits);

    // Check balance - only credits
    if ((userData.credits || 0) <= 0) {
      console.log('[generate] Insufficient credits');
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
  } else {
    console.log('[generate] Prompt mode - no auth required');
  }

  const startTime = Date.now();
  const { mainPrompt, negativePrompt } = buildThumbnailPrompt(body);

  let generatedImageUrl: string | undefined;
  let status: 'success' | 'error' = 'success';
  let error: string | undefined;
  let modelUsed = body.bytezModel || body.huggingfaceModel || body.puterModel || 'default';
  let providerUsed = body.apiProvider || 'default';

  if (body.mode === 'api') {
    try {
      let provider;
      
      // Выбор провайдера
      if (body.apiProvider === 'puter') {
        const model = body.puterModel || 'gpt-image-1';
        const quality = body.puterQuality || 'low';
        provider = new PuterProvider(model, quality);
        modelUsed = model;
        providerUsed = 'puter';
        console.log(`[generate] Using Puter.js provider with model: ${model}, quality: ${quality}`);
      } else if (body.apiProvider === 'bytez') {
        const apiKey = process.env.BYTEZ_API_KEY;
        if (!apiKey) {
          throw new Error('BYTEZ_API_KEY not configured in .env.local');
        }
        const model = body.bytezModel || 'google/gemini-3.1-flash-image-preview';
        provider = new BytezProvider(apiKey, model);
        modelUsed = model;
        providerUsed = 'bytez';
        console.log(`[generate] Using Bytez provider with model: ${model}`);
      } else if (body.apiProvider === 'huggingface') {
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
          throw new Error('HUGGINGFACE_API_KEY not configured in .env.local');
        }
        const model = body.huggingfaceModel || 'black-forest-labs/FLUX.1-dev';
        provider = new HuggingFaceProvider(apiKey, model);
        modelUsed = model;
        providerUsed = 'huggingface';
        console.log(`[generate] Using Hugging Face provider with model: ${model}`);
      } else {
        provider = getProvider();
        console.log(`[generate] Using provider: ${provider.name}`);
      }
      
      // Парсим размер изображения
      let width = 1280;
      let height = 720;
      
      if (body.imageSize) {
        const [w, h] = body.imageSize.split('x').map(Number);
        if (w && h) {
          width = w;
          height = h;
        }
      }
      
      console.log(`[generate] Image size: ${width}x${height}`);
      console.log(`[generate] Generation type: ${body.generationType || 'text-to-image'}`);
      
      const result = await provider.generate({
        prompt: mainPrompt,
        negativePrompt,
        referenceImageUrl: body.referenceImageUrl,
        sourceImageUrls: body.sourceImageUrls,
        width,
        height,
        generationType: body.generationType || 'text-to-image',
      });
      generatedImageUrl = result.imageUrl;
      console.log(`[generate] Image generated in ${result.timingMs}ms`);
    } catch (err) {
      console.error('[generate] Provider error:', err);
      error = err instanceof Error ? err.message : 'Image generation failed';
      status = 'error';
    }
  }

  const duration = Date.now() - startTime;
  const requestId = uuidv4();

  // Deduct balance only if generation was successful and user is authenticated
  console.log('[generate] Checking deduction conditions:', {
    status,
    mode: body.mode,
    userId,
    hasUserData: !!userData,
  });
  
  if (status === 'success' && body.mode === 'api' && userId && userData) {
    console.log('[generate] Deducting credit...');
    try {
      const userRef = adminDb.collection('users').doc(userId);
      
      // Sanitize model name for Firestore field path (replace / with _)
      const sanitizedModelName = modelUsed.replace(/\//g, '_');
      
      const updateData: any = {
        totalGenerations: FieldValue.increment(1),
        credits: FieldValue.increment(-1),
      };

      // Update model usage with sanitized name
      updateData[`modelUsage.${sanitizedModelName}`] = FieldValue.increment(1);

      await userRef.update(updateData);
      console.log('[generate] Credit deducted successfully');

      // Save spending transaction
      await adminDb.collection('users').doc(userId).collection('spending_history').add({
        timestamp: new Date(),
        model: modelUsed,
        source: providerUsed,
        tokens: 0,
        duration,
        spent: 1,
        currency: 'credits',
        requestId,
        status: 'success',
      });
      console.log('[generate] Spending transaction saved');

      // Update favorite model (most used)
      const currentModelUsage = userData.modelUsage || {};
      currentModelUsage[sanitizedModelName] = (currentModelUsage[sanitizedModelName] || 0) + 1;
      
      // Find the model with the highest usage count
      let favoriteModel = sanitizedModelName;
      let maxCount = currentModelUsage[sanitizedModelName];
      
      for (const [model, count] of Object.entries(currentModelUsage)) {
        if ((count as number) > maxCount) {
          maxCount = count as number;
          favoriteModel = model;
        }
      }

      await userRef.update({ favoriteModel });
      console.log('[generate] Favorite model updated:', favoriteModel);

    } catch (err) {
      console.error('[generate] Failed to deduct balance:', err);
    }
  } else {
    console.log('[generate] Skipping deduction - conditions not met');
  }

  const entry: HistoryEntry = {
    id: requestId,
    createdAt: new Date().toISOString(),
    mode: body.mode,
    input: body,
    result: {
      generatedPrompt: mainPrompt,
      negativePrompt,
      generatedImageUrl,
    },
    status,
    ...(error && { error }), // Only include error if it exists
  };

  try {
    await saveToHistory(entry);
    
    // Save to user's personal history only if user is authenticated
    if (userId) {
      await adminDb.collection('users').doc(userId).collection('generations').add({
        id: entry.id,
        createdAt: FieldValue.serverTimestamp(),
        mode: entry.mode,
        input: entry.input,
        result: entry.result,
        status: entry.status,
        ...(entry.error && { error: entry.error }),
        userId,
      });
      console.log('[generate] History saved to Firestore');
    }
  } catch (err) {
    console.error('[generate] Failed to save history:', err);
  }

  const response: GenerateApiResponse = {
    id: entry.id,
    generatedPrompt: mainPrompt,
    negativePrompt,
    generatedImageUrl,
    status,
    error,
  };

  return NextResponse.json(response);
}