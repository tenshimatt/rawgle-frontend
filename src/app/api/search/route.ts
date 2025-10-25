import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration - replace with actual database queries
const mockProducts = [
  {
    id: 'prod-1',
    title: 'Premium Raw Chicken Mix',
    category: 'Raw Meat',
    url: '/shop/prod-1',
    description: 'High-quality chicken mix with organ meats',
  },
  {
    id: 'prod-2',
    title: 'Beef & Bone Formula',
    category: 'Raw Meat',
    url: '/shop/prod-2',
    description: 'Complete beef formula with ground bone',
  },
  {
    id: 'prod-3',
    title: 'Turkey & Vegetable Blend',
    category: 'Raw Meat',
    url: '/shop/prod-3',
    description: 'Nutrient-rich turkey with organic vegetables',
  },
  {
    id: 'prod-4',
    title: 'Fish & Seafood Mix',
    category: 'Raw Meat',
    url: '/shop/prod-4',
    description: 'Omega-3 rich fish and seafood blend',
  },
];

const mockCourses = [
  {
    id: 'course-1',
    title: 'Raw Feeding 101',
    category: 'Beginner',
    url: '/education/raw-feeding-101',
    description: 'Complete introduction to raw feeding for dogs',
  },
  {
    id: 'course-2',
    title: 'Advanced Nutrition Planning',
    category: 'Advanced',
    url: '/education/advanced-nutrition',
    description: 'Create custom meal plans for your pet',
  },
  {
    id: 'course-3',
    title: 'Raw Feeding for Puppies',
    category: 'Specialized',
    url: '/education/puppies',
    description: 'Nutritional requirements for growing puppies',
  },
];

const mockBreeds = [
  {
    id: 'breed-1',
    title: 'German Shepherd Nutrition Guide',
    category: 'Large Breed',
    url: '/education/breeds/german-shepherd',
    description: 'Specific feeding guidelines for German Shepherds',
  },
  {
    id: 'breed-2',
    title: 'Golden Retriever Feeding',
    category: 'Large Breed',
    url: '/education/breeds/golden-retriever',
    description: 'Raw diet recommendations for Golden Retrievers',
  },
  {
    id: 'breed-3',
    title: 'Bulldog Dietary Needs',
    category: 'Medium Breed',
    url: '/education/breeds/bulldog',
    description: 'Special considerations for Bulldog nutrition',
  },
];

const mockSupplements = [
  {
    id: 'supp-1',
    title: 'Omega-3 Fish Oil',
    category: 'Essential Fatty Acids',
    url: '/shop/supp-1',
    description: 'Premium fish oil for coat and joint health',
  },
  {
    id: 'supp-2',
    title: 'Probiotics for Dogs',
    category: 'Digestive Health',
    url: '/shop/supp-2',
    description: 'Support healthy gut bacteria',
  },
  {
    id: 'supp-3',
    title: 'Joint Support Complex',
    category: 'Joint Health',
    url: '/shop/supp-3',
    description: 'Glucosamine and chondroitin formula',
  },
  {
    id: 'supp-4',
    title: 'Vitamin E Supplement',
    category: 'Vitamins',
    url: '/shop/supp-4',
    description: 'Antioxidant support for immune health',
  },
];

const mockPosts = [
  {
    id: 'post-1',
    title: 'My Raw Feeding Journey',
    category: 'Success Story',
    url: '/community/post-1',
    description: '6 months of raw feeding transformation',
  },
  {
    id: 'post-2',
    title: 'Best Local Raw Suppliers',
    category: 'Discussion',
    url: '/community/post-2',
    description: 'Share your favorite local suppliers',
  },
  {
    id: 'post-3',
    title: 'Transitioning Tips',
    category: 'Help & Advice',
    url: '/community/post-3',
    description: 'How to transition from kibble to raw',
  },
];

const mockGuides = [
  {
    id: 'guide-1',
    title: 'Understanding BARF Diet',
    category: 'Fundamentals',
    url: '/education/barf-diet',
    description: 'Biologically Appropriate Raw Food explained',
  },
  {
    id: 'guide-2',
    title: 'Meal Prep Guide',
    category: 'Practical',
    url: '/education/meal-prep',
    description: 'Step-by-step meal preparation',
  },
  {
    id: 'guide-3',
    title: 'Food Safety & Storage',
    category: 'Safety',
    url: '/education/food-safety',
    description: 'Safe handling and storage practices',
  },
  {
    id: 'guide-4',
    title: 'Cost Calculator Guide',
    category: 'Planning',
    url: '/education/cost-calculator',
    description: 'Budget your raw feeding expenses',
  },
];

// Search function with filtering
function searchItems(query: string, items: any[]) {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Minimum query length
    if (query.length < 2) {
      return NextResponse.json({
        results: {
          products: [],
          courses: [],
          breeds: [],
          supplements: [],
          posts: [],
          guides: [],
        },
      });
    }

    // Search across all content types
    const results = {
      products: searchItems(query, mockProducts).slice(0, 5),
      courses: searchItems(query, mockCourses).slice(0, 3),
      breeds: searchItems(query, mockBreeds).slice(0, 3),
      supplements: searchItems(query, mockSupplements).slice(0, 5),
      posts: searchItems(query, mockPosts).slice(0, 3),
      guides: searchItems(query, mockGuides).slice(0, 4),
    };

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for more complex search queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    // Implement filtered search logic here
    // Example: filter by category, date, price range, etc.

    return NextResponse.json({
      results: {
        products: [],
        courses: [],
        breeds: [],
        supplements: [],
        posts: [],
        guides: [],
      },
    });
  } catch (error) {
    console.error('Search POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

/*
 * Database Integration Guide:
 *
 * Replace mock data with actual database queries:
 *
 * import { db } from '@/lib/db';
 *
 * const products = await db.product.findMany({
 *   where: {
 *     OR: [
 *       { title: { contains: query, mode: 'insensitive' } },
 *       { description: { contains: query, mode: 'insensitive' } },
 *     ],
 *   },
 *   take: 5,
 * });
 *
 * For better performance, consider:
 * - Full-text search (PostgreSQL: pg_trgm, ts_vector)
 * - Elasticsearch or Algolia integration
 * - Redis caching for popular queries
 * - Debouncing on frontend (already implemented)
 */
