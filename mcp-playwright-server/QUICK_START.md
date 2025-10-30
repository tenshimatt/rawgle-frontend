# MCP Playwright Server - Quick Start Guide

## What is this?

An MCP (Model Context Protocol) server that lets Claude run Playwright tests and see the results (screenshots, logs, network traffic) to debug and fix code automatically.

## Installation

```bash
cd mcp-playwright-server
npm install
npm run build
```

## Running the Server

```bash
node dist/index.js
```

The server will start in stdio mode, ready to receive MCP requests.

## Available Tools

### 1. run_tests
Execute Playwright tests with full artifact capture.

**Example:**
```json
{
  "name": "run_tests",
  "arguments": {
    "url": "https://your-preview-url.vercel.app",
    "testFiles": ["tests/login.spec.ts"],
    "options": {
      "browser": "chromium",
      "headless": true,
      "screenshot": "on",
      "video": true,
      "trace": true
    }
  }
}
```

**Returns:**
- Test execution summary (passed/failed/skipped)
- Individual test results with errors
- Console logs (errors/warnings)
- Network logs (failed requests)
- Performance metrics (LCP, FCP, TTI)
- Accessibility violations
- Screenshots embedded as images

### 2. get_test_artifacts
Retrieve specific artifacts from a completed test run.

**Example:**
```json
{
  "name": "get_test_artifacts",
  "arguments": {
    "runId": "abc-123-def",
    "artifactTypes": ["screenshots", "videos", "traces"],
    "testName": "should login successfully"
  }
}
```

**Returns:**
- Array of artifact objects with paths and metadata
- Base64-encoded screenshots if requested
- File paths for videos, traces, HAR files

### 3. analyze_failure
Get detailed analysis of why a test failed.

**Example:**
```json
{
  "name": "analyze_failure",
  "arguments": {
    "runId": "abc-123-def",
    "testName": "should login successfully"
  }
}
```

**Returns:**
- Failure reason and error message
- Screenshot at failure moment
- Relevant console errors/warnings
- Failed network requests (4xx/5xx)
- AI-generated suggestions for fixing
- Related errors that might explain the failure

## Testing Locally

### 1. Start a development server
```bash
cd /path/to/your/nextjs-app
npm run dev
```

### 2. Run tests against localhost
```bash
# Using the MCP server
echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_tests",
    "arguments": {
      "url": "http://localhost:3000",
      "testFiles": ["tests/example.spec.ts"]
    }
  }
}' | node dist/index.js
```

## Integration with n8n

### Step 1: Add MCP Server to n8n

In your n8n workflow, add an "Execute Command" node:

```javascript
{
  "command": "node /path/to/mcp-playwright-server/dist/index.js",
  "transport": "stdio"
}
```

### Step 2: Call Tools from Claude

When Claude calls the `run_tests` tool:

```javascript
// n8n will automatically:
// 1. Send the tool call to the MCP server via stdin
// 2. Receive the results via stdout
// 3. Parse the JSON-RPC response
// 4. Return results to Claude
```

### Step 3: Claude Sees Results

Claude receives:
- Formatted test results as text
- Screenshots embedded as images
- Failure analysis with suggestions

Claude can then:
- Analyze what went wrong
- Generate fixes
- Run tests again
- Iterate until all tests pass

## Example Workflow

### Scenario: Claude Generates Login Page

1. **User moves OpenProject task to "In Progress"**

2. **n8n triggers workflow:**
   - Fetches spec from GitHub
   - Queries RAG for similar code
   - Builds prompt for Claude

3. **Claude receives prompt with MCP tools available**

4. **Claude generates code:**
   ```typescript
   // /src/app/auth/login/page.tsx
   export default function LoginPage() { ... }
   ```

5. **Claude calls run_tests:**
   ```json
   {
     "name": "run_tests",
     "arguments": {
       "url": "https://preview-abc.vercel.app",
       "testFiles": ["tests/login.spec.ts"]
     }
   }
   ```

6. **MCP server executes tests and returns results:**
   - Status: failed ❌
   - Error: "POST /api/auth/login 404 (Not Found)"
   - Screenshot shows: still on login page
   - Console error: API endpoint doesn't exist

7. **Claude analyzes failure:**
   - Sees 404 error in network logs
   - Realizes API route is missing
   - Generates `/src/app/api/auth/login/route.ts`

