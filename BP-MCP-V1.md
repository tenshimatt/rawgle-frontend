# Beyond Pandora MCP v1 - Continuous AI Development System

**Project:** Automated Test-Driven Development with LLM Feedback Loop
**Version:** 1.0
**Date:** 2025-10-29
**Status:** Specification

---

## Executive Summary

A Model Context Protocol (MCP) based system that enables Claude to:
1. Generate code based on specifications
2. Run comprehensive E2E tests with full artifact capture
3. Analyze test results (screenshots, console logs, network traces)
4. Iteratively fix issues until tests pass
5. Learn from successful implementations via RAG

**Key Innovation:** LLM sees actual browser artifacts (screenshots, console errors, network failures) to debug and improve code intelligently.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         OpenProject                              │
│  • Task Management                                              │
│  • Webhook triggers on "In Progress"                            │
└────────────────┬────────────────────────────────────────────────┘
                 │ Webhook
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Orchestrator                         │
│  1. Receive webhook                                             │
│  2. Fetch spec from GitHub                                      │
│  3. Query RAG for code examples                                 │
│  4. Call Claude with MCP tools                                  │
│  5. Monitor test execution                                      │
│  6. Handle iteration loop                                       │
│  7. Post results to OpenProject                                 │
└─────────────┬──────────────────┬──────────────────┬─────────────┘
              │                  │                  │
              ▼                  ▼                  ▼
┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  MCP Server 1:      │  │  MCP Server 2:   │  │  MCP Server 3:  │
│  Test Runner        │  │  Code Examples   │  │  GitHub Crawler │
│                     │  │  RAG System      │  │  (Optional)     │
│  • Playwright       │  │                  │  │                 │
│  • Artifact Capture │  │  • Vector Search │  │  • Repo Mining  │
│  • Results Analysis │  │  • Supabase      │  │  • Quality Score│
└─────────────────────┘  └──────────────────┘  └─────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
│  • Source code storage                                          │
│  • Test artifacts storage (/test-results/)                      │
│  • Spec files (/specs/features/)                               │
└────────────────┬────────────────────────────────────────────────┘
                 │ Git push triggers
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                   │
│  • Auto-deploy preview URLs                                     │
│  • Production deployment                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### MCP Server 1: Playwright Test Runner

**Purpose:** Execute E2E tests and capture comprehensive artifacts for LLM analysis

**Location:** `mcp-playwright-server/`

**Technology Stack:**
- Node.js + TypeScript
- Playwright (not Selenium - better artifact capture)
- MCP SDK (@modelcontextprotocol/sdk)
- Sharp (image processing)

#### Tools Exposed to Claude:

**1. `run_tests`**
```typescript
{
  name: 'run_tests',
  description: 'Run Playwright tests on a URL and return comprehensive results',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to test (Vercel preview URL)'
      },
      testFiles: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of test file paths to execute'
      },
      options: {
        type: 'object',
        properties: {
          browser: {
            type: 'string',
            enum: ['chromium', 'firefox', 'webkit'],
            default: 'chromium'
          },
          headless: { type: 'boolean', default: true },
          video: { type: 'boolean', default: true },
          screenshot: {
            type: 'string',
            enum: ['on', 'off', 'only-on-failure'],
            default: 'on'
          },
          trace: { type: 'boolean', default: true }
        }
      }
    },
    required: ['url']
  }
}
```

**Returns:**
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
      screenshots: string[]; // Base64 encoded
      video?: string; // Path or base64
      trace?: string; // Path to trace.zip
    };
  }>;
  consoleLogs: Array<{
    type: 'log' | 'info' | 'warning' | 'error';
    message: string;
    location?: string;
    stackTrace?: string;
    timestamp: string;
  }>;
  networkLogs: Array<{
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
      body?: any;
      timestamp: string;
    };
    response: {
      status: number;
      statusText: string;
      headers: Record<string, string>;
      body?: any;
      timing: {
        dns: number;
        connect: number;
        tls: number;
        request: number;
        response: number;
        total: number;
      };
    };
  }>;
  coverage?: {
    total: number;
    byFile: Record<string, {
      covered: number;
      uncovered: number[];
      branches: { covered: number; total: number };
    }>;
  };
  performance: {
    firstPaint: number;
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
      helpUrl: string;
    }>;
  };
}
```

**2. `get_test_artifacts`**
```typescript
{
  name: 'get_test_artifacts',
  description: 'Retrieve specific artifacts from a test run',
  inputSchema: {
    type: 'object',
    properties: {
      runId: { type: 'string' },
      artifactTypes: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['screenshots', 'videos', 'traces', 'har', 'coverage']
        }
      }
    },
    required: ['runId']
  }
}
```

**3. `analyze_failure`**
```typescript
{
  name: 'analyze_failure',
  description: 'Get detailed analysis of why a specific test failed',
  inputSchema: {
    type: 'object',
    properties: {
      runId: { type: 'string' },
      testName: { type: 'string' }
    },
    required: ['runId', 'testName']
  }
}
```

**Returns:**
```typescript
{
  testName: string;
  failureReason: string;
  screenshot: string; // Base64 of failure moment
  consoleLogs: Array<{ type: string; message: string }>; // Only errors/warnings
  networkFailures: Array<{
    url: string;
    status: number;
    error: string;
  }>;
  domSnapshot: string; // HTML at failure point
  suggestions: string[]; // AI-generated based on error patterns
}
```

#### Artifact Storage Structure:

```
/test-results/
  /{runId}/
    /screenshots/
      - before-action-001.png
      - after-action-001.png
      - failure-002.png
    /videos/
      - test-login-flow.webm
    /traces/
      - trace.zip  (for trace.playwright.dev viewer)
    /coverage/
      - coverage.json
      - html-report/
    /logs/
      - console.json
      - network.har
    summary.json  (Overall results)
    report.html   (Human-readable report)
