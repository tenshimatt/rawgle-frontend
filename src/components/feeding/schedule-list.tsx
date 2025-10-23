'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Calendar, Pizza } from 'lucide-react';
import { EditScheduleDialog } from './edit-schedule-dialog';

interface Schedule {
  id: string;
  petId: string;
  mealType: string;
  ingredients: Array<{
    type: 'ingredient' | 'supplement';
    name: string;
    amount: number;
    unit: string;
  }>;
  frequency: string;
  notes: string;
  active: boolean;
}

interface ScheduleListProps {
  schedules: Schedule[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function ScheduleList({ schedules, onDelete, onRefresh }: ScheduleListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feeding schedule?')) return;

    setDeleting(id);
    try {
      await fetch(`/api/feeding/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });
      onDelete(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule');
    } finally {
      setDeleting(null);
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'bg-maize text-gray-900';
      case 'lunch':
        return 'bg-amber-100 text-gray-900';
      case 'dinner':
        return 'bg-orange-500 text-white';
      case 'snack':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-gray-900/10 text-gray-900';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Every Day';
      case 'weekdays':
        return 'Weekdays Only';
      case 'weekends':
        return 'Weekends Only';
      default:
        return frequency;
    }
  };

  if (schedules.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-900/40" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Feeding Schedules
          </h3>
          <p className="text-gray-900/70 mb-4">
            Set up automatic meal logging by creating a feeding schedule
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="card-feature-primary">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Pizza className="h-5 w-5 text-teal-600" />
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    <Badge className={getMealTypeColor(schedule.mealType)}>
                      {schedule.mealType}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-900/70 mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {getFrequencyText(schedule.frequency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <EditScheduleDialog
                  schedule={schedule}
                  onScheduleUpdated={onRefresh}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(schedule.id)}
                  disabled={deleting === schedule.id}
                  className="text-burnt-sienna hover:bg-burnt-sienna/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Ingredients */}
            {schedule.ingredients.filter(i => i.type === 'ingredient').length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {schedule.ingredients
                    .filter(i => i.type === 'ingredient')
                    .map((ing, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white border-gray-900/20"
                      >
                        {ing.name}: {ing.amount}{ing.unit}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Supplements */}
            {schedule.ingredients.filter(i => i.type === 'supplement').length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Supplements:</h4>
                <div className="flex flex-wrap gap-2">
                  {schedule.ingredients
                    .filter(i => i.type === 'supplement')
                    .map((sup, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-teal-600/10 border-teal-600/30 text-gray-900"
                      >
                        {sup.name}: {sup.amount}{sup.unit}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {schedule.notes && (
              <p className="text-sm text-gray-900/70 italic">{schedule.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
