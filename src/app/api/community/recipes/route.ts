import { NextRequest, NextResponse } from 'next/server';

// Global store for recipes with HMR persistence
const recipeStore = (global as any).__recipeStore || new Map<string, any>();
if (!(global as any).__recipeStore) {
  (global as any).__recipeStore = recipeStore;
}

// Seed with sample recipes if empty
if (recipeStore.size === 0) {
  const sampleRecipes = [
    {
      id: 'recipe_sample_1',
      userId: 'demo-user',
      userName: 'Sarah M.',
      title: 'Raw Chicken & Veggie Mix for Dogs',
      description: 'A balanced BARF meal with chicken, vegetables, and bone. Perfect for medium to large dogs.',
      ingredients: [
        '2 lbs ground chicken with bone',
        '1 cup diced carrots',
        '1/2 cup blueberries',
        '1/2 cup spinach',
        '2 tbsp fish oil',
        '1 tbsp kelp powder',
      ],
      instructions: [
        'Mix ground chicken with diced vegetables in a large bowl',
        'Add fish oil and kelp powder, blend thoroughly',
        'Portion into meal-sized containers (about 1lb portions)',
        'Freeze for later use or refrigerate for up to 3 days',
      ],
      prepTime: '15 minutes',
      servings: '4 meals',
      photos: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'],
      likes: 24,
      saves: 12,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'recipe_sample_2',
      userId: 'user-2',
      userName: 'Mike R.',
      title: 'Beef & Organ Meat Mix for Cats',
      description: 'Species-appropriate raw meal for cats with 80% meat, 10% organ, 10% bone.',
      ingredients: [
        '1.5 lbs ground beef',
        '4 oz chicken liver',
        '4 oz chicken hearts',
        '2 oz ground bone meal',
        '1 tbsp salmon oil',
        '1000mg taurine supplement',
      ],
      instructions: [
        'Grind or finely chop liver and hearts',
        'Mix with ground beef thoroughly',
        'Add bone meal and taurine supplement',
        'Drizzle salmon oil and mix well',
        'Portion into daily servings and freeze',
      ],
      prepTime: '20 minutes',
      servings: '8 meals',
      photos: ['https://images.unsplash.com/photo-1573865526739-10c1d3a1a1e5?w=800'],
      likes: 18,
      saves: 15,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  sampleRecipes.forEach((recipe) => {
    recipeStore.set(recipe.id, recipe);
  });
}

export async function GET(request: NextRequest) {
  const recipes = Array.from(recipeStore.values());
  return NextResponse.json({ data: recipes, success: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, ingredientsList, instructionsList, servings, prepTime, photos } = body;
  const userId = request.headers.get('x-user-id');

  if (!title || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newRecipe = {
    id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  recipeStore.set(newRecipe.id, newRecipe);
  return NextResponse.json({ data: newRecipe, success: true }, { status: 201 });
}
