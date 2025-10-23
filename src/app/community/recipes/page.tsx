'use client';

import { useState, useEffect } from 'react';
import { CreateRecipeDialog } from '@/components/community/create-recipe-dialog';
import { RecipeCard } from '@/components/community/recipe-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Recipe {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  photos?: string[];
  prepTime: string;
  servings: string;
  likes: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  comments?: number;
  createdAt: string;
}

export default function RecipeExchangePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterDiet, setFilterDiet] = useState('all');

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/recipes', {
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
  }, []);

  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Diet filter could be enhanced with actual diet tags
      const matchesDiet = filterDiet === 'all' || true;

      return matchesSearch && matchesDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'popular') {
        return b.likes - a.likes;
      } else if (sortBy === 'saved') {
        return b.saves - a.saves;
      }
      return 0;
    });

  return (
    <div className="min-h-screen page-gradient">
      

      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="hero-title">Recipe Exchange</h1>
              <p className="hero-description">
                Share and discover raw food recipes for dogs and cats
              </p>
            </div>
            <CreateRecipeDialog onRecipeCreated={fetchRecipes} />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border-2 border-gray-900/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-10"
                />
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
                    <SelectItem value="saved">Most Saved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Diet Type */}
              <div>
                <Select value={filterDiet} onValueChange={setFilterDiet}>
                  <SelectTrigger className="input-base">
                    <SelectValue placeholder="Filter by diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Recipes</SelectItem>
                    <SelectItem value="dog">For Dogs</SelectItem>
                    <SelectItem value="cat">For Cats</SelectItem>
                    <SelectItem value="both">For Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || sortBy !== 'recent' || filterDiet !== 'all') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-900/10">
                <Filter className="h-4 w-4 text-muted" />
                <p className="text-sm text-muted">
                  Showing {filteredRecipes.length} of {recipes.length} recipes
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('recent');
                    setFilterDiet('all');
                  }}
                  className="text-xs text-teal-600 hover:bg-teal-600/10"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRecipes.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-seasalt rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-muted mb-6">
                {searchQuery
                  ? `No recipes match "${searchQuery}". Try a different search term.`
                  : 'Be the first to share a recipe with the community!'}
              </p>
              {!searchQuery && <CreateRecipeDialog onRecipeCreated={fetchRecipes} />}
            </div>
          )}

          {/* Recipes Grid */}
          {!loading && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRecipeUpdated={fetchRecipes}
                  onRecipeDeleted={fetchRecipes}
                  currentUserId="demo-user"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
