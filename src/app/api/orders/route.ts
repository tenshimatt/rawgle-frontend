import { NextRequest, NextResponse } from 'next/server';

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
}

// In-memory storage (replace with database in production)
const orders = new Map<string, Order>();

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all orders for user
  const userOrders = Array.from(orders.values())
    .filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      status: 'processing',
      items,
      total,
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.set(order.id, order);

    return NextResponse.json({ data: order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
