'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddHealthRecordDialog } from '@/components/health/add-health-record-dialog';
import { EditHealthRecordDialog } from '@/components/health/edit-health-record-dialog';
import { FileText, Calendar, DollarSign, Image as ImageIcon, Loader2 } from 'lucide-react';

interface HealthRecord {
  id: string;
  petId: string;
  type: string;
  date: string;
  title: string;
  provider: string;
  notes: string;
  nextDueDate?: string;
  cost?: number;
  photos: string[];
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
}

export default function HealthPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setPets(data.data || []);
      if (data.data.length > 0) {
        setSelectedPet(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchRecords = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/health/records?petId=${selectedPet}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setRecords(data.data || []);
    } catch (error) {
      console.error('Error fetching health records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchRecords();
    }
  }, [selectedPet]);

  const getRecordTypeDisplay = (type: string) => {
    const map: Record<string, string> = {
      'vaccination': 'Vaccination',
      'checkup': 'Checkup',
      'surgery': 'Surgery',
      'dental': 'Dental',
      'emergency': 'Emergency',
      'lab-work': 'Lab Work',
      'other': 'Other',
    };
    return map[type] || type;
  };

  const selectedPetName = pets.find(p => p.id === selectedPet)?.name || 'Pet';

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Health Records</h1>
              <p className="hero-description">Track medical history for {selectedPetName}</p>
            </div>
            {selectedPet && <AddHealthRecordDialog petId={selectedPet} onRecordAdded={fetchRecords} />}
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
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-24 w-24 mx-auto mb-4 icon-muted" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No health records yet</h2>
              <p className="text-muted mb-6">Start tracking medical history for {selectedPetName}</p>
              {selectedPet && <AddHealthRecordDialog petId={selectedPet} onRecordAdded={fetchRecords} />}
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="card-feature-accent">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                          {record.title}
                          <span className="text-xs px-2 py-1 bg-teal-600/10 text-teal-600 rounded">
                            {getRecordTypeDisplay(record.type)}
                          </span>
                        </CardTitle>
                        <p className="text-sm text-muted mt-1">{record.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                          <div className="text-sm text-muted">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                        <EditHealthRecordDialog
                          record={record}
                          onRecordUpdated={fetchRecords}
                          onRecordDeleted={fetchRecords}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {record.notes && (
                      <div className="p-3 bg-seasalt rounded-lg">
                        <p className="text-xs text-muted mb-1">Notes</p>
                        <p className="text-sm text-gray-900">{record.notes}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {record.nextDueDate && (
                        <div className="p-3 bg-maize/10 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-muted" />
                            <p className="text-xs text-muted">Next Due</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(record.nextDueDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {record.cost !== undefined && (
                        <div className="p-3 bg-seasalt rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-muted" />
                            <p className="text-xs text-muted">Cost</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">${record.cost.toFixed(2)}</p>
                        </div>
                      )}
                    </div>

                    {record.photos && record.photos.length > 0 && (
                      <div className="p-3 bg-seasalt rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="h-4 w-4 text-muted" />
                          <p className="text-xs text-muted">{record.photos.length} Photos</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {record.photos.map((photo, idx) => (
                            <div key={idx} className="w-16 h-16 bg-gray-200 rounded border border-gray-300" />
                          ))}
                        </div>
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
