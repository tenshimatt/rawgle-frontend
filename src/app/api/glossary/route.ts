import { NextRequest, NextResponse } from 'next/server';
import {
  glossary,
  getTermsByLetter,
  getTermsByCategory,
  searchTerms,
  getCategories,
  getAvailableLetters,
  type GlossaryCategory,
} from '@/data/glossary';

/**
 * GET /api/glossary
 *
 * Query parameters:
 * - letter: Filter by first letter (A-Z)
 * - category: Filter by category
 * - search: Search terms by query string
 * - all: Return all terms (default if no other params)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const letter = searchParams.get('letter');
    const category = searchParams.get('category') as GlossaryCategory | null;
    const searchQuery = searchParams.get('search');
    const meta = searchParams.get('meta');

    // Return metadata about the glossary
    if (meta === 'true') {
      return NextResponse.json({
        success: true,
        data: {
          totalTerms: glossary.length,
          categories: getCategories(),
          availableLetters: getAvailableLetters(),
        },
      });
    }

    // Filter by letter
    if (letter) {
      const terms = getTermsByLetter(letter);
      return NextResponse.json({
        success: true,
        data: terms,
        count: terms.length,
        filter: { letter },
      });
    }

    // Filter by category
    if (category) {
      const terms = getTermsByCategory(category);
      return NextResponse.json({
        success: true,
        data: terms,
        count: terms.length,
        filter: { category },
      });
    }

    // Search terms
    if (searchQuery) {
      const terms = searchTerms(searchQuery);
      return NextResponse.json({
        success: true,
        data: terms,
        count: terms.length,
        filter: { search: searchQuery },
      });
    }

    // Return all terms (default)
    return NextResponse.json({
      success: true,
      data: glossary,
      count: glossary.length,
    });
  } catch (error) {
    console.error('Glossary API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch glossary terms',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
