import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Mock password reset - integrate with email service
  console.log(`Password reset requested for: ${email}`);

  return NextResponse.json({ success: true, message: 'Reset email sent' });
}
