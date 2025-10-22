import { NextRequest, NextResponse } from 'next/server';

const getRecipeStore = () => {
  const recipeStore = (global as any).__recipeStore || new Map<string, any>();
  if (!(global as any).__recipeStore) {
    (global as any).__recipeStore = recipeStore;
  }
  return recipeStore;
};

const getCommentStore = () => {
  const commentStore = (global as any).__recipeCommentStore || new Map<string, any[]>();
  if (!(global as any).__recipeCommentStore) {
    (global as any).__recipeCommentStore = commentStore;
  }
  return commentStore;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { saved } = body;

  const recipeStore = getRecipeStore();
  const recipe = recipeStore.get(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
  }

  recipe.saves = saved ? (recipe.saves || 0) + 1 : Math.max((recipe.saves || 0) - 1, 0);
  recipeStore.set(id, recipe);

  return NextResponse.json({ success: true, data: { saves: recipe.saves } });
}
