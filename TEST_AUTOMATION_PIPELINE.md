# Test Automation Pipeline - Step-by-Step Guide

## 🎯 Overview

This guide will help you test your complete automation pipeline:
```
OpenProject Task → n8n Webhook → Fetch Specs → Claude API → Jenkins Tests → Post Results
```

---

## ✅ Pre-Flight Checklist

Before testing, verify you have:

- [ ] OpenProject instance running
- [ ] n8n instance running
- [ ] Jenkins instance running
- [ ] All credentials configured in n8n:
  - [ ] OpenProject API
  - [ ] Claude/Anthropic API
  - [ ] GitHub API
  - [ ] Jenkins API
  - [ ] Vercel API (optional)
- [ ] Environment variables set in n8n:
  - [ ] GITHUB_OWNER
  - [ ] GITHUB_REPO
  - [ ] JENKINS_URL
  - [ ] OPENPROJECT_URL
  - [ ] OPENPROJECT_STATUS_READY_FOR_REVIEW
  - [ ] OPENPROJECT_STATUS_FAILED
- [ ] n8n workflow imported and activated
- [ ] OpenProject webhook configured
- [ ] Spec files in GitHub repo

---

## 🧪 Test 1: Verify GitHub API Access

Test that your GitHub PAT can fetch files:

```bash
# Replace with your actual token
GITHUB_TOKEN="ghp_YOUR_TOKEN_HERE"

# Test 1: Can we access the repo?
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend

# Expected: JSON with repo details (200 OK)

# Test 2: Can we fetch a spec file?
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend/contents/specs/features/hello-world.yml

# Expected: JSON with file content base64 encoded (200 OK)

# Test 3: Can we list examples directory?
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend/contents/examples

# Expected: Array of files/folders (200 OK or 404 if doesn't exist)
```

**If these fail:**
- Verify token has `repo` scope
- Check token hasn't expired
- Ensure repo name is correct

---

## 🧪 Test 2: Verify Claude API Access

Test that your Anthropic API key works:

```bash
# Replace with your actual key
ANTHROPIC_KEY="sk-ant-api03-YOUR_KEY_HERE"

# Test Claude API
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Hello! Say hi back."}
    ]
  }'

# Expected: JSON response with Claude's reply (200 OK)
```

**If this fails:**
- Verify API key is correct
- Check you have credits/billing set up
- Ensure model name is correct

---

## 🧪 Test 3: Verify OpenProject API Access

Test that you can read/write to OpenProject:

```bash
# Replace with your actual API key (base64 encoded)
OPENPROJECT_KEY="Basic YOUR_BASE64_KEY"
OPENPROJECT_URL="https://your-openproject-instance.com"

# Test 1: Can we fetch work packages?
curl -H "Authorization: $OPENPROJECT_KEY" \
  $OPENPROJECT_URL/api/v3/work_packages

# Expected: JSON with work packages list (200 OK)

# Test 2: Can we fetch a specific task?
curl -H "Authorization: $OPENPROJECT_KEY" \
  $OPENPROJECT_URL/api/v3/work_packages/1

# Expected: JSON with work package details (200 OK)

# Test 3: Can we post a comment?
curl -X POST \
  -H "Authorization: $OPENPROJECT_KEY" \
  -H "Content-Type: application/json" \
  $OPENPROJECT_URL/api/v3/work_packages/1/activities \
  -d '{
    "comment": {
      "raw": "Test comment from automation"
    }
  }'

# Expected: 201 Created
```

**If these fail:**
- Verify API token is valid
- Check base64 encoding: `echo -n "apikey:YOUR_KEY" | base64`
- Ensure work package ID exists

---

## 🧪 Test 4: Verify n8n Webhook

Test that n8n can receive webhooks:

```bash
# Get your n8n webhook URL from workflow
N8N_URL="http://your-n8n-instance:5678"
WEBHOOK_PATH="/webhook/openproject-task-update"

# Send test webhook
curl -X POST "$N8N_URL$WEBHOOK_PATH" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "updated",
    "_embedded": {
      "status": {
        "name": "In Progress"
      }
    },
    "_links": {
      "self": {
        "href": "https://openproject.com/api/v3/work_packages/1"
      }
    }
  }'

# Expected: 200 OK or empty response
```

**Then check n8n:**
1. Go to n8n Executions tab
2. Look for new execution
3. Should see "OpenProject Webhook Trigger" node activated

**If this fails:**
- Verify workflow is activated
- Check webhook URL is correct
- Ensure n8n is accessible from your network

---

## 🧪 Test 5: Create Test Task in OpenProject

Now let's test the full flow with a real task:

### Step 1: Create Spec File

First, ensure you have a spec file in GitHub:

```bash
# Create specs directory if it doesn't exist
mkdir -p /Users/mattwright/pandora/rawgle-frontend/specs/features

# Verify the hello-world spec exists
cat /Users/mattwright/pandora/rawgle-frontend/specs/features/hello-world.yml
```

