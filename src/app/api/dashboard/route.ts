import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production this would aggregate from database
export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  // Generate mock dashboard data
  const dashboardData = {
    totalActivities: 24,
    totalActivityMinutes: 380,
    averageActivityPerWeek: 6,
    activityTrend: 'up' as const,
    healthRecords: 8,
    upcomingVaccinations: 1,
    weightHistory: [
      { date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), weight: 23.5 },
      { date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), weight: 24.2 },
      { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), weight: 24.8 },
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), weight: 25.1 },
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), weight: 25.5 },
      { date: new Date().toISOString(), weight: 26.0 },
    ],
    recentActivities: [
      {
        type: 'walk',
        duration: 45,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'play',
        duration: 30,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'run',
        duration: 60,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'training',
        duration: 20,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    feedingStreak: 14,
  };

  return NextResponse.json({ data: dashboardData });
}
