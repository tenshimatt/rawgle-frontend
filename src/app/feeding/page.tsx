'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Plus,
  Loader2,
  UtensilsCrossed,
  Clock,
  TrendingUp,
  Filter
} from 'lucide-react';
import { AddFeedingDialog } from '@/components/feeding/add-feeding-dialog';
import { EditFeedingDialog } from '@/components/feeding/edit-feeding-dialog';
import { SetupScheduleDialog } from '@/components/feeding/setup-schedule-dialog';
import { ConfirmMealsDialog } from '@/components/feeding/confirm-meals-dialog';

interface Pet {
  id: string;
  name: string;
  species: string;
}

interface FeedingRecord {
  id: string;
  petId: string;
  date: string;
  mealType: string;
  foodType: string;
  amount: number;
  unit: string;
  notes: string;
  createdAt: string;
}

export default function FeedingPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [feedings, setFeedings] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchPets = async () => {
    try {
      // Fetch only active pets
      const response = await fetch('/api/pets?active=true', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setPets(data.data || []);
      if (!selectedPet && data.data.length > 0) {
        setSelectedPet(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const autoGenerateMeals = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      await fetch('/api/feeding/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          startDate: today.toISOString().split('T')[0],
          endDate: nextWeek.toISOString().split('T')[0],
        }),
      });

      // Show confirmation dialog after generating
      setShowConfirmDialog(true);
    } catch (error) {
      console.error('Error auto-generating meals:', error);
    }
  };

  const fetchFeedings = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);

      // Calculate date range based on filter
      let startDate = '';
      const now = new Date();

      if (dateFilter === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      } else if (dateFilter === 'week') {
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      } else if (dateFilter === 'month') {
        startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      }

      const params = new URLSearchParams({
        petId: selectedPet,
        ...(startDate && { startDate }),
      });

      const response = await fetch(`/api/feeding?${params}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setFeedings(data.data || []);
    } catch (error) {
      console.error('Error fetching feedings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
    // Auto-generate meals on page load
    autoGenerateMeals();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchFeedings();
    }
  }, [selectedPet, dateFilter]);

  const selectedPetName = pets.find(p => p.id === selectedPet)?.name || 'Pet';

  // Calculate statistics
  const todayFeedings = feedings.filter(f => {
    const feedingDate = new Date(f.date);
    const today = new Date();
    return feedingDate.toDateString() === today.toDateString();
  });

  const totalAmountToday = todayFeedings.reduce((sum, f) => sum + f.amount, 0);
  const weeklyFeedings = feedings.filter(f => {
    const feedingDate = new Date(f.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return feedingDate >= weekAgo;
  });

  const avgDailyAmount = weeklyFeedings.length > 0
    ? weeklyFeedings.reduce((sum, f) => sum + f.amount, 0) / 7
    : 0;

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'bg-maize/20 text-charcoal border-maize/30';
      case 'lunch':
        return 'bg-persian-green/20 text-charcoal border-persian-green/30';
      case 'dinner':
        return 'bg-burnt-sienna/20 text-charcoal border-burnt-sienna/30';
      case 'snack':
        return 'bg-coral/20 text-charcoal border-coral/30';
      default:
        return 'bg-charcoal/10 text-charcoal border-charcoal/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Feeding Tracker</h1>
              <p className="hero-description">
                Track {selectedPetName}'s meals and nutrition
              </p>
            </div>
            <div className="flex gap-3">
              {selectedPet && (
                <SetupScheduleDialog
                  petId={selectedPet}
                  petName={selectedPetName}
                  onScheduleCreated={() => {
                    autoGenerateMeals();
                    fetchFeedings();
                  }}
                />
              )}
              <AddFeedingDialog
                pets={pets}
                selectedPetId={selectedPet}
                onFeedingAdded={fetchFeedings}
              />
            </div>
          </div>

          {/* Pet Selector */}
          {pets.length > 1 && (
            <div className="mb-6 flex gap-2">
              {pets.map((pet) => (
                <Button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet.id)}
                  variant={selectedPet === pet.id ? 'default' : 'outline'}
                  className={selectedPet === pet.id ? 'btn-primary' : 'btn-outline'}
                >
                  {pet.name}
                </Button>
              ))}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-feature-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  Today's Feedings
                </CardTitle>
                <UtensilsCrossed className="h-4 w-4 icon-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal">
                  {todayFeedings.length}
                </div>
                <p className="text-xs text-muted mt-1">
                  {totalAmountToday.toFixed(0)}g total
                </p>
              </CardContent>
            </Card>

            <Card className="card-feature-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  Weekly Average
                </CardTitle>
                <TrendingUp className="h-4 w-4 icon-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal">
                  {avgDailyAmount.toFixed(0)}g
                </div>
                <p className="text-xs text-muted mt-1">per day</p>
              </CardContent>
            </Card>

            <Card className="card-feature-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  Total Records
                </CardTitle>
                <Calendar className="h-4 w-4 icon-dark" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal">
                  {feedings.length}
                </div>
                <p className="text-xs text-muted mt-1">
                  {dateFilter === 'week'
                    ? 'this week'
                    : dateFilter === 'month'
                    ? 'this month'
                    : dateFilter}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-muted" />
            <span className="text-sm text-muted">Show:</span>
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <Button
                key={filter}
                onClick={() => setDateFilter(filter)}
                variant={dateFilter === filter ? 'default' : 'outline'}
                size="sm"
                className={dateFilter === filter ? 'btn-secondary' : 'btn-outline'}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          {/* Feeding Records */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          ) : feedings.length === 0 ? (
            <div className="text-center py-20">
              <UtensilsCrossed className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                No feeding records yet
              </h2>
              <p className="text-muted mb-6">
                Start tracking {selectedPetName}'s meals
              </p>
              <AddFeedingDialog
                pets={pets}
                selectedPetId={selectedPet}
                onFeedingAdded={fetchFeedings}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {feedings.map((feeding) => (
                <Card key={feeding.id} className="card-feature-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getMealTypeColor(
                              feeding.mealType
                            )}`}
                          >
                            {feeding.mealType}
                          </span>
                          <span className="text-lg font-semibold text-charcoal">
                            {feeding.foodType || 'Food'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(feeding.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(feeding.date)}
                          </span>
                          <span className="font-medium text-charcoal">
                            {feeding.amount} {feeding.unit}
                          </span>
                        </div>
                        {feeding.notes && (
                          <p className="mt-2 text-sm text-muted italic">
                            {feeding.notes}
                          </p>
                        )}
                      </div>
                      <EditFeedingDialog
                        feeding={feeding}
                        pets={pets}
                        onFeedingUpdated={fetchFeedings}
                        onFeedingDeleted={fetchFeedings}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Auto-Generated Meals */}
      <ConfirmMealsDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirmed={() => {
          setShowConfirmDialog(false);
          fetchFeedings();
        }}
      />
    </div>
  );
}
