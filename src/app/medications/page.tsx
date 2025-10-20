'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddMedicationDialog } from '@/components/health/add-medication-dialog';
import { Pill, Clock, Calendar, AlertCircle, Loader2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
  notes: string;
  active: boolean;
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
}

function MedicationsContent() {
  const searchParams = useSearchParams();
  const petId = searchParams?.get('pet');

  const [medications, setMedications] = useState<Medication[]>([]);
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

  const fetchMedications = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/medications?petId=${selectedPet}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setMedications(data.data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchMedications();
    }
  }, [selectedPet]);

  const getFrequencyDisplay = (frequency: string) => {
    const map: Record<string, string> = {
      'daily': 'Daily',
      'twice-daily': 'Twice Daily',
      'three-times-daily': '3x Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly',
      'as-needed': 'As Needed',
    };
    return map[frequency] || frequency;
  };

  const isActive = (medication: Medication) => {
    if (!medication.endDate) return true;
    return new Date(medication.endDate) >= new Date();
  };

  const selectedPetName = pets.find(p => p.id === selectedPet)?.name || 'Pet';

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Medication Tracker</h1>
              <p className="hero-description">Manage medications and reminders for {selectedPetName}</p>
            </div>
            {selectedPet && <AddMedicationDialog petId={selectedPet} onMedicationAdded={fetchMedications} />}
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
          ) : medications.length === 0 ? (
            <div className="text-center py-20">
              <Pill className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">No medications yet</h2>
              <p className="text-muted mb-6">Start tracking medications for {selectedPetName}</p>
              {selectedPet && <AddMedicationDialog petId={selectedPet} onMedicationAdded={fetchMedications} />}
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => {
                const active = isActive(medication);
                return (
                  <Card key={medication.id} className={active ? 'card-feature-accent' : 'bg-gray-100 border-gray-300'}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${active ? 'bg-burnt-sienna/10' : 'bg-gray-200'}`}>
                            <Pill className={`h-6 w-6 ${active ? 'icon-accent' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-charcoal flex items-center gap-2">
                              {medication.name}
                              {!active && <span className="text-xs px-2 py-1 bg-gray-300 text-gray-600 rounded">Ended</span>}
                            </CardTitle>
                            <p className="text-sm text-muted mt-1">{medication.dosage}</p>
                          </div>
                        </div>
                        {medication.reminderEnabled && active && (
                          <div className="flex items-center gap-1 text-persian-green text-sm">
                            <Bell className="h-4 w-4" />
                            <span>Reminders On</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-seasalt rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted" />
                            <p className="text-xs text-muted">Frequency</p>
                          </div>
                          <p className="text-sm font-semibold text-charcoal">{getFrequencyDisplay(medication.frequency)}</p>
                        </div>
                        <div className="p-3 bg-seasalt rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted" />
                            <p className="text-xs text-muted">Time</p>
                          </div>
                          <p className="text-sm font-semibold text-charcoal">{medication.timeOfDay}</p>
                        </div>
                        <div className="p-3 bg-seasalt rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-muted" />
                            <p className="text-xs text-muted">Started</p>
                          </div>
                          <p className="text-sm font-semibold text-charcoal">
                            {new Date(medication.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {medication.endDate && (
                        <div className="flex items-center gap-2 p-3 bg-maize/10 rounded-lg">
                          <AlertCircle className="h-5 w-5 icon-dark" />
                          <div className="text-sm">
                            <span className="font-semibold text-charcoal">End Date: </span>
                            <span className="text-muted">{new Date(medication.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      {medication.notes && (
                        <div className="p-3 bg-seasalt rounded-lg">
                          <p className="text-xs text-muted mb-1">Notes</p>
                          <p className="text-sm text-charcoal">{medication.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MedicationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin icon-primary" />
      </div>
    }>
      <MedicationsContent />
    </Suspense>
  );
}
