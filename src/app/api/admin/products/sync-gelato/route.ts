import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { gelato } from '@/lib/gelato';
import type { Product, GelatoSyncResponse } from '@/types/product';

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
      console.warn('[Gelato Sync API] Redis get failed:', error instanceof Error ? error.message : error);
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
      console.warn('[Gelato Sync API] Redis set failed:', error instanceof Error ? error.message : error);
    }
  }
}

// Helper: Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST: Sync Gelato catalog
export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { mode = 'update' } = body; // 'update' or 'create'

    console.log('[Gelato Sync] Starting Gelato catalog sync...');

    // Fetch Gelato products
    const gelatoProducts = await gelato.getProducts();

    if (!gelatoProducts || gelatoProducts.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No products found in Gelato catalog',
        synced: 0,
        failed: 0,
      });
    }

    console.log(`[Gelato Sync] Found ${gelatoProducts.length} products in Gelato catalog`);

    let synced = 0;
    let failed = 0;
    const syncedProducts: Product[] = [];
    const allProducts = await getAllProducts();

    for (const gelatoProduct of gelatoProducts) {
      try {
        // Check if product already exists with this Gelato UID
        const existingProduct = allProducts.find(
          p => p.gelatoProductUid === gelatoProduct.uid
        );

        if (existingProduct) {
          // Update existing product
          if (mode === 'update') {
            existingProduct.name = gelatoProduct.title;
            existingProduct.description = gelatoProduct.description || existingProduct.description;
            existingProduct.images = gelatoProduct.images || existingProduct.images;
            existingProduct.categories = gelatoProduct.attributes?.category
              ? [gelatoProduct.attributes.category, ...existingProduct.categories.filter(c => c !== gelatoProduct.attributes?.category)]
              : existingProduct.categories;
            existingProduct.tags = gelatoProduct.attributes?.tags || existingProduct.tags;

            // Update variants
            if (gelatoProduct.variants && gelatoProduct.variants.length > 0) {
              existingProduct.variants = gelatoProduct.variants.map((gv: any, idx: number) => {
                const existingVariant = existingProduct.variants.find(
                  v => v.gelatoVariantUid === gv.uid
                );

                return {
                  id: existingVariant?.id || `var_${existingProduct.id}_${idx}`,
                  sku: gv.sku || existingVariant?.sku || gelato.generateSKU(gelatoProduct.title, gv.attributes),
                  size: gv.attributes?.size,
                  color: gv.attributes?.color,
                  price: gv.pricing?.amount || existingVariant?.price || existingProduct.price,
                  inventory: existingVariant?.inventory || 999, // POD products have unlimited inventory
                  gelatoVariantUid: gv.uid,
                  images: existingVariant?.images,
                };
              });
            }

            existingProduct.lastSyncedAt = new Date().toISOString();
            existingProduct.gelatoSyncStatus = 'synced';
            existingProduct.updatedAt = new Date().toISOString();

            syncedProducts.push(existingProduct);
            synced++;
            console.log(`[Gelato Sync] Updated product: ${existingProduct.name}`);
          } else {
            console.log(`[Gelato Sync] Skipped existing product: ${existingProduct.name}`);
          }
        } else {
          // Create new product from Gelato
          if (mode === 'create' || mode === 'update') {
            const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const basePrice = gelatoProduct.variants?.[0]?.pricing?.amount || 19.99;

            const newProduct: Product = {
              id: productId,
              name: gelatoProduct.title,
              slug: generateSlug(gelatoProduct.title),
              description: gelatoProduct.description || `Custom ${gelatoProduct.title} from Gelato`,
              price: basePrice,
              images: gelatoProduct.images || [],
              gelatoProductUid: gelatoProduct.uid,
              variants: gelatoProduct.variants?.map((gv: any, idx: number) => ({
                id: `var_${productId}_${idx}`,
                sku: gv.sku || gelato.generateSKU(gelatoProduct.title, gv.attributes),
                size: gv.attributes?.size,
                color: gv.attributes?.color,
                price: gv.pricing?.amount || basePrice,
                inventory: 999, // POD products have unlimited inventory
                gelatoVariantUid: gv.uid,
              })) || [],
              categories: gelatoProduct.attributes?.category
                ? [gelatoProduct.attributes.category, 'custom', 'print-on-demand']
                : ['custom', 'print-on-demand'],
              tags: gelatoProduct.attributes?.tags || ['custom', 'personalized'],
              inStock: true,
              inventory: 999,
              status: 'draft', // New synced products start as draft
              seo: {
                metaDescription: gelatoProduct.description?.substring(0, 160) || `Custom ${gelatoProduct.title}`,
                keywords: gelatoProduct.attributes?.tags || ['custom', gelatoProduct.title.toLowerCase()],
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              sales: 0,
              gelatoSyncStatus: 'synced',
              lastSyncedAt: new Date().toISOString(),
            };

            allProducts.push(newProduct);
            syncedProducts.push(newProduct);
            synced++;
            console.log(`[Gelato Sync] Created new product: ${newProduct.name}`);
          }
        }
      } catch (error) {
        console.error(`[Gelato Sync] Failed to sync product ${gelatoProduct.uid}:`, error);
        failed++;
      }
    }

    // Save updated products
    await saveAllProducts(allProducts);

    console.log(`[Gelato Sync] Sync complete. Synced: ${synced}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${synced} products from Gelato catalog`,
      synced,
      failed,
      products: syncedProducts,
    } as GelatoSyncResponse);

  } catch (error) {
    console.error('[Gelato Sync] Sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to sync Gelato catalog',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as GelatoSyncResponse,
      { status: 500 }
    );
  }
}

// GET: Get sync status
export async function GET(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const allProducts = await getAllProducts();
    const gelatoProducts = allProducts.filter(p => p.gelatoProductUid);

    const syncStats = {
      total: gelatoProducts.length,
      synced: gelatoProducts.filter(p => p.gelatoSyncStatus === 'synced').length,
      pending: gelatoProducts.filter(p => p.gelatoSyncStatus === 'pending').length,
      error: gelatoProducts.filter(p => p.gelatoSyncStatus === 'error').length,
      lastSync: gelatoProducts
        .filter(p => p.lastSyncedAt)
        .sort((a, b) => new Date(b.lastSyncedAt!).getTime() - new Date(a.lastSyncedAt!).getTime())[0]?.lastSyncedAt,
    };

    return NextResponse.json({
      success: true,
      stats: syncStats,
      products: gelatoProducts,
    });

  } catch (error) {
    console.error('[Gelato Sync] Status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
