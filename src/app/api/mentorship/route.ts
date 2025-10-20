import { NextRequest, NextResponse } from 'next/server';

// Feature 33: Mentorship matching
const mentors = [
  { id: '1', name: 'Sarah M.', expertise: 'Raw Feeding Basics', experience: '5 years', available: true },
  { id: '2', name: 'John D.', expertise: 'Health Transitions', experience: '8 years', available: true },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: mentors });
}
