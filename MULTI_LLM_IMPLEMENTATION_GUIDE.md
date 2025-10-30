# Multi-LLM + Knowledge Base Implementation Guide

**Date:** 2025-10-30
**Status:** Implementation Ready
**Goal:** Support any LLM provider + Build knowledge base in OpenProject

---

## 🎯 What We're Implementing

### 1. **Multi-LLM Support**
- Works with Anthropic Claude, OpenAI GPT, Qwen (OpenLLM), vLLM, Azure, custom providers
- Single workflow that routes to correct API based on environment variable
- Provider-agnostic response parsing

### 2. **Knowledge Base in OpenProject**
- Every test result stored as comment in work package
- Every failure analysis documented with screenshots
- Every code improvement tracked
- RAG can query past solutions
- Complete audit trail

---

## 📋 Implementation Steps

### Step 1: Add Environment Variables to n8n

**Access n8n:**
```bash
ssh user@10.90.10.6
# Edit n8n environment or use UI Settings → Variables
```

**Add these variables:**

```bash
# LLM Provider Selection
LLM_PROVIDER=openllm  # or anthropic, openai, azure, custom

# Anthropic (if using)
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_BASE=https://api.anthropic.com/v1

# OpenAI (if using)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo
OPENAI_API_BASE=https://api.openai.com/v1

# OpenLLM / vLLM (recommended for cost savings)
OPENLLM_API_BASE=http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/qwen2.5-7b-instruct
# OPENLLM_API_KEY=optional-if-auth-enabled

# Azure OpenAI (if using)
AZURE_OPENAI_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_API_VERSION=2024-02-15-preview

# Common Settings
LLM_MAX_TOKENS=8000
LLM_TEMPERATURE=0.7
LLM_TIMEOUT=120000

# MCP Server
MCP_SERVER_HOST=10.90.10.6
MCP_ARTIFACTS_PORT=8080  # For serving artifacts via HTTP
```

---

### Step 2: Deploy OpenLLM with Qwen (Recommended)

**Why?** Free, private, fast, and quality comparable to Claude for code generation.

#### Option A: Docker (Easiest)

```bash
# On server 10.90.10.6
ssh user@10.90.10.6

# Pull and run OpenLLM with Qwen
docker run -d \
  --name openllm-qwen \
  -p 3000:3000 \
  --gpus all \  # Optional: Remove if no GPU
  ghcr.io/bentoml/openllm:latest \
  start qwen/qwen2.5-7b-instruct \
  --port 3000

# Check it's running
docker logs openllm-qwen

# Test the API
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen/qwen2.5-7b-instruct",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

#### Option B: vLLM (Faster, but needs GPU)

```bash
# Install vLLM
pip install vllm

# Start vLLM server
vllm serve qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 3000 \
  --dtype auto

# Or with Docker
docker run --gpus all -p 3000:8000 \
  vllm/vllm-openai:latest \
  --model qwen/Qwen2.5-7B-Instruct
```

#### Option C: No GPU? Use Smaller Model

```bash
# Run 1.5B model (works on CPU)
docker run -d \
  --name openllm-qwen \
  -p 3000:3000 \
  ghcr.io/bentoml/openllm:latest \
  start qwen/qwen2.5-1.5b-instruct \
  --port 3000
```

**Hardware Requirements:**
- **7B model:** 16GB RAM (32GB recommended), GPU optional
- **1.5B model:** 8GB RAM, CPU only is fine
- **72B model:** 80GB VRAM (multiple GPUs)

---

### Step 3: Update n8n Workflow

#### Replace "Call Claude" Node with "Call LLM (Universal)"

**Delete these nodes:**
- "Call Claude API" (node-009 in current workflow)
- "Parse Claude Response" (node-010)

**Add new Function node: "Call LLM (Universal)"**

```javascript
// Node: "Call LLM (Universal)"
// This node routes to correct LLM provider based on environment
const provider = $env.LLM_PROVIDER || 'anthropic';
const prompt = $json.prompt;

