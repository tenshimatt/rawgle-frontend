import { NextRequest, NextResponse } from 'next/server';

const getPostStore = () => {
  const postStore = (global as any).__postStore || [];
  if (!(global as any).__postStore) {
    (global as any).__postStore = postStore;
  }
  return postStore;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { liked } = body;

  const posts = getPostStore();
  const post = posts.find((p: any) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found', success: false }, { status: 404 });
  }

  post.likes = liked ? (post.likes || 0) + 1 : Math.max((post.likes || 0) - 1, 0);

  return NextResponse.json({ success: true, data: { likes: post.likes } });
}
