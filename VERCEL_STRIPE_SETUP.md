# 🚀 Vercel + Stripe Setup Guide

**Quick setup to test Stripe checkout on Vercel**

---

## Step 1: Add Environment Variables to Vercel (5 minutes)

### Go to Vercel Dashboard:
**URL:** https://vercel.com/tenshimatts-projects/rawgle-frontend/settings/environment-variables

### Add These Variables:

Click **"Add New"** for each:

#### 1. Stripe Publishable Key
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51SLSYN... (starts with pk_test_)
Environment: Production, Preview, Development
```

**✅ Use the publishable key from your Stripe dashboard**

#### 2. Stripe Secret Key
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51SLSYN... (starts with sk_test_)
Environment: Production, Preview, Development
```

**✅ Use the secret key from your Stripe dashboard**
**⚠️ Keep this secret! Never commit to git!**

#### 3. Stripe Webhook Secret (Get this in Step 2)
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_XXXXX (from Step 2 below)
Environment: Production, Preview, Development
```

#### 4. Base URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app
Environment: Production, Preview, Development
```

**⚠️ IMPORTANT:** Check ALL three environment boxes (Production, Preview, Development)

---

## Step 2: Set Up Stripe Webhook for Vercel (5 minutes)

### Go to Stripe Webhooks:
**URL:** https://dashboard.stripe.com/test/webhooks

### Create New Endpoint:

1. Click **"+ Add endpoint"**

2. **Endpoint URL:**
   ```
   https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/api/webhooks/stripe
   ```

3. Click **"Select events"**

4. Add these events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click **"Add endpoint"**

6. **Copy the Signing Secret** (starts with `whsec_`)

7. Go back to Vercel and add it as `STRIPE_WEBHOOK_SECRET` (Step 1.3 above)

---

## Step 3: Redeploy Vercel (2 minutes)

After adding all environment variables:

### Option A: Automatic Deploy (Recommended)
```bash
git add .env.local
git commit -m "Add Stripe configuration"
git push origin master
```
Vercel will auto-deploy

### Option B: Manual Redeploy
1. Go to: https://vercel.com/tenshimatts-projects/rawgle-frontend
2. Click **"Deployments"** tab
3. Click ⋯ (three dots) on latest deployment
4. Click **"Redeploy"**

**⚠️ Wait 2-3 minutes for deployment to complete**

---

## Step 4: Test on Vercel (5 minutes)

### Test Flow:

1. **Go to your Vercel URL:**
   ```
   https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app
   ```

2. **Navigate to Shop:**
   ```
   https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/shop
   ```

3. **Add items to cart**

4. **Click "Proceed to Checkout"**

5. **Use Stripe Test Card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any ZIP)

6. **Complete payment**

7. **Verify success page appears**

8. **Check order history:**
   ```
   https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/dashboard
   ```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All 4 environment variables added to Vercel
- [ ] Webhook endpoint created in Stripe
- [ ] Vercel redeployed with new variables
- [ ] Can add items to cart on Vercel
- [ ] Checkout redirects to Stripe
- [ ] Test payment completes successfully
- [ ] Success page appears after payment
- [ ] Order appears in dashboard

---

## 🐛 Troubleshooting

### "Stripe API key not found"
**Solution:**
- Verify variables are added to Vercel
- Check variable names are EXACT (case-sensitive)
- Redeploy after adding variables

### "Webhook signature verification failed"
**Solution:**
- Verify webhook secret is correct
- Make sure endpoint URL matches exactly
- Redeploy after adding webhook secret

### "Checkout redirect not working"
**Solution:**
- Verify `NEXT_PUBLIC_BASE_URL` matches your Vercel URL
- Check for typos in URL
- Ensure https:// is included

### "Environment variables not showing"
**Solution:**
- Wait 2-3 minutes after saving
- Redeploy the project
- Check you selected all 3 environments (Production, Preview, Development)

---

## 🎯 Quick Reference

### Your Vercel URL:
```
https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app
```

### Your Webhook URL:
```
https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app/api/webhooks/stripe
```

### Stripe Dashboard URLs:
- API Keys: https://dashboard.stripe.com/test/apikeys
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Payments: https://dashboard.stripe.com/test/payments

### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

## 🎉 You're Ready!

Once you complete these steps, your Stripe checkout will be **fully functional on Vercel**!

**Total Time:** ~15 minutes

---

## 📝 Notes

- These are **test mode** keys - no real charges will be made
- You can test unlimited times with test cards
- Webhook events will appear in Stripe dashboard
- Orders will be stored and visible in dashboard

**Next:** Test the complete checkout flow on Vercel! 🚀
