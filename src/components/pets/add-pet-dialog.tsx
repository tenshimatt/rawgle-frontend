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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOG_BREEDS, CAT_BREEDS } from '@/lib/constants/breeds';
import { Plus, Dog, Cat, Upload, X } from 'lucide-react';

interface AddPetDialogProps {
  onPetAdded: () => void;
}

export function AddPetDialog({ onPetAdded }: AddPetDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat',
    breed: '',
    birthdate: '',
    weight: '',
    gender: 'male' as 'male' | 'female',
    image: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSpeciesChange = (value: 'dog' | 'cat') => {
    setFormData(prev => ({
      ...prev,
      species: value,
      breed: '', // Reset breed when species changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          species: 'dog',
          breed: '',
          birthdate: '',
          weight: '',
          gender: 'male',
          image: '',
        });
        setImagePreview(null);
        setOpen(false);
        onPetAdded();
      } else {
        const error = await response.json();
        console.error('Error adding pet:', error);
      }
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const breeds = formData.species === 'dog' ? DOG_BREEDS : CAT_BREEDS;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
          <DialogDescription>
            Add a new pet to your profile. Fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Pet preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-persian-green"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-seasalt border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted mt-1">
                  Upload a photo of your pet
                </p>
              </div>
            </div>
          </div>

          {/* Pet Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter pet name"
              required
            />
          </div>

          {/* Species Selection with Icons */}
          <div className="space-y-3">
            <Label>Species *</Label>
            <RadioGroup
              value={formData.species}
              onValueChange={handleSpeciesChange}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:border-persian-green transition-colors"
                  style={{
                    borderColor: formData.species === 'dog' ? '#2A9D8F' : '#E5E7EB'
                  }}>
                  <RadioGroupItem value="dog" id="species-dog" />
                  <Label
                    htmlFor="species-dog"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Dog className="h-6 w-6" />
                    <span className="font-semibold">Dog</span>
                  </Label>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:border-persian-green transition-colors"
                  style={{
                    borderColor: formData.species === 'cat' ? '#2A9D8F' : '#E5E7EB'
                  }}>
                  <RadioGroupItem value="cat" id="species-cat" />
                  <Label
                    htmlFor="species-cat"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Cat className="h-6 w-6" />
                    <span className="font-semibold">Cat</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Breed Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Select
              value={formData.breed}
              onValueChange={(value) => setFormData(prev => ({ ...prev, breed: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${formData.species} breed`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {breeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Radio Buttons */}
          <div className="space-y-3">
            <Label>Gender *</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value: 'male' | 'female') =>
                setFormData(prev => ({ ...prev, gender: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 border-2 rounded-lg p-3 cursor-pointer hover:border-persian-green transition-colors"
                  style={{
                    borderColor: formData.gender === 'male' ? '#2A9D8F' : '#E5E7EB'
                  }}>
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male" className="cursor-pointer flex-1">
                    Male
                  </Label>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 border-2 rounded-lg p-3 cursor-pointer hover:border-persian-green transition-colors"
                  style={{
                    borderColor: formData.gender === 'female' ? '#2A9D8F' : '#E5E7EB'
                  }}>
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female" className="cursor-pointer flex-1">
                    Female
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Birthdate */}
          <div className="space-y-2">
            <Label htmlFor="birthdate">Birthdate *</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs) *</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              max="300"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="Enter weight"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
