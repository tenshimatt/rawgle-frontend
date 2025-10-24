# Vercel KV Setup Guide

This guide explains how to set up Vercel KV (Redis) for persistent data storage in production.

## Why Vercel KV?

The Pet and Cart APIs have been migrated from in-memory storage to **Vercel KV** (Redis) to ensure data persists across serverless function cold starts. Without KV storage, pets and cart items would disappear when functions restart.

## Setup Instructions

### 1. Create a Vercel KV Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV (Redis)**
5. Choose a name (e.g., "rawgle-kv")
6. Select your region (choose closest to your users)
7. Click **Create**

### 2. Link KV to Your Project

1. In the KV database page, click **Connect to Project**
2. Select your Vercel project (rawgle-frontend)
3. Select the environment: **Production** (also select Preview/Development if needed)
4. Click **Connect**

This automatically injects the following environment variables into your Vercel deployment:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. Local Development (Optional)

For local testing with real KV data:

1. In your KV database page, click **.env.local** tab
2. Copy the environment variables
3. Paste them into your `.env.local` file

**OR** use the Vercel CLI to pull environment variables:

```bash
vercel env pull .env.local
```

### 4. Redeploy Your Application

After connecting KV to your project:

```bash
git add .
git commit -m "Add Vercel KV for persistent storage"
git push origin main
```

Vercel will automatically redeploy with KV enabled.

## What Data is Stored?

### Pets API (`/api/pets`)
- **Key**: `pets:all`
- **Data**: Array of all pet objects
- **Operations**: GET, POST, PUT, DELETE pets

### Cart API (`/api/cart`)
- **Key**: `cart:{userId}` (e.g., `cart:demo-user`)
- **Data**: Array of cart items per user
- **Operations**: GET, POST, PATCH, DELETE cart items

## Pricing

Vercel KV is included in Vercel's Pro plan:
- **Free tier**: 256 MB storage, 30k commands/month
- **Pro plan**: 512 MB storage, 100k commands/month
- **Enterprise**: Custom limits

For most applications, the free tier is sufficient for development and small-scale production.

## Monitoring

View KV usage and data:
1. Go to Vercel Dashboard → Storage → Your KV Database
2. Click **Data Browser** to view stored keys and values
3. Monitor usage in the **Usage** tab

## Troubleshooting

### Local development shows "KV not configured" errors

**Solution**: Either:
- Add KV credentials to `.env.local` (from Vercel Dashboard)
- Run `vercel env pull .env.local` to sync environment variables
- Or test directly in production after deployment

### Data not persisting in production

**Checklist**:
1. Verify KV is connected to your project in Vercel Dashboard
2. Check environment variables are injected (Vercel → Settings → Environment Variables)
3. Redeploy after connecting KV
4. Check Vercel Function logs for KV connection errors

### "Cannot find module '@vercel/kv'" error

**Solution**: Ensure `@vercel/kv` is installed:
```bash
npm install @vercel/kv
```

## Migration Notes

### Before (In-Memory Storage)
```typescript
// Lost on serverless cold starts
const pets: Pet[] = [];
const cartStore = new Map<string, CartItem[]>();
```

### After (Vercel KV)
```typescript
import { kv } from '@vercel/kv';

// Persistent across restarts
const pets = await kv.get<Pet[]>('pets:all');
await kv.set('pets:all', pets);
```

## Additional Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Redis Data Types](https://redis.io/docs/data-types/)
- [@vercel/kv SDK Reference](https://vercel.com/docs/storage/vercel-kv/kv-reference)
