import { NextRequest, NextResponse } from 'next/server';
import { suppliers, searchSuppliers, type Supplier } from '@/data/suppliers';

export const runtime = 'edge';

/**
 * GET /api/suppliers
 *
 * Query parameters:
 * - q: Search query (searches name, city, state, description)
 * - city: Filter by city
 * - state: Filter by state
 * - species: Filter by species (dogs, cats, both)
 * - delivery: Filter by delivery availability (true/false)
 * - pickup: Filter by pickup availability (true/false)
 * - minRating: Minimum rating filter (0-5)
 * - sort: Sort by (name, rating, distance) - default: name
 * - limit: Maximum results to return - default: 50
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Get query parameters
    const searchQuery = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const species = searchParams.get('species') as 'dogs' | 'cats' | 'both' | null;
    const delivery = searchParams.get('delivery');
    const pickup = searchParams.get('pickup');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sort = searchParams.get('sort') || 'name';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Start with all suppliers or search results
    let results: Supplier[] = searchQuery
      ? searchSuppliers(searchQuery)
      : [...suppliers];

    // Apply filters
    if (city) {
      results = results.filter(s =>
        s.city.toLowerCase() === city.toLowerCase()
      );
    }

    if (state) {
      results = results.filter(s =>
        s.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (species) {
      results = results.filter(s =>
        s.species === species || s.species === 'both'
      );
    }

    if (delivery !== null) {
      const deliveryBool = delivery === 'true';
      results = results.filter(s => s.delivery === deliveryBool);
    }

    if (pickup !== null) {
      const pickupBool = pickup === 'true';
      results = results.filter(s => s.pickup === pickupBool);
    }

    if (minRating > 0) {
      results = results.filter(s =>
        (s.rating || 0) >= minRating
      );
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        results.sort((a, b) =>
          a.business_name.localeCompare(b.business_name)
        );
        break;
      default:
        // Default to name sorting
        results.sort((a, b) =>
          a.business_name.localeCompare(b.business_name)
        );
    }

    // Apply limit
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: results.length,
      suppliers: results,
    });

  } catch (error: any) {
    console.error('Suppliers API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch suppliers',
        message: error.message
      },
      { status: 500 }
    );
  }
}
