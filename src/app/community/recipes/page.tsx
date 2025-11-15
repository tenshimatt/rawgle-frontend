'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard } from '@/components/community/recipe-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Loader2, Plus, ChefHat, Clock, Award } from 'lucide-react';
import { StarRating } from '@/components/community/star-rating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function RecipeExchangePage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterPetType, setFilterPetType] = useState('all');
  const [filterMealType, setFilterMealType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMaxPrepTime, setFilterMaxPrepTime] = useState('');

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      // Build query string
      const params = new URLSearchParams();
      if (filterPetType !== 'all') params.append('petType', filterPetType);
      if (filterMealType !== 'all') params.append('mealType', filterMealType);
      if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
      if (filterMaxPrepTime) params.append('maxPrepTime', filterMaxPrepTime);
      if (sortBy !== 'recent') params.append('sortBy', sortBy);

      const response = await fetch(`/api/community/recipes?${params.toString()}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setRecipes(data.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filterPetType, filterMealType, filterDifficulty, filterMaxPrepTime, sortBy]);

  // Client-side search filtering
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const hasActiveFilters = filterPetType !== 'all' || filterMealType !== 'all' ||
    filterDifficulty !== 'all' || filterMaxPrepTime !== '' || searchQuery !== '';

  const clearFilters = () => {
    setFilterPetType('all');
    setFilterMealType('all');
    setFilterDifficulty('all');
    setFilterMaxPrepTime('');
    setSearchQuery('');
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="hero-title flex items-center gap-3">
                <ChefHat className="h-10 w-10 text-teal-600" />
                Recipe Exchange
              </h1>
              <p className="hero-description">
                Share and discover raw food recipes for dogs and cats
              </p>
            </div>
            <Button
              onClick={() => router.push('/community/recipes/submit')}
              className="btn-secondary"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Recipe
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="card-feature-primary mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    placeholder="Search recipes, tags, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-base pl-10"
                  />
                </div>

                {/* Pet Type Filter */}
                <div>
                  <Select value={filterPetType} onValueChange={setFilterPetType}>
                    <SelectTrigger className="input-base">
                      <SelectValue placeholder="Pet Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pets</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                      <SelectItem value="cat">Cats</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Meal Type Filter */}
                <div>
                  <Select value={filterMealType} onValueChange={setFilterMealType}>
                    <SelectTrigger className="input-base">
                      <SelectValue placeholder="Meal Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="treat">Treat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="input-base">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rated">Highest Rated</SelectItem>
                      <SelectItem value="saved">Most Saved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second row of filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Difficulty Filter */}
                <div>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="input-base">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prep Time Filter */}
                <div>
                  <Select value={filterMaxPrepTime} onValueChange={setFilterMaxPrepTime}>
                    <SelectTrigger className="input-base">
                      <SelectValue placeholder="Prep Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Time</SelectItem>
                      <SelectItem value="15">Under 15 min</SelectItem>
                      <SelectItem value="30">Under 30 min</SelectItem>
                      <SelectItem value="60">Under 1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-900/10">
                  <Filter className="h-4 w-4 text-muted" />
                  <p className="text-sm text-muted">
                    Showing {filteredRecipes.length} of {recipes.length} recipes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRecipes.length === 0 && (
            <Card className="card-feature-primary">
              <CardContent className="text-center py-20">
                <div className="w-20 h-20 bg-seasalt rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-muted" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-muted mb-6">
                  {searchQuery
                    ? `No recipes match your search. Try different filters.`
                    : 'Be the first to share a recipe with the community!'}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} className="btn-secondary">
                    Clear Filters
                  </Button>
                )}
                {!hasActiveFilters && (
                  <Button onClick={() => router.push('/community/recipes/submit')} className="btn-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your First Recipe
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recipes Grid */}
          {!loading && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/community/recipes/${recipe.id}`}>
                  <Card className="card-feature-primary hover:shadow-lg transition-all cursor-pointer h-full">
                    {recipe.images && recipe.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={recipe.images[0]}
                          alt={recipe.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${
                            recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <img
                          src={recipe.author.avatar}
                          alt={recipe.author.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{recipe.author.name}</p>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-teal-600 transition-colors">
                        {recipe.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted line-clamp-2">{recipe.description}</p>

                      {/* Tags */}
                      {recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {recipe.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {recipe.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{recipe.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-muted pt-2 border-t border-gray-900/10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.prepTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            <StarRating value={recipe.ratings.average} readonly size="sm" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
