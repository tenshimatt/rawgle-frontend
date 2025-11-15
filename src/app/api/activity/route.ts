import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const ACTIVITIES_KEY = 'activities:';
const activities: any[] = []; // Fallback in-memory storage

// Helper: Get activities for a pet
async function getActivities(petId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${ACTIVITIES_KEY}${petId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Activities API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return activities.filter(a => a.petId === petId);
    }
  }

  return activities.filter(a => a.petId === petId);
}

// Helper: Save activities for a pet
async function saveActivities(petId: string, acts: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${ACTIVITIES_KEY}${petId}`, JSON.stringify(acts));
      await redis.expire(`${ACTIVITIES_KEY}${petId}`, 60 * 60 * 24 * 90); // 3 months
      return;
    } catch (error) {
      console.warn('[Activities API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  const filtered = activities.filter(a => a.petId !== petId);
  activities.length = 0;
  activities.push(...filtered, ...acts);
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const petActivities = await getActivities(petId);
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

  const existingActivities = await getActivities(petId);
  existingActivities.push(newActivity);
  await saveActivities(petId, existingActivities);

  return NextResponse.json({ data: newActivity }, { status: 201 });
}
