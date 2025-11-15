import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getRedis } from '@/lib/redis';
import { randomBytes } from 'crypto';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'rawgle-dev-secret-key-change-in-production';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'rawgle-admin-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // 24 hours for admin sessions
const BCRYPT_ROUNDS = 10;

// Admin Roles
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

// Admin User Interface
export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// Public Admin User (without sensitive data)
export interface PublicAdminUser {
  id: string;
  email: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLoginAt?: string;
  permissions: AdminPermissions;
}

// Admin Permissions Interface
export interface AdminPermissions {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean;
  fullAccess: boolean;
}

// JWT Payload Interface
export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

/**
 * Hash a password using bcrypt with 10 rounds
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('[Admin Auth] Password hashing failed:', error);
    throw new Error('Password hashing failed');
  }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('[Admin Auth] Password verification failed:', error);
    return false;
  }
}

/**
 * Generate a JWT token for admin authentication
 */
export function generateAdminToken(adminUser: AdminUser | PublicAdminUser): string {
  try {
    const payload: AdminTokenPayload = {
      adminId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    return jwt.sign(payload, ADMIN_JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'rawgle-admin',
      audience: 'rawgle-cms',
    });
  } catch (error) {
    console.error('[Admin Auth] Token generation failed:', error);
    throw new Error('Token generation failed');
  }
}

/**
 * Verify and decode a JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET, {
      issuer: 'rawgle-admin',
      audience: 'rawgle-cms',
    }) as AdminTokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.warn('[Admin Auth] Invalid token:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.warn('[Admin Auth] Token expired');
    }
    return null;
  }
}

/**
 * Get admin permissions based on role
 */
export function getAdminPermissions(role: AdminRole): AdminPermissions {
  switch (role) {
    case 'super_admin':
      return {
        canManageUsers: true,
        canManageContent: true,
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageSettings: true,
        canManageAdmins: true,
        fullAccess: true,
      };

    case 'admin':
      return {
        canManageUsers: true,
        canManageContent: true,
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageSettings: false,
        canManageAdmins: false,
        fullAccess: false,
      };

    case 'editor':
      return {
        canManageUsers: false,
        canManageContent: true,
        canManageProducts: false,
        canManageOrders: false,
        canViewAnalytics: false,
        canManageSettings: false,
        canManageAdmins: false,
        fullAccess: false,
      };

    case 'viewer':
      return {
        canManageUsers: false,
        canManageContent: false,
        canManageProducts: false,
        canManageOrders: false,
        canViewAnalytics: true,
        canManageSettings: false,
        canManageAdmins: false,
        fullAccess: false,
      };

    default:
      return {
        canManageUsers: false,
        canManageContent: false,
        canManageProducts: false,
        canManageOrders: false,
        canViewAnalytics: false,
        canManageSettings: false,
        canManageAdmins: false,
        fullAccess: false,
      };
  }
}

/**
 * Check if an admin has specific permissions
 */
export function checkAdminPermissions(
  role: AdminRole,
  requiredPermission: keyof AdminPermissions
): boolean {
  const permissions = getAdminPermissions(role);

  // Super admin always has access
  if (permissions.fullAccess) {
    return true;
  }

  return permissions[requiredPermission] === true;
}

/**
 * Validate admin permission for a specific action
 */
export function validateAdminPermission(
  role: AdminRole,
  requiredPermission: keyof AdminPermissions
): { allowed: boolean; message?: string } {
  const allowed = checkAdminPermissions(role, requiredPermission);

  if (!allowed) {
    return {
      allowed: false,
      message: `Insufficient permissions. Required: ${requiredPermission}`,
    };
  }

  return { allowed: true };
}

/**
 * Store admin user in Redis
 */
export async function storeAdminUser(adminUser: AdminUser): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('[Admin Auth] Redis not available');
      return false;
    }

    const key = `admin:users:${adminUser.email}`;
    await redis.set(key, JSON.stringify(adminUser));

    // Also store by ID for quick lookups
    const idKey = `admin:users:id:${adminUser.id}`;
    await redis.set(idKey, adminUser.email);

    console.log(`[Admin Auth] Admin user stored: ${adminUser.email}`);
    return true;
  } catch (error) {
    console.error('[Admin Auth] Failed to store admin user:', error);
    return false;
  }
}

