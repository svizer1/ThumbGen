import { NextRequest, NextResponse } from 'next/server';
import { verifyCryptoBotWebhook } from '@/lib/cryptobot/webhookVerifier';
import { CryptoBotWebhookUpdate } from '@/types/payment';
import {
  addCreditsToUser,
  activateSubscription,
  isInvoiceProcessed,
  markInvoiceAsProcessed,
} from '@/lib/payment/paymentManager';
import { getTelegramBotClient } from '@/lib/telegram/bot';
import { getMessage } from '@/lib/telegram/messages';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('crypto-pay-api-signature');

    if (!signature) {
      console.error('Missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify webhook signature
    const apiToken = process.env.CRYPTOBOT_API_TOKEN;
    if (!apiToken) {
      console.error('CRYPTOBOT_API_TOKEN not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const isValid = verifyCryptoBotWebhook(body, signature, apiToken);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse webhook data
    const update: CryptoBotWebhookUpdate = JSON.parse(body);

    console.log('Received CryptoBot webhook:', JSON.stringify(update, null, 2));

    // Only process 'invoice_paid' events
    if (update.update_type !== 'invoice_paid') {
      console.log('Ignoring non-payment update:', update.update_type);
      return NextResponse.json({ ok: true });
    }

    const invoice = update.payload;

    // Check if invoice is already processed
    const alreadyProcessed = await isInvoiceProcessed(invoice.invoice_id);
    if (alreadyProcessed) {
      console.log('Invoice already processed:', invoice.invoice_id);
      return NextResponse.json({ ok: true });
    }

    // Parse payload
    let payload: any;
    try {
      payload = JSON.parse(invoice.payload || '{}');
    } catch (error) {
      console.error('Error parsing invoice payload:', error);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { type, credits, plan, telegramId } = payload;

    if (!telegramId) {
      console.error('Missing telegramId in payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Get user language
    const telegramUserDoc = await getDoc(doc(db, 'telegram_users', telegramId.toString()));
    const lang = telegramUserDoc.exists() ? (telegramUserDoc.data().language || 'ru') : 'ru';

    let success = false;
    let rewardText = '';

    // Process payment based on type
    if (type === 'credits') {
      success = await addCreditsToUser(telegramId, credits, invoice.invoice_id);
      if (success) {
        rewardText = getMessage(lang, 'payment_credits_reward', { credits: credits.toString() });
      }
    } else if (type === 'subscription') {
      success = await activateSubscription(telegramId, plan, invoice.invoice_id);
      if (success) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        rewardText = getMessage(lang, 'payment_subscription_reward', {
          plan,
          date: endDate.toLocaleDateString(),
        });
      }
    } else {
      console.error('Unknown payment type:', type);
      return NextResponse.json({ error: 'Unknown payment type' }, { status: 400 });
    }

    if (!success) {
      console.error('Failed to process payment');
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }

    // Mark invoice as processed
    await markInvoiceAsProcessed(invoice.invoice_id, telegramId.toString());

    // Send success notification to user
    try {
      const bot = getTelegramBotClient();
      const successMessage = getMessage(lang, 'payment_success', { reward: rewardText });
      await bot.sendMessage({
        chat_id: telegramId,
        text: successMessage,
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Error sending notification to user:', error);
      // Don't fail the webhook if notification fails
    }

    console.log(`Successfully processed payment for Telegram user ${telegramId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in CryptoBot webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'cryptobot',
    timestamp: new Date().toISOString(),
  });
}