// Build request based on provider
let url, headers, body;

switch (provider) {
  case 'anthropic':
    url = ($env.ANTHROPIC_API_BASE || 'https://api.anthropic.com/v1') + '/messages';
    headers = {
      'x-api-key': $env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    };
    body = {
      model: $env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: parseInt($env.LLM_MAX_TOKENS) || 8000,
      temperature: parseFloat($env.LLM_TEMPERATURE) || 0.7,
      messages: [{ role: 'user', content: prompt }]
    };
    break;

  case 'openai':
    url = ($env.OPENAI_API_BASE || 'https://api.openai.com/v1') + '/chat/completions';
    headers = {
      'Authorization': `Bearer ${$env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    body = {
      model: $env.OPENAI_MODEL || 'gpt-4-turbo',
      max_tokens: parseInt($env.LLM_MAX_TOKENS) || 8000,
      temperature: parseFloat($env.LLM_TEMPERATURE) || 0.7,
      messages: [{ role: 'user', content: prompt }]
    };
    break;

  case 'openllm':
    url = ($env.OPENLLM_API_BASE || 'http://localhost:3000/v1') + '/chat/completions';
    headers = {
      'Content-Type': 'application/json'
    };
    if ($env.OPENLLM_API_KEY) {
      headers['Authorization'] = `Bearer ${$env.OPENLLM_API_KEY}`;
    }
    body = {
      model: $env.OPENLLM_MODEL || 'qwen/qwen2.5-7b-instruct',
      max_tokens: parseInt($env.LLM_MAX_TOKENS) || 8000,
      temperature: parseFloat($env.LLM_TEMPERATURE) || 0.7,
      messages: [{ role: 'user', content: prompt }]
    };
    break;

  case 'azure':
    const resourceMatch = $env.AZURE_OPENAI_ENDPOINT.match(/https:\/\/(.+?)\.openai\.azure\.com/);
    const resourceName = resourceMatch ? resourceMatch[1] : '';
    const deployment = $env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = $env.AZURE_API_VERSION || '2024-02-15-preview';
    url = `https://${resourceName}.openai.azure.com/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    headers = {
      'api-key': $env.AZURE_OPENAI_KEY,
      'Content-Type': 'application/json'
    };
    body = {
      max_tokens: parseInt($env.LLM_MAX_TOKENS) || 8000,
      temperature: parseFloat($env.LLM_TEMPERATURE) || 0.7,
      messages: [{ role: 'user', content: prompt }]
    };
    break;

  default:
    throw new Error(`Unknown LLM provider: ${provider}. Set LLM_PROVIDER to: anthropic, openai, openllm, or azure`);
}

// Make HTTP request
try {
  const response = await $http.request({
    method: 'POST',
    url,
    headers,
    body: JSON.stringify(body),
    timeout: parseInt($env.LLM_TIMEOUT) || 120000
  });

  return {
    llmResponse: response,
    provider,
    model: body.model || deployment,
    taskData: $json.taskData
  };
} catch (error) {
  return {
    error: error.message,
    provider,
    url,
    taskData: $json.taskData
  };
}
```

**Add new Function node: "Parse LLM Response (Universal)"**

```javascript
// Node: "Parse LLM Response (Universal)"
const { llmResponse, provider } = $input.first().json;

let content;

// Extract content based on provider response format
switch (provider) {
  case 'anthropic':
    content = llmResponse.content[0].text;
    break;

  case 'openai':
  case 'openllm':
  case 'azure':
    content = llmResponse.choices[0].message.content;
    break;

  default:
    throw new Error(`Unknown provider for parsing: ${provider}`);
}

// Extract JSON from response (might be wrapped in markdown)
const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/) || content.match(/({[\s\S]+})/);
let generatedCode;

