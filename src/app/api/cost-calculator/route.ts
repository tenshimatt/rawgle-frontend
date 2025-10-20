import { NextRequest, NextResponse } from 'next/server';

// Feature 38: Cost calculator for raw feeding
export async function POST(request: NextRequest) {
  const { weight, feedingPercentage = 2.5 } = await request.json();

  const dailyAmount = weight * (feedingPercentage / 100);
  const weeklyAmount = dailyAmount * 7;
  const monthlyAmount = dailyAmount * 30;

  const avgCostPerKg = 8.50; // Example price

  return NextResponse.json({
    data: {
      dailyCost: (dailyAmount * avgCostPerKg).toFixed(2),
      weeklyCost: (weeklyAmount * avgCostPerKg).toFixed(2),
      monthlyCost: (monthlyAmount * avgCostPerKg).toFixed(2),
      dailyAmount: dailyAmount.toFixed(2),
    }
  });
}
