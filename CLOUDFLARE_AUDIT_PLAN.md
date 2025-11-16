# Cloudflare Configuration Audit Plan

**Purpose:** Systematically identify ALL Cloudflare configurations that could block visibility of code updates

**Date:** November 16, 2025
**Issue:** Updates to Next.js code not appearing in production due to Cloudflare interception

---

## Known Issues

### 1. Cloudflare Workers Redirect (CONFIRMED BLOCKING)
- **Location:** `wrangler.toml` or Cloudflare Dashboard → Workers
- **Issue:** Redirect rule `/api/*` → `api.rawgle.com`
- **Impact:** ALL `/api/*` requests intercepted before reaching Vercel
- **Workaround:** Created `/v2/api/*` routes to bypass
- **Permanent Fix:** Update Workers D1 binding or remove redirect

---

## Cloudflare Audit Checklist

### Phase 1: Workers & Pages Configuration

#### Cloudflare Workers
- [ ] **Workers Dashboard:** https://dash.cloudflare.com/3e02a16d99fcee4a071c58d876dbc4ea/workers
- [ ] List all active Workers for `rawgle.com` domain
- [ ] Check each Worker's routes/triggers
- [ ] Verify D1 database bindings:
  - Current binding name
  - Current database ID
  - Expected: `9dcf8539-f274-486c-807b-7e265146ce6b` (findrawdogfood-db)
- [ ] Check KV namespace bindings
- [ ] Review Worker script code for:
  - Request interception logic
  - Caching headers
  - Response modifications
- [ ] Check environment variables
- [ ] Verify deployment status (which version is live)

#### Cloudflare Pages
- [ ] **Pages Dashboard:** https://dash.cloudflare.com/3e02a16d99fcee4a071c58d876dbc4ea/pages
- [ ] Check if `rawgle.com` is deployed via Pages
- [ ] If yes, verify:
  - Connected Git repository
  - Branch deployments (production vs preview)
  - Build configuration
  - Custom domains
  - Functions (_workers.js files)
- [ ] Check if Pages and Vercel are conflicting

---

### Phase 2: Redirect & Page Rules

#### Redirect Rules
- [ ] **Location:** Dashboard → Rules → Redirect Rules
- [ ] Document ALL redirect rules for `rawgle.com`:
  - Source pattern
  - Destination URL
  - Status code (301, 302, 307, 308)
  - Enabled/Disabled status
- [ ] Known issue: `/api/*` → `api.rawgle.com` (Status: 200)
- [ ] Check for:
  - `/v2/api/*` redirects (should NOT exist)
  - Wildcard redirects that could catch updates
  - Domain redirects (www vs non-www)

#### Page Rules
- [ ] **Location:** Dashboard → Rules → Page Rules
- [ ] Document all Page Rules for `*.rawgle.com`:
  - URL pattern
  - Settings (Cache Level, Browser Cache TTL, etc.)
  - Priority order
- [ ] Check for legacy rules that might override Workers

#### Transform Rules
- [ ] **Location:** Dashboard → Rules → Transform Rules
- [ ] Check HTTP Request Header Modifications
- [ ] Check HTTP Response Header Modifications
- [ ] Check URL Rewrites (could interfere with routing)
- [ ] Check Managed Transforms

---

### Phase 3: Caching Configuration

#### Cache Rules
- [ ] **Location:** Dashboard → Caching → Cache Rules
- [ ] Document caching rules for `rawgle.com`:
  - URL matching patterns
  - Cache eligibility criteria
  - Edge TTL settings
  - Browser TTL settings
  - Cache key configuration
- [ ] Check if `/api/*` or `/v2/api/*` are being cached
- [ ] Verify bypass rules for dynamic content

#### Browser Cache TTL
- [ ] **Location:** Dashboard → Caching → Configuration
- [ ] Check "Browser Cache TTL" setting
- [ ] Recommended: "Respect Existing Headers" for API routes

