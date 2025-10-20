'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export function NutritionCalculator() {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const petWeight = parseFloat(weight);
    if (!petWeight) return;

    const multipliers = { low: 1.2, moderate: 1.4, high: 1.6 };
    const multiplier = multipliers[activityLevel as keyof typeof multipliers];
    const dailyCalories = Math.round(70 * Math.pow(petWeight, 0.75) * multiplier);

    setResults({
      calories: dailyCalories,
      protein: Math.round(dailyCalories * 0.25 / 4),
      fat: Math.round(dailyCalories * 0.15 / 9),
      carbs: Math.round(dailyCalories * 0.05 / 4),
    });
  };

  return (
    <Card className="card-feature-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Nutrition Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <Label>Activity Level</Label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="input-base w-full"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <Button onClick={calculate} className="btn-secondary w-full">Calculate</Button>
        {results && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-seasalt rounded">
              <p className="text-xs text-muted">Daily Calories</p>
              <p className="text-lg font-bold text-charcoal">{results.calories}</p>
            </div>
            <div className="p-3 bg-seasalt rounded">
              <p className="text-xs text-muted">Protein (g)</p>
              <p className="text-lg font-bold text-charcoal">{results.protein}</p>
            </div>
            <div className="p-3 bg-seasalt rounded">
              <p className="text-xs text-muted">Fat (g)</p>
              <p className="text-lg font-bold text-charcoal">{results.fat}</p>
            </div>
            <div className="p-3 bg-seasalt rounded">
              <p className="text-xs text-muted">Carbs (g)</p>
              <p className="text-lg font-bold text-charcoal">{results.carbs}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
