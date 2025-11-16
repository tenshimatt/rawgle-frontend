import { NextRequest, NextResponse } from 'next/server';

interface Favorite {
  userId: string;
  productId: string;
  addedAt: string;
}

// In-memory storage (replace with database in production)
const favorites = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userFavorites = favorites.get(userId) || new Set();
  return NextResponse.json({ data: Array.from(userFavorites) });
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if (!favorites.has(userId)) {
      favorites.set(userId, new Set());
    }

    favorites.get(userId)!.add(productId);

    return NextResponse.json({ success: true, data: { productId } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if (favorites.has(userId)) {
      favorites.get(userId)!.delete(productId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
