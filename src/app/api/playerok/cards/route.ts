import { NextRequest, NextResponse } from 'next/server';
import { generatePlayerokCards } from '@/lib/playerok-cards';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get('q') ?? '';
  const sizeParam = params.get('size') ?? '60';
  const forceError = params.get('forceError') === '1';

  if (forceError) {
    return NextResponse.json(
      { error: 'Имитация ошибки загрузки Playerok карточек.' },
      { status: 500 }
    );
  }

  const parsedSize = Number.parseInt(sizeParam, 10);
  const size = Number.isFinite(parsedSize) ? Math.min(Math.max(parsedSize, 0), 2000) : 60;

  try {
    const items = generatePlayerokCards(size, search);
    return NextResponse.json({
      items,
      total: items.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Playerok cards API error:', error);
    return NextResponse.json({ error: 'Не удалось загрузить карточки Playerok.' }, { status: 500 });
  }
}
