import { NextRequest, NextResponse } from 'next/server';
import { articles, getArticlesByCategory, getFeaturedArticles, searchArticles } from '@/data/articles';

export const runtime = 'edge';

/**
 * GET /api/education
 *
 * Query parameters:
 * - category: Filter by category
 * - featured: Filter featured articles (true/false)
 * - q: Search query
 * - limit: Maximum results
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const searchQuery = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results = [...articles];

    // Apply filters
    if (searchQuery) {
      results = searchArticles(searchQuery);
    } else if (category) {
      results = getArticlesByCategory(category);
    } else if (featured === 'true') {
      results = getFeaturedArticles();
    }

    // Sort by date (newest first)
    results.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Apply limit
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: results.length,
      articles: results,
    });

  } catch (error: any) {
    console.error('Education API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        message: error.message
      },
      { status: 500 }
    );
  }
}
