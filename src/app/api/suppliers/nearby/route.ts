import { NextRequest, NextResponse } from 'next/server';
import { findNearbySuppliers, Supplier } from '@/data/suppliers';

/**
 * Nearby Suppliers Search API
 *
 * Finds raw food suppliers within a specified radius of a location.
 * Uses the Haversine formula to calculate distances.
 *
 * GET /api/suppliers/nearby?lat={latitude}&lng={longitude}&radius={km}&species={dogs|cats|both}
 *
 * Query Parameters:
 * - lat (required): Latitude of the center point
 * - lng (required): Longitude of the center point
 * - radius (optional): Search radius in kilometers (default: 50km)
 * - species (optional): Filter by species served (dogs, cats, both)
 *
 * Response:
 * {
 *   results: Array<Supplier & { distance: number }>,
 *   center: { lat: number, lng: number },
 *   radius: number,
 *   count: number
 * }
 */

interface NearbySearchParams {
  lat: number;
  lng: number;
  radius: number;
  species?: 'dogs' | 'cats' | 'both';
}

function parseSearchParams(searchParams: URLSearchParams): NearbySearchParams | { error: string } {
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const radiusStr = searchParams.get('radius');
  const species = searchParams.get('species') as 'dogs' | 'cats' | 'both' | null;

  // Validate required parameters
  if (!latStr || !lngStr) {
    return { error: 'Missing required parameters: lat and lng are required' };
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  // Validate latitude
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return { error: 'Invalid latitude: must be between -90 and 90' };
  }

  // Validate longitude
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return { error: 'Invalid longitude: must be between -180 and 180' };
  }

  // Parse radius (default 50km, max 500km)
  let radius = 50;
  if (radiusStr) {
    radius = parseInt(radiusStr, 10);
    if (isNaN(radius) || radius < 1 || radius > 500) {
      return { error: 'Invalid radius: must be between 1 and 500 km' };
    }
  }

  // Validate species if provided
  if (species && !['dogs', 'cats', 'both'].includes(species)) {
    return { error: 'Invalid species: must be "dogs", "cats", or "both"' };
  }

  return {
    lat,
    lng,
    radius,
    species: species || undefined,
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

    // Find nearby suppliers
    const results = findNearbySuppliers(params.lat, params.lng, params.radius, params.species);

    // Format response
    const response = {
      results: results.map(supplier => ({
        ...supplier,
        // Round distance to 2 decimal places
        distance: Math.round(supplier.distance * 100) / 100,
      })),
      center: {
        lat: params.lat,
        lng: params.lng,
      },
      radius: params.radius,
      count: results.length,
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
        // Cache for 5 minutes (supplier locations don't change frequently)
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Nearby suppliers API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        results: [],
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
