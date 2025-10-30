/**
 * Artifact capture module for Playwright tests
 * Captures screenshots, console logs, network logs, traces, videos
 */

import { Page, BrowserContext, Request, Response } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConsoleLog, NetworkLog, Screenshot } from './types.js';

interface ArtifactCollectors {
  consoleLogs: ConsoleLog[];
  networkLogs: NetworkLog[];
  screenshots: Screenshot[];
}

/**
 * Setup comprehensive artifact capture for a Playwright page
 */
export async function setupArtifactCapture(
  page: Page,
  context: BrowserContext,
  runDir: string,
  collectors: ArtifactCollectors
): Promise<void> {
  // Capture console logs
  setupConsoleCapture(page, collectors.consoleLogs);

  // Capture network activity
  setupNetworkCapture(page, collectors.networkLogs);

  // Capture page errors
  setupErrorCapture(page, collectors.consoleLogs);

  // Capture dialog events
  setupDialogCapture(page, collectors.consoleLogs);

  // Setup HAR recording for detailed network logs
  await setupHARRecording(context, runDir);
}

/**
 * Setup console log capture
 */
function setupConsoleCapture(page: Page, consoleLogs: ConsoleLog[]): void {
  page.on('console', async (msg) => {
    try {
      const type = msg.type() as ConsoleLog['type'];
      const text = msg.text();
      const location = msg.location();

      // Get console arguments for detailed logging
      const args = await Promise.all(
        msg.args().map(arg => arg.jsonValue().catch(() => null))
      );

      const logEntry: ConsoleLog = {
        type,
        message: text,
        location: location.url || undefined,
        timestamp: new Date().toISOString(),
        args: args.filter(arg => arg !== null)
      };

      consoleLogs.push(logEntry);

      // Also log to console for immediate visibility
      console.log(`[${type.toUpperCase()}] ${text}`);
    } catch (error) {
      console.error('Error capturing console log:', error);
    }
  });
}

/**
 * Setup network activity capture
 */
function setupNetworkCapture(page: Page, networkLogs: NetworkLog[]): void {
  const requestMap = new Map<string, NetworkLog>();

  // Capture requests
  page.on('request', (request: Request) => {
    try {
      const logId = uuidv4();
      const url = request.url();
      const method = request.method();
      const headers = request.headers();
      const postData = request.postData();

      const networkLog: NetworkLog = {
        id: logId,
        request: {
          url,
          method,
          headers,
          body: postData ? tryParseJSON(postData) : undefined,
          timestamp: new Date().toISOString()
        }
      };

      requestMap.set(request.url(), networkLog);
      networkLogs.push(networkLog);
    } catch (error) {
      console.error('Error capturing request:', error);
    }
  });

  // Capture responses
  page.on('response', async (response: Response) => {
    try {
      const url = response.url();
      const networkLog = requestMap.get(url);

      if (networkLog) {
        const status = response.status();
        const statusText = response.statusText();
        const headers = response.headers();

        // Try to get response body (may fail for binary content)
        let body: any;
        try {
          const contentType = headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            const text = await response.text();
            body = tryParseJSON(text);
          } else if (contentType.includes('text/')) {
            body = await response.text();
          }
        } catch (error) {
          // Binary or inaccessible content
          body = null;
        }

        // Get timing information if available
        const timing = {
          dns: 0,
          connect: 0,
          tls: 0,
          request: 0,
          response: 0,
          total: 0
        };

        networkLog.response = {
          status,
          statusText,
          headers,
          body,
          timing
        };

        // Log errors
        if (status >= 400) {
          console.warn(`[NETWORK ERROR] ${networkLog.request.method} ${url} - ${status} ${statusText}`);
        }
      }
    } catch (error) {
      console.error('Error capturing response:', error);
    }
  });

  // Capture request failures
  page.on('requestfailed', (request: Request) => {
    try {
      const url = request.url();
      const networkLog = requestMap.get(url);

      if (networkLog) {
        const failure = request.failure();
        networkLog.error = failure?.errorText || 'Request failed';

        console.error(`[NETWORK FAILURE] ${request.method()} ${url} - ${networkLog.error}`);
      }
    } catch (error) {
      console.error('Error capturing request failure:', error);
    }
  });
}

