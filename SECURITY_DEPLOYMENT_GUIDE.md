# Security Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Set `NEXT_PUBLIC_APP_URL` in environment variables
- [ ] Verify `.env.local` is not committed to git
- [ ] Review all environment variables for security

### 2. Code Review
- [ ] Review all security changes
- [ ] Test middleware functionality
- [ ] Verify API authentication
- [ ] Check CORS configuration

### 3. Dependencies
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update critical dependencies
- [ ] Review package.json for unnecessary packages

## Deployment Steps

### Step 1: Build and Test Locally

```bash
# Install dependencies
npm install

# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Build the application
npm run build

# Test the build
npm start
```

### Step 2: Test Security Headers Locally

```bash
# Start the local server
npm start

# In another terminal, test headers
curl -I http://localhost:3000

# Verify these headers are present:
# - Content-Security-Policy
# - X-Frame-Options
# - X-Content-Type-Options
# - Referrer-Policy
# - Permissions-Policy
```

### Step 3: Test API Authentication

```bash
# Test unauthenticated request (should fail)
curl http://localhost:3000/api/notifications

# Expected: {"error":"Unauthorized - User ID required"}

# Test authenticated request (should succeed)
curl -H "x-user-id: demo-user" http://localhost:3000/api/notifications

# Expected: {"data":[...]}
```

### Step 4: Deploy to Vercel

```bash
# Deploy to preview
vercel

# Or deploy to production
vercel --prod
```

### Step 5: Verify Production Deployment

```bash
# Test production headers
curl -I https://www.rawgle.com

# Test production API
curl https://www.rawgle.com/api/notifications
```

## Post-Deployment Verification

### Security Headers Check

Use online tools to verify:
1. **Mozilla Observatory:** https://observatory.mozilla.org
2. **Security Headers:** https://securityheaders.com
3. **SSL Labs:** https://www.ssllabs.com/ssltest/

Expected scores:
- Mozilla Observatory: A or A+
- Security Headers: A
- SSL Labs: A or A+

### Manual Testing

#### 1. CSP Verification
```javascript
// In browser console on https://www.rawgle.com
// Try to inject script (should be blocked)
const script = document.createElement('script');
script.src = 'https://evil.com/malicious.js';
document.body.appendChild(script);
// Should see CSP violation in console
```

#### 2. Frame Embedding Test
```html
<!-- Create test.html -->
<!DOCTYPE html>
<html>
<head><title>Frame Test</title></head>
<body>
  <iframe src="https://www.rawgle.com"></iframe>
</body>
</html>
```
Open test.html - iframe should be blocked.

#### 3. CORS Test
```javascript
// From a different domain (e.g., https://example.com)
fetch('https://www.rawgle.com/api/pets')
  .then(r => console.log('Should be blocked by CORS'))
  .catch(e => console.log('Blocked:', e));
```

### API Security Testing

```bash
# Test all endpoints require authentication
curl https://www.rawgle.com/api/notifications # Should return 401
curl https://www.rawgle.com/api/pets # Should return 401
curl https://www.rawgle.com/api/feeding # Should return 401

# Test with valid authentication
curl -H "x-user-id: demo-user" https://www.rawgle.com/api/notifications
# Should return 200 with data
```

## Monitoring Setup

### 1. Set Up CSP Reporting

Add to `src/app/api/csp-report/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const report = await request.json();

  // Log CSP violations
  console.error('CSP Violation:', {
    timestamp: new Date().toISOString(),
    report,
  });

  // Optional: Send to monitoring service
  // await sendToMonitoring(report);

  return NextResponse.json({ received: true });
}
```

Update middleware CSP:
```typescript
'Content-Security-Policy': '... report-uri /api/csp-report; ...'
```

### 2. Set Up Error Monitoring

Consider integrating:
- **Sentry:** For error tracking
- **LogRocket:** For session replay
- **Datadog:** For infrastructure monitoring

### 3. Set Up Security Alerts

Configure alerts for:
- Failed authentication attempts
- CSP violations
- Unusual traffic patterns
- API rate limit violations

## Cloudflare Configuration

### Recommended Settings

1. **SSL/TLS:**
   - Mode: Full (strict)
   - Minimum TLS Version: 1.2
   - TLS 1.3: Enabled
   - Automatic HTTPS Rewrites: On

2. **Firewall Rules:**
   ```
   Rule 1: Block suspicious user agents
   (http.user_agent contains "bot" and not cf.client.bot)
   Action: Block

   Rule 2: Rate limit API
   (http.request.uri.path contains "/api/")
   Action: Rate limit (100 requests/minute)
   ```

