# 📋 ACTION ITEMS FOR MATT - RAWGLE LAUNCH

**Last Updated:** October 23, 2025
**Platform Status:** ✅ 100% Complete - Ready for Production

---

## 🎯 IMMEDIATE ACTIONS (Required Before Testing)

### 1. Create Stripe Account ⏱️ 15 minutes

**URL:** https://dashboard.stripe.com/register

**Steps:**
1. Go to Stripe registration page
2. Create account with your email
3. Choose "Start now" (test mode)
4. Complete basic business information
5. **Stay in Test Mode** for now (don't activate live mode yet)

**Why:** Required for payment processing

---

### 2. Get Stripe API Keys ⏱️ 5 minutes

**URL:** https://dashboard.stripe.com/test/apikeys

**Steps:**
1. Log into Stripe Dashboard
2. Click "Developers" in left sidebar
3. Click "API keys"
4. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_` - click "Reveal")

**⚠️ IMPORTANT:** Keep Secret key private! Never commit to git.

---

### 3. Set Up Stripe Webhook ⏱️ 5 minutes

**URL:** https://dashboard.stripe.com/test/webhooks

**Steps:**
1. Click "Developers" → "Webhooks"
2. Click "+ Add endpoint"
3. Enter endpoint URL:
   - **Development:** `http://localhost:3005/api/webhooks/stripe`
   - **Production:** `https://your-domain.vercel.app/api/webhooks/stripe`
4. Click "Select events"
5. Add these events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
6. Click "Add endpoint"
7. Copy the **Signing secret** (starts with `whsec_`)

**Why:** Allows Stripe to notify your app about payment events

---

### 4. Update Environment Variables ⏱️ 3 minutes

**File:** `/Users/mattwright/pandora/rawgle-frontend/.env.local`

**Action:** Add these lines to your `.env.local` file:

```bash
# Stripe Configuration (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_PASTE_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_PASTE_YOUR_KEY_HERE

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3005
```

**Replace:**
- `pk_test_PASTE_YOUR_KEY_HERE` with your Publishable key from Step 2
- `sk_test_PASTE_YOUR_KEY_HERE` with your Secret key from Step 2
- `whsec_PASTE_YOUR_KEY_HERE` with your Signing secret from Step 3

**Verify:** Make sure `.env.local` is in `.gitignore` (it already is)

---

### 5. Test The Platform ⏱️ 10 minutes

**Commands:**
```bash
cd /Users/mattwright/pandora/rawgle-frontend
npm run dev
```

**Test Flow:**
1. Open browser: http://localhost:3005
2. Go to Shop page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Use test card number: `4242 4242 4242 4242`
6. Any future expiry date (e.g., 12/25)
7. Any 3-digit CVC (e.g., 123)
8. Any ZIP code (e.g., 12345)
9. Complete checkout
10. Verify you see success page
11. Go to Dashboard → scroll to Order History
12. Verify your order appears

**✅ SUCCESS:** If you see your order in history, everything works!

---

## 🏢 BUSINESS SETUP (Can Do Async)

### 6. Delaware Company Registration ⏱️ 1-2 weeks

**Options:**

#### Option A: Stripe Atlas (Recommended for Startups)
- **Cost:** $500
- **URL:** https://stripe.com/atlas
- **Includes:**
  - Delaware C-Corp formation
  - EIN (tax ID)
  - 83(b) election filing
  - Banking and tax setup help
  - Stripe integration
- **Time:** 1-2 weeks
- **Best For:** First-time founders, want guidance

#### Option B: LegalZoom
- **Cost:** $149 + state fees (~$250 total)
- **URL:** https://www.legalzoom.com
- **Time:** 1-2 weeks
- **Best For:** Cost-conscious, some experience

#### Option C: IncFile
- **Cost:** $0 + state fees (~$200 total)
- **URL:** https://www.incfile.com
- **Time:** 2-3 weeks
- **Best For:** Budget option

#### Option D: DIY (Not Recommended)
- **Cost:** ~$200 in state fees
- **URL:** https://icis.corp.delaware.gov/ecorp/
- **Time:** Variable
- **Best For:** Experienced founders only

**My Recommendation:** Use Stripe Atlas if budget allows - it handles everything and integrates perfectly with your Stripe account.

**Action Items After Formation:**
- [ ] Get EIN from IRS
- [ ] File 83(b) election (if taking equity)
- [ ] Set up registered agent in Delaware
- [ ] Get business address (can use virtual office)

---

### 7. Business Bank Account ⏱️ 2-5 days approval

**Required Documents:**
- EIN (from company formation)
- Articles of Incorporation
- Operating Agreement (if LLC) or Bylaws (if C-Corp)
- Personal ID

**Top Options:**

#### Option A: Mercury (Recommended)
- **URL:** https://mercury.com
- **Pros:**
  - Startup-friendly
  - Quick approval (1-3 days)
  - No monthly fees
  - Great for Stripe integration
  - Modern interface
- **Cons:**
  - Online only (no branches)

#### Option B: Brex
- **URL:** https://brex.com
- **Pros:**
  - Corporate cards included
  - Good rewards program
  - Expense management
- **Cons:**
  - May require venture funding

#### Option C: Traditional Bank (Chase, BoA)
- **Pros:**
  - Physical branches
  - Established reputation
- **Cons:**
  - Slower approval (5-10 days)
  - Monthly fees
  - More paperwork

**My Recommendation:** Mercury for speed and ease, especially for tech startups.

**After Account Approval:**
- [ ] Add bank account to Stripe for payouts
- [ ] Set up accounting software (QuickBooks, Xero)
- [ ] Get business credit card

---

### 8. Production Deployment Setup ⏱️ 30 minutes

**When:** After testing works locally

**Vercel Environment Variables:**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add ALL variables from `.env.local`
3. **IMPORTANT:** Use LIVE Stripe keys for production:
   - `pk_live_xxx` instead of `pk_test_xxx`
   - `sk_live_xxx` instead of `sk_test_xxx`
   - Create new live webhook at https://dashboard.stripe.com/webhooks

**Production Checklist:**
- [ ] Switch Stripe to Live mode
- [ ] Update API keys in Vercel
- [ ] Update webhook endpoint URL
- [ ] Test production checkout
- [ ] Verify orders are created
- [ ] Check Stripe dashboard for payments

---

## 📝 ONGOING TASKS

### 9. Email Notifications (Future Enhancement)

**Service Options:**
- **Resend** (recommended) - https://resend.com
- **SendGrid** - https://sendgrid.com
- **Postmark** - https://postmarkapp.com

**Needed For:**
- Order confirmations
- Shipping notifications
- Password resets
- Marketing emails

**Estimated Time:** 2-3 hours to implement

---

### 10. Analytics & Monitoring (Optional)

**Analytics:**
- **Plausible** - Privacy-friendly: https://plausible.io
- **Google Analytics** - Free, comprehensive
- **PostHog** - Product analytics: https://posthog.com

**Error Monitoring:**
- **Sentry** - Error tracking: https://sentry.io
- **LogRocket** - Session replay: https://logrocket.com

**Estimated Time:** 1-2 hours to set up

---

## ✅ VERIFICATION CHECKLIST

### Before Stripe Setup:
- [x] Platform code complete
- [x] All features implemented
- [x] Deployed to Vercel
- [ ] Local development server running

### After Stripe Setup:
- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Webhook configured
- [ ] Environment variables updated
- [ ] Test checkout completed successfully
- [ ] Order appears in history

### Before Production Launch:
- [ ] Delaware company formed
- [ ] EIN obtained
- [ ] Business bank account opened
- [ ] Stripe in Live mode
- [ ] Production environment variables set
- [ ] Test production checkout
- [ ] Legal pages reviewed (Terms, Privacy)

### Post-Launch:
- [ ] Monitor Stripe dashboard daily
- [ ] Check order fulfillment
- [ ] Respond to customer emails
- [ ] Track analytics
- [ ] Monitor errors

---

## 🆘 TROUBLESHOOTING

### "Stripe API key not found"
**Solution:** Check `.env.local` has all three Stripe variables

### "Webhook signature verification failed"
**Solution:**
1. Verify webhook secret is correct
2. Make sure endpoint URL matches exactly
3. For local testing, use Stripe CLI

### "Checkout redirect not working"
**Solution:** Ensure `NEXT_PUBLIC_BASE_URL` is set correctly

### "Orders not showing in history"
**Solution:**
1. Check browser console for errors
2. Verify order API is responding: http://localhost:3005/api/orders
3. Check network tab in DevTools

---

## 📞 SUPPORT RESOURCES

### Stripe Support
- **Docs:** https://stripe.com/docs
- **Support:** https://support.stripe.com
- **Test Cards:** https://stripe.com/docs/testing

### Platform Documentation
- **Setup Guide:** `STRIPE_INTEGRATION_GUIDE.md`
- **Complete Docs:** `PLATFORM_COMPLETE_100_PERCENT.md`
- **Baseline:** `BASELINE_COMPLETE_READY_FOR_TESTING.md`

### Developer Resources
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support

---

## 🎯 SUCCESS METRICS

Track these after launch:

### Week 1:
- Orders placed
- Revenue generated
- Conversion rate (visitors → buyers)
- Average order value

### Month 1:
- Total users
- Repeat purchase rate
- Customer acquisition cost
- Lifetime value

---

## 🎉 YOU'RE READY!

**Total Time Required (Before Launch):**
- Immediate actions: ~40 minutes
- Company formation: 1-2 weeks (async)
- Bank account: 2-5 days (async)

**You can start testing RIGHT NOW** with Stripe test mode!

**Next Step:** Create your Stripe account and get those API keys! 🚀

---

**Questions?** Check the documentation files or Stripe support links above.

**Good luck with your launch!** 💰🐾