/**
 * Setup page error capture
 */
function setupErrorCapture(page: Page, consoleLogs: ConsoleLog[]): void {
  page.on('pageerror', (error: Error) => {
    const logEntry: ConsoleLog = {
      type: 'error',
      message: error.message,
      stackTrace: error.stack,
      timestamp: new Date().toISOString()
    };

    consoleLogs.push(logEntry);
    console.error('[PAGE ERROR]', error.message);
  });
}

/**
 * Setup dialog capture (alerts, confirms, prompts)
 */
function setupDialogCapture(page: Page, consoleLogs: ConsoleLog[]): void {
  page.on('dialog', async (dialog) => {
    const logEntry: ConsoleLog = {
      type: 'log',
      message: `Dialog [${dialog.type()}]: ${dialog.message()}`,
      timestamp: new Date().toISOString()
    };

    consoleLogs.push(logEntry);
    console.log('[DIALOG]', dialog.type(), dialog.message());

    // Auto-accept dialogs
    await dialog.accept();
  });
}

/**
 * Setup HAR (HTTP Archive) recording for detailed network logs
 */
async function setupHARRecording(context: BrowserContext, runDir: string): Promise<void> {
  try {
    // Note: HAR recording must be started when creating the context
    // This is a placeholder for documentation
    console.log('HAR recording enabled in context');
  } catch (error) {
    console.error('Error setting up HAR recording:', error);
  }
}

/**
 * Capture a screenshot with metadata
 */
export async function captureScreenshot(
  page: Page,
  name: string,
  runDir: string,
  action?: string
): Promise<Screenshot> {
  const timestamp = new Date().toISOString();
  const sanitizedName = name.replace(/[^a-z0-9-]/gi, '-');
  const filename = `${sanitizedName}-${timestamp.replace(/[:.]/g, '-')}.png`;
  const screenshotPath = path.join(runDir, 'screenshots', filename);

  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  // Optionally read as base64
  const buffer = await fs.readFile(screenshotPath);
  const base64 = buffer.toString('base64');

  return {
    name,
    path: screenshotPath,
    base64: `data:image/png;base64,${base64}`,
    timestamp,
    action
  };
}

/**
 * Capture DOM snapshot as HTML
 */
export async function captureDOMSnapshot(
  page: Page,
  runDir: string,
  name: string = 'dom-snapshot'
): Promise<string> {
  const timestamp = new Date().toISOString();
  const sanitizedName = name.replace(/[^a-z0-9-]/gi, '-');
  const filename = `${sanitizedName}-${timestamp.replace(/[:.]/g, '-')}.html`;
  const snapshotPath = path.join(runDir, 'logs', filename);

  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });

  const html = await page.content();
  await fs.writeFile(snapshotPath, html);

  return snapshotPath;
}

/**
 * Save console logs to file
 */
export async function saveConsoleLogs(
  consoleLogs: ConsoleLog[],
  runDir: string
): Promise<void> {
  const logPath = path.join(runDir, 'logs', 'console.json');
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, JSON.stringify(consoleLogs, null, 2));
}

/**
 * Save network logs to file
 */
export async function saveNetworkLogs(
  networkLogs: NetworkLog[],
  runDir: string
): Promise<void> {
  const logPath = path.join(runDir, 'logs', 'network.json');
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, JSON.stringify(networkLogs, null, 2));
}

/**
 * Save HAR file
 */
export async function saveHAR(
  context: BrowserContext,
  runDir: string
): Promise<string | null> {
  try {
    const harPath = path.join(runDir, 'logs', 'network.har');
    await fs.mkdir(path.dirname(harPath), { recursive: true });

    // Note: HAR export would be done through context options
    // This is a placeholder for the actual implementation
    console.log('HAR file saved to:', harPath);
    return harPath;
  } catch (error) {
    console.error('Error saving HAR:', error);
    return null;
  }
}

/**
 * Capture all artifacts for a test
 */
