import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get or create user document
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        uid: userId,
        email: decodedToken.email || null,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
        emailVerified: decodedToken.email_verified || false,
        credits: 10,
        balanceMode: 'credits',
        dollarBalance: 0,
        subscription: {
          plan: 'free',
          status: 'active',
          currentPeriodEnd: null,
        },
        totalGenerations: 0,
        favoriteModel: null,
        modelUsage: {},
        createdAt: new Date(),
      });
    }

    // Get user data
    const userData = (await userRef.get()).data();

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        createdAt: userData?.createdAt?.toDate?.() || new Date(),
      },
    });
  } catch (error: any) {
    console.error('[init-user] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize user' },
      { status: 500 }
    );
  }
}