```

#### Implementation Details:

**Playwright Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Capture everything
    screenshot: 'on',
    video: 'on',
    trace: 'on',

    // Console and network capture
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Performance tracking
    contextOptions: {
      recordHar: { path: 'network.har' },
      recordVideo: { dir: 'videos/' }
    }
  },

  // Report to JSON for MCP parsing
  reporter: [
    ['json', { outputFile: 'test-results.json' }],
    ['html', { open: 'never' }]
  ]
});
```

**MCP Server Implementation:**
```typescript
// mcp-playwright-server/src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';

class PlaywrightTestRunner {
  private browser: Browser | null = null;
  private artifactsDir = './test-results';

  async runTests(url: string, testFiles: string[], options = {}) {
    const runId = uuidv4();
    const runDir = `${this.artifactsDir}/${runId}`;

    // Launch browser with full tracing
    this.browser = await chromium.launch({
      headless: options.headless ?? true
    });

    const context = await this.browser.newContext({
      recordVideo: { dir: `${runDir}/videos` },
      recordHar: { path: `${runDir}/logs/network.har` }
    });

    // Start tracing
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });

    const page = await context.newPage();

    // Capture console logs
    const consoleLogs: any[] = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        message: msg.text(),
        location: msg.location(),
        timestamp: new Date().toISOString()
      });
    });

    // Capture network
    const networkLogs: any[] = [];
    page.on('request', request => {
      networkLogs.push({
        type: 'request',
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      });
    });

    page.on('response', async response => {
      const request = networkLogs.find(r => r.url === response.url());
      if (request) {
        request.response = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          body: await response.text().catch(() => null),
          timing: response.timing()
        };
      }
    });

    // Run tests
    const results = await this.executeTestFiles(page, testFiles, runDir);

    // Stop tracing and save
    await context.tracing.stop({ path: `${runDir}/traces/trace.zip` });

    // Get coverage if enabled
    const coverage = await page.coverage?.stopJSCoverage();

    // Save all artifacts
    await this.saveArtifacts(runId, {
      results,
      consoleLogs,
      networkLogs,
      coverage
    });

    await context.close();
    await this.browser.close();

    return {
      runId,
      ...results,
      consoleLogs,
      networkLogs,
      coverage,
      artifactsPath: runDir
    };
  }
}

const server = new Server({
  name: 'playwright-test-runner',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'run_tests') {
    const runner = new PlaywrightTestRunner();
    const results = await runner.runTests(
      args.url,
      args.testFiles || [],
      args.options || {}
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        },
        // Include screenshots as images
        ...results.screenshots.map(screenshot => ({
          type: 'image',
          data: screenshot.base64,
          mimeType: 'image/png'
        }))
      ]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

### MCP Server 2: Code Examples RAG System

**Purpose:** Provide Claude with similar code examples from the codebase

**Location:** `mcp-code-examples/`

**Technology Stack:**
- Node.js + TypeScript
- Supabase (PostgreSQL + pgvector)
- OpenAI text-embedding-3-small (cheaper, faster)
- MCP SDK

#### Database Schema:

```sql
-- Code examples from the codebase
CREATE TABLE code_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  component_type TEXT, -- 'page', 'component', 'api-route', 'hook', 'util'
  feature_tags TEXT[], -- ['authentication', 'form', 'validation', 'api-call']
  description TEXT,
  dependencies TEXT[], -- Imports used
  complexity_score INT, -- 1-10 based on cyclomatic complexity
  usage_count INT DEFAULT 0, -- How many times it's been referenced
  quality_score INT, -- Based on: has tests, low complexity, high usage
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX ON code_examples USING ivfflat (embedding vector_cosine_ops);

-- Index for filtering
CREATE INDEX ON code_examples (component_type);
CREATE INDEX ON code_examples USING GIN (feature_tags);

-- Successful test implementations (self-improvement)
CREATE TABLE successful_implementations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT NOT NULL,
  task_description TEXT,
  spec_file TEXT,
  generated_code JSONB, -- { files: [...], tests: [...] }
  test_results JSONB, -- All artifacts from test run
  test_run_id TEXT,
  performance_score FLOAT, -- LCP, TTI, etc.
  quality_score FLOAT, -- Based on test coverage, accessibility, etc.
  iterations_count INT, -- How many tries before success
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- GitHub public examples (optional - for learning patterns)
CREATE TABLE github_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo TEXT NOT NULL,
  file_path TEXT NOT NULL,
  code TEXT NOT NULL,
  stars INT,
  framework TEXT, -- 'nextjs', 'react', 'vue', etc.
  tags TEXT[],
  description TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tools Exposed to Claude:

