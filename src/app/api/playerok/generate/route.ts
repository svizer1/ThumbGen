import { NextRequest, NextResponse } from 'next/server';
import {
  type PlayerokBannerStyle,
  type PlayerokCard,
  type PlayerokCategory,
  type PlayerokGenerationInput,
} from '@/lib/playerok-cards';
import { generatePlayerokCardsWithImages } from '@/lib/playerok-generator';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_CATEGORIES: PlayerokCategory[] = ['accounts', 'skins', 'boost', 'services'];
const ALLOWED_STYLES: PlayerokBannerStyle[] = [
  'orange_pro',
  'neon_blue',
  'dark_market',
  'chrome_impact',
  'glitch_magenta',
  'retro_comic',
  'ultra_gold',
  'ice_frost',
  'toxic_acid',
  'original',
];

function isAllowedCategory(value: string): value is PlayerokCategory {
  return ALLOWED_CATEGORIES.includes(value as PlayerokCategory);
}

function isAllowedStyle(value: string): value is PlayerokBannerStyle {
  return ALLOWED_STYLES.includes(value as PlayerokBannerStyle);
}

async function resolveUser(request: NextRequest): Promise<{ userId: string; userData: any } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return null;
  }

  return { userId, userData: userDoc.data()! };
}

export async function GET(request: NextRequest) {
  try {
    const resolved = await resolveUser(request);
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = resolved;
    const snap = await adminDb
      .collection('users')
      .doc(userId)
      .collection('generations')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const items: PlayerokCard[] = [];
    for (const doc of snap.docs) {
      const row = doc.data();
      if (row.mode !== 'playerok' || !row.playerokCard) {
        continue;
      }
      items.push(row.playerokCard as PlayerokCard);
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Playerok saved cards GET error:', error);
    return NextResponse.json({ error: 'Не удалось загрузить сохраненные карточки.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const resolved = await resolveUser(request);
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, userData } = resolved;
    const plan = userData.subscription?.plan || 'free';
    const hasAccess = ['pro', 'unlimited'].includes(plan);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Генерация Playerok доступна только для Pro и выше.', requiredPlan: 'pro' },
        { status: 403 }
      );
    }

    const credits = userData.credits || 0;
    if (credits < 1) {
      return NextResponse.json({ error: 'Недостаточно кредитов.', required: 1, available: credits }, { status: 402 });
    }

    const body = (await request.json()) as Partial<PlayerokGenerationInput>;

    if (!body.productName || !body.productName.trim()) {
      return NextResponse.json({ error: 'Укажите заголовок карточек.' }, { status: 400 });
    }

    if (!body.category || !isAllowedCategory(body.category)) {
      return NextResponse.json({ error: 'Выберите корректную категорию.' }, { status: 400 });
    }

    if (body.style && !isAllowedStyle(body.style)) {
      return NextResponse.json({ error: 'Выберите корректный стиль.' }, { status: 400 });
    }

    const input: PlayerokGenerationInput = {
      productName: body.productName,
      description: body.description ?? '',
      category: body.category,
      count: 1,
      style: body.style ?? 'orange_pro',
      topText: body.topText ?? body.productName,
      middleText: body.middleText ?? '1 МЕСЯЦ',
      bottomText: body.bottomText ?? 'ПОДПИСКА PRO',
      accentText: body.accentText ?? '★',
    };

    const items = await generatePlayerokCardsWithImages(input);
    const requestId = uuidv4();

    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      credits: FieldValue.increment(-1),
      totalGenerations: FieldValue.increment(1),
    });

    if (items[0]) {
      await userRef.collection('generations').add({
        id: requestId,
        createdAt: FieldValue.serverTimestamp(),
        mode: 'playerok',
        playerokCard: items[0],
        input: {
          generalDescription: input.description || input.productName,
          mode: 'playerok',
          productName: input.productName,
          description: input.description,
          category: input.category,
          style: input.style,
          topText: input.topText,
          middleText: input.middleText,
          bottomText: input.bottomText,
          accentText: input.accentText,
        },
        result: {
          generatedPrompt: [input.topText, input.middleText, input.bottomText].filter(Boolean).join(' | '),
          negativePrompt: '',
          generatedImageUrl: items[0].imageUrl,
        },
        status: 'success',
      });
    }

    try {
      await userRef.collection('spending_history').add({
        timestamp: new Date(),
        model: 'playerok-generator',
        source: 'playerok',
        tokens: 0,
        duration: 0,
        spent: 1,
        currency: 'credits',
        requestId,
        status: 'success',
      });
      console.log('[playerok/generate] Spending history saved');
    } catch (err) {
      console.error('[playerok/generate] Failed to save spending history:', err);
    }

    return NextResponse.json({
      items,
      total: items.length,
      creditsUsed: 1,
      creditsRemaining: Math.max(0, credits - 1),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Playerok generate API error:', error);
    return NextResponse.json({ error: 'Ошибка генерации карточек Playerok.' }, { status: 500 });
  }
}
