import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const FEEDING_SCHEDULE_KEY = 'feeding:schedule:';
const feedingSchedules: any[] = []; // Fallback in-memory storage

// Helper: Get feeding schedules for a user
async function getFeedingSchedules(userId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${FEEDING_SCHEDULE_KEY}${userId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Feeding Schedule API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return feedingSchedules.filter(s => s.userId === userId);
    }
  }

  return feedingSchedules.filter(s => s.userId === userId);
}

// Helper: Save feeding schedules for a user
async function saveFeedingSchedules(userId: string, schedules: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${FEEDING_SCHEDULE_KEY}${userId}`, JSON.stringify(schedules));
      await redis.expire(`${FEEDING_SCHEDULE_KEY}${userId}`, 60 * 60 * 24 * 180); // 6 months
      return;
    } catch (error) {
      console.warn('[Feeding Schedule API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  const filtered = feedingSchedules.filter(s => s.userId !== userId);
  feedingSchedules.length = 0;
  feedingSchedules.push(...filtered, ...schedules);
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');
  const userId = request.headers.get('x-user-id') || 'demo-user';

  let schedules = await getFeedingSchedules(userId);

  if (petId) {
    schedules = schedules.filter((s: any) => s.petId === petId);
  }

  return NextResponse.json({
    success: true,
    data: schedules
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, mealType, ingredients, notes, frequency, days } = body;

  if (!petId || !mealType || !ingredients || ingredients.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'petId, mealType, and at least one ingredient are required'
    }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || 'demo-user';

  const newSchedule = {
    id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    petId,
    mealType, // breakfast, lunch, dinner, snack
    ingredients, // Array of { foodType, amount, unit }
    notes: notes || '',
    frequency: frequency || 'daily', // daily, weekdays, weekends
    days: days || [1, 2, 3, 4, 5, 6, 7], // Days of week (1=Monday, 7=Sunday)
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingSchedules = await getFeedingSchedules(userId);
  existingSchedules.push(newSchedule);
  await saveFeedingSchedules(userId, existingSchedules);

  console.log('[Feeding Schedule API] Created schedule:', newSchedule.id);

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
  const userSchedules = await getFeedingSchedules(userId);
  const scheduleIndex = userSchedules.findIndex((s: any) => s.id === id);

  if (scheduleIndex === -1) {
    return NextResponse.json({
      success: false,
      error: 'Schedule not found'
    }, { status: 404 });
  }

  userSchedules[scheduleIndex] = {
    ...userSchedules[scheduleIndex],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  };

  await saveFeedingSchedules(userId, userSchedules);

  return NextResponse.json({
    success: true,
    data: userSchedules[scheduleIndex]
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
  const userSchedules = await getFeedingSchedules(userId);
  const initialLength = userSchedules.length;
  const filteredSchedules = userSchedules.filter((s: any) => s.id !== id);

  if (filteredSchedules.length === initialLength) {
    return NextResponse.json({
      success: false,
      error: 'Schedule not found'
    }, { status: 404 });
  }

  await saveFeedingSchedules(userId, filteredSchedules);

  return NextResponse.json({
    success: true,
    message: 'Schedule deleted successfully'
  });
}
