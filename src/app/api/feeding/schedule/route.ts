import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database later)
const feedingSchedules: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const schedules = feedingSchedules.filter(s => s.petId === petId);
  return NextResponse.json({ data: schedules });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, time, foodType, amount, unit, notes } = body;

  if (!petId || !time || !foodType || !amount || !unit) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newSchedule = {
    id: Date.now().toString(),
    petId,
    time,
    foodType,
    amount,
    unit,
    notes,
    createdAt: new Date().toISOString(),
  };

  feedingSchedules.push(newSchedule);
  return NextResponse.json({ data: newSchedule }, { status: 201 });
}
