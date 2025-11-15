import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
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

// GET: Get post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const allPosts = await getAllPosts();
    const post = allPosts.get(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Post fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT: Update post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const allPosts = await getAllPosts();
    const existingPost = allPosts.get(id);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

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
    if (title !== undefined && !title) {
      return NextResponse.json(
        { success: false, error: 'Title cannot be empty' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Handle slug update
    let slug = existingPost.slug;
    if (customSlug && customSlug !== existingPost.slug) {
      slug = slugify(customSlug);
      // Ensure slug is unique
      let slugExists = Array.from(allPosts.values()).some(
        p => p.slug === slug && p.id !== id
      );
      let counter = 1;
      while (slugExists) {
        slug = `${slugify(customSlug)}-${counter}`;
        slugExists = Array.from(allPosts.values()).some(
          p => p.slug === slug && p.id !== id
        );
        counter++;
      }
    } else if (title && title !== existingPost.title) {
      // Auto-generate new slug if title changed
      slug = slugify(title);
      // Ensure slug is unique
      let slugExists = Array.from(allPosts.values()).some(
        p => p.slug === slug && p.id !== id
      );
      let counter = 1;
      while (slugExists) {
        slug = `${slugify(title)}-${counter}`;
        slugExists = Array.from(allPosts.values()).some(
          p => p.slug === slug && p.id !== id
        );
        counter++;
      }
    }

    // Update post
    const updatedPost: Post = {
      ...existingPost,
      title: title !== undefined ? title : existingPost.title,
      slug,
      content: content !== undefined ? content : existingPost.content,
      excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
      featuredImage: featuredImage !== undefined ? featuredImage : existingPost.featuredImage,
      author: author !== undefined ? author : existingPost.author,
      status: status !== undefined ? status : existingPost.status,
      categories: categories !== undefined ? categories : existingPost.categories,
      tags: tags !== undefined ? tags : existingPost.tags,
      seo: seo !== undefined ? seo : existingPost.seo,
      updatedAt: now,
      publishedAt: status === 'published' && !existingPost.publishedAt
        ? now
        : existingPost.publishedAt
    };

    allPosts.set(id, updatedPost);
    await saveAllPosts(allPosts);

    return NextResponse.json({
      success: true,
      post: updatedPost
    });

  } catch (error) {
    console.error('Post update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE: Delete post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const allPosts = await getAllPosts();

    if (!allPosts.has(id)) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    allPosts.delete(id);
    await saveAllPosts(allPosts);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Post delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
