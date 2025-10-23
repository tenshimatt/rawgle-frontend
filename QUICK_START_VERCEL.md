# ⚡ Quick Start: Test Stripe on Vercel

**5-minute setup to test payments on production**

---

## ✅ Step 1: Add to Vercel (3 minutes)

Go to: **https://vercel.com/tenshimatts-projects/rawgle-frontend/settings/environment-variables**

Add these 4 variables (click "Add New" for each):

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your `pk_test_...` key | All 3 ✅ |
| `STRIPE_SECRET_KEY` | Your `sk_test_...` key | All 3 ✅ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_temp` (for now) | All 3 ✅ |
| `NEXT_PUBLIC_BASE_URL` | `https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app` | All 3 ✅ |

**⚠️ Check ALL 3 environment boxes:** Production, Preview, Development

---

## ✅ Step 2: Redeploy (1 minute)

Vercel will auto-deploy when you push. Or manually:

1. Go to: https://vercel.com/tenshimatts-projects/rawgle-frontend
2. Click latest deployment → ⋯ → **Redeploy**
3. Wait 2 minutes

---

## ✅ Step 3: Test! (3 minutes)

1. **Go to:** https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/shop

2. **Add items to cart**

3. **Click "Proceed to Checkout"**

4. **Test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`

5. **Complete payment** → See success page!

6. **Check order:** https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/dashboard

---

## 🎯 That's It!

Your checkout should work! The webhook can be set up later - checkout will still work without it.

**Total time:** 5-7 minutes

---

## 🐛 Not Working?

1. **Check variables are saved** in Vercel
2. **Wait 2 minutes** after redeploying
3. **Clear browser cache** and try again
4. **Check console** for errors (F12 → Console)

---

## 📝 Next (Optional):

Set up webhook for production:
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `payment_intent.*`
4. Copy signing secret → Add as `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy

**See:** `VERCEL_STRIPE_SETUP.md` for detailed instructions
