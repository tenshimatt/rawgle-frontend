import { NextRequest, NextResponse } from 'next/server';

// Feature 50: Course player
const courses = [
  { id: '1', title: 'Raw Feeding 101', lessons: 8, duration: '2 hours', completed: false },
  { id: '2', title: 'Advanced Nutrition', lessons: 12, duration: '4 hours', completed: false },
  { id: '3', title: 'Health & Wellness', lessons: 10, duration: '3 hours', completed: false },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: courses });
}
