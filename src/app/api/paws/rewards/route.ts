import { NextRequest, NextResponse } from 'next/server';
import { rewards, getRewardsByCategory } from '@/data/rewards';

export const runtime = 'edge';

/**
 * GET /api/paws/rewards
 * Fetch available rewards, optionally filtered by category
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results = category ? getRewardsByCategory(category) : [...rewards];

    // Sort by points (ascending)
    results.sort((a, b) => a.points - b.points);

    // Apply limit
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: results.length,
      rewards: results
    });
  } catch (error: any) {
    console.error('Rewards API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rewards', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/paws/rewards
 * Redeem a reward
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rewardId, userPoints } = body;

    const reward = rewards.find(r => r.id === rewardId);

    if (!reward) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    if (!reward.available) {
      return NextResponse.json(
        { success: false, error: 'Reward is not available' },
        { status: 400 }
      );
    }

    if (userPoints < reward.points) {
      return NextResponse.json(
        { success: false, error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // In production: Create redemption record in DB, deduct points, send email, etc.
    const mockResponse = {
      success: true,
      redemption: {
        id: `red_${Date.now()}`,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsRedeemed: reward.points,
        newBalance: userPoints - reward.points,
        redeemedAt: new Date().toISOString(),
        code: `RAWGLE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error: any) {
    console.error('Redeem Reward Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to redeem reward', message: error.message },
      { status: 500 }
    );
  }
}
