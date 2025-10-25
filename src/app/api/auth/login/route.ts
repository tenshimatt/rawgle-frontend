import { NextRequest, NextResponse } from 'next/server';
import {
  Session,
  verifyPassword,
  generateToken,
  generateRandomToken,
  toPublicUser,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '@/lib/jwt-auth';
import {
  getUserByEmail,
  createSession,
  checkRateLimit,
  clearRateLimit
} from '@/lib/auth-storage';

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limiting (5 attempts per 15 minutes per IP)
    if (checkRateLimit(ip)) {
      console.log(`[AUTH] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts',
          message: 'Too many login attempts. Please try again in 15 minutes.'
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Email and password are required',
          validationErrors: {
            email: !email ? 'Email is required' : undefined,
            password: !password ? 'Password is required' : undefined
          }
        },
        { status: 400 }
      );
    }

    // Get user by email
    const user = getUserByEmail(email.toLowerCase());
    if (!user) {
      console.log(`[AUTH] Login failed - user not found: ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log(`[AUTH] Login failed - invalid password: ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Clear rate limit on successful login
    clearRateLimit(ip);

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const token = generateToken(tokenPayload, JWT_EXPIRES_IN);
    const refreshToken = generateRandomToken();

    // Get user agent
    const userAgent = req.headers.get('user-agent') || undefined;

    // Create session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + JWT_EXPIRES_IN);
    const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRES_IN);

    const session: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      ipAddress: ip,
      userAgent,
      createdAt: now.toISOString()
    };

    createSession(session);

    // Log successful login
    console.log(`[AUTH] User logged in: ${user.email} (${user.id}) from IP: ${ip}`);

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: toPublicUser(user),
          token,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN,
          expiresAt: expiresAt.toISOString()
        },
        message: 'Login successful'
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for web clients
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRES_IN / 1000, // Convert to seconds
      path: '/'
    });

    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRES_IN / 1000,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
