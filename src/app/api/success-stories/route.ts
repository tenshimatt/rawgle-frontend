import { NextRequest, NextResponse } from 'next/server';

// Feature 24: Success stories showcase
const stories: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: stories });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newStory = {
    id: Date.now().toString(),
    ...body,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
  return NextResponse.json({ data: newStory }, { status: 201 });
}
