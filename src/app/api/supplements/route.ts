import { NextRequest, NextResponse } from 'next/server';

const supplements: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');
  if (!petId) return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });

  const petSupplements = supplements.filter(s => s.petId === petId);
  return NextResponse.json({ data: petSupplements });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, name, type, dosage, frequency, timeOfDay, purpose, notes } = body;

  if (!petId || !name || !dosage) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newSupplement = {
    id: Date.now().toString(),
    petId,
    name,
    type,
    dosage,
    frequency,
    timeOfDay,
    purpose: purpose || '',
    notes: notes || '',
    active: true,
    createdAt: new Date().toISOString(),
  };

  supplements.push(newSupplement);
  return NextResponse.json({ data: newSupplement }, { status: 201 });
}
