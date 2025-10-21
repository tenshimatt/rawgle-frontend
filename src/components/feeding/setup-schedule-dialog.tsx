'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Loader2, Plus, X } from 'lucide-react';
import { FOOD_TYPES } from '@/lib/constants/food-types';

interface SetupScheduleDialogProps {
  petId: string;
  petName: string;
  onScheduleCreated: () => void;
}

interface Ingredient {
  foodType: string;
  amount: string;
  unit: string;
}

export function SetupScheduleDialog({
  petId,
  petName,
  onScheduleCreated,
}: SetupScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    frequency: 'daily',
    notes: '',
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { foodType: '', amount: '', unit: 'grams' },
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { foodType: '', amount: '', unit: 'grams' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that all ingredients have food type and amount
      const validIngredients = ingredients.filter(
        (ing) => ing.foodType && ing.amount
      );

      if (validIngredients.length === 0) {
        alert('Please add at least one ingredient with food type and amount');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/feeding/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          petId,
          ...formData,
          ingredients: validIngredients.map((ing) => ({
            ...ing,
            amount: parseFloat(ing.amount),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }

      setOpen(false);
      setFormData({
        mealType: 'breakfast',
        frequency: 'daily',
        notes: '',
      });
      setIngredients([{ foodType: '', amount: '', unit: 'grams' }]);
      onScheduleCreated();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create feeding schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Calendar className="h-4 w-4 mr-2" />
          Setup Schedule for {petName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Feeding Schedule</DialogTitle>
          <DialogDescription>
            Set up automatic meal logging for {petName}. Meals will be logged daily based on this schedule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type *</Label>
            <Select
              value={formData.mealType}
              onValueChange={(value) =>
                setFormData({ ...formData, mealType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredients *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="space-y-2 p-4 border border-charcoal/20 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-charcoal">
                    Ingredient {index + 1}
                  </span>
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`foodType-${index}`}>Ingredient</Label>
                  <Select
                    value={ingredient.foodType}
                    onValueChange={(value) =>
                      updateIngredient(index, 'foodType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <Input
                      id={`amount-${index}`}
                      type="number"
                      step="0.1"
                      placeholder="250"
                      value={ingredient.amount}
                      onChange={(e) =>
                        updateIngredient(index, 'amount', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`unit-${index}`}>Unit</Label>
                    <Select
                      value={ingredient.unit}
                      onValueChange={(value) =>
                        updateIngredient(index, 'unit', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">Grams</SelectItem>
                        <SelectItem value="ounces">Ounces</SelectItem>
                        <SelectItem value="cups">Cups</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Every Day</SelectItem>
                <SelectItem value="weekdays">Weekdays Only</SelectItem>
                <SelectItem value="weekends">Weekends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Schedule'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