3. **Page Rules:**
   ```
   Rule 1: Cache API responses (where appropriate)
   URL: www.rawgle.com/api/public/*
   Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 hour

   Rule 2: Force HTTPS
   URL: *rawgle.com/*
   Settings: Always Use HTTPS: On
   ```

4. **Security Level:**
   - Set to "High" or "Medium"
   - Enable Bot Fight Mode
   - Enable Browser Integrity Check

### DNS Configuration

```
A     @              <Vercel-IP>    Proxied
CNAME www            <Vercel-URL>   Proxied
```

## Rollback Plan

If issues are discovered post-deployment:

### Quick Rollback (Vercel)

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Disable Security Features

If security headers cause issues, temporarily disable in middleware:

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Comment out problematic headers
  // response.headers.set('Content-Security-Policy', ...);

  return response;
}
```

Then deploy the fix:
```bash
vercel --prod
```

## Gradual Rollout Strategy

For zero-downtime deployment:

### 1. Deploy to Preview
```bash
vercel
# Get preview URL
```

### 2. Test Preview
- Run all security tests
- Check functionality
- Verify headers

### 3. Canary Deployment
```bash
# Deploy to 10% of traffic
vercel --prod
```

Monitor for:
- Error rates
- Performance metrics
- CSP violations
- User complaints

### 4. Full Rollout
If canary is successful:
```bash
# Scale to 100%
vercel promote <deployment-url>
```

## Troubleshooting

### Issue: CSP Blocks Legitimate Scripts

**Symptoms:** Console shows CSP violations for your own scripts

**Fix:**
1. Identify the blocked resource
2. Add to CSP allowlist in middleware:
```typescript
"script-src 'self' https://trusted-domain.com"
```
3. Redeploy

### Issue: CORS Blocks Legitimate Requests

**Symptoms:** API calls fail with CORS errors

**Fix:**
1. Add origin to allowlist in middleware:
```typescript
const allowedOrigins = [
  'https://www.rawgle.com',
  'https://app.rawgle.com', // Add new origin
];
```
2. Redeploy

### Issue: Authentication Fails

**Symptoms:** All API requests return 401

**Fix:**
1. Verify `x-user-id` header is being sent
2. Check middleware is not stripping headers
3. Review authentication logic

### Issue: Performance Degradation

**Symptoms:** Slow page loads after deployment

**Fix:**
1. Check middleware is not adding excessive processing
2. Verify CSP is not too restrictive
3. Review Cloudflare caching rules
4. Monitor server resources

## Verification Commands

### Quick Security Check
```bash
#!/bin/bash
# save as security-check.sh

echo "Testing security headers..."
curl -sI https://www.rawgle.com | grep -E "Content-Security-Policy|X-Frame-Options|X-Content-Type|Referrer-Policy"

echo -e "\nTesting API authentication..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.rawgle.com/api/notifications)
if [ $STATUS -eq 401 ]; then
  echo "✓ API properly requires authentication"
else
  echo "✗ WARNING: API accessible without authentication (Status: $STATUS)"
fi

echo -e "\nTesting CORS..."
curl -H "Origin: https://evil.com" -I https://www.rawgle.com/api/pets 2>&1 | grep -i "access-control"
```

Run after deployment:
```bash
chmod +x security-check.sh
./security-check.sh
```

## Documentation Updates

After deployment, update:
- [ ] README.md with new security features
- [ ] API documentation with authentication requirements
- [ ] User documentation (if affected)
- [ ] Team wiki/knowledge base

## Communication Plan

### Internal Team
- Notify dev team of deployment
- Share security testing results
- Document any issues encountered

### Users (if applicable)
- Announce enhanced security (blog post)
- Explain any user-facing changes
- Provide support for issues

### Stakeholders
- Report on security improvements
- Share audit results
- Outline next steps

## Success Criteria

Deployment is successful when:
- ✅ All security headers present in production
- ✅ API authentication working correctly
- ✅ No increase in error rates
- ✅ Security scanners show A grade
- ✅ No CSP violations for legitimate traffic
- ✅ Application performance maintained
- ✅ No user complaints about broken functionality

## Next Steps After Deployment

1. **Monitor for 48 hours:**
   - Watch error logs
   - Review CSP violations
   - Check user feedback

2. **Fine-tune CSP:**
   - Analyze violation reports
   - Adjust policy as needed
   - Remove unsafe-inline/unsafe-eval if possible

3. **Plan next security improvements:**
   - CSRF protection
   - Rate limiting
   - Input sanitization
   - Penetration testing

4. **Schedule security review:**
   - Monthly: Review security logs
   - Quarterly: Run security audit
   - Annually: Penetration testing

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Verification By:** _______________
**Sign-off By:** _______________