#### Edge Cache TTL
- [ ] Check default Edge Cache TTL
- [ ] Verify if HTML pages are cached
- [ ] Check if API responses are cached

#### Development Mode
- [ ] **Location:** Dashboard → Caching → Configuration
- [ ] Check if Development Mode is enabled (bypasses cache)
- [ ] Note: Development Mode auto-expires after 3 hours

#### Cache Purge
- [ ] **Action Item:** Purge cache for:
  - [ ] Everything
  - [ ] Specific URLs: `/api/*`, `/v2/api/*`
  - [ ] Custom purge for `*.rawgle.com/*`

---

### Phase 4: DNS & Proxy Settings

#### DNS Records
- [ ] **Location:** Dashboard → DNS → Records
- [ ] Document DNS records for `rawgle.com`:
  - `A` records
  - `CNAME` records (especially for `www`, `api`, etc.)
  - Proxy status (orange cloud = proxied, gray cloud = DNS only)
- [ ] Verify:
  - `www.rawgle.com` → Vercel (should be CNAME with proxy enabled)
  - `api.rawgle.com` → Where does this point?
  - Any subdomain conflicts

#### Proxy Status
- [ ] Check which records are proxied through Cloudflare
- [ ] Records proxied = subject to Workers, rules, caching
- [ ] Records not proxied = direct to origin (Vercel)

---

### Phase 5: Security & Firewall

#### WAF (Web Application Firewall)
- [ ] **Location:** Dashboard → Security → WAF
- [ ] Check custom WAF rules
- [ ] Verify no rules blocking `/api/*` or `/v2/api/*`
- [ ] Check rate limiting rules
- [ ] Review security events log

