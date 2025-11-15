import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redis = getRedis();

  try {
    let ratings: Rating[] = [];

    if (redis) {
      const data = await redis.get(`recipes:ratings:${id}`);
      ratings = data ? JSON.parse(data as string) : [];
    }

    // Calculate distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as keyof typeof distribution]++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ratings,
        count: ratings.length,
        average: ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0,
        distribution,
      },
    });
  } catch (error) {
    console.error('[Ratings GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings', success: false }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: recipeId } = await params;
  const redis = getRedis();

  try {
    const body = await request.json();
    const { rating, review } = body;
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5', success: false }, { status: 400 });
    }

    if (redis) {
      // Get existing ratings
      const ratingsData = await redis.get(`recipes:ratings:${recipeId}`);
      const ratings: Rating[] = ratingsData ? JSON.parse(ratingsData as string) : [];

      // Check if user already rated this recipe
      const existingIndex = ratings.findIndex(r => r.userId === userId);

      const newRating: Rating = {
        id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        userName: 'Demo User',
        rating,
        review: review || undefined,
        createdAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Update existing rating
        ratings[existingIndex] = newRating;
      } else {
        // Add new rating
        ratings.push(newRating);
      }

      // Save ratings
      await redis.set(`recipes:ratings:${recipeId}`, JSON.stringify(ratings));

      // Update recipe's rating stats
      const recipesData = await redis.get('recipes:all');
      const recipes = recipesData ? JSON.parse(recipesData as string) : [];
      const recipeIndex = recipes.findIndex((r: any) => r.id === recipeId);

      if (recipeIndex >= 0) {
        const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        recipes[recipeIndex].ratings = {
          average: Math.round(average * 10) / 10,
          count: ratings.length,
        };
        await redis.set('recipes:all', JSON.stringify(recipes));
      }

      return NextResponse.json({ success: true, data: newRating }, { status: 201 });
    }

    return NextResponse.json({ error: 'Storage not available', success: false }, { status: 500 });
  } catch (error) {
    console.error('[Ratings POST] Error:', error);
    return NextResponse.json({ error: 'Failed to submit rating', success: false }, { status: 500 });
  }
}
