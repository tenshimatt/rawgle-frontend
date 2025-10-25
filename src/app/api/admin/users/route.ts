import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'guest' | 'user' | 'premium' | 'vet' | 'supplier' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastActive: string;
  petCount: number;
  orderCount: number;
}

// In-memory user storage for demo (replace with database in production)
const users = new Map<string, User>();

// Initialize with mock data
const initMockUsers = () => {
  if (users.size === 0) {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        username: 'johndoe',
        role: 'premium',
        status: 'active',
        joinDate: '2024-01-15',
        lastActive: '2025-01-20',
        petCount: 2,
        orderCount: 15
      },
      {
        id: '2',
        email: 'sarah.smith@example.com',
        username: 'sarahsmith',
        role: 'user',
        status: 'active',
        joinDate: '2024-03-20',
        lastActive: '2025-01-19',
        petCount: 1,
        orderCount: 8
      },
      {
        id: '3',
        email: 'dr.brown@vetclinic.com',
        username: 'drbrown',
        role: 'vet',
        status: 'active',
        joinDate: '2024-02-10',
        lastActive: '2025-01-20',
        petCount: 0,
        orderCount: 0
      },
      {
        id: '4',
        email: 'supplier@rawfood.com',
        username: 'rawfoodsupplier',
        role: 'supplier',
        status: 'active',
        joinDate: '2024-01-05',
        lastActive: '2025-01-18',
        petCount: 0,
        orderCount: 0
      },
      {
        id: '5',
        email: 'mike.wilson@example.com',
        username: 'mikewilson',
        role: 'user',
        status: 'suspended',
        joinDate: '2024-06-12',
        lastActive: '2025-01-10',
        petCount: 1,
        orderCount: 3
      },
      {
        id: '6',
        email: 'spam.user@example.com',
        username: 'spammer',
        role: 'guest',
        status: 'banned',
        joinDate: '2024-12-01',
        lastActive: '2024-12-05',
        petCount: 0,
        orderCount: 0
      },
      {
        id: '7',
        email: 'emma.davis@example.com',
        username: 'emmadavis',
        role: 'premium',
        status: 'active',
        joinDate: '2024-04-18',
        lastActive: '2025-01-20',
        petCount: 3,
        orderCount: 22
      },
      {
        id: '8',
        email: 'alex.jones@example.com',
        username: 'alexjones',
        role: 'user',
        status: 'active',
        joinDate: '2024-08-22',
        lastActive: '2025-01-17',
        petCount: 1,
        orderCount: 5
      },
      {
        id: '9',
        email: 'lisa.taylor@example.com',
        username: 'lisataylor',
        role: 'user',
        status: 'active',
        joinDate: '2024-05-30',
        lastActive: '2025-01-19',
        petCount: 2,
        orderCount: 12
      },
      {
        id: '10',
        email: 'chris.martin@example.com',
        username: 'chrismartin',
        role: 'premium',
        status: 'active',
        joinDate: '2024-07-14',
        lastActive: '2025-01-20',
        petCount: 4,
        orderCount: 28
      }
    ];

    mockUsers.forEach(user => users.set(user.id, user));
  }
};

export async function GET(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockUsers();

    return NextResponse.json({
      success: true,
      users: Array.from(users.values())
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockUsers();

    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = users.get(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    if (role) {
      user.role = role;
    }
    if (status) {
      user.status = status;
    }

    users.set(userId, user);

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockUsers();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!users.has(userId)) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    users.delete(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
