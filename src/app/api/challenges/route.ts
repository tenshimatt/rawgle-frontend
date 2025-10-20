import { NextRequest, NextResponse } from 'next/server';

// Feature 23: Pet challenges and achievements
const challenges = [
  { id: '1', title: '7-Day Raw Feeding Streak', description: 'Feed raw for 7 consecutive days', points: 100, badge: '🏆' },
  { id: '2', title: 'First Vet Checkup Logged', description: 'Record your first vet visit', points: 50, badge: '🩺' },
  { id: '3', title: 'Activity Champion', description: 'Log 30 activities in a month', points: 150, badge: '⚡' },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: challenges });
}
