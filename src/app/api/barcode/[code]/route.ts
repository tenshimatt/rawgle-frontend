import { NextRequest, NextResponse } from 'next/server';

// Mock product database
const products: Record<string, any> = {
  '123456789012': {
    barcode: '123456789012',
    name: 'Premium Raw Chicken',
    brand: 'Raw Essentials',
    category: 'Raw Meat',
    protein: 18,
    fat: 15,
    fiber: 0,
  },
  '987654321098': {
    barcode: '987654321098',
    name: 'Wild Salmon Fillet',
    brand: 'Ocean Fresh',
    category: 'Raw Fish',
    protein: 20,
    fat: 12,
    fiber: 0,
  },
  '555666777888': {
    barcode: '555666777888',
    name: 'Grass-Fed Beef',
    brand: 'Premium Meats',
    category: 'Raw Meat',
    protein: 22,
    fat: 17,
    fiber: 0,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const product = products[code];

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
