#!/bin/bash

# Stripe Webhook Setup Script for Vercel Production
# This script creates a webhook endpoint in Stripe for your Vercel deployment

echo "🔧 Stripe Webhook Setup for Vercel"
echo "=================================="
echo ""

# Your Vercel URL
VERCEL_URL="https://rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app"
WEBHOOK_URL="${VERCEL_URL}/api/webhooks/stripe"

echo "📍 Webhook URL: ${WEBHOOK_URL}"
echo ""

# Check if logged in to Stripe
if ! stripe config --list &> /dev/null; then
    echo "❌ Not logged in to Stripe CLI"
    echo "Please run: stripe login"
    echo ""
    echo "This will open your browser to authenticate with Stripe."
    exit 1
fi

echo "✅ Stripe CLI authenticated"
echo ""

# Create webhook endpoint
echo "🔨 Creating webhook endpoint..."
echo ""

stripe webhooks create \
  --url "${WEBHOOK_URL}" \
  --description "Vercel Production Webhook" \
  --events checkout.session.completed \
  --events payment_intent.succeeded \
  --events payment_intent.payment_failed \
  --api-key "${STRIPE_SECRET_KEY}"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Webhook created successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Copy the 'Signing secret' shown above (starts with whsec_)"
    echo "2. Go to: https://vercel.com/tenshimatts-projects/rawgle-frontend/settings/environment-variables"
    echo "3. Edit STRIPE_WEBHOOK_SECRET variable"
    echo "4. Paste the signing secret"
    echo "5. Save and redeploy"
    echo ""
    echo "Or run: stripe webhooks list"
    echo "To see all your webhooks"
else
    echo ""
    echo "❌ Failed to create webhook"
    echo ""
    echo "You can also create it manually:"
    echo "1. Go to: https://dashboard.stripe.com/test/webhooks"
    echo "2. Click '+ Add endpoint'"
    echo "3. Enter URL: ${WEBHOOK_URL}"
    echo "4. Select events: checkout.session.completed, payment_intent.*"
    echo "5. Click 'Add endpoint'"
    echo "6. Copy the signing secret"
fi
