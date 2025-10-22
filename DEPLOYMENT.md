# Rawgle Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel or any production environment, verify all these items:

### 1. Environment Variables

All required environment variables must be configured in your deployment platform:

#### Required Variables

- `OPENAI_API_KEY` - OpenAI API key for AI Assistant feature
  - Get your key from: https://platform.openai.com/api-keys
  - **Required for**: AI Pet Nutritionist page to function
  - **If missing**: Users will see setup instructions in the chat

#### Optional Variables

- `NEXT_PUBLIC_RAWGLE_API_URL` - API URL (defaults to localhost)
- `NEXT_PUBLIC_APP_NAME` - App name (defaults to RAWGLE)
- `NEXT_PUBLIC_APP_URL` - App URL for meta tags

### 2. Vercel Setup

#### Adding Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `OPENAI_API_KEY`)
   - **Value**: The actual value
   - **Environments**: Select Production, Preview, and Development as needed
4. Click **Save**
5. **Redeploy** your application for changes to take effect

#### Triggering Redeployment

After adding environment variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots menu
4. Select **Redeploy**

OR

1. Make a small commit to your repository
2. Push to trigger automatic deployment

### 3. Build Verification

Before deploying, always run a local build:

```bash
npm run build
```

Check for:
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ All pages compile successfully
- ✅ Build completes without warnings

### 4. Feature Testing Checklist

Test these features locally before deployment:

#### AI Assistant
- [ ] Navigate to `/ai-assistant`
- [ ] Send a test message
- [ ] Verify response streams correctly
- [ ] Check error handling (temporarily remove API key to test)

#### Pet Management
- [ ] Create a new pet
- [ ] Edit pet details
- [ ] Delete a pet
- [ ] Verify pets persist across page refreshes

#### Feeding Tracker
- [ ] Create a feeding schedule
- [ ] Add ingredients and supplements
- [ ] Verify schedule displays in list
- [ ] Log a manual feeding
- [ ] Check feeding history

#### Health Tracker
- [ ] Add a health record
- [ ] View health timeline
- [ ] Edit/delete records

#### Medications
- [ ] Add a medication
- [ ] Set reminders
- [ ] Mark as taken

### 5. Package Versions

Ensure all packages are up to date:

```bash
npm outdated
```

Current versions (as of deployment):
- Next.js: 15.5.6
- React: 19.2.0
- TypeScript: 5.7.3
- ai SDK: 5.0.76

### 6. Production Considerations

#### Performance
- [ ] Images are optimized
- [ ] No console.log in production code
- [ ] API routes use proper caching
- [ ] Database queries are optimized

#### Security
- [ ] No API keys in client-side code
- [ ] All user inputs are validated
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed

#### Error Handling
- [ ] All API routes have try-catch
- [ ] User-friendly error messages
- [ ] Errors are logged (not just console)
- [ ] 404 and 500 pages are styled

## Common Deployment Issues

### Issue: AI Assistant not responding

**Cause**: Missing `OPENAI_API_KEY` environment variable

**Solution**:
1. Add the variable in Vercel Settings → Environment Variables
2. Redeploy the application
3. The assistant will show helpful setup instructions if key is missing

### Issue: Build fails with module not found

**Cause**: Dependencies not installed or outdated

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript errors during build

**Cause**: Type definitions out of sync

**Solution**:
```bash
npm install --save-dev @types/react@latest @types/node@latest
npm run build
```

### Issue: Edge runtime errors

**Cause**: Using Node.js-only APIs in edge runtime

**Solution**: Check `/api/chat/route.ts` - it uses `export const runtime = 'edge'`
- Ensure no Node.js built-ins (fs, path, etc.) are used
- Use Web APIs instead

## Post-Deployment Verification

After deployment, test on production:

1. **Visit the deployed URL**
2. **Test AI Assistant** - Send a message and verify response
3. **Create test pet** - Ensure data persists
4. **Check all navigation** - All pages load correctly
5. **Test responsive design** - Check mobile and desktop views
6. **Verify analytics** - If using analytics, check events fire

## Rollback Procedure

If deployment has critical issues:

1. Go to Vercel **Deployments** tab
2. Find the last working deployment
3. Click three dots → **Promote to Production**
4. Fix issues locally
5. Redeploy when ready

## Environment-Specific Settings

### Development (.env.local)
```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)
```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://rawgle.vercel.app
```

## Continuous Integration

### Automated Checks (Recommended)

Add to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Support

If you encounter deployment issues:

1. Check Vercel build logs
2. Review this checklist
3. Test locally with `npm run build`
4. Check environment variables are set correctly
5. Verify all dependencies are installed

---

Last updated: 2025-10-21
