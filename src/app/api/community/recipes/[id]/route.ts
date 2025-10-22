import { NextRequest, NextResponse } from 'next/server';

const getRecipeStore = () => {
  const recipeStore = (global as any).__recipeStore || new Map<string, any>();
  if (!(global as any).__recipeStore) {
    (global as any).__recipeStore = recipeStore;
  }
  return recipeStore;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recipeStore = getRecipeStore();
  const recipe = recipeStore.get(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
  }

  return NextResponse.json({ data: recipe, success: true });
}
