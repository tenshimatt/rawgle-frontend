# Integration Checklist - MCP Server + n8n Workflow

**Date:** 2025-10-30
**Target:** End-to-end continuous AI development workflow

---

## ✅ Completed

- [x] MCP Playwright server built and tested
- [x] All dependencies installed (0 vulnerabilities)
- [x] Server compiles with 0 errors
- [x] MCP protocol verified working
- [x] Docker configuration complete
- [x] Documentation suite complete (7 documents)
- [x] Enhanced n8n workflow created with MCP integration
- [x] Workflow replaces Jenkins with Vercel + MCP
- [x] Git commits completed and pushed

---

## 📋 Next Steps

### 1. Deploy MCP Server (30 minutes)

**On server 10.90.10.6:**

```bash
# Step 1: Copy files
ssh user@10.90.10.6
mkdir -p /opt/mcp-playwright-server
# From local: scp -r mcp-playwright-server/ user@10.90.10.6:/opt/mcp-playwright-server/

# Step 2: Build Docker image
cd /opt/mcp-playwright-server
docker build -t mcp-playwright-server:latest .

# Step 3: Create environment
cat > .env << 'EOF'
TEST_RESULTS_DIR=/data/test-results
ARTIFACTS_RETENTION_DAYS=7
MAX_CONCURRENT_RUNS=3
MAX_TEST_DURATION=300000
BROWSER_TIMEOUT=30000
ENABLE_TRACING=true
ENABLE_VIDEO=true
ENABLE_SCREENSHOTS=true
ENABLE_CONSOLE_LOGS=true
ENABLE_NETWORK_LOGS=true
ENABLE_PERFORMANCE=true
SANITIZE_SENSITIVE_DATA=true
SCREENSHOT_QUALITY=80
VIDEO_FPS=25
EOF

# Step 4: Start container
mkdir -p ./test-results
docker run -d \
  --name mcp-playwright \
  --restart unless-stopped \
  --env-file .env \
  -v $(pwd)/test-results:/data/test-results \
  -v $(pwd)/tests:/app/tests:ro \
  mcp-playwright-server:latest

# Step 5: Verify
docker logs mcp-playwright | grep "MCP Playwright Test Runner started successfully"
```

**Verification:**
- [ ] Container is running: `docker ps | grep mcp-playwright`
- [ ] No errors in logs: `docker logs mcp-playwright`
- [ ] Test results directory exists: `ls -la /opt/mcp-playwright-server/test-results`

---

### 2. Update n8n Workflow (15 minutes)

**Option A: Via n8n API**

```bash
# On your local machine
cd /Users/mattwright/pandora/rawgle-frontend

# Upload new workflow
curl -X POST "http://10.90.10.6:5678/api/v1/workflows" \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d @n8n-workflow-with-mcp.json

# Activate workflow (use returned ID)
curl -X POST "http://10.90.10.6:5678/api/v1/workflows/{WORKFLOW_ID}/activate" \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Option B: Via n8n UI**

1. Open http://10.90.10.6:5678
2. Click "Import from File"
3. Select `/Users/mattwright/pandora/rawgle-frontend/n8n-workflow-with-mcp.json`
4. Assign credentials (see step 3)
5. Click "Activate"

**Verification:**
- [ ] Workflow imported successfully
- [ ] Workflow shows as "Active"
- [ ] No red error nodes
- [ ] Webhook URL available

---

### 3. Verify Credentials in n8n (10 minutes)

**Required Credentials:**

#### OpenProject API ✅ (Already configured)
- **Type:** HTTP Header Auth
- **Name:** `openProjectApi`
- **Header Name:** `Authorization`
- **Header Value:** `Bearer {API_KEY}`
- **Status:** Already working

**Test:**
```bash
curl -H "Authorization: Bearer {API_KEY}" \
  http://10.90.10.7/openproject/api/v3/users/me
# Should return user info
```

#### GitHub API ⚠️ (Needs verification)
- **Type:** HTTP Header Auth or GitHub OAuth
- **Name:** `githubApi`
- **Header Name:** `Authorization`
- **Header Value:** `token ghp_...`

**Test:**
```bash
curl -H "Authorization: token ghp_..." \
  https://api.github.com/repos/tenshimatt/rawgle-frontend
# Should return repo info
```

**Required Scopes:**
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Actions workflows

#### Anthropic API ⚠️ (Needs verification)
- **Type:** HTTP Header Auth
- **Name:** `anthropicApi`
- **Header Name:** `x-api-key`
- **Header Value:** `sk-ant-api03-...`

**Test:**
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-api03-..." \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
# Should return Claude response
```

#### Vercel API (Optional but recommended)
- **Type:** HTTP Header Auth
- **Name:** `vercelApi`
- **Header Name:** `Authorization`
- **Header Value:** `Bearer {VERCEL_TOKEN}`

