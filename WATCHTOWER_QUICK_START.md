# 🐳 Watchtower Quick Start Guide

## TL;DR - Deploy in 2 Minutes

```bash
# SSH to your docker server
ssh docker-server

# Run deployment script
cd ~/rawgle-automation
./scripts/deploy-watchtower.sh
```

That's it! Your containers will now update automatically daily at 2 AM.

---

## 🎯 What Problem Does This Solve?

**Your Issue:** Portainer showing old repos, manual container updates, maintenance burden

**Solution:** Watchtower + n8n = Fully automated container updates + health monitoring

**Result:**
- ✅ Daily automatic updates (2 AM)
- ✅ Old images auto-cleaned
- ✅ Health checks before/after
- ✅ Notifications when complete
- ✅ Zero manual maintenance

---

## 📊 Comparison: Your Options

### ❌ Manual Updates (Current State)
```bash
# For EACH container, EVERY TIME:
docker pull image:latest
docker stop container
docker rm container
docker run ...
docker image prune
# Repeat 20+ times for all containers
```
**Time:** 2+ hours monthly
**Risk:** High (human error, forgotten containers)

### ✅ Watchtower (Recommended)
```yaml
# One-time setup, runs forever
watchtower:
  schedule: daily
  auto_update: all_containers
  cleanup: automatic
```
**Time:** 30 min setup, 0 min maintenance
**Risk:** Low (automated, tested, rollback capable)

### 🔧 n8n Workflows (Hybrid)
- Watchtower handles updates
- n8n adds monitoring/alerts
- Best of both worlds

---

## 🚀 Deployment Steps

### Step 1: Deploy Watchtower (2 min)

```bash
ssh docker-server
cd ~/rawgle-automation
./scripts/deploy-watchtower.sh
```

Script will:
1. ✅ Create monitoring network
2. ✅ Deploy Watchtower container
3. ✅ Configure daily schedule (2 AM)
4. ✅ Enable cleanup
5. ✅ Set up n8n webhooks

### Step 2: Import n8n Workflow (3 min)

1. Open http://10.90.10.6:5678
2. Click **"Workflows"** → **"Import from File"**
3. Select `docker/watchtower/n8n-workflow.json`
4. Configure Portainer API credentials:
   - URL: `http://10.90.10.6:9000`
   - API Key: (get from Portainer → Account → API tokens)
5. Click **"Activate"**

### Step 3: Exclude Critical Containers (5 min)

Edit containers you DON'T want auto-updated:

```bash
# Example: OpenProject (needs manual migration review)
ssh docker-server
cd /path/to/openproject
nano docker-compose.yml
```

Add this label:
```yaml
services:
  openproject:
    # ... existing config ...
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
```

Then restart:
```bash
docker compose up -d
```

---

## ✅ Verification

### Check Watchtower is Running
```bash
ssh docker-server
docker ps | grep watchtower
```

Expected output:
```
watchtower-updater   Up 5 minutes   (healthy)
```

### View Logs
```bash
docker logs -f watchtower-updater
```

Expected output:
```
time="2025-01-21T02:00:00Z" level=info msg="Watchtower 1.7.1"
time="2025-01-21T02:00:01Z" level=info msg="Scheduled to run at 2025-01-22T02:00:00Z"
```

### Test Manual Run (Optional)
```bash
docker exec watchtower-updater /watchtower --run-once
```

---

## 📅 What Happens Daily

### 2:00 AM - Automatic Update Sequence

```
1:30 AM  → n8n pre-check workflow starts
          ├─ Capture current container states
          ├─ Run health checks
          └─ Store baseline for comparison

2:00 AM  → Watchtower wakes up
          ├─ Check Docker Hub for updates
          ├─ Found 5 updates available
          └─ Begin rolling update...

2:01 AM  → Update nginx (30s)
          ├─ Pull new image
          ├─ Stop old container
          ├─ Start new container
          └─ Verify health ✓

2:02 AM  → Update postgres (45s)
          └─ Same process...

2:05 AM  → All updates complete
          ├─ Cleanup old images
          └─ Send webhook to n8n

2:06 AM  → n8n post-check workflow
          ├─ Compare states
          ├─ Generate report
          ├─ Send notifications
          └─ Done ✓

You wake up at 8 AM → Everything already updated ✨
```

---

## 🔍 Monitoring Your Updates

### Daily Update Report (n8n sends you)

```markdown
🐳 Container Maintenance Report
📅 2025-01-22 02:06:15

Summary:
- ✅ Updated: 5
- ❌ Failed: 0
- ⏸️ Unchanged: 12
- 📊 Total: 17

Updated Containers:
- nginx: nginx:1.25.3 → nginx:1.25.4
- postgres: postgres:16.1 → postgres:16.2
- n8n: n8nio/n8n:1.22.0 → n8nio/n8n:1.23.0
- rawgle-frontend: latest → latest (new build)
- watchtower: containrrr/watchtower:1.7.0 → 1.7.1

Unchanged:
- openproject (excluded)
- portainer (excluded)
- ... (10 more up-to-date)
```

### Check Last Update Manually

```bash
# SSH to server
ssh docker-server

# View update history
docker logs watchtower-updater --tail 50

# Check specific container update time
docker inspect nginx | grep -A 5 Created
```

---

## ⚠️ Important: Containers to Exclude

**Always exclude these types:**

