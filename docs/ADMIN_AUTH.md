# Admin Authentication System Documentation

## Overview

This document describes the secure admin authentication system for the Rawgle CMS dashboard. The system provides role-based access control (RBAC), JWT-based authentication, and comprehensive security features.

## Architecture

### Components

1. **Authentication Utilities** (`/src/lib/auth/admin.ts`)
   - Password hashing and verification (bcrypt with 10 rounds)
   - JWT token generation and verification
   - Permission checking and RBAC
   - Redis data persistence
   - Admin user management

2. **API Endpoints**
   - `/api/admin/auth/login` - Admin login
   - `/api/admin/auth/logout` - Admin logout
   - `/api/admin/auth/me` - Get current admin user
   - `/api/admin/seed` - Initialize default admin

3. **Middleware** (`/src/middleware.ts`)
   - Protects all `/admin/*` routes
   - JWT token verification
   - Token blacklist checking
   - Automatic redirects for unauthorized access

## Admin Roles

The system supports four distinct admin roles with different permission levels:

### Super Admin (`super_admin`)
- Full system access
- Can manage all content, products, orders, and users
- Can manage other admin users
- Can access system settings
- Has all permissions

### Admin (`admin`)
- Can manage users, content, products, and orders
- Can view analytics
- Cannot manage other admins or system settings

### Editor (`editor`)
- Can manage content only
- Cannot access users, products, or orders
- Limited to content management tasks

### Viewer (`viewer`)
- Read-only access
- Can view analytics
- Cannot modify any data

## Permission System

Permissions are automatically assigned based on roles:

```typescript
interface AdminPermissions {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean;
  fullAccess: boolean;
}
```

### Checking Permissions

```typescript
import { checkAdminPermissions } from '@/lib/auth/admin';

// Check if admin can manage products
const canManage = checkAdminPermissions(role, 'canManageProducts');

// Or use validation with error message
const result = validateAdminPermission(role, 'canManageProducts');
if (!result.allowed) {
  console.error(result.message);
}
```

## Security Features

### 1. Password Security
- **Bcrypt hashing** with 10 rounds (configurable)
- Passwords must meet complexity requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number

### 2. JWT Tokens
- **24-hour expiry** for admin sessions
- Signed with `ADMIN_JWT_SECRET` environment variable
- Includes admin ID, email, and role in payload
- Separate secret from user JWT tokens

### 3. HTTP-Only Cookies
- Tokens stored in `admin-token` HTTP-only cookie
- `SameSite=Strict` to prevent CSRF
- `Secure` flag in production
- Automatic expiration

### 4. Token Blacklist
- Invalidated tokens stored in Redis
- Checked on every request
- Automatic cleanup when tokens expire

### 5. Rate Limiting
- **5 attempts per 15 minutes** per IP/email combination
- Automatic retry-after headers
- Memory-based rate limiting (can be moved to Redis for distributed systems)

### 6. CSRF Protection
- CSRF token generated on login
- Returned in `X-CSRF-Token` header
- Should be included in state-changing requests

### 7. Middleware Protection
- All `/admin/*` routes protected by default
- Public paths:
  - `/admin/login`
  - `/api/admin/auth/login`
  - `/api/admin/auth/logout`
- Automatic redirects to `/admin/login` for unauthorized users
- 401 responses for API routes

## Getting Started

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Redis connection (required for admin auth)
REDIS_URL=redis://localhost:6379

# JWT secrets (use strong random strings in production)
JWT_SECRET=your-jwt-secret-key
ADMIN_JWT_SECRET=your-admin-jwt-secret-key

# Admin seed secret (optional, defaults to 'dev-seed-secret-123')
ADMIN_SEED_SECRET=your-seed-secret-key
```

### 2. Initialize Default Admin

**Option A: Using the API endpoint**

```bash
# In development
curl -X POST http://localhost:3005/api/admin/seed

# In production (requires seed secret)
curl -X POST https://your-domain.com/api/admin/seed \
  -H "x-seed-secret: your-seed-secret-key"
```

**Option B: Using the seed script**

Add to `package.json`:

```json
{
  "scripts": {
    "seed:admin": "ts-node scripts/seed-admin.ts"
  }
}
```

Run:

```bash
npm run seed:admin
```

**Option C: Manual initialization**

```typescript
import { initializeDefaultAdmin } from '@/lib/auth/admin';

