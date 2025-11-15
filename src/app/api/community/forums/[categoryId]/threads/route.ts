import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  likes: number;
  lastActivity: string;
}

const getThreadsKey = (categoryId: string) => `forums:threads:${categoryId}`;
const THREADS_ALL_KEY = 'forums:threads:all';

// Helper: Get all threads for a category
async function getThreadsByCategory(categoryId: string): Promise<ForumThread[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(getThreadsKey(categoryId));
      if (data) {
        return JSON.parse(data) as ForumThread[];
      }
      return [];
    } catch (error) {
      console.warn('[Forums API] Redis get threads failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  return [];
}

// Helper: Get all threads (across all categories)
async function getAllThreads(): Promise<ForumThread[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(THREADS_ALL_KEY);
      if (data) {
        return JSON.parse(data) as ForumThread[];
      }
      return [];
    } catch (error) {
      console.warn('[Forums API] Redis get all threads failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  return [];
}

// Helper: Save threads to Redis
async function saveThreads(categoryId: string, threads: ForumThread[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      // Save category-specific threads
      await redis.set(getThreadsKey(categoryId), JSON.stringify(threads));
      await redis.expire(getThreadsKey(categoryId), 60 * 60 * 24 * 90); // 90 days

      // Update all threads cache
      const allThreads = await getAllThreads();
      const otherThreads = allThreads.filter(t => t.categoryId !== categoryId);
      const updatedAllThreads = [...otherThreads, ...threads];
      await redis.set(THREADS_ALL_KEY, JSON.stringify(updatedAllThreads));
      await redis.expire(THREADS_ALL_KEY, 60 * 60 * 24 * 90); // 90 days

      // Update category counts
      const categoriesData = await redis.get('forums:categories:all');
      if (categoriesData) {
        const categories = JSON.parse(categoriesData);
        const category = categories.find((c: any) => c.id === categoryId);
        if (category) {
          category.threadCount = threads.length;
          category.postCount = threads.reduce((sum: number, t: ForumThread) => sum + t.replyCount + 1, 0);
          await redis.set('forums:categories:all', JSON.stringify(categories));
          await redis.expire('forums:categories:all', 60 * 60 * 24 * 365); // 1 year
        }
      }
    } catch (error) {
      console.warn('[Forums API] Redis set threads failed:', error instanceof Error ? error.message : error);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || 'activity';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let threads: ForumThread[] = [];

  if (categoryId === 'all') {
    threads = await getAllThreads();
  } else {
    threads = await getThreadsByCategory(categoryId);
  }

  // Sort threads
  const sortedThreads = [...threads].sort((a, b) => {
    // Pinned threads always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then sort by selected criteria
    if (sortBy === 'activity') {
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    } else if (sortBy === 'replies') {
      return b.replyCount - a.replyCount;
    } else if (sortBy === 'views') {
      return b.viewCount - a.viewCount;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // Paginate
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;
  const paginatedThreads = sortedThreads.slice(startIdx, endIdx);

  return NextResponse.json({
    success: true,
    data: paginatedThreads,
    pagination: {
      page,
      limit,
      total: sortedThreads.length,
      totalPages: Math.ceil(sortedThreads.length / limit),
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required', success: false }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const userName = request.headers.get('x-user-name') || 'Demo User';

  const threads = await getThreadsByCategory(categoryId);

  const newThread: ForumThread = {
    id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    categoryId,
    title: title.trim(),
    content: content.trim(),
    author: {
      id: userId,
      name: userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replyCount: 0,
    viewCount: 0,
    isPinned: false,
    isLocked: false,
    likes: 0,
    lastActivity: new Date().toISOString(),
  };

  threads.unshift(newThread);
  await saveThreads(categoryId, threads);

  return NextResponse.json({ success: true, data: newThread }, { status: 201 });
}
