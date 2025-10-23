'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Loader2, Trash2 } from 'lucide-react';

interface HealthRecord {
  id: string;
  petId: string;
  type: string;
  date: string;
  title: string;
  provider: string;
  notes: string;
  nextDueDate?: string;
  cost?: number;
  photos: string[];
  createdAt: string;
}

interface EditHealthRecordDialogProps {
  record: HealthRecord;
  onRecordUpdated?: () => void;
  onRecordDeleted?: () => void;
}

export function EditHealthRecordDialog({
  record,
  onRecordUpdated,
  onRecordDeleted,
}: EditHealthRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    type: record.type,
    date: new Date(record.date).toISOString().slice(0, 10),
    title: record.title,
    provider: record.provider,
    notes: record.notes,
    nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().slice(0, 10) : '',
    cost: record.cost?.toString() || '',
  });

  useEffect(() => {
    setFormData({
      type: record.type,
      date: new Date(record.date).toISOString().slice(0, 10),
      title: record.title,
      provider: record.provider,
      notes: record.notes,
      nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().slice(0, 10) : '',
      cost: record.cost?.toString() || '',
    });
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/health/records/${record.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          ...formData,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          nextDueDate: formData.nextDueDate || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update health record');
      }

      setOpen(false);
      onRecordUpdated?.();
    } catch (error) {
      console.error('Error updating health record:', error);
      alert(error instanceof Error ? error.message : 'Failed to update health record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this health record? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/health/records/${record.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete health record');
      }

      setOpen(false);
      onRecordDeleted?.();
    } catch (error) {
      console.error('Error deleting health record:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete health record');
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
        <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-gray-900/10">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Edit Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Record Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Record Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="vet-visit">Vet Visit</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="dental">Dental</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="checkup">Checkup</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="lab-work">Lab Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Rabies Vaccine, Annual Checkup"
              required
            />
          </div>

          {/* Provider */}
          <div className="space-y-2">
            <Label htmlFor="provider">Veterinarian / Provider *</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => handleChange('provider', e.target.value)}
              placeholder="e.g., Dr. Smith at Animal Clinic"
              required
            />
          </div>

          {/* Next Due Date */}
          <div className="space-y-2">
            <Label htmlFor="nextDueDate">Next Due Date (Optional)</Label>
            <Input
              id="nextDueDate"
              type="date"
              value={formData.nextDueDate}
              onChange={(e) => handleChange('nextDueDate', e.target.value)}
            />
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Optional)</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional details about this health record..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
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
