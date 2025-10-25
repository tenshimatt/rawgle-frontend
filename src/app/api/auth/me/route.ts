import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, toPublicUser } from '@/lib/jwt-auth';
import { getUserById } from '@/lib/auth-storage';

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
export async function GET(req: NextRequest) {
  try {
    // Get user from token
    const tokenPayload = getUserFromRequest(req);

    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
          message: 'You must be logged in to access this resource'
        },
        { status: 401 }
      );
    }

    // Get full user data
    const user = getUserById(tokenPayload.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User account no longer exists'
        },
        { status: 404 }
      );
    }

    // Return public user data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: toPublicUser(user)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH] Get current user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/auth/me
 * Update current user profile
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get user from token
    const tokenPayload = getUserFromRequest(req);

    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
          message: 'You must be logged in to access this resource'
        },
        { status: 401 }
      );
    }

    // Get full user data
    const user = getUserById(tokenPayload.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User account no longer exists'
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { username, firstName, lastName, avatarUrl } = body;

    // Validate username if provided
    if (username !== undefined && username.length < 3) {
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

    // Update user
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (username !== undefined) updates.username = username;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const updatedUser = { ...user, ...updates };

    // Update in storage (note: auth-storage doesn't have updateUser yet, so we'll do it manually)
    const { usersStore } = require('@/lib/auth-storage');
    usersStore.set(user.id, updatedUser);
    usersStore.set(user.email, updatedUser);

    console.log(`[AUTH] User profile updated: ${user.email} (${user.id})`);

    // Return updated user data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: toPublicUser(updatedUser)
        },
        message: 'Profile updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH] Update user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
