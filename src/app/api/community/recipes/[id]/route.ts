import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redis = getRedis();

  try {
    let recipe = null;

    if (redis) {
      const data = await redis.get('recipes:all');
      const recipes = data ? JSON.parse(data as string) : [];
      recipe = recipes.find((r: any) => r.id === id);
    }

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ data: recipe, success: true });
  } catch (error) {
    console.error('[Recipe GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe', success: false }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redis = getRedis();

  try {
    const body = await request.json();

    if (redis) {
      const data = await redis.get('recipes:all');
      const recipes = data ? JSON.parse(data as string) : [];
      const index = recipes.findIndex((r: any) => r.id === id);

      if (index === -1) {
        return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
      }

      // Update recipe
      const updatedRecipe = {
        ...recipes[index],
        ...body,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      recipes[index] = updatedRecipe;
      await redis.set('recipes:all', JSON.stringify(recipes));

      return NextResponse.json({ data: updatedRecipe, success: true });
    }

    return NextResponse.json({ error: 'Storage not available', success: false }, { status: 500 });
  } catch (error) {
    console.error('[Recipe PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update recipe', success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redis = getRedis();

  try {
    if (redis) {
      const data = await redis.get('recipes:all');
      const recipes = data ? JSON.parse(data as string) : [];
      const filtered = recipes.filter((r: any) => r.id !== id);

      if (filtered.length === recipes.length) {
        return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
      }

      await redis.set('recipes:all', JSON.stringify(filtered));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Storage not available', success: false }, { status: 500 });
  } catch (error) {
    console.error('[Recipe DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete recipe', success: false }, { status: 500 });
  }
}
