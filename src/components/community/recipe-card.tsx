'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, ChefHat } from 'lucide-react';
import { SocialActions } from './social/social-actions';
import { EditRecipeDialog } from './edit-recipe-dialog';

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

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onRecipeUpdated?: () => void;
  onRecipeDeleted?: () => void;
  currentUserId?: string;
}

export function RecipeCard({
  recipe,
  onClick,
  onRecipeUpdated,
  onRecipeDeleted,
  currentUserId = 'demo-user'
}: RecipeCardProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Check if current user owns this recipe
  const isOwner = recipe.userId === currentUserId;

  return (
    <Card className="card-feature-primary hover:shadow-lg transition-shadow overflow-hidden">
      {/* Recipe Image */}
      {recipe.photos && recipe.photos.length > 0 && (
        <div className="relative h-48 w-full overflow-hidden cursor-pointer" onClick={onClick}>
          <Link href={`/community/recipes/${recipe.id}`}>
            <img
              src={recipe.photos[0]}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </Link>
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-teal-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
            {recipe.userName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{recipe.userName}</p>
            <p className="text-xs text-muted">{formatTimestamp(recipe.createdAt)}</p>
          </div>
          {isOwner && (
            <EditRecipeDialog
              recipe={recipe}
              onRecipeUpdated={onRecipeUpdated}
              onRecipeDeleted={onRecipeDeleted}
            />
          )}
        </div>

        {/* Recipe Title & Description */}
        <Link href={`/community/recipes/${recipe.id}`} onClick={onClick}>
          <div className="cursor-pointer">
            <h3 className="font-bold text-lg text-gray-900 mb-1 hover:text-teal-600 transition-colors flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              {recipe.title}
            </h3>
            <p className="text-sm text-muted line-clamp-2">{recipe.description}</p>
          </div>
        </Link>

        {/* Recipe Meta */}
        <div className="flex items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="pt-2 border-t border-gray-900/10">
          <SocialActions
            itemId={recipe.id}
            itemType="recipe"
            title={recipe.title}
            description={recipe.description}
            initialLikes={recipe.likes}
            initialLiked={recipe.liked}
            initialSaved={recipe.saved}
            initialComments={recipe.comments || 0}
            showComments={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
