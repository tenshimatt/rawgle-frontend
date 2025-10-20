import { NextRequest, NextResponse } from 'next/server';

// Feature 35: Breed-specific guides
const guides = [
  { id: '1', breed: 'Golden Retriever', dietNotes: 'Prone to obesity, monitor portions carefully', commonIssues: ['Hip dysplasia', 'Heart disease'] },
  { id: '2', breed: 'German Shepherd', dietNotes: 'May need joint support supplements', commonIssues: ['Joint issues', 'Digestive sensitivity'] },
  { id: '3', breed: 'Labrador', dietNotes: 'High energy, needs protein-rich diet', commonIssues: ['Weight gain', 'Joint issues'] },
];

export async function GET(request: NextRequest) {
  const breed = request.nextUrl.searchParams.get('breed');
  const filtered = breed ? guides.filter(g => g.breed.toLowerCase().includes(breed.toLowerCase())) : guides;
  return NextResponse.json({ data: filtered });
}