**1. `find_similar_code`**
```typescript
{
  name: 'find_similar_code',
  description: 'Find similar code examples from the codebase based on description',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: 'Describe what kind of code you are looking for'
      },
      componentType: {
        type: 'string',
        enum: ['page', 'component', 'api-route', 'hook', 'util', 'any']
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Feature tags to filter by'
      },
      limit: {
        type: 'number',
        default: 5,
        description: 'Number of examples to return'
      }
    },
    required: ['description']
  }
}
```

**Returns:**
```typescript
{
  examples: Array<{
    filePath: string;
    code: string;
    description: string;
    tags: string[];
    similarityScore: number; // 0-1
    qualityScore: number; // 0-10
    usageCount: number;
  }>;
  totalFound: number;
}
```

**2. `get_successful_implementations`**
```typescript
{
  name: 'get_successful_implementations',
  description: 'Get previous successful implementations similar to current task',
  inputSchema: {
    type: 'object',
    properties: {
      taskDescription: { type: 'string' },
      includeTestResults: { type: 'boolean', default: false },
      limit: { type: 'number', default: 3 }
    },
    required: ['taskDescription']
  }
}
```

**3. `search_by_pattern`**
```typescript
{
  name: 'search_by_pattern',
  description: 'Search for code that uses specific patterns or libraries',
  inputSchema: {
    type: 'object',
    properties: {
      patterns: {
        type: 'array',
        items: { type: 'string' },
        description: 'Code patterns to search for (e.g., "useState", "useEffect", "fetch")'
      },
      dependencies: {
        type: 'array',
        items: { type: 'string' },
        description: 'Libraries/imports to filter by'
      }
    }
  }
}
```

#### Implementation:

```typescript
// mcp-code-examples/src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

class CodeExamplesRAG {
  async findSimilarCode(description: string, options: any = {}) {
    // Generate embedding for the search query
    const embedding = await this.generateEmbedding(description);

    // Vector similarity search
    let query = supabase
      .rpc('match_code_examples', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: options.limit || 5
      });

    // Apply filters
    if (options.componentType && options.componentType !== 'any') {
      query = query.eq('component_type', options.componentType);
    }

    if (options.tags && options.tags.length > 0) {
      query = query.contains('feature_tags', options.tags);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      examples: data.map(ex => ({
        filePath: ex.file_path,
        code: ex.code,
        description: ex.description,
        tags: ex.feature_tags,
        similarityScore: ex.similarity,
        qualityScore: ex.quality_score,
        usageCount: ex.usage_count
      })),
      totalFound: data.length
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });

    return response.data[0].embedding;
  }
}

// PostgreSQL function for vector similarity
/*
CREATE OR REPLACE FUNCTION match_code_examples(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  file_path TEXT,
  code TEXT,
  description TEXT,
  feature_tags TEXT[],
  quality_score INT,
  usage_count INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    code_examples.id,
    code_examples.file_path,
    code_examples.code,
    code_examples.description,
    code_examples.feature_tags,
    code_examples.quality_score,
    code_examples.usage_count,
    1 - (code_examples.embedding <=> query_embedding) AS similarity
  FROM code_examples
  WHERE 1 - (code_examples.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
*/
```

---

### MCP Server 3: GitHub Crawler (Optional)

**Purpose:** Continuously crawl high-quality GitHub repos for learning patterns

**Location:** `mcp-github-crawler/`

**Note:** This is optional for v1. Can use existing Archon system if available.

**Tools:**
```typescript
- crawl_repo(repoUrl, frameworks)
- search_github(query, minStars, language)
- index_examples(examples[])
```

---

## n8n Workflow Integration

### Workflow: "Auto Testing Pipeline with MCP"

**Node 1: OpenProject Webhook**
- Trigger: Work package updated
- Filter: Status = "In Progress"

**Node 2: Fetch Task Details**
- HTTP Request to OpenProject API
- Parse: SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES

**Node 3: Fetch Spec from GitHub**
- HTTP Request to GitHub API
- Decode base64 content

**Node 4: Query RAG for Examples (NEW)**
```javascript
// Call MCP Server 2
const ragResults = await callMCP('code-examples-rag', 'find_similar_code', {
  description: taskDescription,
  componentType: 'page', // Inferred from spec
  limit: 5
});
```

**Node 5: Build Enhanced Claude Prompt**
```javascript
const prompt = `You are an expert Next.js developer. Generate production-ready code for this task:

# Task: ${taskSubject}

## Specification:
${specContent}

## Similar Code Examples from Codebase:
${ragResults.examples.map(ex => `
### ${ex.filePath}
\`\`\`typescript
${ex.code}
\`\`\`
Tags: ${ex.tags.join(', ')}
`).join('\n')}

