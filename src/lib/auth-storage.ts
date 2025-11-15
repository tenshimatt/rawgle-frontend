import { User, Session, PasswordResetToken, hashPassword } from './jwt-auth';
import { getRedis, isRedisAvailable } from './redis';

// Fallback in-memory storage when Redis is unavailable
const usersStoreFallback = new Map<string, User>();
const sessionsStoreFallback = new Map<string, Session>();
const passwordResetTokensStoreFallback = new Map<string, PasswordResetToken>();
const loginAttemptsStoreFallback = new Map<string, number[]>();

// Redis key prefixes
const REDIS_KEYS = {
  USER_BY_ID: (userId: string) => `auth:users:${userId}`,
  USER_BY_EMAIL: (email: string) => `auth:users:email:${email.toLowerCase()}`,
  SESSION_BY_TOKEN: (token: string) => `auth:sessions:${token}`,
  SESSION_BY_REFRESH: (refreshToken: string) => `auth:sessions:refresh:${refreshToken}`,
  PASSWORD_RESET: (token: string) => `auth:password-reset:${token}`,
  RATE_LIMIT: (ip: string) => `auth:rate-limit:${ip}`,
};

/**
 * Initialize demo user in Redis
 */
async function initializeDemoUser() {
  const demoUserId = 'user_demo_001';
  const demoEmail = 'demo@rawgle.com';

  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      // Check if demo user already exists
      const existing = await redis.get(REDIS_KEYS.USER_BY_ID(demoUserId));

      if (!existing) {
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

        // Store user by ID and email
        await redis.set(REDIS_KEYS.USER_BY_ID(demoUserId), JSON.stringify(demoUser));
        await redis.set(REDIS_KEYS.USER_BY_EMAIL(demoEmail), JSON.stringify(demoUser));

        console.log('[AUTH] Demo user initialized in Redis - Email: demo@rawgle.com, Password: Demo1234');
      }
    } catch (error) {
      console.error('[AUTH] Failed to initialize demo user in Redis:', error);
    }
  } else {
    // Fallback to in-memory
    if (!usersStoreFallback.has(demoUserId)) {
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

      usersStoreFallback.set(demoUserId, demoUser);
      usersStoreFallback.set(demoEmail, demoUser);

      console.log('[AUTH] Demo user initialized in-memory - Email: demo@rawgle.com, Password: Demo1234');
    }
  }
}

// Initialize demo user immediately
initializeDemoUser().catch(console.error);

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(REDIS_KEYS.USER_BY_ID(userId));
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('[AUTH] Redis getUserById failed:', error);
      return usersStoreFallback.get(userId);
    }
  }

  return usersStoreFallback.get(userId);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(REDIS_KEYS.USER_BY_EMAIL(email));
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('[AUTH] Redis getUserByEmail failed:', error);
      return usersStoreFallback.get(email);
    }
  }

  return usersStoreFallback.get(email);
}

/**
 * Create a new user
 */
export async function createUser(user: User): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(REDIS_KEYS.USER_BY_ID(user.id), JSON.stringify(user));
      await redis.set(REDIS_KEYS.USER_BY_EMAIL(user.email), JSON.stringify(user));
      console.log(`[AUTH] User created in Redis: ${user.email} (${user.id})`);
      return;
    } catch (error) {
      console.error('[AUTH] Redis createUser failed:', error);
    }
  }

  // Fallback
  usersStoreFallback.set(user.id, user);
  usersStoreFallback.set(user.email, user);
  console.log(`[AUTH] User created in-memory: ${user.email} (${user.id})`);
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }

  const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.set(REDIS_KEYS.USER_BY_ID(userId), JSON.stringify(updatedUser));
      await redis.set(REDIS_KEYS.USER_BY_EMAIL(user.email), JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('[AUTH] Redis updateUser failed:', error);
    }
  }

  // Fallback
  usersStoreFallback.set(userId, updatedUser);
  usersStoreFallback.set(user.email, updatedUser);
  return updatedUser;
}

/**
 * Create a new session
 */
