'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddActivityDialog } from '@/components/activity/add-activity-dialog';
import { Activity, Clock, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityRecord {
  id: string;
  petId: string;
  type: string;
  duration: number;
  distance?: number;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
}

function ActivityContent() {
  const searchParams = useSearchParams();
  const petId = searchParams?.get('pet');

  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>(petId || '');
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets', {
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

  const fetchActivities = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/activity?petId=${selectedPet}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setActivities(data.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchActivities();
    }
  }, [selectedPet]);

  const getActivityIcon = (type: string) => {
    return <Activity className="h-5 w-5 icon-primary" />;
  };

  const selectedPetName = pets.find(p => p.id === selectedPet)?.name || 'Pet';

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Activity Tracking</h1>
              <p className="hero-description">Log walks, exercise, and playtime for {selectedPetName}</p>
            </div>
            {selectedPet && <AddActivityDialog petId={selectedPet} onActivityAdded={fetchActivities} />}
          </div>

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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-20">
              <Activity className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">No activities logged yet</h2>
              <p className="text-muted mb-6">Start tracking {selectedPetName}'s activities</p>
              {selectedPet && <AddActivityDialog petId={selectedPet} onActivityAdded={fetchActivities} />}
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="card-feature-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <CardTitle className="text-xl text-charcoal capitalize">
                            {activity.type}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-muted">
                              <Calendar className="h-4 w-4" />
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted">
                              <Clock className="h-4 w-4" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-persian-green/10 rounded-lg">
                        <p className="text-sm text-muted">Duration</p>
                        <p className="text-lg font-semibold text-charcoal">{activity.duration} min</p>
                      </div>
                      {activity.distance && (
                        <div className="p-3 bg-moss-green/10 rounded-lg">
                          <p className="text-sm text-muted">Distance</p>
                          <p className="text-lg font-semibold text-charcoal flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {activity.distance} km
                          </p>
                        </div>
                      )}
                    </div>
                    {activity.notes && (
                      <div className="p-3 bg-seasalt rounded-lg">
                        <p className="text-sm text-muted mb-1">Notes</p>
                        <p className="text-charcoal">{activity.notes}</p>
                      </div>
                    )}
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

export default function ActivityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin icon-primary" />
      </div>
    }>
      <ActivityContent />
    </Suspense>
  );
}