## Instructions:
1. Study the similar examples above - match their patterns and style
2. Generate complete code for: ${targetFiles.join(', ')}
3. After generating, use the run_tests MCP tool to test your code
4. If tests fail, analyze the artifacts and fix the issues
5. Iterate until all tests pass

## Available MCP Tools:
- run_tests(url, testFiles) - Run Playwright tests and get full artifacts
- analyze_failure(runId, testName) - Get detailed failure analysis with screenshots
- find_similar_code(description) - Get more examples if needed

Generate the code now and test it!`;
```

**Node 6: Call Claude with MCP Tools**
```javascript
// Claude API call with MCP configuration
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': claudeApiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    // Enable MCP tools
    tools: [
      {
        type: 'mcp',
        server: 'playwright-test-runner'
      },
      {
        type: 'mcp',
        server: 'code-examples-rag'
      }
    ],
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
});

// Claude will use MCP tools to:
// 1. Generate code
// 2. Call run_tests()
// 3. Analyze results
// 4. Fix and retry
// 5. Return final working code
```

**Node 7: Parse Claude Response**
```javascript
const generatedCode = parseClaudeResponse(response);
const testResults = generatedCode.mcpToolResults.find(r => r.tool === 'run_tests');
```

**Node 8: Commit to GitHub**
```javascript
// Create branch
const branchName = `auto-task-${taskId}`;

// Commit generated files
for (const file of generatedCode.files) {
  await commitToGitHub(branchName, file.path, file.content);
}

// Store test results
await commitToGitHub(
  branchName,
  `/test-results/${testResults.runId}/summary.json`,
  JSON.stringify(testResults)
);
```

**Node 9: Wait for Vercel Deploy**
```javascript
// Wait for Vercel to deploy
const previewUrl = await waitForVercelPreview(branchName);
```

**Node 10: Store Successful Implementation (NEW)**
```javascript
if (testResults.status === 'passed') {
  // Store in RAG database for future learning
  await callMCP('code-examples-rag', 'store_successful_implementation', {
    taskId,
    taskDescription,
    generatedCode,
    testResults,
    performanceScore: testResults.performance.largestContentfulPaint
  });
}
```

**Node 11: Post Results to OpenProject**
```javascript
const comment = testResults.status === 'passed'
  ? `✅ **Tests PASSED** - Code generated and deployed!

  ## Summary
  ${generatedCode.summary}

  ## Preview URL
  ${previewUrl}

  ## Test Results
  - Total: ${testResults.summary.total}
  - Passed: ${testResults.summary.passed}
  - Performance: ${testResults.performance.largestContentfulPaint}ms LCP

  ## Files Generated
  ${generatedCode.files.map(f => `- ${f.path}`).join('\n')}

  Branch: \`${branchName}\`
  [View Test Report](${testResults.reportUrl})`
  : `❌ **Tests FAILED** after ${testResults.iterationCount} attempts

  ## Failures
  ${testResults.tests.filter(t => t.status === 'failed').map(t => `
  ### ${t.name}
  ${t.error.message}

  ![Screenshot](${t.artifacts.screenshots[0]})
  `).join('\n')}

  ## Console Errors
  \`\`\`
  ${testResults.consoleLogs.filter(l => l.type === 'error').map(l => l.message).join('\n')}
  \`\`\`

  Manual review needed.`;

await postCommentToOpenProject(taskId, comment);
```

---

## Data Flow Example

### Scenario: Generate Login Page

**1. User creates OpenProject task:**
```markdown
Subject: [AUTO] User Login Page

Description:
Create a login page with email/password authentication

SPEC_FILE: /specs/features/user-login.yml
GOOD_EXAMPLES: /src/app/auth/register/page.tsx
TARGET_FILES: /src/app/auth/login/page.tsx
```

**2. User moves to "In Progress"**

**3. n8n receives webhook:**
```json
{
  "action": "updated",
  "work_package": {
    "id": 123,
    "subject": "[AUTO] User Login Page",
    "_embedded": {
      "status": { "name": "In Progress" }
    }
  }
}
```

**4. n8n fetches spec from GitHub:**
```yaml
feature: User Login
requirements:
  - Email and password input fields
  - Form validation
  - Error handling
  - JWT token storage
  - Redirect to dashboard on success
```

**5. n8n queries RAG:**
```javascript
// MCP call to code-examples-rag
find_similar_code({
  description: "login page with email password form validation",
  componentType: "page",
  tags: ["authentication", "form", "validation"],
  limit: 3
})
```

**RAG returns:**
```json
{
  "examples": [
    {
      "filePath": "/src/app/auth/register/page.tsx",
      "code": "export default function RegisterPage() { ... }",
      "tags": ["authentication", "form", "validation", "nextjs"],
      "qualityScore": 9,
      "similarityScore": 0.92
    },
    {
      "filePath": "/src/components/forms/ValidationForm.tsx",
      "code": "const ValidationForm = () => { ... }",
      "tags": ["form", "validation", "react-hook-form"],
      "qualityScore": 8,
      "similarityScore": 0.87
    }
  ]
}
```

**6. n8n builds enhanced prompt with examples**

**7. Claude receives prompt + MCP tools available**

**8. Claude generates code:**
```typescript
// /src/app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (matching pattern from examples)
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