export async function createSession(session: Session): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const ttl = 60 * 60 * 24 * 30; // 30 days
      await redis.set(REDIS_KEYS.SESSION_BY_TOKEN(session.token), JSON.stringify(session), 'EX', ttl);
      await redis.set(REDIS_KEYS.SESSION_BY_REFRESH(session.refreshToken), JSON.stringify(session), 'EX', ttl);
      console.log(`[AUTH] Session created in Redis for user: ${session.userId}`);
      return;
    } catch (error) {
      console.error('[AUTH] Redis createSession failed:', error);
    }
  }

  // Fallback
  sessionsStoreFallback.set(session.token, session);
  sessionsStoreFallback.set(session.refreshToken, session);
  console.log(`[AUTH] Session created in-memory for user: ${session.userId}`);
}

/**
 * Get session by token
 */
export async function getSessionByToken(token: string): Promise<Session | undefined> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(REDIS_KEYS.SESSION_BY_TOKEN(token));
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('[AUTH] Redis getSessionByToken failed:', error);
      return sessionsStoreFallback.get(token);
    }
  }

  return sessionsStoreFallback.get(token);
}

/**
 * Get session by refresh token
 */
export async function getSessionByRefreshToken(refreshToken: string): Promise<Session | undefined> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(REDIS_KEYS.SESSION_BY_REFRESH(refreshToken));
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('[AUTH] Redis getSessionByRefreshToken failed:', error);
      return sessionsStoreFallback.get(refreshToken);
    }
  }

  return sessionsStoreFallback.get(refreshToken);
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const session = await getSessionByToken(token);
      if (session) {
        await redis.del(REDIS_KEYS.SESSION_BY_TOKEN(token));
        await redis.del(REDIS_KEYS.SESSION_BY_REFRESH(session.refreshToken));
        console.log(`[AUTH] Session deleted from Redis for user: ${session.userId}`);
      }
      return;
    } catch (error) {
      console.error('[AUTH] Redis deleteSession failed:', error);
    }
  }

  // Fallback
  const session = sessionsStoreFallback.get(token);
  if (session) {
    sessionsStoreFallback.delete(token);
    sessionsStoreFallback.delete(session.refreshToken);
    console.log(`[AUTH] Session deleted from memory for user: ${session.userId}`);
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      // Scan for all session keys
      const keys = await redis.keys('auth:sessions:*');
      const sessionsToDelete: string[] = [];

      for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
          const session = JSON.parse(data) as Session;
          if (session.userId === userId) {
            sessionsToDelete.push(key);
          }
        }
      }

      if (sessionsToDelete.length > 0) {
        await redis.del(...sessionsToDelete);
        console.log(`[AUTH] All sessions deleted from Redis for user: ${userId}`);
      }
      return;
    } catch (error) {
      console.error('[AUTH] Redis deleteAllUserSessions failed:', error);
    }
  }

  // Fallback
  const sessionsToDelete: string[] = [];
  sessionsStoreFallback.forEach((session, key) => {
    if (session.userId === userId) {
      sessionsToDelete.push(key);
    }
  });
  sessionsToDelete.forEach(key => sessionsStoreFallback.delete(key));
  console.log(`[AUTH] All sessions deleted from memory for user: ${userId}`);
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(resetToken: PasswordResetToken): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const ttl = 60 * 60; // 1 hour
      await redis.set(REDIS_KEYS.PASSWORD_RESET(resetToken.token), JSON.stringify(resetToken), 'EX', ttl);
      console.log(`[AUTH] Password reset token created in Redis for user: ${resetToken.userId}`);
      return;
    } catch (error) {
      console.error('[AUTH] Redis createPasswordResetToken failed:', error);
    }
  }

  // Fallback
  passwordResetTokensStoreFallback.set(resetToken.token, resetToken);
  console.log(`[AUTH] Password reset token created in-memory for user: ${resetToken.userId}`);
}

/**
 * Get password reset token
 */
export async function getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const data = await redis.get(REDIS_KEYS.PASSWORD_RESET(token));
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('[AUTH] Redis getPasswordResetToken failed:', error);
      return passwordResetTokensStoreFallback.get(token);
    }
  }

  return passwordResetTokensStoreFallback.get(token);
}

/**
 * Delete password reset token
 */
