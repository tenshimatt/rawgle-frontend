# Deploy MCP Server to Production - Step by Step

**Target Server:** 10.90.10.6 (n8n server)
**Date:** 2025-10-30
**Estimated Time:** 30 minutes

---

## Prerequisites ✅

- [x] MCP server built successfully (dist/ directory)
- [x] Docker available on target server
- [x] SSH access to 10.90.10.6
- [x] n8n running on 10.90.10.6:5678

---

## Option 1: Docker Deployment (Recommended)

### Step 1: Copy Files to Server

```bash
# From your local machine
cd /Users/mattwright/pandora/rawgle-frontend

# Create deployment directory on server
ssh user@10.90.10.6 "mkdir -p /opt/mcp-playwright-server"

# Copy entire mcp-playwright-server directory
scp -r mcp-playwright-server/ user@10.90.10.6:/opt/mcp-playwright-server/

# Verify files copied
ssh user@10.90.10.6 "ls -la /opt/mcp-playwright-server"
```

### Step 2: Build Docker Image on Server

```bash
# SSH into server
ssh user@10.90.10.6

# Navigate to directory
cd /opt/mcp-playwright-server

# Build Docker image
docker build -t mcp-playwright-server:latest .

# Verify image built
docker images | grep mcp-playwright
```

### Step 3: Create Environment File

```bash
# Create .env file
cat > .env << 'EOF'
# Test Results Storage
TEST_RESULTS_DIR=/data/test-results
ARTIFACTS_RETENTION_DAYS=7

# Performance Settings
MAX_CONCURRENT_RUNS=3
MAX_TEST_DURATION=300000
BROWSER_TIMEOUT=30000

# Artifact Capture Settings
ENABLE_TRACING=true
ENABLE_VIDEO=true
ENABLE_SCREENSHOTS=true
ENABLE_CONSOLE_LOGS=true
ENABLE_NETWORK_LOGS=true
ENABLE_PERFORMANCE=true

# Security
SANITIZE_SENSITIVE_DATA=true

# Storage
SCREENSHOT_QUALITY=80
VIDEO_FPS=25
EOF
```

### Step 4: Start Container

```bash
# Create test results directory
mkdir -p ./test-results

# Run container
docker run -d \
  --name mcp-playwright \
  --restart unless-stopped \
  --env-file .env \
  -v $(pwd)/test-results:/data/test-results \
  -v $(pwd)/tests:/app/tests:ro \
  mcp-playwright-server:latest

# Check container is running
docker ps | grep mcp-playwright

# View logs
docker logs mcp-playwright
```

### Step 5: Verify Server is Working

```bash
# Test MCP server
docker exec -it mcp-playwright node test-mcp-server.js

# Expected output:
# ✅ MCP Server started successfully!
# ✅ Tools: run_tests, get_test_artifacts, analyze_failure
```

---

## Option 2: Direct Node.js Deployment (Alternative)

If Docker isn't available or you prefer direct Node.js:

### Step 1: Copy and Install

```bash
# SSH into server
ssh user@10.90.10.6

# Create directory
mkdir -p /opt/mcp-playwright-server
cd /opt/mcp-playwright-server

# Copy files from your local machine
# (run from local terminal)
scp -r mcp-playwright-server/* user@10.90.10.6:/opt/mcp-playwright-server/

# Back on server, install dependencies
cd /opt/mcp-playwright-server
npm install

# Build TypeScript (if not already built)
npm run build

# Install Playwright browsers
npx playwright install --with-deps chromium firefox webkit
```

### Step 2: Create Systemd Service

```bash
# Create service file
sudo tee /etc/systemd/system/mcp-playwright.service << 'EOF'
[Unit]
Description=MCP Playwright Test Runner
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/mcp-playwright-server
Environment="NODE_ENV=production"
Environment="TEST_RESULTS_DIR=/opt/mcp-playwright-server/test-results"
Environment="MAX_CONCURRENT_RUNS=3"
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create node user if doesn't exist
sudo useradd -r -s /bin/false node || true

# Set permissions
sudo chown -R node:node /opt/mcp-playwright-server

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable mcp-playwright
sudo systemctl start mcp-playwright

# Check status
sudo systemctl status mcp-playwright
```

