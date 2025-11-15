# Admin Authentication - Quick Start Guide

## Prerequisites
- Redis running (local or remote)
- Node.js and npm installed
- Environment variables configured

## Step 1: Environment Setup

Create or update `.env.local`:

```bash
# Redis Connection (REQUIRED)
REDIS_URL=redis://localhost:6379

# JWT Secrets (REQUIRED - use strong random strings)
ADMIN_JWT_SECRET=your-admin-jwt-secret-min-32-chars

# Optional
ADMIN_SEED_SECRET=your-seed-secret
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## Step 2: Start Redis

```bash
# Option A: Local Redis
redis-server

# Option B: Docker
docker run -d -p 6379:6379 redis:alpine

# Verify
redis-cli ping
# Should return: PONG
```

## Step 3: Initialize Default Admin

```bash
# Method 1: API call (recommended)
curl -X POST http://localhost:3005/api/admin/seed

# Method 2: Seed script
npm run seed:admin
```

**Save the credentials shown!** They will only be displayed once.

## Step 4: Test Login

```bash
curl -X POST http://localhost:3005/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rawgle.com","password":"YOUR_PASSWORD"}'
```

## API Endpoints

### Login
```bash
POST /api/admin/auth/login
Body: { "email": "...", "password": "..." }
```

### Get Current User
```bash
GET /api/admin/auth/me
Cookie: admin-token=...
```

### Logout
```bash
POST /api/admin/auth/logout
Cookie: admin-token=...
```

## Frontend Example

```typescript
// Login
const response = await fetch('/api/admin/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
const { user, token } = await response.json();

// Get current user
const response = await fetch('/api/admin/auth/me', {
  credentials: 'include',
});
const { user } = await response.json();

// Logout
await fetch('/api/admin/auth/logout', {
  method: 'POST',
  credentials: 'include',
});
```

## Protected Route Example

```typescript
import { checkAdminPermissions } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  const role = req.headers.get('x-admin-role');
  
  if (!checkAdminPermissions(role, 'canManageProducts')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Your protected code here
}
```

## Admin Roles

| Role | Permissions |
|------|-------------|
| super_admin | Full access to everything |
| admin | Manage content, products, orders, users |
| editor | Manage content only |
| viewer | Read-only access |

## Security Features

- bcrypt password hashing (10 rounds)
- JWT tokens (24-hour expiry)
- HTTP-only cookies
- CSRF protection
- Rate limiting (5 attempts per 15 minutes)
- Token blacklist in Redis
- Middleware route protection
- Security headers (CSP, X-Frame-Options, etc.)

## Troubleshooting

**"Redis not available"**
→ Start Redis server and check REDIS_URL

**"Invalid email or password"**
→ Verify credentials and check if admin exists

**"Too many login attempts"**
→ Wait 15 minutes or restart the server

**"Token has been invalidated"**
→ Login again

## Documentation

For complete documentation, see:
- `/docs/ADMIN_AUTH.md` - Full documentation
- `/docs/ADMIN_AUTH_IMPLEMENTATION.md` - Implementation details

## Support

If you need help, check the documentation or contact the development team.
