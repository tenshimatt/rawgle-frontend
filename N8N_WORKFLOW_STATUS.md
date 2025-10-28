# n8n Automation Workflow - Current Status

## ✅ What's Working

### Workflow Configuration
- **Workflow Name:** Auto Testing Pipeline - OpenProject to Claude
- **Workflow ID:** `5SCfe384ryGZLTM2`
- **Status:** **INACTIVE** (needs activation)
- **Location:** http://10.90.10.6:5678
- **Last Updated:** 2025-10-27 21:40:06
- **Nodes Configured:** 21 nodes

### Configured Credentials
1. ✅ **OpenProject API**
   - Credential ID: `tEUNLRDSpfVkn1ZK`
   - Used by nodes: Get Task Details, Post SUCCESS/FAILURE comments

2. ⚠️ **GitHub API**
   - Credential type: `githubApi`
   - Used by nodes: Fetch Spec File, Fetch Good Examples
   - **Status:** Referenced but not verified

3. ⚠️ **Claude API**
   - Credential type: `claudeApi`
   - Used by node: Call Claude API
   - **Status:** Referenced but not verified

4. ⚠️ **Jenkins API**
   - Credential type: `jenkinsApi`
   - Used by nodes: Trigger Jenkins, Get Jenkins Results
   - **Status:** Referenced but not verified

### Workflow Structure (All Nodes Present)
```
001. OpenProject Webhook Trigger (/webhook/openproject-task-update)
002. Filter: In Progress Tasks Only
003. Get Task Details from OpenProject ✅ Has credentials
004. Parse Task Info (extracts SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES)
005. Fetch Spec File from GitHub (needs GitHub creds)
006. Decode Spec File
007. Fetch Good Examples from GitHub (needs GitHub creds)
008. Parse Example Files
009. Merge Spec and Examples
010. Build Claude Prompt
011. Call Claude API (needs Claude creds)
012. Parse Claude Response
013. Trigger Jenkins Test Pipeline (needs Jenkins creds)
014. Wait for Jenkins (30 seconds)
015. Get Jenkins Results (needs Jenkins creds)
016. Check Test Results
017. Post SUCCESS to OpenProject ✅ Has credentials
018. Update Task Status to Ready for Review ✅ Has credentials
019. Post FAILURE to OpenProject ✅ Has credentials
020. Build Retry Prompt
```

---

## ⚠️ Issues to Resolve

### Critical Issues

#### 1. **Environment Variables Not Available** (License Limitation)
The workflow uses these environment variables, but n8n free version doesn't support variables API:
```bash
GITHUB_OWNER=tenshimatt          # Used in nodes 005, 007
GITHUB_REPO=rawgle-frontend       # Used in nodes 005, 007
JENKINS_URL=http://jenkins:8080   # Used in nodes 013, 015
OPENPROJECT_URL=...               # May be used
OPENPROJECT_STATUS_READY_FOR_REVIEW=7  # Used in node 018
OPENPROJECT_STATUS_FAILED=8       # May be used
```

**Impact:** Cannot verify env vars via API, but they can be set via:
- n8n UI → Settings → Environment Variables
- Docker environment variables
- .env file

**Workaround:** Set directly in n8n container environment or hardcode in workflow nodes.

---

#### 2. **Workflow is INACTIVE**
**Status:** Workflow exists but webhook won't trigger until activated.

**Solution:** Activate via n8n API or UI.

---

#### 3. **Credentials Not Verified**
Cannot verify via API whether these credentials are fully configured:
- GitHub API token
- Claude/Anthropic API key
- Jenkins API token

**Solution:** Verify in n8n UI → Credentials section.

---

### Non-Critical Issues

#### 4. **Credential Types Need Verification**
The workflow references credential types that may need to be created in n8n:
- `openProjectApi` ✅ (confirmed exists)
- `githubApi` (needs verification)
- `claudeApi` (needs verification)
- `jenkinsApi` (needs verification)

---

## 🔧 Required Actions to Activate Pipeline

### Step 1: Set Environment Variables (15 minutes)

