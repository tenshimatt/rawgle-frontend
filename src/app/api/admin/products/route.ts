import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { gelato } from '@/lib/gelato';
import type { Product, ProductFilters, ProductCreateRequest } from '@/types/product';

// In-memory product storage for fallback
const productsMap = new Map<string, Product>();

const PRODUCTS_KEY = 'admin:products:all';

// Helper: Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Get all products from Redis or fallback
async function getAllProducts(): Promise<Product[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(PRODUCTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with demo data
      const demoProducts = initMockProducts();
      await redis.set(PRODUCTS_KEY, JSON.stringify(demoProducts));
      await redis.expire(PRODUCTS_KEY, 60 * 60 * 24 * 365); // 1 year
      return demoProducts;
    } catch (error) {
      console.warn('[Products API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return Array.from(productsMap.values());
    }
  }

  if (productsMap.size === 0) {
    const demoProducts = initMockProducts();
    demoProducts.forEach(p => productsMap.set(p.id, p));
  }
  return Array.from(productsMap.values());
}

// Helper: Save all products to Redis
async function saveAllProducts(productsList: Product[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(PRODUCTS_KEY, JSON.stringify(productsList));
      await redis.expire(PRODUCTS_KEY, 60 * 60 * 24 * 365); // 1 year
      return;
    } catch (error) {
      console.warn('[Products API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  productsMap.clear();
  productsList.forEach(p => productsMap.set(p.id, p));
}

// Initialize with mock data
function initMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Premium Chicken Wings',
      slug: 'premium-chicken-wings',
      description: 'High-quality raw chicken wings perfect for your pet\'s diet',
      price: 24.99,
      compareAtPrice: 29.99,
      images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
      variants: [
        {
          id: 'v1',
          sku: 'CHIWNG-5LB-001',
          size: '5 lbs',
          price: 24.99,
          inventory: 150,
        },
        {
          id: 'v2',
          sku: 'CHIWNG-10LB-001',
          size: '10 lbs',
          price: 44.99,
          inventory: 100,
        },
      ],
      categories: ['raw-meat', 'chicken'],
      tags: ['raw', 'chicken', 'wings', 'protein'],
      inStock: true,
      inventory: 250,
      status: 'active',
      seo: {
        metaDescription: 'Premium raw chicken wings for your pet',
        keywords: ['raw chicken', 'pet food', 'chicken wings'],
      },
      supplier: 'Raw Food Co.',
      sales: 342,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
      gelatoSyncStatus: 'never',
    },
    {
      id: '2',
      name: 'Grass-Fed Beef Chunks',
      slug: 'grass-fed-beef-chunks',
      description: 'Premium grass-fed beef chunks, perfect for raw feeding',
      price: 32.99,
      images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400'],
      variants: [
        {
          id: 'v3',
          sku: 'BEEF-5LB-001',
          size: '5 lbs',
          price: 32.99,
          inventory: 85,
        },
      ],
      categories: ['raw-meat', 'beef'],
      tags: ['raw', 'beef', 'grass-fed'],
      inStock: true,
      inventory: 85,
      status: 'active',
      seo: {
        metaDescription: 'Grass-fed beef chunks for raw pet diet',
        keywords: ['grass-fed beef', 'raw beef', 'pet food'],
      },
      supplier: 'Premium Meats Ltd.',
      sales: 287,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z',
      gelatoSyncStatus: 'never',
    },
    {
      id: '3',
      name: 'Custom Pet Mug',
      slug: 'custom-pet-mug',
      description: 'Personalized mug with your pet\'s photo',
      price: 18.99,
      gelatoProductUid: 'gelato_mug_001',
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'],
      variants: [
        {
          id: 'v4',
          sku: 'MUG-11OZ-WHT',
          size: '11oz',
          color: 'white',
          price: 18.99,
          inventory: 999,
          gelatoVariantUid: 'gelato_mug_001_white',
        },
        {
          id: 'v5',
          sku: 'MUG-11OZ-BLK',
          size: '11oz',
          color: 'black',
          price: 19.99,
          inventory: 999,
          gelatoVariantUid: 'gelato_mug_001_black',
        },
      ],
      categories: ['accessories', 'custom'],
      tags: ['mug', 'custom', 'personalized'],
      inStock: true,
      inventory: 999,
      status: 'active',
      seo: {
        metaDescription: 'Custom pet photo mug - print on demand',
        keywords: ['custom mug', 'pet mug', 'personalized'],
      },
      sales: 156,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
      lastSyncedAt: '2025-01-15T00:00:00Z',
      gelatoSyncStatus: 'synced',
    },
  ];
}

