'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

interface AddPetDialogProps {
  onPetAdded?: () => void;
}

export function AddPetDialog({ onPetAdded }: AddPetDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    birthDate: '',
    weight: '',
    gender: 'male',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // TODO: Replace with actual user ID from auth
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add pet');
      }

      // Reset form
      setFormData({
        name: '',
        species: 'dog',
        breed: '',
        birthDate: '',
        weight: '',
        gender: 'male',
        image: '',
      });

      setOpen(false);
      onPetAdded?.();
    } catch (error) {
      console.error('Error adding pet:', error);
      alert(error instanceof Error ? error.message : 'Failed to add pet');
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
          <Plus className="h-5 w-5 mr-2" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-charcoal">Add New Pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="label-base">
              Pet Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-base"
              placeholder="e.g., Max, Luna"
              required
            />
          </div>

          {/* Species */}
          <div className="space-y-2">
            <Label htmlFor="species" className="label-base">
              Species *
            </Label>
            <Select value={formData.species} onValueChange={(value) => handleChange('species', value)}>
              <SelectTrigger className="input-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed" className="label-base">
              Breed *
            </Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              className="input-base"
              placeholder="e.g., Golden Retriever, Persian"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="label-base">
              Gender *
            </Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger className="input-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="label-base">
              Birth Date *
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="input-base"
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="label-base">
              Weight (kg) *
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="input-base"
              placeholder="e.g., 25.5"
              required
            />
          </div>

          {/* Image URL (optional) */}
          <div className="space-y-2">
            <Label htmlFor="image" className="label-base">
              Image URL (optional)
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="input-base"
              placeholder="https://example.com/pet-photo.jpg"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Pet'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
