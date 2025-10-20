import { NextRequest, NextResponse } from 'next/server';

// Feature 36: Glossary of raw feeding terms
const terms = [
  { term: 'PMR', definition: 'Prey Model Raw - Feeding whole prey animals or appropriate ratios of muscle meat, bone, and organs', category: 'Diet Types' },
  { term: 'BARF', definition: 'Biologically Appropriate Raw Food - Raw diet including vegetables and supplements', category: 'Diet Types' },
  { term: 'RMB', definition: 'Raw Meaty Bones - Bones with meat attached, safe for consumption', category: 'Ingredients' },
  { term: '80/10/10', definition: 'Ratio of 80% muscle meat, 10% bone, 10% organ (5% liver, 5% other organs)', category: 'Ratios' },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: terms });
}
