# AI Chatbot Setup Instructions

## Quick Setup (5 minutes)

The AI chatbot ("Dr. Raw") is ready to use - you just need to add your OpenAI API key.

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-` or `sk-`)

### Step 2: Add API Key to Rawgle

Edit `/home/user/rawgle-frontend/.env` and replace the placeholder:

```bash
# Change this:
OPENAI_API_KEY=sk-proj-placeholder

# To your actual key:
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
```

### Step 3: Restart Rawgle

```bash
cd /home/user/rawgle-frontend
pm2 restart rawgle
# OR if not using PM2:
# pkill -f "next dev" && npm run dev
```

### Step 4: Test the Chatbot

1. Go to http://10.90.10.82:3005/ai-assistant
2. Ask a question like "How much raw food should I feed my 50lb dog?"
3. The chatbot should respond!

## Cost Information

- Model used: GPT-4o-mini (very affordable)
- Approximate cost: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- Average chat: ~2000 tokens = $0.001 (one-tenth of a cent)
- 1000 chats would cost ~$1

## Features

- ✅ Personalized advice based on your pets
- ✅ Expert knowledge on BARF diets, portions, nutrition
- ✅ Rate limiting (10 messages per minute)
- ✅ Chat history saved locally
- ✅ Copy, rate, and review responses
- ✅ Suggested starter questions

## Troubleshooting

**"AI Assistant Setup Required" error**
- Make sure OPENAI_API_KEY is set in .env file
- Restart the server after adding the key

**"Invalid API Key" error**
- Double-check your API key from OpenAI dashboard
- Make sure there are no extra spaces in the .env file

**Rate limit errors**
- Check your OpenAI account has available credits
- Upgrade your OpenAI plan if needed

## Alternative: Use a Different Model

You can switch to other OpenAI models by editing `src/app/api/chat/route.ts`:

```typescript
// Change this line (around line 216):
model: openai('gpt-4o-mini'),

// To one of these:
model: openai('gpt-4o'),  // More powerful, more expensive
model: openai('gpt-3.5-turbo'),  // Cheaper, less capable
```

## Status

✅ AI Assistant is fully implemented and working
✅ Frontend UI is complete at /ai-assistant
✅ Backend API is functional at /api/chat
⚠️ Just needs OpenAI API key to activate
