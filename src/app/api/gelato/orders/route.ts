import { NextRequest, NextResponse } from 'next/server';
import { gelato, GelatoOrderRequest, GelatoAddress, GelatoOrderItem } from '@/lib/gelato';
import { getRedis, isRedisAvailable } from '@/lib/redis';

interface Order {
  id: string;
  userId: string;
  sessionId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: any[];
  total: number;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
  gelatoOrderId?: string;
}

const ORDERS_KEY = 'orders:';
const GELATO_ORDERS_KEY = 'gelato_orders:';

// Helper: Get orders for a user
async function getUserOrders(userId: string): Promise<Order[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${ORDERS_KEY}${userId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Gelato Orders API] Redis get failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  return [];
}

// Helper: Save orders for a user
async function saveUserOrders(userId: string, userOrders: Order[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${ORDERS_KEY}${userId}`, JSON.stringify(userOrders));
      await redis.expire(`${ORDERS_KEY}${userId}`, 60 * 60 * 24 * 365); // 1 year
    } catch (error) {
      console.warn('[Gelato Orders API] Redis set failed:', error instanceof Error ? error.message : error);
    }
  }
}

// Helper: Store Gelato order mapping
async function storeGelatoOrderMapping(rawgleOrderId: string, gelatoOrderId: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${GELATO_ORDERS_KEY}${rawgleOrderId}`, gelatoOrderId);
      await redis.expire(`${GELATO_ORDERS_KEY}${rawgleOrderId}`, 60 * 60 * 24 * 365); // 1 year
    } catch (error) {
      console.warn('[Gelato Orders API] Failed to store mapping:', error instanceof Error ? error.message : error);
    }
  }
}

// Helper: Get Gelato order ID for a Rawgle order
async function getGelatoOrderId(rawgleOrderId: string): Promise<string | null> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      return await redis.get(`${GELATO_ORDERS_KEY}${rawgleOrderId}`);
    } catch (error) {
      console.warn('[Gelato Orders API] Failed to get mapping:', error instanceof Error ? error.message : error);
      return null;
    }
  }

  return null;
}

/**
 * POST /api/gelato/orders
 * Create a Gelato order from a Rawgle order
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!gelato.isConfigured()) {
      return NextResponse.json(
        { error: 'Gelato API not configured' },
        { status: 503 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the Rawgle order
    const userOrders = await getUserOrders(userId);
    const order = userOrders.find(o => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if Gelato order already exists
    if (order.gelatoOrderId) {
      return NextResponse.json(
        {
          error: 'Gelato order already exists for this order',
          gelatoOrderId: order.gelatoOrderId
        },
        { status: 400 }
      );
    }

    // Map Rawgle order items to Gelato items
    const gelatoItems: GelatoOrderItem[] = order.items.map((item: any) => ({
      productUid: gelato.mapProductToGelatoUid(item.type, item.sizeOption),
      quantity: item.quantity || 1,
      files: item.imageUrl ? [{
        url: item.imageUrl,
        type: 'front'
      }] : undefined,
      options: {
        name: item.name,
        description: item.description,
      }
    }));

    // Map shipping address to Gelato format
    const shippingAddress: GelatoAddress = {
      firstName: order.shippingAddress.firstName || 'Customer',
      lastName: order.shippingAddress.lastName || 'Name',
      addressLine1: order.shippingAddress.addressLine1 || order.shippingAddress.street || '',
      addressLine2: order.shippingAddress.addressLine2 || '',
      city: order.shippingAddress.city || '',
      postCode: order.shippingAddress.postCode || order.shippingAddress.zipCode || '',
      state: order.shippingAddress.state || '',
      country: order.shippingAddress.country || 'US',
      email: order.shippingAddress.email || '',
      phone: order.shippingAddress.phone || '',
    };

    // Create Gelato order request
    const gelatoOrderRequest: GelatoOrderRequest = {
      orderReferenceId: order.id,
      customerReferenceId: userId,
      shippingAddress,
      items: gelatoItems,
      metadata: {
        rawgleOrderId: order.id,
        sessionId: order.sessionId,
        total: order.total,
      }
    };

    // Create order in Gelato
    const gelatoOrder = await gelato.createOrder(gelatoOrderRequest);

    // Update Rawgle order with Gelato order ID
    order.gelatoOrderId = gelatoOrder.id;
    order.updatedAt = new Date().toISOString();

    // Save updated order
    await saveUserOrders(userId, userOrders);

    // Store mapping for reverse lookup
    await storeGelatoOrderMapping(order.id, gelatoOrder.id);

    console.log('[Gelato Orders API] Created order:', {
      rawgleOrderId: order.id,
      gelatoOrderId: gelatoOrder.id,
    });

    return NextResponse.json({
      data: {
        rawgleOrderId: order.id,
        gelatoOrderId: gelatoOrder.id,
        status: gelatoOrder.status,
      }
    });

  } catch (error: any) {
    console.error('[Gelato Orders API] Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Gelato order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gelato/orders?orderId=xxx
 * Retrieve Gelato order status
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!gelato.isConfigured()) {
      return NextResponse.json(
        { error: 'Gelato API not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the Rawgle order
    const userOrders = await getUserOrders(userId);
    const order = userOrders.find(o => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.gelatoOrderId) {
      return NextResponse.json(
        { error: 'No Gelato order exists for this order' },
        { status: 404 }
      );
    }

    // Get status from Gelato
    const gelatoStatus = await gelato.getOrderStatus(order.gelatoOrderId);

    return NextResponse.json({
      data: {
        rawgleOrderId: order.id,
        gelatoOrderId: order.gelatoOrderId,
        status: gelatoStatus.status,
        trackingNumber: gelatoStatus.trackingNumber,
        trackingUrl: gelatoStatus.trackingUrl,
        estimatedDeliveryDate: gelatoStatus.estimatedDeliveryDate,
      }
    });

  } catch (error: any) {
    console.error('[Gelato Orders API] Error getting order status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get Gelato order status' },
      { status: 500 }
    );
  }
}
