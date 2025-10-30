# LLM Provider Architecture - Multi-Provider Support

**Date:** 2025-10-30
**Status:** Design Complete
**Goal:** Support ANY LLM provider (OpenAI, Anthropic, Qwen, OpenLLM, local models)

---

## 🎯 Problem

Current implementation is hardcoded to Anthropic's Claude API:
- Workflow uses `https://api.anthropic.com/v1/messages`
- Model hardcoded as `claude-sonnet-4-20250514`
- Headers specific to Anthropic (`anthropic-version`)
- Not compatible with OpenLLM, Qwen, or other providers

**Users want flexibility to use:**
- OpenAI (GPT-4, GPT-4 Turbo, GPT-4o)
- Anthropic Claude (Sonnet, Opus)
- Qwen (via OpenLLM or vLLM)
- Local models (LLaMA, Mistral, etc.)
- Any OpenAI-compatible API

---

## 🏗️ Solution: LLM Provider Abstraction Layer

###  Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Workflow                             │
│  (OpenProject → Fetch Context → Build Prompt)                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  LLM Router Node (n8n)    │
         │  Reads: LLM_PROVIDER env  │
         │  Routes to correct API    │
         └───────────┬───────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Anthropic│ │ OpenAI   │ │ OpenLLM  │
  │ Provider │ │ Provider │ │ Provider │
  └──────────┘ └──────────┘ └──────────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
            ┌────────────────┐
            │ Unified Response│
            │   Parser        │
            └────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  Continue Workflow         │
         │  (Parse Response → Tests)  │
         └───────────────────────────┘
```

---

## 📋 Provider Configuration Schema

### Environment Variables

```bash
# LLM Provider Selection
LLM_PROVIDER=anthropic  # anthropic | openai | openllm | azure | custom

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_BASE=https://api.anthropic.com/v1

# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo
OPENAI_API_BASE=https://api.openai.com/v1

# OpenLLM Configuration (local or hosted)
OPENLLM_API_BASE=http://localhost:3000/v1  # or http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/qwen2.5-7b-instruct
OPENLLM_API_KEY=optional-if-auth-enabled

# Azure OpenAI Configuration
AZURE_OPENAI_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_API_VERSION=2024-02-15-preview

# Custom Provider Configuration
CUSTOM_API_BASE=http://custom-llm-api.com/v1
CUSTOM_API_KEY=...
CUSTOM_MODEL=custom-model-name
CUSTOM_API_FORMAT=openai  # openai | anthropic | custom

# Common Settings
LLM_MAX_TOKENS=8000
LLM_TEMPERATURE=0.7
LLM_TIMEOUT=120000  # 2 minutes
```

---

## 🔧 Provider Implementations

### 1. Anthropic Provider

**API Endpoint:** `https://api.anthropic.com/v1/messages`

**Request Format:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 8000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ]
}
```

**Headers:**
```
x-api-key: sk-ant-api03-...
anthropic-version: 2023-06-01
Content-Type: application/json
```

**Response Format:**
```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Generated code here..."
    }
  ]
}
```

### 2. OpenAI Provider

**API Endpoint:** `https://api.openai.com/v1/chat/completions`

**Request Format:**
```json
{
  "model": "gpt-4-turbo",
  "max_tokens": 8000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ]
}
```

**Headers:**
```
Authorization: Bearer sk-...
Content-Type: application/json
```

**Response Format:**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Generated code here..."
      }
    }
  ]
}
```

### 3. OpenLLM Provider (OpenAI-Compatible)

**API Endpoint:** `http://localhost:3000/v1/chat/completions`

OpenLLM exposes an OpenAI-compatible API, so the request/response format is identical to OpenAI.

**Supported Models:**
- Qwen (qwen/qwen2.5-7b-instruct, qwen/qwen2.5-72b-instruct)
- LLaMA (meta-llama/llama-3.1-8b-instruct)
- Mistral (mistralai/mistral-7b-instruct-v0.2)
- Phi (microsoft/phi-3-medium-4k-instruct)
- Many others...

