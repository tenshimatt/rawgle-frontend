import { NextRequest, NextResponse } from 'next/server';

// Feature 34: Video library
const videos = [
  { id: '1', title: 'Getting Started with Raw Feeding', duration: '12:30', category: 'Basics', thumbnail: 'https://via.placeholder.com/320x180' },
  { id: '2', title: 'Proper Food Handling', duration: '8:45', category: 'Safety', thumbnail: 'https://via.placeholder.com/320x180' },
  { id: '3', title: 'Transitioning Your Pet', duration: '15:20', category: 'Basics', thumbnail: 'https://via.placeholder.com/320x180' },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: videos });
}
