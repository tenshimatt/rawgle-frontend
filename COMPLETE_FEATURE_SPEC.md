# RAWGLE Platform - Complete Feature Specification & Build Plan
**Version**: 2.0
**Status**: Implementation Ready
**Total Lines**: 30,000+ (comprehensive)
**Purpose**: Exhaustive technical specification for building all missing features

---

## TABLE OF CONTENTS

1. [Authentication & Authorization System](#1-authentication--authorization-system)
2. [Database Architecture & Migration](#2-database-architecture--migration)
3. [Admin Dashboard & CMS](#3-admin-dashboard--cms)
4. [User Profile & Settings](#4-user-profile--settings)
5. [Notification System](#5-notification-system)
6. [Email Service Integration](#6-email-service-integration)
7. [Cost Calculator](#7-cost-calculator)
8. [Meal Calendar](#8-meal-calendar)
9. [Symptom Checker](#9-symptom-checker)
10. [Recommendations Engine](#10-recommendations-engine)
11. [Vet Network Integration](#11-vet-network-integration)
12. [Video & Course System](#12-video--course-system)
13. [Blog/Article CMS](#13-blogarticle-cms)
14. [Success Stories Management](#14-success-stories-management)
15. [Mentorship Program](#15-mentorship-program)
16. [Challenges & Gamification](#16-challenges--gamification)
17. [Direct Messaging System](#17-direct-messaging-system)
18. [Export & Reporting](#18-export--reporting)
19. [Wishlist Management](#19-wishlist-management)
20. [Batch Operations](#20-batch-operations)
21. [Webhook & Event System](#21-webhook--event-system)
22. [Store Locator Integration](#22-store-locator-integration)
23. [Social Share Enhancement](#23-social-share-enhancement)
24. [Glossary & Reference](#24-glossary--reference)
25. [Breed-Specific Guides](#25-breed-specific-guides)
26. [Supplements Database](#26-supplements-database)
27. [Real-time Features](#27-real-time-features)
28. [Mobile App Preparation](#28-mobile-app-preparation)
29. [Analytics & Insights](#29-analytics--insights)
30. [Testing & Quality Assurance](#30-testing--quality-assurance)

---

## 1. AUTHENTICATION & AUTHORIZATION SYSTEM

### 1.1 Overview
Replace hardcoded `demo-user` with full JWT-based authentication system supporting multiple user roles, OAuth providers, and secure session management.

### 1.2 User Roles & Permissions

#### Role Hierarchy
```typescript
enum UserRole {
  GUEST = 'guest',           // Unauthenticated users (read-only)
  USER = 'user',             // Standard registered users
  PREMIUM = 'premium',       // Paid subscription users
  VET = 'vet',              // Verified veterinarians
  SUPPLIER = 'supplier',     // Raw food suppliers
  MENTOR = 'mentor',         // Community mentors
  MODERATOR = 'moderator',   // Content moderators
  ADMIN = 'admin',          // Platform administrators
  SUPER_ADMIN = 'super_admin' // Full system access
}

interface Permission {
  resource: string;          // 'pets', 'posts', 'users', etc.
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  condition?: (user: User, resource: any) => boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    { resource: 'posts', action: 'read' },
    { resource: 'recipes', action: 'read' },
    { resource: 'education', action: 'read' },
    { resource: 'suppliers', action: 'read' }
  ],
  [UserRole.USER]: [
    { resource: 'pets', action: 'create' },
    { resource: 'pets', action: 'read', condition: (user, pet) => pet.userId === user.id },
    { resource: 'pets', action: 'update', condition: (user, pet) => pet.userId === user.id },
    { resource: 'pets', action: 'delete', condition: (user, pet) => pet.userId === user.id },
    { resource: 'posts', action: 'create' },
    { resource: 'posts', action: 'update', condition: (user, post) => post.userId === user.id },
    { resource: 'posts', action: 'delete', condition: (user, post) => post.userId === user.id },
    { resource: 'feeding', action: 'manage', condition: (user, record) => record.userId === user.id },
    { resource: 'health', action: 'manage', condition: (user, record) => record.userId === user.id },
    { resource: 'cart', action: 'manage' },
    { resource: 'orders', action: 'read' }
  ],
  [UserRole.PREMIUM]: [
    // All USER permissions plus:
    { resource: 'ai-chat', action: 'create' }, // Unlimited AI chat
    { resource: 'courses', action: 'read' },   // Access to premium courses
    { resource: 'export', action: 'create' },  // Export health reports
    { resource: 'analytics', action: 'read' }  // Advanced analytics
  ],
  [UserRole.VET]: [
    // All USER permissions plus:
    { resource: 'consultations', action: 'manage' },
    { resource: 'prescriptions', action: 'create' },
    { resource: 'health-records', action: 'read' } // With user permission
  ],
  [UserRole.SUPPLIER]: [
    { resource: 'products', action: 'manage' },
    { resource: 'orders', action: 'read' },
    { resource: 'inventory', action: 'manage' }
  ],
  [UserRole.MODERATOR]: [
    { resource: 'posts', action: 'delete' },
    { resource: 'comments', action: 'delete' },
    { resource: 'users', action: 'read' },
    { resource: 'reports', action: 'manage' }
  ],
  [UserRole.ADMIN]: [
    { resource: '*', action: 'manage' } // Full access to all resources
  ]
};
```

### 1.3 Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('guest', 'user', 'premium', 'vet', 'supplier', 'mentor', 'moderator', 'admin', 'super_admin')),
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  language VARCHAR(10) DEFAULT 'en',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),

  -- Subscription
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  subscription_auto_renew BOOLEAN DEFAULT true,

  -- Verification
  vet_verified BOOLEAN DEFAULT false,
  vet_license_number VARCHAR(100),
  vet_clinic_name VARCHAR(200),
  supplier_verified BOOLEAN DEFAULT false,
  supplier_business_name VARCHAR(200),
  supplier_tax_id VARCHAR(50),

  -- Security
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  backup_codes TEXT[], -- Array of backup codes
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,

  -- Tracking
  last_login_at TIMESTAMP,
  last_login_ip INET,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Preferences
  preferences JSONB DEFAULT '{
    "notifications": {
      "email": true,
      "push": true,
      "sms": false,
      "feeding_reminders": true,
      "health_alerts": true,
      "community_updates": false,
      "marketing": false
    },
    "privacy": {
      "profile_visibility": "public",
      "show_email": false,
      "show_phone": false,
      "allow_messages": true
    },
    "display": {
      "theme": "light",
      "units": "imperial",
      "currency": "USD"
    }
  }'::jsonb,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  refresh_token VARCHAR(500) UNIQUE,
  device_name VARCHAR(100),
  device_type VARCHAR(50), -- 'mobile', 'desktop', 'tablet'
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  refresh_expires_at TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,

  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_revoked_at ON sessions(revoked_at);
```

#### Password Reset Tokens
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

#### Email Verification Tokens
```sql
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
```

#### OAuth Connections
```sql
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'apple', 'facebook'
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  scope TEXT,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_connections_user_id ON oauth_connections(user_id);
CREATE INDEX idx_oauth_connections_provider ON oauth_connections(provider);
```

#### Audit Log
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'register', 'password_change', etc.
  resource_type VARCHAR(100), -- 'user', 'pet', 'post', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

### 1.4 API Endpoints

#### POST /api/auth/register
```typescript
// Request
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

// Response
interface RegisterResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
      role: UserRole;
      emailVerified: boolean;
    };
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
  error?: string;
  validationErrors?: Record<string, string[]>;
}

// Implementation
export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequest = await req.json();

    // Validation
    const errors: Record<string, string[]> = {};

    if (!body.email || !isValidEmail(body.email)) {
      errors.email = ['Invalid email address'];
    }

    if (!body.password || body.password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    }

    if (body.password !== body.confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }

    if (!body.username || body.username.length < 3) {
      errors.username = ['Username must be at least 3 characters'];
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(body.username)) {
      errors.username = ['Username can only contain letters, numbers, underscores, and hyphens'];
    }

    if (!body.acceptTerms) {
      errors.acceptTerms = ['You must accept the terms of service'];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, validationErrors: errors },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [body.email.toLowerCase()]
    );

    if (existingEmail.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [body.username.toLowerCase()]
    );

    if (existingUsername.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(body.password, 12);

    // Create user
    const result = await db.query(`
      INSERT INTO users (
        email,
        password_hash,
        username,
        first_name,
        last_name,
        preferences
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, username, role, created_at
    `, [
      body.email.toLowerCase(),
      passwordHash,
      body.username.toLowerCase(),
      body.firstName,
      body.lastName,
      JSON.stringify({
        notifications: {
          marketing: body.marketingConsent || false
        }
      })
    ]);

    const user = result.rows[0];

    // Generate tokens
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    );

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(`
      INSERT INTO sessions (
        user_id,
        token,
        refresh_token,
        expires_at,
        refresh_expires_at,
        ip_address,
        user_agent,
        device_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      user.id,
      token,
      refreshToken,
      expiresAt,
      refreshExpiresAt,
      req.ip,
      req.headers.get('user-agent'),
      getDeviceType(req.headers.get('user-agent'))
    ]);

    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.query(`
      INSERT INTO email_verification_tokens (
        user_id,
        email,
        token,
        expires_at
      )
      VALUES ($1, $2, $3, $4)
    `, [user.id, user.email, verificationToken, verificationExpiry]);

    // Send verification email (async, don't wait)
    sendVerificationEmail(user.email, verificationToken).catch(console.error);

    // Log audit event
    await db.query(`
      INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
      VALUES ($1, 'register', $2, $3)
    `, [user.id, req.ip, req.headers.get('user-agent')]);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          emailVerified: false
        },
        token,
        refreshToken,
        expiresAt: expiresAt.toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

#### POST /api/auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceName?: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: UserProfile;
    token: string;
    refreshToken: string;
    expiresAt: string;
    twoFactorRequired?: boolean;
    twoFactorToken?: string;
  };
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();

    // Rate limiting check
    const rateLimitKey = `login:${req.ip}`;
    const attempts = await rateLimit.check(rateLimitKey, 5, 15 * 60); // 5 attempts per 15 min

    if (!attempts.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Try again in ${Math.ceil(attempts.resetIn / 60)} minutes.`
        },
        { status: 429 }
      );
    }

    // Find user
    const result = await db.query(`
      SELECT
        id,
        email,
        password_hash,
        username,
        role,
        status,
        two_factor_enabled,
        failed_login_attempts,
        locked_until,
        first_name,
        last_name,
        avatar_url
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
    `, [body.email.toLowerCase()]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesRemaining = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Account locked. Try again in ${minutesRemaining} minutes.`
        },
        { status: 423 }
      );
    }

    // Check account status
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: `Account is ${user.status}` },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(body.password, user.password_hash);

    if (!passwordValid) {
      // Increment failed attempts
      const newFailedAttempts = user.failed_login_attempts + 1;
      let lockedUntil = null;

      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }

      await db.query(`
        UPDATE users
        SET
          failed_login_attempts = $1,
          locked_until = $2
        WHERE id = $3
      `, [newFailedAttempts, lockedUntil, user.id]);

      return NextResponse.json(
        {
          success: false,
          error: `Invalid email or password. ${5 - newFailedAttempts} attempts remaining.`
        },
        { status: 401 }
      );
    }

    // Reset failed attempts
    await db.query(`
      UPDATE users
      SET
        failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = NOW(),
        last_login_ip = $1
      WHERE id = $2
    `, [req.ip, user.id]);

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Generate temporary 2FA token
      const twoFactorToken = jwt.sign(
        { userId: user.id, type: '2fa' },
        process.env.JWT_SECRET!,
        { expiresIn: '5m' }
      );

      return NextResponse.json({
        success: true,
        data: {
          twoFactorRequired: true,
          twoFactorToken
        }
      });
    }

    // Generate session tokens
    const expiryDays = body.rememberMe ? 30 : 7;
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: `${expiryDays}d` }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '60d' }
    );

    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // Create session
    await db.query(`
      INSERT INTO sessions (
        user_id,
        token,
        refresh_token,
        device_name,
        device_type,
        expires_at,
        refresh_expires_at,
        ip_address,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      user.id,
      token,
      refreshToken,
      body.deviceName || 'Unknown Device',
      getDeviceType(req.headers.get('user-agent')),
      expiresAt,
      refreshExpiresAt,
      req.ip,
      req.headers.get('user-agent')
    ]);

    // Log audit event
    await db.query(`
      INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata)
      VALUES ($1, 'login', $2, $3, $4)
    `, [
      user.id,
      req.ip,
      req.headers.get('user-agent'),
      JSON.stringify({ deviceName: body.deviceName, rememberMe: body.rememberMe })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatarUrl: user.avatar_url
        },
        token,
        refreshToken,
        expiresAt: expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

#### POST /api/auth/logout
```typescript
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Revoke session
    await db.query(`
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = $1 AND token = $2
    `, [decoded.userId, token]);

    // Log audit event
    await db.query(`
      INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
      VALUES ($1, 'logout', $2, $3)
    `, [decoded.userId, req.ip, req.headers.get('user-agent')]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

#### POST /api/auth/refresh
```typescript
interface RefreshRequest {
  refreshToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check session validity
    const sessionResult = await db.query(`
      SELECT s.*, u.email, u.role, u.status
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.refresh_token = $1
        AND s.revoked_at IS NULL
        AND s.refresh_expires_at > NOW()
        AND u.deleted_at IS NULL
    `, [refreshToken]);

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const session = sessionResult.rows[0];

    if (session.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Account is not active' },
        { status: 403 }
      );
    }

    // Generate new access token
    const newToken = jwt.sign(
      {
        userId: session.user_id,
        email: session.email,
        role: session.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update session
    await db.query(`
      UPDATE sessions
      SET
        token = $1,
        expires_at = $2,
        last_activity_at = NOW()
      WHERE id = $3
    `, [newToken, newExpiresAt, session.id]);

    return NextResponse.json({
      success: true,
      data: {
        token: newToken,
        expiresAt: newExpiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Token refresh failed' },
      { status: 401 }
    );
  }
}
```

### 1.5 Middleware Implementation

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/education',
    '/suppliers'
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(p => path.startsWith(p));

  // Get token from header or cookie
  const token =
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.cookies.get('token')?.value;

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // If has token, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      // Add user info to headers for API routes
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-email', decoded.email);
      requestHeaders.set('x-user-role', decoded.role);

      // Check role-based access
      if (path.startsWith('/admin') && decoded.role !== 'admin' && decoded.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      // Token invalid, clear it
      const response = NextResponse.redirect(new URL('/auth/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### 1.6 Auth Context Provider

```typescript
// src/contexts/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Handle 2FA if required
    if (data.data?.twoFactorRequired) {
      router.push(`/auth/2fa?token=${data.data.twoFactorToken}`);
      return;
    }

    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    setUser(result.data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 2. DATABASE ARCHITECTURE & MIGRATION

### 2.1 Overview
Migrate from in-memory + Vercel KV to Supabase PostgreSQL for persistent, scalable data storage.

### 2.2 Database Selection: Supabase

**Why Supabase:**
- PostgreSQL (battle-tested, ACID compliant)
- Built-in authentication (can replace our JWT system)
- Real-time subscriptions
- Row Level Security (RLS)
- Auto-generated REST API
- File storage integration
- Edge Functions support
- Free tier: 500MB database, 1GB file storage, 2GB bandwidth
- Pricing: $25/month for production tier

### 2.3 Complete Database Schema

#### Core Tables

**pets**
```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(20) NOT NULL CHECK (species IN ('dog', 'cat')),
  breed VARCHAR(100),
  birth_date DATE NOT NULL,
  weight_current DECIMAL(6,2), -- in kg
  weight_unit VARCHAR(10) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),

  -- Physical characteristics
  color VARCHAR(100),
  size VARCHAR(20) CHECK (size IN ('tiny', 'small', 'medium', 'large', 'giant')),
  coat_type VARCHAR(50),

  -- Health
  spayed_neutered BOOLEAN DEFAULT false,
  microchip_number VARCHAR(50),
  allergies TEXT[],
  medical_conditions TEXT[],
  special_needs TEXT,

  -- Profile
  image_url TEXT,
  bio TEXT,
  personality TEXT[],
  activity_level VARCHAR(20) CHECK (activity_level IN ('low', 'moderate', 'high', 'very_high')),

  -- Status
  active BOOLEAN DEFAULT true,
  deceased BOOLEAN DEFAULT false,
  deceased_date DATE,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  CONSTRAINT valid_birth_date CHECK (birth_date <= CURRENT_DATE),
  CONSTRAINT valid_deceased_date CHECK (deceased_date IS NULL OR deceased_date >= birth_date)
);

CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_active ON pets(active) WHERE deleted_at IS NULL;
CREATE INDEX idx_pets_species ON pets(species);
```

**feeding_records**
```sql
CREATE TABLE feeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Timing
  fed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  scheduled_time TIME,

  -- Meal details
  meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'snack'
  total_weight DECIMAL(8,2),
  weight_unit VARCHAR(10) DEFAULT 'g' CHECK (weight_unit IN ('g', 'oz', 'lb', 'kg')),
  calories DECIMAL(8,2),

  -- Ingredients
  ingredients JSONB DEFAULT '[]'::jsonb, -- [{ name, weight, unit, type }]
  supplements JSONB DEFAULT '[]'::jsonb, -- [{ name, amount, unit }]

  -- Tracking
  completed BOOLEAN DEFAULT true,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  notes TEXT,

  -- Behavior
  appetite_rating INTEGER CHECK (appetite_rating >= 1 AND appetite_rating <= 5),
  finished_all BOOLEAN,
  feeding_duration_minutes INTEGER,

  -- Photos
  images TEXT[],

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_feeding_records_pet_id ON feeding_records(pet_id);
CREATE INDEX idx_feeding_records_user_id ON feeding_records(user_id);
CREATE INDEX idx_feeding_records_fed_at ON feeding_records(fed_at DESC);
CREATE INDEX idx_feeding_records_completed ON feeding_records(completed);
```

**health_records**
```sql
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Type
  record_type VARCHAR(50) NOT NULL CHECK (record_type IN (
    'vaccination', 'checkup', 'medication', 'surgery',
    'dental', 'grooming', 'injury', 'illness', 'lab_test',
    'weight', 'temperature', 'symptom'
  )),

  -- Details
  title VARCHAR(200) NOT NULL,
  description TEXT,

  -- Timing
  occurred_at TIMESTAMP NOT NULL,
  next_due_date DATE,

  -- Provider
  vet_name VARCHAR(200),
  vet_clinic VARCHAR(200),
  vet_phone VARCHAR(20),

  -- Medical details
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  dosage TEXT,
  frequency TEXT,
  duration_days INTEGER,

  -- Measurements
  weight DECIMAL(6,2),
  temperature DECIMAL(4,1),
  heart_rate INTEGER,
  blood_pressure VARCHAR(20),

  -- Lab results
  lab_results JSONB,

  -- Files
  documents TEXT[], -- URLs to PDFs, images
  images TEXT[],

  -- Cost
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Reminders
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_days_before INTEGER DEFAULT 7,

  -- Status
  completed BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);
CREATE INDEX idx_health_records_occurred_at ON health_records(occurred_at DESC);
CREATE INDEX idx_health_records_next_due ON health_records(next_due_date) WHERE next_due_date IS NOT NULL;
```

**medications**
```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  name VARCHAR(200) NOT NULL,
  type VARCHAR(50), -- 'tablet', 'liquid', 'injection', 'topical'
  dosage VARCHAR(100) NOT NULL,
  unit VARCHAR(20),

  -- Schedule
  frequency VARCHAR(50) NOT NULL, -- 'once_daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed'
  times_per_day INTEGER,
  administration_times TIME[], -- Specific times to give medication

  -- Duration
  start_date DATE NOT NULL,
  end_date DATE,
  indefinite BOOLEAN DEFAULT false,

  -- Instructions
  instructions TEXT,
  with_food BOOLEAN,

  -- Reminders
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_minutes_before INTEGER DEFAULT 30,

  -- Provider
  prescribed_by VARCHAR(200),
  prescription_number VARCHAR(100),
  refills_remaining INTEGER,

  -- Tracking
  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medications_pet_id ON medications(pet_id);
CREATE INDEX idx_medications_active ON medications(active);
CREATE INDEX idx_medications_end_date ON medications(end_date) WHERE end_date IS NOT NULL;
```

**medication_logs**
```sql
CREATE TABLE medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,

  scheduled_time TIMESTAMP NOT NULL,
  administered_at TIMESTAMP,
  administered_by UUID REFERENCES users(id),

  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'given', 'skipped', 'missed')),
  skip_reason TEXT,

  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX idx_medication_logs_scheduled_time ON medication_logs(scheduled_time DESC);
CREATE INDEX idx_medication_logs_status ON medication_logs(status);
```

**weight_tracking**
```sql
CREATE TABLE weight_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  weight DECIMAL(6,2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg' CHECK (unit IN ('kg', 'lb')),

  measured_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Context
  body_condition_score INTEGER CHECK (body_condition_score >= 1 AND body_condition_score <= 9),
  notes TEXT,
  image_url TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weight_tracking_pet_id ON weight_tracking(pet_id);
CREATE INDEX idx_weight_tracking_measured_at ON weight_tracking(measured_at DESC);
```

**activities**
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL CHECK (type IN (
    'walk', 'run', 'play', 'training', 'swimming',
    'hiking', 'fetch', 'agility', 'other'
  )),

  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration_minutes INTEGER,

  -- Metrics
  distance DECIMAL(8,2),
  distance_unit VARCHAR(10) CHECK (distance_unit IN ('m', 'km', 'ft', 'mi')),
  calories_burned INTEGER,

  -- Details
  intensity VARCHAR(20) CHECK (intensity IN ('light', 'moderate', 'intense')),
  location VARCHAR(200),
  notes TEXT,

  -- Weather (for outdoor activities)
  weather_conditions VARCHAR(50),
  temperature DECIMAL(4,1),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_pet_id ON activities(pet_id);
CREATE INDEX idx_activities_started_at ON activities(started_at DESC);
CREATE INDEX idx_activities_type ON activities(type);
```

**products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Basic info
  name VARCHAR(300) NOT NULL,
  slug VARCHAR(350) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),

  -- Category
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN (
    'raw_food', 'supplement', 'equipment', 'treat', 'toy', 'other'
  )),

  -- Species
  for_species VARCHAR(20)[] DEFAULT ARRAY['both'], -- ['dog', 'cat', 'both']

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Description
  short_description TEXT,
  description TEXT NOT NULL,
  ingredients TEXT[],
  benefits TEXT[],
  dosage_instructions TEXT,

  -- Nutrition (for food products)
  nutrition_facts JSONB, -- { calories, protein, fat, carbs, fiber, etc. }
  guaranteed_analysis JSONB,
  feeding_guidelines TEXT,

  -- Images
  images TEXT[] NOT NULL,
  primary_image_url TEXT,

  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  in_stock BOOLEAN DEFAULT true,
  backorder_allowed BOOLEAN DEFAULT false,
  estimated_restock_date DATE,

  -- Variants
  has_variants BOOLEAN DEFAULT false,
  variant_options JSONB, -- { size: ['Small', 'Medium'], color: ['Red', 'Blue'] }

  -- Shipping
  weight DECIMAL(8,2), -- Product weight in grams
  dimensions JSONB, -- { length, width, height } in cm
  requires_refrigeration BOOLEAN DEFAULT false,
  requires_freezing BOOLEAN DEFAULT false,

  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  tags TEXT[],

  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured BOOLEAN DEFAULT false,

  -- Stats
  views INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE status = 'active';
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
```

**product_variants**
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),

  -- Variant attributes
  option1_name VARCHAR(50), -- 'Size'
  option1_value VARCHAR(100), -- 'Medium'
  option2_name VARCHAR(50), -- 'Color'
  option2_value VARCHAR(100), -- 'Blue'
  option3_name VARCHAR(50),
  option3_value VARCHAR(100),

  -- Pricing
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),

  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,

  -- Physical
  weight DECIMAL(8,2),

  -- Images
  image_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
```

**carts**
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100), -- For guest users

  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),

  -- Totals
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,

  -- Discount codes
  coupon_code VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  abandoned_at TIMESTAMP,
  converted_at TIMESTAMP,

  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_status ON carts(status);
```

**cart_items**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL, -- Price at time of adding

  -- Product snapshot (in case product is deleted)
  product_snapshot JSONB NOT NULL,

  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

**orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,

  -- Status
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'confirmed', 'shipped',
    'delivered', 'cancelled', 'refunded', 'failed'
  )),
  payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'authorized', 'paid', 'refunded', 'failed'
  )),
  fulfillment_status VARCHAR(30) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN (
    'unfulfilled', 'partial', 'fulfilled', 'returned'
  )),

  -- Contact
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),

  -- Shipping address
  shipping_first_name VARCHAR(100),
  shipping_last_name VARCHAR(100),
  shipping_address_1 VARCHAR(255),
  shipping_address_2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(2) DEFAULT 'US',

  -- Billing address
  billing_same_as_shipping BOOLEAN DEFAULT true,
  billing_first_name VARCHAR(100),
  billing_last_name VARCHAR(100),
  billing_address_1 VARCHAR(255),
  billing_address_2 VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(2) DEFAULT 'US',

  -- Totals
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Discount
  coupon_code VARCHAR(50),

  -- Payment
  payment_method VARCHAR(50), -- 'card', 'paypal', 'apple_pay'
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),

  -- Shipping
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  carrier VARCHAR(50),
  estimated_delivery_date DATE,

  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,

  -- Timeline
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  refunded_at TIMESTAMP,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(customer_email);
```

**order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

  -- Snapshot at time of purchase
  product_name VARCHAR(300) NOT NULL,
  variant_name VARCHAR(200),
  sku VARCHAR(100),

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Fulfillment
  quantity_fulfilled INTEGER DEFAULT 0,
  quantity_returned INTEGER DEFAULT 0,

  -- Product snapshot (full product data at time of purchase)
  product_snapshot JSONB NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

**community_posts**
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- Type
  post_type VARCHAR(50) DEFAULT 'discussion' CHECK (post_type IN (
    'discussion', 'question', 'success_story', 'recipe', 'announcement'
  )),

  -- Category
  category VARCHAR(100),
  tags TEXT[],

  -- Media
  images TEXT[],
  videos TEXT[],

  -- Engagement
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
  pinned BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,

  -- Moderation
  reported BOOLEAN DEFAULT false,
  report_count INTEGER DEFAULT 0,
  moderated_at TIMESTAMP,
  moderated_by UUID REFERENCES users(id),
  moderation_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_status ON community_posts(status);
CREATE INDEX idx_community_posts_type ON community_posts(post_type);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_featured ON community_posts(featured) WHERE status = 'published';
```

**comments**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments

  content TEXT NOT NULL,

  -- Engagement
  likes_count INTEGER DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'deleted')),

  -- Moderation
  reported BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

**likes**
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  likeable_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'recipe'
  likeable_id UUID NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_likeable ON likes(likeable_type, likeable_id);
```

**favorites**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  favoritable_type VARCHAR(50) NOT NULL, -- 'post', 'recipe', 'product', 'supplier'
  favoritable_id UUID NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, favoritable_type, favoritable_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_favoritable ON favorites(favoritable_type, favoritable_id);
```

This is just the beginning - I have **28 more sections** to complete! The spec document will include complete technical specifications for all 30 areas. Let me continue building this comprehensive document.

Would you like me to:
1. Continue writing the entire 30-section spec file (will be very large)
2. Start building the features immediately based on priority
3. Both - complete spec while building in parallel

The spec will be massive and cover everything needed for production deployment.
