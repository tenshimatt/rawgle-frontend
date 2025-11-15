import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  color: string;
}

const CATEGORIES_KEY = 'forums:categories:all';

// Default categories
const defaultCategories: ForumCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'New to raw feeding? Start here for basics and beginner tips',
    icon: '🌱',
    threadCount: 0,
    postCount: 0,
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'recipes-nutrition',
    name: 'Recipes & Nutrition',
    description: 'Share recipes, meal plans, and nutritional advice',
    icon: '🍖',
    threadCount: 0,
    postCount: 0,
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Discuss health concerns, vet visits, and wellness tips',
    icon: '💊',
    threadCount: 0,
    postCount: 0,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'success-stories',
    name: 'Success Stories',
    description: 'Share your raw feeding success stories and transformations',
    icon: '⭐',
    threadCount: 0,
    postCount: 0,
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'suppliers-products',
    name: 'Suppliers & Products',
    description: 'Recommend suppliers, products, and equipment',
    icon: '🛒',
    threadCount: 0,
    postCount: 0,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'off-topic',
    name: 'Off-Topic',
    description: 'General pet discussions not related to raw feeding',
    icon: '💬',
    threadCount: 0,
    postCount: 0,
    color: 'bg-gray-100 text-gray-800',
  },
];

// Helper: Get all categories from Redis or memory
async function getAllCategories(): Promise<ForumCategory[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(CATEGORIES_KEY);
      if (data) {
        return JSON.parse(data) as ForumCategory[];
      }
      // Initialize with default data
      await redis.set(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      await redis.expire(CATEGORIES_KEY, 60 * 60 * 24 * 365); // 1 year
      return defaultCategories;
    } catch (error) {
      console.warn('[Forums API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return defaultCategories;
    }
  }

  return defaultCategories;
}

// Helper: Save categories to Redis
async function saveCategories(categories: ForumCategory[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(CATEGORIES_KEY, JSON.stringify(categories));
      await redis.expire(CATEGORIES_KEY, 60 * 60 * 24 * 365); // 1 year
    } catch (error) {
      console.warn('[Forums API] Redis set failed:', error instanceof Error ? error.message : error);
    }
  }
}

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: NextRequest) {
  // Admin only - create new category
  const isAdmin = request.headers.get('x-user-role') === 'admin';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin access required', success: false }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, icon, color } = body;

  if (!name || !description) {
    return NextResponse.json({ error: 'Name and description are required', success: false }, { status: 400 });
  }

  const categories = await getAllCategories();
  const newCategory: ForumCategory = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description,
    icon: icon || '💬',
    threadCount: 0,
    postCount: 0,
    color: color || 'bg-gray-100 text-gray-800',
  };

  categories.push(newCategory);
  await saveCategories(categories);

  return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
}
