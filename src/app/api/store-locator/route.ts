import { NextRequest, NextResponse } from 'next/server';

// Feature 28: Store locator map
const stores = [
  { id: '1', name: 'Raw Essentials Market', lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
  { id: '2', name: 'Premium Pet Supply', lat: 34.0522, lng: -118.2437, address: '456 Oak Ave, Los Angeles, CA' },
  { id: '3', name: 'Natural Pet Foods', lat: 41.8781, lng: -87.6298, address: '789 Elm St, Chicago, IL' },
];

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  // In production, filter by distance from lat/lng
  return NextResponse.json({ data: stores });
}
