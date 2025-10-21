# Docker Container Maintenance - Automated Setup

## 🎯 Goal
Keep all Docker containers updated and healthy with **daily automated maintenance**.

---

## 📋 What This Solves

### Current Issues:
- ❌ Selenium containers restarting constantly
- ❌ Old/outdated container images
- ❌ Unhealthy containers not automatically restarted
- ❌ Dangling images consuming disk space
- ❌ Manual maintenance required

### After Setup:
- ✅ Automated daily container updates
- ✅ Unhealthy containers auto-restart
- ✅ Old images cleaned up automatically
- ✅ Slack notifications for issues
- ✅ Zero manual intervention needed

---

## 🚀 Quick Setup (RECOMMENDED: n8n)

### Why n8n?
- ✅ Already running on your server
- ✅ Visual workflow builder
- ✅ Built-in scheduling (cron)
- ✅ Slack/Email notifications
- ✅ Easy to monitor and debug

### Setup Steps

#### 1. Deploy Maintenance Script

```bash
# SSH to docker server
ssh docker-server

# Copy maintenance script
cd ~/rawgle-automation
chmod +x scripts/docker-maintenance.sh

# Test it
sudo ./scripts/docker-maintenance.sh
```

#### 2. Import n8n Workflow

1. **Open n8n**: http://10.90.10.6:5678
2. **Login**: admin / pandora123
3. **Click**: "Workflows" → "Import from File"
4. **Upload**: `docs/n8n-docker-maintenance.json`
5. **Configure** SSH credentials:
   - Name: `docker-server SSH`
   - Host: `localhost` (n8n is running ON docker server)
   - Port: `22`
   - Username: `claude`
   - Private Key: (use existing key)

#### 3. Configure Slack (Optional but Recommended)

1. **Create Slack Webhook**:
   - Go to https://api.slack.com/apps
   - Create new app → Incoming Webhooks
   - Activate and create webhook for `#docker-alerts` channel

2. **Add to n8n**:
   - Credentials → Add Credential
   - Type: Slack API
   - Webhook URL: (paste your webhook)

#### 4. Activate Workflow

1. Click **"Active"** toggle in top-right
2. Workflow will run daily at 2 AM
3. Check "Executions" to see history

---

## 📅 Schedule

**Default**: Daily at 2:00 AM

To change schedule in n8n:
1. Click "Schedule: Daily at 2 AM" node
2. Edit cron expression: `0 2 * * *` (hour min day month weekday)

Examples:
- `0 */6 * * *` - Every 6 hours
- `0 2 * * 0` - Weekly on Sunday at 2 AM
- `0 3,15 * * *` - Twice daily at 3 AM and 3 PM

---

## 🔧 Alternative: Cron (Manual Setup)

If you prefer cron over n8n:

```bash
# SSH to docker server
ssh docker-server

# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * /home/claude/rawgle-automation/scripts/docker-maintenance.sh >> /var/log/docker-maintenance.log 2>&1
```

---

## 📊 What Gets Automated

### 1. Health Checks
- ✅ Detects unhealthy containers
- ✅ Automatically restarts them
- ✅ Logs all actions

### 2. Container Updates
Updates these containers (configurable):
- `pandora-n8n`
- `pandora-jenkins`
- `pandora-grafana`
- `pandora-sonarqube`
- `pandora-selenium-hub`
- `pandora-selenium-chrome`
- `pandora-selenium-firefox`
- `pandora-openproject`

### 3. Cleanup
- ✅ Removes dangling images
- ✅ Cleans up old logs (>100MB)
- ✅ Docker system prune
- ✅ Removes unused volumes

### 4. Reporting
- ✅ Container status report
- ✅ Disk usage stats
- ✅ Top containers by CPU/memory
- ✅ Slack notifications

---

## 🎛️ Configuration

### Update Container List

Edit `scripts/docker-maintenance.sh`:

```bash
# Line ~200
CONTAINERS_TO_UPDATE=(
    "pandora-n8n"
    "pandora-jenkins"
    "your-container-name"  # Add your containers here
)
```

### Add Slack Notifications

```bash
# Set environment variable
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Or edit the script to hardcode it
```

### Change Schedule

In n8n workflow, edit "Schedule" node cron expression.

---

## 📈 Monitoring

