import { NextRequest, NextResponse } from 'next/server';
import { activateSubscription } from '@/lib/payment/paymentManager';
import { SubscriptionPlan } from '@/types/payment';

export async function POST(req: NextRequest) {
  try {
    const { telegramId, plan, transactionId } = await req.json();

    if (!telegramId || !plan || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await activateSubscription(
      telegramId,
      plan as SubscriptionPlan,
      transactionId
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to activate subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Error in activate-subscription endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
