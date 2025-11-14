import { NextRequest, NextResponse } from 'next/server';
import { supplements } from '@/data/products/supplements';
import { mockProducts } from '@/lib/mock-data';
import { getRedis, isRedisAvailable } from '@/lib/redis';

// In-memory fallback storage
const memoryStorage = new Map<string, CartItem[]>();

// Cart item interface
export interface CartItem {
  productId: string;
  quantity: number;
  sizeOption: string;
  addedAt: string;
  productSnapshot: {
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    species: string;
    inStock: boolean;
  };
}

// Storage key prefix for Redis
const CART_KEY_PREFIX = 'cart:';

// Helper functions for storage (Redis or in-memory fallback)
async function getUserCart(userId: string): Promise<CartItem[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const cartData = await redis.get(`${CART_KEY_PREFIX}${userId}`);
      if (cartData) {
        return JSON.parse(cartData) as CartItem[];
      }
      return [];
    } catch (error) {
      console.warn('[Cart API] Redis get failed, using in-memory fallback:', error instanceof Error ? error.message : error);
      return memoryStorage.get(userId) || [];
    }
  }

  return memoryStorage.get(userId) || [];
}

async function saveUserCart(userId: string, cartItems: CartItem[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${CART_KEY_PREFIX}${userId}`, JSON.stringify(cartItems));
      // Set expiration to 30 days
      await redis.expire(`${CART_KEY_PREFIX}${userId}`, 60 * 60 * 24 * 30);
      return;
    } catch (error) {
      console.warn('[Cart API] Redis set failed, using in-memory fallback:', error instanceof Error ? error.message : error);
    }
  }

  memoryStorage.set(userId, cartItems);
}

/**
 * GET /api/cart
 * Retrieve the user's shopping cart
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';
    const cartItems = await getUserCart(userId);
    const cartSummary = calculateCartSummary(cartItems);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        summary: cartSummary
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add an item to the shopping cart
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';
    const body = await req.json();
    const { productId, quantity, sizeOption } = body;

    // Validation
    if (!productId || !quantity || !sizeOption) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'productId, quantity, and sizeOption are required'
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid quantity',
          message: 'Quantity must be at least 1'
        },
        { status: 400 }
      );
    }

    // Get product details from supplements, mock products, or shop products API
    const supplement = supplements.find(s => s.id === productId);
    const mockProduct = mockProducts.find(p => p.id === productId);
    let product = supplement || mockProduct;

    // If not found in static data, try fetching from shop products API
    if (!product) {
      try {
        const shopProductsRes = await fetch(`http://localhost:3005/api/shop/products`, {
          headers: {
            'x-user-id': userId,
          },
        });
        if (shopProductsRes.ok) {
          const shopData = await shopProductsRes.json();
          product = shopData.data?.find((p: any) => p.id === productId);
        }
      } catch (error) {
        console.error('[Cart API] Failed to fetch shop products:', error);
      }
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: `No product found with ID: ${productId}`
        },
        { status: 404 }
      );
    }

    // Check stock availability (supplements have inStock, mock products don't)
    const inStock = 'inStock' in product ? product.inStock : true;
    if (!inStock) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product out of stock',
          message: 'This product is currently unavailable'
        },
        { status: 400 }
      );
    }

    // For mock products without complex stock tracking, allow up to 100 units
    const stockQuantity = 100;

    if (quantity > stockQuantity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient stock',
          message: `Only ${stockQuantity} units available`
        },
        { status: 400 }
      );
    }

    // Get user's cart
    const cartItems = await getUserCart(userId);

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === productId && item.sizeOption === sizeOption
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const newQuantity = cartItems[existingItemIndex].quantity + quantity;

      if (newQuantity > stockQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient stock',
            message: `Only ${stockQuantity} units available. You already have ${cartItems[existingItemIndex].quantity} in your cart.`
          },
          { status: 400 }
        );
      }

      cartItems[existingItemIndex].quantity = newQuantity;
    } else {
      // Determine product category and species
      const category = 'category' in product ? product.category : 'general';
      const species = 'forSpecies' in product
        ? (product.forSpecies.includes('both' as any) ? 'both' : product.forSpecies[0])
        : 'both';

      // Add new item to cart
      const newCartItem: CartItem = {
        productId,
        quantity,
        sizeOption,
        addedAt: new Date().toISOString(),
        productSnapshot: {
          name: product.name,
          price: product.price,
          imageUrl: 'imageUrl' in product ? product.imageUrl || '' : '',
          category: category,
          species: species,
          inStock: inStock
        }
      };

      cartItems.push(newCartItem);
    }

    await saveUserCart(userId, cartItems);
    const cartSummary = calculateCartSummary(cartItems);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        summary: cartSummary
      },
      message: 'Item added to cart successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add item to cart',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cart
 * Update cart item quantity
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';
    const body = await req.json();
    const { productId, sizeOption, quantity } = body;

    // Validation
    if (!productId || !sizeOption || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'productId, sizeOption, and quantity are required'
        },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid quantity',
          message: 'Quantity cannot be negative'
        },
        { status: 400 }
      );
    }

    const cartItems = await getUserCart(userId);
    const itemIndex = cartItems.findIndex(
      item => item.productId === productId && item.sizeOption === sizeOption
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found in cart'
        },
        { status: 404 }
      );
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      // Verify stock availability (max 100 for all products)
      const stockQuantity = 100;
      if (quantity > stockQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient stock',
            message: `Only ${stockQuantity} units available`
          },
          { status: 400 }
        );
      }

      cartItems[itemIndex].quantity = quantity;
    }

    await saveUserCart(userId, cartItems);
    const cartSummary = calculateCartSummary(cartItems);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        summary: cartSummary
      },
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Clear the entire cart or remove specific item
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const sizeOption = searchParams.get('sizeOption');

    const cartItems = await getUserCart(userId);

    // If productId and sizeOption provided, remove specific item
    if (productId && sizeOption) {
      const itemIndex = cartItems.findIndex(
        item => item.productId === productId && item.sizeOption === sizeOption
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Item not found in cart'
          },
          { status: 404 }
        );
      }

      cartItems.splice(itemIndex, 1);
      await saveUserCart(userId, cartItems);

      return NextResponse.json({
        success: true,
        data: {
          items: cartItems,
          summary: calculateCartSummary(cartItems)
        },
        message: 'Item removed from cart'
      });
    }

    // Otherwise, clear entire cart
    await saveUserCart(userId, []);

    return NextResponse.json({
      success: true,
      data: {
        items: [],
        summary: {
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          freeShippingThreshold: 50,
          qualifiesForFreeShipping: false,
          amountToFreeShipping: 50
        }
      },
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete from cart',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate cart summary
function calculateCartSummary(cartItems: CartItem[]) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productSnapshot.price * item.quantity),
    0
  );

  // Calculate tax (example: 8.5%)
  const taxRate = 0.085;
  const tax = subtotal * taxRate;

  // Calculate shipping (free over $50, otherwise $5.99)
  const shipping = subtotal >= 50 ? 0 : 5.99;

  const total = subtotal + tax + shipping;

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    freeShippingThreshold: 50,
    qualifiesForFreeShipping: subtotal >= 50,
    amountToFreeShipping: subtotal < 50 ? Math.round((50 - subtotal) * 100) / 100 : 0
  };
}
