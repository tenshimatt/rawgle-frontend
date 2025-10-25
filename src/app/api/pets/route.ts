import { NextRequest, NextResponse } from 'next/server';

interface Pet {
  id: string;
  userId: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  birthdate: string;
  weight: number;
  gender: 'male' | 'female';
  image?: string;
  active: boolean;
  createdAt: string;
}

// Demo data
const demoPets: Pet[] = [
  {
    id: '1',
    userId: 'demo-user',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    birthdate: '2021-03-15',
    weight: 65,
    gender: 'male',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'demo-user',
    name: 'Luna',
    species: 'dog',
    breed: 'Labrador Retriever',
    birthdate: '2022-06-20',
    weight: 55,
    gender: 'female',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// In-memory fallback storage
const memoryStorage = new Map<string, Pet[]>();
memoryStorage.set('pets:all', [...demoPets]);

// KV availability flag
let kvAvailable = false;
let kv: any = null;

// Check KV availability once at module load
const initKV = async () => {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv: kvClient } = await import('@vercel/kv');
      kv = kvClient;
      kvAvailable = true;
      console.log('[Pets API] Vercel KV initialized successfully');
    } else {
      console.warn('[Pets API] Vercel KV environment variables not found, using in-memory storage');
      kvAvailable = false;
    }
  } catch (error) {
    console.error('[Pets API] Failed to initialize KV, using in-memory storage:', error);
    kvAvailable = false;
  }
};

// Initialize KV on first request
let kvInitPromise: Promise<void> | null = null;
const ensureKVInitialized = async () => {
  if (kvInitPromise === null) {
    kvInitPromise = initKV();
  }
  await kvInitPromise;
};

// Storage key for KV
const PETS_KEY = 'pets:all';

// Helper functions for storage (KV or in-memory fallback)
async function getAllPets(): Promise<Pet[]> {
  await ensureKVInitialized();

  if (kvAvailable && kv) {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('KV timeout')), 5000)
      );

      const kvPromise = kv.get<Pet[]>(PETS_KEY);
      const pets = await Promise.race([kvPromise, timeoutPromise]);

      if (!pets) {
        // Initialize with demo data
        await kv.set(PETS_KEY, demoPets);
        return [...demoPets];
      }
      return pets;
    } catch (error) {
      console.warn('[Pets API] KV get failed, using in-memory fallback:', error instanceof Error ? error.message : error);
      // Mark KV as unavailable for this session
      kvAvailable = false;
      return memoryStorage.get(PETS_KEY) || [...demoPets];
    }
  }

  return memoryStorage.get(PETS_KEY) || [...demoPets];
}

async function savePets(pets: Pet[]): Promise<void> {
  await ensureKVInitialized();

  if (kvAvailable && kv) {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('KV timeout')), 5000)
      );

      const kvPromise = kv.set(PETS_KEY, pets);
      await Promise.race([kvPromise, timeoutPromise]);

      return;
    } catch (error) {
      console.warn('[Pets API] KV set failed, using in-memory fallback:', error instanceof Error ? error.message : error);
      // Mark KV as unavailable for this session
      kvAvailable = false;
    }
  }

  memoryStorage.set(PETS_KEY, pets);
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const allPets = await getAllPets();
    let userPets = allPets.filter(pet => pet.userId === userId);

    // Filter by active status if requested
    if (activeOnly) {
      userPets = userPets.filter(pet => pet.active);
    }

    return NextResponse.json({
      success: true,
      data: userPets,
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, species, breed, birthdate, weight, gender, image } = body;

    // Validation
    if (!name || !species || !breed || !birthdate || !weight || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (species !== 'dog' && species !== 'cat') {
      return NextResponse.json(
        { error: 'Species must be dog or cat' },
        { status: 400 }
      );
    }

    if (gender !== 'male' && gender !== 'female') {
      return NextResponse.json(
        { error: 'Gender must be male or female' },
        { status: 400 }
      );
    }

    const newPet: Pet = {
      id: Math.random().toString(36).substring(7),
      userId,
      name,
      species,
      breed,
      birthdate,
      weight: Number(weight),
      gender,
      image,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const allPets = await getAllPets();
    allPets.push(newPet);
    await savePets(allPets);

    return NextResponse.json({
      success: true,
      data: newPet,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, species, breed, birthdate, weight, gender, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Pet ID required' },
        { status: 400 }
      );
    }

    const allPets = await getAllPets();
    const petIndex = allPets.findIndex(p => p.id === id && p.userId === userId);

    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    allPets[petIndex] = {
      ...allPets[petIndex],
      name: name || allPets[petIndex].name,
      species: species || allPets[petIndex].species,
      breed: breed || allPets[petIndex].breed,
      birthdate: birthdate || allPets[petIndex].birthdate,
      weight: weight !== undefined ? Number(weight) : allPets[petIndex].weight,
      gender: gender || allPets[petIndex].gender,
      image: image !== undefined ? image : allPets[petIndex].image,
    };

    await savePets(allPets);

    return NextResponse.json({
      success: true,
      data: allPets[petIndex],
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Pet ID required' },
        { status: 400 }
      );
    }

    const allPets = await getAllPets();
    const petIndex = allPets.findIndex(p => p.id === id && p.userId === userId);

    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    allPets.splice(petIndex, 1);
    await savePets(allPets);

    return NextResponse.json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }
}
