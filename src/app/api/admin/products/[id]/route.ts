import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { gelato } from '@/lib/gelato';
import type { Product, ProductUpdateRequest } from '@/types/product';

const PRODUCTS_KEY = 'admin:products:all';

// Helper: Get all products from Redis
async function getAllProducts(): Promise<Product[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(PRODUCTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Products API] Redis get failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  return [];
}

// Helper: Save all products to Redis
async function saveAllProducts(productsList: Product[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(PRODUCTS_KEY, JSON.stringify(productsList));
      await redis.expire(PRODUCTS_KEY, 60 * 60 * 24 * 365); // 1 year
    } catch (error) {
      console.warn('[Products API] Redis set failed:', error instanceof Error ? error.message : error);
    }
  }
}

// GET: Get product details by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const productId = params.id;
    const allProducts = await getAllProducts();
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // If product has Gelato UID, fetch latest sync status
    if (product.gelatoProductUid) {
      try {
        const gelatoProduct = await gelato.getProduct(product.gelatoProductUid);
        if (gelatoProduct) {
          product.gelatoSyncStatus = 'synced';
          product.lastSyncedAt = new Date().toISOString();
        }
      } catch (error) {
        console.warn('[Product API] Failed to sync Gelato status:', error);
      }
    }

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const productId = params.id;
    const updates: Partial<ProductUpdateRequest> = await req.json();

    // Validate Gelato product if being updated
    if (updates.gelatoProductUid) {
      const isValid = await gelato.validateProductUid(updates.gelatoProductUid);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid Gelato product UID' },
          { status: 400 }
        );
      }
    }

    const allProducts = await getAllProducts();
    const productIndex = allProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = allProducts[productIndex];

    // Update product fields
    if (updates.name !== undefined) product.name = updates.name;
    if (updates.description !== undefined) product.description = updates.description;
    if (updates.price !== undefined) product.price = updates.price;
    if (updates.compareAtPrice !== undefined) product.compareAtPrice = updates.compareAtPrice;
    if (updates.images !== undefined) product.images = updates.images;
    if (updates.gelatoProductUid !== undefined) {
      product.gelatoProductUid = updates.gelatoProductUid;
      product.gelatoSyncStatus = updates.gelatoProductUid ? 'synced' : 'never';
      product.lastSyncedAt = updates.gelatoProductUid ? new Date().toISOString() : undefined;
    }
    if (updates.variants !== undefined) {
      product.variants = updates.variants.map((v: any, idx) => ({
        id: v.id || `var_${productId}_${idx}`,
        sku: v.sku || gelato.generateSKU(product.name, { size: v.size, color: v.color }),
        size: v.size,
        color: v.color,
        price: v.price || product.price,
        inventory: v.inventory || 0,
        gelatoVariantUid: v.gelatoVariantUid,
        images: v.images,
      }));
    }
    if (updates.categories !== undefined) product.categories = updates.categories;
    if (updates.tags !== undefined) product.tags = updates.tags;
    if (updates.inventory !== undefined) {
      product.inventory = updates.inventory;
      product.inStock = updates.inventory > 0;
    }
    if (updates.status !== undefined) product.status = updates.status;
    if (updates.seo !== undefined) product.seo = updates.seo;

    // Update slug if name changed
    if (updates.name) {
      product.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    product.updatedAt = new Date().toISOString();

    allProducts[productIndex] = product;
    await saveAllProducts(allProducts);

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const productId = params.id;
    const allProducts = await getAllProducts();
    const filteredProducts = allProducts.filter(p => p.id !== productId);

    if (filteredProducts.length === allProducts.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await saveAllProducts(filteredProducts);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
