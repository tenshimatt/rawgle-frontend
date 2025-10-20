import { NextRequest, NextResponse } from 'next/server';

// Feature 29: Vet directory finder
const vets = [
  { id: '1', name: 'Holistic Vet Clinic', specialty: 'Raw Feeding Specialist', lat: 40.7589, lng: -73.9851, phone: '(555) 123-4567' },
  { id: '2', name: 'Natural Pet Care', specialty: 'Integrative Medicine', lat: 34.0522, lng: -118.2437, phone: '(555) 234-5678' },
  { id: '3', name: 'Wellness Animal Hospital', specialty: 'Nutrition & Wellness', lat: 41.8781, lng: -87.6298, phone: '(555) 345-6789' },
];

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  return NextResponse.json({ data: vets });
}
