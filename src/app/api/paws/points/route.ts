import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Mock user points balance
 * In production, this would query from database based on user ID
 */
export async function GET(req: NextRequest) {
  try {
    // Mock data - in production, get from DB based on authenticated user
    const mockUserPoints = {
      userId: 'user123',
      totalPoints: 1250,
      pointsEarned: 2340,
      pointsRedeemed: 1090,
      currentTier: 'Silver',
      nextTier: 'Gold',
      pointsToNextTier: 750,
      monthlyEarned: 420,
      achievements: [
        { name: 'First Purchase', earnedAt: '2024-01-15', points: 100 },
        { name: 'Review Master', earnedAt: '2024-03-10', points: 50 },
        { name: '30-Day Streak', earnedAt: '2024-05-20', points: 200 }
      ]
    };

    return NextResponse.json({
      success: true,
      points: mockUserPoints
    });
  } catch (error: any) {
    console.error('Points API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch points', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Award points to user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, amount, description } = body;

    // In production: Validate user, record transaction in DB
    const mockResponse = {
      success: true,
      pointsAwarded: amount,
      newBalance: 1250 + amount,
      transaction: {
        id: `txn_${Date.now()}`,
        action,
        amount,
        description,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error: any) {
    console.error('Award Points Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award points', message: error.message },
      { status: 500 }
    );
  }
}
