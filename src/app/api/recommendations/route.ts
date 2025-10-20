import { NextRequest, NextResponse } from 'next/server';

const mockRecommendations = [
  {
    id: '1',
    name: 'Premium Grain-Free Dog Food',
    category: 'Food',
    price: 45.99,
    rating: 4.8,
    description: 'High-protein, grain-free formula',
    aiReason: 'Perfect for adult dogs with sensitive stomachs'
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil Supplements',
    category: 'Supplements',
    price: 24.99,
    rating: 4.9,
    description: 'Supports coat health and joint function',
    aiReason: 'Recommended for dogs over 5 years old'
  },
  {
    id: '3',
    name: 'Dental Chew Treats',
    category: 'Treats',
    price: 15.99,
    rating: 4.7,
    description: 'Promotes dental health',
    aiReason: 'Great for daily dental care routine'
  }
];

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Pet ID required' }, { status: 400 });
  }

  // In a real app, this would use AI to generate personalized recommendations
  return NextResponse.json({ data: mockRecommendations });
}
