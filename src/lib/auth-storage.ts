import { User, Session, PasswordResetToken, hashPassword } from './jwt-auth';

// In-memory storage (Map-based like cart and pets APIs)
export const usersStore = new Map<string, User>();
export const sessionsStore = new Map<string, Session>();
export const passwordResetTokensStore = new Map<string, PasswordResetToken>();

// Rate limiting storage (IP -> array of attempt timestamps)
export const loginAttemptsStore = new Map<string, number[]>();

/**
 * Initialize demo user
 */
async function initializeDemoUser() {
  const demoUserId = 'user_demo_001';

  if (!usersStore.has(demoUserId)) {
    const demoUser: User = {
      id: demoUserId,
      email: 'demo@rawgle.com',
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

    usersStore.set(demoUserId, demoUser);
    usersStore.set(demoUser.email, demoUser); // Also index by email for lookup

    console.log('[AUTH] Demo user initialized - Email: demo@rawgle.com, Password: Demo1234');
  }
}

// Initialize demo user immediately
initializeDemoUser().catch(console.error);

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | undefined {
  return usersStore.get(userId);
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  return usersStore.get(email);
}

/**
 * Create a new user
 */
export function createUser(user: User): void {
  usersStore.set(user.id, user);
  usersStore.set(user.email, user); // Index by email too
  console.log(`[AUTH] User created: ${user.email} (${user.id})`);
}

/**
 * Update user
 */
export function updateUser(userId: string, updates: Partial<User>): User | null {
  const user = usersStore.get(userId);
  if (!user) {
    return null;
  }

  const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
  usersStore.set(userId, updatedUser);
  usersStore.set(user.email, updatedUser); // Update email index

  return updatedUser;
}

/**
 * Create a new session
 */
export function createSession(session: Session): void {
  sessionsStore.set(session.token, session);
  sessionsStore.set(session.refreshToken, session);
  console.log(`[AUTH] Session created for user: ${session.userId}`);
}

/**
 * Get session by token
 */
export function getSessionByToken(token: string): Session | undefined {
  return sessionsStore.get(token);
}

/**
 * Get session by refresh token
 */
export function getSessionByRefreshToken(refreshToken: string): Session | undefined {
  return sessionsStore.get(refreshToken);
}

/**
 * Delete session (logout)
 */
export function deleteSession(token: string): void {
  const session = sessionsStore.get(token);
  if (session) {
    sessionsStore.delete(token);
    sessionsStore.delete(session.refreshToken);
    console.log(`[AUTH] Session deleted for user: ${session.userId}`);
  }
}

/**
 * Delete all sessions for a user
 */
export function deleteAllUserSessions(userId: string): void {
  const sessionsToDelete: string[] = [];

  sessionsStore.forEach((session, key) => {
    if (session.userId === userId) {
      sessionsToDelete.push(key);
    }
  });

  sessionsToDelete.forEach(key => sessionsStore.delete(key));
  console.log(`[AUTH] All sessions deleted for user: ${userId}`);
}

/**
 * Create password reset token
 */
export function createPasswordResetToken(resetToken: PasswordResetToken): void {
  passwordResetTokensStore.set(resetToken.token, resetToken);
  console.log(`[AUTH] Password reset token created for user: ${resetToken.userId}`);
}

/**
 * Get password reset token
 */
export function getPasswordResetToken(token: string): PasswordResetToken | undefined {
  return passwordResetTokensStore.get(token);
}

/**
 * Delete password reset token
 */
export function deletePasswordResetToken(token: string): void {
  passwordResetTokensStore.delete(token);
}

/**
 * Check rate limiting for login attempts
 * Returns true if rate limit exceeded
 */
export function checkRateLimit(ip: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const attempts = loginAttemptsStore.get(ip) || [];

  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return true; // Rate limit exceeded
  }

  // Add current attempt
  recentAttempts.push(now);
  loginAttemptsStore.set(ip, recentAttempts);

  return false;
}

/**
 * Clear rate limit for IP (after successful login)
 */
export function clearRateLimit(ip: string): void {
  loginAttemptsStore.delete(ip);
}

/**
 * Clean up expired sessions (should be called periodically)
 */
export function cleanupExpiredSessions(): void {
  const now = new Date().toISOString();
  const tokensToDelete: string[] = [];

  sessionsStore.forEach((session, token) => {
    if (session.expiresAt < now) {
      tokensToDelete.push(token);
      tokensToDelete.push(session.refreshToken);
    }
  });

  tokensToDelete.forEach(token => sessionsStore.delete(token));

  if (tokensToDelete.length > 0) {
    console.log(`[AUTH] Cleaned up ${tokensToDelete.length / 2} expired sessions`);
  }
}

/**
 * Clean up expired password reset tokens
 */
export function cleanupExpiredPasswordResetTokens(): void {
  const now = new Date().toISOString();
  const tokensToDelete: string[] = [];

  passwordResetTokensStore.forEach((resetToken, token) => {
    if (resetToken.expiresAt < now) {
      tokensToDelete.push(token);
    }
  });

  tokensToDelete.forEach(token => passwordResetTokensStore.delete(token));

  if (tokensToDelete.length > 0) {
    console.log(`[AUTH] Cleaned up ${tokensToDelete.length} expired password reset tokens`);
  }
}

// Set up cleanup intervals (run every hour)
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
setInterval(cleanupExpiredPasswordResetTokens, 60 * 60 * 1000);

// Export for testing/debugging
export function getStorageStats() {
  return {
    users: usersStore.size / 2, // Divided by 2 because we index by both id and email
    sessions: sessionsStore.size / 2, // Divided by 2 because we index by both token and refresh token
    passwordResetTokens: passwordResetTokensStore.size,
    loginAttempts: loginAttemptsStore.size
  };
}
