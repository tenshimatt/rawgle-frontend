#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🐳 WATCHTOWER DEPLOYMENT                                  ║
║   Automated Docker Container Updates                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
DOCKER_SERVER="10.90.10.6"
DOCKER_USER="docker-admin"
DEPLOY_DIR="~/watchtower"
N8N_URL="http://10.90.10.6:5678"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  Docker Server: $DOCKER_SERVER"
echo "  Deploy Directory: $DEPLOY_DIR"
echo "  n8n URL: $N8N_URL"
echo ""

# Check if running on docker server or need to SSH
if [[ $(hostname) == "docker-server" ]] || [[ $(hostname -I | grep -c "10.90.10.6") -gt 0 ]]; then
    IS_LOCAL=true
    SSH_PREFIX=""
else
    IS_LOCAL=false
    SSH_PREFIX="ssh ${DOCKER_USER}@${DOCKER_SERVER}"
fi

echo -e "${BLUE}🔍 Step 1: Pre-flight Checks${NC}"

# Check if monitoring network exists
echo "  Checking for 'monitoring' Docker network..."
if $SSH_PREFIX docker network ls | grep -q monitoring; then
    echo -e "  ${GREEN}✓${NC} Network 'monitoring' exists"
else
    echo -e "  ${YELLOW}!${NC} Creating 'monitoring' network..."
    $SSH_PREFIX docker network create monitoring
    echo -e "  ${GREEN}✓${NC} Network created"
fi

echo ""
echo -e "${BLUE}🚀 Step 2: Deploy Watchtower${NC}"

# Create deployment directory
echo "  Creating deployment directory..."
$SSH_PREFIX mkdir -p $DEPLOY_DIR

# Copy docker-compose.yml
echo "  Deploying docker-compose.yml..."
if [ "$IS_LOCAL" = true ]; then
    cp docker/watchtower/docker-compose.yml $DEPLOY_DIR/
else
    scp docker/watchtower/docker-compose.yml ${DOCKER_USER}@${DOCKER_SERVER}:${DEPLOY_DIR}/
fi
echo -e "  ${GREEN}✓${NC} Files deployed"

# Deploy container
echo ""
echo "  Starting Watchtower container..."
$SSH_PREFIX "cd $DEPLOY_DIR && docker compose up -d"

# Wait for container to be ready
echo "  Waiting for container to be ready..."
sleep 5

# Check if container is running
if $SSH_PREFIX docker ps | grep -q watchtower-updater; then
    echo -e "  ${GREEN}✓${NC} Watchtower is running"
else
    echo -e "  ${RED}✗${NC} Watchtower failed to start"
    echo "  Checking logs..."
    $SSH_PREFIX docker logs watchtower-updater
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Step 3: Configuration Summary${NC}"

echo ""
echo -e "${YELLOW}Watchtower Configuration:${NC}"
echo "  Schedule: Daily at 2:00 AM"
echo "  Cleanup: Enabled (removes old images)"
echo "  Rolling restart: Enabled (updates one at a time)"
echo "  Notifications: Enabled → $N8N_URL/webhook/watchtower-updates"

echo ""
echo -e "${BLUE}📊 Step 4: Status Check${NC}"

# Show container status
echo "  Container Status:"
$SSH_PREFIX docker ps --filter name=watchtower-updater --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "  Recent Logs:"
$SSH_PREFIX docker logs watchtower-updater --tail 10

echo ""
echo -e "${BLUE}🧪 Step 5: Test Options${NC}"

echo ""
echo -e "${YELLOW}Want to test Watchtower now?${NC}"
echo "  1. Run a one-time update check (safe, won't update unless needed)"
echo "  2. Skip test, keep daily schedule only"
echo ""
read -p "Enter choice (1 or 2): " TEST_CHOICE

if [ "$TEST_CHOICE" = "1" ]; then
    echo ""
    echo -e "${YELLOW}Running test update check...${NC}"
    $SSH_PREFIX docker exec watchtower-updater /watchtower --run-once
    echo ""
    echo -e "${GREEN}✓${NC} Test complete! Check logs above for results."
else
    echo -e "${GREEN}✓${NC} Skipping test. Watchtower will run on schedule (2 AM daily)."
fi

echo ""
echo -e "${BLUE}📚 Step 6: n8n Workflow Setup${NC}"

echo ""
echo -e "${YELLOW}Next: Import n8n maintenance workflow${NC}"
echo ""
echo "  1. Open n8n: $N8N_URL"
echo "  2. Click 'Import from File'"
echo "  3. Select: docker/watchtower/n8n-workflow.json"
echo "  4. Configure Portainer credentials (API token)"
echo "  5. Activate workflow"
echo ""
echo "  Workflow provides:"
echo "    • Pre-update health checks"
echo "    • Post-update verification"
echo "    • Detailed maintenance reports"
echo "    • Failure notifications"
echo ""

echo -e "${YELLOW}Want to open n8n now? (requires GUI browser)${NC}"
read -p "Open n8n? (y/n): " OPEN_N8N

if [[ "$OPEN_N8N" =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$N8N_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$N8N_URL"
    else
        echo "  Please open manually: $N8N_URL"
    fi
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║   ✅ WATCHTOWER DEPLOYED SUCCESSFULLY!                      ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}📋 What Happens Next:${NC}"
echo "  1. ⏰ 2:00 AM Daily - Watchtower checks for updates"
echo "  2. 🔄 Updates containers (one at a time)"
echo "  3. 🧹 Cleans up old images"
echo "  4. 📨 Sends notification to n8n"
echo "  5. 📊 n8n generates maintenance report"
echo ""

echo -e "${YELLOW}🔍 Useful Commands:${NC}"
echo "  View logs:        ssh $DOCKER_USER@$DOCKER_SERVER 'docker logs -f watchtower-updater'"
echo "  Manual update:    ssh $DOCKER_USER@$DOCKER_SERVER 'docker exec watchtower-updater /watchtower --run-once'"
echo "  Stop Watchtower:  ssh $DOCKER_USER@$DOCKER_SERVER 'cd $DEPLOY_DIR && docker compose down'"
echo "  Restart:          ssh $DOCKER_USER@$DOCKER_SERVER 'cd $DEPLOY_DIR && docker compose restart'"
echo ""

echo -e "${YELLOW}⚠️  Critical Containers to Exclude:${NC}"
echo "  Add this label to containers you DON'T want auto-updated:"
echo '  labels:'
echo '    - "com.centurylinklabs.watchtower.enable=false"'
echo ""
echo "  Recommended exclusions:"
echo "    • Production databases (PostgreSQL, MongoDB)"
echo "    • OpenProject (manual migration review)"
echo "    • Stateful services with complex migrations"
echo ""

echo -e "${BLUE}📖 Documentation:${NC}"
echo "  README: docker/watchtower/README.md"
echo "  Full guide: docs/CONTAINER_MAINTENANCE.md"
echo "  Watchtower docs: https://containrrr.dev/watchtower/"
echo ""

echo -e "${GREEN}Setup complete! Your containers will now update automatically. 🚀${NC}"
