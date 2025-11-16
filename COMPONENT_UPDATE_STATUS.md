# Component Update Status: /api → /v2/api Migration

**Date:** November 16, 2025
**Purpose:** Track which frontend components need to be updated to use /v2/api routes

---

## ✅ Already Updated (Using /v2/api)

| Component | Route Used | Status |
|-----------|-----------|---------|
| `src/components/cart/cart-provider.tsx` | `/v2/api/cart` | ✅ Complete |
| `src/components/notifications/notification-center.tsx` | `/v2/api/notifications` | ✅ Complete |

---

## ⏸️ On Hold (Waiting for wrangler.toml Fix)

Since we disabled the Cloudflare redirect in `wrangler.toml`, we should:

1. **First:** Deploy wrangler.toml to Cloudflare
2. **Test:** Check if /api/* routes start working
3. **Then decide:**
   - If /api/* works → No need to update more components
   - If /api/* still blocked → Create /v2 versions and update components

---

## 🔴 Components Still Using /api/* (May Need Updates)

### Auth Components (High Priority)

| File | Endpoint Used | Impact |
|------|--------------|--------|
| `src/app/auth/login/page.tsx` | `/api/auth/login` | Login won't work |
| `src/app/auth/register/page.tsx` | `/api/auth/register` | Registration won't work |
| `src/app/admin/login/page.tsx` | `/api/admin/auth/login` | Admin login won't work |
| Navigation components | `/api/auth/me` | User status check fails |

### Community Components

| File | Endpoint Used | Impact |
|------|--------------|--------|
| `src/app/community/forums/page.tsx` | `/api/community/forums` | Forums won't load |
| `src/app/community/forums/[id]/page.tsx` | `/api/community/forums/[id]` | Forum threads won't load |
| Various community pages | `/api/community/posts` | Posts won't load |

### Feature Components

| File | Endpoint Used | Impact |
|------|--------------|--------|
| `src/app/activity/page.tsx` | `/api/achievements`, `/api/activity` | Activity page won't load |
| `src/app/wishlist/page.tsx` | `/api/wishlist` | Wishlist won't work |
| Admin pages (multiple) | Various `/api/admin/*` | Admin features won't work |

---

## Update Strategy

### If wrangler.toml Fix Works ✅
**Do nothing!** All components will automatically work once Cloudflare stops redirecting.

### If wrangler.toml Fix Doesn't Work ❌
Create /v2/api routes and update components in this order:

#### Priority 1: Auth (Critical)
```bash
# Create routes:
src/app/v2/api/auth/login/route.ts
src/app/v2/api/auth/register/route.ts
src/app/v2/api/auth/me/route.ts
src/app/v2/api/auth/logout/route.ts

# Update components:
src/app/auth/login/page.tsx
src/app/auth/register/page.tsx
src/app/admin/login/page.tsx
[Navigation components with user checks]
```

#### Priority 2: Community
```bash
# Create routes:
src/app/v2/api/community/forums/route.ts
src/app/v2/api/community/posts/route.ts

# Update components:
src/app/community/**/*.tsx
```

#### Priority 3: Features
```bash
# Create routes as needed for:
- Achievements
- Wishlist
- Admin features
- etc.
```

---

## How to Update a Component

**Before:**
```typescript
const response = await fetch('/api/cart', {
  headers: { 'x-user-id': 'demo-user' }
});
```

**After:**
```typescript
const response = await fetch('/v2/api/cart', {
  headers: { 'x-user-id': 'demo-user' }
});
```

**Pattern:**
- Find: `/api/`
- Replace: `/v2/api/`
- Test: Verify endpoint returns expected data

---

## Testing After Updates

### Test Individual Components

```bash
# Test cart (already updated)
curl https://www.rawgle.com/v2/api/cart -H "x-user-id: demo-user"

# Test notifications (already updated)
curl https://www.rawgle.com/v2/api/notifications -H "x-user-id: demo-user"

# Test auth (if created)
curl https://www.rawgle.com/v2/api/auth/me -H "x-user-id: demo-user"
```

### Test in Browser

1. Open DevTools → Network tab
2. Navigate to affected page
3. Look for /api/ requests
4. Check if they return 404 (blocked) or data (working)
5. If 404, the component needs updating

---

## Recommendation

**Wait for wrangler.toml deployment** before updating more components. The redirect fix might resolve everything automatically.

**Files to monitor:**
- Any page that makes fetch calls
- Any component with API data fetching
- Check browser console for 404 errors on /api/* endpoints

---

**Status:** Waiting for wrangler.toml deployment to Cloudflare Workers
