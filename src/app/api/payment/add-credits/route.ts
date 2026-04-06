import { NextRequest, NextResponse } from 'next/server';
import { addCreditsToUser } from '@/lib/payment/paymentManager';

export async function POST(req: NextRequest) {
  try {
    const { telegramId, credits, transactionId } = await req.json();

    if (!telegramId || !credits || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await addCreditsToUser(telegramId, credits, transactionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add credits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, credits });
  } catch (error) {
    console.error('Error in add-credits endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
