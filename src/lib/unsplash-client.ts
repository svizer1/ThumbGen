/**
 * Unsplash API Client
 * Search and fetch images from Unsplash
 */

const UNSPLASH_ACCESS_KEY = '51TDcLwk-y8roinVlV3S-xFBnJ3NeoB7216F4AqgquE';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download: string;
    download_location: string;
  };
  width: number;
  height: number;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

/**
 * Search photos on Unsplash
 */
export async function searchUnsplashPhotos(
  query: string,
  page: number = 1,
  perPage: number = 12,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
): Promise<UnsplashSearchResponse> {
  try {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY;
    
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      orientation,
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[Unsplash] Search failed:', error);
      throw new Error('Unsplash search failed');
    }

    const data = await response.json();
    console.log(`[Unsplash] Found ${data.total} results for "${query}"`);
    
    return data;
  } catch (error) {
    console.error('[Unsplash] Error:', error);
    throw error;
  }
}

/**
 * Download image from Unsplash
 * This triggers a download event for Unsplash API guidelines
 */
export async function triggerUnsplashDownload(downloadLocation: string): Promise<void> {
  try {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY;
    
    await fetch(downloadLocation, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
      },
    });
    
    console.log('[Unsplash] Download triggered');
  } catch (error) {
    console.error('[Unsplash] Download trigger failed:', error);
  }
}

/**
 * Get random photo from Unsplash
 */
export async function getRandomUnsplashPhoto(
  query?: string,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
): Promise<UnsplashImage> {
  try {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY;
    
    const params = new URLSearchParams({
      orientation,
    });
    
    if (query) {
      params.append('query', query);
    }

    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get random photo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Unsplash] Error getting random photo:', error);
    throw error;
  }
}
