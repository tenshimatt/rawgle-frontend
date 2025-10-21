#!/bin/bash
# Script to create Portainer API token for n8n

echo "🔑 Creating Portainer API Token for n8n Watchtower Monitoring"
echo ""

PORTAINER_URL="http://10.90.10.6:9000"

echo "📋 To create an API token, you need to:"
echo ""
echo "1. Open Portainer in your browser:"
echo "   https://portainer.beyondpandora.com"
echo ""
echo "2. Click on your username/avatar (top right)"
echo ""
echo "3. Select 'My account' or 'Account settings'"
echo ""
echo "4. Look for 'Access tokens' or 'API tokens' section"
echo ""
echo "5. Click '+ Add access token' or '+ Create token'"
echo ""
echo "6. Fill in:"
echo "   Description: n8n-watchtower-monitoring"
echo "   (Leave expiry blank for no expiration)"
echo ""
echo "7. Click 'Add token' or 'Create'"
echo ""
echo "8. COPY THE TOKEN IMMEDIATELY (shown only once!)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "OR - If you prefer, provide your Portainer credentials here"
echo "and I'll try to create the token via API:"
echo ""
read -p "Do you want to try API creation? (y/n): " API_CREATE

if [[ "$API_CREATE" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Portainer Username: " USERNAME
    read -sp "Portainer Password: " PASSWORD
    echo ""
    echo ""

    echo "Attempting to authenticate..."
    JWT=$(curl -s -X POST "$PORTAINER_URL/api/auth" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
        | jq -r '.jwt')

    if [ -z "$JWT" ] || [ "$JWT" = "null" ]; then
        echo "❌ Authentication failed. Please create token manually via UI."
        exit 1
    fi

    echo "✅ Authenticated successfully!"
    echo ""

    # Get user ID
    USER_ID=$(curl -s "$PORTAINER_URL/api/users/me" \
        -H "Authorization: Bearer $JWT" \
        | jq -r '.Id')

    echo "Creating API token..."
    TOKEN_RESPONSE=$(curl -s -X POST "$PORTAINER_URL/api/users/$USER_ID/tokens" \
        -H "Authorization: Bearer $JWT" \
        -H "Content-Type: application/json" \
        -d '{"description":"n8n-watchtower-monitoring"}')

    TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.rawAPIKey')

    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        echo "❌ Token creation failed. Error:"
        echo "$TOKEN_RESPONSE" | jq .
        echo ""
        echo "Please create token manually via UI."
        exit 1
    fi

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 SUCCESS! Your Portainer API Token:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "$TOKEN"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "⚠️  SAVE THIS TOKEN SECURELY - IT WON'T BE SHOWN AGAIN!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Copy the token above"
    echo "2. Open n8n: http://10.90.10.6:5678"
    echo "3. Import the workflow"
    echo "4. Configure HTTP Header Auth credential:"
    echo "   Header Name: X-API-Key"
    echo "   Header Value: $TOKEN"
    echo ""
else
    echo ""
    echo "No problem! Create the token manually via Portainer UI."
    echo ""
    echo "Common locations in Portainer UI:"
    echo "• Top right: Username → My account → Access tokens"
    echo "• Or: Settings → Users → Your user → Access tokens"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "• https://docs.portainer.io/api/access"
echo ""
