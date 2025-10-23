'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Heart,
  TrendingUp,
  Calendar,
  Weight,
  Clock,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Pet {
  id: string;
  name: string;
}

interface DashboardData {
  totalActivities: number;
  totalActivityMinutes: number;
  averageActivityPerWeek: number;
  activityTrend: 'up' | 'down' | 'stable';
  healthRecords: number;
  upcomingVaccinations: number;
  weightHistory: { date: string; weight: number }[];
  recentActivities: { type: string; duration: number; date: string }[];
  feedingStreak: number;
}

export default function DashboardPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

  const fetchDashboardData = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?petId=${selectedPet}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setDashboardData(data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchDashboardData();
    }
  }, [selectedPet]);

  const selectedPetName = pets.find(p => p.id === selectedPet)?.name || 'Pet';

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Pet Health Dashboard</h1>
              <p className="hero-description">Track {selectedPetName}'s health, activity & wellness</p>
            </div>
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
          ) : dashboardData ? (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="card-feature-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Total Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-bold text-gray-900">
                        {dashboardData.totalActivities}
                      </div>
                      {dashboardData.activityTrend === 'up' && (
                        <div className="flex items-center gap-1 text-teal-600 text-sm">
                          <ArrowUp className="h-4 w-4" />
                          <span>+12%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-1">This month</p>
                  </CardContent>
                </Card>

                <Card className="card-feature-secondary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Activity Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {dashboardData.totalActivityMinutes}
                    </div>
                    <p className="text-sm text-muted mt-1">Minutes this week</p>
                  </CardContent>
                </Card>

                <Card className="card-feature-accent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Health Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {dashboardData.healthRecords}
                    </div>
                    <p className="text-sm text-muted mt-1">Total records</p>
                  </CardContent>
                </Card>

                <Card className="card-feature-dark">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Feeding Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {dashboardData.feedingStreak}
                    </div>
                    <p className="text-sm text-muted mt-1">Days in a row</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts & Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weight Tracking */}
                <Card className="card-feature-primary">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Weight className="h-5 w-5 icon-primary" />
                      Weight History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.weightHistory.length > 0 ? (
                        <>
                          <div className="h-40 flex items-end justify-between gap-2">
                            {dashboardData.weightHistory.map((record, index) => {
                              const maxWeight = Math.max(...dashboardData.weightHistory.map(r => r.weight));
                              const height = (record.weight / maxWeight) * 100;
                              return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                  <div className="text-xs font-semibold text-gray-900">
                                    {record.weight}kg
                                  </div>
                                  <div
                                    className="w-full bg-teal-600 rounded-t"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="text-xs text-muted">
                                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="p-3 bg-teal-600/10 rounded-lg">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">Current: </span>
                              {dashboardData.weightHistory[dashboardData.weightHistory.length - 1].weight}kg
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted">
                          <Weight className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No weight data yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="card-feature-secondary">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 icon-secondary" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.recentActivities.length > 0 ? (
                        dashboardData.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-seasalt rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900 capitalize">{activity.type}</p>
                              <p className="text-sm text-muted">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{activity.duration} min</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted">
                          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No activities logged yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Vaccinations */}
              {dashboardData.upcomingVaccinations > 0 && (
                <Card className="card-feature-accent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-burnt-sienna/10 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 icon-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Upcoming Vaccinations</h3>
                        <p className="text-muted">
                          You have {dashboardData.upcomingVaccinations} vaccination(s) due soon
                        </p>
                      </div>
                      <Button variant="accent">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Activity className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No data available</h2>
              <p className="text-muted mb-6">Start tracking {selectedPetName}'s health and activities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