**9. Claude uses MCP tool `run_tests`:**
```javascript
// Claude calls via MCP
run_tests({
  url: 'http://localhost:3005', // or Vercel preview
  testFiles: ['tests/login.spec.ts']
})
```

**10. Playwright MCP executes tests:**
```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});

test('should show error on invalid credentials', async ({ page }) => {
  await page.goto('/auth/login');

  await page.fill('input[type="email"]', 'wrong@example.com');
  await page.fill('input[type="password"]', 'wrongpass');

  await page.click('button[type="submit"]');

  await expect(page.locator('.text-red-600')).toBeVisible();
});
```

**11. MCP returns results:**
```json
{
  "runId": "run-abc123",
  "status": "failed",
  "summary": {
    "total": 2,
    "passed": 0,
    "failed": 2
  },
  "tests": [
    {
      "name": "should login successfully",
      "status": "failed",
      "error": {
        "message": "Expected URL to be '/dashboard' but was '/auth/login'",
        "location": { "file": "tests/login.spec.ts", "line": 12 }
      },
      "artifacts": {
        "screenshots": ["data:image/png;base64,..."]
      }
    }
  ],
  "consoleLogs": [
    {
      "type": "error",
      "message": "POST /api/auth/login 404 (Not Found)",
      "timestamp": "2025-10-29T10:00:01.234Z"
    }
  ],
  "networkLogs": [
    {
      "request": {
        "url": "/api/auth/login",
        "method": "POST"
      },
      "response": {
        "status": 404,
        "body": "Not Found"
      }
    }
  ]
}
```

**12. Claude analyzes failure:**
- Sees screenshot showing still on login page
- Sees 404 error in console
- Sees API route doesn't exist
- **Realizes:** Need to create `/api/auth/login` route!

**13. Claude generates API route:**
```typescript
// /src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // TODO: Validate against database
  // For now, mock validation
  if (email === 'test@example.com' && password === 'password123') {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token });
  }

  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
```

**14. Claude calls `run_tests` again:**
- Tests pass this time! ✅

**15. Claude returns final code to n8n**

**16. n8n commits to GitHub:**
```
Branch: auto-task-123
Files:
  - /src/app/auth/login/page.tsx
  - /src/app/api/auth/login/route.ts
  - /tests/login.spec.ts
  - /test-results/run-abc123/summary.json
```

**17. Vercel auto-deploys**

**18. n8n stores successful implementation:**
```javascript
// Store in RAG for future learning
await callMCP('code-examples-rag', 'store_successful_implementation', {
  taskId: 123,
  taskDescription: "User login page with authentication",
  generatedCode: { /* all files */ },
  testResults: { /* full artifacts */ },
  performanceScore: 850 // LCP in ms
});
```

**19. n8n posts success to OpenProject:**
```markdown
✅ **Tests PASSED** - Code generated and deployed!

## Preview URL
https://rawgle-git-auto-task-123.vercel.app

## Test Results
- Total: 2
- Passed: 2
- Performance: 850ms LCP

## Files Generated
- /src/app/auth/login/page.tsx
- /src/app/api/auth/login/route.ts

Branch: `auto-task-123`
```

---

## Self-Improvement Loop

**Key Innovation:** System learns from successful implementations

### How It Works:

**1. After Each Successful Implementation:**
```sql
INSERT INTO successful_implementations (
  task_id,
  task_description,
  generated_code,
  test_results,
  performance_score,
  quality_score,
  iterations_count,
  embedding
)
VALUES (
  '123',
  'User login page with authentication',
  '{ "files": [...], "tests": [...] }',
  '{ "runId": "...", "artifacts": {...} }',
  850, -- LCP
  9.5, -- Quality score
  2,   -- Took 2 iterations
  embedding('User login page with authentication')
);
```

**2. Future Similar Tasks:**
```javascript
// When generating login-related code, RAG returns:
const examples = await findSimilarCode("login authentication");

// Returns previous successful implementation!
{
  examples: [{
    code: "// Code from task-123 that worked well",
    testResults: { /* shows it passed with good performance */ },
    qualityScore: 9.5,
    iterations: 2 // Claude knows this pattern works
  }]
}
```

**3. System Gets Better Over Time:**
- More successful implementations → Better examples
- Fewer iterations needed (learns from past fixes)
- Higher quality scores (learns what makes good code)
- Faster generation (reuses proven patterns)

---

## Quality Metrics

### Code Quality Score (0-10):

