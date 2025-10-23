'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Weight, Ruler, Heart, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { AddHealthRecordDialog } from '@/components/health/add-health-record-dialog';
import { AddFeedingScheduleDialog } from '@/components/feeding/add-feeding-schedule-dialog';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: number;
  gender: string;
  image?: string;
}

export default function PetProfilePage() {
  const params = useParams();
  const petId = params.id as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [feedingSchedules, setFeedingSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetData();
  }, [petId]);

  const fetchPetData = async () => {
    try {
      const [petRes, healthRes, feedingRes] = await Promise.all([
        fetch(`/api/pets/${petId}`, { headers: { 'x-user-id': 'demo-user' } }),
        fetch(`/api/health/records?petId=${petId}`, { headers: { 'x-user-id': 'demo-user' } }),
        fetch(`/api/feeding/schedule?petId=${petId}`, { headers: { 'x-user-id': 'demo-user' } }),
      ]);

      const petData = await petRes.json();
      const healthData = await healthRes.json();
      const feedingData = await feedingRes.json();

      setPet(petData.data);
      setHealthRecords(healthData.data || []);
      setFeedingSchedules(feedingData.data || []);
    } catch (error) {
      console.error('Failed to fetch pet data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen page-gradient">
        
        <div className="container-page">
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen page-gradient">
        
        <div className="container-page">
          <p className="text-gray-900">Pet not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      

      <div className="container-page">
        <Link href="/pets">
          <Button variant="ghost" className="btn-ghost mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pets
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 card-feature-primary">
            <CardHeader>
              <div className="w-full aspect-square bg-teal-600/10 rounded-lg mb-4 flex items-center justify-center">
                {pet.image ? (
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Heart className="h-24 w-24 text-teal-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-900">{pet.name}</CardTitle>
              <p className="text-muted">{pet.breed}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 icon-primary" />
                <div>
                  <p className="text-sm text-muted">Age</p>
                  <p className="font-semibold text-gray-900">{calculateAge(pet.birthDate)} years old</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="h-5 w-5 icon-secondary" />
                <div>
                  <p className="text-sm text-muted">Weight</p>
                  <p className="font-semibold text-gray-900">{pet.weight} lbs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 icon-accent" />
                <div>
                  <p className="text-sm text-muted">Gender</p>
                  <p className="font-semibold text-gray-900 capitalize">{pet.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health & Feeding Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Records */}
            <Card className="card-feature-primary">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">Health Records</CardTitle>
                <AddHealthRecordDialog petId={petId} onRecordAdded={fetchPetData} />
              </CardHeader>
              <CardContent>
                {healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div key={record.id} className="p-4 bg-white rounded-lg border border-gray-900/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{record.title}</h4>
                          <span className="badge-primary">{record.type}</span>
                        </div>
                        <p className="text-sm text-muted">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-900 mt-2">{record.provider}</p>
                        {record.notes && (
                          <p className="text-sm text-muted mt-2">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No health records yet</p>
                )}
              </CardContent>
            </Card>

            {/* Feeding Schedule */}
            <Card className="card-feature-secondary">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">Feeding Schedule</CardTitle>
                <AddFeedingScheduleDialog petId={petId} onScheduleAdded={fetchPetData} />
              </CardHeader>
              <CardContent>
                {feedingSchedules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedingSchedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 bg-white rounded-lg border border-gray-900/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{schedule.time}</span>
                          <span className="text-sm text-muted">{schedule.amount} {schedule.unit}</span>
                        </div>
                        <p className="text-sm text-gray-900">{schedule.foodType}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No feeding schedule set</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
