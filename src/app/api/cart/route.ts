import { NextRequest, NextResponse } from 'next/server';

const cartItems: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: cartItems });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, name, price, quantity = 1 } = body;

  const existingItem = cartItems.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    return NextResponse.json({ data: existingItem });
  }

  const newItem = {
    id: Date.now().toString(),
    productId,
    name,
    price,
    quantity,
    createdAt: new Date().toISOString(),
  };

  cartItems.push(newItem);
  return NextResponse.json({ data: newItem }, { status: 201 });
}