const result = await initializeDefaultAdmin();
if (result) {
  console.log(`Email: ${result.email}`);
  console.log(`Password: ${result.password}`);
}
```

### 3. Default Admin Credentials

After seeding, you'll receive:
- **Email**: `admin@rawgle.com`
- **Password**: Randomly generated (20 characters)
- **Role**: `super_admin`

**IMPORTANT**: Save the password securely! It will only be shown once.

## API Usage

### Login

```typescript
// POST /api/admin/auth/login
const response = await fetch('/api/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@rawgle.com',
    password: 'your-password',
  }),
});

const data = await response.json();
// {
//   success: true,
//   message: 'Login successful',
//   user: { id, email, role, permissions, ... },
//   token: 'jwt-token-here'
// }
```

### Get Current Admin

```typescript
// GET /api/admin/auth/me
const response = await fetch('/api/admin/auth/me', {
  credentials: 'include', // Include cookies
});

const data = await response.json();
// {
//   success: true,
//   user: { id, email, role, permissions, ... }
// }
```

### Logout

```typescript
// POST /api/admin/auth/logout
const response = await fetch('/api/admin/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

const data = await response.json();
// {
//   success: true,
//   message: 'Logout successful'
// }
```

## Using Authentication in API Routes

The middleware adds admin information to request headers:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPermissions } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  // Get admin info from headers (added by middleware)
  const adminId = req.headers.get('x-admin-id');
  const adminEmail = req.headers.get('x-admin-email');
  const adminRole = req.headers.get('x-admin-role') as AdminRole;

  // Check permissions
  if (!checkAdminPermissions(adminRole, 'canManageProducts')) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Proceed with protected operation
  // ...
}
```

## Creating Additional Admin Users

```typescript
import {
  generateAdminId,
  hashPassword,
  storeAdminUser,
  AdminUser,
} from '@/lib/auth/admin';

async function createAdmin(email: string, password: string, role: AdminRole) {
  const passwordHash = await hashPassword(password);

  const newAdmin: AdminUser = {
    id: generateAdminId(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
    firstName: 'First',
    lastName: 'Last',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };

  const success = await storeAdminUser(newAdmin);
  return success ? newAdmin : null;
}
```

## Redis Data Structure

Admin data is stored in Redis with the following keys:

```
admin:users:{email}          - Full admin user object (JSON)
admin:users:id:{id}          - Email lookup by ID
admin:blacklist:{token}      - Invalidated tokens (TTL = token expiry)
```

## Security Best Practices

1. **Environment Variables**
   - Always use strong, random secrets in production
   - Never commit `.env` files to version control
   - Rotate secrets periodically

2. **Password Management**
   - Enforce strong password policies
   - Consider implementing password reset flow
   - Log password change attempts

3. **Session Management**
   - Implement session timeout warnings
   - Force re-authentication for sensitive operations
   - Consider implementing "remember me" functionality

4. **Monitoring**
   - Log all admin authentication events
   - Monitor for suspicious login patterns
   - Set up alerts for failed login attempts

5. **Production Deployment**
   - Use HTTPS only
   - Enable all security headers
   - Implement IP whitelisting if possible
   - Use Redis with authentication
   - Enable Redis SSL/TLS

## Troubleshooting

### Issue: "Redis not available"

**Solution**: Ensure Redis is running and `REDIS_URL` is set correctly.

```bash
# Start Redis locally
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

### Issue: "Token has been invalidated"

**Solution**: The admin logged out or the token was blacklisted. Login again.

### Issue: "Too many login attempts"

**Solution**: Wait 15 minutes or clear the rate limit in memory/Redis.

### Issue: Cannot access admin routes

**Solution**: Check that:
1. You're logged in with a valid token
2. The token hasn't expired (24 hours)
3. The token isn't blacklisted
4. Redis is available

## Future Enhancements

Potential improvements to consider:

1. **Multi-factor Authentication (MFA)**
   - TOTP support
   - SMS verification
   - Email verification codes

2. **Password Reset Flow**
   - Email-based password reset
   - Security questions
   - Admin approval for resets

3. **Audit Logging**
   - Track all admin actions
   - Store in separate database
   - Export audit logs

4. **Session Management UI**
   - View active sessions
   - Revoke specific sessions
   - Session history

5. **IP Whitelisting**
   - Restrict admin access by IP
   - Configurable IP ranges
   - Temporary IP grants

6. **Advanced RBAC**
   - Custom roles
   - Granular permissions
   - Resource-level permissions

## Support

For questions or issues with the admin authentication system, please contact the development team or open an issue in the project repository.

---

**Last Updated**: 2025-11-15
**Version**: 1.0.0