try {
  generatedCode = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);
} catch (e) {
  return {
    error: 'Failed to parse LLM response as JSON',
    rawContent: content,
    taskData: $('Build Prompt').item(0).json.taskData
  };
}

return {
  generatedCode,
  taskData: $('Build Prompt').item(0).json.taskData
};
```

---

### Step 4: Add Knowledge Base Nodes

#### Node 1: "Post Generation to OpenProject"

**Add after "Parse LLM Response"**

```javascript
// Node: "Post Generation to OpenProject"
const { generatedCode, taskData, provider, model } = $input.first().json;
const timestamp = new Date().toISOString();
const attemptNumber = taskData.attemptNumber || 1;

const comment = {
  comment: {
    raw: `## 🤖 AI Generation Attempt #${attemptNumber}
**Timestamp:** ${timestamp}
**LLM Provider:** ${provider}
**Model:** ${model}
**Prompt Tokens:** ${generatedCode.usage?.prompt_tokens || 'N/A'}
**Completion Tokens:** ${generatedCode.usage?.completion_tokens || 'N/A'}

### Generated Files
${generatedCode.files.map(f => `- \`${f.path}\` (${f.content.split('\n').length} lines)`).join('\n')}

${generatedCode.tests ? `### Test Files\n${generatedCode.tests.map(f => `- \`${f.path}\` (${f.content.split('\n').length} lines)`).join('\n')}\n` : ''}

### Code Summary
${generatedCode.summary}

### Branch
\`${taskData.branchName}\`

### Vercel Preview
Will be available after build completes...`
  }
};

