# 🎯 n8n Workflow Setup - Quick Guide

## ✅ You Have Everything You Need!

**Portainer API Token:** `ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=`

**Workflow File:** `/Users/mattwright/pandora/rawgle-frontend/docker/watchtower/n8n-workflow.json`

---

## 🚀 Import and Configure (5 Minutes)

### Step 1: Import Workflow

1. Open n8n: **http://10.90.10.6:5678**
2. Click **"Workflows"** (left sidebar)
3. Click **"Import from File"** or **"Add Workflow"** → **"Import from File"**
4. Select file: `/Users/mattwright/pandora/rawgle-frontend/docker/watchtower/n8n-workflow.json`
   - Or from Downloads if you copied it there
5. Click **"Import"**

### Step 2: Configure Portainer Credentials

The workflow has several HTTP Request nodes that need credentials:

1. **In the imported workflow**, find any node with a **red warning icon** (usually "Pre-Update Container Status" node)
2. Click on the node
3. Click on the **"Credential for HTTP Request"** dropdown
4. Select **"Create New Credential"**
5. Choose credential type: **"HTTP Header Auth"**
6. Fill in:
   ```
   Name: Portainer API
   Header Name: X-API-Key
   Header Value: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=
   ```
7. Click **"Save"**
8. **Repeat for all HTTP Request nodes** that talk to Portainer
   - OR select the same "Portainer API" credential from dropdown

### Step 3: Activate Workflow

1. At the top of the workflow editor, find the **"Inactive"** toggle
2. Click it to change to **"Active"**
3. The workflow should now show **green "Active"** status

---

## 🔧 Nodes That Need the Credential

These nodes connect to Portainer API and need the credential configured:

1. **Pre-Update Container Status** - `GET /api/endpoints/3/docker/containers/json`
2. **Post-Update Container Status** - `GET /api/endpoints/3/docker/containers/json`

**Note:** The endpoint ID might be different on your system. If you get errors:

1. Check your endpoint ID:
   ```bash
   curl -H "X-API-Key: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=" \
        http://10.90.10.6:9000/api/endpoints | jq '.[].Id'
   ```
2. Update the URL in the nodes if needed

---

## 📊 What the Workflow Does

### Daily at 1:30 AM
- Captures current state of all containers
- Stores baseline for comparison

### Receives Watchtower Webhooks (after 2 AM)
- Webhook URL: `http://10.90.10.6:5678/webhook/watchtower-updates`
- Parses update notifications
- Compares before/after states

### Generates Reports
- What was updated
- What failed
- What's unchanged
- Space freed

### Sends Notifications
- Success reports
- Failure alerts

---

## ✅ Verification

### Test the Workflow

1. **Trigger Manual Run:**
   - In n8n, click the "Daily at 1:30 AM" node
   - Click **"Execute Node"** or **"Test Workflow"**
   - Should see container data returned

2. **Test Watchtower Webhook:**
   ```bash
   curl -X POST http://10.90.10.6:5678/webhook/watchtower-updates \
     -H "Content-Type: application/json" \
     -d '{"level":"info","container":"test","message":"test update"}'
   ```
   - Should receive response
   - Check workflow execution history

3. **Wait for Tomorrow 2 AM:**
   - Watchtower will run
   - Should trigger webhook automatically
   - Workflow will generate first report

---

## 🚨 Troubleshooting

### Issue: "Unauthorized" or "401" errors
**Solution:** Double-check API token in credential configuration

### Issue: "Endpoint not found" or "404" on `/api/endpoints/3/...`
**Solution:** Check your endpoint ID:
```bash
curl -H "X-API-Key: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=" \
     http://10.90.10.6:9000/api/endpoints | jq .
```
Update the workflow URLs to use correct endpoint ID.

### Issue: Workflow not triggering
**Solution:**
- Ensure workflow is **Active** (green toggle)
- Check webhook URL matches Watchtower config
- Verify n8n is accessible from Watchtower container:
  ```bash
  ssh docker-server "docker exec watchtower-updater wget -O- http://10.90.10.6:5678 2>&1 | head"
  ```

---

## 📋 Quick Checklist

- [ ] Import workflow file
- [ ] Create "Portainer API" credential with token
- [ ] Configure all HTTP Request nodes with credential
- [ ] Activate workflow (toggle to green)
- [ ] Test manual execution
- [ ] Test webhook with curl
- [ ] Wait for tomorrow's first automated run

---

## 🎯 Next Steps After Setup

1. **Tomorrow morning (after 2 AM):**
   - Check n8n execution history
   - Review your first maintenance report
   - Verify Watchtower webhook triggered successfully

2. **Optional Enhancements:**
   - Add email/Slack notification nodes
   - Customize report format
   - Add additional health checks
   - Set up alerting for failures

---

## 📚 Files Reference

- **Workflow File:** `/Users/mattwright/pandora/rawgle-frontend/docker/watchtower/n8n-workflow.json`
- **Watchtower Config:** `~/watchtower/docker-compose.yml` (on server)
- **Full Documentation:** `/Users/mattwright/pandora/rawgle-frontend/docs/CONTAINER_MAINTENANCE.md`

---

**Ready to go! Import the workflow and you'll have full container update monitoring.** 🚀
