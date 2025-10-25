import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, isValidPassword } from '@/lib/jwt-auth';
import {
  getUserById,
  getPasswordResetToken,
  deletePasswordResetToken,
  deleteAllUserSessions
} from '@/lib/auth-storage';

interface RouteContext {
  params: {
    token: string;
  };
}

/**
 * POST /api/auth/reset-password/[token]
 * Reset user password using reset token
 */
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { token } = context.params;
    const body = await req.json();
    const { password } = body;

    // Validation
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Password is required',
          validationErrors: {
            password: 'Password is required'
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

    // Get reset token
    const resetToken = getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
          message: 'Password reset token is invalid or has expired'
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    const now = new Date();
    if (new Date(resetToken.expiresAt) < now) {
      // Delete expired token
      deletePasswordResetToken(token);

      return NextResponse.json(
        {
          success: false,
          error: 'Token expired',
          message: 'Password reset token has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }

    // Get user
    const user = getUserById(resetToken.userId);

    if (!user) {
      deletePasswordResetToken(token);

      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User account no longer exists'
        },
        { status: 404 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(password);

    // Update user password
    const { usersStore } = require('@/lib/auth-storage');
    const updatedUser = {
      ...user,
      passwordHash: newPasswordHash,
      updatedAt: new Date().toISOString()
    };

    usersStore.set(user.id, updatedUser);
    usersStore.set(user.email, updatedUser);

    // Delete the reset token
    deletePasswordResetToken(token);

    // Delete all user sessions (force re-login)
    deleteAllUserSessions(user.id);

    console.log(`[AUTH] Password reset successful for: ${user.email} (${user.id})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. Please log in with your new password.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH] Reset password error:', error);
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
