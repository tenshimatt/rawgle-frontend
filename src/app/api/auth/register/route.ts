import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  // Mock registration - replace with real auth
  if (name && email && password) {
    return NextResponse.json({ success: true, message: 'Account created' }, { status: 201 });
  }

  return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
}
