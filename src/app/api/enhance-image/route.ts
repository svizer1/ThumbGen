import { NextRequest, NextResponse } from 'next/server';
import { enhanceImage, EnhanceImageRequest } from '@/lib/image-enhancer';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  console.log('[enhance-image] === API CALLED ===');
  
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let userId: string;

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (error) {
      console.error('[enhance-image] Auth error:', error);
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Get user data
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data()!;

    // Check subscription access
    const plan = userData.subscription?.plan || 'free';
    const hasAccess = ['starter', 'pro', 'unlimited'].includes(plan);

    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'Image enhancement requires Starter subscription or higher',
        requiredPlan: 'starter'
      }, { status: 403 });
    }

    // Check credits (1 credit per enhancement)
    const creditsRequired = 1;
    if ((userData.credits || 0) < creditsRequired) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: creditsRequired,
        available: userData.credits || 0
      }, { status: 402 });
    }

    // Parse request body
    const body: EnhanceImageRequest = await request.json();

    if (!body.imageUrl || !body.enhancements || body.enhancements.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    console.log('[enhance-image] Processing enhancements:', body.enhancements);

    // Process image enhancement
    const result = await enhanceImage(body);

    if (result.status === 'error') {
      return NextResponse.json({ 
        error: result.error || 'Enhancement failed'
      }, { status: 500 });
    }

    // Deduct credits
    await userRef.update({
      credits: (userData.credits || 0) - creditsRequired,
    });

    // Save spending history
    try {
      await adminDb.collection('users').doc(userId).collection('spending_history').add({
        timestamp: new Date(),
        model: 'image-enhancement',
        source: 'internal',
        tokens: 0,
        duration: result.processingTime || 0,
        spent: creditsRequired,
        currency: 'credits',
        requestId: 'enhance_' + Date.now(),
        status: 'success',
      });
    } catch (err) {
      console.error('[enhance-image] Failed to save spending history:', err);
    }

    console.log('[enhance-image] ✅ Enhancement successful');

    return NextResponse.json({
      ...result,
      creditsUsed: creditsRequired,
      creditsRemaining: (userData.credits || 0) - creditsRequired,
    });

  } catch (error) {
    console.error('[enhance-image] Error:', error);
    return NextResponse.json({ 
      error: 'Enhancement failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
