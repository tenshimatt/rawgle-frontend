/**
 * Gelato Shipping Quote API Endpoint
 *
 * Provides real-time shipping quotes from Gelato based on destination and products.
 * Quotes are cached briefly (1 hour) to reduce API calls while maintaining freshness.
 */

import { NextRequest, NextResponse } from 'next/server';
import { gelato, type GelatoShippingQuoteRequest } from '@/lib/gelato';
import { getRedis, isRedisAvailable } from '@/lib/redis';

// Redis cache key for shipping quotes
const QUOTE_CACHE_KEY = 'gelato:quote:';
const CACHE_EXPIRY_SECONDS = 60 * 60; // 1 hour (shipping costs can change frequently)

/**
 * POST /api/gelato/quote
 *
 * Request Body:
 * {
 *   destinationCountry: string,    // ISO 3166-1 alpha-2 code (e.g., "US", "GB")
 *   destinationPostCode?: string,  // Optional postal code for more accurate quotes
 *   items: [
 *     {
 *       productUid: string,
 *       variantUid?: string,
 *       quantity: number
 *     }
 *   ]
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     shipmentMethods: [...],
 *     totalProductPrice: { amount: number, currency: string },
 *     cached: boolean,
 *     cacheAge: number | null
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validationError = validateQuoteRequest(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: validationError,
        },
        { status: 400 }
      );
    }

    const quoteRequest: GelatoShippingQuoteRequest = {
      destinationCountry: body.destinationCountry,
      destinationPostCode: body.destinationPostCode,
      items: body.items,
    };

    // Build cache key based on request
    const cacheKey = buildCacheKey(quoteRequest);

    // Try to get from cache first
    const redis = getRedis();
    if (redis && isRedisAvailable()) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          const cacheAge = await redis.ttl(cacheKey);

          console.log('[Gelato Quote API] Serving from cache', {
            destination: quoteRequest.destinationCountry,
            items: quoteRequest.items.length,
            cacheAge: cacheAge > 0 ? `${CACHE_EXPIRY_SECONDS - cacheAge}s ago` : 'unknown',
          });

          return NextResponse.json({
            success: true,
            data: {
              ...cachedData,
              cached: true,
              cacheAge: cacheAge > 0 ? CACHE_EXPIRY_SECONDS - cacheAge : null,
            },
          });
        }
      } catch (error) {
        console.warn('[Gelato Quote API] Redis get failed:', error instanceof Error ? error.message : error);
        // Continue to fetch from API
      }
    }

    // Fetch shipping quote from Gelato API
    console.log('[Gelato Quote API] Fetching quote from Gelato API', {
      destination: quoteRequest.destinationCountry,
      postCode: quoteRequest.destinationPostCode,
      items: quoteRequest.items.length,
    });

    const quote = await gelato.getShippingQuote(quoteRequest);

    const responseData = {
      ...quote,
      cached: false,
      cacheAge: null,
    };

    // Cache the response
    if (redis && isRedisAvailable()) {
      try {
        await redis.set(cacheKey, JSON.stringify(responseData));
        await redis.expire(cacheKey, CACHE_EXPIRY_SECONDS);
        console.log('[Gelato Quote API] Cached successfully', {
          key: cacheKey,
          expiry: `${CACHE_EXPIRY_SECONDS}s`,
          methods: quote.shipmentMethods.length,
        });
      } catch (error) {
        console.warn('[Gelato Quote API] Redis set failed:', error instanceof Error ? error.message : error);
        // Continue without caching
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    console.error('[Gelato Quote API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shipping quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gelato/quote/cache-stats
 *
 * Get statistics about cached quotes.
 */
export async function GET(req: NextRequest) {
  try {
    const redis = getRedis();
    if (!redis || !isRedisAvailable()) {
      return NextResponse.json({
        success: false,
        error: 'Redis not available',
      }, { status: 503 });
    }

    const keys = await redis.keys(`${QUOTE_CACHE_KEY}*`);

    const stats = {
      totalCachedQuotes: keys.length,
      cacheKeyPattern: QUOTE_CACHE_KEY,
      cacheExpiry: `${CACHE_EXPIRY_SECONDS} seconds (${CACHE_EXPIRY_SECONDS / 60} minutes)`,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('[Gelato Quote API] Error getting cache stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get cache statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gelato/quote/cache
 *
 * Clear quote caches.
 */
export async function DELETE(req: NextRequest) {
  try {
    const redis = getRedis();
    if (!redis || !isRedisAvailable()) {
      return NextResponse.json({
        success: false,
        error: 'Redis not available',
      }, { status: 503 });
    }

    const keys = await redis.keys(`${QUOTE_CACHE_KEY}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log('[Gelato Quote API] Cleared all quote caches', { count: keys.length });
      return NextResponse.json({
        success: true,
        message: `Cleared ${keys.length} quote cache(s)`,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'No quote caches to clear',
      });
    }

  } catch (error) {
    console.error('[Gelato Quote API] Error clearing cache:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Validate shipping quote request
 */
function validateQuoteRequest(body: any): string | null {
  if (!body.destinationCountry) {
    return 'destinationCountry is required';
  }

  // Validate country code format (2 letters)
  if (typeof body.destinationCountry !== 'string' || !/^[A-Z]{2}$/i.test(body.destinationCountry)) {
    return 'destinationCountry must be a valid ISO 3166-1 alpha-2 code (e.g., US, GB)';
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return 'items array is required and must not be empty';
  }

  for (let i = 0; i < body.items.length; i++) {
    const item = body.items[i];
    if (!item.productUid) {
      return `items[${i}].productUid is required`;
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      return `items[${i}].quantity must be a positive number`;
    }
  }

  return null;
}

/**
 * Build cache key from quote request
 */
function buildCacheKey(request: GelatoShippingQuoteRequest): string {
  const itemsHash = request.items
    .map(item => `${item.productUid}:${item.variantUid || 'default'}:${item.quantity}`)
    .sort() // Sort to ensure consistent cache keys
    .join('|');

  const country = request.destinationCountry.toUpperCase();
  const postCode = request.destinationPostCode || 'any';

  return `${QUOTE_CACHE_KEY}${country}:${postCode}:${itemsHash}`;
}
