/**
 * Gelato Products API Endpoint
 *
 * Fetches available Gelato products and caches them in Redis.
 * Products are cached for 7 days to minimize API calls.
 */

import { NextRequest, NextResponse } from 'next/server';
import { gelato } from '@/lib/gelato';
import { getRedis, isRedisAvailable } from '@/lib/redis';

// Redis cache key for Gelato products
const PRODUCTS_CACHE_KEY = 'gelato:products:catalog';
const CACHE_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * GET /api/gelato/products
 *
 * Query Parameters:
 * - category: Filter products by category (optional)
 * - country: Filter products available in specific country (optional)
 * - limit: Maximum number of products to return (optional)
 * - offset: Offset for pagination (optional)
 * - refresh: Force refresh cache (optional, set to 'true')
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     products: [...],
 *     total: number,
 *     cached: boolean,
 *     cacheAge: number | null
 *   }
 * }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Build cache key based on parameters
    const cacheKey = `${PRODUCTS_CACHE_KEY}:${category || 'all'}:${country || 'all'}:${limit || 'all'}:${offset || 0}`;

    // Try to get from cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const redis = getRedis();
      if (redis && isRedisAvailable()) {
        try {
          const cached = await redis.get(cacheKey);
          if (cached) {
            const cachedData = JSON.parse(cached);
            const cacheAge = await redis.ttl(cacheKey);

            console.log('[Gelato Products API] Serving from cache', {
              category,
              country,
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
          console.warn('[Gelato Products API] Redis get failed:', error instanceof Error ? error.message : error);
          // Continue to fetch from API
        }
      }
    }

    // Fetch from Gelato API
    console.log('[Gelato Products API] Fetching from Gelato API', {
      category,
      country,
      limit,
      offset,
      forceRefresh,
    });

    const response = await gelato.getProducts({
      category,
      country,
      limit,
      offset,
    });

    const responseData = {
      products: response.products || response,
      total: response.total || (Array.isArray(response) ? response.length : 0),
      cached: false,
      cacheAge: null,
    };

    // Cache the response
    const redis = getRedis();
    if (redis && isRedisAvailable()) {
      try {
        await redis.set(cacheKey, JSON.stringify(responseData));
        await redis.expire(cacheKey, CACHE_EXPIRY_SECONDS);
        console.log('[Gelato Products API] Cached successfully', {
          key: cacheKey,
          expiry: `${CACHE_EXPIRY_SECONDS}s`,
          products: responseData.total,
        });
      } catch (error) {
        console.warn('[Gelato Products API] Redis set failed:', error instanceof Error ? error.message : error);
        // Continue without caching
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    console.error('[Gelato Products API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Gelato products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gelato/products
 *
 * Clear the products cache.
 *
 * Query Parameters:
 * - all: Clear all product caches (optional, set to 'true')
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clearAll = searchParams.get('all') === 'true';

    const redis = getRedis();
    if (!redis || !isRedisAvailable()) {
      return NextResponse.json({
        success: false,
        error: 'Redis not available',
      }, { status: 503 });
    }

    if (clearAll) {
      // Clear all product caches
      const keys = await redis.keys(`${PRODUCTS_CACHE_KEY}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log('[Gelato Products API] Cleared all product caches', { count: keys.length });
        return NextResponse.json({
          success: true,
          message: `Cleared ${keys.length} product cache(s)`,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'No product caches to clear',
        });
      }
    } else {
      // Clear specific cache based on query parameters
      const category = searchParams.get('category') || undefined;
      const country = searchParams.get('country') || undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
      const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

      const cacheKey = `${PRODUCTS_CACHE_KEY}:${category || 'all'}:${country || 'all'}:${limit || 'all'}:${offset || 0}`;

      const deleted = await redis.del(cacheKey);
      console.log('[Gelato Products API] Cleared specific cache', { key: cacheKey, deleted });

      return NextResponse.json({
        success: true,
        message: deleted > 0 ? 'Cache cleared successfully' : 'Cache not found',
      });
    }

  } catch (error) {
    console.error('[Gelato Products API] Error clearing cache:', error);

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