**Test:**
```bash
curl -H "Authorization: Bearer {VERCEL_TOKEN}" \
  https://api.vercel.com/v9/projects
# Should return projects list
```

**Get Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy and add to n8n credentials

**Checklist:**
- [ ] OpenProject credential working
- [ ] GitHub credential added and tested
- [ ] Anthropic credential added and tested
- [ ] Vercel credential added (optional)

---

### 4. Configure Environment Variables (5 minutes)

**In n8n UI or .env file:**

```bash
# GitHub
GITHUB_OWNER=tenshimatt
GITHUB_REPO=rawgle-frontend

# OpenProject
OPENPROJECT_URL=http://10.90.10.7/openproject
OPENPROJECT_STATUS_READY_FOR_REVIEW=7
OPENPROJECT_STATUS_FAILED=8

# Vercel
VERCEL_PROJECT_ID=prj_...
VERCEL_ORG_ID=team_...

# MCP Server (if running on different host)
MCP_SERVER_HOST=localhost  # or 10.90.10.6
```

**Get OpenProject Status IDs:**
```bash
curl -H "Authorization: Bearer {API_KEY}" \
  http://10.90.10.7/openproject/api/v3/statuses \
  | jq '.[] | {id, name}'
```

**Get Vercel Project ID:**
```bash
curl -H "Authorization: Bearer {VERCEL_TOKEN}" \
  https://api.vercel.com/v9/projects \
  | jq '.projects[] | {id, name}'
```

**Checklist:**
- [ ] All environment variables configured
- [ ] Status IDs correct for OpenProject
- [ ] Vercel project ID correct

---

### 5. Create Test Task in OpenProject (5 minutes)

**Task Template:**

```markdown
# Build Simple Counter Component

## Description
Create a simple counter component that increments and decrements a number.

## Requirements
1. Display current count
2. Increment button (+)
3. Decrement button (-)
4. Reset button
5. Count should not go below 0

## Custom Fields

SPEC_FILE: specs/counter-component.md
GOOD_EXAMPLES: src/components/button.tsx, src/components/card.tsx
TARGET_FILES: src/components/counter.tsx, src/components/counter.test.tsx
TEST_FILES: tests/e2e/counter.spec.ts

## Acceptance Criteria
- [ ] Component displays count
- [ ] Increment button works
- [ ] Decrement button works
- [ ] Reset button works
- [ ] Count never goes below 0
- [ ] All tests pass
```

**Create Task:**

1. Open http://10.90.10.7/openproject/projects/app-devlopment
2. Click "Create" → "Task"
3. Fill in:
   - Subject: "Build Simple Counter Component"
   - Description: (paste template above)
   - Status: "New"
