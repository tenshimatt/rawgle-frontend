'use client';

import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Cat, Plus, Calendar, Heart, Weight } from 'lucide-react';
import { mockPets } from '@/lib/mock-data';

export default function PetsPage() {
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
            <Button className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Add Pet
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPets.map((pet) => (
              <Card key={pet.id} className="card-feature-primary">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {pet.species === 'Dog' ?
                      <Dog className="h-16 w-16 icon-accent" /> :
                      <Cat className="h-16 w-16 icon-secondary" />
                    }
                    <div>
                      <CardTitle className="text-2xl text-charcoal">{pet.name}</CardTitle>
                      <p className="text-muted">{pet.breed}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 icon-dark" />
                      <div>
                        <p className="text-sm text-muted">Age</p>
                        <p className="font-semibold text-charcoal">{pet.age} years</p>
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
                      <Heart className="h-5 w-5 icon-primary" />
                      <span className="font-semibold text-persian-green">{pet.healthStatus}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted mb-2">Feeding Schedule:</p>
                    <div className="flex gap-2">
                      {pet.feedingSchedule.map((time, idx) => (
                        <span key={idx} className="px-3 py-1 bg-persian-green/10 text-persian-green rounded-full text-sm">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link href={`/feeding?pet=${pet.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Feeding</Button>
                    </Link>
                    <Link href={`/health?pet=${pet.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">Health Records</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
