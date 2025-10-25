import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  stock: number;
  sales: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  createdAt: string;
}

// In-memory product storage for demo
const products = new Map<string, Product>();

// Initialize with mock data
const initMockProducts = () => {
  if (products.size === 0) {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Chicken Wings',
        category: 'raw-meat',
        supplier: 'Raw Food Co.',
        price: 24.99,
        stock: 150,
        sales: 342,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Grass-Fed Beef Chunks',
        category: 'raw-meat',
        supplier: 'Premium Meats Ltd.',
        price: 32.99,
        stock: 85,
        sales: 287,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400',
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        name: 'Wild Salmon Fillets',
        category: 'raw-meat',
        supplier: 'Ocean Fresh',
        price: 42.99,
        stock: 0,
        sales: 156,
        status: 'out_of_stock',
        image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
        createdAt: '2024-02-01'
      },
      {
        id: '4',
        name: 'Raw Marrow Bones',
        category: 'bones',
        supplier: 'Bone Appetit',
        price: 18.99,
        stock: 200,
        sales: 521,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
        createdAt: '2024-02-10'
      },
      {
        id: '5',
        name: 'Chicken Necks (Bulk)',
        category: 'bones',
        supplier: 'Raw Food Co.',
        price: 15.99,
        stock: 120,
        sales: 412,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
        createdAt: '2024-02-15'
      },
      {
        id: '6',
        name: 'Beef Liver',
        category: 'organs',
        supplier: 'Organ Meats Pro',
        price: 22.99,
        stock: 75,
        sales: 198,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
        createdAt: '2024-03-01'
      },
      {
        id: '7',
        name: 'Chicken Hearts',
        category: 'organs',
        supplier: 'Organ Meats Pro',
        price: 19.99,
        stock: 90,
        sales: 234,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400',
        createdAt: '2024-03-05'
      },
      {
        id: '8',
        name: 'Probiotics Supplement',
        category: 'supplements',
        supplier: 'Pet Health Plus',
        price: 28.99,
        stock: 180,
        sales: 567,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        createdAt: '2024-03-10'
      },
      {
        id: '9',
        name: 'Wild Salmon Oil',
        category: 'supplements',
        supplier: 'Pet Health Plus',
        price: 34.99,
        stock: 145,
        sales: 689,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1620843002805-05a08cb72f57?w=400',
        createdAt: '2024-03-15'
      },
      {
        id: '10',
        name: 'Kelp Powder',
        category: 'supplements',
        supplier: 'Ocean Nutrients',
        price: 16.99,
        stock: 220,
        sales: 312,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
        createdAt: '2024-03-20'
      },
      {
        id: '11',
        name: 'Stainless Steel Food Bowl',
        category: 'accessories',
        supplier: 'Pet Gear Co.',
        price: 24.99,
        stock: 95,
        sales: 234,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400',
        createdAt: '2024-04-01'
      },
      {
        id: '12',
        name: 'Freezer Storage Containers',
        category: 'accessories',
        supplier: 'Storage Solutions',
        price: 39.99,
        stock: 68,
        sales: 178,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400',
        createdAt: '2024-04-05'
      },
      {
        id: '13',
        name: 'Organic Turkey Mix',
        category: 'raw-meat',
        supplier: 'Organic Raw',
        price: 38.99,
        stock: 42,
        sales: 156,
        status: 'inactive',
        image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400',
        createdAt: '2024-04-10'
      },
      {
        id: '14',
        name: 'Duck Necks',
        category: 'bones',
        supplier: 'Bone Appetit',
        price: 26.99,
        stock: 88,
        sales: 267,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
        createdAt: '2024-04-15'
      },
      {
        id: '15',
        name: 'Lamb Kidney',
        category: 'organs',
        supplier: 'Organ Meats Pro',
        price: 21.99,
        stock: 54,
        sales: 123,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
        createdAt: '2024-04-20'
      }
    ];

    mockProducts.forEach(product => products.set(product.id, product));
  }
};

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

    initMockProducts();

    return NextResponse.json({
      success: true,
      products: Array.from(products.values())
    });

  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

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

    initMockProducts();

    const body = await req.json();
    const { productId, status, price, stock } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = products.get(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    if (status !== undefined) {
      product.status = status;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (stock !== undefined) {
      product.stock = stock;
      // Auto-update status based on stock
      if (stock === 0) {
        product.status = 'out_of_stock';
      } else if (product.status === 'out_of_stock') {
        product.status = 'active';
      }
    }

    products.set(productId, product);

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Admin product update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

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

    initMockProducts();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!products.has(productId)) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    products.delete(productId);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Admin product delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

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

    initMockProducts();

    const body = await req.json();
    const { name, category, supplier, price, stock, image } = body;

    if (!name || !category || !supplier || price === undefined || stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      category,
      supplier,
      price,
      stock,
      sales: 0,
      status: stock > 0 ? 'active' : 'out_of_stock',
      image: image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      createdAt: new Date().toISOString().split('T')[0]
    };

    products.set(newProduct.id, newProduct);

    return NextResponse.json({
      success: true,
      product: newProduct
    });

  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
