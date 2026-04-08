import { NextRequest, NextResponse } from 'next/server';
import { processMessage, ChatContext } from '@/lib/ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    console.log('[ai-assistant/chat] Processing message:', message);

    const chatContext: ChatContext = {
      userId: context?.userId,
      currentPage: context?.currentPage,
      userPlan: context?.userPlan,
    };

    const response = await processMessage(message, chatContext);

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[ai-assistant/chat] Error:', error);
    return NextResponse.json({ 
      error: 'Chat failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
