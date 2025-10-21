'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Loader2, Trash2 } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
}

interface FeedingRecord {
  id: string;
  petId: string;
  date: string;
  mealType: string;
  foodType: string;
  amount: number;
  unit: string;
  notes: string;
}

interface EditFeedingDialogProps {
  feeding: FeedingRecord;
  pets: Pet[];
  onFeedingUpdated?: () => void;
  onFeedingDeleted?: () => void;
}

export function EditFeedingDialog({
  feeding,
  pets,
  onFeedingUpdated,
  onFeedingDeleted,
}: EditFeedingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    petId: feeding.petId,
    date: new Date(feeding.date).toISOString().slice(0, 16),
    mealType: feeding.mealType,
    foodType: feeding.foodType,
    amount: feeding.amount.toString(),
    unit: feeding.unit,
    notes: feeding.notes,
  });

  useEffect(() => {
    setFormData({
      petId: feeding.petId,
      date: new Date(feeding.date).toISOString().slice(0, 16),
      mealType: feeding.mealType,
      foodType: feeding.foodType,
      amount: feeding.amount.toString(),
      unit: feeding.unit,
      notes: feeding.notes,
    });
  }, [feeding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/feeding/${feeding.id}`, {
        method: 'PATCH',
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
        throw new Error(error.error || 'Failed to update feeding record');
      }

      setOpen(false);
      onFeedingUpdated?.();
    } catch (error) {
      console.error('Error updating feeding:', error);
      alert(error instanceof Error ? error.message : 'Failed to update feeding record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this feeding record? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/feeding/${feeding.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete feeding record');
      }

      setOpen(false);
      onFeedingDeleted?.();
    } catch (error) {
      console.error('Error deleting feeding:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete feeding record');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="btn-outline">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-charcoal">Edit Feeding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet Selection */}
          <div className="space-y-2">
            <Label htmlFor="petId">Pet *</Label>
            <Select
              value={formData.petId}
              onValueChange={(value) => handleChange('petId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue />
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

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

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

          {/* Food Type */}
          <div className="space-y-2">
            <Label htmlFor="foodType">Food Type</Label>
            <Input
              id="foodType"
              value={formData.foodType}
              onChange={(e) => handleChange('foodType', e.target.value)}
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
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleChange('unit', value)}
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
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes about this meal..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              variant="accent"
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
            <Button type="submit" variant="default" disabled={loading || deleting}>
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