---

## Option 3: Run Alongside n8n with Docker Compose

This is the cleanest option if n8n is already running via Docker:

### Step 1: Update docker-compose.yml

```bash
# On server 10.90.10.6
cd /opt/n8n  # or wherever your n8n docker-compose.yml is

# Add MCP service to existing docker-compose.yml
```

Add this to your existing `docker-compose.yml`:

```yaml
services:
  # ... existing n8n service ...

  mcp-playwright:
    build:
      context: /opt/mcp-playwright-server
      dockerfile: Dockerfile
    container_name: mcp-playwright
    restart: unless-stopped
    environment:
      - TEST_RESULTS_DIR=/data/test-results
      - MAX_CONCURRENT_RUNS=3
      - ARTIFACTS_RETENTION_DAYS=7
      - ENABLE_TRACING=true
      - ENABLE_VIDEO=true
      - ENABLE_SCREENSHOTS=true
      - ENABLE_CONSOLE_LOGS=true
      - ENABLE_NETWORK_LOGS=true
      - SANITIZE_SENSITIVE_DATA=true
    volumes:
      - /opt/mcp-playwright-server/test-results:/data/test-results
      - /opt/mcp-playwright-server/tests:/app/tests:ro
    networks:
      - n8n-network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

networks:
  n8n-network:
    external: true  # Use existing n8n network
```

### Step 2: Deploy

```bash
# Restart docker-compose with new service
docker-compose up -d mcp-playwright

# Check it's running
docker-compose ps

# View logs
docker-compose logs -f mcp-playwright
```

---

## Verify Deployment

Run these commands to verify everything is working:

```bash
# Check container is running
docker ps | grep mcp-playwright

# Check logs for startup message
docker logs mcp-playwright | grep "MCP Playwright Test Runner started successfully"

# Test the server
docker exec -it mcp-playwright node test-mcp-server.js

# Check test results directory
ls -la /opt/mcp-playwright-server/test-results
# Should be empty initially

# Check disk space
df -h /opt/mcp-playwright-server/test-results
```

---

## Integration with n8n

Now that the MCP server is deployed, you need to update your n8n workflow to call it.

### Method 1: Execute Command Node (Recommended)

In your n8n workflow (ID: uvAHpky6wTSJk3ts), add an "Execute Command" node:

**Node Configuration:**
- **Command:** `docker`
- **Arguments:**
  ```
  exec
  -i
  mcp-playwright
  node
  dist/index.js
  ```
- **Input Data:** JSON containing MCP protocol request

**Example Input to Node:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_tests",
    "arguments": {
      "url": "{{ $json.vercel_preview_url }}",
      "testFiles": ["tests/examples/basic.spec.ts"],
      "options": {
        "browser": "chromium",
        "headless": true,
        "screenshot": "on",
        "trace": true
      }
    }
  }
}
```

### Method 2: HTTP Request to Wrapper API (Advanced)

If you prefer HTTP API, create a simple wrapper:

```javascript
// /opt/mcp-playwright-server/http-wrapper.js
const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

app.post('/run-tests', async (req, res) => {
  const { url, testFiles, options } = req.body;

  const mcp = spawn('docker', ['exec', '-i', 'mcp-playwright', 'node', 'dist/index.js']);

  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'run_tests',
      arguments: { url, testFiles, options }
    }
  };

  mcp.stdin.write(JSON.stringify(request) + '\n');

  let output = '';
  mcp.stdout.on('data', (data) => {
    output += data.toString();
  });

  mcp.on('close', () => {
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse MCP response' });
    }
  });
});

app.listen(3001, () => console.log('MCP HTTP wrapper listening on :3001'));
```

Then in n8n, use HTTP Request node to POST to `http://localhost:3001/run-tests`.

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs mcp-playwright

