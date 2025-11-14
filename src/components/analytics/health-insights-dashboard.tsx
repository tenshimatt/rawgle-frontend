'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, AlertTriangle, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { WeightTrackingChart } from './weight-tracking-chart';

interface HealthRecord {
  id: string;
  date: string;
  type: 'checkup' | 'vaccination' | 'illness' | 'injury' | 'dental' | 'other';
  title: string;
  notes?: string;
  vetName?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}

interface WeightEntry {
  date: string;
  weight: number;
}

interface HealthInsightsDashboardProps {
  petName: string;
  petType: 'dog' | 'cat';
  healthRecords: HealthRecord[];
  medications: Medication[];
  weightEntries: WeightEntry[];
  targetWeight?: number;
  weightUnit?: 'kg' | 'lbs';
}

export function HealthInsightsDashboard({
  petName,
  petType,
  healthRecords,
  medications,
  weightEntries,
  targetWeight,
  weightUnit = 'lbs'
}: HealthInsightsDashboardProps) {
  const healthStats = useMemo(() => {
    const sortedRecords = [...healthRecords].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const lastCheckup = sortedRecords.find(r => r.type === 'checkup');
    const lastVaccination = sortedRecords.find(r => r.type === 'vaccination');
    const activeMeds = medications.filter(m => m.active);

    const recordsByType = healthRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate days since last checkup
    const daysSinceCheckup = lastCheckup
      ? Math.floor((Date.now() - new Date(lastCheckup.date).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Calculate days since last vaccination
    const daysSinceVaccination = lastVaccination
      ? Math.floor((Date.now() - new Date(lastVaccination.date).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Health score calculation (simple algorithm)
    let healthScore = 100;
    if (daysSinceCheckup && daysSinceCheckup > 365) healthScore -= 20;
    if (daysSinceVaccination && daysSinceVaccination > 365) healthScore -= 15;
    if (activeMeds.length > 3) healthScore -= 10;
    if (recordsByType.illness && recordsByType.illness > 5) healthScore -= 15;

    // Recent issues (last 90 days)
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    const recentIssues = healthRecords.filter(r =>
      (r.type === 'illness' || r.type === 'injury') &&
      new Date(r.date).getTime() > ninetyDaysAgo
    );

    return {
      totalRecords: healthRecords.length,
      activeMedications: activeMeds.length,
      lastCheckup,
      lastVaccination,
      daysSinceCheckup,
      daysSinceVaccination,
      recordsByType,
      healthScore: Math.max(0, Math.min(100, healthScore)),
      recentIssues: recentIssues.length
    };
  }, [healthRecords, medications]);

  const alerts = useMemo(() => {
    const alerts: Array<{ type: 'warning' | 'info' | 'success'; message: string }> = [];

    if (healthStats.daysSinceCheckup && healthStats.daysSinceCheckup > 365) {
      alerts.push({
        type: 'warning',
        message: `Overdue for annual checkup (${Math.floor(healthStats.daysSinceCheckup / 30)} months since last visit)`
      });
    }

    if (healthStats.daysSinceVaccination && healthStats.daysSinceVaccination > 365) {
      alerts.push({
        type: 'warning',
        message: `Vaccination may be due (${Math.floor(healthStats.daysSinceVaccination / 30)} months since last vaccination)`
      });
    }

    if (healthStats.activeMedications > 2) {
      alerts.push({
        type: 'info',
        message: `${petName} is on ${healthStats.activeMedications} active medications - review with vet`
      });
    }

    if (healthStats.recentIssues > 2) {
      alerts.push({
        type: 'warning',
        message: `${healthStats.recentIssues} health issues in last 90 days - consider vet consultation`
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        message: `${petName}'s health tracking is up to date!`
      });
    }

    return alerts;
  }, [healthStats, petName]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-50 to-green-100';
    if (score >= 60) return 'from-yellow-50 to-yellow-100';
    return 'from-orange-50 to-orange-100';
  };

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health Overview - {petName}
          </CardTitle>
          <CardDescription>Comprehensive health tracking and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Score */}
          <div className={`text-center p-6 bg-gradient-to-br ${getHealthScoreBg(healthStats.healthScore)} rounded-lg`}>
            <div className={`text-5xl font-bold ${getHealthScoreColor(healthStats.healthScore)}`}>
              {healthStats.healthScore}
            </div>
            <div className="text-sm text-gray-600 mt-2">Health Score</div>
            <div className="text-xs text-gray-500 mt-1">
              {healthStats.healthScore >= 80 ? 'Excellent' : healthStats.healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {healthStats.totalRecords}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {healthStats.activeMedications}
              </div>
              <div className="text-sm text-blue-600">Active Meds</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700">
                {healthStats.daysSinceCheckup
                  ? `${Math.floor(healthStats.daysSinceCheckup / 30)}mo`
                  : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Since Checkup</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700">
                {healthStats.recentIssues}
              </div>
              <div className="text-sm text-gray-600">Recent Issues</div>
            </div>
          </div>

          {/* Record Type Distribution */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(healthStats.recordsByType).map(([type, count]) => (
              <div key={type} className="text-center p-2 bg-gradient-to-br from-teal-50 to-teal-100 rounded">
                <div className="text-lg font-bold text-teal-700">{count}</div>
                <div className="text-xs text-teal-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Health Alerts & Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning'
                  ? 'bg-orange-50 border-orange-500'
                  : alert.type === 'success'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />}
                <p className={`text-sm ${
                  alert.type === 'warning'
                    ? 'text-orange-800'
                    : alert.type === 'success'
                    ? 'text-green-800'
                    : 'text-blue-800'
                }`}>
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weight Tracking */}
      {weightEntries.length > 0 && (
        <WeightTrackingChart
          petName={petName}
          entries={weightEntries}
          targetWeight={targetWeight}
          unit={weightUnit}
        />
      )}

      {/* Recent Health Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Health Timeline
          </CardTitle>
          <CardDescription>Last 10 health events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthRecords.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.type === 'checkup' ? 'bg-green-100' :
                    record.type === 'vaccination' ? 'bg-blue-100' :
                    record.type === 'illness' ? 'bg-red-100' :
                    record.type === 'injury' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    <Heart className={`h-5 w-5 ${
                      record.type === 'checkup' ? 'text-green-600' :
                      record.type === 'vaccination' ? 'text-blue-600' :
                      record.type === 'illness' ? 'text-red-600' :
                      record.type === 'injury' ? 'text-orange-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{record.title}</p>
                      <p className="text-sm text-gray-600 capitalize">{record.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.floor((Date.now() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{record.notes}</p>
                  )}
                  {record.vetName && (
                    <p className="text-xs text-gray-500 mt-1">Vet: {record.vetName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Medications */}
      {medications.filter(m => m.active).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Active Medications
            </CardTitle>
            <CardDescription>{healthStats.activeMedications} active prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.filter(m => m.active).map((med) => (
                <div key={med.id} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Started: {new Date(med.startDate).toLocaleDateString()}
                        {med.endDate && ` • Ends: ${new Date(med.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
