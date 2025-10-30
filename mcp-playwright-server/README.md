# MCP Playwright Test Runner

A production-ready **Model Context Protocol (MCP)** server that enables Claude to execute comprehensive E2E tests using Playwright, capturing detailed artifacts including screenshots, videos, traces, console logs, and network activity for intelligent debugging and code iteration.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [Configuration](#configuration)
- [Usage](#usage)
  - [MCP Tools](#mcp-tools)
  - [Example Tool Calls](#example-tool-calls)
- [Integration with n8n](#integration-with-n8n)
- [Test Artifacts](#test-artifacts)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [API Reference](#api-reference)

---

## Overview

The MCP Playwright Test Runner is part of the **Beyond Pandora Continuous AI Development System** that enables Claude to:

1. Generate code based on specifications
2. Run comprehensive E2E tests with full artifact capture
3. Analyze test results (screenshots, console logs, network traces)
4. Iteratively fix issues until tests pass
5. Learn from successful implementations via RAG

**Key Innovation:** Claude sees actual browser artifacts (screenshots, console errors, network failures) to debug and improve code intelligently.

---

## Features

### Core Capabilities

- **Multi-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Comprehensive Artifact Capture**:
  - Screenshots (before/after actions, failures)
  - Video recordings of test sessions
  - Playwright traces for debugging
  - Console logs (all message types)
  - Network activity (HAR format)
  - Performance metrics (FCP, LCP, TTI, TBT, CLS)
  - Accessibility violations (axe-core integration)
- **Parallel Test Execution**: Run multiple tests concurrently
- **Retry Logic**: Automatic retries for flaky tests
- **Smart Analysis**: AI-powered failure analysis with suggestions
- **Artifact Storage**: Organized storage structure for all test outputs

### MCP Integration

- **Stdio Communication**: Standard MCP protocol via stdin/stdout
- **Tool-Based Interface**: Three main tools exposed to Claude
- **Structured Results**: JSON-formatted results with embedded artifacts
- **Base64 Encoding**: Screenshots and videos returned as base64 for immediate analysis

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Orchestrator                         │
│  • Receives webhooks from OpenProject                           │
│  • Fetches specifications from GitHub                           │
│  • Calls Claude with MCP tools enabled                          │
│  • Monitors test execution                                      │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              MCP Playwright Test Runner (This Server)            │
│                                                                  │
│  Tools:                                                          │
│  • run_tests        - Execute tests and capture artifacts       │
│  • get_test_artifacts - Retrieve specific artifacts             │
│  • analyze_failure  - Get detailed failure analysis             │
│                                                                  │
│  Capabilities:                                                   │
│  • Playwright browser automation                                │
│  • Screenshot/video/trace capture                               │
│  • Console and network logging                                  │
│  • Performance monitoring                                       │
│  • Accessibility testing                                        │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Test Artifacts Storage                      │
│  /test-results/{runId}/                                         │
│    • screenshots/                                               │
│    • videos/                                                    │
│    • traces/                                                    │
│    • logs/                                                      │
│    • coverage/                                                  │
│    • summary.json                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)
- 2GB+ RAM (for browser instances)
- 5GB+ disk space (for browser binaries and artifacts)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/mcp-playwright-server.git
   cd mcp-playwright-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install chromium firefox webkit
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Build the project**:
   ```bash
   npm run build
   ```

6. **Start the MCP server**:
   ```bash
   npm start
   ```

### Docker Setup

Docker is the recommended approach for production deployments.

1. **Build the Docker image**:
   ```bash
   docker build -t mcp-playwright-server .
   ```

2. **Run with docker-compose** (recommended):
   ```bash
   # Copy and configure environment
   cp .env.example .env

   # Start services
   docker-compose up -d
   ```

3. **Verify the container is running**:
   ```bash
   docker-compose ps
   docker-compose logs mcp-playwright
   ```

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

#### Core Settings

```bash
# Artifact storage directory
ARTIFACTS_DIR=/data/test-results

# Maximum concurrent test runs
MAX_CONCURRENT_RUNS=3

# Maximum test duration (5 minutes)
MAX_TEST_DURATION=300000

# Browser operation timeout (30 seconds)
BROWSER_TIMEOUT=30000

# Run browsers in headless mode
HEADLESS=true
```

#### Test Configuration

```bash
# Video recording
ENABLE_VIDEO=true
VIDEO_QUALITY=medium

# Screenshot capture (on, off, only-on-failure)
SCREENSHOT_MODE=on

# Trace recording for Playwright Inspector
ENABLE_TRACE=true

# Code coverage collection
ENABLE_COVERAGE=false

# Test retries
TEST_RETRIES=2
```

#### Integration Settings

```bash
# GitHub (for fetching specs and committing results)
GITHUB_TOKEN=ghp_your_token
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name

# Vercel (for testing preview deployments)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_project_id

# n8n (for workflow orchestration)
WEBHOOK_URL=http://localhost:5678/webhook/test-results
```

See `.env.example` for the complete configuration reference.

---

## Usage

### MCP Tools

The server exposes three tools to Claude via the MCP protocol:

#### 1. `run_tests`

Execute Playwright tests on a URL and return comprehensive results.

**Input Schema**:
```typescript
{
  url: string;              // URL to test (e.g., Vercel preview URL)
  testFiles?: string[];     // Test files to execute (optional)
  options?: {
    browser?: 'chromium' | 'firefox' | 'webkit';
    headless?: boolean;
    video?: boolean;
    screenshot?: 'on' | 'off' | 'only-on-failure';
    trace?: boolean;
  }
}
```

**Returns**:
```typescript
{
  runId: string;
  status: 'passed' | 'failed' | 'timedout';
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  tests: Array<{
    name: string;
    status: 'passed' | 'failed';
    duration: number;
    error?: {
      message: string;
      stack: string;
      location: { file: string; line: number; column: number };
    };
    artifacts: {
      screenshots: string[];  // Base64 encoded
      video?: string;
      trace?: string;
    };
  }>;
  consoleLogs: Array<{
    type: 'log' | 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
  networkLogs: Array<{
    request: { url: string; method: string; };
    response: { status: number; timing: object; };
  }>;
  performance: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    timeToInteractive: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
  accessibility: {
    violations: Array<{
      rule: string;
      element: string;
      impact: 'minor' | 'moderate' | 'serious' | 'critical';
      message: string;
    }>;
  };
}
```

#### 2. `get_test_artifacts`

Retrieve specific artifacts from a completed test run.

**Input Schema**:
```typescript
{
  runId: string;
  artifactTypes?: Array<'screenshots' | 'videos' | 'traces' | 'har' | 'coverage'>;
}
```

**Returns**:
```typescript
{
  runId: string;
  artifacts: {
    screenshots?: string[];    // Array of base64 encoded images
    videos?: string[];         // Array of base64 encoded videos
    traces?: string[];         // Array of trace file paths
    har?: object;             // Network HAR file
    coverage?: object;        // Code coverage data
  };
}
```

#### 3. `analyze_failure`

Get detailed analysis of a specific test failure with AI-powered suggestions.

**Input Schema**:
```typescript
{
  runId: string;
  testName: string;
}
```

**Returns**:
```typescript
{
  testName: string;
  failureReason: string;
  screenshot: string;              // Base64 of failure moment
  consoleLogs: Array<{             // Only errors/warnings
    type: string;
    message: string;
  }>;
  networkFailures: Array<{
    url: string;
    status: number;
    error: string;
  }>;
  domSnapshot: string;             // HTML at failure point
  suggestions: string[];           // AI-generated suggestions
}
```

### Example Tool Calls

#### Running Tests on a Vercel Preview

```json
{
  "tool": "run_tests",
  "arguments": {
    "url": "https://rawgle-git-feature-branch.vercel.app",
    "testFiles": ["tests/login.spec.ts", "tests/dashboard.spec.ts"],
    "options": {
      "browser": "chromium",
      "headless": true,
      "video": true,
      "screenshot": "only-on-failure",
      "trace": true
    }
  }
}
```

#### Retrieving Test Artifacts

```json
{
  "tool": "get_test_artifacts",
  "arguments": {
    "runId": "run-abc123-def456",
    "artifactTypes": ["screenshots", "traces", "har"]
  }
}
```

#### Analyzing a Test Failure

```json
{
  "tool": "analyze_failure",
  "arguments": {
    "runId": "run-abc123-def456",
    "testName": "should login successfully"
  }
}
```

---

## Integration with n8n

The MCP Playwright Test Runner integrates seamlessly with n8n for workflow automation.

### n8n Workflow Setup

1. **Install n8n** (included in docker-compose.yml):
   ```bash
   docker-compose up n8n -d
   ```

2. **Access n8n**: Open http://localhost:5678

3. **Configure MCP Connection**:
   - Add a new credential for MCP servers
   - Set the MCP server endpoint to the stdio transport
   - Configure authentication if enabled

### Sample n8n Workflow

Here's a complete workflow for automated testing:

```javascript
// Node 1: OpenProject Webhook Trigger
{
  "node": "Webhook",
  "parameters": {
    "path": "openproject-task",
    "responseMode": "onReceived"
  }
}

// Node 2: Fetch Task Details
{
  "node": "HTTP Request",
  "parameters": {
    "url": "={{$env.OPENPROJECT_URL}}/api/v3/work_packages/{{$json.work_package_id}}",
    "authentication": "headerAuth",
    "headerAuth": {
      "name": "Authorization",
      "value": "Basic {{$env.OPENPROJECT_API_KEY}}"
    }
  }
}

// Node 3: Fetch Spec from GitHub
{
  "node": "HTTP Request",
  "parameters": {
    "url": "https://api.github.com/repos/{{$env.GITHUB_OWNER}}/{{$env.GITHUB_REPO}}/contents/{{$json.spec_file}}",
    "authentication": "headerAuth",
    "headerAuth": {
      "name": "Authorization",
      "value": "Bearer {{$env.GITHUB_TOKEN}}"
    }
  }
}

// Node 4: Call Claude with MCP Tools
{
  "node": "HTTP Request",
  "parameters": {
    "url": "https://api.anthropic.com/v1/messages",
    "method": "POST",
    "authentication": "headerAuth",
    "headerAuth": {
      "name": "x-api-key",
      "value": "{{$env.ANTHROPIC_API_KEY}}"
    },
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
          "content": "Generate and test code for: {{$json.task_description}}"
        }
      ]
    }
  }
}

// Node 5: Parse Test Results
{
  "node": "Code",
  "parameters": {
    "language": "javascript",
    "code": `
      const response = $input.all()[0].json;
      const testResults = response.content.find(
        c => c.type === 'tool_result' && c.name === 'run_tests'
      );

      return {
        json: {
          status: testResults.status,
          summary: testResults.summary,
          passed: testResults.summary.passed === testResults.summary.total,
          artifacts: testResults.artifacts
        }
      };
    `
  }
}

// Node 6: Post Results to OpenProject
{
  "node": "HTTP Request",
  "parameters": {
    "url": "={{$env.OPENPROJECT_URL}}/api/v3/work_packages/{{$json.work_package_id}}/activities",
    "method": "POST",
    "authentication": "headerAuth",
    "body": {
      "comment": {
        "raw": "{{$json.passed ? '✅ Tests PASSED' : '❌ Tests FAILED'}}\n\nSummary:\n- Total: {{$json.summary.total}}\n- Passed: {{$json.summary.passed}}\n- Failed: {{$json.summary.failed}}\n- Duration: {{$json.summary.duration}}ms"
      }
    }
  }
}
```

### MCP Communication in n8n

n8n communicates with the MCP server via stdio:

```javascript
// Example: Calling MCP from n8n Code Node
const { spawn } = require('child_process');

// Spawn MCP server process
const mcpProcess = spawn('docker', [
  'exec',
  '-i',
  'mcp-playwright-server',
  'node',
  'dist/index.js'
]);

// Send tool call via stdin
const toolCall = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'run_tests',
    arguments: {
      url: 'https://example.com',
      options: { headless: true }
    }
  }
};

mcpProcess.stdin.write(JSON.stringify(toolCall) + '\n');

// Read response from stdout
mcpProcess.stdout.on('data', (data) => {
  const response = JSON.parse(data.toString());
  console.log('Test Results:', response.result);
});
```

---

## Test Artifacts

All test artifacts are stored in a structured directory format:

### Artifact Directory Structure

```
/test-results/
  /{runId}/
    /screenshots/
      - before-action-001.png
      - after-action-001.png
      - failure-002.png
    /videos/
      - test-login-flow.webm
      - test-dashboard-navigation.webm
    /traces/
      - trace.zip  (for trace.playwright.dev viewer)
    /coverage/
      - coverage.json
      - html-report/
    /logs/
      - console.json
      - network.har
    summary.json      # Overall test results
    report.html       # Human-readable report
```

### Artifact Types

#### Screenshots

- **Format**: PNG, base64 encoded
- **Capture Points**: Before actions, after actions, on failures
- **Resolution**: Matches viewport size (default 1920x1080)
- **Retention**: Configurable via `ARTIFACT_RETENTION_DAYS`

#### Videos

- **Format**: WebM
- **Quality**: Configurable (low, medium, high)
- **Content**: Full test session recording
- **Size**: ~1-5MB per minute

#### Traces

- **Format**: ZIP file
- **Tool**: Open with trace.playwright.dev
- **Contents**: Timeline, network, console, DOM snapshots
- **Use Case**: Deep debugging of complex failures

#### Console Logs

- **Format**: JSON array
- **Types**: log, info, warn, error, debug
- **Data**: Message, timestamp, location, stack trace
- **Filtering**: Can filter by type in analyze_failure

#### Network Logs

- **Format**: HAR (HTTP Archive)
- **Contents**: All HTTP requests/responses
- **Data**: Headers, body, timing, status codes
- **Use Case**: Debugging API failures, performance issues

#### Performance Metrics

- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Time to Interactive (TTI)**
- **Total Blocking Time (TBT)**
- **Cumulative Layout Shift (CLS)**

#### Accessibility Reports

- **Tool**: axe-core
- **Format**: JSON array of violations
- **Impact Levels**: minor, moderate, serious, critical
- **Details**: Rule ID, element selector, help URL

### Accessing Artifacts

#### Via MCP Tools

```javascript
// Get specific artifacts
const artifacts = await mcp.call('get_test_artifacts', {
  runId: 'run-abc123',
  artifactTypes: ['screenshots', 'traces']
});

// Screenshots are returned as base64
const screenshot = artifacts.screenshots[0];
// Display or analyze the image
```

#### Via File System

```bash
# Access artifacts directly
cd test-results/run-abc123

# View screenshots
open screenshots/failure-001.png

# View trace in Playwright Inspector
npx playwright show-trace traces/trace.zip

# View network activity
open logs/network.har
```

#### Via HTTP (if web server enabled)

```bash
# Serve artifacts via HTTP
npm run serve-artifacts

# Access via browser
open http://localhost:3000/test-results/run-abc123/report.html
```

---

## Troubleshooting

### Common Issues

#### 1. Browser Installation Fails

**Symptom**: Error about missing browser binaries

**Solution**:
```bash
# Reinstall browsers
npx playwright install --with-deps chromium firefox webkit

# Or in Docker
docker-compose exec mcp-playwright npx playwright install
```

#### 2. Tests Timeout

**Symptom**: Tests exceed `MAX_TEST_DURATION`

**Solutions**:
- Increase timeout in `.env`: `MAX_TEST_DURATION=600000` (10 minutes)
- Break tests into smaller, focused units
- Check for slow network responses in network logs
- Verify the application is responding

```bash
# Check if application is accessible
curl -I https://your-app-url.com
```

#### 3. Out of Memory Errors

**Symptom**: Docker container crashes, "JavaScript heap out of memory"

**Solutions**:
- Increase Docker memory limit in `docker-compose.yml`:
  ```yaml
  deploy:
    resources:
      limits:
        memory: 4G  # Increase from 2G
  ```
- Reduce concurrent runs: `MAX_CONCURRENT_RUNS=1`
- Disable video recording: `ENABLE_VIDEO=false`

#### 4. Permission Denied on Artifact Directory

**Symptom**: Cannot write to `/data/test-results`

**Solution**:
```bash
# Fix permissions
sudo chown -R $(id -u):$(id -g) test-results/

# Or in Docker
docker-compose exec mcp-playwright chown -R mcp:mcp /data
```

#### 5. Network Requests Fail

**Symptom**: Tests fail with network errors

**Solutions**:
- Check proxy settings in `.env`
- Verify DNS resolution:
  ```bash
  docker-compose exec mcp-playwright nslookup example.com
  ```
- Increase network timeout: `NETWORK_TIMEOUT=60000`

#### 6. MCP Server Not Responding

**Symptom**: n8n or Claude cannot communicate with MCP server

**Solutions**:
- Check server is running:
  ```bash
  docker-compose ps mcp-playwright
  ```
- View logs:
  ```bash
  docker-compose logs -f mcp-playwright
  ```
- Verify stdio communication:
  ```bash
  echo '{"jsonrpc":"2.0","id":1,"method":"ping"}' | docker exec -i mcp-playwright-server node dist/index.js
  ```

#### 7. Trace Files Too Large

**Symptom**: Trace files consuming excessive disk space

**Solutions**:
- Disable trace for passing tests (configure Playwright)
- Enable automatic cleanup: `AUTO_CLEANUP=true`
- Reduce retention: `ARTIFACT_RETENTION_DAYS=7`

### Debug Mode

Enable verbose logging:

```bash
# In .env
LOG_LEVEL=debug
ENABLE_LOGGING=true

# View logs
docker-compose logs -f mcp-playwright
```

### Health Checks

Verify server health:

```bash
# Docker health status
docker inspect --format='{{.State.Health.Status}}' mcp-playwright-server

# Manual health check
docker-compose exec mcp-playwright node -e "process.exit(0)"
```

---

## Performance Optimization

### Test Execution Speed

#### 1. Parallel Execution

```bash
# Increase workers in .env
WORKERS=4
MAX_CONCURRENT_RUNS=4
```

#### 2. Disable Unnecessary Artifacts

```bash
# Only capture what you need
ENABLE_VIDEO=false
ENABLE_TRACE=false
SCREENSHOT_MODE=only-on-failure
```

#### 3. Use Headless Mode

```bash
# Headless is faster
HEADLESS=true
```

#### 4. Reuse Browser Contexts

Configure Playwright to reuse contexts between tests (in test code).

### Storage Optimization

#### 1. Automatic Cleanup

```bash
# Enable in .env
AUTO_CLEANUP=true
ARTIFACT_RETENTION_DAYS=7
MAX_STORAGE_GB=20
```

#### 2. Compress Videos

```bash
# Use lower quality
VIDEO_QUALITY=low
```

#### 3. Limit Screenshot Resolution

```bash
# Reduce viewport size
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720
```

### Network Performance

#### 1. CDN Proximity

Deploy the MCP server geographically close to your test targets.

#### 2. HTTP/2

Ensure your test targets support HTTP/2 for faster resource loading.

#### 3. Caching

Enable browser caching in test configuration for faster subsequent runs.

---

## Security Considerations

### 1. Secrets Management

**Never commit sensitive data**:

```bash
# Store secrets in .env (gitignored)
GITHUB_TOKEN=ghp_xxx
VERCEL_TOKEN=xxx
ANTHROPIC_API_KEY=xxx
```

**Use environment-specific secrets**:
- Development: Local .env file
- Production: Docker secrets, AWS Secrets Manager, etc.

### 2. Network Isolation

**Isolate test environments**:

```yaml
# docker-compose.yml
networks:
  mcp-network:
    driver: bridge
    internal: true  # No external access
```

### 3. Authentication

**Enable MCP API key authentication**:

```bash
# In .env
MCP_API_KEY=your_secure_random_key_here
```

**Validate API keys in server code** (ensure this is implemented).

### 4. Rate Limiting

**Prevent abuse**:

```bash
# In .env
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=60000
```

### 5. Sanitize Logs

**Remove sensitive data from artifacts**:
- Automatically redact `Authorization` headers
- Mask cookies and API keys
- Sanitize POST bodies containing passwords

### 6. Container Security

**Run as non-root user**:
```dockerfile
# Already configured in Dockerfile
USER mcp
```

**Limit resources**:
```yaml
# docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
```

### 7. HTTPS Only

**Always test over HTTPS in production**:

```bash
# Reject HTTP connections
if (url.startsWith('http://') && process.env.NODE_ENV === 'production') {
  throw new Error('HTTPS required in production');
}
```

---

## API Reference

### MCP Protocol

The server implements the Model Context Protocol v1.0:

#### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_tests",
    "arguments": {
      "url": "https://example.com",
      "options": {}
    }
  }
}
```

#### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"runId\":\"...\",\"status\":\"passed\",...}"
      },
      {
        "type": "image",
        "data": "base64EncodedImageData",
        "mimeType": "image/png"
      }
    ]
  }
}
```

### Tool Schemas

Complete JSON schemas for all tools are available in the source code.

### Environment Variables Reference

See `.env.example` for complete documentation of all 50+ configuration options.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Discord**: Join our community server
- **Email**: support@beyondpandora.dev

---

## Acknowledgments

- **Playwright Team**: For the excellent browser automation framework
- **Anthropic**: For Claude and the MCP protocol
- **n8n Community**: For workflow automation support

---

**Built with ❤️ by the Beyond Pandora Development Team**
