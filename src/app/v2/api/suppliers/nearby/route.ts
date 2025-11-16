import { NextRequest, NextResponse } from 'next/server';
import { rawgleApi } from '@/lib/rawgle-api-client';

/**
 * Nearby Suppliers Search API
 *
 * Proxies to Cloudflare Workers for geolocation-based supplier search
 * Uses production database with 9,190+ suppliers
 *
 * GET /api/suppliers/nearby?lat={latitude}&lng={longitude}&radius={miles}&species={dogs|cats|both}
 *
 * Query Parameters:
 * - lat (required): Latitude of the center point
 * - lng (required): Longitude of the center point
 * - radius (optional): Search radius in miles (default: 50)
 * - species (optional): Filter by species served (dogs, cats, both)
 *
 * Response:
 * {
 *   success: true,
 *   results: Array<Supplier & { distance_miles: number }>,
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

  // Parse radius (default 50 miles, max 500 miles)
  let radius = 50;
  if (radiusStr) {
    radius = parseInt(radiusStr, 10);
    if (isNaN(radius) || radius < 1 || radius > 500) {
      return { error: 'Invalid radius: must be between 1 and 500 miles' };
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

    console.log(`[Nearby API] Searching near lat=${params.lat}, lng=${params.lng}, radius=${params.radius} miles`);

    // Call Cloudflare Workers API
    const response = await rawgleApi.getNearbySuppliers(
      params.lat,
      params.lng,
      params.radius
    );

    let results = response.results || [];

    // Apply species filter client-side if needed
    if (params.species) {
      results = results.filter(s =>
        s.species === params.species || s.species === 'both'
      );
    }

    console.log(`[Nearby API] Found ${results.length} suppliers from Cloudflare D1`);

    // Format response
    const formattedResponse = {
      success: true,
      results: results.map(supplier => ({
        ...supplier,
        // Round distance to 2 decimal places
        distance: supplier.distance_miles ? Math.round(supplier.distance_miles * 100) / 100 : 0,
        distance_miles: supplier.distance_miles ? Math.round(supplier.distance_miles * 100) / 100 : 0,
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
      source: 'cloudflare-d1',
    };

    return NextResponse.json(formattedResponse, {
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
    console.error('[Nearby API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        results: [],
        message: error instanceof Error ? error.message : 'Unknown error',
        source: 'cloudflare-d1',
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
