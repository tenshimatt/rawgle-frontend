'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhotoUpload } from '../health/photo-upload';
import { Edit2, Loader2, Trash2 } from 'lucide-react';

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

interface EditRecipeDialogProps {
  recipe: Recipe;
  onRecipeUpdated?: () => void;
  onRecipeDeleted?: () => void;
}

export function EditRecipeDialog({
  recipe,
  onRecipeUpdated,
  onRecipeDeleted,
}: EditRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.join('\n'),
    instructions: recipe.instructions.join('\n'),
    servings: recipe.servings,
    prepTime: recipe.prepTime,
    photos: recipe.photos || [],
  });

  // Update form when recipe changes
  useEffect(() => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      photos: recipe.photos || [],
    });
  }, [recipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/community/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          ingredientsList: formData.ingredients.split('\n').filter(i => i.trim()),
          instructionsList: formData.instructions.split('\n').filter(i => i.trim()),
          servings: formData.servings,
          prepTime: formData.prepTime,
          photos: formData.photos,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update recipe');
      }

      setOpen(false);
      onRecipeUpdated?.();
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert(error instanceof Error ? error.message : 'Failed to update recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/community/recipes/${recipe.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete recipe');
      }

      setOpen(false);
      onRecipeDeleted?.();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-gray-900/10">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Edit Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="label-base">
              Recipe Name *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input-base"
              placeholder="e.g., Raw Chicken & Veggie Mix"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="label-base">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input-base min-h-[80px]"
              placeholder="Brief description of your recipe..."
              required
            />
          </div>

          {/* Servings & Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings" className="label-base">
                Servings *
              </Label>
              <Input
                id="servings"
                value={formData.servings}
                onChange={(e) => handleChange('servings', e.target.value)}
                className="input-base"
                placeholder="e.g., 4 meals"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime" className="label-base">
                Prep Time *
              </Label>
              <Input
                id="prepTime"
                value={formData.prepTime}
                onChange={(e) => handleChange('prepTime', e.target.value)}
                className="input-base"
                placeholder="e.g., 15 minutes"
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label htmlFor="ingredients" className="label-base">
              Ingredients (one per line) *
            </Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              className="input-base min-h-[120px]"
              placeholder="2 lbs ground chicken&#10;1 cup diced carrots&#10;1/2 cup blueberries&#10;2 tbsp fish oil"
              required
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="label-base">
              Instructions (one step per line) *
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              className="input-base min-h-[120px]"
              placeholder="Mix chicken and vegetables&#10;Add fish oil and blend&#10;Portion into containers&#10;Freeze for later use"
              required
            />
          </div>

          {/* Photos */}
          <PhotoUpload
            photos={formData.photos}
            onPhotosChange={(photos) => handleChange('photos', photos)}
            label="Recipe Photos"
            maxPhotos={3}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline"
              disabled={loading || deleting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="btn-secondary" disabled={loading || deleting}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