```typescript
function calculateQualityScore(implementation: Implementation): number {
  let score = 5; // Base score

  // Test coverage (+2)
  if (implementation.coverage.total > 80) score += 2;
  else if (implementation.coverage.total > 60) score += 1;

  // Performance (+2)
  if (implementation.performance.lcp < 1000) score += 2;
  else if (implementation.performance.lcp < 2000) score += 1;

  // Accessibility (+1)
  if (implementation.accessibility.violations.length === 0) score += 1;

  // Iterations (-1 per retry)
  score -= Math.min(implementation.iterations - 1, 2);

  // Console errors (-1)
  if (implementation.consoleLogs.some(l => l.type === 'error')) score -= 1;

  return Math.max(0, Math.min(10, score));
}
```

### Success Rate Tracking:

```sql
CREATE VIEW implementation_stats AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_attempts,
  AVG(iterations_count) as avg_iterations,
  AVG(performance_score) as avg_performance,
  AVG(quality_score) as avg_quality
FROM successful_implementations
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

---

## Error Handling & Edge Cases

### Scenario 1: Tests Timeout

```javascript
// In Playwright MCP
if (testDuration > maxTimeout) {
  return {
    status: 'timedout',
    error: 'Tests exceeded 5 minute timeout',
    partialResults: { /* what completed */ },
    suggestion: 'Break tests into smaller units or increase timeout'
  };
}
```

**Claude Response:**
- Generates smaller, focused tests
- Adds explicit waits for slow operations
- Simplifies complex interactions

### Scenario 2: Vercel Deploy Fails

```javascript
// n8n node: Wait for Vercel
const maxWait = 5 * 60 * 1000; // 5 minutes
const previewUrl = await waitForVercel(branchName, maxWait);

if (!previewUrl) {
  // Fallback: Test on local dev server
  await startLocalDevServer();
  return 'http://localhost:3005';
}
```

### Scenario 3: Claude Generates Invalid Code

```javascript
// Playwright MCP detects compilation errors
const buildResult = await runBuild();

if (buildResult.errors.length > 0) {
  return {
    status: 'build-failed',
    errors: buildResult.errors,
    // Include TypeScript errors for Claude
    typeErrors: buildResult.errors.filter(e => e.type === 'typescript')
  };
}
```

**Claude sees TypeScript errors and fixes them before running tests**

### Scenario 4: Network Issues in Tests

```javascript
// Playwright MCP captures network failures
networkLogs: [
  {
    request: { url: '/api/data', method: 'GET' },
    response: { status: 0, error: 'net::ERR_CONNECTION_REFUSED' }
  }
]
```

**Claude learns:**
- API isn't running
- Need to mock API responses in tests
- Or ensure backend is available

---

## Performance Optimizations

### 1. Parallel Test Execution

```typescript
// Run multiple test files in parallel
const results = await Promise.all(
  testFiles.map(file => runTestFile(file))
);
```

### 2. Incremental Testing

```typescript
// Only run tests affected by changes
const changedFiles = getChangedFiles(branch);
const affectedTests = getAffectedTests(changedFiles);

await runTests(affectedTests); // Faster!
```

### 3. Artifact Caching

```typescript
// Cache screenshots for unchanged UI
const cacheKey = `${url}-${hash(pageCode)}`;
const cachedScreenshot = await cache.get(cacheKey);

if (cachedScreenshot) return cachedScreenshot;
```

### 4. Smart Example Selection

```typescript
// Rank examples by multiple factors
const rankedExamples = examples
  .map(ex => ({
    ...ex,
    score: (
      ex.similarityScore * 0.5 +
      (ex.qualityScore / 10) * 0.3 +
      (ex.usageCount / 100) * 0.2
    )
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 3); // Top 3 only
```

---

## Security Considerations

### 1. Secrets Management

```typescript
// Never store secrets in test artifacts
function sanitizeNetworkLogs(logs: NetworkLog[]) {
  return logs.map(log => ({
    ...log,
    request: {
      ...log.request,
      headers: sanitizeHeaders(log.request.headers),
      body: sanitizeBody(log.request.body)
    }
  }));
}

function sanitizeHeaders(headers: Record<string, string>) {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) =>
      sensitiveHeaders.includes(key.toLowerCase())
        ? [key, '***REDACTED***']
        : [key, value]
    )
  );
}
```

### 2. MCP Server Authentication

```typescript
// MCP servers require API key
if (request.headers['x-mcp-key'] !== process.env.MCP_API_KEY) {
  throw new Error('Unauthorized');
}
```

### 3. Rate Limiting

```typescript
// Prevent abuse of test runner
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000 // 10 runs per minute
});

await rateLimiter.check(userId);
```

---

## Monitoring & Observability

### Metrics to Track:

```typescript
// Send to monitoring service (e.g., Datadog, New Relic)
metrics.increment('mcp.test_run.started');
metrics.timing('mcp.test_run.duration', duration);
metrics.gauge('mcp.test_run.success_rate', successRate);
metrics.histogram('mcp.iterations_to_success', iterations);

// Log important events
logger.info('Test run completed', {
  runId,
  status,
  duration,
  iterations,
  performanceScore,
  qualityScore
});
```

### Alerting:

```typescript
// Alert if success rate drops
if (successRate < 0.7) {
  alert({
    severity: 'warning',
    message: 'Test success rate below 70%',
    details: { successRate, recentFailures }
  });
}

