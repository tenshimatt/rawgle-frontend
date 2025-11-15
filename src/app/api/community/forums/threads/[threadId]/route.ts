import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { ForumThread } from '../../[categoryId]/threads/route';

const THREADS_ALL_KEY = 'forums:threads:all';
const getThreadsKey = (categoryId: string) => `forums:threads:${categoryId}`;

// Helper: Get all threads
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

// Helper: Get threads by category
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

// Helper: Save threads
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
    } catch (error) {
      console.warn('[Forums API] Redis set threads failed:', error instanceof Error ? error.message : error);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const allThreads = await getAllThreads();
  const thread = allThreads.find(t => t.id === threadId);

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found', success: false }, { status: 404 });
  }

  // Increment view count
  thread.viewCount += 1;
  const categoryThreads = await getThreadsByCategory(thread.categoryId);
  const threadIndex = categoryThreads.findIndex(t => t.id === threadId);
  if (threadIndex !== -1) {
    categoryThreads[threadIndex] = thread;
    await saveThreads(thread.categoryId, categoryThreads);
  }

  return NextResponse.json({ success: true, data: thread });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const body = await request.json();
  const { title, content, isPinned, isLocked } = body;
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - User ID required', success: false },
      { status: 401 }
    );
  }

  const isAdmin = request.headers.get('x-user-role') === 'admin';

  const allThreads = await getAllThreads();
  const thread = allThreads.find(t => t.id === threadId);

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found', success: false }, { status: 404 });
  }

  // Check permissions
  const isAuthor = thread.author.id === userId;
  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Not authorized to edit this thread', success: false }, { status: 403 });
  }

  // Update thread
  if (title !== undefined && isAuthor) {
    thread.title = title.trim();
  }
  if (content !== undefined && isAuthor) {
    thread.content = content.trim();
  }
  if (isPinned !== undefined && isAdmin) {
    thread.isPinned = isPinned;
  }
  if (isLocked !== undefined && isAdmin) {
    thread.isLocked = isLocked;
  }

  thread.updatedAt = new Date().toISOString();

  // Save updated thread
  const categoryThreads = await getThreadsByCategory(thread.categoryId);
  const threadIndex = categoryThreads.findIndex(t => t.id === threadId);
  if (threadIndex !== -1) {
    categoryThreads[threadIndex] = thread;
    await saveThreads(thread.categoryId, categoryThreads);
  }

  return NextResponse.json({ success: true, data: thread });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - User ID required', success: false },
      { status: 401 }
    );
  }

  const isAdmin = request.headers.get('x-user-role') === 'admin';

  const allThreads = await getAllThreads();
  const thread = allThreads.find(t => t.id === threadId);

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found', success: false }, { status: 404 });
  }

  // Check permissions
  const isAuthor = thread.author.id === userId;
  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Not authorized to delete this thread', success: false }, { status: 403 });
  }

  // Delete thread
  const categoryThreads = await getThreadsByCategory(thread.categoryId);
  const updatedThreads = categoryThreads.filter(t => t.id !== threadId);
  await saveThreads(thread.categoryId, updatedThreads);

  // Delete replies
  const redis = getRedis();
  if (redis && isRedisAvailable()) {
    try {
      await redis.del(`forums:replies:${threadId}`);
    } catch (error) {
      console.warn('[Forums API] Failed to delete replies:', error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({ success: true, message: 'Thread deleted successfully' });
}
