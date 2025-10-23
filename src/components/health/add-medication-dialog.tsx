'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, Pill } from 'lucide-react';

interface AddMedicationDialogProps {
  petId: string;
  onMedicationAdded?: () => void;
}

export function AddMedicationDialog({ petId, onMedicationAdded }: AddMedicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: '09:00',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reminderEnabled: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          petId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add medication');
      }

      setOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'daily',
        timeOfDay: '09:00',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        reminderEnabled: true,
        notes: '',
      });
      onMedicationAdded?.();
    } catch (error) {
      console.error('Error adding medication:', error);
      alert(error instanceof Error ? error.message : 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="h-6 w-6 icon-accent" />
            Add Medication Schedule
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Medication Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="label-base">
              Medication Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-base"
              placeholder="e.g., Heartgard, Gabapentin"
              required
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <Label htmlFor="dosage" className="label-base">
              Dosage *
            </Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              className="input-base"
              placeholder="e.g., 25mg, 1 tablet, 2.5ml"
              required
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency" className="label-base">
              Frequency *
            </Label>
            <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
              <SelectTrigger className="input-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="twice-daily">Twice Daily</SelectItem>
                <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <Label htmlFor="timeOfDay" className="label-base">
              Time of Day *
            </Label>
            <Input
              id="timeOfDay"
              type="time"
              value={formData.timeOfDay}
              onChange={(e) => handleChange('timeOfDay', e.target.value)}
              className="input-base"
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="label-base">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="input-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="label-base">
                End Date (optional)
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="input-base"
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center gap-3 p-3 bg-teal-600/10 rounded-lg">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={(e) => handleChange('reminderEnabled', e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-600 border-gray-300 rounded"
            />
            <Label htmlFor="reminderEnabled" className="text-sm font-medium text-gray-900 cursor-pointer flex-1">
              Enable medication reminders
            </Label>
          </div>

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
              placeholder="Special instructions, side effects to watch for, etc."
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
            <Button type="submit" className="flex-1 btn-accent" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Medication'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
