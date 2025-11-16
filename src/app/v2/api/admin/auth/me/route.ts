import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminToken,
  getAdminUserById,
  toPublicAdminUser,
  isTokenBlacklisted,
} from '@/lib/auth/admin';

/**
 * Get Current Admin User
 * GET /api/admin/auth/me
 */
export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.get('admin-token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return NextResponse.json(
        { error: 'Token has been invalidated. Please login again.' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get admin user from Redis
    const adminUser = await getAdminUserById(payload.adminId);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Check if admin is active
    if (!adminUser.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // Return public admin user data
    const publicAdminUser = toPublicAdminUser(adminUser);

    return NextResponse.json(
      {
        success: true,
        user: publicAdminUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Admin Auth] Get current user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
