# API Migration Status: /api/* to /v2/api/*

**Date:** November 16, 2025
**Purpose:** Track migration of API routes from blocked `/api/*` to working `/v2/api/*`

---

## Current Status

### ✅ Migrated to /v2/api (Working)

| Endpoint | Status | Components Using It |
|----------|--------|---------------------|
| `/v2/api/diagnostics` | ✅ Deployed | Internal health checks |
| `/v2/api/suppliers` | ✅ Deployed | Supplier search features |
| `/v2/api/suppliers/nearby` | ✅ Deployed | Location-based supplier search |
| `/v2/api/suppliers/search` | ✅ Deployed | Text-based supplier search |
| `/v2/api/cart` | ⏳ Code ready | `cart-provider.tsx`, cart page |
| `/v2/api/notifications` | ⏳ Code ready | `notification-center.tsx` |

**Legend:**
- ✅ Deployed = Live in production
- ⏳ Code ready = Committed, awaiting deployment promotion

---

## 🔴 Still Blocked (Using /api/* - Returns 404)

These routes are still blocked by Cloudflare redirect:

### High Priority (Used in Frontend)

| Endpoint | Files Using It | Action Needed |
|----------|---------------|---------------|
| `/api/auth/login` | auth/login/page.tsx, admin/login/page.tsx | Create `/v2/api/auth/login` |
| `/api/auth/register` | auth/register/page.tsx | Create `/v2/api/auth/register` |
| `/api/auth/me` | Multiple layout components | Create `/v2/api/auth/me` |
| `/api/auth/logout` | Navigation components | Create `/v2/api/auth/logout` |
| `/api/achievements` | activity/page.tsx | Create `/v2/api/achievements` |
| `/api/challenges` | Multiple pages | Create `/v2/api/challenges` |
| `/api/wishlist` | Wishlist page | Create `/v2/api/wishlist` |
| `/api/favorites` | Various components | Create `/v2/api/favorites` |
| `/api/community/posts` | Community pages | Create `/v2/api/community/posts` |
| `/api/community/forums` | Forums pages | Create `/v2/api/community/forums` |

### Medium Priority (May Be Used)

| Endpoint | Notes |
|----------|-------|
| `/api/admin/*` | Admin dashboard routes |
| `/api/search` | Global search |
| `/api/supplements` | Supplements catalog |
| `/api/education` | Education content |
| `/api/paws/*` | PAWS rewards system |

### Low Priority (Less Critical)

| Endpoint | Notes |
|----------|-------|
| `/api/vets` | Vet directory |
| `/api/medications` | Medication tracking |
| `/api/symptom-checker` | Health symptom checker |
| `/api/export-health-report` | PDF export |
| `/api/webhooks/stripe` | Stripe webhooks (backend only) |

---

## Migration Strategy

### Option 1: Incremental Migration (Recommended)

Migrate routes as they're actively used:

1. **Phase 1 (Complete):**
   - ✅ Suppliers routes
   - ✅ Cart
   - ✅ Notifications
   - ✅ Diagnostics

2. **Phase 2 (Next):**
   - Create `/v2/api/auth/*` routes (login, register, me, logout)
   - These are most critical for user functionality

3. **Phase 3:**
   - Community features (forums, posts)
   - Wishlist, favorites
   - Achievements, challenges

4. **Phase 4:**
   - Admin routes
   - Remaining features

### Option 2: Bulk Migration

Create all /v2/api routes at once:
- **Pro:** Everything works immediately after deployment
- **Con:** Large amount of code to review and test
- **Time:** ~2-3 hours

### Option 3: Fix Cloudflare (Permanent Solution)

Remove the redirect in wrangler.toml:
- **Pro:** No need to create /v2 routes
- **Con:** Requires Cloudflare Workers redeployment
- **Status:** ✅ Already disabled in wrangler.toml (this commit)
- **Effect:** Takes effect when wrangler.toml is deployed to Cloudflare

---

## Recommendation

**Best Approach:**

1. **Immediate (Today):**
   - Promote latest deployment (enables cart & notifications)
   - Deploy wrangler.toml changes to Cloudflare
   - Test if /api/* routes start working

2. **If wrangler.toml fix works:**
   - No need to create more /v2 routes
   - Keep existing /v2 routes as backup
   - Update frontend to use /api/* again

3. **If wrangler.toml fix doesn't work:**
   - Create Phase 2 routes (/v2/api/auth/*)
   - Continue incremental migration

---

## Testing After Deployment

```bash
# Test auth routes (currently blocked)
curl https://www.rawgle.com/api/auth/health
# Should return JSON, currently returns 404

# Test cart (working on /v2)
curl https://www.rawgle.com/v2/api/cart -H "x-user-id: demo-user"
# Should return: {"success":true,"data":{"items":[],...}}

# After wrangler.toml deployment, test if /api works
curl https://www.rawgle.com/api/cart -H "x-user-id: demo-user"
# If wrangler fix works, this should return cart data
```

---

## Files Modified

### This Commit
- `wrangler.toml` - Disabled problematic redirect
- `API_MIGRATION_STATUS.md` - This file

### Previous Commits
- `src/app/v2/api/cart/route.ts` - Created
- `src/app/v2/api/notifications/route.ts` - Created
- `src/components/cart/cart-provider.tsx` - Updated to /v2
- `src/components/notifications/notification-center.tsx` - Updated to /v2

---

**Next Action:** Promote deployment and deploy wrangler.toml changes to Cloudflare to test if the redirect fix resolves the issue.
