# Knowledge Base Architecture - OpenProject as Central Repository

**Date:** 2025-10-30
**Status:** Design Complete
**Goal:** Use OpenProject work packages as the central knowledge base for all development artifacts

---

## 🎯 Core Concept

**OpenProject work packages = Complete development history + knowledge base**

Every test run, every code generation attempt, every failure analysis, and every success should be documented in the OpenProject work package. This creates:

1. **Searchable Knowledge Base** - RAG can query OpenProject for similar past solutions
2. **Audit Trail** - Complete history of what was tried and what worked
3. **Learning System** - AI learns from past successes and failures
4. **Team Collaboration** - Humans can see AI's reasoning and results
5. **Compliance** - Full traceability for regulatory requirements

---

## 📊 What Gets Stored in OpenProject

### 1. Initial Task Information ✅ (Already captured)

**Custom Fields:**
```
SPEC_FILE: specs/feature-name.md
GOOD_EXAMPLES: src/components/example1.tsx, src/components/example2.tsx
TARGET_FILES: src/components/new-feature.tsx
TEST_FILES: tests/e2e/new-feature.spec.ts
```

**Description:**
- Requirements
- Acceptance criteria
- Technical specifications

### 2. Code Generation Attempts (NEW - needs implementation)

**For each attempt, post as comment:**

```markdown
## 🤖 AI Generation Attempt #1
**Timestamp:** 2025-10-30 14:23:45
**LLM Provider:** openllm (qwen/qwen2.5-7b-instruct)
**Prompt Tokens:** 2,450
**Completion Tokens:** 3,200
**Duration:** 12.3 seconds

### Generated Files
- `src/components/counter.tsx` (245 lines)
- `src/components/counter.test.tsx` (89 lines)
- `tests/e2e/counter.spec.ts` (67 lines)

### Code Summary
Created a counter component with increment, decrement, and reset functionality.
Includes unit tests and E2E tests covering all acceptance criteria.

### Branch
`auto-task-123`

### Vercel Preview
https://preview-abc123.vercel.app
```

### 3. Test Execution Results (NEW - needs implementation)

**For each test run, post as comment:**

```markdown
## 🧪 Test Execution #1
**Timestamp:** 2025-10-30 14:24:15
**MCP Run ID:** `550e8400-e29b-41d4-a716-446655440000`
**Status:** ❌ FAILED
**Duration:** 23.4 seconds

### Summary
- Total Tests: 5
- Passed: 3 ✅
- Failed: 2 ❌
- Duration: 23,456ms

### Failed Tests

#### 1. "should reset counter to initial value"
**Error:** `Expected 0 but got 5`
**Location:** `tests/e2e/counter.spec.ts:42`

**Screenshot:**
[View screenshot](http://10.90.10.6/mcp-artifacts/550e8400.../screenshots/reset-failure.png)

**Console Errors:**
```
TypeError: Cannot read property 'reset' of undefined
  at counter.tsx:35
```

**Network Errors:**
- None

#### 2. "should not decrement below minimum"
**Error:** `Element button[data-testid="decrement"] not found`
**Location:** `tests/e2e/counter.spec.ts:58`

**Screenshot:**
[View screenshot](http://10.90.10.6/mcp-artifacts/550e8400.../screenshots/decrement-failure.png)

### Performance Metrics
- First Contentful Paint: 1,234ms
- Largest Contentful Paint: 2,345ms
- Time to Interactive: 3,456ms
- Cumulative Layout Shift: 0.05

### Artifacts
All artifacts stored in: `http://10.90.10.6/mcp-artifacts/550e8400.../`
- Screenshots: 12 files
- Videos: test-execution.webm (3.2MB)
- Trace file: trace.zip (1.8MB)
- Console logs: console-logs.json
- Network logs: network-logs.har
- HTML Report: index.html
```

### 4. Failure Analysis (NEW - needs implementation)

**After analyze_failure MCP call:**

```markdown
## 🔍 Failure Analysis #1
**Timestamp:** 2025-10-30 14:24:30

### Root Cause Analysis

**Test:** "should reset counter to initial value"
**Reason:** The `reset` function was not properly bound to the component state.

**Evidence:**
1. **Code Issue:** Line 35 in `counter.tsx` - `this.reset()` called but `this` is undefined
2. **Console Error:** `TypeError: Cannot read property 'reset' of undefined`
3. **Screenshot:** Shows button click but no state change

### AI-Generated Suggestions
1. ✅ Bind the reset function in constructor or use arrow function
2. ✅ Add null check before calling reset
3. ✅ Consider using React hooks instead of class component
4. ⚠️ Ensure reset button has correct onClick handler

### Similar Past Issues
Found 3 similar issues in work packages #87, #92, #101
All resolved by converting to functional component with hooks.

