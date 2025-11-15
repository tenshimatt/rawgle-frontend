import { NextRequest, NextResponse } from 'next/server';
import { gelato } from '@/lib/gelato';
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

interface GelatoWebhookEvent {
  eventType: string;
  orderId: string;
  orderReferenceId: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const ORDERS_KEY = 'orders:';
const GELATO_ORDERS_KEY = 'gelato_orders:';
const WEBHOOK_LOGS_KEY = 'gelato_webhooks:';

// Helper: Get all users' orders (needed to find order by Gelato ID)
async function getAllOrders(): Promise<Map<string, Order[]>> {
  const redis = getRedis();
  const ordersMap = new Map<string, Order[]>();

  if (redis && isRedisAvailable()) {
    try {
      // Scan for all order keys
      const keys = await redis.keys(`${ORDERS_KEY}*`);

      for (const key of keys) {
        const userId = key.replace(ORDERS_KEY, '');
        const data = await redis.get(key);
        if (data) {
          ordersMap.set(userId, JSON.parse(data));
        }
      }
    } catch (error) {
      console.warn('[Gelato Webhooks] Redis scan failed:', error instanceof Error ? error.message : error);
    }
  }

  return ordersMap;
}

// Helper: Find order by Gelato order ID
async function findOrderByGelatoId(gelatoOrderId: string): Promise<{ order: Order; userId: string } | null> {
  const ordersMap = await getAllOrders();

  for (const [userId, orders] of ordersMap.entries()) {
    const order = orders.find(o => o.gelatoOrderId === gelatoOrderId);
    if (order) {
      return { order, userId };
    }
  }

  return null;
}

// Helper: Save orders for a user
async function saveUserOrders(userId: string, userOrders: Order[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${ORDERS_KEY}${userId}`, JSON.stringify(userOrders));
      await redis.expire(`${ORDERS_KEY}${userId}`, 60 * 60 * 24 * 365); // 1 year
    } catch (error) {
      console.warn('[Gelato Webhooks] Redis set failed:', error instanceof Error ? error.message : error);
    }
  }
}

// Helper: Log webhook event
async function logWebhookEvent(event: GelatoWebhookEvent): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const logKey = `${WEBHOOK_LOGS_KEY}${event.orderId}:${Date.now()}`;
      await redis.set(logKey, JSON.stringify(event));
      await redis.expire(logKey, 60 * 60 * 24 * 30); // 30 days
    } catch (error) {
      console.warn('[Gelato Webhooks] Failed to log event:', error instanceof Error ? error.message : error);
    }
  }
}

// Map Gelato status to Rawgle order status
function mapGelatoStatusToRawgleStatus(gelatoStatus: string): 'pending' | 'processing' | 'completed' | 'cancelled' {
  const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'cancelled'> = {
    'draft': 'pending',
    'pending': 'pending',
    'approved': 'processing',
    'production': 'processing',
    'shipped': 'completed',
    'delivered': 'completed',
    'cancelled': 'cancelled',
    'failed': 'cancelled',
  };

  return statusMap[gelatoStatus.toLowerCase()] || 'processing';
}

/**
 * POST /api/gelato/webhooks
 * Handle webhook events from Gelato
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-gelato-signature');

    // Verify webhook signature
    if (signature) {
      const webhookSecret = process.env.GELATO_WEBHOOK_SECRET || '';

      if (webhookSecret) {
        const isValid = gelato.verifyWebhookSignature(body, signature, webhookSecret);

        if (!isValid) {
          console.error('[Gelato Webhooks] Invalid signature');
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          );
        }
      }
    }

    const event: GelatoWebhookEvent = JSON.parse(body);

    console.log('[Gelato Webhooks] Received event:', {
      type: event.eventType,
      orderId: event.orderId,
      status: event.status,
    });

    // Log the webhook event to Redis
    await logWebhookEvent(event);

    // Find the corresponding Rawgle order
    const result = await findOrderByGelatoId(event.orderId);

    if (!result) {
      console.warn('[Gelato Webhooks] Order not found for Gelato ID:', event.orderId);
      return NextResponse.json({ received: true, warning: 'Order not found' });
    }

    const { order, userId } = result;

    // Update order based on event type
    switch (event.eventType) {
      case 'order.created':
      case 'order.approved':
        order.status = 'processing';
        break;

      case 'order.in_production':
        order.status = 'processing';
        break;

      case 'order.shipped':
        order.status = 'completed';
        order.trackingNumber = event.trackingNumber;
        order.trackingUrl = event.trackingUrl;
        break;

      case 'order.delivered':
        order.status = 'completed';
        order.trackingNumber = event.trackingNumber;
        order.trackingUrl = event.trackingUrl;
        break;

      case 'order.cancelled':
      case 'order.failed':
        order.status = 'cancelled';
        break;

      default:
        // Map generic status updates
        if (event.status) {
          order.status = mapGelatoStatusToRawgleStatus(event.status);
        }
    }

    // Update timestamp
    order.updatedAt = new Date().toISOString();

    // Get all orders for this user and update
    const userOrders = await getAllOrders().then(map => map.get(userId) || []);
    const orderIndex = userOrders.findIndex(o => o.id === order.id);

    if (orderIndex !== -1) {
      userOrders[orderIndex] = order;
      await saveUserOrders(userId, userOrders);

      console.log('[Gelato Webhooks] Updated order:', {
        rawgleOrderId: order.id,
        gelatoOrderId: event.orderId,
        newStatus: order.status,
      });
    }

    // TODO: Send notification to user about order status change
    // TODO: Send email update if order is shipped/delivered

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('[Gelato Webhooks] Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gelato/webhooks/logs?orderId=xxx
 * Retrieve webhook logs for debugging (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const redis = getRedis();
    const logs: GelatoWebhookEvent[] = [];

    if (redis && isRedisAvailable()) {
      try {
        const keys = await redis.keys(`${WEBHOOK_LOGS_KEY}${orderId}:*`);

        for (const key of keys) {
          const data = await redis.get(key);
          if (data) {
            logs.push(JSON.parse(data));
          }
        }

        // Sort by timestamp
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } catch (error) {
        console.warn('[Gelato Webhooks] Failed to get logs:', error instanceof Error ? error.message : error);
      }
    }

    return NextResponse.json({ data: logs });

  } catch (error: any) {
    console.error('[Gelato Webhooks] Error getting logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get webhook logs' },
      { status: 500 }
    );
  }
}
