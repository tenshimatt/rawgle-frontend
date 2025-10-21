#!/bin/bash
# Script to import all credentials into n8n

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔐 n8n Credential Import Tool${NC}"
echo ""

N8N_URL="http://10.90.10.6:5678"
N8N_USER="admin"
N8N_PASS="pandora123"

echo -e "${YELLOW}This script will import all your credentials into n8n${NC}"
echo ""
echo "Credentials to import:"
echo "  ✓ Portainer API"
echo "  ✓ Supabase"
echo "  ✓ Generic API Key"
echo ""

read -p "Continue? (y/n): " CONTINUE
if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Login to n8n and get auth token
echo ""
echo -e "${BLUE}Logging into n8n...${NC}"

# n8n uses cookie-based auth, need to get session cookie
SESSION=$(curl -s -c - -X POST "$N8N_URL/rest/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$N8N_USER\",\"password\":\"$N8N_PASS\"}" \
    | grep -o 'n8n-auth.*' | awk '{print $NF}')

if [ -z "$SESSION" ]; then
    echo -e "${YELLOW}⚠️  Could not authenticate with n8n${NC}"
    echo "Please import credentials manually using the guide in N8N_CREDENTIALS_GUIDE.md"
    exit 1
fi

echo -e "${GREEN}✓ Authenticated${NC}"

# Function to create credential
create_credential() {
    local name=$1
    local type=$2
    local data=$3

    echo -e "${BLUE}Creating credential: $name${NC}"

    RESPONSE=$(curl -s -X POST "$N8N_URL/rest/credentials" \
        -H "Content-Type: application/json" \
        -H "Cookie: n8n-auth=$SESSION" \
        -d "$data")

    if echo "$RESPONSE" | grep -q "id"; then
        echo -e "${GREEN}✓ Created $name${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed to create $name${NC}"
        echo "Response: $RESPONSE"
    fi
}

echo ""
echo -e "${BLUE}Creating credentials...${NC}"
echo ""

# 1. Portainer API
create_credential "Portainer API" "httpHeaderAuth" '{
  "name": "Portainer API",
  "type": "httpHeaderAuth",
  "data": {
    "name": "X-API-Key",
    "value": "ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A="
  }
}'

# 2. Supabase
create_credential "Supabase" "httpHeaderAuth" '{
  "name": "Supabase",
  "type": "httpHeaderAuth",
  "data": {
    "name": "apikey",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5a3BzbHlocnVwYWJsZHJyem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MzUyNTcsImV4cCI6MjA2NDMxMTI1N30.pTO2FudSyvsa4LizQCC7xpI64CN5D86MFCBz5LFu_6k"
  }
}'

# 3. Generic API Key
create_credential "Rawgle API Key" "httpHeaderAuth" '{
  "name": "Rawgle API Key",
  "type": "httpHeaderAuth",
  "data": {
    "name": "Authorization",
    "value": "Bearer supersecret123"
  }
}'

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ CREDENTIALS IMPORTED                                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Imported credentials:"
echo "  ✓ Portainer API - For Docker container monitoring"
echo "  ✓ Supabase - For database access"
echo "  ✓ Rawgle API Key - For API authentication"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Open n8n: $N8N_URL"
echo "  2. Go to Credentials (left sidebar)"
echo "  3. Verify all credentials are listed"
echo "  4. Import the Watchtower workflow"
echo "  5. Assign credentials to workflow nodes"
echo ""

echo -e "${BLUE}💡 Manual Import Alternative:${NC}"
echo "If the script didn't work, see N8N_CREDENTIALS_GUIDE.md for manual steps"
echo ""
