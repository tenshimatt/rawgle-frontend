# 🐳 Docker Container Automated Maintenance

## 📊 Current Situation

Your Portainer shows multiple stacks that need automated updates:
- Old repositories not auto-updating
- Manual maintenance burden
- Need daily automated updates

## 🎯 Solution Options Comparison

### Option 1: Watchtower (Recommended ⭐)
**Best for: Simple, reliable automated updates**

```yaml
version: '3'
services:
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=true
      - WATCHTOWER_SCHEDULE=0 0 2 * * *  # Daily at 2 AM
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      - WATCHTOWER_NOTIFICATION_URL=generic+https://n8n.beyondpandora.com/webhook/watchtower
    command: --interval 86400  # 24 hours
```

**Pros:**
✅ Purpose-built for Docker updates
✅ Minimal resource usage
✅ Proven stability
✅ Native Docker socket integration
✅ Webhook notifications to n8n

**Cons:**
❌ Limited to container updates only
❌ No custom logic

### Option 2: n8n Workflow
**Best for: Complex orchestration with custom logic**

```yaml
# n8n workflow features:
- Custom pre/post-update scripts
- Conditional updates based on criteria
- Integration with OpenProject/Jenkins
- Complex notification logic
- Health checks before/after updates
```

**Pros:**
✅ Full control and customization
✅ Complex conditional logic
✅ Multi-system integration
✅ Custom health checks

**Cons:**
❌ More complex to maintain
❌ Higher resource usage
❌ More failure points

### Option 3: Hybrid Approach (RECOMMENDED 🚀)
**Watchtower for updates + n8n for orchestration**

Best of both worlds:
- Watchtower handles actual updates (reliable)
- n8n orchestrates maintenance workflow
- Health checks and notifications via n8n
- Roll back capability if needed

## 🚀 Recommended Implementation

### 1. Deploy Watchtower Stack

```yaml
# /home/docker-admin/watchtower/docker-compose.yml
version: '3.8'

services:
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower-updater
    restart: unless-stopped
    networks:
      - monitoring
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      # Scheduling
      - WATCHTOWER_SCHEDULE=0 0 2 * * *  # 2 AM daily
      - WATCHTOWER_TIMEOUT=300s

      # Behavior
      - WATCHTOWER_CLEANUP=true          # Remove old images
      - WATCHTOWER_INCLUDE_STOPPED=true  # Update stopped containers
      - WATCHTOWER_INCLUDE_RESTARTING=true
      - WATCHTOWER_ROLLING_RESTART=true  # One at a time

      # Filtering
      - WATCHTOWER_LABEL_ENABLE=false    # Update all unless excluded
      - WATCHTOWER_MONITOR_ONLY=false    # Actually update, don't just monitor

      # Notifications (to n8n)
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      - WATCHTOWER_NOTIFICATION_URL=generic+http://10.90.10.6:5678/webhook/watchtower-updates

      # Logging
      - WATCHTOWER_DEBUG=false
      - WATCHTOWER_LOG_LEVEL=info
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

networks:
  monitoring:
    external: true
```

### 2. Exclude Specific Containers

Add labels to containers you DON'T want auto-updated:

```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```

### 3. n8n Maintenance Workflow

```json
{
  "name": "Daily Container Maintenance",
  "nodes": [
    {
      "name": "Schedule - Daily 1:30 AM",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [
            {
              "hour": 1,
              "minute": 30
            }
          ]
        }
      }
    },
    {
      "name": "Pre-Update Health Check",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://10.90.10.6:9000/api/endpoints/3/docker/containers/json",
        "method": "GET",
        "authentication": "genericCredentialType",
        "options": {}
      }
    },
    {
      "name": "Watchtower Webhook Receiver",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "watchtower-updates",
        "method": "POST"
      }
    },
    {
      "name": "Parse Update Results",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Parse Watchtower notification\nconst updates = $input.all();\nconst successful = updates.filter(u => u.json.level === 'info');\nconst failed = updates.filter(u => u.json.level === 'error');\n\nreturn [\n  {\n    json: {\n      total: updates.length,\n      successful: successful.length,\n      failed: failed.length,\n      details: updates.map(u => ({\n        container: u.json.container,\n        status: u.json.level,\n        message: u.json.message\n      }))\n    }\n  }\n];"
      }
    },
    {
      "name": "Post-Update Health Check",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://10.90.10.6:9000/api/endpoints/3/docker/containers/json",
        "method": "GET"
      }
    },
    {
      "name": "Send Notification",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "=http://10.90.10.6:5678/webhook/maintenance-report",
        "method": "POST",
        "bodyParameters": {
          "parameters": [
            {
              "name": "updates",
              "value": "={{ $json.successful }}"
            },
            {
              "name": "failures",
              "value": "={{ $json.failed }}"
            },
            {
              "name": "timestamp",
              "value": "={{ $now.toISO() }}"
            }
          ]
        }
      }
    },
    {
      "name": "Cleanup Old Images",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "docker image prune -af --filter \"until=72h\""
      }
    }
  ]
}
```

## 🎯 Deployment Steps

### Step 1: Deploy Watchtower
```bash
ssh docker-server
mkdir -p ~/watchtower
cd ~/watchtower

# Create docker-compose.yml (see above)
nano docker-compose.yml

# Deploy
docker compose up -d

# Verify
docker logs -f watchtower-updater
```

### Step 2: Import n8n Workflow
1. Login to n8n: http://10.90.10.6:5678
2. Import workflow JSON (above)
3. Configure Portainer credentials
4. Activate workflow

### Step 3: Test Run
```bash
# Trigger manual update
docker exec watchtower-updater /watchtower --run-once

# Check logs
docker logs -f watchtower-updater
```

## 📊 Monitoring Dashboard

Create Grafana dashboard for container updates:
- Update success rate
- Containers pending updates
- Image age tracking
- Failed update alerts

## 🔒 Safety Features

### Rollback Strategy
```bash
# Tag current image before update
docker tag myimage:latest myimage:backup-$(date +%Y%m%d)

# Rollback if needed
docker-compose down
docker tag myimage:backup-20250121 myimage:latest
docker-compose up -d
```

### Update Windows
```yaml
environment:
  # Only update during maintenance window
  - WATCHTOWER_SCHEDULE=0 0 2 * * *  # 2-3 AM only
```

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 🎯 Recommended Configuration for You

**Use Hybrid Approach:**
1. **Watchtower** - Handles daily updates at 2 AM
2. **n8n** - Receives notifications, runs health checks
3. **Portainer** - Manual oversight and emergency intervention

This gives you:
✅ Automated daily updates
✅ Health monitoring
✅ Update notifications
✅ Manual override capability
✅ Rollback safety
✅ Minimal maintenance

## 🚨 Critical Containers to Exclude

Add `com.centurylinklabs.watchtower.enable=false` to:
- Production databases (PostgreSQL, MongoDB)
- OpenProject (schema migrations need manual review)
- Any container with stateful data requiring migration

## 📈 Next Steps

1. Deploy Watchtower stack
2. Import n8n maintenance workflow
3. Test with non-critical containers first
4. Expand to all containers after validation
5. Set up monitoring dashboard

---

**Estimated Setup Time:** 30 minutes
**Daily Maintenance Time:** 0 minutes (fully automated)
**Monthly Review:** 10 minutes (check logs)
