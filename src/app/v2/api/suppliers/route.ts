import { NextRequest, NextResponse } from 'next/server';
import { rawgleApi, type CloudflareSupplier } from '@/lib/rawgle-api-client';

export const runtime = 'edge';

/**
 * GET /api/suppliers
 *
 * Proxies to Cloudflare Workers API with 9,190+ real suppliers
 *
 * Query parameters:
 * - q: Search query (searches name, city, state, description)
 * - lat: Latitude for nearby search
 * - lng: Longitude for nearby search
 * - radius: Search radius in miles (default: 50)
 * - city: Filter by city (client-side filter)
 * - state: Filter by state (client-side filter)
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
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseInt(searchParams.get('radius') || '50');
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const species = searchParams.get('species') as 'dogs' | 'cats' | 'both' | null;
    const delivery = searchParams.get('delivery');
    const pickup = searchParams.get('pickup');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sort = searchParams.get('sort') || 'name';
    const limit = parseInt(searchParams.get('limit') || '50');

    let results: CloudflareSupplier[] = [];

    // Determine which API to call
    if (lat && lng) {
      // Geolocation-based search
      console.log(`[Suppliers API] Nearby search: lat=${lat}, lng=${lng}, radius=${radius}`);
      const response = await rawgleApi.getNearbySuppliers(
        parseFloat(lat),
        parseFloat(lng),
        radius
      );
      results = response.results || [];
    } else if (searchQuery) {
      // Text-based search
      console.log(`[Suppliers API] Search query: "${searchQuery}"`);
      const response = await rawgleApi.searchSuppliers(searchQuery, 200); // Get more for client filtering
      results = response.results || [];
    } else {
      // Default: Get all suppliers via search with empty query
      console.log('[Suppliers API] Fetching all suppliers');
      const response = await rawgleApi.searchSuppliers('', 200);
      results = response.results || [];
    }

    console.log(`[Suppliers API] Fetched ${results.length} suppliers from Cloudflare`);

    // Apply client-side filters
    if (city) {
      results = results.filter(s =>
        s.city?.toLowerCase() === city.toLowerCase()
      );
    }

    if (state) {
      results = results.filter(s =>
        s.state?.toLowerCase() === state.toLowerCase()
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
      case 'distance':
        // If we have distance data from nearby search
        results.sort((a, b) =>
          (a.distance_miles || 0) - (b.distance_miles || 0)
        );
        break;
      case 'name':
      default:
        results.sort((a, b) => {
          const nameA = a.business_name || a.name || '';
          const nameB = b.business_name || b.name || '';
          return nameA.localeCompare(nameB);
        });
    }

    // Apply limit
    results = results.slice(0, limit);

    console.log(`[Suppliers API] Returning ${results.length} suppliers after filtering`);

    return NextResponse.json({
      success: true,
      count: results.length,
      suppliers: results,
      source: 'cloudflare-d1',
      total_in_database: 9190, // Known production count
    });

  } catch (error: any) {
    console.error('[Suppliers API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch suppliers from production database',
        message: error.message,
        source: 'cloudflare-d1'
      },
      { status: 500 }
    );
  }
}
