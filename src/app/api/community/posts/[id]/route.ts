import { NextRequest, NextResponse } from 'next/server';

// Use global store pattern to maintain state across requests
const getPostStore = () => {
  const postStore = (global as any).__postStore || new Map<string, any>();
  if (!(global as any).__postStore) {
    (global as any).__postStore = postStore;

    // Initialize with default posts if empty
    if (postStore.size === 0) {
      const defaultPosts = [
        {
          id: '1',
          userId: 'demo-user',
          userName: 'Demo User',
          title: 'Tips for introducing a new puppy to your home',
          content: 'Just brought home our new golden retriever puppy! Here are some tips that worked for us: 1) Set up a safe space, 2) Establish a routine early, 3) Socialize gradually. What worked for you?',
          category: 'general',
          tags: ['puppy', 'training', 'tips'],
          photos: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
          likes: 12,
          comments: 5,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Sarah M.',
          title: 'Best cat toys for indoor cats',
          content: 'My cat loves puzzle feeders and feather wands! They keep her active and mentally stimulated. Highly recommend the tower tracks too.',
          category: 'general',
          tags: ['cats', 'toys', 'enrichment'],
          photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'],
          likes: 8,
          comments: 3,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      defaultPosts.forEach(post => postStore.set(post.id, post));
    }
  }
  return postStore;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postStore = getPostStore();
  const post = postStore.get(id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found', success: false }, { status: 404 });
  }

  return NextResponse.json({ data: post, success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const userId = request.headers.get('x-user-id');
  const postStore = getPostStore();
  const post = postStore.get(id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found', success: false }, { status: 404 });
  }

  // Validate ownership
  if (post.userId !== userId) {
    return NextResponse.json({ error: 'Unauthorized: You can only edit your own posts', success: false }, { status: 403 });
  }

  const { title, content, category, tags, photos } = body;

  // Validate required fields
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required', success: false }, { status: 400 });
  }

  // Validate photos limit
  if (photos && photos.length > 3) {
    return NextResponse.json({ error: 'Maximum 3 photos allowed', success: false }, { status: 400 });
  }

  const updatedPost = {
    ...post,
    title: title || post.title,
    content: content || post.content,
    category: category || post.category,
    tags: tags !== undefined ? tags : post.tags,
    photos: photos !== undefined ? photos : post.photos,
    updatedAt: new Date().toISOString(),
  };

  postStore.set(id, updatedPost);
  return NextResponse.json({ data: updatedPost, success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id');
  const postStore = getPostStore();
  const post = postStore.get(id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found', success: false }, { status: 404 });
  }

  // Validate ownership
  if (post.userId !== userId) {
    return NextResponse.json({ error: 'Unauthorized: You can only delete your own posts', success: false }, { status: 403 });
  }

  postStore.delete(id);
  return NextResponse.json({ success: true, message: 'Post deleted successfully' });
}
