import { NextRequest, NextResponse } from 'next/server';
import {
  supplements,
  supplementCategories,
  getSupplementById,
  getSupplementBySlug,
  filterSupplements,
  type SupplementCategory,
  type PetSpecies
} from '@/data/supplements';

// GET /api/supplements - Get all supplements or filtered supplements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category') as SupplementCategory | null;
    const species = searchParams.get('species') as PetSpecies | null;
    const searchQuery = searchParams.get('search');
    const featuredOnly = searchParams.get('featured') === 'true';

    // If ID is provided, return single supplement
    if (id) {
      const supplement = getSupplementById(id);
      if (!supplement) {
        return NextResponse.json(
          { error: 'Supplement not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(supplement);
    }

    // If slug is provided, return single supplement
    if (slug) {
      const supplement = getSupplementBySlug(slug);
      if (!supplement) {
        return NextResponse.json(
          { error: 'Supplement not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(supplement);
    }

    // Build filter options
    const filterOptions: {
      category?: SupplementCategory;
      species?: PetSpecies;
      searchQuery?: string;
      featured?: boolean;
    } = {};

    if (category) filterOptions.category = category;
    if (species) filterOptions.species = species;
    if (searchQuery) filterOptions.searchQuery = searchQuery;
    if (featuredOnly) filterOptions.featured = true;

    // Filter supplements
    const filteredSupplements = Object.keys(filterOptions).length > 0
      ? filterSupplements(filterOptions)
      : supplements;

    return NextResponse.json({
      supplements: filteredSupplements,
      total: filteredSupplements.length,
      categories: supplementCategories
    });
  } catch (error) {
    console.error('Error in supplements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/supplements - Search supplements (for complex queries)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, species, searchQuery, featured, sortBy, limit, offset } = body;

    // Build filter options
    const filterOptions: {
      category?: SupplementCategory;
      species?: PetSpecies;
      searchQuery?: string;
      featured?: boolean;
    } = {};

    if (category) filterOptions.category = category;
    if (species) filterOptions.species = species;
    if (searchQuery) filterOptions.searchQuery = searchQuery;
    if (featured !== undefined) filterOptions.featured = featured;

    // Filter supplements
    let filteredSupplements = Object.keys(filterOptions).length > 0
      ? filterSupplements(filterOptions)
      : supplements;

    // Sort supplements
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          filteredSupplements = [...filteredSupplements].sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredSupplements = [...filteredSupplements].sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredSupplements = [...filteredSupplements].sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filteredSupplements = [...filteredSupplements].sort((a, b) => b.reviews - a.reviews);
          break;
        case 'name':
          filteredSupplements = [...filteredSupplements].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        default:
          // Default: featured first, then by rating
          filteredSupplements = [...filteredSupplements].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.rating - a.rating;
          });
      }
    }

    // Apply pagination
    const startIndex = offset || 0;
    const endIndex = limit ? startIndex + limit : filteredSupplements.length;
    const paginatedSupplements = filteredSupplements.slice(startIndex, endIndex);

    return NextResponse.json({
      supplements: paginatedSupplements,
      total: filteredSupplements.length,
      offset: startIndex,
      limit: limit || filteredSupplements.length,
      hasMore: endIndex < filteredSupplements.length,
      categories: supplementCategories
    });
  } catch (error) {
    console.error('Error in supplements POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
