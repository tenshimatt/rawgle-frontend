import { NextRequest, NextResponse } from 'next/server';
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
  trackingNumber?: string;
  trackingUrl?: string;
}

// In-memory storage (fallback)
const orders = new Map<string, Order>();

const ORDERS_KEY = 'orders:';

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
      console.warn('[Orders API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return Array.from(orders.values()).filter(order => order.userId === userId);
    }
  }

  return Array.from(orders.values()).filter(order => order.userId === userId);
}

// Helper: Save orders for a user
async function saveUserOrders(userId: string, userOrders: Order[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${ORDERS_KEY}${userId}`, JSON.stringify(userOrders));
      await redis.expire(`${ORDERS_KEY}${userId}`, 60 * 60 * 24 * 365); // 1 year
      return;
    } catch (error) {
      console.warn('[Orders API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  userOrders.forEach(order => orders.set(order.id, order));
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all orders for user from Redis
  const userOrders = await getUserOrders(userId);
  userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ data: userOrders });
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, items, total, shippingAddress } = await request.json();

    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      status: 'pending', // Start as pending, will be changed to processing after payment
      items,
      total,
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Get existing orders and add new one
    const existingOrders = await getUserOrders(userId);
    existingOrders.push(order);
    await saveUserOrders(userId, existingOrders);

    return NextResponse.json({ data: order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, status, trackingNumber, trackingUrl } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get existing orders
    const existingOrders = await getUserOrders(userId);
    const orderIndex = existingOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = existingOrders[orderIndex];
    const previousStatus = order.status;

    // Update order fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    order.updatedAt = new Date().toISOString();

    // Save updated orders
    await saveUserOrders(userId, existingOrders);

    // If status changed to 'processing', trigger Gelato order creation
    if (status === 'processing' && previousStatus !== 'processing' && !order.gelatoOrderId) {
      try {
        // Call Gelato API to create order
        const gelatoResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/gelato/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (gelatoResponse.ok) {
          const gelatoData = await gelatoResponse.json();
          order.gelatoOrderId = gelatoData.data.gelatoOrderId;
          order.updatedAt = new Date().toISOString();
          await saveUserOrders(userId, existingOrders);
          console.log('[Orders API] Gelato order created:', gelatoData.data.gelatoOrderId);
        } else {
          console.error('[Orders API] Failed to create Gelato order:', await gelatoResponse.text());
        }
      } catch (error) {
        console.error('[Orders API] Error creating Gelato order:', error);
        // Don't fail the order update if Gelato fails
      }
    }

    return NextResponse.json({ data: order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