# Common issues:
# 1. Port already in use - Not applicable (stdio only)
# 2. Permission denied on volumes
sudo chown -R 1000:1000 /opt/mcp-playwright-server/test-results

# 3. Out of memory
docker update --memory 2g mcp-playwright
```

### Playwright Browsers Not Installed

```bash
# Install browsers in running container
docker exec -it mcp-playwright npx playwright install --with-deps chromium firefox webkit
```

### Tests Failing

```bash
# Check test results
ls -la /opt/mcp-playwright-server/test-results/

# View latest test run
cd /opt/mcp-playwright-server/test-results
ls -t | head -1  # Get latest run ID
cd <run-id>

# View screenshots
ls screenshots/

# View console logs
cat console-logs.json | jq

# View network logs
cat network-logs.har | jq
```

### n8n Can't Connect to MCP Server

```bash
# Verify container is on same network as n8n
docker network ls
docker network inspect n8n-network | grep mcp-playwright

# Test from n8n container
docker exec -it n8n-container sh
apk add curl
docker exec -i mcp-playwright node dist/index.js
# Should start and wait for input
```

---

## Monitoring

### Check Server Health

```bash
# Container status
docker ps --filter name=mcp-playwright

# Resource usage
docker stats mcp-playwright --no-stream

# Disk usage (test results)
du -sh /opt/mcp-playwright-server/test-results
```

### Clean Up Old Test Results

```bash
# Manual cleanup (older than 7 days)
find /opt/mcp-playwright-server/test-results -type d -mtime +7 -exec rm -rf {} +

# Or create a cron job
crontab -e
# Add this line:
0 2 * * * find /opt/mcp-playwright-server/test-results -type d -mtime +7 -exec rm -rf {} +
```

### View Logs

```bash
# Real-time logs
docker logs -f mcp-playwright

# Last 100 lines
docker logs --tail 100 mcp-playwright

# Logs from last hour
docker logs --since 1h mcp-playwright
```

---

## Security Checklist

- [ ] MCP server runs as non-root user (in Docker: USER node)
- [ ] Test results directory has appropriate permissions
- [ ] Sensitive data sanitization is enabled (SANITIZE_SENSITIVE_DATA=true)
- [ ] Container resource limits set (memory: 2G, cpu: 1.0)
- [ ] No exposed network ports (stdio only)
- [ ] Environment variables for secrets (not hardcoded)

---

## Next Steps After Deployment

1. **Update n8n Workflow**
   - Add Execute Command node to call MCP server
   - Parse TestRunResult JSON
   - Handle test failures (call analyze_failure)
   - Loop back to Claude with artifacts

2. **Create Test Task in OpenProject**
   - Use template from BP-MCP-V1.md
   - Include SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES
   - Move to "In Progress"

3. **Monitor First Execution**
   - Watch n8n execution logs
   - Check MCP server logs: `docker logs -f mcp-playwright`
   - Verify test results are captured
   - Confirm artifacts are available

4. **Iterate and Refine**
   - Adjust timeout settings based on actual test durations
   - Tune artifact retention based on disk usage
   - Optimize test file selection
   - Improve error handling

---

## Quick Reference

**Start/Stop/Restart:**
```bash
docker start mcp-playwright
docker stop mcp-playwright
docker restart mcp-playwright
```

**View Logs:**
```bash
docker logs -f mcp-playwright
```

**Run Manual Test:**
```bash
docker exec -it mcp-playwright node test-mcp-server.js
```

**Check Disk Usage:**
```bash
du -sh /opt/mcp-playwright-server/test-results
```

**Clean Test Results:**
```bash
rm -rf /opt/mcp-playwright-server/test-results/*
```

**Update Image:**
```bash
cd /opt/mcp-playwright-server
git pull  # if using git
docker build -t mcp-playwright-server:latest .
docker stop mcp-playwright
docker rm mcp-playwright
# Then run docker run command again from Step 4
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Status:** Ready for deployment
