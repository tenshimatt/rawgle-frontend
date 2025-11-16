#!/bin/bash

# Test /v2/api endpoints after deployment
# Run this after promoting deployment to production

echo "🧪 Testing /v2/api endpoints on production..."
echo ""
echo "========================================="
echo "Test 1: /v2/api/diagnostics"
echo "========================================="
curl -s https://www.rawgle.com/v2/api/diagnostics | jq '.'
echo ""
echo ""

echo "========================================="
echo "Test 2: /v2/api/cart"
echo "========================================="
curl -s https://www.rawgle.com/v2/api/cart -H "x-user-id: demo-user" | jq '.'
echo ""
echo ""

echo "========================================="
echo "Test 3: /v2/api/notifications"
echo "========================================="
curl -s https://www.rawgle.com/v2/api/notifications -H "x-user-id: demo-user" | jq '.'
echo ""
echo ""

echo "========================================="
echo "Test 4: /v2/api/suppliers (limit 2)"
echo "========================================="
curl -s 'https://www.rawgle.com/v2/api/suppliers?limit=2' | jq '.'
echo ""
echo ""

echo "========================================="
echo "Test 5: /v2/test page (check for 200 status)"
echo "========================================="
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.rawgle.com/v2/test)
echo "HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ /v2/test page is accessible"
else
  echo "❌ /v2/test page returned $HTTP_STATUS"
fi
echo ""
echo ""

echo "========================================="
echo "Comparison: Old /api/* endpoints (should still be blocked)"
echo "========================================="
echo ""
echo "Test: /api/diagnostics (expecting 404 from Cloudflare Workers)"
curl -s https://www.rawgle.com/api/diagnostics | jq '.'
echo ""
echo ""

echo "========================================="
echo "Summary"
echo "========================================="
echo "✅ If /v2/api/* endpoints return JSON data → SUCCESS"
echo "❌ If /v2/api/* return 404 HTML → Deployment not promoted yet"
echo "🔄 If you see 404, wait 2 minutes and run this script again"
echo ""
echo "To run this script:"
echo "  chmod +x test-v2-endpoints.sh"
echo "  ./test-v2-endpoints.sh"
