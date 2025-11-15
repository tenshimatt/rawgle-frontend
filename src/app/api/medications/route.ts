import { NextRequest, NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

const MEDICATIONS_KEY = 'medications:';
const medications: any[] = []; // Fallback in-memory storage

// Helper: Get medications for a pet
async function getMedications(petId: string): Promise<any[]> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(`${MEDICATIONS_KEY}${petId}`);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn('[Medications API] Redis get failed, using fallback:', error instanceof Error ? error.message : error);
      return medications.filter(m => m.petId === petId);
    }
  }

  return medications.filter(m => m.petId === petId);
}

// Helper: Save medications for a pet
async function saveMedications(petId: string, meds: any[]): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(`${MEDICATIONS_KEY}${petId}`, JSON.stringify(meds));
      await redis.expire(`${MEDICATIONS_KEY}${petId}`, 60 * 60 * 24 * 180); // 6 months
      return;
    } catch (error) {
      console.warn('[Medications API] Redis set failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }

  // Fallback: Update in-memory storage
  const filtered = medications.filter(m => m.petId !== petId);
  medications.length = 0;
  medications.push(...filtered, ...meds);
}

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  const petMedications = await getMedications(petId);
  const activeMedications = petMedications.filter(m => m.active);
  return NextResponse.json({ data: activeMedications });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, name, dosage, frequency, timeOfDay, startDate, endDate, reminderEnabled, notes } = body;

  if (!petId || !name || !dosage || !frequency || !timeOfDay || !startDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newMedication = {
    id: Date.now().toString(),
    petId,
    name,
    dosage,
    frequency,
    timeOfDay,
    startDate,
    endDate: endDate || null,
    reminderEnabled: reminderEnabled !== false,
    notes: notes || '',
    active: true,
    createdAt: new Date().toISOString(),
  };

  const existingMedications = await getMedications(petId);
  existingMedications.push(newMedication);
  await saveMedications(petId, existingMedications);

  // If reminders are enabled, create a notification
  if (reminderEnabled) {
    // In a real app, this would trigger a reminder system
    console.log(`[Medications API] Reminder set for ${name} at ${timeOfDay}`);
  }

  return NextResponse.json({ data: newMedication }, { status: 201 });
}
