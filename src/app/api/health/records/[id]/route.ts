import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const HEALTH_RECORDS_KEY = 'health:records:';
let healthRecords: any[] = []; // Fallback in-memory storage

// Helper: Get all health records (search all pets for a specific record ID)
async function getAllHealthRecords(): Promise<any[]> {
  const redis = getRedis();
  const allRecords: any[] = [];

  if (redis && isRedisAvailable()) {
    try {
      const keys = await redis.keys(`${HEALTH_RECORDS_KEY}*`);
      for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
          const records = JSON.parse(data);
          allRecords.push(...records);
        }
      }
      return allRecords;
    } catch (error) {
      console.warn('[Health Records API] Redis keys failed, using fallback:', error instanceof Error ? error.message : error);
      return healthRecords;
    }
  }

  return healthRecords;
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const allRecords = await getAllHealthRecords();
  const record = allRecords.find(r => r.id === id);

  if (!record) {
    return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
  }

  const updatedRecord = {
    ...record,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  // Get all records for this pet and update the specific one
  const petRecords = allRecords.filter(r => r.petId === record.petId);
  const recordIndex = petRecords.findIndex(r => r.id === id);
  petRecords[recordIndex] = updatedRecord;

  await saveHealthRecords(record.petId, petRecords);

  return NextResponse.json({ data: updatedRecord });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const allRecords = await getAllHealthRecords();
  const record = allRecords.find(r => r.id === id);

  if (!record) {
    return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
  }

  // Get all records for this pet and remove the specific one
  const petRecords = allRecords.filter(r => r.petId === record.petId && r.id !== id);
  await saveHealthRecords(record.petId, petRecords);

  return NextResponse.json({ success: true });
}
