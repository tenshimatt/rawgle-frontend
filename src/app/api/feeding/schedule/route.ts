import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database later)
const feedingSchedules: any[] = [];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');
  const userId = request.headers.get('x-user-id') || 'demo-user';

  let schedules = feedingSchedules.filter(s => s.userId === userId);

  if (petId) {
    schedules = schedules.filter(s => s.petId === petId);
  }

  return NextResponse.json({
    success: true,
    data: schedules
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, mealType, time, foodType, amount, unit, notes, frequency, days } = body;

  if (!petId || !mealType || !time || !foodType || !amount) {
    return NextResponse.json({
      success: false,
      error: 'petId, mealType, time, foodType, and amount are required'
    }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';

  const newSchedule = {
    id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    petId,
    mealType, // breakfast, lunch, dinner, snack
    time, // HH:MM format
    foodType,
    amount: parseFloat(amount),
    unit: unit || 'grams',
    notes: notes || '',
    frequency: frequency || 'daily', // daily, weekly, custom
    days: days || [1, 2, 3, 4, 5, 6, 7], // Days of week (1=Monday, 7=Sunday)
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  feedingSchedules.push(newSchedule);
  return NextResponse.json({
    success: true,
    data: newSchedule
  }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({
      success: false,
      error: 'Schedule ID is required'
    }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const scheduleIndex = feedingSchedules.findIndex(s => s.id === id && s.userId === userId);

  if (scheduleIndex === -1) {
    return NextResponse.json({
      success: false,
      error: 'Schedule not found'
    }, { status: 404 });
  }

  feedingSchedules[scheduleIndex] = {
    ...feedingSchedules[scheduleIndex],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: feedingSchedules[scheduleIndex]
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      error: 'Schedule ID is required'
    }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';
  const initialLength = feedingSchedules.length;
  const filteredSchedules = feedingSchedules.filter(s => !(s.id === id && s.userId === userId));

  if (filteredSchedules.length === initialLength) {
    return NextResponse.json({
      success: false,
      error: 'Schedule not found'
    }, { status: 404 });
  }

  feedingSchedules.length = 0;
  feedingSchedules.push(...filteredSchedules);

  return NextResponse.json({
    success: true,
    message: 'Schedule deleted successfully'
  });
}
