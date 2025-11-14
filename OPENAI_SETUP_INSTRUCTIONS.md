# OpenAI API Key Setup for AI Chatbot

## Issue: AI Chatbot ("Dr. Raw") Not Working

**Root Cause:** OpenAI API key not configured (currently set to placeholder).

**Solution:** Add real OpenAI API key from OpenAI platform.

---

## Step 1: Get OpenAI API Key

### Option A: From Existing Key

If you already have an OpenAI API key:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Login to your account
3. Navigate to **API Keys**
4. Copy your existing key OR create a new one

### Option B: Create New Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name: `Rawgle AI Chatbot`
4. Set permissions (if asked):
   - ✅ Read access
   - ✅ Write access
   - Scope: All (or specific to chat completions)
5. **IMPORTANT:** Copy the key immediately (you won't see it again)

### Cost Estimate:

The AI chatbot uses `gpt-4o-mini` model which is very affordable:

- **Model:** gpt-4o-mini
- **Cost:** ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Average chat:** ~500 tokens = $0.0004 (~0.04 cents per message)
- **100 messages/day:** ~$0.04/day = **~$1.20/month**

Very cheap for production use!

---

## Step 2: Add Key to Environment

### For Local Development:

Edit `/home/user/rawgle-frontend/.env.local`:

```bash
# ============================================
# OpenAI Configuration (AI Chatbot)
# ============================================
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### For Production (Vercel):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `rawgle` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `sk-proj-your-actual-key-here`
   - **Environment:** Production, Preview, Development (all)
5. Redeploy the site for changes to take effect

---

## Step 3: Restart Server

### Local Development:

```bash
# Kill existing server
pkill -f "next dev"

# Restart with new API key
cd /home/user/rawgle-frontend
npm run dev > /tmp/rawgle-dev.log 2>&1 &
```

### Production:

Vercel will automatically redeploy when you save environment variables (if auto-deploy is enabled), OR:

```bash
# Manual redeploy via Vercel CLI
vercel --prod
```

---

## Step 4: Test AI Chatbot

### Via Browser:

1. Go to http://localhost:3005/ai-assistant (local) or https://www.rawgle.com/ai-assistant (production)
2. Type a test message: "What is the best raw diet for my dog?"
3. Click Send
4. **Expected:** AI responds with personalized advice
5. **If error:** Check server logs for details

### Via API:

```bash
# Test the chat API endpoint
curl -X POST http://localhost:3005/api/chat \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is the best raw diet for my dog?"
      }
    ]
  }'
```

**Expected response:**
```json
{
  "message": "I'd be happy to help you with raw diet advice for your dog! ...",
  "timestamp": "2025-11-14T18:30:00.000Z"
}
```

**Error response (no API key):**
```json
{
  "error": "OpenAI API key not configured",
  "message": "Please add OPENAI_API_KEY to environment variables"
}
```

---

## Current Implementation

### AI Chatbot Features:

**Component:** `/src/app/ai-assistant/page.tsx`
**API Route:** `/src/app/api/chat/route.ts`

**Features:**
- ✅ Personalized pet nutrition advice
- ✅ Rate limiting (10 messages/minute)
- ✅ Chat history
- ✅ Input sanitization (XSS protection)
- ✅ Copy/rate responses
- ✅ Real-time streaming responses
- ✅ User-specific chat sessions

**Model Configuration:**
```typescript
// From api/chat/route.ts
model: openai('gpt-4o-mini'),
temperature: 0.7,
maxTokens: 1000
```

**Rate Limiting:**
- 10 messages per minute per user
- Prevents API abuse
- Configurable per user ID

**Security:**
- Input sanitization
- XSS protection
- API key never exposed to client
- User ID required (x-user-id header)

---

## Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution:**
1. Verify `OPENAI_API_KEY` is in `.env.local`
2. Key should start with `sk-proj-` or `sk-`
3. No extra spaces or quotes around the key
4. Restart server after adding key

### Issue: "Invalid API key"

**Possible causes:**
- Key is incorrect (typo when copying)
- Key was revoked/deleted from OpenAI platform
- Key doesn't have proper permissions

**Solution:**
1. Go back to OpenAI platform
2. Verify key is active
3. Create a new key if needed
4. Update environment variables

### Issue: "Rate limit exceeded"

**Two types:**

**A) User Rate Limit (10 msg/min):**
- Wait 1 minute before sending more messages
- This is intentional to prevent abuse

**B) OpenAI API Rate Limit:**
- You've exceeded OpenAI's API quota
- Check your OpenAI dashboard for limits
- Upgrade plan or wait for limit reset

### Issue: "Slow responses"

**Normal behavior:**
- Streaming responses take 2-5 seconds
- This is expected for AI generation

**If slower than 10 seconds:**
- Check OpenAI API status: https://status.openai.com
- Check network connectivity
- Consider using smaller model (already using gpt-4o-mini)

---

## API Key Security Best Practices

### ✅ DO:
- Keep API keys in environment variables
- Never commit keys to git
- Use different keys for dev/prod
- Rotate keys periodically
- Monitor usage in OpenAI dashboard

### ❌ DON'T:
- Hard-code keys in source code
- Share keys publicly
- Use same key across multiple projects
- Commit `.env` files to version control

### Current Security Status:

✅ **Protected:**
- API key in environment variables
- `.env.local` in `.gitignore`
- Key never exposed to client-side
- Rate limiting implemented

---

## Cost Monitoring

### Check Usage:

1. Go to [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. View usage by:
   - Day
   - Model
   - Request count
   - Token count

### Set Budget Alerts:

1. Go to [OpenAI Billing](https://platform.openai.com/account/billing/overview)
2. Set up usage limits:
   - Monthly budget cap
   - Email alerts at thresholds

**Recommended for Rawgle:**
- Monthly cap: $50 (very generous)
- Alert at: $25, $40, $45

---

## Production Status

❌ **Production (www.rawgle.com) - AI Chatbot NOT working**
- OpenAI API key not configured OR invalid
- Need to add key to Vercel environment variables

❌ **Local Development (10.90.10.82:3005) - AI Chatbot NOT working**
- Currently using placeholder key: `sk-proj-placeholder`
- Needs real API key

---

## Alternative Models (Future)

If OpenAI costs become an issue, consider:

### Option A: Anthropic Claude (via API)
- Similar quality to GPT-4
- Competitive pricing
- Requires different integration

### Option B: Local LLM (Ollama + Qwen)
- Free (no API costs)
- Runs on local server
- Already set up in MCP Code Builder
- Requires more RAM/GPU

### Option C: Google Gemini
- Free tier available
- Lower quality for nutrition advice
- Easier to get started

**Current choice (gpt-4o-mini) is best balance of:**
- ✅ Quality responses
- ✅ Low cost (~$1-2/month)
- ✅ Fast responses
- ✅ Easy integration

---

## Quick Reference

**Environment File:** `/home/user/rawgle-frontend/.env.local`

**Required Variable:**
```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

**API Endpoint:** `POST /api/chat`

**Test URL:** http://localhost:3005/ai-assistant

**Restart Command:**
```bash
pkill -f "next dev" && cd /home/user/rawgle-frontend && npm run dev > /tmp/rawgle-dev.log 2>&1 &
```

**Check Logs:**
```bash
tail -f /tmp/rawgle-dev.log | grep -i "openai\|chat"
```

**Cost Calculator:**
```
Messages/day × 500 tokens × $0.0004 = Daily cost
Daily cost × 30 = Monthly cost

Example: 100 messages/day = $1.20/month
```

---

**Status:** Awaiting OpenAI API key from user.

**Get Key:** https://platform.openai.com/api-keys
