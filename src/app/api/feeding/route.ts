import { NextRequest, NextResponse } from 'next/server';

// In-memory store for feeding records
const feedingStore = (global as any).__feedingStore || new Map<string, any[]>();
if (!(global as any).__feedingStore) {
  (global as any).__feedingStore = feedingStore;
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get('petId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let records = feedingStore.get(userId) || [];

    // Filter by petId if provided
    if (petId) {
      records = records.filter((r: any) => r.petId === petId);
    }

    // Filter by date range if provided
    if (startDate) {
      records = records.filter((r: any) => new Date(r.date) >= new Date(startDate));
    }
    if (endDate) {
      records = records.filter((r: any) => new Date(r.date) <= new Date(endDate));
    }

    // Sort by date descending
    records.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Get feeding records error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feeding records' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { petId, date, mealType, foodType, amount, unit, notes } = body;

    // Validation
    if (!petId || !date || !mealType) {
      return NextResponse.json(
        { success: false, error: 'petId, date, and mealType are required' },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }

    const newRecord = {
      id: `feeding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      petId,
      date: new Date(date).toISOString(),
      mealType, // breakfast, lunch, dinner, snack
      foodType: foodType || '',
      amount: amount || 0,
      unit: unit || 'grams',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userRecords = feedingStore.get(userId) || [];
    userRecords.push(newRecord);
    feedingStore.set(userId, userRecords);

    return NextResponse.json({
      success: true,
      data: newRecord,
    }, { status: 201 });
  } catch (error) {
    console.error('Create feeding record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create feeding record' },
      { status: 500 }
    );
  }
}
