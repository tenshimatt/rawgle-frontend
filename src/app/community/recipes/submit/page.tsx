'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ChefHat, Plus, Trash2, Loader2, ArrowLeft, X, Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export default function RecipeSubmitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    petType: 'dog',
    mealType: 'dinner',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    prepTime: 15,
    servings: 1,
    ingredients: [{ name: '', amount: 0, unit: 'cup', notes: '' }] as Ingredient[],
    instructions: [''],
    nutritionInfo: {
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0,
    },
    tags: [] as string[],
    images: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNutritionChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      nutritionInfo: { ...prev.nutritionInfo, [field]: value },
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 0, unit: 'cup', notes: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => (i === index ? value : inst)),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

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
          authorName: 'Demo User',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit recipe');
      }

      const result = await response.json();

      toast({
        title: 'Recipe submitted!',
        description: 'Your recipe has been published successfully.',
      });

      router.push(`/community/recipes/${result.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Button
            variant="ghost"
            onClick={() => router.push('/community/recipes')}
            className="mb-6 text-muted hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>

          <div className="mb-8">
            <h1 className="hero-title flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-teal-600" />
              Share Your Recipe
            </h1>
            <p className="hero-description">
              Help the community by sharing your raw feeding recipes
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="label-base">Recipe Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="input-base"
                      placeholder="e.g., Classic Raw Chicken & Veggie Mix"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="label-base">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="input-base min-h-[100px]"
                      placeholder="Describe your recipe and what makes it special..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="petType" className="label-base">Pet Type *</Label>
                      <Select value={formData.petType} onValueChange={(v) => handleChange('petType', v)}>
                        <SelectTrigger className="input-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">For Dogs</SelectItem>
                          <SelectItem value="cat">For Cats</SelectItem>
                          <SelectItem value="both">For Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mealType" className="label-base">Meal Type *</Label>
                      <Select value={formData.mealType} onValueChange={(v) => handleChange('mealType', v)}>
                        <SelectTrigger className="input-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                          <SelectItem value="treat">Treat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="difficulty" className="label-base">Difficulty *</Label>
                      <Select value={formData.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
                        <SelectTrigger className="input-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="prepTime" className="label-base">Prep Time (min) *</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        value={formData.prepTime}
                        onChange={(e) => handleChange('prepTime', parseInt(e.target.value))}
                        className="input-base"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="servings" className="label-base">Servings *</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={formData.servings}
                        onChange={(e) => handleChange('servings', parseInt(e.target.value))}
                        className="input-base"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                          className="input-base"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Amount"
                          value={ingredient.amount || ''}
                          onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value))}
                          className="input-base"
                        />
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={ingredient.unit}
                          onValueChange={(v) => updateIngredient(index, 'unit', v)}
                        >
                          <SelectTrigger className="input-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cup">cup</SelectItem>
                            <SelectItem value="tbsp">tbsp</SelectItem>
                            <SelectItem value="tsp">tsp</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="whole">whole</SelectItem>
                            <SelectItem value="pieces">pieces</SelectItem>
                            <SelectItem value="can">can</SelectItem>
                            <SelectItem value="cans">cans</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Notes"
                          value={ingredient.notes || ''}
                          onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                          className="input-base"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="h-10 w-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIngredient}
                    className="btn-outline w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-10 bg-maize/20 rounded flex items-center justify-center font-bold text-gray-900">
                        {index + 1}
                      </div>
                      <Textarea
                        placeholder={`Step ${index + 1}`}
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="input-base min-h-[80px] flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="h-10 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInstruction}
                    className="btn-outline w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </CardContent>
              </Card>

              {/* Nutrition Info */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Nutrition Information (per serving)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="protein" className="label-base">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        value={formData.nutritionInfo.protein}
                        onChange={(e) => handleNutritionChange('protein', parseInt(e.target.value))}
                        className="input-base"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat" className="label-base">Fat (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={formData.nutritionInfo.fat}
                        onChange={(e) => handleNutritionChange('fat', parseInt(e.target.value))}
                        className="input-base"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs" className="label-base">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={formData.nutritionInfo.carbs}
                        onChange={(e) => handleNutritionChange('carbs', parseInt(e.target.value))}
                        className="input-base"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories" className="label-base">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={formData.nutritionInfo.calories}
                        onChange={(e) => handleNutritionChange('calories', parseInt(e.target.value))}
                        className="input-base"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., BARF, chicken, beginner-friendly)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="input-base"
                    />
                    <Button type="button" onClick={addTag} className="btn-secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-gray-900/10 rounded p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Image URL (https://...)"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      className="input-base"
                    />
                    <Button type="button" onClick={addImage} className="btn-secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Recipe ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/community/recipes')}
                  className="flex-1 btn-outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <ChefHat className="h-4 w-4 mr-2" />
                      Publish Recipe
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
