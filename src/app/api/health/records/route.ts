import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const HEALTH_RECORDS_KEY = 'health:records:';
const healthRecords: any[] = []; // Fallback in-memory storage

// Helper: Get health records for a pet
async function getHealthRecords(petId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${HEALTH_RECORDS_KEY}${petId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Health Records API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return healthRecords.filter(r => r.petId === petId);
    }
  }

  return healthRecords.filter(r => r.petId === petId);
}

// Helper: Save health records for a pet
async function saveHealthRecords(petId: string, records: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${HEALTH_RECORDS_KEY}${petId}`, JSON.stringify(records));
      await redis.expire(`${HEALTH_RECORDS_KEY}${petId}`, 60 * 60 * 24 * 365); // 1 year
      return;
    } catch (error) {
      console.warn('[Health Records API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  const filtered = healthRecords.filter(r => r.petId !== petId);
  healthRecords.length = 0;
  healthRecords.push(...filtered, ...records);
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const records = await getHealthRecords(petId);
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

  const existingRecords = await getHealthRecords(petId);
  existingRecords.push(newRecord);
  await saveHealthRecords(petId, existingRecords);

  return NextResponse.json({ data: newRecord }, { status: 201 });
}
