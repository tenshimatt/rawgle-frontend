'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Cat, Calendar, Weight, Loader2 } from 'lucide-react';
import { AddPetDialog } from '@/components/pets/add-pet-dialog';
import { EditPetDialog } from '@/components/pets/edit-pet-dialog';

interface Pet {
  id: string;
  userId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: number;
  gender: string;
  image?: string;
  createdAt: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pets', {
        headers: {
          'x-user-id': 'demo-user', // TODO: Replace with actual user ID from auth
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }

      const data = await response.json();
      setPets(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">My Pets</h1>
              <p className="hero-description">Manage your pets' profiles and health records</p>
            </div>
            <AddPetDialog onPetAdded={fetchPets} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-burnt-sienna text-lg mb-4">{error}</p>
              <Button onClick={fetchPets} className="btn-primary">
                Try Again
              </Button>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-20">
              <Dog className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">No pets yet</h2>
              <p className="text-muted mb-6">Add your first pet to get started with health tracking</p>
              <AddPetDialog onPetAdded={fetchPets} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="card-feature-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {pet.image ? (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : pet.species.toLowerCase() === 'dog' ? (
                          <Dog className="h-16 w-16 icon-accent" />
                        ) : (
                          <Cat className="h-16 w-16 icon-secondary" />
                        )}
                        <div>
                          <CardTitle className="text-2xl text-charcoal">{pet.name}</CardTitle>
                          <p className="text-muted">{pet.breed}</p>
                          <p className="text-sm text-muted capitalize">{pet.gender}</p>
                        </div>
                      </div>
                      <EditPetDialog pet={pet} onPetUpdated={fetchPets} onPetDeleted={fetchPets} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 icon-dark" />
                        <div>
                          <p className="text-sm text-muted">Age</p>
                          <p className="font-semibold text-charcoal">
                            {calculateAge(pet.birthDate)} years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-5 w-5 icon-dark" />
                        <div>
                          <p className="text-sm text-muted">Weight</p>
                          <p className="font-semibold text-charcoal">{pet.weight} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-persian-green/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">Born:</span>
                        <span className="font-semibold text-charcoal">
                          {new Date(pet.birthDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Link href={`/feeding?pet=${pet.id}`} className="flex-1">
                        <Button variant="outline" className="w-full btn-outline">
                          View Feeding
                        </Button>
                      </Link>
                      <Link href={`/health?pet=${pet.id}`} className="flex-1">
                        <Button variant="outline" className="w-full btn-outline">
                          Health Records
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
