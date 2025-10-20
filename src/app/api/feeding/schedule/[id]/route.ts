import { NextRequest, NextResponse } from 'next/server';

// Import the schedules array from the parent route
// In a real app, this would be a database
let feedingSchedules: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const scheduleIndex = feedingSchedules.findIndex(s => s.id === id);

  if (scheduleIndex === -1) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }

  feedingSchedules[scheduleIndex] = {
    ...feedingSchedules[scheduleIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: feedingSchedules[scheduleIndex] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scheduleIndex = feedingSchedules.findIndex(s => s.id === id);

  if (scheduleIndex === -1) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }

  feedingSchedules.splice(scheduleIndex, 1);
  return NextResponse.json({ success: true });
}
