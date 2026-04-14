import { NextRequest, NextResponse } from 'next/server';
import { generateWBProductCard, WBProductCard } from '@/lib/wildberries-generator';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { FieldValue } from 'firebase-admin/firestore';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  console.log('[wildberries/generate] === API CALLED ===');

  // Apply Rate Limiting (10 requests per minute max)
  const { success, isBot, headers } = checkRateLimit(request, 10, 60000);
  if (!success) {
    if (isBot) {
      return NextResponse.json(
        { error: 'bot_detected', message: 'Подозрительная активность. Пройдите капчу.' }, 
        { status: 429, headers }
      );
    }
    return NextResponse.json(
      { error: 'rate_limit_exceeded', message: 'Слишком много запросов. Подождите немного.' }, 
      { status: 429, headers }
    );
  }
  
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
      console.error('[wildberries/generate] Auth error:', error);
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Get user data
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data()!;

    // Check subscription access (Pro or Unlimited)
    const plan = userData.subscription?.plan || 'free';
    const hasBasicAccess = ['pro', 'unlimited'].includes(plan);
    const hasAdvancedAccess = plan === 'unlimited';

    if (!hasBasicAccess) {
      return NextResponse.json({ 
        error: 'Wildberries generator requires Pro subscription or higher',
        requiredPlan: 'pro'
      }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const product: WBProductCard = body.product;
    const options = body.options || {};

    if (!product || !product.productName || !product.category) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    // Check if advanced features are requested
    if ((options.includeInfographic || options.includeMultipleAngles) && !hasAdvancedAccess) {
      return NextResponse.json({ 
        error: 'Advanced features (infographic, multiple angles) require Unlimited subscription',
        requiredPlan: 'unlimited'
      }, { status: 403 });
    }

    // Check credits (3 credits for basic, 5 for advanced, +2 for fastMode)
    const baseCredits = (options.includeInfographic || options.includeMultipleAngles) ? 5 : 3;
    const creditsRequired = baseCredits + (options.fastMode ? 2 : 0);
    if ((userData.credits || 0) < creditsRequired) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: creditsRequired,
        available: userData.credits || 0
      }, { status: 402 });
    }

    console.log('[wildberries/generate] Generating product card:', product.productName);

    // Generate product card
    const result = await generateWBProductCard(product, options);

    if (result.status === 'error') {
      console.error('[wildberries/generate] Error from generator:', result.error);
      return NextResponse.json({ 
        error: result.error || 'Generation failed'
      }, { status: 500 });
    }

    // Deduct credits
    await userRef.update({
      credits: (userData.credits || 0) - creditsRequired,
      totalGenerations: FieldValue.increment(1),
    });

    const requestId = uuidv4();
    
    // Save to user's personal history
    try {
      await adminDb.collection('users').doc(userId).collection('generations').add({
        id: requestId,
        createdAt: FieldValue.serverTimestamp(),
        mode: 'wildberries',
        input: {
          product,
          options
        },
        result: {
          generatedImageUrl: result.mainImage,
          alternativeImages: result.alternativeImages || null,
          additionalAngles: result.additionalAngles || null,
          infographic: result.infographic || null,
          seoDescription: result.seoDescription || null,
        },
        status: 'success',
        userId,
      });
      console.log('[wildberries/generate] History saved to Firestore');
    } catch (err) {
      console.error('[wildberries/generate] Failed to save history:', err);
    }

    // Save spending history
    try {
      await adminDb.collection('users').doc(userId).collection('spending_history').add({
        timestamp: new Date(),
        model: 'wildberries-generator',
        source: 'wildberries',
        tokens: 0,
        duration: 0,
        spent: creditsRequired,
        currency: 'credits',
        requestId,
        status: 'success',
      });
      console.log('[wildberries/generate] Spending history saved');
    } catch (err) {
      console.error('[wildberries/generate] Failed to save spending history:', err);
    }

    console.log('[wildberries/generate] ✅ Product card generated successfully');

    return NextResponse.json({
      ...result,
      creditsUsed: creditsRequired,
      creditsRemaining: (userData.credits || 0) - creditsRequired,
    });

  } catch (error) {
    console.error('[wildberries/generate] Error:', error);
    return NextResponse.json({ 
      error: 'Generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
