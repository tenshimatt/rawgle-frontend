import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const BATCH_CONFIRM_KEY = 'batch:confirm:';
const batchConfirmations: any[] = []; // Fallback in-memory storage

// Helper: Get batch confirmations for a pet
async function getBatchConfirmations(petId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${BATCH_CONFIRM_KEY}${petId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Batch Confirm API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return batchConfirmations.filter(b => b.petId === petId);
    }
  }

  return batchConfirmations.filter(b => b.petId === petId);
}

// Helper: Save batch confirmations for a pet
async function saveBatchConfirmations(petId: string, confirmations: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${BATCH_CONFIRM_KEY}${petId}`, JSON.stringify(confirmations));
      await redis.expire(`${BATCH_CONFIRM_KEY}${petId}`, 60 * 60 * 24 * 90); // 3 months
      return;
    } catch (error) {
      console.warn('[Batch Confirm API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  const filtered = batchConfirmations.filter(b => b.petId !== petId);
  batchConfirmations.length = 0;
  batchConfirmations.push(...filtered, ...confirmations);
}

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

  const existingConfirmations = await getBatchConfirmations(petId);
  existingConfirmations.push(confirmation);
  await saveBatchConfirmations(petId, existingConfirmations);

  return NextResponse.json({ data: confirmation }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const data = await getBatchConfirmations(petId);
  return NextResponse.json({ data });
}