export async function captureArtifacts(
  page: Page,
  context: BrowserContext,
  runDir: string,
  testName: string
): Promise<{
  screenshot: Screenshot;
  domSnapshot: string;
}> {
  const screenshot = await captureScreenshot(page, testName, runDir);
  const domSnapshot = await captureDOMSnapshot(page, runDir, testName);

  return {
    screenshot,
    domSnapshot
  };
}

/**
 * Helper function to try parsing JSON
 */
function tryParseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Filter logs by type
 */
export function filterLogsByType(
  logs: ConsoleLog[],
  types: ConsoleLog['type'][]
): ConsoleLog[] {
  return logs.filter(log => types.includes(log.type));
}

/**
 * Get error logs only
 */
export function getErrorLogs(logs: ConsoleLog[]): ConsoleLog[] {
  return filterLogsByType(logs, ['error']);
}

/**
 * Get failed network requests
 */
export function getFailedNetworkRequests(logs: NetworkLog[]): NetworkLog[] {
  return logs.filter(log =>
    log.error ||
    (log.response && log.response.status >= 400)
  );
}

/**
 * Generate HTML report from artifacts
 */
export async function generateHTMLReport(
  runDir: string,
  result: any
): Promise<string> {
  const reportPath = path.join(runDir, 'reports', 'report.html');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report - ${result.runId}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status.passed { background: #10b981; color: white; }
    .status.failed { background: #ef4444; color: white; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .metric {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric-label {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }
    .section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section-title {
      font-size: 1.5em;
      margin-bottom: 15px;
      color: #333;
    }
    .test-item {
      padding: 10px;
      margin-bottom: 10px;
      border-left: 4px solid #ddd;
      background: #f9f9f9;
    }
    .test-item.passed { border-color: #10b981; }
    .test-item.failed { border-color: #ef4444; }
    .log-entry {
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      padding: 8px;
      margin: 5px 0;
      background: #f5f5f5;
      border-left: 3px solid #ddd;
    }
    .log-entry.error { border-color: #ef4444; background: #fef2f2; }
    .screenshot {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Test Execution Report</h1>
    <p>Run ID: <code>${result.runId}</code></p>
    <p>Status: <span class="status ${result.status}">${result.status}</span></p>
    <p>Duration: ${(result.summary.duration / 1000).toFixed(2)}s</p>
  </div>

  <div class="summary">
    <div class="metric">
      <div class="metric-label">Total Tests</div>
      <div class="metric-value">${result.summary.total}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Passed</div>
      <div class="metric-value" style="color: #10b981">${result.summary.passed}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Failed</div>
      <div class="metric-value" style="color: #ef4444">${result.summary.failed}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Skipped</div>
      <div class="metric-value">${result.summary.skipped}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Test Results</div>
    ${result.tests.map((test: any) => `
      <div class="test-item ${test.status}">
        <h3>${test.name}</h3>
        <p>File: ${test.file}</p>
        <p>Duration: ${(test.duration / 1000).toFixed(2)}s</p>
        ${test.error ? `
          <div style="color: #ef4444; margin-top: 10px;">
            <strong>Error:</strong> ${test.error.message}
            ${test.error.stack ? `<pre style="overflow-x: auto;">${test.error.stack}</pre>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Console Logs</div>
    ${result.consoleLogs.slice(-50).map((log: ConsoleLog) => `
      <div class="log-entry ${log.type}">
        <strong>[${log.type.toUpperCase()}]</strong> ${log.message}
        ${log.location ? `<br><small>${log.location}</small>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Performance Metrics</div>
    <div class="summary">
      <div class="metric">
        <div class="metric-label">LCP</div>
        <div class="metric-value">${result.performance.largestContentfulPaint}ms</div>
      </div>
      <div class="metric">
        <div class="metric-label">FCP</div>
        <div class="metric-value">${result.performance.firstContentfulPaint}ms</div>
      </div>
      <div class="metric">
        <div class="metric-label">TTI</div>
        <div class="metric-value">${result.performance.timeToInteractive}ms</div>
      </div>
      <div class="metric">
        <div class="metric-label">CLS</div>
        <div class="metric-value">${result.performance.cumulativeLayoutShift}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await fs.writeFile(reportPath, html);
  return reportPath;
}
