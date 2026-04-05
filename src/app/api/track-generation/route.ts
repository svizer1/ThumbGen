import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log('[track-generation] === API CALLED ===');
  
  // 1. Verify authentication
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[track-generation] No Bearer token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  let userId: string;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    userId = decodedToken.uid;
    console.log('[track-generation] Auth successful, userId:', userId);
  } catch (error) {
    console.error('[track-generation] Auth error:', error);
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
  }

  // 2. Parse request body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { model, provider, prompt, imageUrl, duration } = body;

  if (!model || !provider || !prompt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 3. Get user data from Firestore
  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log('[track-generation] User not found in Firestore');
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userData = userDoc.data()!;
  console.log('[track-generation] User credits:', userData.credits);

  // 4. Check credits
  if ((userData.credits || 0) <= 0) {
    console.log('[track-generation] Insufficient credits');
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  const requestId = uuidv4();

  try {
    // 5. Deduct credit and update stats atomically
    // Sanitize model name for Firestore field path (replace / with _)
    const sanitizedModelName = model.replace(/\//g, '_');
    
    const updateData: any = {
      credits: FieldValue.increment(-1),
      totalGenerations: FieldValue.increment(1),
      [`modelUsage.${sanitizedModelName}`]: FieldValue.increment(1),
    };

    await userRef.update(updateData);
    console.log('[track-generation] Credit deducted successfully');

    // 6. Save spending transaction
    await adminDb.collection('users').doc(userId).collection('spending_history').add({
      timestamp: new Date(),
      model,
      source: provider,
      tokens: 0,
      duration: duration || 0,
      spent: 1,
      currency: 'credits',
      requestId,
      status: 'success',
    });
    console.log('[track-generation] Spending transaction saved');

    // 7. Update favorite model
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
    console.log('[track-generation] Favorite model updated:', favoriteModel);

    // 8. Save to generations collection
    await adminDb.collection('users').doc(userId).collection('generations').add({
      id: requestId,
      createdAt: new Date().toISOString(),
      mode: 'api',
      result: {
        generatedPrompt: prompt,
        generatedImageUrl: imageUrl || '',
      },
      status: 'success',
      userId,
    });
    console.log('[track-generation] Generation saved to history');

    return NextResponse.json({ 
      success: true, 
      requestId,
      creditsRemaining: (userData.credits || 0) - 1
    });

  } catch (error) {
    console.error('[track-generation] Error updating Firestore:', error);
    return NextResponse.json({ 
      error: 'Failed to track generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
