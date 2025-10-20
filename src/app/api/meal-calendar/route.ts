import { NextRequest, NextResponse } from 'next/server';

// Feature 32: Meal planning calendar
export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');
  const month = request.nextUrl.searchParams.get('month');

  const meals = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 0, i + 1).toISOString(),
    meals: ['Breakfast: Chicken mix', 'Dinner: Beef blend'],
  }));

  return NextResponse.json({ data: meals });
}
