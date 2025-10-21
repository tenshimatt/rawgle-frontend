# ⚡ QUICK START - Get Running in 5 Minutes

## ✅ What You Have

- [x] Watchtower deployed and running
- [x] Portainer API token: `ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=`
- [x] n8n workflow file ready to import
- [x] Next update scheduled: Tomorrow 2:00 AM

## 🚀 Final Step: Import n8n Workflow

### 1. Open n8n
```
http://10.90.10.6:5678
```

### 2. Import Workflow
- Click: **Workflows** → **Import from File**
- Select: `/Users/mattwright/pandora/rawgle-frontend/docker/watchtower/n8n-workflow.json`
- Click: **Import**

### 3. Add Portainer Credential
In the workflow editor:

1. Click any **red warning icon** on a node
2. Click **"Credential"** dropdown → **"Create New"**
3. Select: **"HTTP Header Auth"**
4. Fill in:
   - **Name:** `Portainer API`
   - **Header Name:** `X-API-Key`
   - **Header Value:** `ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=`
5. Click: **Save**
6. Apply same credential to all HTTP nodes

### 4. Activate Workflow
- Toggle switch at top: **Inactive** → **Active** ✅

## ✅ Done!

Tomorrow at 2:00 AM:
- Watchtower checks for updates
- Updates any outdated containers
- Sends webhook to n8n
- n8n generates maintenance report

## 📊 Check Status

**Watchtower:**
```bash
ssh docker-server docker logs watchtower-updater
```

**n8n Workflow:**
- Open: http://10.90.10.6:5678
- Check: Executions tab

## 📚 Full Documentation

- **Setup Details:** [N8N_SETUP_INSTRUCTIONS.md](N8N_SETUP_INSTRUCTIONS.md)
- **Deployment Info:** [WATCHTOWER_DEPLOYED.md](WATCHTOWER_DEPLOYED.md)
- **Quick Reference:** [WATCHTOWER_QUICK_START.md](WATCHTOWER_QUICK_START.md)

---

**That's it! Your container maintenance is now fully automated.** 🎉
