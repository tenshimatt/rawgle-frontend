import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

// In-memory store for products
const productsStore = new Map<string, any[]>();

// Initialize with some sample products
const initializeProducts = (userId: string) => {
  if (!productsStore.has(userId)) {
    productsStore.set(userId, [
      {
        id: 'prod_1',
        name: 'Omega-3 Fish Oil Supplement',
        description: 'Premium wild-caught fish oil supplement rich in EPA and DHA for optimal pet health',
        price: 24.99,
        category: 'supplements',
        inStock: true,
        stock: 150,
        rating: 4.8,
        reviews: 245,
        image: '/images/products/fish-oil.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_2',
        name: 'Probiotic Powder',
        description: 'Digestive health support with 10 billion CFU per serving for raw fed pets',
        price: 19.99,
        category: 'supplements',
        inStock: true,
        stock: 200,
        rating: 4.9,
        reviews: 189,
        image: '/images/products/probiotic.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_3',
        name: 'Raw Beef Mix - 5lbs',
        description: 'Premium grass-fed beef blend with organs and bone for complete nutrition',
        price: 34.99,
        category: 'raw-food',
        inStock: true,
        stock: 75,
        rating: 5.0,
        reviews: 412,
        image: '/images/products/beef-mix.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_4',
        name: 'Chicken & Turkey Blend - 5lbs',
        description: 'Complete BARF diet meal with poultry, organs, and ground bone',
        price: 29.99,
        category: 'raw-food',
        inStock: true,
        stock: 100,
        rating: 4.7,
        reviews: 325,
        image: '/images/products/chicken-mix.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_5',
        name: 'Stainless Steel Feeding Bowl Set',
        description: 'Heavy-duty non-slip bowls perfect for raw feeding',
        price: 15.99,
        category: 'supplies',
        inStock: true,
        stock: 300,
        rating: 4.6,
        reviews: 178,
        image: '/images/products/bowls.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_6',
        name: 'Food Scale - Digital',
        description: 'Precise portion control for raw feeding - measures up to 11lbs',
        price: 22.99,
        category: 'supplies',
        inStock: true,
        stock: 125,
        rating: 4.5,
        reviews: 95,
        image: '/images/products/scale.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }
};

const PRODUCTS_KEY = 'shop:products:';

// Helper: Get products for a user
async function getUserProducts(userId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${PRODUCTS_KEY}${userId}`);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with demo data
      initializeProducts(userId);
      const products = productsStore.get(userId) || [];
      await redis.set(`${PRODUCTS_KEY}${userId}`, JSON.stringify(products));
      await redis.expire(`${PRODUCTS_KEY}${userId}`, 60 * 60 * 24 * 180); // 6 months
      return products;
    } catch (error) {
      console.warn('[Shop Products API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      initializeProducts(userId);
      return productsStore.get(userId) || [];
    }
  }

  initializeProducts(userId);
  return productsStore.get(userId) || [];
}

// Helper: Save products for a user
async function saveUserProducts(userId: string, products: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${PRODUCTS_KEY}${userId}`, JSON.stringify(products));
      await redis.expire(`${PRODUCTS_KEY}${userId}`, 60 * 60 * 24 * 180); // 6 months
      return;
    } catch (error) {
      console.warn('[Shop Products API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  productsStore.set(userId, products);
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo-user';
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products = await getUserProducts(userId);

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort by rating desc
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category, stock } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'name, price, and category are required' },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id') || 'demo-user';

    const newProduct = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      inStock: (stock || 0) > 0,
      stock: stock || 0,
      rating: 0,
      reviews: 0,
      image: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userProducts = await getUserProducts(userId);
    userProducts.push(newProduct);
    await saveUserProducts(userId, userProducts);

    return NextResponse.json({
      success: true,
      data: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
