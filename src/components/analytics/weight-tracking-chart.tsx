'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightTrackingChartProps {
  petName: string;
  entries: WeightEntry[];
  targetWeight?: number;
  unit?: 'kg' | 'lbs';
}

export function WeightTrackingChart({
  petName,
  entries,
  targetWeight,
  unit = 'lbs'
}: WeightTrackingChartProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const sorted = [...entries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const current = sorted[sorted.length - 1].weight;
    const previous = sorted.length > 1 ? sorted[sorted.length - 2].weight : current;
    const change = current - previous;
    const changePercent = previous !== 0 ? ((change / previous) * 100) : 0;

    const min = Math.min(...sorted.map(e => e.weight));
    const max = Math.max(...sorted.map(e => e.weight));
    const avg = sorted.reduce((sum, e) => sum + e.weight, 0) / sorted.length;

    return {
      current,
      change,
      changePercent,
      min,
      max,
      avg,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }, [entries]);

  const chartData = useMemo(() => {
    const sorted = [...entries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sorted.length === 0) return { points: '', viewBox: '0 0 100 100' };

    const minWeight = Math.min(...sorted.map(e => e.weight));
    const maxWeight = Math.max(...sorted.map(e => e.weight));
    const range = maxWeight - minWeight || 1;

    const points = sorted.map((entry, index) => {
      const x = (index / (sorted.length - 1 || 1)) * 90 + 5;
      const y = 90 - ((entry.weight - minWeight) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    return { points, viewBox: '0 0 100 100' };
  }, [entries]);

  if (!stats || entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Weight Tracking - {petName}
          </CardTitle>
          <CardDescription>No weight data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Start tracking {petName}'s weight to see trends and insights
          </p>
        </CardContent>
      </Card>
    );
  }

  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats.trend === 'up' ? 'text-orange-500' : stats.trend === 'down' ? 'text-blue-500' : 'text-gray-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Weight Tracking - {petName}
        </CardTitle>
        <CardDescription>{entries.length} measurements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
            <div className="text-2xl font-bold text-teal-700">
              {stats.current.toFixed(1)}
            </div>
            <div className="text-sm text-teal-600">Current {unit}</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${trendColor}`}>
              <TrendIcon className="h-5 w-5" />
              {stats.changePercent > 0 ? '+' : ''}{stats.changePercent.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Change</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {stats.avg.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average {unit}</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {stats.min.toFixed(1)} - {stats.max.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Range {unit}</div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border-2 border-gray-100">
          <svg viewBox={chartData.viewBox} className="w-full h-full">
            {/* Grid lines */}
            <line x1="5" y1="10" x2="95" y2="10" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="5" y1="90" x2="95" y2="90" stroke="#e5e7eb" strokeWidth="0.5" />

            {/* Target weight line */}
            {targetWeight && (
              <line
                x1="5"
                y1={90 - ((targetWeight - stats.min) / (stats.max - stats.min || 1)) * 80}
                x2="95"
                y2={90 - ((targetWeight - stats.min) / (stats.max - stats.min || 1)) * 80}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )}

            {/* Weight line */}
            <polyline
              points={chartData.points}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {entries.map((entry, index) => {
              const sorted = [...entries].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              const x = (index / (sorted.length - 1 || 1)) * 90 + 5;
              const y = 90 - ((entry.weight - stats.min) / (stats.max - stats.min || 1)) * 80;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#14b8a6"
                  className="hover:r-3 transition-all cursor-pointer"
                >
                  <title>{`${new Date(entry.date).toLocaleDateString()}: ${entry.weight} ${unit}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* Insights */}
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
          <h4 className="font-semibold text-teal-900 mb-2">Insights</h4>
          <ul className="text-sm text-teal-800 space-y-1">
            {stats.trend === 'up' && (
              <li>• {petName} has gained {Math.abs(stats.change).toFixed(1)} {unit} since last measurement</li>
            )}
            {stats.trend === 'down' && (
              <li>• {petName} has lost {Math.abs(stats.change).toFixed(1)} {unit} since last measurement</li>
            )}
            {stats.trend === 'stable' && (
              <li>• {petName}'s weight is stable</li>
            )}
            {targetWeight && Math.abs(stats.current - targetWeight) > 0.5 && (
              <li>• {Math.abs(stats.current - targetWeight).toFixed(1)} {unit} {stats.current > targetWeight ? 'above' : 'below'} target weight</li>
            )}
            <li>• Average weight over {entries.length} measurements: {stats.avg.toFixed(1)} {unit}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
