import { NextRequest, NextResponse } from 'next/server';
import { searchSuppliers, suppliers, Supplier } from '@/data/suppliers';

/**
 * Text Search API for Suppliers
 *
 * Searches suppliers by name, address, city, state, and description.
 * Supports pagination for large result sets.
 *
 * GET /api/suppliers/search?q={query}&page={page}&limit={limit}&species={dogs|cats|both}
 *
 * Query Parameters:
 * - q (optional): Search query string (searches name, address, city, state, description)
 * - page (optional): Page number for pagination (default: 1)
 * - limit (optional): Results per page (default: 20, max: 100)
 * - species (optional): Filter by species served (dogs, cats, both)
 *
 * Response:
 * {
 *   results: Supplier[],
 *   page: number,
 *   limit: number,
 *   total: number,
 *   hasMore: boolean,
 *   query: string
 * }
 */

interface SearchParams {
  query: string;
  page: number;
  limit: number;
  species?: 'dogs' | 'cats' | 'both';
}

function parseSearchParams(searchParams: URLSearchParams): SearchParams | { error: string } {
  const query = searchParams.get('q') || '';
  const pageStr = searchParams.get('page');
  const limitStr = searchParams.get('limit');
  const species = searchParams.get('species') as 'dogs' | 'cats' | 'both' | null;

  // Parse page (default 1, min 1)
  let page = 1;
  if (pageStr) {
    page = parseInt(pageStr, 10);
    if (isNaN(page) || page < 1) {
      return { error: 'Invalid page: must be a positive integer' };
    }
  }

  // Parse limit (default 20, max 100)
  let limit = 20;
  if (limitStr) {
    limit = parseInt(limitStr, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return { error: 'Invalid limit: must be between 1 and 100' };
    }
  }

  // Validate species if provided
  if (species && !['dogs', 'cats', 'both'].includes(species)) {
    return { error: 'Invalid species: must be "dogs", "cats", or "both"' };
  }

  return {
    query,
    page,
    limit,
    species: species || undefined,
  };
}

function filterBySpecies(
  suppliers: Supplier[],
  species?: 'dogs' | 'cats' | 'both'
): Supplier[] {
  if (!species) {
    return suppliers;
  }

  return suppliers.filter(
    supplier => supplier.species === species || supplier.species === 'both'
  );
}

function paginateResults(
  results: Supplier[],
  page: number,
  limit: number
): {
  paginatedResults: Supplier[];
  hasMore: boolean;
  total: number;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  const hasMore = endIndex < results.length;

  return {
    paginatedResults,
    hasMore,
    total: results.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);

    // Handle validation errors
    if ('error' in params) {
      return NextResponse.json(
        { error: params.error, results: [] },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Search suppliers by query
    let results: Supplier[];
    if (params.query.trim()) {
      results = searchSuppliers(params.query);
    } else {
      // If no query, return all suppliers
      results = [...suppliers];
    }

    // Filter by species if specified
    if (params.species) {
      results = filterBySpecies(results, params.species);
    }

    // Sort results alphabetically by business name
    results.sort((a, b) => a.business_name.localeCompare(b.business_name));

    // Paginate results
    const { paginatedResults, hasMore, total } = paginateResults(
      results,
      params.page,
      params.limit
    );

    // Format response
    const response = {
      results: paginatedResults,
      page: params.page,
      limit: params.limit,
      total: total,
      hasMore: hasMore,
      query: params.query,
      filters: {
        species: params.species || 'all',
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Cache for 5 minutes
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Supplier search API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        results: [],
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