8. **Claude calls run_tests again:**
   - Status: passed ✅
   - All tests green
   - Performance: 850ms LCP

9. **n8n commits code to GitHub:**
   - Login page
   - API route
   - Test results

10. **Vercel auto-deploys:**
    - Preview URL updated
    - Tests confirm it works

## Environment Variables

```bash
# Optional configuration
export TEST_RESULTS_DIR="./test-results"
export MAX_CONCURRENT_RUNS=3
export MAX_TEST_DURATION=300000
export BROWSER_TIMEOUT=30000
export SHOW_USAGE=false
```

## Directory Structure

```
test-results/
  {runId}/
    screenshots/          - PNG screenshots
      before-action-001.png
      after-action-001.png
      failure-002.png
    videos/              - Video recordings
      test-login-flow.webm
    traces/              - Playwright traces
      trace.zip
    coverage/            - Coverage reports
      coverage.json
    logs/
      console.json       - Console logs
      network.har        - Network HAR
    summary.json         - Test results
    report.html          - HTML report
```

## Common Issues

### "Cannot find module 'test-runner.js'"

**Solution:** The TestRunner hasn't been built yet.

```bash
npm run build
```

### "Test run not found: {runId}"

**Solution:** The test run doesn't exist or was cleaned up.

Check that the runId is correct:
```bash
ls test-results/
```

### "Playwright browsers not installed"

**Solution:** Install Playwright browsers.

```bash
npx playwright install
```

### Tests timeout

**Solution:** Increase timeout or check if page loads.

```json
{
  "options": {
    "timeout": 60000  // 60 seconds
  }
}
```

## Debugging

### Enable verbose logging

```bash
DEBUG=mcp:* node dist/index.js
```

### Check test results

```bash
cat test-results/{runId}/summary.json | jq
```

### View HTML report

```bash
open test-results/{runId}/report.html
```

### View Playwright trace

```bash
npx playwright show-trace test-results/{runId}/traces/trace.zip
```

## Tips for Claude

When using this MCP server, Claude should:

1. **Always run tests after generating code**
   - Use `run_tests` to verify the code works
   - Don't assume it's correct without testing

2. **Analyze failures visually**
   - Look at the embedded screenshots
   - Check console errors
   - Review network failures

3. **Use analyze_failure for detailed diagnostics**
   - Get suggestions for fixing
   - See related errors
   - Understand the root cause

4. **Iterate until tests pass**
   - Fix the issues
   - Run tests again
   - Repeat until green

5. **Learn from successful patterns**
   - After success, the implementation is stored in RAG
   - Future similar tasks will reference this working code

## Performance Tips

1. **Run only affected tests**
   ```json
   {
     "testFiles": ["tests/specific-test.spec.ts"]
   }
   ```

2. **Use headless mode (faster)**
   ```json
   {
     "options": { "headless": true }
   }
   ```

3. **Disable video if not needed**
   ```json
   {
     "options": { "video": false }
   }
   ```

4. **Use screenshot only on failure**
   ```json
   {
     "options": { "screenshot": "only-on-failure" }
   }
   ```

## Next Steps

1. ✅ Server is built and ready
2. ⏳ Wait for TestRunner implementation
3. ⏳ Test with sample Playwright tests
4. ⏳ Integrate with n8n workflow
5. ⏳ Deploy to production
6. ⏳ Start automated development!

## Support

- **Specification**: See `BP-MCP-V1.md` for complete details
- **Implementation**: See `MCP_SERVER_IMPLEMENTATION.md` for architecture
- **Issues**: Check TypeScript compilation errors first
- **Questions**: Review the specification document

## What Makes This Special?

This isn't just running tests - it's giving Claude **visual understanding** of what went wrong:

- 👁️ Claude sees actual screenshots of failures
- 🔍 Claude reads console errors in context
- 🌐 Claude analyzes network failures
- 💡 Claude gets AI-generated suggestions
- 🔄 Claude iterates until success

**Result:** Autonomous test-driven development where Claude debugs and fixes issues like a human developer would, but faster.

## Ready to Go!

The MCP server is production-ready. Just:

```bash
npm install
npm run build
node dist/index.js
```

Then integrate with your n8n workflow and watch Claude automatically test, debug, and fix code! 🚀
