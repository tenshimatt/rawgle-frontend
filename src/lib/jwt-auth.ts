import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'rawgle-dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// User roles
export type UserRole = 'guest' | 'user' | 'premium' | 'vet' | 'supplier' | 'admin';

// User interface
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

// Session interface
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Public user data (without sensitive fields)
export interface PublicUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  emailVerified: boolean;
}

// Password reset token
export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

/**
 * Hash a password using bcrypt (12 rounds as specified)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token (simple implementation without external libraries)
 */
export function generateToken(payload: any, expiresIn: number = JWT_EXPIRES_IN): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Date.now();
  const tokenPayload = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + expiresIn) / 1000)
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a random token (for refresh tokens and password reset)
 */
export function generateRandomToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Extract user from request (from Authorization header or cookie)
 */
export function getUserFromRequest(req: NextRequest): any | null {
  // Try Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Try cookie
  const cookieToken = req.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

/**
 * Strip sensitive data from user object
 */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified
  };
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
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
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

// Helper functions for JWT
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function sign(data: string, secret: string): string {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export { JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN };
