'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface AddActivityDialogProps {
  petId: string;
  onActivityAdded?: () => void;
}

export function AddActivityDialog({ petId, onActivityAdded }: AddActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'walk',
    duration: '',
    distance: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          petId,
          ...formData,
          duration: parseInt(formData.duration),
          distance: formData.distance ? parseFloat(formData.distance) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add activity');
      }

      setOpen(false);
      setFormData({
        type: 'walk',
        duration: '',
        distance: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        notes: '',
      });
      onActivityAdded?.();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert(error instanceof Error ? error.message : 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-charcoal">Log Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="label-base">
              Activity Type *
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="input-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk">Walk</SelectItem>
                <SelectItem value="run">Run</SelectItem>
                <SelectItem value="play">Play</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="swim">Swimming</SelectItem>
                <SelectItem value="hike">Hiking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="label-base">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="input-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="label-base">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="input-base"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="label-base">
              Duration (minutes) *
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="input-base"
              placeholder="30"
              required
            />
          </div>

          {/* Distance (optional, mainly for walks/runs) */}
          {(formData.type === 'walk' || formData.type === 'run' || formData.type === 'hike') && (
            <div className="space-y-2">
              <Label htmlFor="distance" className="label-base">
                Distance (km)
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => handleChange('distance', e.target.value)}
                className="input-base"
                placeholder="2.5"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="label-base">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="input-base min-h-[80px]"
              placeholder="How did it go? Any observations?"
            />
          </div>

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
            <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging...
                </>
              ) : (
                'Log Activity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
