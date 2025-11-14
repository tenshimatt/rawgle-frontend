import { NextRequest, NextResponse } from 'next/server';
import { supplements } from '@/data/products/supplements';
import { getRedis, isRedisAvailable } from '@/lib/redis';

// In-memory wishlist storage (fallback when Redis unavailable)
const wishlistStore = new Map<string, Set<string>>();

// Storage key prefix for Redis
const WISHLIST_KEY_PREFIX = 'wishlist:';

const DEMO_USER_ID = 'demo-user';

// Helper functions for Redis storage
async function getUserWishlist(userId: string): Promise<Set<string>> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const wishlistData = await redis.smembers(`${WISHLIST_KEY_PREFIX}${userId}`);
      return new Set(wishlistData);
    } catch (error) {
      console.warn('[Wishlist API] Redis get failed, using in-memory fallback:', error instanceof Error ? error.message : error);
      return wishlistStore.get(userId) || new Set<string>();
    }
  }

  return wishlistStore.get(userId) || new Set<string>();
}

async function addToUserWishlist(userId: string, productId: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.sadd(`${WISHLIST_KEY_PREFIX}${userId}`, productId);
      // Set expiration to 90 days
      await redis.expire(`${WISHLIST_KEY_PREFIX}${userId}`, 60 * 60 * 24 * 90);
      return;
    } catch (error) {
      console.warn('[Wishlist API] Redis add failed, using in-memory fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback to in-memory
  let userWishlist = wishlistStore.get(userId);
  if (!userWishlist) {
    userWishlist = new Set<string>();
    wishlistStore.set(userId, userWishlist);
  }
  userWishlist.add(productId);
}

async function removeFromUserWishlist(userId: string, productId: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.srem(`${WISHLIST_KEY_PREFIX}${userId}`, productId);
      return;
    } catch (error) {
      console.warn('[Wishlist API] Redis remove failed, using in-memory fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback to in-memory
  const userWishlist = wishlistStore.get(userId);
  if (userWishlist) {
    userWishlist.delete(productId);
  }
}

/**
 * GET /api/wishlist
 * Fetch user's wishlist items with full product details
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;

    // Get user's wishlist product IDs from Redis
    const userWishlist = await getUserWishlist(userId);
    const productIds = Array.from(userWishlist);

    // Get full product details for wishlisted items
    const wishlistItems = supplements
      .filter(product => productIds.includes(product.id))
      .map(product => ({
        id: product.id,
        productId: product.id,
        addedAt: new Date().toISOString(), // In production, store actual timestamp
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          size: product.size,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          inStock: product.inStock,
          rating: product.rating,
          reviews: product.reviews,
          featured: product.featured,
          forSpecies: product.forSpecies,
        },
      }));

    return NextResponse.json({
      success: true,
      data: wishlistItems,
      count: wishlistItems.length,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch wishlist',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 * Add item to wishlist
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = supplements.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Get user's wishlist from Redis
    const userWishlist = await getUserWishlist(userId);

    // Check if already in wishlist
    if (userWishlist.has(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product already in wishlist',
        },
        { status: 409 }
      );
    }

    // Add to wishlist in Redis
    await addToUserWishlist(userId, productId);

    const item = {
      id: productId,
      productId,
      addedAt: new Date().toISOString(),
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size: product.size,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        forSpecies: product.forSpecies,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: 'Added to wishlist',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add to wishlist',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wishlist?productId=xxx
 * Remove item from wishlist
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Get user's wishlist from Redis
    const userWishlist = await getUserWishlist(userId);
    if (!userWishlist.has(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not in wishlist',
        },
        { status: 404 }
      );
    }

    // Remove from wishlist in Redis
    await removeFromUserWishlist(userId, productId);

    // Get updated wishlist items
    const updatedWishlist = await getUserWishlist(userId);
    const productIds = Array.from(updatedWishlist);
    const wishlistItems = supplements
      .filter(product => productIds.includes(product.id))
      .map(product => ({
        id: product.id,
        productId: product.id,
        addedAt: new Date().toISOString(),
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          size: product.size,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          inStock: product.inStock,
          rating: product.rating,
          reviews: product.reviews,
          featured: product.featured,
          forSpecies: product.forSpecies,
        },
      }));

    return NextResponse.json({
      success: true,
      data: wishlistItems,
      count: wishlistItems.length,
      message: 'Removed from wishlist',
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove from wishlist',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
