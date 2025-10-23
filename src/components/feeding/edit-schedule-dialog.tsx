'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Loader2, Plus, X } from 'lucide-react';

interface Schedule {
  id: string;
  petId: string;
  mealType: string;
  ingredients: Array<{
    type: 'ingredient' | 'supplement';
    name: string;
    amount: number;
    unit: string;
  }>;
  frequency: string;
  notes: string;
  active: boolean;
}

interface EditScheduleDialogProps {
  schedule: Schedule;
  onScheduleUpdated?: () => void;
}

export function EditScheduleDialog({ schedule, onScheduleUpdated }: EditScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mealType: schedule.mealType,
    frequency: schedule.frequency,
    notes: schedule.notes,
    ingredients: schedule.ingredients,
  });

  useEffect(() => {
    setFormData({
      mealType: schedule.mealType,
      frequency: schedule.frequency,
      notes: schedule.notes,
      ingredients: schedule.ingredients,
    });
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/feeding/schedule/${schedule.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          petId: schedule.petId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update schedule');
      }

      setOpen(false);
      onScheduleUpdated?.();
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert(error instanceof Error ? error.message : 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addIngredient = (type: 'ingredient' | 'supplement') => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { type, name: '', amount: 0, unit: 'grams' },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-gray-900/10">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Edit Feeding Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type *</Label>
            <Select
              value={formData.mealType}
              onValueChange={(value) => handleChange('mealType', value)}
              required
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

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleChange('frequency', value)}
              required
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

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addIngredient('ingredient')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>

            {formData.ingredients
              .filter((ing) => ing.type === 'ingredient')
              .map((ing, index) => {
                const realIndex = formData.ingredients.findIndex(
                  (i, idx) => i.type === 'ingredient' && formData.ingredients.slice(0, idx + 1).filter((x) => x.type === 'ingredient').length === index + 1
                );
                return (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => updateIngredient(realIndex, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Amount"
                      value={ing.amount || ''}
                      onChange={(e) =>
                        updateIngredient(realIndex, 'amount', parseFloat(e.target.value))
                      }
                      className="w-24"
                    />
                    <Select
                      value={ing.unit}
                      onValueChange={(value) => updateIngredient(realIndex, 'unit', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">grams</SelectItem>
                        <SelectItem value="ounces">oz</SelectItem>
                        <SelectItem value="cups">cups</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(realIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
          </div>

          {/* Supplements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Supplements</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addIngredient('supplement')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Supplement
              </Button>
            </div>

            {formData.ingredients
              .filter((ing) => ing.type === 'supplement')
              .map((ing, index) => {
                const realIndex = formData.ingredients.findIndex(
                  (i, idx) => i.type === 'supplement' && formData.ingredients.slice(0, idx + 1).filter((x) => x.type === 'supplement').length === index + 1
                );
                return (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Supplement name"
                      value={ing.name}
                      onChange={(e) => updateIngredient(realIndex, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Amount"
                      value={ing.amount || ''}
                      onChange={(e) =>
                        updateIngredient(realIndex, 'amount', parseFloat(e.target.value))
                      }
                      className="w-24"
                    />
                    <Select
                      value={ing.unit}
                      onValueChange={(value) => updateIngredient(realIndex, 'unit', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">grams</SelectItem>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="drops">drops</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(realIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes about this schedule..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading} className="flex-1">
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
