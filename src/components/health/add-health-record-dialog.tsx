"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoUpload } from './photo-upload';
import { Plus, Loader2 } from 'lucide-react';

interface AddHealthRecordDialogProps {
  petId: string;
  onRecordAdded?: () => void;
}

export function AddHealthRecordDialog({ petId, onRecordAdded }: AddHealthRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'vaccination',
    date: '',
    title: '',
    provider: '',
    notes: '',
    nextDueDate: '',
    cost: '',
    photos: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/health/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          petId,
          ...formData,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
        }),
      });

      if (response.ok) {
        setFormData({
          type: 'vaccination',
          date: '',
          title: '',
          provider: '',
          notes: '',
          nextDueDate: '',
          cost: '',
          photos: [],
        });
        setOpen(false);
        onRecordAdded?.();
      }
    } catch (error) {
      console.error('Failed to add health record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="label-base">Record Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="select-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="vet-visit">Vet Visit</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" className="label-base">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="input-base"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="label-base">Title/Description</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Rabies Vaccination, Annual Checkup"
              required
              className="input-base"
            />
          </div>

          <div>
            <Label htmlFor="provider" className="label-base">Veterinarian/Provider</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="Vet clinic or provider name"
              required
              className="input-base"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="label-base">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details, observations, recommendations..."
              className="textarea-base min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextDueDate" className="label-base">Next Due Date (Optional)</Label>
              <Input
                id="nextDueDate"
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="input-base"
              />
            </div>

            <div>
              <Label htmlFor="cost" className="label-base">Cost (Optional)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
                className="input-base"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <PhotoUpload
            photos={formData.photos}
            onPhotosChange={(photos) => setFormData({ ...formData, photos })}
            label="Photos (Before/After, X-rays, etc.)"
            maxPhotos={5}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={() => setOpen(false)} className="btn-outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="default">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Record'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
