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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const recipeStore = getRecipeStore();
  const recipe = recipeStore.get(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
  }

  const { title, description, ingredientsList, instructionsList, servings, prepTime, photos } = body;

  const updatedRecipe = {
    ...recipe,
    title: title || recipe.title,
    description: description || recipe.description,
    ingredients: ingredientsList || recipe.ingredients,
    instructions: instructionsList || recipe.instructions,
    servings: servings || recipe.servings,
    prepTime: prepTime || recipe.prepTime,
    photos: photos !== undefined ? photos : recipe.photos,
    updatedAt: new Date().toISOString(),
  };

  recipeStore.set(id, updatedRecipe);
  return NextResponse.json({ data: updatedRecipe, success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recipeStore = getRecipeStore();
  const recipe = recipeStore.get(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found', success: false }, { status: 404 });
  }

  recipeStore.delete(id);
  return NextResponse.json({ success: true });
}
