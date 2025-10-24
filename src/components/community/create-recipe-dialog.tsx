'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Loader2, ChefHat } from 'lucide-react';

interface CreateRecipeDialogProps {
  onRecipeCreated?: () => void;
}

export function CreateRecipeDialog({ onRecipeCreated }: CreateRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    servings: '',
    prepTime: '',
    photos: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/community/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          ...formData,
          ingredientsList: formData.ingredients.split('\n').filter(i => i.trim()),
          instructionsList: formData.instructions.split('\n').filter(i => i.trim()),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create recipe');
      }

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        servings: '',
        prepTime: '',
        photos: [],
      });
      onRecipeCreated?.();
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(error instanceof Error ? error.message : 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="h-4 w-4 mr-2" />
          Share Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="h-6 w-6 icon-secondary" />
            Share Your Recipe
          </DialogTitle>
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
          <FileUpload
            value={formData.photos}
            onChange={(photos) => handleChange('photos', photos as string[])}
            accept="image/*"
            multiple={true}
            maxFiles={3}
            maxSizeMB={5}
            label="Recipe Photos"
            description="PNG, JPG, GIF up to 5MB each"
            showPreview={true}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-secondary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                'Share Recipe'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