// Alert if tests are timing out frequently
if (timeoutRate > 0.3) {
  alert({
    severity: 'critical',
    message: 'High test timeout rate',
    details: { timeoutRate, avgDuration }
  });
}
```

---

## Deployment Architecture

### Infrastructure:

```yaml
# docker-compose.yml
version: '3.8'

services:
  mcp-playwright:
    build: ./mcp-playwright-server
    ports:
      - "3001:3000"
    environment:
      - ARTIFACTS_DIR=/data/test-results
      - MAX_CONCURRENT_RUNS=3
    volumes:
      - ./test-results:/data/test-results
      - /var/run/docker.sock:/var/run/docker.sock # For browser containers
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  mcp-code-examples:
    build: ./mcp-code-examples
    ports:
      - "3002:3000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    deploy:
      resources:
        limits:
          memory: 512M

  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - MCP_PLAYWRIGHT_URL=http://mcp-playwright:3000
      - MCP_CODE_EXAMPLES_URL=http://mcp-code-examples:3000
    volumes:
      - ./n8n-data:/home/node/.n8n
```

### Scaling Considerations:

**Horizontal Scaling:**
- Run multiple MCP Playwright instances
- Load balance test runs across instances
- Use Redis for distributed locking

**Vertical Scaling:**
- Playwright needs 1-2GB RAM per browser
- SSD storage for fast artifact I/O
- Multi-core CPU for parallel tests

---

## Cost Analysis

### OpenAI API Costs (text-embedding-3-small):

- **Input:** $0.02 / 1M tokens
- **Embedding 1000 files:** ~10M tokens = $0.20
- **Search queries:** ~1K queries/day × 500 tokens = 0.5M tokens/month = $0.01/month

**Total embedding cost:** ~$0.21 one-time + $0.01/month

### Claude API Costs:

- **Sonnet 4:** $3 / 1M input tokens, $15 / 1M output tokens
- **Average task:** 10K input (spec + examples) + 5K output (code) = $0.105/task
- **100 tasks/month:** ~$10.50/month

### Supabase:

- **Free tier:** 500MB database, 2GB bandwidth
- **Pro tier:** $25/month (if needed for scale)

### Infrastructure:

- **VPS for MCP servers:** $20-40/month (4GB RAM, 2 vCPU)
- **OR AWS ECS Fargate:** ~$30-50/month
- **Vercel:** Free (open source) or $20/month (Pro)

**Total estimated cost:** ~$60-90/month for full automation

---

## Success Criteria

### Phase 1 (MVP - Week 1):

- [ ] MCP Playwright server running
- [ ] Basic test execution with screenshot capture
- [ ] Console log capture
- [ ] Network log capture
- [ ] Integration with n8n
- [ ] Successfully generate and test 1 simple component

### Phase 2 (RAG - Week 2):

- [ ] Supabase database setup
- [ ] Crawl existing codebase
- [ ] Embedding generation for all files
- [ ] Vector similarity search working
- [ ] Claude uses examples in code generation
- [ ] Quality improvement visible (fewer iterations)

### Phase 3 (Self-Improvement - Week 3):

- [ ] Store successful implementations
- [ ] Quality score calculation
- [ ] Performance metrics tracking
- [ ] System shows measurable improvement over time
- [ ] Success rate > 80%
- [ ] Average iterations < 2

### Phase 4 (Production - Week 4):

- [ ] Full error handling
- [ ] Monitoring and alerting
- [ ] Documentation complete
- [ ] Team training
- [ ] Handle 50+ tasks/week automatically

---

## Future Enhancements

### v1.1: Visual Regression Testing
- Compare screenshots against baseline
- Detect unintended UI changes
- Pixel-perfect diffs

### v1.2: Performance Budgets
- Fail tests if LCP > 2.5s
- Bundle size limits
- Lighthouse CI integration

### v1.3: Multi-Browser Testing
- Test in Chrome, Firefox, Safari
- Mobile viewport testing
- Cross-browser compatibility reports

### v1.4: AI Code Review
- Claude reviews generated code
- Suggests improvements
- Security vulnerability detection

### v1.5: Continuous Learning Dashboard
- Visualize improvement over time
- Show success rate trends
- Identify common failure patterns

---

## Appendix A: File Structure

```
rawgle-frontend/
├── specs/
│   └── features/
│       ├── hello-world.yml
│       ├── user-login.yml
│       └── ...
├── test-results/
│   └── {runId}/
│       ├── screenshots/
│       ├── videos/
│       ├── traces/
│       ├── coverage/
│       ├── logs/
│       └── summary.json
├── mcp-playwright-server/
│   ├── src/
│   │   ├── server.ts
│   │   ├── test-runner.ts
│   │   └── artifact-capture.ts
│   ├── package.json
│   └── Dockerfile
├── mcp-code-examples/
│   ├── src/
│   │   ├── server.ts
│   │   ├── embeddings.ts
│   │   └── search.ts
│   ├── package.json
│   └── Dockerfile
└── n8n-workflows/
    └── auto-testing-pipeline-mcp.json
