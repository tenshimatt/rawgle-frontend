import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Mock authentication - replace with real auth
  if (email && password) {
    return NextResponse.json({ token: 'demo-token-' + Date.now(), user: { email, name: 'Demo User' } });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
