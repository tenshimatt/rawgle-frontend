import { NextRequest, NextResponse } from 'next/server';

// Use the same store as the main products route
// Note: In a real app, this would be in a shared module
const productsStore = new Map<string, any[]>();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const userId = req.headers.get('x-user-id') || 'demo-user';

    const products = productsStore.get(userId) || [];
    const productIndex = products.findIndex(p => p.id === params.id);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id: params.id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
    productsStore.set(userId, products);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';

    const products = productsStore.get(userId) || [];
    const filteredProducts = products.filter(p => p.id !== params.id);

    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    productsStore.set(userId, filteredProducts);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