```

---

## Appendix B: Environment Variables

```bash
# MCP Playwright Server
ARTIFACTS_DIR=/data/test-results
MAX_CONCURRENT_RUNS=3
MAX_TEST_DURATION=300000 # 5 minutes
BROWSER_TIMEOUT=30000

# MCP Code Examples
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
OPENAI_API_KEY=sk-...

# n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure-password
MCP_PLAYWRIGHT_URL=http://mcp-playwright:3000
MCP_CODE_EXAMPLES_URL=http://mcp-code-examples:3000

# Claude
ANTHROPIC_API_KEY=sk-ant-api03-...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=tenshimatt
GITHUB_REPO=rawgle-frontend

# OpenProject
OPENPROJECT_URL=http://10.90.10.7/openproject
OPENPROJECT_API_KEY=your-api-key

# Jenkins
JENKINS_URL=http://10.90.10.45:8080
JENKINS_USER=matt
JENKINS_API_TOKEN=your-token

# Vercel
VERCEL_TOKEN=your-token
VERCEL_PROJECT_ID=your-project
```

---

## Appendix C: API Schemas

### Test Run Result Schema:

```typescript
interface TestRunResult {
  runId: string;
  status: 'passed' | 'failed' | 'timedout' | 'build-failed';
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  tests: TestResult[];
  consoleLogs: ConsoleLog[];
  networkLogs: NetworkLog[];
  coverage?: CoverageReport;
  performance: PerformanceMetrics;
  accessibility: AccessibilityReport;
  artifacts: {
    screenshotsDir: string;
    videosDir: string;
    tracesDir: string;
    reportUrl: string;
  };
}

interface TestResult {
  name: string;
  file: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  retries: number;
  error?: {
    message: string;
    stack: string;
    location: { file: string; line: number; column: number };
  };
  artifacts: {
    screenshots: string[]; // Base64 or URLs
    video?: string;
    trace?: string;
  };
}

interface ConsoleLog {
  type: 'log' | 'info' | 'warning' | 'error' | 'debug';
  message: string;
  location?: string;
  stackTrace?: string;
  timestamp: string;
}

interface NetworkLog {
  id: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    timestamp: string;
  };
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body?: any;
    timing: {
      dns: number;
      connect: number;
      tls: number;
      request: number;
      response: number;
      total: number;
    };
  };
}

interface PerformanceMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
}

interface AccessibilityReport {
  violations: Array<{
    rule: string;
    element: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    message: string;
    helpUrl: string;
  }>;
  passes: number;
  incomplete: number;
}
```

---

## Appendix D: Sample Test Template

```typescript
// tests/templates/page-test.template.ts
import { test, expect } from '@playwright/test';

/**
 * Generated test for: ${FEATURE_NAME}
 * Task ID: ${TASK_ID}
 * Generated: ${TIMESTAMP}
 */

test.describe('${FEATURE_NAME}', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to page
    await page.goto('${PAGE_URL}');
  });

  test('should render page correctly', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveTitle(/.*${PAGE_TITLE}.*/);

    // Check main elements present
    await expect(page.locator('${MAIN_ELEMENT_SELECTOR}')).toBeVisible();
  });

  test('should handle user interaction', async ({ page }) => {
    // Interact with element
    await page.click('${BUTTON_SELECTOR}');

    // Verify result
    await expect(page.locator('${RESULT_SELECTOR}')).toContainText('${EXPECTED_TEXT}');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Trigger error condition
    await page.fill('${INPUT_SELECTOR}', '${INVALID_INPUT}');
    await page.click('${SUBMIT_SELECTOR}');

    // Verify error message
    await expect(page.locator('${ERROR_SELECTOR}')).toBeVisible();
  });

  test('should meet performance standards', async ({ page }) => {
    // Get performance metrics
    const metrics = await page.evaluate(() => JSON.parse(
      JSON.stringify(performance.getEntriesByType('navigation')[0])
    ));

    // Verify LCP < 2.5s
    expect(metrics.largestContentfulPaint).toBeLessThan(2500);
  });
});
```

---

## Conclusion

This specification defines a complete **continuous AI development system** that:

1. ✅ Generates code from specifications
2. ✅ Runs comprehensive E2E tests
3. ✅ Captures all artifacts (screenshots, logs, metrics)
4. ✅ Provides artifacts to Claude for intelligent debugging
5. ✅ Learns from successful implementations
6. ✅ Improves over time via RAG

**Next Steps:**
1. Build MCP Playwright server (estimated 4-6 hours)
2. Set up Supabase database (estimated 1-2 hours)
3. Build MCP Code Examples server (estimated 3-4 hours)
4. Integrate with n8n workflow (estimated 2-3 hours)
5. Test end-to-end with sample task (estimated 1 hour)

**Total estimated development time:** 11-16 hours

**Expected outcomes:**
- 80%+ success rate on code generation
- 2x faster development vs manual coding
- Continuous quality improvement
- Self-healing capabilities

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Status:** Ready for Implementation
**Owner:** Beyond Pandora Development Team
