'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Check, X, Loader2 } from 'lucide-react';

interface ConfirmMealsDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export function ConfirmMealsDialog({
  show,
  onClose,
  onConfirmed,
}: ConfirmMealsDialogProps) {
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [unconfirmedData, setUnconfirmedData] = useState<any>(null);

  useEffect(() => {
    if (show) {
      fetchUnconfirmed();
    }
  }, [show]);

  const fetchUnconfirmed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feeding/generate', {
        headers: { 'x-user-id': 'demo-user' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unconfirmed meals');
      }

      const data = await response.json();
      setUnconfirmedData(data.data);
    } catch (error) {
      console.error('Error fetching unconfirmed meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAll = async () => {
    try {
      setConfirming(true);
      const response = await fetch('/api/feeding/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({ confirmAll: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm meals');
      }

      onConfirmed();
      onClose();
    } catch (error) {
      console.error('Error confirming meals:', error);
      alert('Failed to confirm meals');
    } finally {
      setConfirming(false);
    }
  };

  const handleRejectAll = async () => {
    if (!confirm('Are you sure you want to reject all auto-generated meals?')) {
      return;
    }

    try {
      setConfirming(true);
      const recordIds = unconfirmedData.records.map((r: any) => r.id).join(',');
      const response = await fetch(`/api/feeding/confirm?recordIds=${recordIds}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });

      if (!response.ok) {
        throw new Error('Failed to reject meals');
      }

      onConfirmed();
      onClose();
    } catch (error) {
      console.error('Error rejecting meals:', error);
      alert('Failed to reject meals');
    } finally {
      setConfirming(false);
    }
  };

  if (!show || loading) {
    return null;
  }

  if (!unconfirmedData || unconfirmedData.total === 0) {
    return null;
  }

  const getMealTypeColor = (mealType: string) => {
    const colors: Record<string, string> = {
      breakfast: 'bg-maize/20 text-charcoal',
      lunch: 'bg-persian-green/20 text-persian-green',
      dinner: 'bg-burnt-sienna/20 text-burnt-sienna',
      snack: 'bg-sandy-brown/20 text-sandy-brown',
    };
    return colors[mealType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-persian-green" />
            Confirm Auto-Logged Meals
          </DialogTitle>
          <DialogDescription>
            We've automatically logged {unconfirmedData.total} meals based on your feeding schedules.
            Please confirm these are correct.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.entries(unconfirmedData.byDate).map(([date, records]: [string, any]) => (
            <Card key={date} className="bg-seasalt border border-charcoal/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-charcoal mb-3">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h4>
                <div className="space-y-2">
                  {records.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getMealTypeColor(
                              record.mealType
                            )}`}
                          >
                            {record.mealType}
                          </span>
                          <span className="text-sm text-muted">
                            {new Date(record.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal mt-1">
                          {record.foodType} - {record.amount} {record.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRejectAll}
            className="flex-1"
            disabled={confirming}
          >
            <X className="h-4 w-4 mr-2" />
            Reject All
          </Button>
          <Button
            onClick={handleConfirmAll}
            className="flex-1 bg-persian-green text-white hover:bg-persian-green-600"
            disabled={confirming}
          >
            {confirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirm All ({unconfirmedData.total})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
