import { User, Session, PasswordResetToken, hashPassword } from './jwt-auth';
import { getRedis } from './redis';

/**
 * Redis-based authentication storage
 *
 * Key structure:
 * - auth:users:{userId} → User object
 * - auth:users:email:{email} → userId
 * - auth:sessions:{token} → Session object (30-day TTL)
 * - auth:sessions:refresh:{refreshToken} → session token (30-day TTL)
 * - auth:password-reset:{token} → PasswordResetToken (1-hour TTL)
 * - auth:rate-limit:{ip} → Array of attempt timestamps (15-min TTL)
 */

const REDIS_PREFIX = 'auth:';
const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds
const PASSWORD_RESET_TTL = 60 * 60; // 1 hour in seconds
const RATE_LIMIT_TTL = 15 * 60; // 15 minutes in seconds

/**
 * Initialize demo user
 */
async function initializeDemoUser() {
  const redis = getRedis();
  if (!redis) {
    console.warn('[AUTH] Redis not available, skipping demo user initialization');
    return;
  }

  const demoUserId = 'user_demo_001';
  const demoEmail = 'demo@rawgle.com';

  try {
    // Check if demo user already exists
    const existingUser = await redis.get(`${REDIS_PREFIX}users:${demoUserId}`);

    if (!existingUser) {
      const demoUser: User = {
        id: demoUserId,
        email: demoEmail,
        passwordHash: await hashPassword('Demo1234'),
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        avatarUrl: '/images/avatars/demo-user.jpg',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
        emailVerified: true
      };

      // Store user by ID and create email index
      await redis.set(`${REDIS_PREFIX}users:${demoUserId}`, JSON.stringify(demoUser));
      await redis.set(`${REDIS_PREFIX}users:email:${demoEmail}`, demoUserId);

      console.log('[AUTH] Demo user initialized - Email: demo@rawgle.com, Password: Demo1234');
    }
  } catch (error) {
    console.error('[AUTH] Failed to initialize demo user:', error);
  }
}

// Initialize demo user immediately
initializeDemoUser().catch(console.error);

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const userData = await redis.get(`${REDIS_PREFIX}users:${userId}`);
    if (!userData) return null;

    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('[AUTH] Error getting user by ID:', error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    // First get userId from email index
    const userId = await redis.get(`${REDIS_PREFIX}users:email:${email}`);
    if (!userId) return null;

    // Then get the full user object
    return await getUserById(userId);
  } catch (error) {
    console.error('[AUTH] Error getting user by email:', error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(user: User): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error('Redis not available');
  }

  try {
    // Store user by ID and create email index
    await redis.set(`${REDIS_PREFIX}users:${user.id}`, JSON.stringify(user));
    await redis.set(`${REDIS_PREFIX}users:email:${user.email}`, user.id);

    console.log(`[AUTH] User created in Redis: ${user.email} (${user.id})`);
  } catch (error) {
    console.error('[AUTH] Error creating user:', error);
    throw error;
  }
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const user = await getUserById(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };

    // Update user by ID
    await redis.set(`${REDIS_PREFIX}users:${userId}`, JSON.stringify(updatedUser));

    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      await redis.del(`${REDIS_PREFIX}users:email:${user.email}`);
      await redis.set(`${REDIS_PREFIX}users:email:${updates.email}`, userId);
    }

    return updatedUser;
  } catch (error) {
    console.error('[AUTH] Error updating user:', error);
    return null;
  }
}

/**
 * Create a new session
 */
export async function createSession(session: Session): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error('Redis not available');
  }

  try {
    // Store session by token with TTL
    await redis.setex(
      `${REDIS_PREFIX}sessions:${session.token}`,
      SESSION_TTL,
      JSON.stringify(session)
    );

    // Create refresh token index with TTL
    await redis.setex(
      `${REDIS_PREFIX}sessions:refresh:${session.refreshToken}`,
      SESSION_TTL,
      session.token
    );

    console.log(`[AUTH] Session created in Redis for user: ${session.userId}`);
  } catch (error) {
    console.error('[AUTH] Error creating session:', error);
    throw error;
  }
}

/**
 * Get session by token
 */
export async function getSessionByToken(token: string): Promise<Session | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const sessionData = await redis.get(`${REDIS_PREFIX}sessions:${token}`);
    if (!sessionData) return null;

    return JSON.parse(sessionData) as Session;
  } catch (error) {
    console.error('[AUTH] Error getting session by token:', error);
    return null;
  }
}

/**
 * Get session by refresh token
 */