// Post to OpenProject
const response = await $http.request({
  method: 'POST',
  url: `${$env.OPENPROJECT_URL}/api/v3/work_packages/${taskData.taskId}/activities`,
  headers: {
    'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(comment)
});

return $input.first().json;  // Pass through
```

#### Node 2: "Post Test Results to OpenProject"

**Add after "Parse Test Results"**

```javascript
// Node: "Post Test Results to OpenProject"
const { runId, passed, summary, failedTests, fullResults, taskData } = $input.first().json;
const timestamp = new Date().toISOString();
const attemptNumber = taskData.attemptNumber || 1;

const artifactsBaseUrl = `http://${$env.MCP_SERVER_HOST}:${$env.MCP_ARTIFACTS_PORT || 8080}/artifacts/${runId}`;

let commentText = `## 🧪 Test Execution #${attemptNumber}
**Timestamp:** ${timestamp}
**MCP Run ID:** \`${runId}\`
**Status:** ${passed ? '✅ PASSED' : '❌ FAILED'}
**Duration:** ${(summary.duration / 1000).toFixed(2)} seconds

### Summary
- Total Tests: ${summary.total}
- Passed: ${summary.passed} ✅
- Failed: ${summary.failed}${summary.failed > 0 ? ' ❌' : ''}
- Duration: ${summary.duration}ms
`;

if (!passed && failedTests.length > 0) {
  commentText += `\n### Failed Tests\n\n`;
  failedTests.forEach((test, i) => {
    const screenshot = test.artifacts?.screenshots?.[0];
    commentText += `#### ${i + 1}. "${test.name}"
**Error:** \`${test.error.message}\`
**Location:** \`${test.error.location.file}:${test.error.location.line}\`

${screenshot ? `**Screenshot:**\n![Failure](${artifactsBaseUrl}/screenshots/${screenshot.name}.png)\n` : ''}

**Console Error:**
\`\`\`
${test.error.stack.split('\n').slice(0, 5).join('\n')}
\`\`\`

`;
  });
}

// Performance metrics
if (fullResults.performance) {
  const perf = fullResults.performance;
  commentText += `\n### Performance Metrics
- First Contentful Paint: ${perf.firstContentfulPaint}ms
- Largest Contentful Paint: ${perf.largestContentfulPaint}ms
- Time to Interactive: ${perf.timeToInteractive}ms
- Cumulative Layout Shift: ${perf.cumulativeLayoutShift}
`;
}

commentText += `\n### Artifacts
All artifacts available at: [View Artifacts](${artifactsBaseUrl}/html-report/index.html)
- Screenshots: [View](${artifactsBaseUrl}/screenshots/)
- Video: [Download](${artifactsBaseUrl}/videos/test-execution.webm)
- Trace: [Download](${artifactsBaseUrl}/traces/trace.zip)
- Console Logs: [View](${artifactsBaseUrl}/console-logs.json)
- Network Logs: [View](${artifactsBaseUrl}/network-logs.har)
`;

const comment = {
  comment: { raw: commentText }
};

await $http.request({
  method: 'POST',
  url: `${$env.OPENPROJECT_URL}/api/v3/work_packages/${taskData.taskId}/activities`,
  headers: {
    'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(comment)
});

return $input.first().json;  // Pass through
```

#### Node 3: "Post Failure Analysis to OpenProject"

**Add after "Parse Failure Analysis"**

```javascript
// Node: "Post Failure Analysis to OpenProject"
const { analysis, failedTests, runId, taskData } = $input.first().json;
const timestamp = new Date().toISOString();
const attemptNumber = taskData.attemptNumber || 1;

const artifactsBaseUrl = `http://${$env.MCP_SERVER_HOST}:${$env.MCP_ARTIFACTS_PORT || 8080}/artifacts/${runId}`;

const commentText = `## 🔍 Failure Analysis #${attemptNumber}
**Timestamp:** ${timestamp}

### Root Cause Analysis

**Test:** "${failedTests[0].name}"
**Reason:** ${analysis.failureReason}

### Evidence
${analysis.consoleLogs.slice(0, 3).map((log, i) => `${i + 1}. **${log.type.toUpperCase()}:** ${log.message}`).join('\n')}

### AI-Generated Suggestions
${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Screenshot Evidence
![Failure Screenshot](${artifactsBaseUrl}/screenshots/${analysis.screenshot})

${analysis.networkFailures.length > 0 ? `### Network Issues\n${analysis.networkFailures.map((nf, i) => `${i + 1}. **${nf.request.method} ${nf.request.url}** → ${nf.response.status} ${nf.response.statusText}`).join('\n')}` : '### Network Issues\nNone detected'}

### Next Steps
AI will now attempt to generate improved code based on this analysis.
`;

const comment = {
  comment: { raw: commentText }
};

await $http.request({
  method: 'POST',
  url: `${$env.OPENPROJECT_URL}/api/v3/work_packages/${taskData.taskId}/activities`,
  headers: {
    'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(comment)
});

return $input.first().json;  // Pass through
```

---

### Step 5: Set Up MCP Artifacts HTTP Server

The MCP server needs to serve artifacts over HTTP so OpenProject comments can link to them.

**Create simple HTTP server:**

```bash
# On MCP server host (10.90.10.6)
cd /opt/mcp-playwright-server

# Create HTTP server script
cat > serve-artifacts.js << 'EOF'
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.MCP_ARTIFACTS_PORT || 8080;

// Serve test results statically
app.use('/artifacts', express.static(path.join(__dirname, 'test-results'), {
  setHeaders: (res, filepath) => {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Serve .png as images
    if (filepath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
    // Serve .json with proper type
    if (filepath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`MCP Artifacts server listening on port ${PORT}`);
  console.log(`Access artifacts at: http://localhost:${PORT}/artifacts/<runId>/`);
});
EOF

# Install express
npm install express

# Add to package.json scripts
npm pkg set scripts.serve-artifacts="node serve-artifacts.js"

# Run it (or add to docker-compose)
npm run serve-artifacts &
```

**Or add to docker-compose.yml:**

```yaml
services:
  mcp-playwright:
    # ... existing config ...
    ports:
      - "8080:8080"  # Add this
    command: sh -c "node dist/index.js & node serve-artifacts.js"
