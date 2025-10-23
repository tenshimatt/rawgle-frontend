"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2, Trash2 } from 'lucide-react';

interface FeedingSchedule {
  id: string;
  time: string;
  foodType: string;
  amount: number;
  unit: string;
  notes?: string;
}

interface EditFeedingScheduleDialogProps {
  schedule: FeedingSchedule;
  onScheduleUpdated?: () => void;
  onScheduleDeleted?: () => void;
}

export function EditFeedingScheduleDialog({ schedule, onScheduleUpdated, onScheduleDeleted }: EditFeedingScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    time: schedule.time,
    foodType: schedule.foodType,
    amount: schedule.amount.toString(),
    unit: schedule.unit,
    notes: schedule.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/feeding/schedule/${schedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        setOpen(false);
        onScheduleUpdated?.();
      }
    } catch (error) {
      console.error('Failed to update feeding schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this feeding schedule?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/feeding/schedule/${schedule.id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });

      if (response.ok) {
        setOpen(false);
        onScheduleDeleted?.();
      }
    } catch (error) {
      console.error('Failed to delete feeding schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="btn-ghost">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Feeding Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="time" className="label-base">Feeding Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="input-base"
            />
          </div>

          <div>
            <Label htmlFor="foodType" className="label-base">Food Type</Label>
            <Input
              id="foodType"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              required
              className="input-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="label-base">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="input-base"
              />
            </div>

            <div>
              <Label htmlFor="unit" className="label-base">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="select-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="ounces">Ounces</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="label-base">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-base"
            />
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button type="button" onClick={handleDelete} disabled={loading} className="btn-warm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-3">
              <Button type="button" onClick={() => setOpen(false)} className="btn-outline">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} variant="default">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
