import { NextRequest, NextResponse } from 'next/server';

// Feature 22: Weekly batch meal confirmation
const batchConfirmations: any[] = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, weekStartDate, meals, confirmed } = body;

  const confirmation = {
    id: Date.now().toString(),
    petId,
    weekStartDate,
    meals: meals || [],
    confirmed: confirmed || false,
    confirmedAt: confirmed ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  };

  batchConfirmations.push(confirmation);
  return NextResponse.json({ data: confirmation }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');
  const data = batchConfirmations.filter(b => b.petId === petId);
  return NextResponse.json({ data });
}
