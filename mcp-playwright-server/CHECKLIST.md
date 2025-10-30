# Deployment Checklist for MCP Playwright Test Runner

Use this checklist to verify your deployment is ready.

## Pre-Deployment Verification

### Files Created ✅
- [x] Dockerfile (2.6KB) - Multi-stage production image
- [x] docker-compose.yml (2.0KB) - Orchestration configuration
- [x] .env.example (5.3KB) - Complete environment template
- [x] .gitignore (1.4KB) - Comprehensive ignore rules
- [x] .dockerignore (1.4KB) - Docker build optimization
- [x] README.md (25KB) - Technical documentation
- [x] DEPLOYMENT.md (14KB) - Operations guide
- [x] DEPLOYMENT_SUMMARY.md (13KB) - Package overview

### Configuration Steps

#### 1. Environment Setup
```bash
[ ] Copy .env.example to .env
[ ] Edit ARTIFACTS_DIR path
[ ] Set MAX_CONCURRENT_RUNS (recommend: 2-3)
[ ] Set HEADLESS=true for production
[ ] Configure GITHUB_TOKEN (if using GitHub integration)
[ ] Configure VERCEL_TOKEN (if testing preview deployments)
[ ] Set N8N_USER and N8N_PASSWORD
[ ] Configure ANTHROPIC_API_KEY (for Claude integration)
[ ] Set MCP_API_KEY for authentication
[ ] Configure rate limiting (RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
```

#### 2. Security Configuration
```bash
[ ] Change default n8n password
[ ] Enable MCP API key authentication
[ ] Configure rate limiting
[ ] Set up log sanitization
[ ] Review and set proper file permissions
[ ] Enable HTTPS for production URLs
[ ] Configure firewall rules (if self-hosted)
```

#### 3. Storage Configuration
```bash
[ ] Set ARTIFACT_RETENTION_DAYS (recommend: 7-14)
[ ] Set MAX_STORAGE_GB (based on available disk)
[ ] Enable AUTO_CLEANUP=true
[ ] Create test-results directory with proper permissions
```

## Deployment Steps

### Docker Deployment (Recommended)

#### Build Phase
```bash
[ ] Navigate to mcp-playwright-server directory
[ ] Review Dockerfile for any custom modifications needed
[ ] Build Docker image: docker-compose build
[ ] Verify image size is ~500MB (not 2GB+)
[ ] Check for build errors in output
```

#### Startup Phase
```bash
[ ] Start services: docker-compose up -d
[ ] Check container status: docker-compose ps
[ ] Verify health: docker inspect --format='{{.State.Health.Status}}' mcp-playwright-server
[ ] Review startup logs: docker-compose logs mcp-playwright
[ ] Check resource usage: docker stats mcp-playwright-server
```

#### Verification Phase
```bash
[ ] Test MCP protocol: echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | docker exec -i mcp-playwright-server node dist/index.js
[ ] Verify 3 tools are listed (run_tests, get_test_artifacts, analyze_failure)
[ ] Check Playwright browsers are installed
[ ] Verify artifact directory is writable
[ ] Test sample test execution
```

### Local Development (Alternative)

```bash
[ ] Install Node.js 18+
[ ] Run: npm install
[ ] Install browsers: npx playwright install chromium firefox webkit
[ ] Copy and edit .env file
[ ] Build: npm run build
[ ] Start: npm start
[ ] Verify startup in console output
```

## Integration Setup

### n8n Integration
```bash
[ ] Access n8n at http://localhost:5678
[ ] Login with configured credentials
[ ] Create new credential for MCP server
[ ] Test connection to MCP server
[ ] Import sample workflow (if provided)
[ ] Test workflow execution
[ ] Configure webhook endpoints
```

### Claude Integration
```bash
[ ] Verify ANTHROPIC_API_KEY is set
[ ] Test MCP tool calls via Claude
[ ] Verify Claude can receive screenshots/artifacts
[ ] Test run_tests tool
[ ] Test get_test_artifacts tool
[ ] Test analyze_failure tool
```

### GitHub Integration (Optional)
```bash
[ ] Set GITHUB_TOKEN with repo access
[ ] Set GITHUB_OWNER and GITHUB_REPO
[ ] Test GitHub API connectivity
[ ] Verify webhook delivery (if using)
```

### Vercel Integration (Optional)
```bash
[ ] Set VERCEL_TOKEN
[ ] Set VERCEL_PROJECT_ID
[ ] Test preview URL access
[ ] Verify deployment detection
```

## Post-Deployment Verification

### Functional Tests
```bash
[ ] Run test on example.com (or test site)
[ ] Verify screenshot capture works
[ ] Verify video recording works (if enabled)
[ ] Verify trace generation works
[ ] Check console log capture
[ ] Check network log capture
[ ] Verify performance metrics collected
[ ] Check accessibility scanning (if enabled)
```

### Artifact Verification
```bash
[ ] Check test-results directory created
[ ] Verify screenshots are saved
[ ] Verify videos are saved (if enabled)
[ ] Check trace.zip file creation
[ ] Verify console.json exists
[ ] Check network.har file
[ ] Review summary.json format
[ ] Check report.html accessibility
```