**Example with Qwen:**
```json
{
  "model": "qwen/qwen2.5-7b-instruct",
  "max_tokens": 8000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ]
}
```

**No API Key Required (local)** - Unless you configure authentication

### 4. Azure OpenAI Provider

**API Endpoint:** `https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version={api-version}`

**Request Format:** Same as OpenAI

**Headers:**
```
api-key: your-azure-key
Content-Type: application/json
```

### 5. Custom Provider

Supports any LLM with OpenAI-compatible or Anthropic-compatible API format.

---

## 📝 n8n Workflow Implementation

### Option 1: Single Dynamic LLM Node (Recommended)

Create a single n8n Function node that routes to the correct provider based on environment variables:

```javascript
// Node: "Call LLM (Universal)"
const provider = $env.LLM_PROVIDER || 'anthropic';
const prompt = $json.prompt;

// Build request based on provider
let url, headers, body;

switch (provider) {
  case 'anthropic':
    url = $env.ANTHROPIC_API_BASE + '/messages';
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
    // Add auth if configured
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
    const resourceName = $env.AZURE_OPENAI_ENDPOINT.match(/https:\/\/(.+?)\.openai\.azure\.com/)[1];
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

  case 'custom':
    url = ($env.CUSTOM_API_BASE || 'http://localhost:8000/v1') + '/chat/completions';
    headers = {
      'Content-Type': 'application/json'
    };
    if ($env.CUSTOM_API_KEY) {
      const format = $env.CUSTOM_API_FORMAT || 'openai';
      if (format === 'openai') {
        headers['Authorization'] = `Bearer ${$env.CUSTOM_API_KEY}`;
      } else if (format === 'anthropic') {
        headers['x-api-key'] = $env.CUSTOM_API_KEY;
      }
    }
    body = {
      model: $env.CUSTOM_MODEL || 'default',
      max_tokens: parseInt($env.LLM_MAX_TOKENS) || 8000,
      temperature: parseFloat($env.LLM_TEMPERATURE) || 0.7,
      messages: [{ role: 'user', content: prompt }]
    };
    break;

  default:
    throw new Error(`Unknown LLM provider: ${provider}`);
}

// Make HTTP request
const response = await $http.request({
  method: 'POST',
  url,
  headers,
  body: JSON.stringify(body),
  timeout: parseInt($env.LLM_TIMEOUT) || 120000
});

return { llmResponse: response };
```

### Option 2: Separate Nodes per Provider

Create separate HTTP Request nodes for each provider, and use an IF node to route based on `LLM_PROVIDER`.

**Pros:** Easier to visualize in n8n UI
**Cons:** More nodes, harder to maintain

---

## 🔄 Response Parser (Universal)

After calling the LLM, parse the response to extract generated code:

```javascript
// Node: "Parse LLM Response (Universal)"
const provider = $env.LLM_PROVIDER || 'anthropic';
const llmResponse = $json.llmResponse;

let content;

switch (provider) {
  case 'anthropic':
    content = llmResponse.content[0].text;
    break;

  case 'openai':
  case 'openllm':
  case 'azure':
  case 'custom':
    content = llmResponse.choices[0].message.content;
    break;

  default:
    throw new Error(`Unknown provider for parsing: ${provider}`);
}

// Extract JSON from response (might be wrapped in markdown)
const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/) || content.match(/({[\s\S]+})/);
const generatedCode = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

return {
  generatedCode,
  taskData: $('Build Prompt').item(0).json.taskData
};
```

---

## 🚀 Deployment Options

### Deploy Local OpenLLM with Qwen

```bash
# Install OpenLLM
pip install openllm

# Start OpenLLM server with Qwen
openllm start qwen/qwen2.5-7b-instruct \
  --port 3000 \
  --workers 1

# Or run in Docker
docker run -p 3000:3000 \
  ghcr.io/bentoml/openllm:latest \
  start qwen/qwen2.5-7b-instruct
```

**Then in n8n environment:**
```bash
LLM_PROVIDER=openllm
OPENLLM_API_BASE=http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/qwen2.5-7b-instruct
```

### Deploy vLLM (Faster Alternative)

