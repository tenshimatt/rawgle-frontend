import { NextRequest, NextResponse } from 'next/server';

const activities: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const petActivities = activities.filter(a => a.petId === petId);
  return NextResponse.json({ data: petActivities });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, type, duration, distance, date, time, notes } = body;

  if (!petId || !type || !duration || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newActivity = {
    id: Date.now().toString(),
    petId,
    type,
    duration,
    distance: distance || null,
    date,
    time,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  activities.push(newActivity);
  return NextResponse.json({ data: newActivity }, { status: 201 });
}
