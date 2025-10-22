import { NextRequest, NextResponse } from 'next/server';

// Global store for post comments with HMR persistence
const getCommentStore = () => {
  const commentStore = (global as any).__postCommentStore || new Map<string, any[]>();
  if (!(global as any).__postCommentStore) {
    (global as any).__postCommentStore = commentStore;
  }
  return commentStore;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentStore = getCommentStore();
  const comments = commentStore.get(id) || [];

  return NextResponse.json({ success: true, data: comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { content, parentCommentId } = body;
  const userId = request.headers.get('x-user-id');

  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Comment content is required', success: false }, { status: 400 });
  }

  const commentStore = getCommentStore();
  const comments = commentStore.get(id) || [];

  const newComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId || 'anonymous',
    userName: 'Demo User',
    content: content.trim(),
    likes: 0,
    liked: false,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  // If this is a reply, add it to the parent comment's replies
  if (parentCommentId) {
    const parentComment = comments.find((c: any) => c.id === parentCommentId);
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newComment);
    }
  } else {
    // Add as top-level comment
    comments.unshift(newComment);
  }

  commentStore.set(id, comments);

  return NextResponse.json({ success: true, data: newComment }, { status: 201 });
}
