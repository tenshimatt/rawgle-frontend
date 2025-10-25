import { NextResponse } from 'next/server';
import {
  breeds,
  getBreedsByGroup,
  getBreedsBySize,
  getBreedsByEnergyLevel,
  searchBreeds
} from '@/data/breeds';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  const size = searchParams.get('size');
  const energyLevel = searchParams.get('energyLevel');
  const search = searchParams.get('search');
  const slug = searchParams.get('slug');

  try {
    // Return single breed by slug
    if (slug) {
      const breed = breeds.find(b => b.slug === slug);
      if (!breed) {
        return NextResponse.json(
          { error: 'Breed not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(breed);
    }

    // Filter breeds based on query parameters
    let filteredBreeds = breeds;

    if (search) {
      filteredBreeds = searchBreeds(search);
    } else {
      if (group) {
        filteredBreeds = getBreedsByGroup(group);
      }
      if (size) {
        filteredBreeds = filteredBreeds.filter(b => b.size === size);
      }
      if (energyLevel) {
        filteredBreeds = filteredBreeds.filter(b => b.energyLevel === energyLevel);
      }
    }

    // Sort by popularity (lower number = more popular)
    // Add safety check for undefined popularity values
    filteredBreeds.sort((a, b) => (a.popularity || 999) - (b.popularity || 999));

    return NextResponse.json({
      breeds: filteredBreeds,
      total: filteredBreeds.length
    });
  } catch (error) {
    console.error('Breeds API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