### 1. Databases with Schema Migrations
```yaml
# PostgreSQL, MongoDB, MySQL
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```
**Reason:** Schema migrations need manual review

### 2. OpenProject
```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```
**Reason:** Complex database migrations, breaking changes possible

### 3. Stateful Services
```yaml
# Redis with persistence, Elasticsearch, etc.
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```
**Reason:** Data migration complexity

### 4. Production Critical Services (Optional)
```yaml
# If you want manual control
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```
**Reason:** Update on your schedule, not automatically

---

## 🚨 Troubleshooting

### Problem: Container didn't update

**Check 1:** Is it excluded?
```bash
docker inspect container_name | grep watchtower.enable
```

**Check 2:** Is there actually an update?
```bash
docker pull image:latest
docker images | grep image
```

**Check 3:** View Watchtower logs
```bash
docker logs watchtower-updater | grep container_name
```

---

### Problem: Update broke container

**Solution: Rollback**

```bash
# Stop broken container
docker stop container_name

# Check available images
docker images | grep container_name

# Rollback to previous version
docker tag container_name:backup container_name:latest
docker compose up -d

# OR manually specify old version
docker run ... image:previous_version
```

**Prevention:** Test updates on staging first
- Clone production stack
- Run Watchtower on staging
- Verify 24 hours
- Then enable on production

---

### Problem: Too many updates, want weekly only

**Edit:** `docker/watchtower/docker-compose.yml`

```yaml
environment:
  # Change from daily to weekly (Sunday 2 AM)
  - WATCHTOWER_SCHEDULE=0 0 2 * * 0
```

Then restart:
```bash
ssh docker-server
cd ~/watchtower
docker compose restart
```

---

### Problem: Notification not received

**Check 1:** n8n webhook is active
```bash
# Test webhook manually
curl -X POST http://10.90.10.6:5678/webhook/watchtower-updates \
  -H "Content-Type: application/json" \
  -d '{"test": "notification"}'
```

**Check 2:** n8n workflow is activated
- Open n8n UI
- Check workflow status (should be "Active")

**Check 3:** Watchtower can reach n8n
```bash
docker exec watchtower-updater ping -c 3 10.90.10.6
```

---

## 🎯 Customization Options

### Change Update Schedule

```yaml
# Every 6 hours
- WATCHTOWER_SCHEDULE=0 0 */6 * * *

# Weekly on Sunday 2 AM
- WATCHTOWER_SCHEDULE=0 0 2 * * 0

# Monthly on 1st at 3 AM
- WATCHTOWER_SCHEDULE=0 0 3 1 * *

# Cron format: second minute hour day month weekday
```

### Monitor Only (Don't Update)

```yaml
# Test mode - only check, don't update
- WATCHTOWER_MONITOR_ONLY=true
```

Good for testing before enabling real updates.

### Update Only Specific Containers

```yaml
# Disable global updates
- WATCHTOWER_LABEL_ENABLE=true
```

Then only update containers with this label:
```yaml
services:
  myapp:
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```

---

## 📊 Resource Usage

**Watchtower Container:**
- CPU: <1% (idle), ~5% (during updates)
- RAM: ~20 MB
- Disk: ~50 MB (image)

**During Updates:**
- Network: Depends on image sizes
- Disk: Temporary spike (old + new images)
- Cleaned up automatically after

**Impact:**
- Updates one container at a time (rolling)
- ~30 seconds downtime per container
- Total update window: 5-15 minutes for full stack

---

## 🎓 Advanced Features

### Slack Notifications

```yaml
environment:
  - WATCHTOWER_NOTIFICATION_URL=slack://token@channel
```

### Email Notifications

```yaml
environment:
  - WATCHTOWER_NOTIFICATION_URL=smtp://user:pass@smtp.gmail.com:587/?from=watchtower@domain.com
```

### Discord Notifications

```yaml
environment:
  - WATCHTOWER_NOTIFICATION_URL=discord://token@channel
```

### Pre/Post Update Scripts

Use n8n workflow to run custom scripts before/after updates.

---

## 📚 More Resources

- **Full Documentation:** [docs/CONTAINER_MAINTENANCE.md](docs/CONTAINER_MAINTENANCE.md)
- **Watchtower Docs:** https://containrrr.dev/watchtower/
- **n8n Workflow:** [docker/watchtower/n8n-workflow.json](docker/watchtower/n8n-workflow.json)
- **Deployment Script:** [scripts/deploy-watchtower.sh](scripts/deploy-watchtower.sh)

---

## ✅ Checklist: Before You Go Live

- [ ] Deployed Watchtower
- [ ] Imported n8n workflow
- [ ] Configured Portainer API credentials
- [ ] Excluded critical containers (databases, OpenProject)
- [ ] Tested manual update run
- [ ] Verified notifications work
- [ ] Documented excluded containers
- [ ] Set up monitoring dashboard (optional)
- [ ] Tested rollback procedure (optional)

---

## 🎉 Success!

Your containers now update automatically. Zero maintenance required.

**What you save:**
- Time: 2+ hours monthly → 0 hours
- Errors: Manual mistakes → None
- Security: Delayed patches → Always current
- Stress: Forgot to update → Never happens

**Sleep well knowing everything stays current automatically.** 🚀

---

**Questions?** Check the full docs in [docs/CONTAINER_MAINTENANCE.md](docs/CONTAINER_MAINTENANCE.md)