export async function getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    // First get session token from refresh token index
    const sessionToken = await redis.get(`${REDIS_PREFIX}sessions:refresh:${refreshToken}`);
    if (!sessionToken) return null;

    // Then get the full session object
    return await getSessionByToken(sessionToken);
  } catch (error) {
    console.error('[AUTH] Error getting session by refresh token:', error);
    return null;
  }
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    // Get session to find refresh token
    const session = await getSessionByToken(token);

    if (session) {
      // Delete both token and refresh token
      await redis.del(`${REDIS_PREFIX}sessions:${token}`);
      await redis.del(`${REDIS_PREFIX}sessions:refresh:${session.refreshToken}`);

      console.log(`[AUTH] Session deleted from Redis for user: ${session.userId}`);
    }
  } catch (error) {
    console.error('[AUTH] Error deleting session:', error);
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    // Scan for all session keys
    const stream = redis.scanStream({
      match: `${REDIS_PREFIX}sessions:*`,
      count: 100
    });

    const keysToDelete: string[] = [];

    for await (const keys of stream) {
      for (const key of keys) {
        // Skip refresh token keys (they'll be deleted when we delete the main session)
        if (key.includes(':refresh:')) continue;

        try {
          const sessionData = await redis.get(key);
          if (sessionData) {
            const session = JSON.parse(sessionData) as Session;
            if (session.userId === userId) {
              keysToDelete.push(key);
              keysToDelete.push(`${REDIS_PREFIX}sessions:refresh:${session.refreshToken}`);
            }
          }
        } catch (err) {
          console.error('[AUTH] Error processing session key:', err);
        }
      }
    }

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
      console.log(`[AUTH] Deleted ${keysToDelete.length / 2} sessions for user: ${userId}`);
    }
  } catch (error) {
    console.error('[AUTH] Error deleting all user sessions:', error);
  }
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(resetToken: PasswordResetToken): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error('Redis not available');
  }

  try {
    // Store with 1-hour TTL
    await redis.setex(
      `${REDIS_PREFIX}password-reset:${resetToken.token}`,
      PASSWORD_RESET_TTL,
      JSON.stringify(resetToken)
    );

    console.log(`[AUTH] Password reset token created in Redis for user: ${resetToken.userId}`);
  } catch (error) {
    console.error('[AUTH] Error creating password reset token:', error);
    throw error;
  }
}

/**
 * Get password reset token
 */
export async function getPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const tokenData = await redis.get(`${REDIS_PREFIX}password-reset:${token}`);
    if (!tokenData) return null;

    return JSON.parse(tokenData) as PasswordResetToken;
  } catch (error) {
    console.error('[AUTH] Error getting password reset token:', error);
    return null;
  }
}

/**
 * Delete password reset token
 */
export async function deletePasswordResetToken(token: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(`${REDIS_PREFIX}password-reset:${token}`);
  } catch (error) {
    console.error('[AUTH] Error deleting password reset token:', error);
  }
}

/**
 * Check rate limiting for login attempts
 * Returns true if rate limit exceeded
 */
export async function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false; // No rate limiting if Redis unavailable

  try {
    const key = `${REDIS_PREFIX}rate-limit:${ip}`;
    const now = Date.now();

    // Get existing attempts
    const attemptsData = await redis.get(key);
    const attempts: number[] = attemptsData ? JSON.parse(attemptsData) : [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return true; // Rate limit exceeded
    }

    // Add current attempt
    recentAttempts.push(now);

    // Store with TTL
    await redis.setex(key, RATE_LIMIT_TTL, JSON.stringify(recentAttempts));

    return false;
  } catch (error) {
    console.error('[AUTH] Error checking rate limit:', error);
    return false; // Don't block on error
  }
}

/**
 * Clear rate limit for IP (after successful login)
 */
export async function clearRateLimit(ip: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(`${REDIS_PREFIX}rate-limit:${ip}`);
  } catch (error) {
    console.error('[AUTH] Error clearing rate limit:', error);
  }
}

/**
 * Get storage stats (for debugging)
 */
export async function getStorageStats() {
  const redis = getRedis();
  if (!redis) {
    return {
      users: 0,
      sessions: 0,
      passwordResetTokens: 0,
      loginAttempts: 0,
      redisAvailable: false
    };
  }

  try {
    const [userKeys, sessionKeys, resetKeys, rateLimitKeys] = await Promise.all([
      redis.keys(`${REDIS_PREFIX}users:*`),
      redis.keys(`${REDIS_PREFIX}sessions:*`),
      redis.keys(`${REDIS_PREFIX}password-reset:*`),
      redis.keys(`${REDIS_PREFIX}rate-limit:*`)
    ]);

    // Filter out email index keys for user count
    const actualUserKeys = userKeys.filter(key => !key.includes(':email:'));
    // Filter out refresh token keys for session count
    const actualSessionKeys = sessionKeys.filter(key => !key.includes(':refresh:'));

    return {
      users: actualUserKeys.length,
      sessions: actualSessionKeys.length,
      passwordResetTokens: resetKeys.length,
      loginAttempts: rateLimitKeys.length,
      redisAvailable: true
    };
  } catch (error) {
    console.error('[AUTH] Error getting storage stats:', error);
    return {
      users: 0,
      sessions: 0,
      passwordResetTokens: 0,
      loginAttempts: 0,
      redisAvailable: false
    };
  }
}
