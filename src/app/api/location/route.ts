import { NextRequest, NextResponse } from 'next/server';

/**
 * IP-based Geolocation API
 *
 * Returns the user's approximate location based on their IP address.
 * In production, this would use a geolocation service or Cloudflare's CF-Connecting-IP headers.
 * For development, provides fallback location detection.
 *
 * GET /api/location
 *
 * Response:
 * {
 *   ip: string,
 *   country: string,
 *   city: string,
 *   region: string,
 *   latitude: number,
 *   longitude: number
 * }
 */

interface LocationData {
  ip: string;
  country: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

// Fallback locations for development (major US cities)
const FALLBACK_LOCATIONS: Record<string, LocationData> = {
  default: {
    ip: '127.0.0.1',
    country: 'US',
    city: 'New York',
    region: 'NY',
    latitude: 40.7128,
    longitude: -74.006,
  },
  'san-francisco': {
    ip: '127.0.0.1',
    country: 'US',
    city: 'San Francisco',
    region: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  chicago: {
    ip: '127.0.0.1',
    country: 'US',
    city: 'Chicago',
    region: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  miami: {
    ip: '127.0.0.1',
    country: 'US',
    city: 'Miami',
    region: 'FL',
    latitude: 25.7617,
    longitude: -80.1918,
  },
};

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to localhost
  return '127.0.0.1';
}

/**
 * Geocode IP address using ip-api.com (free tier: 45 requests/min)
 * Alternative services: ipapi.co, ipinfo.io, geoip-db.com
 */
async function geocodeIP(ip: string): Promise<LocationData | null> {
  // Don't geocode localhost/private IPs
  if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null;
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon,query`, {
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn('IP geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status === 'success') {
      return {
        ip: data.query,
        country: data.countryCode || 'US',
        city: data.city || 'Unknown',
        region: data.regionName || data.region || 'Unknown',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
      };
    }

    return null;
  } catch (error) {
    console.warn('IP geocoding error:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const clientIP = getClientIP(request);

    // Try to geocode the IP
    let locationData = await geocodeIP(clientIP);

    // If geocoding failed or is localhost, use fallback
    if (!locationData) {
      // Check if there's a location preference in query params (for testing)
      const searchParams = request.nextUrl.searchParams;
      const locationPreference = searchParams.get('location');

      locationData =
        (locationPreference && FALLBACK_LOCATIONS[locationPreference]) ||
        FALLBACK_LOCATIONS.default;

      // Override IP with actual client IP
      locationData = {
        ...locationData,
        ip: clientIP,
      };
    }

    return NextResponse.json(locationData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Cache for 1 hour (location doesn't change frequently)
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Location API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to determine location',
        ip: '127.0.0.1',
        country: 'US',
        city: 'New York',
        region: 'NY',
        latitude: 40.7128,
        longitude: -74.006,
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
