import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { ForumThread } from '../../../[categoryId]/threads/route';

export interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
}

const getRepliesKey = (threadId: string) => `forums:replies:${threadId}`;
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

// Helper: Get replies for a thread
async function getReplies(threadId: string): Promise<ForumReply[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(getRepliesKey(threadId));
      if (data) {
        return JSON.parse(data) as ForumReply[];
      }
      return [];
    } catch (error) {
      console.warn('[Forums API] Redis get replies failed:', error instanceof Error ? error.message : error);
      return [];
    }
  }

  return [];
}

// Helper: Save replies to Redis
async function saveReplies(threadId: string, replies: ForumReply[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(getRepliesKey(threadId), JSON.stringify(replies));
      await redis.expire(getRepliesKey(threadId), 60 * 60 * 24 * 90); // 90 days

      // Update thread reply count and last activity
      const allThreads = await getAllThreads();
      const thread = allThreads.find(t => t.id === threadId);
      if (thread) {
        thread.replyCount = replies.length;
        thread.lastActivity = replies.length > 0
          ? replies[replies.length - 1].createdAt
          : thread.createdAt;

        const categoryThreads = await getThreadsByCategory(thread.categoryId);
        const threadIndex = categoryThreads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
          categoryThreads[threadIndex] = thread;
          await saveThreads(thread.categoryId, categoryThreads);
        }
      }
    } catch (error) {
      console.warn('[Forums API] Redis set replies failed:', error instanceof Error ? error.message : error);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const replies = await getReplies(threadId);

  return NextResponse.json({ success: true, data: replies });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Reply content is required', success: false }, { status: 400 });
  }

  // Check if thread exists and is not locked
  const allThreads = await getAllThreads();
  const thread = allThreads.find(t => t.id === threadId);

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found', success: false }, { status: 404 });
  }

  if (thread.isLocked) {
    return NextResponse.json({ error: 'Thread is locked', success: false }, { status: 403 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const userName = request.headers.get('x-user-name') || 'Demo User';

  const replies = await getReplies(threadId);

  const newReply: ForumReply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    threadId,
    content: content.trim(),
    author: {
      id: userId,
      name: userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
  };

  replies.push(newReply);
  await saveReplies(threadId, replies);

  return NextResponse.json({ success: true, data: newReply }, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const body = await request.json();
  const { replyId, content } = body;

  if (!replyId || !content) {
    return NextResponse.json({ error: 'Reply ID and content are required', success: false }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const replies = await getReplies(threadId);
  const replyIndex = replies.findIndex(r => r.id === replyId);

  if (replyIndex === -1) {
    return NextResponse.json({ error: 'Reply not found', success: false }, { status: 404 });
  }

  const reply = replies[replyIndex];

  // Check if user is author
  if (reply.author.id !== userId) {
    return NextResponse.json({ error: 'Not authorized to edit this reply', success: false }, { status: 403 });
  }

  reply.content = content.trim();
  reply.updatedAt = new Date().toISOString();

  replies[replyIndex] = reply;
  await saveReplies(threadId, replies);

  return NextResponse.json({ success: true, data: reply });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const { searchParams } = new URL(request.url);
  const replyId = searchParams.get('replyId');

  if (!replyId) {
    return NextResponse.json({ error: 'Reply ID is required', success: false }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const isAdmin = request.headers.get('x-user-role') === 'admin';
  const replies = await getReplies(threadId);
  const reply = replies.find(r => r.id === replyId);

  if (!reply) {
    return NextResponse.json({ error: 'Reply not found', success: false }, { status: 404 });
  }

  // Check permissions
  const isAuthor = reply.author.id === userId;
  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Not authorized to delete this reply', success: false }, { status: 403 });
  }

  const updatedReplies = replies.filter(r => r.id !== replyId);
  await saveReplies(threadId, updatedReplies);

  return NextResponse.json({ success: true, message: 'Reply deleted successfully' });
}