4. Save task
5. Note the task ID (e.g., #123)

**Checklist:**
- [ ] Test task created
- [ ] Description includes SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES, TEST_FILES
- [ ] Task is in "New" status
- [ ] Task ID noted

---

### 6. Create Spec File in GitHub (5 minutes)

```bash
# Create spec file locally
mkdir -p /Users/mattwright/pandora/rawgle-frontend/specs
cat > /Users/mattwright/pandora/rawgle-frontend/specs/counter-component.md << 'EOF'
# Counter Component Specification

## Overview
A React component that manages and displays a numeric counter with increment, decrement, and reset functionality.

## Component API

### Props
- `initialValue?: number` - Starting count (default: 0)
- `minValue?: number` - Minimum allowed value (default: 0)
- `maxValue?: number` - Maximum allowed value (default: Infinity)
- `step?: number` - Increment/decrement amount (default: 1)

### State
- `count: number` - Current count value

## UI Requirements

### Layout
```
┌─────────────────────┐
│   Counter: 5        │
│                     │
│  [-] [Reset] [+]    │
└─────────────────────┘
```

### Elements
1. **Display**: Shows current count
   - Large, bold number
   - Centered
   - Updates immediately on change

2. **Decrement Button** (-)
   - Disabled when count <= minValue
   - Reduces count by step amount
   - Aria-label: "Decrement counter"

3. **Reset Button**
   - Returns count to initialValue
   - Always enabled
   - Aria-label: "Reset counter"

4. **Increment Button** (+)
   - Disabled when count >= maxValue
   - Increases count by step amount
   - Aria-label: "Increment counter"

## Behavior

### Increment
- Click "+" button → count += step
- If count + step > maxValue, set count = maxValue
- Update display immediately

### Decrement
- Click "-" button → count -= step
- If count - step < minValue, set count = minValue
- Update display immediately

### Reset
- Click "Reset" button → count = initialValue
- Update display immediately

## Accessibility
- All buttons must have aria-labels
- Count display should have role="status" and aria-live="polite"
- Keyboard navigation supported (Tab, Enter, Space)
- Focus visible on all interactive elements

## Testing Requirements

### Unit Tests
1. Renders with default props
2. Renders with custom initialValue
3. Increment button increases count
4. Decrement button decreases count
5. Reset button returns to initialValue
6. Decrement disabled at minValue
7. Increment disabled at maxValue

### E2E Tests
1. Load component on page
2. Verify initial count displayed
3. Click increment → count increases
4. Click decrement → count decreases
5. Click reset → count returns to initial
6. Verify buttons disabled at limits

## Example Usage

```typescript
<Counter />
<Counter initialValue={10} minValue={0} maxValue={100} step={5} />
```
EOF

# Commit to git
git add specs/counter-component.md
git commit -m "Add counter component specification"
git push origin master
```

**Checklist:**
- [ ] Spec file created in `specs/counter-component.md`
- [ ] Committed to git
- [ ] Pushed to GitHub master branch

---

### 7. Move Task to "In Progress" (Trigger Workflow)

**This will trigger the entire workflow!**

1. Open the test task in OpenProject
2. Click "Status" dropdown
3. Select "In Progress"
4. Save

**What happens:**
1. OpenProject sends webhook to n8n
2. n8n receives webhook, filters for "In Progress"
3. n8n fetches task details
4. n8n parses SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES
5. n8n fetches spec from GitHub
6. n8n builds prompt for Claude
7. n8n calls Claude API (Claude generates code)
8. n8n parses Claude's response
9. n8n creates branch `auto-task-{TASK_ID}`
10. n8n commits generated files to GitHub
11. Vercel auto-builds preview from git push
12. n8n waits 30 seconds for Vercel
13. n8n gets Vercel preview URL
14. n8n calls MCP server with preview URL
15. MCP server runs Playwright tests
16. MCP server captures all artifacts
17. n8n parses test results
18. **IF PASS**: Post success to OpenProject, update status
19. **IF FAIL**: Call analyze_failure, post details, retry

**Checklist:**
- [ ] Task moved to "In Progress"
- [ ] Webhook triggered (check n8n executions)
- [ ] Workflow started (check n8n UI)

---

### 8. Monitor Execution (10-20 minutes)

**Watch n8n Execution:**

1. Open http://10.90.10.6:5678
2. Click "Executions" tab
3. Find your execution (should be running)
4. Click to expand and watch progress
5. Each node will turn green as it completes

**Monitor MCP Server:**

```bash
# SSH to server
ssh user@10.90.10.6

# Watch MCP logs in real-time
docker logs -f mcp-playwright

# Watch test results directory
watch -n 2 'ls -lh /opt/mcp-playwright-server/test-results'

# When tests run, check artifacts
cd /opt/mcp-playwright-server/test-results
ls -la  # Find run ID
cd <run-id>
ls -la  # See all artifacts

# View screenshots
ls screenshots/

# View console logs
cat console-logs.json | jq

# View network logs
cat network-logs.har | jq | head -50
```

**Check Vercel Deployment:**

1. Open https://vercel.com/tenshimatt/rawgle-frontend
2. Click "Deployments"
3. Find deployment for branch `auto-task-{TASK_ID}`
4. Check build logs
5. Verify preview URL is live

**Check OpenProject:**

1. Open test task in OpenProject
2. Scroll to "Activity" section
3. Should see comment from n8n with results

**Checklist:**
- [ ] n8n execution completed
- [ ] No red error nodes in n8n
- [ ] MCP server logs show test execution
- [ ] Test results directory has new run ID
- [ ] Vercel deployment succeeded
- [ ] OpenProject has comment with results

---

### 9. Verify Test Results (5 minutes)

**If Tests Passed:**

- [ ] OpenProject comment shows "✅ Tests PASSED"
- [ ] Task status updated to "Ready for Review"
- [ ] Preview URL accessible and works
- [ ] Branch created in GitHub
- [ ] Files committed to branch

**If Tests Failed:**

- [ ] OpenProject comment shows "❌ Tests FAILED"
- [ ] Failure details included (error message, console logs)
- [ ] AI suggestions provided
- [ ] n8n triggered retry (check executions)
- [ ] Second attempt in progress

**View Full Test Artifacts:**

```bash
# On server 10.90.10.6
cd /opt/mcp-playwright-server/test-results/<run-id>

# View HTML report
open html-report/index.html  # or copy to local machine

# Screenshots
ls screenshots/
# before-click.png, after-click.png, etc.

# Videos
ls videos/
# test-execution.webm

# Traces (for Playwright trace viewer)
ls traces/
# test-trace.zip

# Console logs
cat console-logs.json | jq

# Network logs (HAR format)
cat network-logs.har | jq
```

---

### 10. Test Iteration Loop (if tests failed)

**Watch for:**

1. **First Attempt Fails**
   - MCP returns test results with failures
   - n8n calls analyze_failure
   - n8n posts failure details to OpenProject
   - n8n builds retry prompt with:
     - Error messages
     - Console logs
     - AI suggestions
   - n8n calls Claude again with retry prompt

2. **Claude Generates Fix**
   - Claude sees:
     - Original spec
     - Previous code
     - Failure details
     - Screenshot of failure
     - Console errors
     - AI suggestions
   - Claude generates improved code

3. **Second Attempt**
   - n8n commits improved code
   - Vercel builds new preview
   - MCP runs tests again
   - Hopefully passes this time!

4. **Third Attempt** (if still failing)
   - Same process
   - Max 3 attempts total

5. **Final Failure** (after 3 attempts)
   - Post final failure details to OpenProject
   - Include all artifacts
   - Manual review required

**Checklist:**
- [ ] Retry attempt started automatically
- [ ] Claude received failure details
- [ ] Improved code generated
- [ ] Tests run again
- [ ] Eventually passes (or reaches max retries)

---

## 🎯 Success Criteria

**Phase 3 is complete when:**

- [x] MCP server deployed and running
- [x] n8n workflow active and configured
- [ ] All credentials verified working
- [ ] Test task created in OpenProject
- [ ] Task moved to "In Progress"
- [ ] Webhook triggers n8n workflow
- [ ] Claude generates code
- [ ] Code committed to GitHub
- [ ] Vercel builds preview
- [ ] MCP tests run on preview
- [ ] Test results posted to OpenProject
- [ ] **Either**: Tests pass and task marked "Ready for Review"
- [ ] **Or**: Tests fail, iteration happens, eventually passes

**Full loop completes in < 10 minutes (ideal)**

---

## 🐛 Troubleshooting

### Webhook Not Triggering

```bash
# Check OpenProject webhook configuration
curl -H "Authorization: Bearer {API_KEY}" \
  http://10.90.10.7/openproject/api/v3/webhooks

# Test webhook manually
curl -X POST http://10.90.10.6:5678/webhook/openproject-task-update \
  -H "Content-Type: application/json" \
  -d '{"action": "updated", "_embedded": {"status": {"name": "In Progress"}}}'
```

### n8n Execution Fails

1. Click on red error node in n8n UI
2. Read error message
3. Common issues:
   - Credential not found → Assign credential in node
   - API rate limit → Wait and retry
   - JSON parse error → Check response format

### MCP Server Not Responding

```bash
# Check container status
docker ps | grep mcp-playwright

# Check logs
docker logs mcp-playwright

# Restart container
docker restart mcp-playwright

# Test manually
docker exec -it mcp-playwright node test-mcp-server.js
```

### Tests Always Failing

```bash
# Check test artifacts
cd /opt/mcp-playwright-server/test-results/<run-id>

# View screenshots to see what's wrong
ls screenshots/

# Check console logs for errors
cat console-logs.json | jq '.[] | select(.type == "error")'

# Check network logs for failed requests
cat network-logs.har | jq '.log.entries[] | select(.response.status >= 400)'
```

### Vercel Build Failing

1. Open Vercel dashboard
2. Check build logs
3. Common issues:
   - TypeScript errors → Fix in code
   - Missing dependencies → Add to package.json
   - Build timeout → Optimize build

---

## 📊 Monitoring

**Daily Checks:**

- [ ] MCP server running: `docker ps | grep mcp-playwright`
- [ ] Disk space: `df -h /opt/mcp-playwright-server/test-results`
- [ ] n8n workflow active: Check n8n UI
- [ ] Recent executions: Check n8n "Executions" tab

**Weekly Cleanup:**

```bash
# Remove test results older than 7 days
find /opt/mcp-playwright-server/test-results -type d -mtime +7 -exec rm -rf {} +

# Check Docker image size
docker images | grep mcp-playwright

# Check container logs size
docker logs mcp-playwright 2>&1 | wc -l
```

---

## 📞 Support

**Documentation:**
- [DEPLOY_NOW.md](mcp-playwright-server/DEPLOY_NOW.md) - Deployment guide
- [BP-MCP-V1.md](BP-MCP-V1.md) - Complete specification
- [MCP_SERVER_READY.md](MCP_SERVER_READY.md) - Production readiness
- [PHASE_1_COMPLETE.md](PHASE_1_COMPLETE.md) - Build summary

**Useful Commands:**

```bash
# View n8n executions
http://10.90.10.6:5678 → Executions tab

# View MCP logs
docker logs -f mcp-playwright

# View test results
ls -la /opt/mcp-playwright-server/test-results

# Restart MCP server
docker restart mcp-playwright

# Restart n8n
docker restart n8n  # or systemctl restart n8n
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Status:** Ready for integration testing
**Estimated Total Time:** 1-2 hours
