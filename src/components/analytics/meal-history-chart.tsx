'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';

interface MealEntry {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  portions: number;
}

interface MealHistoryChartProps {
  petName: string;
  entries: MealEntry[];
  targetCalories?: number;
}

export function MealHistoryChart({
  petName,
  entries,
  targetCalories
}: MealHistoryChartProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const sorted = [...entries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate daily totals
    const dailyTotals = sorted.reduce((acc, entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { calories: 0, protein: 0, meals: 0 };
      }
      acc[date].calories += entry.calories;
      acc[date].protein += entry.protein;
      acc[date].meals += 1;
      return acc;
    }, {} as Record<string, { calories: number; protein: number; meals: number }>);

    const dailyCalories = Object.values(dailyTotals).map(d => d.calories);
    const avgCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
    const avgProtein = Object.values(dailyTotals).reduce((sum, d) => sum + d.protein, 0) / Object.keys(dailyTotals).length;

    // Meal type distribution
    const mealTypes = entries.reduce((acc, entry) => {
      acc[entry.mealType] = (acc[entry.mealType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent 7 days analysis
    const recent7Days = sorted.slice(-7);
    const recent7DaysCalories = recent7Days.reduce((sum, e) => sum + e.calories, 0) / 7;

    return {
      avgCalories,
      avgProtein,
      totalMeals: entries.length,
      mealTypes,
      dailyTotals,
      recent7DaysCalories,
      daysTracked: Object.keys(dailyTotals).length
    };
  }, [entries]);

  const chartData = useMemo(() => {
    if (!stats) return { bars: [], viewBox: '0 0 100 100', dates: [] };

    const dailyEntries = Object.entries(stats.dailyTotals).slice(-14); // Last 14 days
    if (dailyEntries.length === 0) return { bars: [], viewBox: '0 0 100 100', dates: [] };

    const maxCalories = Math.max(...dailyEntries.map(([_, d]) => d.calories), targetCalories || 0);
    const minCalories = 0;
    const range = maxCalories - minCalories || 1;

    const barWidth = 80 / dailyEntries.length;
    const bars = dailyEntries.map(([date, data], index) => {
      const x = 10 + (index * barWidth);
      const height = ((data.calories - minCalories) / range) * 80;
      const y = 90 - height;

      return {
        x,
        y,
        width: barWidth * 0.8,
        height,
        calories: data.calories,
        protein: data.protein,
        meals: data.meals,
        date
      };
    });

    return {
      bars,
      viewBox: '0 0 100 100',
      dates: dailyEntries.map(([date]) => date),
      maxCalories
    };
  }, [stats, targetCalories]);

  if (!stats || entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Meal History - {petName}
          </CardTitle>
          <CardDescription>No meal data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Start tracking {petName}'s meals to see feeding patterns and insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Meal History - {petName}
        </CardTitle>
        <CardDescription>{stats.totalMeals} meals tracked over {stats.daysTracked} days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {Math.round(stats.avgCalories)}
            </div>
            <div className="text-sm text-purple-600">Avg Calories/Day</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {stats.avgProtein.toFixed(1)}g
            </div>
            <div className="text-sm text-gray-600">Avg Protein/Day</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {stats.totalMeals}
            </div>
            <div className="text-sm text-gray-600">Total Meals</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 flex items-center justify-center gap-1">
              {targetCalories && stats.avgCalories > targetCalories ? (
                <>
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span className="text-orange-500">+{Math.round(stats.avgCalories - targetCalories)}</span>
                </>
              ) : targetCalories ? (
                <span className="text-green-500">On Track</span>
              ) : (
                <span>-</span>
              )}
            </div>
            <div className="text-sm text-gray-600">vs Target</div>
          </div>
        </div>

        {/* Meal Type Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats.mealTypes).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-xl font-bold text-blue-700">{count}</div>
              <div className="text-xs text-blue-600 capitalize">{type}s</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border-2 border-gray-100">
          <div className="absolute top-2 left-2 text-xs text-gray-500">
            Daily Calories (Last 14 Days)
          </div>
          <svg viewBox={chartData.viewBox} className="w-full h-full">
            {/* Grid lines */}
            <line x1="10" y1="90" x2="90" y2="90" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="1,1" />
            <line x1="10" y1="10" x2="90" y2="10" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="1,1" />

            {/* Target calorie line */}
            {targetCalories && (
              <line
                x1="10"
                y1={90 - ((targetCalories / (chartData.maxCalories || 1)) * 80)}
                x2="90"
                y2={90 - ((targetCalories / (chartData.maxCalories || 1)) * 80)}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )}

            {/* Bars */}
            {chartData.bars.map((bar, index) => (
              <g key={index}>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill="#8b5cf6"
                  className="hover:fill-purple-600 transition-colors cursor-pointer"
                  rx="1"
                >
                  <title>{`${bar.date}: ${bar.calories} cal, ${bar.protein}g protein, ${bar.meals} meals`}</title>
                </rect>
              </g>
            ))}
          </svg>
        </div>

        {/* Insights */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Feeding Insights
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Average daily intake: {Math.round(stats.avgCalories)} calories</li>
            {targetCalories && (
              <li>• {stats.avgCalories > targetCalories
                ? `${Math.round(((stats.avgCalories - targetCalories) / targetCalories) * 100)}% above target calories`
                : `Within target calorie range`}
              </li>
            )}
            <li>• Most common meal type: {Object.entries(stats.mealTypes).sort((a, b) => b[1] - a[1])[0][0]}</li>
            <li>• Recent 7-day average: {Math.round(stats.recent7DaysCalories)} cal/day</li>
            {stats.avgProtein < 20 && (
              <li className="text-orange-600">⚠ Protein intake may be low - consider protein-rich foods</li>
            )}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Meals
          </h4>
          <div className="space-y-2">
            {entries.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div>
                    <div className="text-sm font-medium capitalize">{entry.mealType}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{entry.calories} cal</div>
                  <div className="text-xs text-gray-500">{entry.protein}g protein</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