### Recommended Fix
Convert class component to functional component with `useState` and arrow functions.
```

### 5. Code Improvements (NEW - needs implementation)

**For each retry/improvement:**

```markdown
## 🔄 Code Improvement Attempt #2
**Timestamp:** 2025-10-30 14:25:00
**Based On:** Failure Analysis #1

### Changes Made
1. Converted class component to functional component
2. Used `useState` hook for count state
3. Changed reset to arrow function: `const reset = () => setCount(initialValue)`
4. Added proper data-testid attributes

### Diff
```diff
- class Counter extends React.Component {
-   constructor(props) {
-     this.state = { count: props.initialValue };
-   }
-   reset() {
-     this.setState({ count: this.props.initialValue });
-   }
+ const Counter = ({ initialValue = 0 }) => {
+   const [count, setCount] = useState(initialValue);
+   const reset = () => setCount(initialValue);
```

### Rationale
Arrow functions preserve `this` context and functional components are more modern and testable.

### Files Updated
- `src/components/counter.tsx` (modified)

### Branch
`auto-task-123` (updated)
```

### 6. Final Success (NEW - needs implementation)

```markdown
## ✅ TESTS PASSED - Attempt #2
**Timestamp:** 2025-10-30 14:25:45
**MCP Run ID:** `660f9500-f39b-51d5-b827-556666550111`
**Status:** ✅ SUCCESS
**Duration:** 18.2 seconds

### Summary
- Total Tests: 5
- Passed: 5 ✅
- Failed: 0
- Duration: 18,234ms

### Performance Metrics
- First Contentful Paint: 987ms ✅ (improved)
- Largest Contentful Paint: 1,456ms ✅ (improved)
- Time to Interactive: 2,234ms ✅ (improved)
- Cumulative Layout Shift: 0.02 ✅ (improved)

### Artifacts
All artifacts stored in: `http://10.90.10.6/mcp-artifacts/660f9500.../`

### Preview URL
https://preview-abc123-updated.vercel.app

### Ready for Review
Code is production-ready and all tests pass.

---

