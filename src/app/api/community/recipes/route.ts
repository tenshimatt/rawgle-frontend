import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

// TypeScript interfaces
interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

interface NutritionInfo {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: { id: string; name: string; avatar: string; };
  petType: string;
  mealType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  tags: string[];
  images: string[];
  ratings: {
    average: number;
    count: number;
  };
  saves: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

// Sample recipes data
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'recipe_001',
    title: 'Classic Raw Chicken & Veggie Mix',
    slug: 'classic-raw-chicken-veggie-mix',
    description: 'A balanced BARF meal with chicken, vegetables, and bone. Perfect for medium to large dogs who are new to raw feeding.',
    author: { id: 'user_sarah', name: 'Sarah M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    petType: 'dog',
    mealType: 'dinner',
    difficulty: 'easy',
    prepTime: 15,
    servings: 4,
    ingredients: [
      { name: 'Ground chicken with bone', amount: 2, unit: 'lbs' },
      { name: 'Carrots', amount: 1, unit: 'cup', notes: 'diced' },
      { name: 'Blueberries', amount: 0.5, unit: 'cup' },
      { name: 'Spinach', amount: 0.5, unit: 'cup', notes: 'chopped' },
      { name: 'Fish oil', amount: 2, unit: 'tbsp' },
      { name: 'Kelp powder', amount: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Mix ground chicken with diced vegetables in a large bowl',
      'Add fish oil and kelp powder, blend thoroughly',
      'Portion into meal-sized containers (about 1lb portions)',
      'Freeze for later use or refrigerate for up to 3 days',
    ],
    nutritionInfo: { protein: 28, fat: 18, carbs: 8, calories: 320 },
    tags: ['BARF', 'beginner-friendly', 'chicken', 'vegetables'],
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'],
    ratings: { average: 4.7, count: 24 },
    saves: 56,
    likes: 89,
    comments: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_002',
    title: 'Beef & Organ Meat Mix for Cats',
    slug: 'beef-organ-meat-mix-cats',
    description: 'Species-appropriate raw meal for cats following the 80/10/10 ratio: 80% meat, 10% organ, 10% bone.',
    author: { id: 'user_mike', name: 'Mike R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    petType: 'cat',
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 20,
    servings: 8,
    ingredients: [
      { name: 'Ground beef', amount: 1.5, unit: 'lbs' },
      { name: 'Chicken liver', amount: 4, unit: 'oz' },
      { name: 'Chicken hearts', amount: 4, unit: 'oz' },
      { name: 'Ground bone meal', amount: 2, unit: 'oz' },
      { name: 'Salmon oil', amount: 1, unit: 'tbsp' },
      { name: 'Taurine supplement', amount: 1000, unit: 'mg' },
    ],
    instructions: [
      'Grind or finely chop liver and hearts',
      'Mix with ground beef thoroughly',
      'Add bone meal and taurine supplement',
      'Drizzle salmon oil and mix well',
      'Portion into daily servings and freeze',
    ],
    nutritionInfo: { protein: 35, fat: 22, carbs: 2, calories: 380 },
    tags: ['80/10/10', 'beef', 'organ meat', 'taurine'],
    images: ['https://images.unsplash.com/photo-1573865526739-10c1d3a1a1e5?w=800'],
    ratings: { average: 4.9, count: 18 },
    saves: 42,
    likes: 67,
    comments: 8,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_003',
    title: 'Turkey & Sweet Potato Breakfast Bowl',
    slug: 'turkey-sweet-potato-breakfast-bowl',
    description: 'A nutritious morning meal for dogs with lean turkey, sweet potato, and omega-3 rich additions.',
    author: { id: 'user_emma', name: 'Emma L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    petType: 'dog',
    mealType: 'breakfast',
    difficulty: 'easy',
    prepTime: 12,
    servings: 3,
    ingredients: [
      { name: 'Ground turkey', amount: 1, unit: 'lb' },
      { name: 'Sweet potato', amount: 0.5, unit: 'cup', notes: 'cooked and mashed' },
      { name: 'Green beans', amount: 0.25, unit: 'cup', notes: 'steamed' },
      { name: 'Chia seeds', amount: 1, unit: 'tbsp' },
      { name: 'Coconut oil', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Cook and mash sweet potato, steam green beans',
      'Mix ground turkey with prepared vegetables',
      'Add chia seeds and coconut oil',
      'Serve fresh or store in refrigerator for up to 2 days',
    ],
    nutritionInfo: { protein: 26, fat: 15, carbs: 12, calories: 290 },
    tags: ['breakfast', 'turkey', 'sweet-potato', 'low-fat'],
    images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800'],
    ratings: { average: 4.5, count: 31 },
    saves: 38,
    likes: 54,
    comments: 15,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_004',
    title: 'Salmon & Egg Training Treats',
    slug: 'salmon-egg-training-treats',
    description: 'High-value training treats made with salmon and eggs. Perfect for both dogs and cats!',
    author: { id: 'user_alex', name: 'Alex T.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    petType: 'both',
    mealType: 'treat',
    difficulty: 'easy',
    prepTime: 30,
    servings: 20,
    ingredients: [
      { name: 'Canned salmon', amount: 1, unit: 'can', notes: '6 oz, drained' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
      { name: 'Coconut flour', amount: 0.25, unit: 'cup' },
      { name: 'Parsley', amount: 1, unit: 'tbsp', notes: 'fresh, chopped' },
    ],
    instructions: [
      'Preheat oven to 350°F',
      'Mix all ingredients in a bowl until combined',
      'Form small balls and place on baking sheet',
      'Bake for 15-20 minutes until firm',
      'Cool completely before serving',
      'Store in refrigerator for up to 1 week or freeze',
    ],
    nutritionInfo: { protein: 12, fat: 8, carbs: 3, calories: 45 },
    tags: ['treats', 'salmon', 'training', 'baked'],
    images: ['https://images.unsplash.com/photo-1615886484727-7b7c15e9cf48?w=800'],
    ratings: { average: 4.8, count: 45 },
    saves: 78,
    likes: 112,
    comments: 22,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_005',
    title: 'Rabbit & Pumpkin Dinner for Sensitive Stomachs',
    slug: 'rabbit-pumpkin-dinner-sensitive-stomachs',
    description: 'A novel protein recipe ideal for dogs with food sensitivities or allergies.',
    author: { id: 'user_jessica', name: 'Jessica K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    petType: 'dog',
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 25,
    servings: 5,
    ingredients: [
      { name: 'Ground rabbit', amount: 1.5, unit: 'lbs' },
      { name: 'Pumpkin puree', amount: 0.5, unit: 'cup', notes: 'pure pumpkin, not pie filling' },
      { name: 'Zucchini', amount: 0.25, unit: 'cup', notes: 'grated' },
      { name: 'Ground eggshell', amount: 1, unit: 'tsp' },
      { name: 'Olive oil', amount: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Gently mix ground rabbit with pumpkin puree',
      'Add grated zucchini and ground eggshell',
      'Drizzle with olive oil and combine thoroughly',
      'Portion and freeze, or refrigerate for up to 3 days',
    ],
    nutritionInfo: { protein: 32, fat: 16, carbs: 6, calories: 310 },
    tags: ['novel-protein', 'rabbit', 'sensitive-stomach', 'limited-ingredient'],
    images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800'],
    ratings: { average: 4.6, count: 19 },
    saves: 34,
    likes: 48,
    comments: 11,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_006',
    title: 'Duck & Cranberry Holiday Feast',
    slug: 'duck-cranberry-holiday-feast',
    description: 'A festive and luxurious raw meal featuring duck, cranberries, and seasonal vegetables. Perfect for special occasions!',
    author: { id: 'user_maria', name: 'Maria D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
    petType: 'dog',
    mealType: 'dinner',
    difficulty: 'hard',
    prepTime: 40,
    servings: 6,
    ingredients: [
      { name: 'Ground duck with bone', amount: 2, unit: 'lbs' },
      { name: 'Cranberries', amount: 0.5, unit: 'cup', notes: 'fresh or frozen' },
      { name: 'Butternut squash', amount: 0.75, unit: 'cup', notes: 'cubed' },
      { name: 'Kale', amount: 0.5, unit: 'cup', notes: 'finely chopped' },
      { name: 'Duck liver', amount: 4, unit: 'oz' },
      { name: 'Hemp seed oil', amount: 2, unit: 'tbsp' },
      { name: 'Turmeric powder', amount: 0.5, unit: 'tsp' },
    ],
    instructions: [
      'Finely chop duck liver and mix with ground duck',
      'Add cranberries, squash, and kale',
      'Incorporate hemp seed oil and turmeric',
      'Mix thoroughly until well combined',
      'Portion into meal servings',
      'Freeze for long-term storage or refrigerate for up to 2 days',
    ],
    nutritionInfo: { protein: 30, fat: 24, carbs: 9, calories: 380 },
    tags: ['duck', 'holiday', 'festive', 'anti-inflammatory'],
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800'],
    ratings: { average: 4.9, count: 27 },
    saves: 62,
    likes: 95,
    comments: 18,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_007',
    title: 'Quail Egg & Chicken Liver Snacks',
    slug: 'quail-egg-chicken-liver-snacks',
    description: 'Nutrient-dense mini snacks perfect for cats or small dogs. High in taurine and vitamins.',
    author: { id: 'user_david', name: 'David P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    petType: 'both',
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 10,
    servings: 12,
    ingredients: [
      { name: 'Quail eggs', amount: 6, unit: 'whole', notes: 'raw' },
      { name: 'Chicken liver', amount: 4, unit: 'oz', notes: 'finely minced' },
      { name: 'Sardines', amount: 2, unit: 'whole', notes: 'boneless, in water' },
      { name: 'Spirulina powder', amount: 0.5, unit: 'tsp' },
    ],
    instructions: [
      'Mince chicken liver very finely',
      'Mash sardines with a fork',
      'Crack quail eggs into mixture',
      'Add spirulina and mix well',
      'Serve fresh in small portions',
      'Store leftovers in refrigerator for up to 1 day',
    ],
    nutritionInfo: { protein: 15, fat: 10, carbs: 1, calories: 85 },
    tags: ['snack', 'taurine', 'organ-meat', 'raw-eggs'],
    images: ['https://images.unsplash.com/photo-1599909199771-d95c41d88a9e?w=800'],
    ratings: { average: 4.7, count: 33 },
    saves: 51,
    likes: 73,
    comments: 14,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_008',
    title: 'Lamb & Goat Milk Breakfast for Puppies',
    slug: 'lamb-goat-milk-breakfast-puppies',
    description: 'Gentle on young tummies, this recipe is perfect for puppies transitioning to raw food.',
    author: { id: 'user_linda', name: 'Linda S.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
    petType: 'dog',
    mealType: 'breakfast',
    difficulty: 'easy',
    prepTime: 8,
    servings: 2,
    ingredients: [
      { name: 'Ground lamb', amount: 0.5, unit: 'lb' },
      { name: 'Raw goat milk', amount: 0.25, unit: 'cup' },
      { name: 'Egg yolk', amount: 1, unit: 'whole', notes: 'raw' },
      { name: 'Baby carrots', amount: 2, unit: 'whole', notes: 'finely grated' },
      { name: 'Probiotic powder', amount: 0.25, unit: 'tsp' },
    ],
    instructions: [
      'Mix ground lamb with grated carrots',
      'Add egg yolk and goat milk',
      'Sprinkle probiotic powder',
      'Mix gently and serve at room temperature',
      'Feed immediately, do not store',
    ],
    nutritionInfo: { protein: 22, fat: 19, carbs: 4, calories: 275 },
    tags: ['puppy', 'lamb', 'goat-milk', 'gentle'],
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
    ratings: { average: 4.8, count: 29 },
    saves: 45,
    likes: 68,
    comments: 16,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_009',
    title: 'Mackerel & Bone Broth Bowl for Senior Cats',
    slug: 'mackerel-bone-broth-bowl-senior-cats',
    description: 'Easy-to-digest meal for senior cats with joint support from bone broth and omega-3s from mackerel.',
    author: { id: 'user_robert', name: 'Robert H.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    petType: 'cat',
    mealType: 'lunch',
    difficulty: 'easy',
    prepTime: 15,
    servings: 4,
    ingredients: [
      { name: 'Canned mackerel', amount: 2, unit: 'cans', notes: 'in water, 4oz each' },
      { name: 'Bone broth', amount: 0.25, unit: 'cup', notes: 'chicken or beef' },
      { name: 'Chicken thigh meat', amount: 4, unit: 'oz', notes: 'ground' },
      { name: 'Taurine supplement', amount: 500, unit: 'mg' },
      { name: 'Collagen powder', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Drain and flake the mackerel',
      'Warm bone broth to room temperature',
      'Mix mackerel, ground chicken, and bone broth',
      'Add taurine and collagen powder',
      'Stir well and serve',
      'Refrigerate leftovers for up to 2 days',
    ],
    nutritionInfo: { protein: 30, fat: 18, carbs: 1, calories: 300 },
    tags: ['senior', 'cat', 'joint-support', 'omega-3'],
    images: ['https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800'],
    ratings: { average: 4.6, count: 22 },
    saves: 39,
    likes: 58,
    comments: 9,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_010',
    title: 'Venison & Berry Freeze-Dried Training Bites',
    slug: 'venison-berry-freeze-dried-training-bites',
    description: 'High-value, shelf-stable training treats made with venison and antioxidant-rich berries.',
    author: { id: 'user_ashley', name: 'Ashley W.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashley' },
    petType: 'dog',
    mealType: 'treat',
    difficulty: 'medium',
    prepTime: 45,
    servings: 30,
    ingredients: [
      { name: 'Ground venison', amount: 1, unit: 'lb' },
      { name: 'Blueberries', amount: 0.25, unit: 'cup' },
      { name: 'Strawberries', amount: 0.25, unit: 'cup', notes: 'diced' },
      { name: 'Coconut flour', amount: 2, unit: 'tbsp' },
      { name: 'Bone meal', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Preheat oven to lowest setting (150-170°F)',
      'Mix venison with berries and coconut flour',
      'Add bone meal and combine thoroughly',
      'Form into small bite-sized pieces',
      'Place on parchment-lined baking sheets',
      'Dry in oven for 3-4 hours until completely dehydrated',
      'Store in airtight container for up to 2 weeks',
    ],
    nutritionInfo: { protein: 18, fat: 6, carbs: 2, calories: 65 },
    tags: ['treats', 'venison', 'dehydrated', 'training'],
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
    ratings: { average: 4.7, count: 38 },
    saves: 67,
    likes: 91,
    comments: 20,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_011',
    title: 'Chicken Feet & Green Tripe Chews',
    slug: 'chicken-feet-green-tripe-chews',
    description: 'Natural dental chews packed with glucosamine and probiotics for joint and digestive health.',
    author: { id: 'user_kevin', name: 'Kevin M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin' },
    petType: 'dog',
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 5,
    servings: 10,
    ingredients: [
      { name: 'Raw chicken feet', amount: 10, unit: 'pieces' },
      { name: 'Green tripe strips', amount: 5, unit: 'oz' },
      { name: 'Beef trachea', amount: 2, unit: 'pieces', notes: 'optional, cut into rings' },
    ],
    instructions: [
      'Rinse chicken feet under cold water',
      'Cut green tripe into appropriate-sized strips for your dog',
      'Cut beef trachea into rings if using',
      'Serve items individually or combined',
      'Supervise while chewing',
      'Store extras in freezer',
    ],
    nutritionInfo: { protein: 16, fat: 8, carbs: 0, calories: 120 },
    tags: ['dental-health', 'chews', 'glucosamine', 'probiotics'],
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    ratings: { average: 4.5, count: 41 },
    saves: 55,
    likes: 79,
    comments: 17,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_012',
    title: 'Sardine & Pumpkin Seed Cat Pâté',
    slug: 'sardine-pumpkin-seed-cat-pate',
    description: 'Smooth, creamy pâté perfect for picky eaters or cats who prefer softer textures.',
    author: { id: 'user_nicole', name: 'Nicole B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole' },
    petType: 'cat',
    mealType: 'dinner',
    difficulty: 'easy',
    prepTime: 10,
    servings: 6,
    ingredients: [
      { name: 'Sardines in water', amount: 3, unit: 'cans', notes: '4oz each' },
      { name: 'Raw pumpkin seeds', amount: 2, unit: 'tbsp', notes: 'ground' },
      { name: 'Chicken liver', amount: 3, unit: 'oz' },
      { name: 'Egg yolk', amount: 1, unit: 'whole' },
      { name: 'Fish oil', amount: 1, unit: 'tsp' },
      { name: 'Taurine supplement', amount: 750, unit: 'mg' },
    ],
    instructions: [
      'Blend sardines and chicken liver in food processor',
      'Add ground pumpkin seeds and egg yolk',
      'Process until smooth and creamy',
      'Mix in fish oil and taurine',
      'Portion into small containers',
      'Refrigerate for up to 3 days or freeze',
    ],
    nutritionInfo: { protein: 28, fat: 20, carbs: 2, calories: 310 },
    tags: ['cat', 'pâté', 'picky-eaters', 'smooth-texture'],
    images: ['https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?w=800'],
    ratings: { average: 4.8, count: 26 },
    saves: 47,
    likes: 71,
    comments: 13,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'recipe_013',
    title: 'Bison & Blueberry Power Bowl',
    slug: 'bison-blueberry-power-bowl',
    description: 'Lean, protein-rich meal for active dogs with antioxidant support from blueberries.',
    author: { id: 'user_chris', name: 'Chris J.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    petType: 'dog',
    mealType: 'lunch',
    difficulty: 'medium',
    prepTime: 18,
    servings: 5,
    ingredients: [
      { name: 'Ground bison', amount: 1.5, unit: 'lbs' },
      { name: 'Blueberries', amount: 0.5, unit: 'cup' },
      { name: 'Spinach', amount: 1, unit: 'cup', notes: 'chopped' },
      { name: 'Bison liver', amount: 3, unit: 'oz' },
      { name: 'Bone meal', amount: 1.5, unit: 'tsp' },
      { name: 'MCT oil', amount: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Finely chop bison liver',
      'Mix ground bison with liver',
      'Add blueberries and spinach',
      'Incorporate bone meal and MCT oil',
      'Mix thoroughly',
      'Portion and freeze or refrigerate for up to 3 days',
    ],
    nutritionInfo: { protein: 30, fat: 14, carbs: 5, calories: 285 },
    tags: ['bison', 'lean', 'active-dogs', 'antioxidants'],
    images: ['https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800'],
    ratings: { average: 4.9, count: 35 },
    saves: 59,
    likes: 87,
    comments: 19,
    createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize Redis with sample data
async function initializeSampleData() {
  const redis = getRedis();
  if (!redis) return;

  try {
    const existing = await redis.get('recipes:all');
    if (!existing) {
      await redis.set('recipes:all', JSON.stringify(SAMPLE_RECIPES));
      console.log('[Recipes] Initialized with sample data');
    }
  } catch (error) {
    console.error('[Recipes] Failed to initialize:', error);
  }
}

// Call initialization
initializeSampleData();

export async function GET(request: NextRequest) {
  const redis = getRedis();
  const searchParams = request.nextUrl.searchParams;

  // Get filter parameters
  const petType = searchParams.get('petType');
  const mealType = searchParams.get('mealType');
  const difficulty = searchParams.get('difficulty');
  const maxPrepTime = searchParams.get('maxPrepTime');
  const sortBy = searchParams.get('sortBy') || 'recent';

  try {
    let recipes: Recipe[] = [];

    if (redis) {
      const data = await redis.get('recipes:all');
      recipes = data ? JSON.parse(data as string) : [];
    } else {
      // Fallback to in-memory
      recipes = SAMPLE_RECIPES;
    }

    // Apply filters
    let filtered = recipes;
    if (petType && petType !== 'all') {
      filtered = filtered.filter(r => r.petType === petType || r.petType === 'both');
    }
    if (mealType && mealType !== 'all') {
      filtered = filtered.filter(r => r.mealType === mealType);
    }
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(r => r.difficulty === difficulty);
    }
    if (maxPrepTime) {
      filtered = filtered.filter(r => r.prepTime <= parseInt(maxPrepTime));
    }

    // Apply sorting
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'rated') {
      filtered.sort((a, b) => b.ratings.average - a.ratings.average);
    } else if (sortBy === 'saved') {
      filtered.sort((a, b) => b.saves - a.saves);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ data: filtered, success: true });
  } catch (error) {
    console.error('[Recipes GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes', success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const redis = getRedis();

  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // Create slug from title
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newRecipe: Recipe = {
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title,
      slug,
      description: body.description,
      author: {
        id: userId,
        name: body.authorName || 'Demo User',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      },
      petType: body.petType || 'dog',
      mealType: body.mealType || 'dinner',
      difficulty: body.difficulty || 'easy',
      prepTime: body.prepTime || 15,
      servings: body.servings || 1,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      nutritionInfo: body.nutritionInfo || { protein: 0, fat: 0, carbs: 0, calories: 0 },
      tags: body.tags || [],
      images: body.images || [],
      ratings: { average: 0, count: 0 },
      saves: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (redis) {
      const data = await redis.get('recipes:all');
      const recipes: Recipe[] = data ? JSON.parse(data as string) : [];
      recipes.unshift(newRecipe);
      await redis.set('recipes:all', JSON.stringify(recipes));
    }

    return NextResponse.json({ data: newRecipe, success: true }, { status: 201 });
  } catch (error) {
    console.error('[Recipes POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create recipe', success: false }, { status: 500 });
  }
}