If it doesn't exist, the file should be there from earlier. Verify it's committed:

```bash
cd /Users/mattwright/pandora/rawgle-frontend
git add specs/
git commit -m "Add test spec file"
git push origin master
```

### Step 2: Create Test Task in OpenProject

Create a new work package with this description:

```markdown
## Feature Requirements
Create a simple test page that displays "Hello World" to verify the automation pipeline.

## Technical Requirements
- Create Next.js page at /hello
- Display centered "Hello World" message
- Use Tailwind CSS for styling

## Acceptance Criteria
- [ ] Page renders at /hello route
- [ ] Text "Hello World" is visible
- [ ] Text is centered on page
- [ ] Uses teal color from design system
- [ ] Responsive on mobile

---

### AUTOMATION METADATA

SPEC_FILE: /specs/features/hello-world.yml

GOOD_EXAMPLES: /src/app/page.tsx

TARGET_FILES: /src/app/hello/page.tsx

---

## Testing Instructions
1. Navigate to http://localhost:3005/hello
2. Verify "Hello World" text displays
3. Verify text is centered
4. Test on mobile viewport
```

### Step 3: Trigger Pipeline

**Move the task to "In Progress" status** in OpenProject.

This should trigger the webhook to n8n.

---

## 🧪 Test 6: Monitor n8n Execution

1. Go to n8n → **Executions** tab
2. You should see a new execution starting
3. Click on it to watch node-by-node progress

**Watch for these nodes to execute:**

1. ✅ **OpenProject Webhook Trigger** - Receives webhook
2. ✅ **Filter: In Progress Tasks Only** - Validates status
3. ✅ **Get Task Details** - Fetches task from OpenProject
4. ✅ **Parse Task Info** - Extracts SPEC_FILE, GOOD_EXAMPLES, etc.
5. ✅ **Fetch Spec File** - Gets spec from GitHub
6. ✅ **Decode Spec File** - Decodes base64 content
7. ✅ **Fetch Good Examples** - Gets example files from GitHub
8. ✅ **Merge Spec and Examples** - Combines context
9. ✅ **Build Claude Prompt** - Creates comprehensive prompt
10. ✅ **Call Claude API** - Generates code
11. ✅ **Parse Claude Response** - Extracts generated code
12. ✅ **Trigger Jenkins** - Starts test pipeline
13. ✅ **Wait for Jenkins** - Waits 30 seconds
14. ✅ **Get Jenkins Results** - Fetches build status
15. ✅ **Check Test Results** - Evaluates success/failure
16. ✅ **Post to OpenProject** - Comments with results

**Click each node to see:**
- Input data
- Output data
- Any errors

---

## 🧪 Test 7: Verify Jenkins Build

1. Go to Jenkins → **auto-test-pipeline** job
2. You should see a new build running
3. Click build number → **Console Output**

**Expected stages:**
```
[Pipeline] Start of Pipeline
[Pipeline] stage (Setup)
[Pipeline] stage (Apply Generated Code)
[Pipeline] stage (TypeScript Check)
[Pipeline] stage (Unit Tests)
[Pipeline] stage (Build)
[Pipeline] stage (E2E Tests)
[Pipeline] stage (Commit Changes)
[Pipeline] End of Pipeline
```

**If build succeeds:**
- New branch created: `auto-task-{TASK_ID}`
- Code committed
- Tests passed

**If build fails:**
- Check console output for errors
- n8n will retry with error context

---

## 🧪 Test 8: Verify OpenProject Update

After pipeline completes, check OpenProject task:

**On Success:**
- Comment posted with ✅ results
- Task status changed to "Ready for Review"
- Links to Jenkins build

**On Failure:**
- Comment posted with ❌ error details
- Task status stays "In Progress"
- Error logs included

---

## 🐛 Troubleshooting Guide

### Issue: Webhook not triggering

**Symptoms:**
- Task moved to "In Progress" but no n8n execution

**Solutions:**
```bash
# 1. Test webhook manually
curl -X POST "http://your-n8n:5678/webhook/openproject-task-update" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# 2. Check OpenProject webhook configuration
# Go to OpenProject → Admin → Webhooks
# Verify URL matches n8n webhook

# 3. Check n8n workflow is activated
# n8n → Workflows → Your workflow
# Toggle should be ON (blue)

# 4. Check n8n logs
docker logs n8n-container-name
```

---

### Issue: "Failed to fetch spec file" error

**Symptoms:**
- n8n node "Fetch Spec File" shows error

**Solutions:**
```bash
# 1. Verify GitHub token has repo access
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend

# 2. Verify spec file exists
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend/contents/specs/features/hello-world.yml

# 3. Check GITHUB_OWNER env var in n8n
# Should be: GITHUB_OWNER=tenshimatt

# 4. Check file path in task description
# Must start with /specs/ not specs/
```

---

### Issue: "Claude API error"

