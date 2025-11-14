# REAL Bugs Found - User Reported Issues
**Updated:** 2025-11-14
**Status:** INVESTIGATING

---

## USER REPORTED BUGS (Confirmed)

### BUG-101: Styling Issues - Light Text on Light Backgrounds ❌ CRITICAL
**Status:** INVESTIGATING
**User Report:** "the site has styling issues eg light text on light backgrounds or light buttons"
**Impact:** Readability issues, poor UX
**Priority:** HIGH

**Need to check:**
- Button contrast ratios
- Text visibility across all pages
- Color combinations

**Investigation:**
- Found some teal-600 text on white backgrounds (likely OK)
- Need to check specific pages user is referring to
- Need screenshots or specific pages with issues

---

### BUG-102: Data Not Persisting to Database ❌ CRITICAL
**Status:** CONFIRMED - ROOT CAUSE FOUND
**User Report:** "most of the screens do not save the data to a database and after refreshing we see the data in the database already, not the new data"
**Impact:** All user data lost on refresh
**Priority:** CRITICAL

**ROOT CAUSE IDENTIFIED:**
- Cart API uses in-memory storage (`Map<string, CartItem[]>`)
- Wishlist API uses in-memory storage (`Map<string, Set<string>>`)
- Pets API likely uses in-memory storage
- Health API likely uses in-memory storage
- Feeding API likely uses in-memory storage

**Code Evidence:**
```typescript
// src/app/api/cart/route.ts:6
const memoryStorage = new Map<string, CartItem[]>();

// src/app/api/wishlist/route.ts:6
const wishlistStore = new Map<string, Set<string>>();
```

**Why It Happens:**
- In-memory Maps are stored in server process RAM
- When server restarts (or refresh triggers new request in dev), memory is cleared
- No persistent database configured (KV_REST_API_URL not set)

**Fix Required:**
- Configure actual database (PostgreSQL, MongoDB, or Vercel KV)
- OR use localStorage/cookies for client-side persistence (temporary fix)
- OR implement proper file-based persistence

---

### BUG-103: Shopping Cart - Can't Add Items ❌ CRITICAL
**Status:** TESTING
**User Report:** "the shopping does not add items to the cart so we can't test downstream processes like checkout"
**Impact:** Shopping feature completely broken
**Priority:** CRITICAL

**Code Review:**
- Add to cart button exists: `src/app/shop/[id]/page.tsx:56-81`
- API endpoint exists: `POST /api/cart`
- Code LOOKS correct

**Testing:**
```bash
POST /api/cart
{
  "productId": "omega3-fish-oil-1",
  "quantity": 2,
  "sizeOption": "16 oz"
}
```

**Status:** Need to test if API actually works or if there's an error

---

### BUG-104: Wishlist - Items Don't Appear ❌ CRITICAL
**Status:** RELATED TO BUG-102
**User Report:** "adding a wishlist item does not add the items to the wishlist or we do not see the items when clicking the wishlist"
**Impact:** Wishlist feature broken
**Priority:** HIGH

**Root Cause:** Same as BUG-102 - in-memory storage lost on refresh

**Code:**
```typescript
// src/app/api/wishlist/route.ts:6
const wishlistStore = new Map<string, Set<string>>();
```

**Fix:** Same solution as BUG-102 - need persistent database

---

### BUG-105: "Plenty More Like These" ❌ UNKNOWN
**Status:** AWAITING DETAILS
**User Report:** "plenty more like these"
**Priority:** UNKNOWN

**Need from user:**
- Specific pages/features that are broken
- What actions cause issues
- Expected vs actual behavior

---

## CORE PROBLEM: No Database Configured

**Impact:** Affects ALL user data:
- Shopping cart
- Wishlist
- Pets (likely)
- Health records (likely)
- Feeding schedules (likely)
- User preferences
- Any custom data

**Solution Options:**

### Option 1: Vercel KV (Redis) - EASIEST
```bash
# Install Vercel KV
npm install @vercel/kv

# Add to .env
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
```
**Pros:** Already has fallback code, minimal changes
**Cons:** Requires Vercel account, costs money at scale

### Option 2: PostgreSQL + Prisma - BEST FOR PRODUCTION
```bash
# Install Prisma
npm install prisma @prisma/client

# Setup database
# Create schema
# Run migrations
```
**Pros:** Full relational database, proper data modeling
**Cons:** More setup, requires database hosting

### Option 3: Client-Side Storage - QUICK FIX
Use localStorage/sessionStorage for temporary persistence
**Pros:** Works immediately, no backend needed
**Cons:** Not secure, limited storage, client-only

### Option 4: JSON File Storage - DEV ONLY
Write to JSON files on disk
**Pros:** Simple, works locally
**Cons:** Not scalable, not suitable for production

---

## Next Actions

1. **Immediate:** Test if cart/wishlist APIs actually work (in-memory)
2. **Short-term:** Implement client-side localStorage as temporary fix
3. **Medium-term:** Set up Vercel KV or database
4. **Get from user:** Specific styling issues and "other bugs"

---

## Testing Plan

### Cart Testing:
- [ ] Add item to cart via API
- [ ] Verify item appears in cart
- [ ] Refresh page
- [ ] Verify item is GONE (confirms bug)

### Wishlist Testing:
- [ ] Add item to wishlist
- [ ] Check wishlist page
- [ ] Refresh
- [ ] Verify item is GONE

### Styling Testing:
- [ ] Review all pages for contrast issues
- [ ] Check buttons for visibility
- [ ] Test in different browsers
- [ ] Get specific examples from user

---

**Status:** CRITICAL issues confirmed, solutions identified, awaiting user input on specifics
