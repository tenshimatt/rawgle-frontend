'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { DOG_BREEDS, CAT_BREEDS } from '@/lib/constants/breeds';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthdate: string;
  weight: number;
  gender: string;
  image?: string;
}

interface EditPetDialogProps {
  pet: Pet;
  onPetUpdated?: () => void;
  onPetDeleted?: () => void;
}

export function EditPetDialog({ pet, onPetUpdated, onPetDeleted }: EditPetDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    birthdate: pet.birthdate,
    weight: pet.weight.toString(),
    gender: pet.gender,
    image: pet.image || '',
  });

  useEffect(() => {
    // Update form when pet changes
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthdate: pet.birthdate,
      weight: pet.weight.toString(),
      gender: pet.gender,
      image: pet.image || '',
    });
  }, [pet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // TODO: Replace with actual user ID from auth
        },
        body: JSON.stringify({
          id: pet.id,
          ...formData,
          weight: parseFloat(formData.weight),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update pet');
      }

      setOpen(false);
      onPetUpdated?.();
    } catch (error) {
      console.error('Error updating pet:', error);
      alert(error instanceof Error ? error.message : 'Failed to update pet');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${pet.name}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/pets?id=${pet.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user', // TODO: Replace with actual user ID from auth
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete pet');
      }

      setOpen(false);
      onPetDeleted?.();
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete pet');
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
          <DialogTitle className="text-2xl font-bold text-gray-900">Edit {pet.name}</DialogTitle>
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
            <Select value={formData.breed} onValueChange={(value) => handleChange('breed', value)}>
              <SelectTrigger className="input-base">
                <SelectValue placeholder="Select a breed" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {(formData.species === 'dog' ? DOG_BREEDS : CAT_BREEDS).map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <DatePicker
              date={formData.birthdate ? new Date(formData.birthdate) : undefined}
              onDateChange={(date) =>
                handleChange('birthdate', date ? date.toISOString().split('T')[0] : '')
              }
              placeholder="Select pet's birthdate"
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
