import { NextRequest, NextResponse } from 'next/server';
import { PasswordResetToken, generateRandomToken, isValidEmail } from '@/lib/jwt-auth';
import { getUserByEmail, createPasswordResetToken } from '@/lib/auth-storage';

/**
 * POST /api/auth/forgot-password
 * Initiate password reset process
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Email is required',
          validationErrors: {
            email: 'Email is required'
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

    // Get user by email
    const user = await getUserByEmail(email.toLowerCase());

    // Always return success to prevent email enumeration
    // Don't reveal whether the email exists or not
    if (!user) {
      console.log(`[AUTH] Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(
        {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    const passwordResetToken: PasswordResetToken = {
      token: resetToken,
      userId: user.id,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    };

    await createPasswordResetToken(passwordResetToken);

    // In a real application, you would send an email here
    // For now, we'll just log it to the console
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/reset-password/${resetToken}`;

    console.log(`[AUTH] Password reset requested for: ${user.email}`);
    console.log(`[AUTH] Reset link: ${resetLink}`);
    console.log(`[AUTH] Reset token: ${resetToken}`);
    console.log(`[AUTH] Token expires at: ${expiresAt.toISOString()}`);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        // In development, include the reset token for testing
        ...(process.env.NODE_ENV === 'development' && {
          data: {
            resetToken,
            resetLink,
            expiresAt: expiresAt.toISOString()
          }
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH] Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Password reset failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