// GET: List all products with filtering and pagination
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

    const { searchParams } = new URL(req.url);
    const filters: ProductFilters = {
      category: searchParams.get('category') || undefined,
      status: (searchParams.get('status') as any) || 'all',
      search: searchParams.get('search') || undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    let productsList = await getAllProducts();

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      productsList = productsList.filter(p => p.categories.includes(filters.category!));
    }

    if (filters.status && filters.status !== 'all') {
      productsList = productsList.filter(p => p.status === filters.status);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      productsList = productsList.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.inStock !== undefined) {
      productsList = productsList.filter(p => p.inStock === filters.inStock);
    }

    // Sort
    productsList.sort((a, b) => {
      const aVal = a[filters.sortBy!] as any;
      const bVal = b[filters.sortBy!] as any;

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = productsList.length;
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = productsList.slice(start, end);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total,
      page,
      limit,
    });

  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Create new product
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

    const body: ProductCreateRequest = await req.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      gelatoProductUid,
      variants,
      categories,
      tags,
      inventory,
      status,
      seo,
    } = body;

    // Validation
    if (!name || !description || price === undefined || !categories || !tags) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Gelato product if provided
    if (gelatoProductUid) {
      const isValid = await gelato.validateProductUid(gelatoProductUid);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid Gelato product UID' },
          { status: 400 }
        );
      }
    }

    // Generate product ID and slug
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const slug = generateSlug(name);

    // Process variants or create default
    const productVariants = variants && variants.length > 0
      ? variants.map((v, idx) => ({
          id: `var_${productId}_${idx}`,
          sku: v.sku || gelato.generateSKU(name, { size: v.size, color: v.color }),
          size: v.size,
          color: v.color,
          price: v.price || price,
          inventory: v.inventory || 0,
          gelatoVariantUid: v.gelatoVariantUid,
          images: v.images,
        }))
      : [
          {
            id: `var_${productId}_0`,
            sku: gelato.generateSKU(name),
            price,
            inventory: inventory || 0,
          },
        ];

    const newProduct: Product = {
      id: productId,
      name,
      slug,
      description,
      price,
      compareAtPrice,
      images: images || [],
      gelatoProductUid,
      variants: productVariants,
      categories,
      tags,
      inStock: inventory > 0,
      inventory: inventory || 0,
      status: status || 'draft',
      seo: seo || {
        metaDescription: description.substring(0, 160),
        keywords: tags,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sales: 0,
      gelatoSyncStatus: gelatoProductUid ? 'synced' : 'never',
      lastSyncedAt: gelatoProductUid ? new Date().toISOString() : undefined,
    };

    // Save product
    const allProducts = await getAllProducts();
    allProducts.push(newProduct);
    await saveAllProducts(allProducts);

    return NextResponse.json({
      success: true,
      product: newProduct,
    }, { status: 201 });

  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH: Update product
export async function PATCH(req: NextRequest) {
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
    const { productId, status, price, stock, ...updates } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
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
    if (status !== undefined) {
      product.status = status;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (stock !== undefined) {
      product.inventory = stock;
      product.inStock = stock > 0;
    }

    // Apply other updates
    Object.assign(product, updates);
    product.updatedAt = new Date().toISOString();

    allProducts[productIndex] = product;
    await saveAllProducts(allProducts);

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error('Admin product update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

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
    console.error('Admin product delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
