import { NextRequest, NextResponse } from 'next/server';
import { initializeDefaultAdmin } from '@/lib/auth/admin';

/**
 * Admin Seed Endpoint - Initialize Default Admin
 * POST /api/admin/seed
 *
 * This endpoint creates the default super admin user if one doesn't exist.
 * For security, this should only be accessible during initial setup or with proper authorization.
 */
export async function POST(req: NextRequest) {
  try {
    // Security check - only allow in development or with special secret
    const isDevelopment = process.env.NODE_ENV === 'development';
    const seedSecret = req.headers.get('x-seed-secret');
    const expectedSecret = process.env.ADMIN_SEED_SECRET || 'dev-seed-secret-123';

    if (!isDevelopment && seedSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid seed secret' },
        { status: 403 }
      );
    }

    // Initialize default admin
    const result = await initializeDefaultAdmin();

    if (!result) {
      return NextResponse.json(
        {
          success: true,
          message: 'Default admin already exists',
        },
        { status: 200 }
      );
    }

    // Return credentials (only on first creation)
    return NextResponse.json(
      {
        success: true,
        message: 'Default admin created successfully',
        credentials: {
          email: result.email,
          password: result.password,
          warning: 'Save this password securely! It will not be shown again.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Admin Seed] Error initializing default admin:', error);
    return NextResponse.json(
      { error: 'Failed to initialize default admin' },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check if default admin exists
 */
export async function GET(req: NextRequest) {
  try {
    // Import here to avoid circular dependencies
    const { getAdminUser } = await import('@/lib/auth/admin');

    const email = 'admin@rawgle.com';
    const adminExists = await getAdminUser(email);

    return NextResponse.json(
      {
        exists: !!adminExists,
        email: adminExists ? email : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Admin Seed] Error checking admin existence:', error);
    return NextResponse.json(
      { error: 'Failed to check admin existence' },
      { status: 500 }
    );
  }
}