/**
 * Get admin user from Redis by email
 */
export async function getAdminUser(email: string): Promise<AdminUser | null> {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('[Admin Auth] Redis not available');
      return null;
    }

    const key = `admin:users:${email}`;
    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as AdminUser;
  } catch (error) {
    console.error('[Admin Auth] Failed to get admin user:', error);
    return null;
  }
}

/**
 * Get admin user from Redis by ID
 */
export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('[Admin Auth] Redis not available');
      return null;
    }

    // First get email from ID
    const idKey = `admin:users:id:${id}`;
    const email = await redis.get(idKey);

    if (!email) {
      return null;
    }

    return getAdminUser(email);
  } catch (error) {
    console.error('[Admin Auth] Failed to get admin user by ID:', error);
    return null;
  }
}

/**
 * Update admin last login time
 */
export async function updateAdminLastLogin(email: string): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) {
      return false;
    }

    const adminUser = await getAdminUser(email);
    if (!adminUser) {
      return false;
    }

    adminUser.lastLoginAt = new Date().toISOString();
    adminUser.updatedAt = new Date().toISOString();

    return await storeAdminUser(adminUser);
  } catch (error) {
    console.error('[Admin Auth] Failed to update last login:', error);
    return false;
  }
}

/**
 * Invalidate admin token in Redis (for logout)
 */
export async function invalidateAdminToken(token: string): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) {
      return false;
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return false;
    }

    // Store token in blacklist with TTL matching token expiry
    const key = `admin:blacklist:${token}`;
    const expiryTime = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 86400;

    await redis.setex(key, expiryTime, '1');
    console.log(`[Admin Auth] Token invalidated for admin: ${payload.email}`);

    return true;
  } catch (error) {
    console.error('[Admin Auth] Failed to invalidate token:', error);
    return false;
  }
}

/**
 * Check if token is blacklisted
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) {
      return false;
    }

    const key = `admin:blacklist:${token}`;
    const result = await redis.get(key);

    return result !== null;
  } catch (error) {
    console.error('[Admin Auth] Failed to check token blacklist:', error);
    return false;
  }
}

/**
 * Strip sensitive data from admin user
 */
export function toPublicAdminUser(adminUser: AdminUser): PublicAdminUser {
  return {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
    createdAt: adminUser.createdAt,
    lastLoginAt: adminUser.lastLoginAt,
    permissions: getAdminPermissions(adminUser.role),
  };
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomBytesBuffer = randomBytes(length);
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars[randomBytesBuffer[i] % chars.length];
  }

  // Ensure password meets complexity requirements
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    // Regenerate if doesn't meet requirements
    return generateSecurePassword(length);
  }

  return password;
}

/**
 * Generate a unique admin ID
 */
export function generateAdminId(): string {
  return `admin_${Date.now()}_${randomBytes(8).toString('hex')}`;
}

/**
 * Initialize default super admin user
 */
export async function initializeDefaultAdmin(): Promise<{ email: string; password: string } | null> {
  try {
    const email = 'admin@rawgle.com';

    // Check if admin already exists
    const existingAdmin = await getAdminUser(email);
    if (existingAdmin) {
      console.log('[Admin Auth] Default admin already exists');
      return null;
    }

    // Generate secure random password
    const password = generateSecurePassword(20);
    const passwordHash = await hashPassword(password);

    const defaultAdmin: AdminUser = {
      id: generateAdminId(),
      email,
      passwordHash,
      role: 'super_admin',
      firstName: 'Super',
      lastName: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    const success = await storeAdminUser(defaultAdmin);

    if (success) {
      console.log('\n========================================');
      console.log('🔐 DEFAULT ADMIN CREATED');
      console.log('========================================');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('========================================');
      console.log('⚠️  SAVE THIS PASSWORD SECURELY!');
      console.log('⚠️  It will not be shown again!');
      console.log('========================================\n');

      return { email, password };
    }

    return null;
  } catch (error) {
    console.error('[Admin Auth] Failed to initialize default admin:', error);
    return null;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}
