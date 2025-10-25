import { NextRequest, NextResponse } from 'next/server';
import {
  User,
  Session,
  hashPassword,
  isValidEmail,
  isValidPassword,
  toPublicUser,
  generateToken,
  generateRandomToken,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '@/lib/jwt-auth';
import {
  createUser,
  getUserByEmail,
  createSession
} from '@/lib/auth-storage';

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username, firstName, lastName, role } = body;

    // Validation - required fields
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

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Invalid email format',
          validationErrors: {
            email: 'Invalid email format'
          }
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: passwordValidation.message,
          validationErrors: {
            password: passwordValidation.message
          }
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'An account with this email address already exists'
        },
        { status: 409 } // Conflict
      );
    }

    // Validate username if provided
    if (username && username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Username must be at least 3 characters long',
          validationErrors: {
            username: 'Username must be at least 3 characters long'
          }
        },
        { status: 400 }
      );
    }

    // Validate role if provided
    const validRoles = ['guest', 'user', 'premium', 'vet', 'supplier', 'admin'];
    const userRole = role || 'user';
    if (!validRoles.includes(userRole)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Invalid role specified',
          validationErrors: {
            role: `Role must be one of: ${validRoles.join(', ')}`
          }
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user
    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      username: username || email.split('@')[0],
      firstName: firstName || '',
      lastName: lastName || '',
      role: userRole as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false
    };

    createUser(newUser);

    // Log registration event
    console.log(`[AUTH] User registered: ${newUser.email} (${newUser.id})`);

    // Generate JWT token for auto-login
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
    const token = generateToken(tokenPayload, JWT_EXPIRES_IN);
    const refreshToken = generateRandomToken();

    // Get request metadata
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;

    // Create session for auto-login
    const now = new Date();
    const expiresAt = new Date(now.getTime() + JWT_EXPIRES_IN);
    const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRES_IN);

    const session: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: newUser.id,
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      ipAddress: ip,
      userAgent,
      createdAt: now.toISOString()
    };

    createSession(session);

    // Create response with tokens for auto-login
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: toPublicUser(newUser),
          token,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN,
          expiresAt: expiresAt.toISOString()
        },
        message: 'Account created successfully. You are now logged in.'
      },
      { status: 201 }
    );

    // Set HTTP-only cookies
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRES_IN / 1000,
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
    console.error('[AUTH] Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
