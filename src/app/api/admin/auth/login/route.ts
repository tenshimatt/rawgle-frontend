import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUser,
  verifyPassword,
  generateAdminToken,
  updateAdminLastLogin,
  toPublicAdminUser,
  isValidEmail,
} from '@/lib/auth/admin';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiter for login attempts
 */
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt || now > attempt.resetAt) {
    // Reset or create new attempt record
    loginAttempts.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((attempt.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment attempt count
  attempt.count += 1;
  loginAttempts.set(identifier, attempt);

  return { allowed: true };
}

/**
 * Clean up old rate limit entries periodically
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now > value.resetAt) {
      loginAttempts.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Admin Login Endpoint
 * POST /api/admin/auth/login
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const identifier = `${ip}:${email}`;

    // Check rate limit
    const rateLimit = checkRateLimit(identifier);
    if (!rateLimit.allowed) {
      console.warn(`[Admin Auth] Rate limit exceeded for ${email} from ${ip}`);
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '900',
          },
        }
      );
    }

    // Get admin user from Redis
    const adminUser = await getAdminUser(email.toLowerCase().trim());

    if (!adminUser) {
      console.warn(`[Admin Auth] Login failed - user not found: ${email}`);
      // Use generic error message to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!adminUser.isActive) {
      console.warn(`[Admin Auth] Login failed - inactive account: ${email}`);
      return NextResponse.json(
        { error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, adminUser.passwordHash);

    if (!isValidPassword) {
      console.warn(`[Admin Auth] Login failed - invalid password: ${email}`);
      // Use generic error message to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login time
    await updateAdminLastLogin(adminUser.email);

    // Generate JWT token
    const token = generateAdminToken(adminUser);

    // Prepare public user data
    const publicAdminUser = toPublicAdminUser(adminUser);

    // Log successful login
    console.log(`[Admin Auth] Login successful: ${email} (${adminUser.role}) from ${ip}`);

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: publicAdminUser,
        token, // Also return in body for clients that prefer Authorization header
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `admin-token=${token}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${24 * 60 * 60}`, // 24 hours
      'SameSite=Strict',
      isProduction ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    // Add CSRF token header
    const csrfToken = generateCSRFToken();
    response.headers.set('X-CSRF-Token', csrfToken);

    return response;
  } catch (error) {
    console.error('[Admin Auth] Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Generate a CSRF token (simple implementation)
 */
function generateCSRFToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
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