**Option A: Via Docker Environment**
If running n8n in Docker:
```bash
# Edit docker-compose.yml or docker run command
docker run -d \
  -e GITHUB_OWNER=tenshimatt \
  -e GITHUB_REPO=rawgle-frontend \
  -e JENKINS_URL=http://jenkins:8080 \
  -e OPENPROJECT_URL=https://your-openproject.com \
  -e OPENPROJECT_STATUS_READY_FOR_REVIEW=7 \
  -e OPENPROJECT_STATUS_FAILED=8 \
  n8nio/n8n

# Then restart container
docker restart n8n-container
```

**Option B: Via n8n UI**
1. Open http://10.90.10.6:5678
2. Settings → Environment Variables (if available in your version)
3. Add each variable

**Option C: Hardcode in Workflow (Quick Fix)**
Replace `{{$env.GITHUB_OWNER}}` with `tenshimatt` in nodes 005, 007.

---

### Step 2: Verify All Credentials (10 minutes)

Go to n8n UI → Credentials and verify these exist:

#### GitHub API Credential
- **Name:** GitHub account (or similar)
- **Type:** GitHub
- **Access Token:** `ghp_YOUR_TOKEN_HERE`
- **Scopes required:** `repo`, `workflow`, `read:org`

**Test it:**
```bash
curl -H "Authorization: token ghp_YOUR_TOKEN" \
  https://api.github.com/repos/tenshimatt/rawgle-frontend
```

---

#### Claude/Anthropic API Credential
- **Name:** Claude API (or Anthropic account)
- **Type:** HTTP Header Auth
- **Header Name:** `x-api-key`
- **Header Value:** `sk-ant-api03-YOUR_KEY_HERE`

**Test it:**
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-api03-YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say hi"}]
  }'
```

---

#### Jenkins API Credential
- **Name:** Jenkins account
- **Type:** HTTP Basic Auth
- **Username:** Your Jenkins username
- **Password:** Jenkins API token (NOT your password!)

**Get Jenkins API token:**
1. Jenkins → User → Configure
2. API Token → Add new Token
3. Copy the token

**Test it:**
```bash
curl -u "username:api-token" \
  http://jenkins:8080/api/json
```

---

#### OpenProject API Credential (Already Configured ✅)
- **ID:** `tEUNLRDSpfVkn1ZK`
- **Type:** HTTP Header Auth
- **Header:** `Authorization`
- **Value:** `Basic YOUR_BASE64_KEY`

**This is already working!**

---

### Step 3: Activate the Workflow (2 minutes)

**Via n8n UI:**
1. Open http://10.90.10.6:5678
2. Go to Workflows
3. Click "Auto Testing Pipeline - OpenProject to Claude"
4. Toggle **Active** switch at top right (should turn blue)

**Via n8n API:**
```bash
curl -X PATCH 'http://10.90.10.6:5678/api/v1/workflows/5SCfe384ryGZLTM2' \
  -H 'X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjZiM2JkYS0wYjE2LTRiMzItOGUwYi03NDI4ODVmZmJjNTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNjkzNDU2LCJleHAiOjE3NjQyMDE2MDB9.d0zAj8TrJ_qHjZbBUYRhTRUqfhyiyS6IewU_o82Pqyw' \
  -H 'Content-Type: application/json' \
  -d '{
    "active": true
  }'
```

---

### Step 4: Configure OpenProject Webhook (5 minutes)

1. Go to OpenProject → Administration → Webhooks
2. Click **+ Webhook**
3. Configure:
   - **Name:** n8n Automation Pipeline
   - **URL:** `http://10.90.10.6:5678/webhook/openproject-task-update`
   - **Events:** Check "Work package updated"
   - **Secret:** (optional)
4. Click **Create**

---

### Step 5: Test the Pipeline (10 minutes)

#### Test 1: Manual Webhook Test
```bash
curl -X POST 'http://10.90.10.6:5678/webhook/openproject-task-update' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "updated",
    "_embedded": {
      "status": {
        "name": "In Progress"
      }
    },
    "_links": {
      "self": {
        "href": "https://openproject.example.com/api/v3/work_packages/1"
      }
    }
  }'
```

**Expected:**
- n8n receives webhook
- Check n8n → Executions tab for new execution
- Should see "Filter: In Progress Tasks Only" node activate

---

#### Test 2: Create Test Task in OpenProject

Use the template from `OPENPROJECT_TASK_TEMPLATE.md`:

