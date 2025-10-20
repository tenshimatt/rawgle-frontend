import { NextRequest, NextResponse } from 'next/server';

// Feature 25: Wishlist for shop products
const wishlist: any[] = [];

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const items = wishlist.filter(w => w.userId === userId);
  return NextResponse.json({ data: items });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = request.headers.get('x-user-id');

  const item = {
    id: Date.now().toString(),
    userId,
    ...body,
    addedAt: new Date().toISOString(),
  };

  wishlist.push(item);
  return NextResponse.json({ data: item }, { status: 201 });
}
