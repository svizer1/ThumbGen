import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Check if already linked
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data()?.telegramId) {
      return NextResponse.json({ 
        error: 'Already linked',
        telegramId: userDoc.data()?.telegramId 
      }, { status: 400 });
    }

    // Generate unique link token
    const linkToken = `LINK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Save token to Firestore with 10 minute TTL
    await adminDb.collection('link_tokens').doc(linkToken).set({
      userId,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    // Generate bot URL
    const botUrl = `https://t.me/ThumbGenAI_BOT?start=${linkToken}`;

    return NextResponse.json({
      success: true,
      linkToken,
      botUrl,
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Error generating link token:', error);
    return NextResponse.json(
      { error: 'Failed to generate link token' },
      { status: 500 }
    );
  }
}
