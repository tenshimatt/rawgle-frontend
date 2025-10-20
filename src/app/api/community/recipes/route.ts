import { NextRequest, NextResponse } from 'next/server';

const recipes: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: recipes });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, ingredientsList, instructionsList, servings, prepTime, photos } = body;
  const userId = request.headers.get('x-user-id');

  if (!title || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newRecipe = {
    id: Date.now().toString(),
    userId: userId || 'anonymous',
    userName: 'Demo User',
    title,
    description,
    ingredients: ingredientsList || [],
    instructions: instructionsList || [],
    servings,
    prepTime,
    photos: photos || [],
    likes: 0,
    saves: 0,
    createdAt: new Date().toISOString(),
  };

  recipes.unshift(newRecipe);
  return NextResponse.json({ data: newRecipe }, { status: 201 });
}
