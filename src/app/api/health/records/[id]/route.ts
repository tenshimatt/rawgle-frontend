import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in a real app, this would be a database)
// This needs to be shared with the parent route
let healthRecords: any[] = [];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const recordIndex = healthRecords.findIndex(r => r.id === id);

  if (recordIndex === -1) {
    return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
  }

  healthRecords[recordIndex] = {
    ...healthRecords[recordIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: healthRecords[recordIndex] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recordIndex = healthRecords.findIndex(r => r.id === id);

  if (recordIndex === -1) {
    return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
  }

  healthRecords.splice(recordIndex, 1);
  return NextResponse.json({ success: true });
}
