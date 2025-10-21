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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
}

interface AddFeedingDialogProps {
  pets: Pet[];
  selectedPetId?: string;
  onFeedingAdded: () => void;
}

export function AddFeedingDialog({
  pets,
  selectedPetId,
  onFeedingAdded,
}: AddFeedingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: selectedPetId || '',
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
    mealType: 'breakfast',
    foodType: '',
    amount: '',
    unit: 'grams',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feeding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add feeding record');
      }

      // Reset form
      setFormData({
        petId: selectedPetId || '',
        date: new Date().toISOString().slice(0, 16),
        mealType: 'breakfast',
        foodType: '',
        amount: '',
        unit: 'grams',
        notes: '',
      });
      setOpen(false);
      onFeedingAdded();
    } catch (error) {
      console.error('Error adding feeding:', error);
      alert(error instanceof Error ? error.message : 'Failed to add feeding record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Log Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Feeding</DialogTitle>
          <DialogDescription>
            Record a meal for your pet. Track portions and nutrition.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet Selection */}
          {pets.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="petId">Pet *</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, petId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type *</Label>
            <Select
              value={formData.mealType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, mealType: value }))
              }
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

          {/* Food Type */}
          <div className="space-y-2">
            <Label htmlFor="foodType">Food Type</Label>
            <Input
              id="foodType"
              value={formData.foodType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, foodType: e.target.value }))
              }
              placeholder="e.g., Chicken, Beef, Turkey"
            />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.1"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, unit: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">grams (g)</SelectItem>
                  <SelectItem value="ounces">ounces (oz)</SelectItem>
                  <SelectItem value="cups">cups</SelectItem>
                  <SelectItem value="pounds">pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional notes about this meal..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging...
                </>
              ) : (
                'Log Meal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
