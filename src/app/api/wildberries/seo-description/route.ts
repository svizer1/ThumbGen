import { NextRequest, NextResponse } from 'next/server';
import { generateWBSEODescription, WBProductCard } from '@/lib/wildberries-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product: WBProductCard = body.product;

    if (!product || !product.productName) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    console.log('[wildberries/seo] Generating SEO description for:', product.productName);

    const seoDescription = await generateWBSEODescription(product);

    return NextResponse.json({
      description: seoDescription,
      wordCount: seoDescription.split(' ').length,
    });

  } catch (error) {
    console.error('[wildberries/seo] Error:', error);
    return NextResponse.json({ 
      error: 'SEO generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
