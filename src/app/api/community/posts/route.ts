import { NextRequest, NextResponse } from 'next/server';

const posts: any[] = [
  {
    id: '1',
    userId: 'demo-user',
    userName: 'Demo User',
    title: 'Tips for introducing a new puppy to your home',
    content: 'Just brought home our new golden retriever puppy! Here are some tips that worked for us: 1) Set up a safe space, 2) Establish a routine early, 3) Socialize gradually. What worked for you?',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
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
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    likes: 8,
    comments: 3,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: posts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, image, petId } = body;
  const userId = request.headers.get('x-user-id');

  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newPost = {
    id: Date.now().toString(),
    userId: userId || 'anonymous',
    userName: 'Demo User',
    title,
    content,
    image: image || null,
    petId: petId || null,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  return NextResponse.json({ data: newPost }, { status: 201 });
}