### Performance Tests
```bash
[ ] Run 3 concurrent tests
[ ] Monitor CPU usage (<80% average)
[ ] Monitor RAM usage (<2GB per run)
[ ] Verify test completion time (<5 minutes)
[ ] Check artifact cleanup runs
[ ] Verify no memory leaks over time
```

### Error Handling Tests
```bash
[ ] Test with invalid URL
[ ] Test with non-existent test file
[ ] Test timeout scenario (set very low timeout)
[ ] Test network failure handling
[ ] Verify error messages are clear
[ ] Check artifact capture on failures
```

## Monitoring Setup

### Logging
```bash
[ ] Configure LOG_LEVEL (info for production)
[ ] Enable ENABLE_LOGGING=true
[ ] Set up log rotation
[ ] Test log output format
[ ] Verify sensitive data is sanitized
```

### Health Monitoring
```bash
[ ] Verify Docker health check passes
[ ] Set up external monitoring (optional)
[ ] Configure alerts for failures
[ ] Set up uptime monitoring
[ ] Configure resource alerts
```

### Metrics (Optional)
```bash
[ ] Set up Prometheus (if using)
[ ] Configure Grafana dashboards
[ ] Set up custom metrics
[ ] Create performance dashboards
```

## Maintenance Tasks

### Daily
```bash
[ ] Check container is running
[ ] Review error logs
[ ] Monitor disk space usage
```

### Weekly
```bash
[ ] Review test success rates
[ ] Check artifact storage size
[ ] Verify cleanup is running
[ ] Review performance metrics
[ ] Check for security updates
```

### Monthly
```bash
[ ] Update dependencies: npm update
[ ] Update Playwright browsers: npx playwright install
[ ] Review and optimize configuration
[ ] Update Docker base image
[ ] Backup configuration and important artifacts
[ ] Review and update documentation
```

## Troubleshooting Checklist

### Container Won't Start
```bash
[ ] Check Docker daemon is running
[ ] Verify .env file exists and is valid
[ ] Check port conflicts (5678 for n8n)
[ ] Review startup logs
[ ] Verify sufficient disk space
[ ] Check memory allocation
```

### Tests Failing
```bash
[ ] Verify target URL is accessible
[ ] Check browser installation
[ ] Review console logs
[ ] Check network connectivity
[ ] Verify timeout settings
[ ] Test with simpler URL first
```

### Artifacts Not Saved
```bash
[ ] Check ARTIFACTS_DIR path
[ ] Verify directory permissions
[ ] Check disk space
[ ] Review artifact settings in .env
[ ] Check container volume mounts
```

### Performance Issues
```bash
[ ] Check resource limits
[ ] Reduce concurrent runs
[ ] Disable video recording
[ ] Disable trace generation
[ ] Increase timeout values
[ ] Check for memory leaks
```

## Production Readiness Checklist

### Security ✅
```bash
[ ] All default passwords changed
[ ] API keys properly configured
[ ] Rate limiting enabled
[ ] Logs sanitized of sensitive data
[ ] HTTPS configured for all connections
[ ] Firewall rules configured
[ ] Network isolation enabled
[ ] Container running as non-root
[ ] Regular security updates scheduled
```

### Performance ✅
```bash
[ ] Resource limits configured
[ ] Concurrent runs optimized
[ ] Artifact cleanup enabled
[ ] Video quality appropriate
[ ] Screenshot mode optimized
[ ] Timeout values tuned
```

### Reliability ✅
```bash
[ ] Health checks passing
[ ] Restart policy configured
[ ] Error handling tested
[ ] Retry logic verified
[ ] Logging comprehensive
[ ] Monitoring alerts configured
```

### Documentation ✅
```bash
[ ] README.md reviewed
[ ] DEPLOYMENT.md reviewed
[ ] Team trained on usage
[ ] Runbook created
[ ] Contact information updated
```

### Backup & Recovery ✅
```bash
[ ] Backup procedure documented
[ ] .env backed up securely
[ ] Recovery procedure tested
[ ] Disaster recovery plan created
```

## Sign-Off

### Deployment Completed By
- Name: ___________________
- Date: ___________________
- Signature: ___________________

### Verified By
- Name: ___________________
- Date: ___________________
- Signature: ___________________

### Production Approval
- Name: ___________________
- Date: ___________________
- Signature: ___________________

---

## Quick Command Reference

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f mcp-playwright
```

### Restart Services
```bash
docker-compose restart mcp-playwright
```

### Check Health
```bash
docker inspect --format='{{.State.Health.Status}}' mcp-playwright-server
```

### Run Test
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"run_tests","arguments":{"url":"https://example.com"}}}' | docker exec -i mcp-playwright-server node dist/index.js
```

### Access n8n
```bash
open http://localhost:5678
```

### View Artifacts
```bash
ls -lh test-results/
```

### Clean Artifacts
```bash
find test-results/ -type d -mtime +7 -exec rm -rf {} +
```

---

**Status**: ⬜ Not Started | 🟨 In Progress | ✅ Completed

**Last Updated**: 2025-10-30
**Version**: 1.0.0