export async function deletePasswordResetToken(token: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.del(REDIS_KEYS.PASSWORD_RESET(token));
      return;
    } catch (error) {
      console.error('[AUTH] Redis deletePasswordResetToken failed:', error);
    }
  }

  // Fallback
  passwordResetTokensStoreFallback.delete(token);
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
  const now = Date.now();

  if (redis && isRedisAvailable()) {
    try {
      const key = REDIS_KEYS.RATE_LIMIT(ip);
      const data = await redis.get(key);
      const attempts: number[] = data ? JSON.parse(data) : [];

      // Remove old attempts outside the window
      const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

      if (recentAttempts.length >= maxAttempts) {
        return true; // Rate limit exceeded
      }

      // Add current attempt
      recentAttempts.push(now);
      await redis.set(key, JSON.stringify(recentAttempts), 'EX', Math.ceil(windowMs / 1000));

      return false;
    } catch (error) {
      console.error('[AUTH] Redis checkRateLimit failed:', error);
    }
  }

  // Fallback
  const attempts = loginAttemptsStoreFallback.get(ip) || [];
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return true;
  }

  recentAttempts.push(now);
  loginAttemptsStoreFallback.set(ip, recentAttempts);
  return false;
}

/**
 * Clear rate limit for IP (after successful login)
 */
export async function clearRateLimit(ip: string): Promise<void> {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      await redis.del(REDIS_KEYS.RATE_LIMIT(ip));
      return;
    } catch (error) {
      console.error('[AUTH] Redis clearRateLimit failed:', error);
    }
  }

  // Fallback
  loginAttemptsStoreFallback.delete(ip);
}

/**
 * Clean up expired sessions (Redis handles TTL automatically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  // Redis handles expiration with TTL, but we'll clean up fallback storage
  const now = new Date().toISOString();
  const tokensToDelete: string[] = [];

  sessionsStoreFallback.forEach((session, token) => {
    if (session.expiresAt < now) {
      tokensToDelete.push(token);
      tokensToDelete.push(session.refreshToken);
    }
  });

  tokensToDelete.forEach(token => sessionsStoreFallback.delete(token));

  if (tokensToDelete.length > 0) {
    console.log(`[AUTH] Cleaned up ${tokensToDelete.length / 2} expired sessions from fallback`);
  }
}

/**
 * Clean up expired password reset tokens (Redis handles TTL automatically)
 */
export async function cleanupExpiredPasswordResetTokens(): Promise<void> {
  // Redis handles expiration with TTL, but we'll clean up fallback storage
  const now = new Date().toISOString();
  const tokensToDelete: string[] = [];

  passwordResetTokensStoreFallback.forEach((resetToken, token) => {
    if (resetToken.expiresAt < now) {
      tokensToDelete.push(token);
    }
  });

  tokensToDelete.forEach(token => passwordResetTokensStoreFallback.delete(token));

  if (tokensToDelete.length > 0) {
    console.log(`[AUTH] Cleaned up ${tokensToDelete.length} expired password reset tokens from fallback`);
  }
}

// Set up cleanup intervals (run every hour)
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
setInterval(cleanupExpiredPasswordResetTokens, 60 * 60 * 1000);

/**
 * Get storage stats (for debugging)
 */
export async function getStorageStats() {
  const redis = getRedis();

  if (redis && isRedisAvailable()) {
    try {
      const userKeys = await redis.keys('auth:users:user_*');
      const sessionKeys = await redis.keys('auth:sessions:*');
      const resetKeys = await redis.keys('auth:password-reset:*');
      const rateLimitKeys = await redis.keys('auth:rate-limit:*');

      return {
        users: userKeys.length,
        sessions: Math.floor(sessionKeys.length / 2), // Divided by 2 (token + refresh token)
        passwordResetTokens: resetKeys.length,
        loginAttempts: rateLimitKeys.length,
        storage: 'redis'
      };
    } catch (error) {
      console.error('[AUTH] Failed to get Redis stats:', error);
    }
  }

  return {
    users: Math.floor(usersStoreFallback.size / 2),
    sessions: Math.floor(sessionsStoreFallback.size / 2),
    passwordResetTokens: passwordResetTokensStoreFallback.size,
    loginAttempts: loginAttemptsStoreFallback.size,
    storage: 'memory'
  };
}