```

---

### Step 6: Update OpenProject Custom Fields

**Add custom fields to work package type:**

1. Log into OpenProject as admin
2. Go to **Administration** → **Work Packages** → **Types**
3. Select your type (e.g., "Task")
4. Add custom fields:

| Field Name | Type | Options |
|------------|------|---------|
| LLM Provider | Text | - |
| LLM Model | Text | - |
| Attempts Count | Integer | Min: 1 |
| Total Duration (s) | Integer | - |
| MCP Run IDs | Long Text | - |
| Final Status | List | success, failure, manual_review |
| Code Quality Score | Integer | Min: 0, Max: 100 |

---

### Step 7: Test the Complete Flow

```bash
# 1. Set LLM provider
# In n8n settings or environment:
LLM_PROVIDER=openllm
OPENLLM_API_BASE=http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/qwen2.5-7b-instruct

# 2. Create test task in OpenProject
# Subject: "Test Multi-LLM System"
# Description: Include SPEC_FILE, TARGET_FILES, TEST_FILES

# 3. Move task to "In Progress"

# 4. Watch the magic happen:
# - n8n calls Qwen via OpenLLM
# - Qwen generates code
# - Code committed to GitHub
# - Vercel builds preview
# - MCP runs tests
# - All results posted to OpenProject with links to artifacts

# 5. Check OpenProject work package
# Should see comments with:
# - AI generation details
# - Test results
# - Screenshots (clickable!)
# - Failure analysis (if any)
```

---

## 📊 Provider Comparison

| Provider | Setup Time | Cost/Month | Quality | Privacy | Speed |
|----------|-----------|------------|---------|---------|-------|
| **OpenLLM + Qwen 7B** | 10 min | **$0** | ⭐⭐⭐⭐ | ✅ Local | Fast |
| **Anthropic Claude** | 2 min | $60-90 | ⭐⭐⭐⭐⭐ | ❌ Cloud | Fast |
| **OpenAI GPT-4** | 2 min | $100-150 | ⭐⭐⭐⭐⭐ | ❌ Cloud | Medium |
| **vLLM + Qwen 7B** | 15 min | **$0** | ⭐⭐⭐⭐ | ✅ Local | Very Fast |
| **Azure OpenAI** | 30 min | $100-150 | ⭐⭐⭐⭐⭐ | ⚠️ Cloud | Fast |

**Recommendation:** Start with **OpenLLM + Qwen 7B** for zero cost, then compare with Claude if budget allows.

---

## 🎯 Benefits Summary

### Multi-LLM Support
✅ **Flexibility:** Switch providers anytime
✅ **Cost Optimization:** Use free local models for dev, paid for production
✅ **No Vendor Lock-in:** Not dependent on any single provider
✅ **Comparison:** Test different models to find best quality/cost ratio

### Knowledge Base in OpenProject
✅ **Complete History:** Every attempt documented
✅ **Visual Evidence:** Screenshots of failures
✅ **Learning System:** RAG queries past solutions
✅ **Team Visibility:** Humans see AI's work
✅ **Audit Trail:** Full traceability
✅ **Continuous Improvement:** AI learns from past successes

---

## 🚀 Quick Start Commands

```bash
# Deploy OpenLLM
docker run -d --name openllm-qwen -p 3000:3000 \
  ghcr.io/bentoml/openllm:latest \
  start qwen/qwen2.5-7b-instruct

# Test it works
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen/qwen2.5-7b-instruct", "max_tokens": 100, "messages": [{"role": "user", "content": "Hello"}]}'

# Set n8n environment
LLM_PROVIDER=openllm
OPENLLM_API_BASE=http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/qwen2.5-7b-instruct

# Update n8n workflow (import updated JSON)

# Create test task in OpenProject

# Move to "In Progress"

# Watch it work! 🎉
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Status:** Ready to implement
**Estimated Time:** 2-3 hours total
