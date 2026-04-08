import { NextRequest, NextResponse } from 'next/server';
import { searchUnsplashPhotos } from '@/lib/unsplash-client';

/**
 * Unsplash Search API Endpoint
 * Search for images on Unsplash
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const orientation = (searchParams.get('orientation') || 'landscape') as 'landscape' | 'portrait' | 'squarish';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    console.log(`[unsplash/search] Searching for: "${query}", page: ${page}`);

    const results = await searchUnsplashPhotos(query, page, perPage, orientation);

    return NextResponse.json({
      total: results.total,
      total_pages: results.total_pages,
      results: results.results.map(img => ({
        id: img.id,
        urls: {
          regular: img.urls.regular,
          small: img.urls.small,
          thumb: img.urls.thumb,
        },
        alt_description: img.alt_description,
        description: img.description,
        user: {
          name: img.user.name,
          username: img.user.username,
          link: img.user.links.html,
        },
        link: img.links.html,
        download_location: img.links.download_location,
        width: img.width,
        height: img.height,
      })),
    });
  } catch (error) {
    console.error('[unsplash/search] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search Unsplash', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