**Total Attempts:** 2
**Total Duration:** 1 minute 45 seconds
**Final Status:** ✅ SUCCESS
```

---

## 🗄️ Storage Architecture

### OpenProject (Primary Knowledge Base)

```
Work Package #123: "Build Simple Counter Component"
│
├─ Description (Requirements)
│  └─ SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES, TEST_FILES
│
├─ Comments (Development History)
│  ├─ Comment 1: AI Generation Attempt #1
│  ├─ Comment 2: Test Execution #1 (Failed)
│  ├─ Comment 3: Failure Analysis #1
│  ├─ Comment 4: Code Improvement Attempt #2
│  ├─ Comment 5: Test Execution #2 (Passed)
│  └─ Comment 6: Final Success Summary
│
├─ Attachments (Large Artifacts)
│  ├─ test-results-550e8400.zip (all artifacts from run #1)
│  ├─ test-results-660f9500.zip (all artifacts from run #2)
│  ├─ screenshots-collage.png (visual summary)
│  └─ generated-code-v1.zip
│  └─ generated-code-v2.zip
│
├─ Custom Fields
│  ├─ ATTEMPTS_COUNT: 2
│  ├─ FINAL_STATUS: success
│  ├─ LLM_PROVIDER: openllm
│  ├─ MODEL_USED: qwen/qwen2.5-7b-instruct
│  ├─ TOTAL_DURATION_SECONDS: 105
│  └─ MCP_RUN_IDS: 550e8400..., 660f9500...
│
└─ Status: Ready for Review
```

### MCP Server (Temporary Artifact Storage)

```
/opt/mcp-playwright-server/test-results/
├─ 550e8400-e29b-41d4-a716-446655440000/  (Run #1 - Failed)
│  ├─ screenshots/
│  │  ├─ before-increment.png
│  │  ├─ after-increment.png
│  │  ├─ reset-failure.png  ← Important for debugging
│  │  └─ ... (12 total)
│  ├─ videos/
│  │  └─ test-execution.webm
│  ├─ traces/
│  │  └─ trace.zip
│  ├─ console-logs.json
│  ├─ network-logs.har
│  ├─ html-report/
│  │  └─ index.html
│  └─ test-results.json
│
└─ 660f9500-f39b-51d5-b827-556666550111/  (Run #2 - Passed)
   ├─ screenshots/ (5 screenshots)
   ├─ videos/
   ├─ traces/
   ├─ console-logs.json
   ├─ network-logs.har
   ├─ html-report/
   └─ test-results.json
```

**Retention:** 7 days (configurable)
**Then:** Zip and attach to OpenProject work package before deletion

---

## 🔄 Updated n8n Workflow

### New Nodes to Add:

#### Node: "Post Generation to OpenProject"
**When:** After Claude generates code
**What:** Post comment with generation details

```javascript
const { generatedCode, taskData } = $input.first().json;
const timestamp = new Date().toISOString();

const comment = `## 🤖 AI Generation Attempt #${taskData.attemptNumber || 1}
**Timestamp:** ${timestamp}
**LLM Provider:** ${$env.LLM_PROVIDER}
**Model:** ${$env.LLM_MODEL}

### Generated Files
${generatedCode.files.map(f => `- \`${f.path}\` (${f.content.split('\n').length} lines)`).join('\n')}

### Code Summary
${generatedCode.summary}

### Branch
\`${taskData.branchName}\`
`;

// Post to OpenProject
return { comment };
```

#### Node: "Post Test Results to OpenProject"
**When:** After MCP tests complete
**What:** Post detailed test results

```javascript
const { runId, status, summary, tests, fullResults } = $input.first().json;
const timestamp = new Date().toISOString();

const failedTests = tests.filter(t => t.status === 'failed');

let comment = `## 🧪 Test Execution #${taskData.attemptNumber}
**Timestamp:** ${timestamp}
**MCP Run ID:** \`${runId}\`
**Status:** ${status === 'passed' ? '✅ PASSED' : '❌ FAILED'}
**Duration:** ${summary.duration}ms

### Summary
- Total Tests: ${summary.total}
- Passed: ${summary.passed} ✅
- Failed: ${summary.failed} ${summary.failed > 0 ? '❌' : ''}
- Duration: ${summary.duration}ms

`;

if (failedTests.length > 0) {
  comment += `### Failed Tests\n\n`;
  failedTests.forEach((test, i) => {
    comment += `#### ${i + 1}. "${test.name}"
**Error:** \`${test.error.message}\`
**Location:** \`${test.error.location.file}:${test.error.location.line}\`

**Screenshot:**
[View screenshot](http://${$env.MCP_SERVER_HOST}/artifacts/${runId}/screenshots/${test.artifacts.screenshots[0]?.name}.png)

**Console Errors:**
\`\`\`
${test.error.stack}
\`\`\`

`;
  });
}

// Performance metrics
comment += `### Performance Metrics
- First Contentful Paint: ${fullResults.performance.firstContentfulPaint}ms
- Largest Contentful Paint: ${fullResults.performance.largestContentfulPaint}ms
- Time to Interactive: ${fullResults.performance.timeToInteractive}ms

### Artifacts
All artifacts stored in: \`http://${$env.MCP_SERVER_HOST}/artifacts/${runId}/\`
- Screenshots: ${fullResults.artifacts.screenshots.length} files
- Video: test-execution.webm
- Trace: trace.zip
- HTML Report: [View Report](http://${$env.MCP_SERVER_HOST}/artifacts/${runId}/html-report/index.html)
`;

return { comment };
```

#### Node: "Post Failure Analysis to OpenProject"
**When:** After analyze_failure MCP call
**What:** Post AI analysis and suggestions

```javascript
const { analysis, failedTests } = $input.first().json;

const comment = `## 🔍 Failure Analysis #${taskData.attemptNumber}
**Timestamp:** ${new Date().toISOString()}

### Root Cause Analysis

**Test:** "${failedTests[0].name}"
**Reason:** ${analysis.failureReason}

**Evidence:**
${analysis.consoleLogs.slice(0, 3).map((log, i) => `${i + 1}. **Console Error:** ${log.message}`).join('\n')}

### AI-Generated Suggestions
${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Screenshot Evidence
![Failure Screenshot](http://${$env.MCP_SERVER_HOST}/artifacts/${analysis.runId}/screenshots/${analysis.screenshot})

### Network Issues
${analysis.networkFailures.map((nf, i) => `${i + 1}. **${nf.request.method} ${nf.request.url}** - ${nf.response.status} ${nf.response.statusText}`).join('\n') || 'None'}
`;

return { comment };
```

#### Node: "Archive Artifacts to OpenProject"
**When:** Before deleting old MCP artifacts (after 7 days)
**What:** Zip artifacts and attach to work package

```javascript
// Zip artifacts
const zipPath = `/tmp/test-artifacts-${runId}.zip`;
await $exec(`cd /opt/mcp-playwright-server/test-results/${runId} && zip -r ${zipPath} .`);

// Upload to OpenProject
const formData = new FormData();
formData.append('file', fs.createReadStream(zipPath));
formData.append('fileName', `test-artifacts-${runId}.zip`);

await $http.request({
  method: 'POST',
  url: `${$env.OPENPROJECT_URL}/api/v3/work_packages/${taskData.taskId}/attachments`,
  headers: {
    'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`
  },
  body: formData
});

// Delete local artifacts
await $exec(`rm -rf /opt/mcp-playwright-server/test-results/${runId}`);
```

---

## 🔍 RAG Integration with OpenProject

### Phase 2: Query OpenProject for Similar Solutions

When generating code, query OpenProject for similar past implementations:

```javascript
// Node: "Query Similar Work Packages" (NEW)
const taskSubject = $json.taskData.taskSubject;

// Search OpenProject for similar tasks
const response = await $http.request({
  method: 'GET',
  url: `${$env.OPENPROJECT_URL}/api/v3/work_packages`,
  params: {
    filters: JSON.stringify([
      { status: { operator: '=', values: ['7'] } },  // Ready for Review or Closed
      { subject: { operator: '~', values: [taskSubject.split(' ').slice(0, 3).join(' ')] } }
    ]),
    pageSize: 10
  },
  headers: {
    'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`
  }
});

const similarTasks = response.data._embedded.elements;

// For each similar task, fetch comments to get success patterns
const learnings = [];
for (const task of similarTasks) {
  const comments = await $http.request({
    method: 'GET',
    url: task._links.activities.href,
    headers: {
      'Authorization': `Bearer ${$env.OPENPROJECT_API_KEY}`
    }
  });

  // Extract successful patterns
  const successComments = comments.data._embedded.elements
    .filter(c => c.comment && c.comment.raw.includes('✅ TESTS PASSED'));

  if (successComments.length > 0) {
    learnings.push({
      taskId: task.id,
      subject: task.subject,
      solution: successComments[0].comment.raw,
      attemptCount: successComments.length,
      timestamp: task.updatedAt
    });
  }
}

return { learnings };
```

Then enhance the prompt:

```javascript
// Node: "Build Prompt with Learnings"
const learnings = $('Query Similar Work Packages').item(0).json.learnings;

let prompt = `... (existing prompt) ...

## Learnings from Similar Tasks

`;

if (learnings.length > 0) {
  learnings.forEach(l => {
    prompt += `### Similar Task: ${l.subject} (Work Package #${l.taskId})
Completed in ${l.attemptCount} attempts
Key patterns that worked:
${l.solution}

`;
  });
} else {
  prompt += `No similar tasks found in history. This is a new pattern.\n`;
}

return { prompt };
```

---

## 📊 OpenProject Custom Fields (NEW)

Add these custom fields to work packages:

| Field Name | Type | Purpose |
|------------|------|---------|
| `LLM_PROVIDER` | Text | Track which LLM was used |
| `LLM_MODEL` | Text | Specific model (e.g., qwen/qwen2.5-7b) |
| `ATTEMPTS_COUNT` | Integer | How many attempts needed |
| `TOTAL_DURATION` | Integer | Total time in seconds |
| `MCP_RUN_IDS` | Text | Comma-separated run IDs |
| `FINAL_STATUS` | Select | success | failure | manual_review |
| `ARTIFACTS_URL` | Text | Link to artifacts |
| `CODE_QUALITY_SCORE` | Integer | 0-100 based on tests/performance |

---

## 🎯 Benefits of This Architecture

### 1. Complete Knowledge Base
- Every attempt, success, and failure documented
- Searchable by keywords, tags, dates
- RAG can query for similar solutions

### 2. Continuous Learning
- AI sees what worked in past similar tasks
- Patterns emerge over time
- Success rate improves with more data

### 3. Team Visibility
- Humans see AI's reasoning
- Can intervene if AI is stuck
- Learn from AI's problem-solving approach

### 4. Compliance & Audit
- Full traceability of all changes
- Know who (AI or human) made what changes
- Timestamps for everything

### 5. Cost Tracking
- Track LLM API costs per task
- See which models work best
- Optimize for cost vs quality

### 6. Performance Analytics
- Average attempts per task type
- Success rate by LLM provider
- Time to completion trends

---

## 📈 Analytics Dashboard (Future)

Query OpenProject API to build dashboards:

- **Success Rate by Task Type**
- **Average Attempts per Feature**
- **LLM Provider Comparison** (Anthropic vs OpenAI vs Qwen)
- **Most Common Failure Patterns**
- **Code Quality Trends**
- **Cost per Feature**

---

## ✅ Implementation Priority

1. **High Priority** (Do first)
   - [ ] Post test results to OpenProject
   - [ ] Post failure analysis to OpenProject
   - [ ] Add artifacts links in comments
   - [ ] Add custom fields (LLM_PROVIDER, ATTEMPTS_COUNT, etc.)

2. **Medium Priority** (Do next)
   - [ ] Query similar work packages for RAG
   - [ ] Enhance prompts with learnings
   - [ ] Archive artifacts to OpenProject attachments
   - [ ] Add performance metrics to comments

3. **Low Priority** (Nice to have)
   - [ ] Build analytics dashboard
   - [ ] Add code quality scoring
   - [ ] Implement cost tracking

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Status:** Ready for implementation
**Key Insight:** OpenProject work packages = Central knowledge base + audit trail