```bash
# Install vLLM
pip install vllm

# Start vLLM with Qwen
vllm serve qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 3000 \
  --api-key optional-key

# Or Docker
docker run --gpus all -p 3000:8000 \
  vllm/vllm-openai:latest \
  --model qwen/Qwen2.5-7B-Instruct
```

**Then in n8n environment:**
```bash
LLM_PROVIDER=openllm  # vLLM is OpenAI-compatible
OPENLLM_API_BASE=http://10.90.10.6:3000/v1
OPENLLM_MODEL=qwen/Qwen2.5-7B-Instruct
OPENLLM_API_KEY=optional-key
```

---

## 🧪 Testing Each Provider

### Test Anthropic
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Test OpenAI
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4-turbo",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Test OpenLLM / vLLM (Local)
```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen/qwen2.5-7b-instruct",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## 📊 Cost Comparison

| Provider | Model | Input ($/1M tokens) | Output ($/1M tokens) | Best For |
|----------|-------|---------------------|---------------------|----------|
| **Anthropic** | Claude Sonnet 4 | $3.00 | $15.00 | Best quality, MCP support |
| **OpenAI** | GPT-4 Turbo | $10.00 | $30.00 | Industry standard |
| **OpenAI** | GPT-4o | $5.00 | $15.00 | Faster, cheaper GPT-4 |
| **OpenLLM (Local)** | Qwen 2.5 7B | **FREE** | **FREE** | Cost-free, privacy |
| **OpenLLM (Local)** | LLaMA 3.1 8B | **FREE** | **FREE** | Cost-free, privacy |
| **Azure OpenAI** | GPT-4 | $10.00 | $30.00 | Enterprise, compliance |

**Hardware Requirements for Local:**
- **Qwen 2.5 7B:** 16GB RAM, GPU optional (faster with GPU)
- **LLaMA 3.1 8B:** 16GB RAM, GPU optional
- **Qwen 2.5 72B:** 80GB VRAM (A100 or multiple GPUs)

---

## 🔐 Security Considerations

### API Key Management
- Store API keys in environment variables (not hardcoded)
- Use n8n's credential manager for sensitive data
- Rotate keys regularly

### Local Model Security
- OpenLLM/vLLM running locally = no data leaves your network
- No API key needed if running without auth
- Full control over model and data

### Rate Limiting
- Different providers have different rate limits
- Implement retry logic with exponential backoff
- Consider queueing for high-volume tasks

---

## 📚 Documentation Updates Needed

### Files to Update:

1. **n8n-workflow-with-mcp.json**
   - Replace hardcoded Anthropic node with universal LLM node
   - Add provider routing logic
   - Add response parser

2. **INTEGRATION_CHECKLIST.md**
   - Add section on LLM provider configuration
   - Update credential verification steps
   - Add OpenLLM deployment instructions

3. **BP-MCP-V1.md**
   - Update cost analysis for multiple providers
   - Add provider comparison section

4. **.env.example**
   - Add all LLM provider environment variables
   - Document provider selection

5. **README.md**
   - Add "Choosing an LLM Provider" section
   - Document each provider's setup

---

## ✅ Implementation Checklist

- [ ] Create universal LLM node in n8n
- [ ] Add provider routing logic
- [ ] Add response parser for each provider
- [ ] Update environment variable configuration
- [ ] Test with Anthropic (current)
- [ ] Test with OpenAI
- [ ] Deploy OpenLLM with Qwen
- [ ] Test with local OpenLLM
- [ ] Update all documentation
- [ ] Create provider switching guide

---

## 🎯 Recommended Default: OpenLLM + Qwen

**Why?**
- **Free:** No API costs
- **Private:** Data never leaves your infrastructure
- **Fast:** 7B model runs well on modest hardware
- **Quality:** Qwen 2.5 is competitive with Claude/GPT-4 for code generation
- **Open Source:** Full control, no vendor lock-in

**Setup Time:** 10 minutes
**Hardware:** 16GB RAM (GPU optional but recommended)
**Cost:** $0/month (vs $60-90/month for Claude/OpenAI)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Status:** Ready for implementation
