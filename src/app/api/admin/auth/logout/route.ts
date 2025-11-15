import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, invalidateAdminToken } from '@/lib/auth/admin';

/**
 * Admin Logout Endpoint
 * POST /api/admin/auth/logout
 */
export async function POST(req: NextRequest) {
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

    // Verify token before invalidating
    const payload = verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Invalidate token in Redis (add to blacklist)
    await invalidateAdminToken(token);

    // Log logout
    console.log(`[Admin Auth] Logout successful: ${payload.email}`);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    // Clear the HTTP-only cookie
    const cookieOptions = [
      'admin-token=',
      'HttpOnly',
      'Path=/',
      'Max-Age=0', // Expire immediately
      'SameSite=Strict',
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('[Admin Auth] Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