#### Security Level
- [ ] **Location:** Dashboard → Security → Settings
- [ ] Check Security Level (Low, Medium, High, I'm Under Attack)
- [ ] High levels can block legitimate traffic

#### Bot Fight Mode
- [ ] Check if enabled
- [ ] Could interfere with API calls

---

### Phase 6: Advanced Settings

#### Network Settings
- [ ] **Location:** Dashboard → Network
- [ ] Check HTTP/2, HTTP/3 settings
- [ ] WebSockets enabled?
- [ ] gRPC enabled?

#### Speed Settings
- [ ] **Location:** Dashboard → Speed → Optimization
- [ ] Auto Minify (HTML, CSS, JS)
- [ ] Brotli compression
- [ ] Could affect response content

#### SSL/TLS Settings
- [ ] **Location:** Dashboard → SSL/TLS
- [ ] Encryption mode (Full, Full Strict, Flexible)
- [ ] Edge Certificates
- [ ] Could affect Vercel connection

---

## Testing Checklist

After reviewing configurations, test these scenarios:

### Production Testing
- [ ] Clear Cloudflare cache completely
- [ ] Test `/api/diagnostics` (should return 404 or Cloudflare Workers response)
- [ ] Test `/v2/api/diagnostics` (should return Next.js response)
- [ ] Test with `curl -I` to see response headers:
  ```bash
  curl -I https://www.rawgle.com/v2/api/diagnostics
  # Look for: CF-Cache-Status, CF-Ray, Server headers
  ```
- [ ] Test with different subdomains:
  - `https://rawgle.com/v2/api/diagnostics`
  - `https://www.rawgle.com/v2/api/diagnostics`
  - `https://api.rawgle.com/diagnostics`

### Cache Bypass Testing
- [ ] Test with cache bypass headers:
  ```bash
  curl -H "Cache-Control: no-cache" https://www.rawgle.com/v2/test
  ```
- [ ] Test with query string cache bust:
  ```bash
  curl https://www.rawgle.com/v2/test?nocache=timestamp
  ```

### Deployment Verification
- [ ] Deploy a test change to Vercel
- [ ] Wait for deployment to complete
- [ ] Purge Cloudflare cache
- [ ] Verify change is visible within 1 minute
- [ ] If not visible → Cloudflare blocking detected

---

## Investigation Commands

```bash
# Check DNS resolution
dig www.rawgle.com
dig api.rawgle.com

# Check what's serving the content
curl -I https://www.rawgle.com/v2/test

# Check CF headers
curl -sI https://www.rawgle.com/v2/test | grep -i "cf-"

# Test API endpoint directly
curl https://www.rawgle.com/v2/api/diagnostics | jq

# Check if Workers is intercepting
curl https://www.rawgle.com/api/diagnostics
# vs
curl https://rawgle.com/api/diagnostics (via Workers)
```

---

## Common Cloudflare Issues That Block Updates

### Issue 1: Workers Intercepting Requests
- **Symptom:** Code updates not appearing
- **Cause:** Workers script has routes that match updated paths
- **Fix:** Update Worker routes or bypass with different path prefix

### Issue 2: Aggressive Caching
- **Symptom:** Old content showing despite new deployment
- **Cause:** Long Edge Cache TTL, Browser Cache TTL
- **Fix:** Purge cache + adjust TTL settings

### Issue 3: Redirect Rules
- **Symptom:** Requests going to wrong destination
- **Cause:** Redirect rules catching updated paths
- **Fix:** Update redirect patterns or add exceptions

### Issue 4: Page Rules Override
- **Symptom:** Cache settings not respecting API headers
- **Cause:** Page Rules have higher priority than Cache Rules
- **Fix:** Reorder or remove conflicting Page Rules

### Issue 5: Cloudflare Pages Conflict
- **Symptom:** Two different builds serving same domain
- **Cause:** Both Cloudflare Pages AND Vercel connected
- **Fix:** Choose one deployment platform

### Issue 6: DNS Caching
- **Symptom:** Domain pointing to old server
- **Cause:** DNS TTL not expired, local DNS cache
- **Fix:** Wait for TTL, flush local DNS cache

---

## Immediate Action Items

1. **Access Cloudflare Dashboard:**
   - URL: https://dash.cloudflare.com/3e02a16d99fcee4a071c58d876dbc4ea
   - Account: (need account owner access)

2. **Screenshot Critical Settings:**
   - Workers routes
   - Redirect Rules
   - Cache Rules
   - DNS Records

3. **Purge All Cache:**
   - Dashboard → Caching → Configuration → Purge Everything
   - Or via API:
     ```bash
     curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
       -H "Authorization: Bearer {api_token}" \
       -H "Content-Type: application/json" \
       --data '{"purge_everything":true}'
     ```

4. **Document Current State:**
   - Export all Workers code
   - Export all redirect rules
   - Screenshot cache settings
   - Save to repository for future reference

---

## Expected Outcomes

After completing this audit, you should know:

1. **Exactly what Cloudflare is intercepting:**
   - Which paths are caught by Workers
   - Which paths are cached
   - Which paths are redirected

2. **Why updates weren't visible:**
   - Specific configuration causing the block
   - Whether it's caching, redirects, or Workers

3. **How to prevent future issues:**
   - Recommended Cloudflare configuration
   - Path patterns to avoid
   - Cache purge workflow

4. **Best practices:**
   - Use `/v2/*` prefix for Cloudflare-bypass routes
   - Set proper Cache-Control headers in Next.js
   - Document all Cloudflare rules in repository
   - Test deployments with cache purge

---

## Next Steps After Audit

1. **Create Cloudflare Configuration Documentation:**
   - File: `CLOUDFLARE_CONFIG.md`
   - Document all active rules
   - Explain why each rule exists
   - Note which paths are affected

2. **Implement Monitoring:**
   - Add deployment verification script
   - Auto-purge Cloudflare cache after Vercel deploy
   - Health check endpoints to verify live status

3. **Establish Deployment Process:**
   - Pre-deployment checklist
   - Post-deployment verification
   - Rollback procedure

---

**Remember:** Cloudflare sits BETWEEN users and Vercel. Any request can be intercepted, cached, redirected, or blocked at multiple layers. A systematic audit is the only way to find all potential issues.
