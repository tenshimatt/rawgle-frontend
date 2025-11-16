# Rawgle Production Deployment Checklist

**Purpose:** Systematic checklist to ensure smooth deployments and avoid repeat issues

---

## Pre-Deployment Checklist

### 1. Code Review
- [ ] All code changes reviewed and tested locally
- [ ] No console.error or debugging code left in
- [ ] Environment variables properly configured
- [ ] No hardcoded secrets or API keys

### 2. Build Verification
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No linting errors (if applicable)
- [ ] Build output size is reasonable

### 3. Git Status
- [ ] All changes committed
- [ ] Commit messages are descriptive
- [ ] Pushed to correct branch
- [ ] Branch is up to date with remote

---

## Deployment Steps

### Step 1: Vercel Deployment

#### Option A: Auto-Deploy (from Git push)
- [ ] Push to branch
- [ ] Wait for Vercel to detect changes
- [ ] Check deployment status in Vercel dashboard
- [ ] Review build logs for errors

#### Option B: Manual Promotion
1. [ ] Go to: https://vercel.com/beyondpandora/rawgle-frontend/deployments
2. [ ] Find the deployment to promote
3. [ ] Verify commit hash matches your latest code
4. [ ] Click "Promote to Production"
5. [ ] Wait for promotion to complete (~30 seconds)

### Step 2: Cloudflare Configuration (If Applicable)

#### Check for Cloudflare Interference
- [ ] Review `wrangler.toml` for redirect rules
- [ ] Ensure no redirect rules block new routes
- [ ] If wrangler.toml changed, deploy to Cloudflare Workers

#### Deploy wrangler.toml Changes
```bash
# If you have Wrangler CLI installed:
wrangler publish

# Or via Cloudflare dashboard:
# 1. Go to Workers dashboard
# 2. Update configuration
# 3. Deploy changes
```

### Step 3: Cache Management

#### Purge Cloudflare Cache
- [ ] Go to Cloudflare Dashboard
- [ ] Caching → Configuration
- [ ] Click "Purge Everything"
- [ ] Wait 1-2 minutes for propagation

#### Or Purge Specific URLs (if preferred)
```bash
# Purge specific paths:
- /v2/api/*
- /api/*
- /*  # Or specific changed pages
```

---

## Post-Deployment Verification

### Step 1: Deployment Status Check
- [ ] Vercel shows "Production" badge on latest deployment
- [ ] Build completed successfully (green checkmark)
- [ ] No deployment errors in logs

### Step 2: Quick Smoke Tests

#### Test Homepage
```bash
curl -I https://www.rawgle.com
# Should return: HTTP/2 200
```
- [ ] Homepage loads (status 200)
- [ ] No JavaScript errors in browser console

#### Test Critical API Endpoints
```bash
# Test /v2/api endpoints
curl https://www.rawgle.com/v2/api/diagnostics
# Should return: {"success":true,"data":{...}}

curl https://www.rawgle.com/v2/api/cart -H "x-user-id: demo-user"
# Should return: {"success":true,"data":{"items":[],...}}
```

- [ ] `/v2/api/diagnostics` returns JSON (not 404)
- [ ] `/v2/api/cart` returns JSON (not 404)
- [ ] `/v2/api/notifications` returns JSON (not 404)
- [ ] `/v2/api/suppliers` returns data

#### Test Old API Endpoints (if wrangler.toml was fixed)
```bash
# After wrangler.toml deployment, check if /api/* works:
curl https://www.rawgle.com/api/diagnostics
# Should return JSON if redirect fix worked
```

- [ ] `/api/*` endpoints work (if redirect was fixed)
- [ ] Or still return 404 (if using /v2 bypass strategy)

### Step 3: Browser Testing

#### Open in Browser
- [ ] Visit: https://www.rawgle.com
- [ ] Open DevTools → Console tab
- [ ] Look for errors (red messages)

#### Test Key User Flows
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] Cart icon visible
- [ ] Notifications icon visible
- [ ] Search functionality works
- [ ] Login page loads (if auth is deployed)

