# Deployment Guide - MCP Playwright Test Runner

This guide provides step-by-step instructions for deploying the MCP Playwright Test Runner in various environments.

## Table of Contents

- [Quick Start](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Docker Production Deployment](#docker-production-deployment)
- [Cloud Deployment Options](#cloud-deployment-options)
- [Integration with n8n](#integration-with-n8n)
- [Verification & Testing](#verification--testing)
- [Maintenance](#maintenance)

---

## Quick Start

### 5-Minute Setup (Docker)

```bash
# 1. Clone and navigate to directory
cd mcp-playwright-server

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Build and start
docker-compose up -d

# 4. Verify
docker-compose logs -f mcp-playwright
```

That's it! The MCP server is now running and ready to receive tool calls.

---

## Local Development Setup

### Prerequisites

```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Check available memory (need 2GB+)
free -h  # Linux
vm_stat  # macOS
```

### Step-by-Step Installation

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Install Playwright Browsers

```bash
# Install all browsers
npx playwright install chromium firefox webkit

# Or install specific browser
npx playwright install chromium

# Install with system dependencies (Linux)
npx playwright install --with-deps
```

#### 3. Configure Environment

```bash
# Copy example config
cp .env.example .env

# Edit configuration
nano .env  # or your preferred editor
```

**Minimum required settings**:
```bash
ARTIFACTS_DIR=./test-results
MAX_CONCURRENT_RUNS=2
HEADLESS=true
```

#### 4. Build TypeScript

```bash
npm run build
```

#### 5. Start Development Server

```bash
# Start with hot reload (if configured)
npm run dev

# Or start production build
npm start
```

#### 6. Verify Installation

```bash
# Test basic functionality
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm start
```

### Development Workflow

```bash
# Watch mode for auto-rebuild
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

---

## Docker Production Deployment

### Building the Image

#### Option 1: Using docker-compose (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

#### Option 2: Manual Docker Build

```bash
# Build image
docker build -t mcp-playwright-server:latest .

# Run container
docker run -d \
  --name mcp-playwright \
  -v $(pwd)/test-results:/data/test-results \
  -e HEADLESS=true \
  -e MAX_CONCURRENT_RUNS=3 \
  --restart unless-stopped \
  mcp-playwright-server:latest

# View logs
docker logs -f mcp-playwright
```

### Multi-Stage Build Benefits

The Dockerfile uses multi-stage builds to:
- Minimize final image size (~500MB vs 2GB+)
- Separate build dependencies from runtime
- Pre-install Playwright browsers
- Run as non-root user for security

### Resource Allocation

```yaml
# Recommended resources in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G      # Adjust based on concurrent runs
      cpus: '1.0'
    reservations:
      memory: 1G
      cpus: '0.5'
```

**Scaling Guidelines**:
- 1 concurrent run: 1GB RAM
- 2 concurrent runs: 1.5GB RAM
- 3 concurrent runs: 2GB RAM
- 4+ concurrent runs: 3GB+ RAM

---

## Cloud Deployment Options

### AWS ECS (Fargate)

#### 1. Push Image to ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t mcp-playwright-server .
docker tag mcp-playwright-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/mcp-playwright-server:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/mcp-playwright-server:latest
```

#### 2. Create ECS Task Definition

```json
{
  "family": "mcp-playwright-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "mcp-playwright",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/mcp-playwright-server:latest",
      "environment": [
        {"name": "HEADLESS", "value": "true"},
        {"name": "MAX_CONCURRENT_RUNS", "value": "3"}
      ],
      "mountPoints": [
        {
          "sourceVolume": "test-results",
          "containerPath": "/data/test-results"
        }
      ]
    }
  ],
  "volumes": [
    {
      "name": "test-results",
      "efsVolumeConfiguration": {
        "fileSystemId": "fs-xxxxx"
      }
    }
  ]
}
```

#### 3. Create ECS Service

```bash
aws ecs create-service \
  --cluster default \
  --service-name mcp-playwright-service \
  --task-definition mcp-playwright-server \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/mcp-playwright-server

# Deploy
gcloud run deploy mcp-playwright-server \
  --image gcr.io/PROJECT_ID/mcp-playwright-server \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --max-instances 3
```

### Azure Container Instances

```bash
# Create resource group
az group create --name mcp-playwright-rg --location eastus

# Create container instance
az container create \
  --resource-group mcp-playwright-rg \
  --name mcp-playwright-server \
  --image <your-registry>/mcp-playwright-server:latest \
  --cpu 1 \
  --memory 2 \
  --restart-policy Always \
  --environment-variables HEADLESS=true MAX_CONCURRENT_RUNS=3
```

### DigitalOcean App Platform

```yaml
# app.yaml
name: mcp-playwright-server
services:
  - name: mcp-playwright
    dockerfile_path: Dockerfile
    github:
      repo: your-username/mcp-playwright-server
      branch: main
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: HEADLESS
        value: "true"
      - key: MAX_CONCURRENT_RUNS
        value: "3"
```

```bash
# Deploy
doctl apps create --spec app.yaml
```

---

## Integration with n8n

### Setup n8n with MCP

#### 1. Start n8n (via docker-compose)

```bash
# n8n is included in docker-compose.yml
docker-compose up -d n8n

# Access n8n
open http://localhost:5678
```

#### 2. Configure MCP Connection

**In n8n UI:**
1. Go to Settings → Credentials
2. Add new credential type: "MCP Server"
3. Configure:
   - **Name**: Playwright Test Runner
   - **Transport**: stdio
   - **Command**: `docker exec -i mcp-playwright-server node dist/index.js`

#### 3. Create Workflow

**Sample workflow nodes:**

```javascript
// Node 1: Webhook (Trigger)
{
  "parameters": {
    "path": "test-trigger",
    "responseMode": "onReceived"
  }
}

// Node 2: MCP Tool Call (run_tests)
{
  "parameters": {
    "server": "playwright-test-runner",
    "tool": "run_tests",
    "arguments": {
      "url": "={{$json.testUrl}}",
      "options": {
        "headless": true,
        "screenshot": "only-on-failure"
      }
    }
  }
}

// Node 3: Process Results
{
  "parameters": {
    "code": `
      const results = $input.all()[0].json;
      return {
        json: {
          passed: results.status === 'passed',
          summary: results.summary,
          failures: results.tests.filter(t => t.status === 'failed')
        }
      };
    `
  }
}
```

#### 4. Webhook Configuration

```bash
# Test webhook
curl -X POST http://localhost:5678/webhook/test-trigger \
  -H "Content-Type: application/json" \
  -d '{"testUrl": "https://example.com"}'
```

### Advanced n8n Integration

#### Claude + MCP Workflow

```javascript
// Node: Call Claude with MCP tools
{
  "parameters": {
    "url": "https://api.anthropic.com/v1/messages",
    "method": "POST",
    "authentication": "headerAuth",
    "body": {
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 8000,
      "tools": [
        {
          "type": "mcp",
          "server": "playwright-test-runner"
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Test the application at {{$json.url}} and report any issues"
        }
      ]
    }
  }
}
```

---

## Verification & Testing

### Health Checks

#### Docker Health Check

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' mcp-playwright-server

# Expected output: healthy
```

#### Manual Verification

```bash
# Test MCP server responds
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  docker exec -i mcp-playwright-server node dist/index.js

# Expected: List of available tools
```

#### Run Sample Test

```bash
# Create test file
cat > sample-test.json <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_tests",
    "arguments": {
      "url": "https://example.com",
      "options": {"headless": true}
    }
  }
}
EOF

# Execute test
cat sample-test.json | docker exec -i mcp-playwright-server node dist/index.js
```

### Integration Tests

```bash
# Run full integration test suite
npm run test:integration

# Test specific functionality
npm test -- --grep "run_tests tool"
```

### Performance Benchmarks

```bash
# Measure test execution time
time docker exec -i mcp-playwright-server node dist/index.js < test-request.json

# Check resource usage
docker stats mcp-playwright-server
```

---

## Maintenance

### Log Management

#### View Logs

```bash
# Follow logs in real-time
docker-compose logs -f mcp-playwright

# View last 100 lines
docker-compose logs --tail=100 mcp-playwright

# Search logs
docker-compose logs mcp-playwright | grep "ERROR"
```

#### Log Rotation

```yaml
# Add to docker-compose.yml
services:
  mcp-playwright:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Artifact Cleanup

#### Automatic Cleanup (Enabled in .env)

```bash
# Configure in .env
AUTO_CLEANUP=true
ARTIFACT_RETENTION_DAYS=7
MAX_STORAGE_GB=20
```

#### Manual Cleanup

```bash
# Remove artifacts older than 7 days
find test-results/ -type d -mtime +7 -exec rm -rf {} +

# Clean up by size (keep last 20GB)
du -sh test-results/*/  | sort -rh | tail -n +20 | cut -f2 | xargs rm -rf
```

### Updates & Upgrades

#### Update Dependencies

```bash
# Update npm packages
npm update

# Update Playwright browsers
npx playwright install

# Rebuild
npm run build
```

#### Update Docker Image

```bash
# Pull latest base image
docker-compose pull

# Rebuild with latest dependencies
docker-compose build --no-cache

# Restart with new image
docker-compose up -d
```

### Backup & Restore

#### Backup Configuration

```bash
# Backup environment config
cp .env .env.backup.$(date +%Y%m%d)

# Backup test artifacts
tar -czf test-results-backup-$(date +%Y%m%d).tar.gz test-results/
```

#### Restore

```bash
# Restore environment
cp .env.backup.20251030 .env

# Restore artifacts
tar -xzf test-results-backup-20251030.tar.gz
```

### Monitoring

#### Set Up Prometheus Metrics (Optional)

```yaml
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'mcp-playwright'
    static_configs:
      - targets: ['mcp-playwright:3000']
```

#### Set Up Grafana Dashboards (Optional)

```bash
# Add to docker-compose.yml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## Troubleshooting Deployment

### Build Failures

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Runtime Errors

```bash
# Check environment variables
docker-compose exec mcp-playwright env

# Verify file permissions
docker-compose exec mcp-playwright ls -la /data

# Test browser installation
docker-compose exec mcp-playwright npx playwright --version
```

### Performance Issues

```bash
# Check resource usage
docker stats mcp-playwright-server

# Increase resources if needed (edit docker-compose.yml)
deploy:
  resources:
    limits:
      memory: 4G
      cpus: '2.0'
```

---

## Security Checklist

Before deploying to production:

- [ ] Change default passwords in `.env`
- [ ] Enable `MCP_API_KEY` authentication
- [ ] Configure rate limiting
- [ ] Set up log sanitization
- [ ] Enable HTTPS for all connections
- [ ] Configure firewall rules
- [ ] Set up network isolation
- [ ] Enable automatic security updates
- [ ] Configure backup schedule
- [ ] Set up monitoring alerts
- [ ] Review and limit container permissions
- [ ] Enable Docker Content Trust
- [ ] Scan images for vulnerabilities

```bash
# Scan Docker image for vulnerabilities
docker scan mcp-playwright-server:latest
```

---

## Cost Estimation

### Self-Hosted (VPS)

- **DigitalOcean Droplet (4GB RAM)**: $24/month
- **Hetzner Cloud (4GB RAM)**: ~$10/month
- **Storage**: $0.10/GB/month

**Total**: ~$15-30/month

### Cloud Managed

- **AWS ECS Fargate**: ~$40-60/month (1 task, 2GB, continuous)
- **Google Cloud Run**: ~$30-50/month (similar config)
- **Azure Container Instances**: ~$35-55/month

### Bandwidth & Storage

- **Test Artifacts**: ~1-5GB/month (with cleanup)
- **Bandwidth**: ~10-50GB/month (depending on test frequency)

---

## Next Steps

1. **Configure environment** → Edit `.env` file
2. **Deploy** → Choose deployment method above
3. **Verify** → Run health checks and sample tests
4. **Integrate** → Connect with n8n or Claude
5. **Monitor** → Set up logging and alerts
6. **Iterate** → Tune performance based on usage

---

**Questions or issues?** Check the main [README.md](README.md) or open an issue on GitHub.