**Symptoms:**
- n8n node "Call Claude API" shows 401/429/500

**Solutions:**
```bash
# 401 Unauthorized
# - Check API key is correct
# - Verify key starts with sk-ant-api03-

# 429 Rate Limit
# - Wait a few minutes
# - Reduce frequency of tests

# 500 Server Error
# - Claude API may be down
# - Try again in a few minutes

# Test API key:
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-sonnet-4-20250514", "max_tokens": 10, "messages": [{"role": "user", "content": "Hi"}]}'
```

---

### Issue: "Jenkins build not starting"

**Symptoms:**
- n8n reaches "Trigger Jenkins" but Jenkins shows no build

**Solutions:**
```bash
# 1. Verify Jenkins URL
echo $JENKINS_URL
# Should be: http://jenkins:8080

# 2. Test Jenkins API
curl -u "user:api-token" \
  http://jenkins:8080/api/json

# 3. Verify pipeline job exists
curl -u "user:api-token" \
  http://jenkins:8080/job/auto-test-pipeline/api/json

# 4. Check Jenkins credentials in n8n
# Username + API Token (not password!)

# 5. Manually trigger Jenkins job to test
curl -X POST -u "user:api-token" \
  "http://jenkins:8080/job/auto-test-pipeline/buildWithParameters?TASK_ID=test"
```

---

### Issue: "Cannot post comment to OpenProject"

**Symptoms:**
- Pipeline succeeds but no comment appears

**Solutions:**
```bash
# 1. Test OpenProject API comment
curl -X POST \
  -H "Authorization: Basic $OPENPROJECT_KEY" \
  -H "Content-Type: application/json" \
  https://openproject.com/api/v3/work_packages/1/activities \
  -d '{"comment": {"raw": "Test"}}'

# 2. Check work package ID is correct
# n8n should extract from webhook

# 3. Verify comment permissions
# OpenProject user must have comment permission

# 4. Check n8n node "Post to OpenProject"
# View input/output data for errors
```

---

## 📊 Success Checklist

After testing, you should have:

- [x] GitHub API returning files (200 OK)
- [x] Claude API generating responses (200 OK)
- [x] OpenProject API accessible (200 OK)
- [x] n8n workflow receiving webhooks
- [x] n8n execution completing all nodes
- [x] Jenkins build running and completing
- [x] OpenProject comment posted with results
- [x] Task status updated automatically
- [x] New git branch created with code

---

## 🎯 Next Steps After Successful Test

1. **Create more spec files** for other features
2. **Import all tasks** to OpenProject from CSV
3. **Run pipeline on existing code** to find bugs
4. **Iterate on prompts** to improve code quality
5. **Add more good examples** to improve generation
6. **Scale up** - run multiple tasks in parallel

---

## 📞 Quick Debug Commands

```bash
# Check all services are running
docker ps | grep -E "n8n|jenkins|openproject"

# Check n8n logs
docker logs -f n8n-container

# Check Jenkins logs
docker logs -f jenkins-container

# Test GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Test Claude API
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-sonnet-4-20250514", "max_tokens": 10, "messages": [{"role": "user", "content": "test"}]}'

# Check n8n webhook
curl -X POST "http://localhost:5678/webhook/openproject-task-update" \
  -d '{"test": "data"}'

# View n8n executions
# http://localhost:5678 → Executions tab
```

---

## 🎓 Understanding the Flow

```
User moves task to "In Progress"
    ↓
OpenProject webhook fires
    ↓
n8n receives webhook (node 001)
    ↓
n8n filters for "In Progress" tasks (node 002)
    ↓
n8n fetches full task details (node 003)
    ↓
n8n parses SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES (node 004)
    ↓
n8n fetches spec file from GitHub (node 005)
    ↓
n8n decodes base64 content (node 006)
    ↓
n8n fetches good examples from GitHub (node 007)
    ↓
n8n merges all context (node 009)
    ↓
n8n builds comprehensive prompt (node 010)
    ↓
n8n calls Claude API (node 011)
    ↓
Claude generates: code + tests (streaming)
    ↓
n8n parses JSON response (node 012)
    ↓
n8n triggers Jenkins with generated code (node 013)
    ↓
Jenkins creates branch, applies code, runs tests
    ↓
Jenkins completes (success or failure)
    ↓
n8n fetches Jenkins results (node 015)
    ↓
n8n checks test status (node 016)
    ↓
IF SUCCESS:
  n8n posts success comment (node 017)
  n8n updates task to "Ready for Review" (node 018)
ELSE:
  n8n posts failure comment (node 019)
  n8n builds retry prompt with errors (node 020)
  n8n calls Claude again (loops back to node 011)
```

---

**Last Updated:** $(date)
**Pipeline Version:** 1.0
**Status:** Ready for Testing

---

**Need help?** Check:
- n8n execution logs (click each node)
- Jenkins console output
- OpenProject task comments
- This troubleshooting guide
