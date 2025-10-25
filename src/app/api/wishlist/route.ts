import { NextRequest, NextResponse } from 'next/server';
import { supplements } from '@/data/products/supplements';

// In-memory wishlist storage (Map keyed by userId)
// Structure: Map<userId, Set<productId>>
const wishlistStore = new Map<string, Set<string>>();

// Initialize with mock data for demo-user
const DEMO_USER_ID = 'demo-user';
const demoWishlist = new Set<string>([
  'omega3-fish-oil-1',
  'probiotic-1',
  'joint-support-1',
  'taurine-cats-1',
  'vitamin-e-1',
  'bone-meal-calcium-1',
  'green-lipped-mussel-1',
]);
wishlistStore.set(DEMO_USER_ID, demoWishlist);

/**
 * GET /api/wishlist
 * Fetch user's wishlist items with full product details
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;

    // Get user's wishlist product IDs
    const userWishlist = wishlistStore.get(userId) || new Set<string>();
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

    // Get or create user's wishlist
    let userWishlist = wishlistStore.get(userId);
    if (!userWishlist) {
      userWishlist = new Set<string>();
      wishlistStore.set(userId, userWishlist);
    }

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

    // Add to wishlist
    userWishlist.add(productId);

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

    // Get user's wishlist
    const userWishlist = wishlistStore.get(userId);
    if (!userWishlist || !userWishlist.has(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not in wishlist',
        },
        { status: 404 }
      );
    }

    // Remove from wishlist
    userWishlist.delete(productId);

    // Get updated wishlist items
    const productIds = Array.from(userWishlist);
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
