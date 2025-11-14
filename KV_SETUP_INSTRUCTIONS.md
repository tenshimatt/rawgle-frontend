# Vercel KV Setup Instructions

## Issue: Data Not Persisting (Cart, Wishlist, etc.)

**Root Cause:** Local development is using in-memory storage which resets on every server restart/refresh.

**Solution:** Configure Vercel KV credentials from production environment.

---

## Step 1: Get KV Credentials from Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the `rawgle` project (www.rawgle.com)
3. Navigate to **Settings** → **Environment Variables**
4. Look for these two variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
5. Copy both values

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Link to the project
vercel link

# Pull environment variables
vercel env pull .env.production

# The credentials will be in .env.production
cat .env.production | grep KV_
```

---

## Step 2: Add Credentials to Local Environment

Edit `/home/user/rawgle-frontend/.env.local` and add:

```bash
# ============================================
# Vercel KV (Redis) - Data Persistence
# ============================================
KV_REST_API_URL=https://your-kv-url.vercel.app
KV_REST_API_TOKEN=your-kv-token-here
```

**Replace with actual values from Step 1.**

---

## Step 3: Restart Development Server

```bash
# Kill existing server
pkill -f "next dev"

# Restart with new environment variables
cd /home/user/rawgle-frontend
npm run dev > /tmp/rawgle-dev.log 2>&1 &
```

---

## Step 4: Verify KV is Working

Check the server logs for this message:

```bash
tail -f /tmp/rawgle-dev.log | grep "Vercel KV"
```

**Expected output:**
```
[Cart API] Vercel KV initialized successfully
[Wishlist API] Vercel KV initialized successfully
```

**If you see this (BAD):**
```
[Cart API] Vercel KV environment variables not found, using in-memory storage
```
→ KV credentials are not configured correctly.

---

## Step 5: Test Data Persistence

### Test Cart:

```bash
# Add item to cart
curl -X POST http://localhost:3005/api/cart \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "productId": "omega3-fish-oil-1",
    "quantity": 2,
    "sizeOption": "16 oz"
  }'

# Get cart (should show the item)
curl http://localhost:3005/api/cart \
  -H "x-user-id: test-user-123"

# Restart server
pkill -f "next dev" && npm run dev > /tmp/rawgle-dev.log 2>&1 &
sleep 5

# Get cart again (should STILL show the item if KV is working)
curl http://localhost:3005/api/cart \
  -H "x-user-id: test-user-123"
```

**Expected:** Cart item persists across server restart.

### Test Wishlist:

```bash
# Add to wishlist
curl -X POST http://localhost:3005/api/wishlist \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{"productId": "omega3-fish-oil-1"}'

# Get wishlist
curl http://localhost:3005/api/wishlist \
  -H "x-user-id: test-user-123"

# Restart and check again
pkill -f "next dev" && npm run dev > /tmp/rawgle-dev.log 2>&1 &
sleep 5
curl http://localhost:3005/api/wishlist \
  -H "x-user-id: test-user-123"
```

---

## Architecture Overview

### How KV Integration Works:

```
┌─────────────────────────────────────────────┐
│  Cart/Wishlist API Routes                  │
│                                             │
│  1. Check if KV credentials exist          │
│     ├─ YES → Use Vercel KV (Redis)        │
│     └─ NO  → Use in-memory Map (temp)     │
│                                             │
│  2. All data operations go through KV      │
│     ├─ cart:userId → CartItem[]           │
│     └─ wishlist:userId → Set<productId>   │
└─────────────────────────────────────────────┘
```

### Current Implementation:

**Files with KV Integration:**
- `/src/app/api/cart/route.ts` - Cart storage
- `/src/app/api/wishlist/route.ts` - Wishlist storage
- Likely: `/src/app/api/pets/route.ts` (to verify)
- Likely: `/src/app/api/health/route.ts` (to verify)
- Likely: `/src/app/api/feeding/route.ts` (to verify)

**Package Installed:**
```json
"@vercel/kv": "^3.0.0"
```

**Fallback Logic:**
```typescript
// From cart/route.ts
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  const { kv: kvClient } = await import('@vercel/kv');
  kv = kvClient;
  kvAvailable = true;
} else {
  // Falls back to in-memory Map
  kvAvailable = false;
}
```

---

## Troubleshooting

### Issue: "Vercel KV environment variables not found"

**Solution:**
1. Verify credentials are in `.env.local`
2. Make sure variable names are EXACT (case-sensitive)
3. Restart server after adding credentials
4. Check for typos in the values

### Issue: "Failed to initialize KV"

**Possible causes:**
- Invalid KV_REST_API_TOKEN (expired or wrong)
- KV_REST_API_URL pointing to wrong endpoint
- Network connectivity issues

**Solution:**
1. Re-copy credentials from Vercel dashboard
2. Verify network connectivity to Vercel
3. Check server logs for detailed error: `tail -f /tmp/rawgle-dev.log`

### Issue: Data still not persisting

**Checklist:**
- [ ] KV credentials added to `.env.local`
- [ ] Server restarted after adding credentials
- [ ] Logs show "Vercel KV initialized successfully"
- [ ] Using correct `x-user-id` header in requests
- [ ] Not using incognito/different browser (different user IDs)

---

## Production Status

✅ **Production (www.rawgle.com) HAS KV configured**
- Wishlist items persist correctly
- Cart should persist correctly
- All user data is stored in Vercel KV

❌ **Local Development (10.90.10.82:3005) NEEDS KV credentials**
- Currently using in-memory storage
- Data lost on refresh/restart
- Needs credentials from Step 1

---

## Next Steps After KV Setup

Once KV is configured:

1. ✅ Fix data persistence issues (cart, wishlist)
2. ⏳ Test all user data flows
3. ⏳ Fix AI chatbot (add OpenAI API key)
4. ⏳ Fix styling issues (already fixed in button.tsx)
5. ⏳ Identify and fix "many other bugs"

---

## Quick Reference

**Environment File:** `/home/user/rawgle-frontend/.env.local`

**Required Variables:**
```bash
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

**Restart Command:**
```bash
pkill -f "next dev" && cd /home/user/rawgle-frontend && npm run dev > /tmp/rawgle-dev.log 2>&1 &
```

**Check Logs:**
```bash
tail -f /tmp/rawgle-dev.log | grep -i "kv\|vercel"
```

---

**Status:** Awaiting KV credentials from Vercel production environment.
