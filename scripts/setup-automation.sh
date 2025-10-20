#!/bin/bash
# Rawgle Automation Setup Script
# Automates OpenProject, Jenkins, and n8n configuration

set -e  # Exit on error

echo "🚀 Rawgle Automation Setup"
echo "=========================="
echo ""

# Configuration
OPENPROJECT_URL="http://10.90.10.6:3002"
JENKINS_URL="http://10.90.10.6:3001"
N8N_URL="http://10.90.10.6:5678"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

# Step 1: Create OpenProject "Rawgle" Project
echo ""
echo "📋 Step 1: OpenProject Setup"
echo "----------------------------"

log_info "OpenProject URL: $OPENPROJECT_URL"
log_info "Default credentials: admin / admin"
echo ""
log_info "MANUAL STEPS REQUIRED:"
echo "  1. Open: $OPENPROJECT_URL"
echo "  2. Login with: admin / admin"
echo "  3. Change password immediately!"
echo "  4. Go to: Projects → + Project"
echo "  5. Create project:"
echo "     - Name: Rawgle"
echo "     - Identifier: rawgle"
echo "     - Description: Pet health platform automation"
echo "  6. Configure Statuses:"
echo "     - Backlog"
echo "     - In Progress"
echo "     - Code Review"
echo "     - Testing"
echo "     - Done"
echo "     - Blocked"
echo "  7. Create API Token:"
echo "     - Avatar → My Account → Access tokens"
echo "     - Name: rawgle-automation"
echo "     - Save token to .env.local"
echo ""
read -p "Press Enter when OpenProject is configured..."

log_success "OpenProject configured"

# Step 2: Configure Jenkins
echo ""
echo "🔧 Step 2: Jenkins Setup"
echo "------------------------"

log_info "Jenkins URL: $JENKINS_URL"
echo ""
log_info "MANUAL STEPS REQUIRED:"
echo "  1. Open: $JENKINS_URL"
echo "  2. Get initial admin password:"
ssh docker-server "docker exec pandora-jenkins cat /var/jenkins_home/secrets/initialAdminPassword" 2>/dev/null || log_error "Could not get Jenkins password"
echo "  3. Install suggested plugins"
echo "  4. Create admin user"
echo "  5. Install additional plugins:"
echo "     - Pipeline"
echo "     - Git"
echo "     - SonarQube Scanner"
echo "     - NodeJS"
echo "  6. Configure Global Tools:"
echo "     - NodeJS 22.x (name: NodeJS-22)"
echo "     - SonarQube Scanner"
echo "  7. Add Credentials (Manage Jenkins → Credentials):"
echo "     - openproject-api-token (Secret text)"
echo "     - vercel-token (Secret text)"
echo "     - sonarqube-token (Secret text)"
echo "  8. Create New Pipeline Job:"
echo "     - Name: rawgle-frontend"
echo "     - Type: Pipeline"
echo "     - Pipeline from SCM:"
echo "       - SCM: Git"
echo "       - URL: https://github.com/tenshimatt/rawgle-frontend.git"
echo "       - Branch: */master"
echo "       - Script Path: Jenkinsfile"
echo ""
read -p "Press Enter when Jenkins is configured..."

log_success "Jenkins configured"

# Step 3: Import n8n Workflow
echo ""
echo "🔄 Step 3: n8n Workflow Setup"
echo "-----------------------------"

log_info "n8n URL: $N8N_URL"
log_info "Credentials: admin / pandora123"
echo ""
log_info "MANUAL STEPS REQUIRED:"
echo "  1. Open: $N8N_URL"
echo "  2. Login with: admin / pandora123"
echo "  3. Create new workflow"
echo "  4. Import from file: docs/PIPELINE_COMPLETE.md"
echo "  5. Configure credentials:"
echo "     - Anthropic API Key (for Claude)"
echo "     - OpenProject API Token"
echo "  6. Update webhook URL in nodes"
echo "  7. Activate workflow"
echo ""
read -p "Press Enter when n8n is configured..."

log_success "n8n workflow configured"

# Step 4: Test Automation
echo ""
echo "🧪 Step 4: Test Automation"
echo "-------------------------"

log_info "Creating test spec file..."

cat > specs/test-automation.md << 'EOF'
# Feature: Test Automation Workflow

## User Story
AS A developer
I WANT TO test the automation workflow
SO THAT I can verify everything is working

## Requirements
- [ ] This is a test spec file
- [ ] It should trigger the automation

## Test Plan
1. Create this spec file
2. Create OpenProject task
3. Move task to "In Progress"
4. Verify automation triggers

## Expected Result
- Jenkins build starts
- Tests run
- Status updated in OpenProject
EOF

log_success "Test spec created: specs/test-automation.md"

echo ""
log_info "FINAL STEPS:"
echo "  1. Commit and push spec file:"
echo "     git add specs/"
echo "     git commit -m 'Add test spec'"
echo "     git push"
echo ""
echo "  2. Create OpenProject task:"
echo "     - Title: Test Automation"
echo "     - Spec: specs/test-automation.md"
echo "     - Move to 'In Progress'"
echo ""
echo "  3. Watch automation run:"
echo "     - Check n8n: $N8N_URL/executions"
echo "     - Check Jenkins: $JENKINS_URL/job/rawgle-frontend/"
echo "     - Check OpenProject task for updates"
echo ""

log_success "Setup complete!"
echo ""
echo "📚 Documentation:"
echo "  - Full Guide: docs/AUTOMATION_SETUP.md"
echo "  - Quick Start: docs/PIPELINE_COMPLETE.md"
echo ""
echo "🎉 Your automation pipeline is ready!"
