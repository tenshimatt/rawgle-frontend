/**
 * MCP Server Implementation for Playwright Test Runner
 *
 * This server exposes three main tools to Claude:
 * 1. run_tests - Execute tests with full artifact capture
 * 2. get_test_artifacts - Retrieve specific artifacts
 * 3. analyze_failure - Detailed failure analysis
 *
 * Uses stdio transport for n8n integration.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { allTools } from './tools.js';
import {
  TestRunOptions,
  TestRunResult,
  TestArtifact,
  FailureAnalysis,
  ConsoleLog,
  NetworkLog,
  Screenshot
} from './types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * MCP Playwright Server
 *
 * Provides comprehensive test execution and artifact capture capabilities
 * for LLM-driven test-driven development workflows.
 */
export class PlaywrightMCPServer {
  private server: Server;
  private testRunsDir: string;

  constructor() {
    this.server = new Server(
      {
        name: 'playwright-test-runner',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.testRunsDir = path.join(process.cwd(), 'test-results');
    this.setupHandlers();
  }

  /**
   * Set up request handlers for MCP protocol
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'run_tests':
            return await this.handleRunTests(args);

          case 'get_test_artifacts':
            return await this.handleGetTestArtifacts(args);

          case 'analyze_failure':
            return await this.handleAnalyzeFailure(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  /**
   * Handle run_tests tool execution
   *
   * Executes Playwright tests and returns comprehensive results with artifacts.
   * Note: This handler prepares the response format. The actual test execution
   * is delegated to the TestRunner class (built by another agent).
   */
  private async handleRunTests(args: any) {
    // Validate required arguments
    if (!args.url || typeof args.url !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Missing or invalid required parameter: url'
      );
    }

    // Build test run options
    const options: TestRunOptions = {
      url: args.url,
      testFiles: args.testFiles || [],
      browser: args.options?.browser || 'chromium',
      headless: args.options?.headless ?? true,
      video: args.options?.video ?? true,
      screenshot: args.options?.screenshot || 'on',
      trace: args.options?.trace ?? true,
      timeout: args.options?.timeout || 30000
    };

    // Import TestRunner dynamically to avoid circular dependencies
    let PlaywrightTestRunner: any;
    try {
      const testRunnerModule = await import('./test-runner.js');
      PlaywrightTestRunner = testRunnerModule.PlaywrightTestRunner;
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load PlaywrightTestRunner: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Execute tests using PlaywrightTestRunner
    const runner = new PlaywrightTestRunner();
    const result: TestRunResult = await runner.runTests(options);

    // Format response with both text and image content
    const content: any[] = [
      {
        type: 'text',
        text: this.formatTestResultsText(result)
      }
    ];

    // Include screenshots as embedded images for Claude to see
    if (result.tests && result.tests.length > 0) {
      for (const test of result.tests) {
        if (test.artifacts?.screenshots) {
          for (const screenshot of test.artifacts.screenshots) {
            if (screenshot.base64) {
              content.push({
                type: 'image',
                data: screenshot.base64,
                mimeType: 'image/png'
              });
            }
          }
        }
      }
    }

    return {
      content
    };
  }

  /**
   * Handle get_test_artifacts tool execution
   *
   * Retrieves specific artifacts from a completed test run.
   */
  private async handleGetTestArtifacts(args: any) {
    // Validate required arguments
    if (!args.runId || typeof args.runId !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Missing or invalid required parameter: runId'
      );
    }

    const runDir = path.join(this.testRunsDir, args.runId);

    // Verify run directory exists
    try {
      await fs.access(runDir);
    } catch {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Test run not found: ${args.runId}`
      );
    }

    // Load test results summary
    const summaryPath = path.join(runDir, 'summary.json');
    let summary: TestRunResult;

    try {
      const summaryContent = await fs.readFile(summaryPath, 'utf-8');
      summary = JSON.parse(summaryContent);
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load test results: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Determine which artifacts to retrieve
    const requestedTypes = args.artifactTypes || ['screenshots', 'videos', 'traces', 'har', 'coverage'];
    const artifacts: TestArtifact[] = [];

    // Filter by test name if specified
    const testsToProcess = args.testName
      ? summary.tests.filter(t => t.name === args.testName)
      : summary.tests;

    // Collect requested artifacts
    for (const test of testsToProcess) {
      // Screenshots
      if (requestedTypes.includes('screenshots') && test.artifacts?.screenshots) {
        for (const screenshot of test.artifacts.screenshots) {
          artifacts.push({
            runId: args.runId,
            testName: test.name,
            type: 'screenshot',
            path: screenshot.path,
            base64: screenshot.base64,
            metadata: {
              timestamp: screenshot.timestamp,
              action: screenshot.action
            }
          });
        }
      }

      // Videos
      if (requestedTypes.includes('videos') && test.artifacts?.video) {
        artifacts.push({
          runId: args.runId,
          testName: test.name,
          type: 'video',
          path: test.artifacts.video
        });
      }

      // Traces
      if (requestedTypes.includes('traces') && test.artifacts?.trace) {
        artifacts.push({
          runId: args.runId,
          testName: test.name,
          type: 'trace',
          path: test.artifacts.trace
        });
      }
    }

    // HAR files (network logs)
    if (requestedTypes.includes('har')) {
      const harPath = path.join(runDir, 'logs', 'network.har');
      try {
        await fs.access(harPath);
        artifacts.push({
          runId: args.runId,
          testName: 'all',
          type: 'har',
          path: harPath
        });
      } catch {
        // HAR file doesn't exist, skip
      }
    }

    // Coverage reports
    if (requestedTypes.includes('coverage') && summary.coverage) {
      const coveragePath = path.join(runDir, 'coverage', 'coverage.json');
      try {
        await fs.access(coveragePath);
        artifacts.push({
          runId: args.runId,
          testName: 'all',
          type: 'coverage',
          path: coveragePath,
          metadata: summary.coverage
        });
      } catch {
        // Coverage file doesn't exist, skip
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            runId: args.runId,
            artifactCount: artifacts.length,
            artifacts
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handle analyze_failure tool execution
   *
   * Provides detailed analysis of a failed test with suggestions.
   */
  private async handleAnalyzeFailure(args: any) {
    // Validate required arguments
    if (!args.runId || typeof args.runId !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Missing or invalid required parameter: runId'
      );
    }

    if (!args.testName || typeof args.testName !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Missing or invalid required parameter: testName'
      );
    }

    const runDir = path.join(this.testRunsDir, args.runId);

    // Load test results
    const summaryPath = path.join(runDir, 'summary.json');
    let summary: TestRunResult;

    try {
      const summaryContent = await fs.readFile(summaryPath, 'utf-8');
      summary = JSON.parse(summaryContent);
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load test results: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Find the failed test
    const failedTest = summary.tests.find(t => t.name === args.testName);

    if (!failedTest) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Test not found: ${args.testName}`
      );
    }

    if (failedTest.status !== 'failed') {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Test did not fail: ${args.testName} (status: ${failedTest.status})`
      );
    }

    // Build failure analysis
    const analysis: FailureAnalysis = {
      testName: failedTest.name,
      failureReason: failedTest.error?.message || 'Unknown failure',
      screenshot: failedTest.artifacts?.screenshots?.[0]?.base64,
      consoleLogs: this.filterRelevantLogs(summary.consoleLogs, failedTest),
      networkFailures: this.filterFailedRequests(summary.networkLogs),
      domSnapshot: undefined, // Will be populated by TestRunner if available
      suggestions: this.generateSuggestions(failedTest, summary),
      relatedErrors: this.findRelatedErrors(failedTest, summary)
    };

    // Include screenshot in response if available
    const content: any[] = [
      {
        type: 'text',
        text: this.formatFailureAnalysisText(analysis)
      }
    ];

    if (analysis.screenshot) {
      content.push({
        type: 'image',
        data: analysis.screenshot,
        mimeType: 'image/png'
      });
    }

    return { content };
  }

  /**
   * Format test results as human-readable text
   */
  private formatTestResultsText(result: TestRunResult): string {
    let text = `# Test Run Results\n\n`;
    text += `**Run ID:** ${result.runId}\n`;
    text += `**Status:** ${result.status}\n\n`;

    text += `## Summary\n`;
    text += `- Total: ${result.summary.total}\n`;
    text += `- Passed: ${result.summary.passed}\n`;
    text += `- Failed: ${result.summary.failed}\n`;
    text += `- Skipped: ${result.summary.skipped}\n`;
    text += `- Duration: ${result.summary.duration}ms\n\n`;

    if (result.tests && result.tests.length > 0) {
      text += `## Test Details\n\n`;
      for (const test of result.tests) {
        text += `### ${test.name}\n`;
        text += `- Status: ${test.status}\n`;
        text += `- Duration: ${test.duration}ms\n`;

        if (test.error) {
          text += `- Error: ${test.error.message}\n`;
          if (test.error.location) {
            text += `- Location: ${test.error.location.file}:${test.error.location.line}\n`;
          }
        }

        if (test.artifacts?.screenshots?.length) {
          text += `- Screenshots: ${test.artifacts.screenshots.length}\n`;
        }

        text += `\n`;
      }
    }

    if (result.consoleLogs && result.consoleLogs.length > 0) {
      const errorLogs = result.consoleLogs.filter(l => l.type === 'error');
      if (errorLogs.length > 0) {
        text += `## Console Errors\n\n`;
        for (const log of errorLogs.slice(0, 10)) {
          text += `- ${log.message}\n`;
        }
        text += `\n`;
      }
    }

    if (result.performance) {
      text += `## Performance Metrics\n`;
      if (result.performance.largestContentfulPaint) {
        text += `- LCP: ${result.performance.largestContentfulPaint}ms\n`;
      }
      if (result.performance.firstContentfulPaint) {
        text += `- FCP: ${result.performance.firstContentfulPaint}ms\n`;
      }
      if (result.performance.timeToInteractive) {
        text += `- TTI: ${result.performance.timeToInteractive}ms\n`;
      }
      text += `\n`;
    }

    text += `## Artifacts\n`;
    text += `- Screenshots: ${result.artifacts.screenshotsDir}\n`;
    text += `- Videos: ${result.artifacts.videosDir}\n`;
    text += `- Traces: ${result.artifacts.tracesDir}\n`;
    if (result.artifacts.reportUrl) {
      text += `- HTML Report: ${result.artifacts.reportUrl}\n`;
    }

    return text;
  }

  /**
   * Format failure analysis as human-readable text
   */
  private formatFailureAnalysisText(analysis: FailureAnalysis): string {
    let text = `# Failure Analysis: ${analysis.testName}\n\n`;

    text += `## Failure Reason\n${analysis.failureReason}\n\n`;

    if (analysis.consoleLogs.length > 0) {
      text += `## Console Logs (Errors & Warnings)\n`;
      for (const log of analysis.consoleLogs) {
        text += `- [${log.type}] ${log.message}\n`;
      }
      text += `\n`;
    }

    if (analysis.networkFailures.length > 0) {
      text += `## Network Failures\n`;
      for (const req of analysis.networkFailures) {
        text += `- ${req.request.method} ${req.request.url}\n`;
        if (req.response) {
          text += `  Status: ${req.response.status} ${req.response.statusText}\n`;
        }
        if (req.error) {
          text += `  Error: ${req.error}\n`;
        }
      }
      text += `\n`;
    }

    if (analysis.suggestions.length > 0) {
      text += `## Suggestions\n`;
      for (const suggestion of analysis.suggestions) {
        text += `- ${suggestion}\n`;
      }
      text += `\n`;
    }

    if (analysis.relatedErrors.length > 0) {
      text += `## Related Errors\n`;
      for (const error of analysis.relatedErrors) {
        text += `- ${error}\n`;
      }
    }

    return text;
  }

  /**
   * Filter console logs to only relevant errors/warnings near the failure
   */
  private filterRelevantLogs(logs: ConsoleLog[], test: any): ConsoleLog[] {
    return logs.filter(log =>
      log.type === 'error' || log.type === 'warning'
    ).slice(-20); // Last 20 errors/warnings
  }

  /**
   * Filter network logs to only failed requests
   */
  private filterFailedRequests(logs: NetworkLog[]): NetworkLog[] {
    return logs.filter(log =>
      log.error ||
      (log.response && log.response.status >= 400)
    ).slice(-10); // Last 10 failures
  }

  /**
   * Generate suggestions based on error patterns
   */
  private generateSuggestions(test: any, summary: TestRunResult): string[] {
    const suggestions: string[] = [];
    const errorMessage = test.error?.message?.toLowerCase() || '';

    // Timeout errors
    if (errorMessage.includes('timeout')) {
      suggestions.push('Consider increasing the timeout value for slow operations');
      suggestions.push('Check if the element selector is correct and the element exists');
      suggestions.push('Verify that async operations are completing before the next step');
    }

    // Selector errors
    if (errorMessage.includes('selector') || errorMessage.includes('locator')) {
      suggestions.push('Verify the element selector is correct and unique');
      suggestions.push('Check if the element is visible and not hidden by CSS');
      suggestions.push('Wait for the element to be available before interacting');
    }

    // Network errors
    const networkErrors = summary.networkLogs.filter(l =>
      l.error || (l.response && l.response.status >= 400)
    );
    if (networkErrors.length > 0) {
      suggestions.push('Check API endpoint availability and CORS configuration');
      suggestions.push('Verify authentication tokens and request headers');
      suggestions.push('Review network logs for failed requests');
    }

    // Console errors
    const consoleErrors = summary.consoleLogs.filter(l => l.type === 'error');
    if (consoleErrors.length > 0) {
      suggestions.push('Review console errors for JavaScript exceptions');
      suggestions.push('Check for missing dependencies or imports');
    }

    // Navigation errors
    if (errorMessage.includes('navigation') || errorMessage.includes('page')) {
      suggestions.push('Verify the URL is correct and accessible');
      suggestions.push('Check for redirect issues or authentication requirements');
      suggestions.push('Ensure the page loads completely before testing');
    }

    // Add generic suggestion if no specific ones
    if (suggestions.length === 0) {
      suggestions.push('Review the test implementation and error stack trace');
      suggestions.push('Check if the test assumptions match the actual page behavior');
    }

    return suggestions;
  }

  /**
   * Find related errors in console logs that might explain the failure
   */
  private findRelatedErrors(test: any, summary: TestRunResult): string[] {
    const errors: string[] = [];

    // Get console errors
    const consoleErrors = summary.consoleLogs
      .filter(l => l.type === 'error')
      .slice(-5);

    for (const log of consoleErrors) {
      errors.push(`Console: ${log.message}`);
    }

    // Get network failures
    const networkFailures = summary.networkLogs
      .filter(l => l.error || (l.response && l.response.status >= 400))
      .slice(-3);

    for (const log of networkFailures) {
      if (log.error) {
        errors.push(`Network: ${log.request.url} - ${log.error}`);
      } else if (log.response) {
        errors.push(`Network: ${log.request.url} - ${log.response.status} ${log.response.statusText}`);
      }
    }

    return errors;
  }

  /**
   * Get the underlying Server instance
   */
  getServer(): Server {
    return this.server;
  }
}
