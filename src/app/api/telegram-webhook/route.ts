import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/telegram/handlers';
import { TelegramUpdate } from '@/types/telegram';

export async function POST(req: NextRequest) {
  try {
    // Verify secret token (optional but recommended)
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
    const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (expectedToken && secretToken !== expectedToken) {
      console.error('Invalid webhook secret token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse update
    const update: TelegramUpdate = await req.json();

    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Handle update asynchronously
    handleTelegramUpdate(update).catch((error) => {
      console.error('Error handling Telegram update:', error);
    });

    // Return 200 OK immediately
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in Telegram webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    webhook: 'telegram',
    timestamp: new Date().toISOString() 
  });
}