```markdown
[AUTO] Hello World Test

## Feature Requirements
Create a simple page that displays "Hello World"

## Technical Requirements
- Next.js page at /hello
- Centered text
- Teal color

## Acceptance Criteria
- [ ] Page renders at /hello
- [ ] Text "Hello World" visible
- [ ] Text is centered

---

SPEC_FILE: /specs/features/hello-world.yml
GOOD_EXAMPLES: /src/app/page.tsx
TARGET_FILES: /src/app/hello/page.tsx

---

## Testing Instructions
1. Navigate to http://localhost:3005/hello
2. Verify text displays
```

**Then:**
1. Create this task in OpenProject
2. Move task to **"In Progress"** status
3. Watch n8n Executions tab
4. Should see full workflow execute

---

## 📊 Current Workflow Health

| Component | Status | Notes |
|-----------|--------|-------|
| Workflow Import | ✅ Complete | All 21 nodes configured |
| OpenProject Webhook | ⚠️ Needs Setup | Configure in OpenProject admin |
| OpenProject API Creds | ✅ Working | ID: tEUNLRDSpfVkn1ZK |
| GitHub API Creds | ⚠️ Unverified | May need to add |
| Claude API Creds | ⚠️ Unverified | May need to add |
| Jenkins API Creds | ⚠️ Unverified | May need to add |
| Environment Variables | ⚠️ Cannot Verify | Set via Docker/UI |
| Workflow Active Status | ❌ Inactive | Need to activate |

---

## 🎯 Quick Start Checklist

Use this to get the pipeline running:

- [ ] **Verify n8n credentials** (UI → Credentials)
  - [ ] GitHub API token added
  - [ ] Claude API key added
  - [ ] Jenkins API token added
  - [x] OpenProject API working

- [ ] **Set environment variables** (via Docker or hardcode)
  - [ ] GITHUB_OWNER=tenshimatt
  - [ ] GITHUB_REPO=rawgle-frontend
  - [ ] JENKINS_URL=http://jenkins:8080
  - [ ] OPENPROJECT_STATUS_READY_FOR_REVIEW=7

- [ ] **Activate workflow** (Toggle in UI or API call)

- [ ] **Configure OpenProject webhook**
  - [ ] URL: http://10.90.10.6:5678/webhook/openproject-task-update
  - [ ] Event: Work package updated

- [ ] **Create test task** (Use template)

- [ ] **Move task to "In Progress"**

- [ ] **Watch n8n Executions tab**

---

## 🔍 Monitoring & Debugging

### View Workflow Executions
1. Open http://10.90.10.6:5678
2. Click **Executions** tab (left sidebar)
3. Click on execution to see node-by-node data

### Debug Failed Nodes
- Red nodes indicate errors
- Click node to see input/output data
- Check error message at bottom

### Common Issues

**Webhook not triggering?**
- Verify workflow is active (blue toggle)
- Check OpenProject webhook URL matches
- Test manually with curl

**GitHub API 404?**
- Verify GitHub token has correct scopes
- Check GITHUB_OWNER env var is set
- Verify spec file path exists in repo

**Claude API 401?**
- Check API key is valid (starts with sk-ant-api03-)
- Verify key not expired

**Jenkins not starting?**
- Verify Jenkins URL is accessible from n8n container
- Check Jenkins credentials (use API token, not password)
- Ensure pipeline job exists

---

## 📞 Next Steps

1. **Activate via UI** (easiest for now)
   - Open http://10.90.10.6:5678
   - Toggle workflow active

2. **Verify credentials in UI**
   - Credentials → Check all 4 types exist

3. **Create test task**
   - Use hello-world example
   - Move to "In Progress"

4. **Watch execution**
   - Should see all 21 nodes fire
   - Check for any red (error) nodes

5. **Iterate and improve**
   - Refine prompts based on output
   - Add more spec files
   - Scale to full project

---

**Workflow Status:** Ready for activation
**Documentation:** Complete
**Test Tasks:** Available (28 tasks in CSV)
**Spec Files:** hello-world.yml created

**Last API Check:** 2025-10-28 (via n8n API key)
**Workflow Version:** d0e1e0fc-9c0e-4d16-97e2-5e8d45de25de
