# Vercel Deployment Promotion Guide

**Goal:** Promote the latest deployment with /v2/api fixes to production

**Current Commit:** `3538bd7` (or `19e6a1e`, `e89d840`)
**Branch:** `claude/production-rebuild-verification-011n3REgvafRNqefHXAP97Xi`

---

## Step 1: Access Vercel Dashboard

1. Go to: **https://vercel.com/beyondpandora/rawgle-frontend/deployments**
2. Log in if needed

---

## Step 2: Find the Latest Deployment

Look for the most recent deployment with one of these commits:
- `3538bd7` - Cloudflare audit findings
- `e89d840` - Cloudflare audit plan
- `19e6a1e` - Fix cart & notifications
- `5d24bd1` - Add /v2/api/suppliers routes

The deployment will show:
- **Branch:** `claude/production-rebuild-verification-011n3REgvafRNqefHXAP97Xi`
- **Status:** ✅ Ready
- **Age:** Minutes or hours old

---

## Step 3: Promote to Production

1. **Click on the deployment** to open its details page
2. **Look for the "Promote to Production" button** (usually in the top right)
3. **Click "Promote to Production"**
4. **Confirm** the promotion when prompted

**What happens:**
- This deployment becomes the new production build
- www.rawgle.com will serve this code
- Changes take effect immediately (no wait time)

---

## Step 4: Wait for DNS/CDN Propagation (1-2 minutes)

After promoting:
1. Wait 1-2 minutes for Cloudflare CDN to update
2. Clear your browser cache (Ctrl/Cmd + Shift + R)
3. Or use incognito/private mode for testing

---

## Step 5: Verify Promotion Succeeded

Check the production deployment:
1. Go back to: https://vercel.com/beyondpandora/rawgle-frontend/deployments
2. Look for the **"Production"** badge
3. Verify it's on your latest commit (`3538bd7` or similar)

---

## Next Steps After Promotion

Once promoted, I'll run the tests to verify everything works.

**Expected Results:**
- ✅ /v2/api/diagnostics returns real data
- ✅ /v2/api/cart works
- ✅ /v2/api/notifications works
- ✅ /v2/test page shows 9,190 suppliers
- ✅ No 404 errors in browser console

---

## Alternative: Deploy from Vercel CLI (if you prefer)

If you have Vercel CLI installed:

```bash
# From your local machine (not in Claude Code)
cd rawgle-frontend
vercel --prod
```

This will deploy the current branch to production.

---

## Troubleshooting

**"Promote to Production" button not showing:**
- You might be looking at a preview URL instead of the deployment page
- Go to Deployments tab first, then click the specific deployment

**Deployment failed:**
- Check the build logs in Vercel
- Look for error messages
- The deployment should have succeeded already (showing "Ready")

**Changes not appearing after promotion:**
- Clear browser cache
- Wait 2-3 minutes for CDN propagation
- Try incognito/private mode
- Purge Cloudflare cache again if needed

---

**Ready?** Let me know when you've promoted the deployment, and I'll run the verification tests!
