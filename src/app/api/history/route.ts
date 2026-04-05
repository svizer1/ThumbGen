import { NextRequest, NextResponse } from 'next/server';
import { getHistory, deleteFromHistory, clearHistory } from '@/lib/history-store';

export async function GET() {
  try {
    const history = await getHistory();
    return NextResponse.json({ history });
  } catch (err) {
    console.error('[/api/history] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true') {
      await clearHistory();
      return NextResponse.json({ success: true, action: 'cleared' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Provide ?id=<entry-id> or ?all=true' }, { status: 400 });
    }

    await deleteFromHistory(id);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('[/api/history] DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}