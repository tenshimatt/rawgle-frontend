import { NextRequest, NextResponse } from 'next/server';

const medications: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const petMedications = medications.filter(m => m.petId === petId && m.active);
  return NextResponse.json({ data: petMedications });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, name, dosage, frequency, timeOfDay, startDate, endDate, reminderEnabled, notes } = body;

  if (!petId || !name || !dosage || !frequency || !timeOfDay || !startDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newMedication = {
    id: Date.now().toString(),
    petId,
    name,
    dosage,
    frequency,
    timeOfDay,
    startDate,
    endDate: endDate || null,
    reminderEnabled: reminderEnabled !== false,
    notes: notes || '',
    active: true,
    createdAt: new Date().toISOString(),
  };

  medications.push(newMedication);

  // If reminders are enabled, create a notification
  if (reminderEnabled) {
    // In a real app, this would trigger a reminder system
    // For now, we'll just log it
    console.log(`Reminder set for ${name} at ${timeOfDay}`);
  }

  return NextResponse.json({ data: newMedication }, { status: 201 });
}
