import { NextRequest, NextResponse } from 'next/server';
import {
  Session,
  generateToken,
  generateRandomToken,
  toPublicUser,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '@/lib/jwt-auth';
import {
  getUserById,
  getSessionByRefreshToken,
  createSession,
  deleteSession
} from '@/lib/auth-storage';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let refreshToken = body.refreshToken;

    // If no refresh token in body, try cookie
    if (!refreshToken) {
      refreshToken = req.cookies.get('refresh-token')?.value;
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing refresh token',
          message: 'Refresh token is required'
        },
        { status: 400 }
      );
    }

    // Get session by refresh token
    const session = getSessionByRefreshToken(refreshToken);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid refresh token',
          message: 'Refresh token is invalid or expired'
        },
        { status: 401 }
      );
    }

    // Check if refresh token is expired
    const now = new Date();
    if (new Date(session.refreshExpiresAt) < now) {
      // Delete expired session
      deleteSession(session.token);

      return NextResponse.json(
        {
          success: false,
          error: 'Refresh token expired',
          message: 'Refresh token has expired. Please log in again.'
        },
        { status: 401 }
      );
    }

    // Get user
    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User associated with this session no longer exists'
        },
        { status: 401 }
      );
    }

    // Delete old session
    deleteSession(session.token);

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const newToken = generateToken(tokenPayload, JWT_EXPIRES_IN);
    const newRefreshToken = generateRandomToken();

    // Get client info
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               session.ipAddress ||
               'unknown';
    const userAgent = req.headers.get('user-agent') || session.userAgent;

    // Create new session
    const expiresAt = new Date(now.getTime() + JWT_EXPIRES_IN);
    const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRES_IN);

    const newSession: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      ipAddress: ip,
      userAgent,
      createdAt: now.toISOString()
    };

    createSession(newSession);

    // Log token refresh
    console.log(`[AUTH] Token refreshed for user: ${user.email} (${user.id})`);

    // Create response with cookies
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: toPublicUser(user),
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: JWT_EXPIRES_IN,
          expiresAt: expiresAt.toISOString()
        },
        message: 'Token refreshed successfully'
      },
      { status: 200 }
    );

    // Set HTTP-only cookies
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRES_IN / 1000,
      path: '/'
    });

    response.cookies.set('refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRES_IN / 1000,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('[AUTH] Token refresh error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Token refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
