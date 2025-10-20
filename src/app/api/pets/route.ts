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
  createdAt: string;
}

// In-memory storage (replace with database later)
const pets: Pet[] = [
  {
    id: '1',
    userId: 'demo-user',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    birthdate: '2021-03-15',
    weight: 65,
    gender: 'male',
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
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const userPets = pets.filter(pet => pet.userId === userId);

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
      createdAt: new Date().toISOString(),
    };

    pets.push(newPet);

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

    const petIndex = pets.findIndex(p => p.id === id && p.userId === userId);

    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    pets[petIndex] = {
      ...pets[petIndex],
      name: name || pets[petIndex].name,
      species: species || pets[petIndex].species,
      breed: breed || pets[petIndex].breed,
      birthdate: birthdate || pets[petIndex].birthdate,
      weight: weight !== undefined ? Number(weight) : pets[petIndex].weight,
      gender: gender || pets[petIndex].gender,
      image: image !== undefined ? image : pets[petIndex].image,
    };

    return NextResponse.json({
      success: true,
      data: pets[petIndex],
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

    const petIndex = pets.findIndex(p => p.id === id && p.userId === userId);

    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    pets.splice(petIndex, 1);

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
