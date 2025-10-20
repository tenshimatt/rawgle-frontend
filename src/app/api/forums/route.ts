import { NextRequest, NextResponse } from 'next/server';

// Feature 27: Forums and discussions
const forums = [
  { id: '1', title: 'Raw Feeding Beginners', description: 'New to raw feeding? Start here!', posts: 245 },
  { id: '2', title: 'Health & Wellness', description: 'Discuss pet health topics', posts: 189 },
  { id: '3', title: 'Recipes & Tips', description: 'Share your favorite recipes', posts: 312 },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: forums });
}
