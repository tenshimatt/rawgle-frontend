import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/jwt-auth';
import { deleteSession } from '@/lib/auth-storage';

/**
 * POST /api/auth/logout
 * Revoke user session and log out
 */
export async function POST(req: NextRequest) {
  try {
    // Get user from token
    const tokenPayload = getUserFromRequest(req);

    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
          message: 'No valid session found'
        },
        { status: 401 }
      );
    }

    // Get token from Authorization header or cookie
    const authHeader = req.headers.get('authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get('auth-token')?.value;
    }

    // Delete session
    if (token) {
      await deleteSession(token);
    }

    // Log logout event
    console.log(`[AUTH] User logged out: ${tokenPayload.email} (${tokenPayload.userId})`);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    );

    // Clear cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