#### Check Network Tab
- [ ] Open DevTools → Network tab
- [ ] Reload page
- [ ] Look for 404 errors on API calls
- [ ] Verify /v2/api/* calls succeed
- [ ] No unexpected errors

### Step 4: Feature-Specific Tests

#### Test /v2/test Page (if created)
```
https://www.rawgle.com/v2/test
```
- [ ] Page loads (status 200)
- [ ] Shows "Cloudflare Connected: Yes"
- [ ] Shows "Total Suppliers: 9,190" (or actual count)
- [ ] Sample suppliers displayed

#### Test Cart Functionality
- [ ] Visit cart page
- [ ] Cart loads without errors
- [ ] Can add items (if product page exists)
- [ ] Cart updates correctly

#### Test Notifications
- [ ] Click notifications bell icon
- [ ] Notifications panel opens
- [ ] Shows demo notifications (or empty state)
- [ ] No console errors

---

## Rollback Procedure (If Issues Occur)

### Quick Rollback in Vercel

1. **Find Previous Working Deployment:**
   - Go to: https://vercel.com/beyondpandora/rawgle-frontend/deployments
   - Find last known good deployment
   - Note the commit hash

2. **Promote Previous Deployment:**
   - Click on the working deployment
   - Click "Promote to Production"
   - Confirm promotion

3. **Verify Rollback:**
   - Test critical endpoints
   - Confirm errors are resolved
   - Monitor for 5-10 minutes

4. **Investigate Issue:**
   - Review build logs of failed deployment
   - Check git diff between working and broken versions
   - Identify problematic changes

### If Rollback Doesn't Help

Check Cloudflare configuration:
- [ ] Review redirect rules in wrangler.toml
- [ ] Check if recent Cloudflare changes were made
- [ ] Purge Cloudflare cache again
- [ ] Wait 5 minutes for CDN propagation

---

## Common Issues & Solutions

### Issue 1: 404 on API Endpoints

**Symptoms:**
- `/api/*` or `/v2/api/*` return 404
- Console shows "Failed to fetch" errors

**Solutions:**
1. Check if deployment was promoted
2. Purge Cloudflare cache
3. Wait 2-3 minutes for CDN
4. Check wrangler.toml redirect rules
5. Verify routes exist in deployed code

### Issue 2: Old Code Still Showing

**Symptoms:**
- Changes not visible on production
- Old version still served

**Solutions:**
1. Verify deployment shows "Production" badge
2. Purge Cloudflare cache
3. Clear browser cache (Ctrl/Cmd + Shift + R)
4. Use incognito mode to test
5. Check Vercel deployment logs

### Issue 3: Build Fails on Vercel

**Symptoms:**
- Deployment shows "Error" status
- Build logs show errors

**Solutions:**
1. Review build logs for specific error
2. Test `npm run build` locally
3. Fix TypeScript/lint errors
4. Check for missing dependencies
5. Verify environment variables

### Issue 4: Cloudflare Blocking Updates

**Symptoms:**
- Code deployed but not appearing
- API routes return 404 despite being deployed

**Solutions:**
1. Check `wrangler.toml` for redirect rules
2. Disable problematic redirects
3. Use `/v2/api/*` bypass routes
4. Deploy wrangler.toml changes
5. Purge Cloudflare cache

---

## Deployment History Log

Use this section to track deployments:

```markdown
| Date | Commit | Deployed By | Notes |
|------|--------|-------------|-------|
| 2025-11-16 | 3538bd7 | Claude | Fixed wrangler.toml redirect, created /v2 routes |
| 2025-11-16 | 19e6a1e | Claude | Added /v2/api/cart and /v2/api/notifications |
| 2025-11-15 | 5d24bd1 | Claude | Added /v2/api/suppliers routes |
| 2025-11-15 | 64d9095 | Claude | Connected to Cloudflare D1 database |
```

---

## Emergency Contacts

**Vercel Dashboard:** https://vercel.com/beyondpandora/rawgle-frontend

**Cloudflare Dashboard:** https://dash.cloudflare.com/3e02a16d99fcee4a071c58d876dbc4ea

**GitHub Repo:** https://github.com/[org]/rawgle-frontend

---

## Quick Reference Commands

```bash
# Test endpoints
curl https://www.rawgle.com/v2/api/diagnostics
curl https://www.rawgle.com/v2/api/cart -H "x-user-id: demo-user"

# Check HTTP status
curl -I https://www.rawgle.com/v2/test

# Run test script (if created)
./test-v2-endpoints.sh

# Build locally
npm run build

# Check git status
git status
git log --oneline -5

# Push changes
git push -u origin [branch-name]
```

---

## Success Criteria

Deployment is successful when ALL of these are true:

- ✅ Vercel deployment shows "Production" status
- ✅ No 404 errors in browser console on homepage
- ✅ Critical API endpoints return data (not 404)
- ✅ Homepage loads correctly
- ✅ Navigation and core features work
- ✅ No unexpected JavaScript errors
- ✅ Changes from commit are visible
- ✅ Test page (if exists) shows expected data

---

**Last Updated:** November 16, 2025
**Version:** 1.0