### View Logs

```bash
# SSH to server
ssh docker-server

# View maintenance logs
tail -f /var/log/docker-maintenance.log

# View specific container logs
docker logs -f pandora-selenium-chrome
```

### n8n Execution History

1. Open: http://10.90.10.6:5678
2. Click: "Executions"
3. See all runs with status

### Grafana Dashboard

Create dashboard at http://10.90.10.6:3005:
- Docker container metrics
- Restart counts
- Resource usage

---

## 🛠️ Troubleshooting

### Issue: Selenium Containers Restarting

**Root Cause**: Usually memory/resource constraints

**Fix**:
```bash
# Check resource limits
docker inspect pandora-selenium-chrome | grep -A 5 Memory

# Increase memory limit (if using docker-compose)
# Edit docker-compose.yml:
services:
  selenium-chrome:
    mem_limit: 2g
    mem_reservation: 1g
```

### Issue: Maintenance Script Fails

**Check**:
```bash
# Run manually to see errors
ssh docker-server
sudo ~/rawgle-automation/scripts/docker-maintenance.sh
```

**Common Issues**:
- Permission denied → Run with `sudo` or add user to docker group
- Container not found → Update container list in script
- Network issues → Check Docker daemon

### Issue: n8n Workflow Not Running

**Check**:
1. Workflow is "Active" (toggle in top-right)
2. SSH credentials are correct
3. Schedule is set correctly
4. Check n8n logs: `docker logs -f pandora-n8n`

---

## 📋 Manual Maintenance Commands

Quick reference for manual operations:

```bash
# Check unhealthy containers
docker ps --filter "health=unhealthy"

# Restart all unhealthy
docker ps --filter "health=unhealthy" -q | xargs docker restart

# Check restarting containers
docker ps --filter "status=restarting"

# Update specific container
docker pull image:tag
docker stop container
docker rm container
docker run ...  # with same params

# Clean up
docker image prune -a -f
docker system prune -f --volumes

# Check disk usage
docker system df
```

---

## 🔔 Notifications Setup

### Slack Integration

1. **Create Slack App**:
   - Go to https://api.slack.com/apps
   - Create New App → From Scratch
   - Name: "Docker Maintenance Bot"

2. **Enable Incoming Webhooks**:
   - Features → Incoming Webhooks
   - Activate
   - Add New Webhook to Workspace
   - Select channel: `#docker-alerts`
   - Copy Webhook URL

3. **Add to n8n**:
   - n8n → Credentials → Slack API
   - Paste webhook URL

4. **Test**:
   - Run workflow manually
   - Check #docker-alerts channel

### Email Notifications

Edit script and set:
```bash
export NOTIFY_EMAIL="your-email@example.com"
```

Requires `mailutils` or `sendmail` installed.

---

## 📖 Best Practices

1. **Monitor First Week**
   - Check logs daily
   - Verify containers stay healthy
   - Adjust schedule if needed

2. **Backup Before Updates**
   - Use Docker volumes for data
   - Regular backups of important containers
   - Test in dev environment first

3. **Gradual Rollout**
   - Start with non-critical containers
   - Add production containers gradually
   - Monitor for issues

4. **Resource Monitoring**
   - Watch CPU/Memory usage
   - Set alerts for high usage
   - Adjust container limits as needed

---

## 🎯 Next Steps

1. ✅ Deploy maintenance script to server
2. ✅ Import n8n workflow
3. ✅ Configure Slack notifications
4. ✅ Test workflow manually
5. ✅ Activate and monitor

---

## 📞 Support

### Files Location

**On Server**: `~/rawgle-automation/scripts/docker-maintenance.sh`
**n8n Workflow**: `docs/n8n-docker-maintenance.json`
**This Guide**: `docs/DOCKER_MAINTENANCE_SETUP.md`

### Quick Commands

```bash
# Deploy script
ssh docker-server
cd ~/rawgle-automation
chmod +x scripts/docker-maintenance.sh

# Test run
sudo ./scripts/docker-maintenance.sh

# View logs
tail -f /var/log/docker-maintenance.log

# n8n
open http://10.90.10.6:5678
```

---

**Your containers will now update and maintain themselves daily! 🚀**

*No more manual updates. No more surprise downtime. Just set it and forget it.*
