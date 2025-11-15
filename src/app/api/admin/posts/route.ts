import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML
  excerpt: string;
  featuredImage?: string;
  author: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const POSTS_KEY = 'admin:posts:all';

// In-memory fallback
const posts = new Map<string, Post>();

// Helper: Generate URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Get all posts from Redis or memory
async function getAllPosts(): Promise<Map<string, Post>> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(POSTS_KEY);
      if (data) {
        const postsArray = JSON.parse(data) as Post[];
        const postsMap = new Map<string, Post>();
        postsArray.forEach(post => postsMap.set(post.id, post));
        return postsMap;
      }
      return new Map();
    } catch (error) {
      console.warn('[Posts API] Redis get posts failed, using fallback:', error instanceof Error ? error.message : error);
      return posts;
    }
  }

  return posts;
}

// Helper: Save all posts to Redis
async function saveAllPosts(postsMap: Map<string, Post>): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const postsArray = Array.from(postsMap.values());
      await redis.set(POSTS_KEY, JSON.stringify(postsArray));
      await redis.expire(POSTS_KEY, 60 * 60 * 24 * 365); // 1 year
      return;
    } catch (error) {
      console.warn('[Posts API] Redis set posts failed:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: already in memory
}

// GET: List all posts with pagination, filters, search
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

    const allPosts = await getAllPosts();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredPosts = Array.from(allPosts.values());

    // Filter by status
    if (status && status !== 'all') {
      filteredPosts = filteredPosts.filter(p => p.status === status);
    }

    // Search in title, content, excerpt
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.content.toLowerCase().includes(searchLower) ||
        p.excerpt.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower)) ||
        p.categories.some(c => c.toLowerCase().includes(searchLower))
      );
    }

    // Sort by updatedAt (newest first)
    filteredPosts.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        total: filteredPosts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPosts.length / limit)
      }
    });

  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST: Create new post
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

    const allPosts = await getAllPosts();
    const body = await req.json();

    const {
      title,
      content,
      excerpt,
      featuredImage,
      author,
      status,
      categories,
      tags,
      seo,
      slug: customSlug
    } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Generate slug (use custom if provided, otherwise auto-generate)
    let slug = customSlug || slugify(title);

    // Ensure slug is unique
    let slugExists = Array.from(allPosts.values()).some(p => p.slug === slug);
    let counter = 1;
    while (slugExists) {
      slug = `${customSlug || slugify(title)}-${counter}`;
      slugExists = Array.from(allPosts.values()).some(p => p.slug === slug);
      counter++;
    }

    const now = new Date().toISOString();
    const postId = `post-${Date.now()}`;

    const newPost: Post = {
      id: postId,
      title,
      slug,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160),
      featuredImage,
      author,
      status: status || 'draft',
      categories: categories || [],
      tags: tags || [],
      seo: seo || { metaDescription: '', keywords: [] },
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : undefined
    };

    allPosts.set(postId, newPost);
    await saveAllPosts(allPosts);

    return NextResponse.json({
      success: true,
      post: newPost
    });

  } catch (error) {
    console.error('Post create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// DELETE: Bulk delete posts
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

    const allPosts = await getAllPosts();
    const { searchParams } = new URL(req.url);
    const postIds = searchParams.get('ids')?.split(',') || [];

    if (postIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No post IDs provided' },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    postIds.forEach(id => {
      if (allPosts.has(id)) {
        allPosts.delete(id);
        deletedCount++;
      }
    });

    await saveAllPosts(allPosts);

    return NextResponse.json({
      success: true,
      message: `${deletedCount} post(s) deleted successfully`,
      deletedCount
    });

  } catch (error) {
    console.error('Posts delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete posts' },
      { status: 500 }
    );
  }
}

// PATCH: Bulk update posts (change status)
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

    const allPosts = await getAllPosts();
    const body = await req.json();
    const { postIds, status } = body;

    if (!postIds || postIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No post IDs provided' },
        { status: 400 }
      );
    }

    if (!status || (status !== 'draft' && status !== 'published')) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    const now = new Date().toISOString();

    postIds.forEach((id: string) => {
      const post = allPosts.get(id);
      if (post) {
        post.status = status;
        post.updatedAt = now;
        if (status === 'published' && !post.publishedAt) {
          post.publishedAt = now;
        }
        allPosts.set(id, post);
        updatedCount++;
      }
    });

    await saveAllPosts(allPosts);

    return NextResponse.json({
      success: true,
      message: `${updatedCount} post(s) updated successfully`,
      updatedCount
    });

  } catch (error) {
    console.error('Posts update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update posts' },
      { status: 500 }
    );
  }
}
