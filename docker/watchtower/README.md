# 🐳 Watchtower - Automated Container Updates

## What This Does

Automatically updates all Docker containers daily at 2 AM:
- Pulls latest images
- Restarts containers with new versions
- Cleans up old images
- Sends notifications to n8n

## 🚀 Quick Deployment

### On Docker Server (10.90.10.6)

```bash
# SSH to server
ssh docker-server

# Create directory
mkdir -p ~/watchtower
cd ~/watchtower

# Copy docker-compose.yml from this repo
# Or create manually (see docker-compose.yml in this directory)

# Create monitoring network if it doesn't exist
docker network create monitoring 2>/dev/null || true

# Deploy
docker compose up -d

# Check logs
docker logs -f watchtower-updater
```

## ✅ Verify Deployment

```bash
# Check container is running
docker ps | grep watchtower

# View logs
docker logs watchtower-updater

# Test manual run
docker exec watchtower-updater /watchtower --run-once
```

## 🎯 How It Works

1. **Schedule**: Runs daily at 2 AM (configurable in docker-compose.yml)
2. **Check**: Scans all running containers for image updates
3. **Update**: Pulls new images and restarts containers one-by-one
4. **Cleanup**: Removes old unused images
5. **Notify**: Sends webhook to n8n with results

## 🚨 Excluding Containers from Auto-Update

Add this label to any container you DON'T want auto-updated:

```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```

**Recommended exclusions:**
- Production databases (PostgreSQL, MongoDB)
- OpenProject (manual migration review needed)
- Containers with complex state migrations

## 📊 Monitoring

### Check Last Run
```bash
docker logs watchtower-updater --tail 50
```

### View Updated Containers
```bash
docker logs watchtower-updater | grep -i "updated"
```

### Manual Trigger
```bash
# Force update check now
docker exec watchtower-updater /watchtower --run-once
```

## 🔧 Configuration Options

Edit `docker-compose.yml` to customize:

```yaml
environment:
  # Run every 6 hours instead of daily
  - WATCHTOWER_SCHEDULE=0 0 */6 * * *

  # Only monitor, don't update (test mode)
  - WATCHTOWER_MONITOR_ONLY=true

  # Update specific containers only
  - WATCHTOWER_LABEL_ENABLE=true  # Only update containers with label
```

## 🔗 Integration with n8n

Watchtower sends notifications to:
`http://10.90.10.6:5678/webhook/watchtower-updates`

### n8n Webhook Payload Example:
```json
{
  "level": "info",
  "container": "rawgle-frontend",
  "message": "Updated to sha256:abc123...",
  "timestamp": "2025-01-21T02:00:15Z"
}
```

## 📈 Typical Update Flow

```
2:00 AM → Watchtower wakes up
       ↓
       Check Docker Hub for new images
       ↓
       Found 3 updates: nginx, postgres, n8n
       ↓
       Pull new images (2 min)
       ↓
       Stop nginx → Start new nginx → Verify (30s)
       ↓
       Stop postgres → Start new postgres → Verify (45s)
       ↓
       Stop n8n → Start new n8n → Verify (30s)
       ↓
       Cleanup old images (15s)
       ↓
       Send notification to n8n
       ↓
2:03 AM → Done ✅
```

## 🚨 Troubleshooting

### Container Not Updating?
```bash
# Check if container is excluded
docker inspect <container> | grep watchtower.enable

# Force update
docker exec watchtower-updater /watchtower --run-once --debug
```

### Image Pull Failures?
```bash
# Check Docker Hub rate limits
docker exec watchtower-updater /watchtower --run-once --debug

# Verify network connectivity
docker exec watchtower-updater ping -c 3 registry.hub.docker.com
```

### Notification Not Received?
```bash
# Test webhook manually
curl -X POST http://10.90.10.6:5678/webhook/watchtower-updates \
  -H "Content-Type: application/json" \
  -d '{"test": "notification"}'
```

## 🎯 Next Steps After Deployment

1. **Deploy n8n maintenance workflow** (see CONTAINER_MAINTENANCE.md)
2. **Set up Grafana dashboard** for monitoring
3. **Label critical containers** to exclude from auto-update
4. **Test rollback procedure** (backup images)

## 📚 Resources

- [Watchtower Documentation](https://containrrr.dev/watchtower/)
- [Notification Configuration](https://containrrr.dev/watchtower/notifications/)
- [Arguments Reference](https://containrrr.dev/watchtower/arguments/)

---

**Status**: Ready to deploy
**Estimated downtime per update**: ~30 seconds per container
**Storage cleanup**: Automatic (old images removed)
