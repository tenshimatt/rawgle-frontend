import { NextRequest, NextResponse } from 'next/server';

const healthRecords: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const records = healthRecords.filter(r => r.petId === petId);
  return NextResponse.json({ data: records });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, type, date, title, provider, notes, nextDueDate, cost } = body;

  if (!petId || !type || !date || !title || !provider) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newRecord = {
    id: Date.now().toString(),
    petId,
    type,
    date,
    title,
    provider,
    notes,
    nextDueDate,
    cost,
    createdAt: new Date().toISOString(),
  };

  healthRecords.push(newRecord);
  return NextResponse.json({ data: newRecord }, { status: 201 });
}
