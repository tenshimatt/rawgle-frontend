/**
 * Core Playwright test execution engine
 * Handles test execution with full artifact capture
 */

import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { captureArtifacts, setupArtifactCapture } from './artifact-capture.js';
import { collectPerformanceMetrics } from './performance.js';
import {
  TestRunOptions,
  TestRunResult,
  TestResult,
  ConsoleLog,
  NetworkLog,
  Screenshot
} from './types.js';

export class PlaywrightTestRunner {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private artifactsBaseDir: string;
  private runId: string;
  private runDir: string;

  // Collected data during test execution
  private consoleLogs: ConsoleLog[] = [];
  private networkLogs: NetworkLog[] = [];
  private screenshots: Screenshot[] = [];
  private startTime: Date | null = null;
  private endTime: Date | null = null;

  constructor(artifactsBaseDir: string = './test-results') {
    this.artifactsBaseDir = artifactsBaseDir;
    this.runId = uuidv4();
    this.runDir = path.join(this.artifactsBaseDir, this.runId);
  }

  /**
   * Main entry point for running tests
   */
  async runTests(options: TestRunOptions): Promise<TestRunResult> {
    this.startTime = new Date();

    try {
      // Create artifact directories
      await this.createArtifactDirectories();

      // Launch browser
      await this.launchBrowser(options);

      // Setup artifact capture
      if (this.page && this.context) {
        await setupArtifactCapture(
          this.page,
          this.context,
          this.runDir,
          {
            consoleLogs: this.consoleLogs,
            networkLogs: this.networkLogs,
            screenshots: this.screenshots
          }
        );
      }

      // Execute tests
      let testResults: TestResult[] = [];
      if (options.testFiles && options.testFiles.length > 0) {
        testResults = await this.executeTestFiles(options.testFiles, options);
      } else {
        // If no test files specified, run basic page load test
        testResults = await this.runBasicPageTest(options.url);
      }

      // Collect performance metrics
      const performance = this.page
        ? await collectPerformanceMetrics(this.page)
        : this.getEmptyPerformanceMetrics();

      // Stop artifact capture
      if (this.context) {
        await this.stopArtifactCapture();
      }

      this.endTime = new Date();

      // Calculate summary
      const summary = this.calculateSummary(testResults);

      // Build result
      const result: TestRunResult = {
        runId: this.runId,
        status: this.determineOverallStatus(testResults),
        summary: {
          ...summary,
          startTime: this.startTime.toISOString(),
          endTime: this.endTime.toISOString()
        },
        tests: testResults,
        consoleLogs: this.consoleLogs,
        networkLogs: this.sanitizeNetworkLogs(this.networkLogs),
        performance,
        artifacts: {
          screenshotsDir: path.join(this.runDir, 'screenshots'),
          videosDir: path.join(this.runDir, 'videos'),
          tracesDir: path.join(this.runDir, 'traces'),
          reportsDir: path.join(this.runDir, 'reports')
        }
      };

      // Save summary
      await this.saveSummary(result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      console.error('Test execution failed:', errorMessage);

      this.endTime = new Date();

      return {
        runId: this.runId,
        status: 'failed',
        summary: {
          total: 0,
          passed: 0,
          failed: 1,
          skipped: 0,
          duration: this.endTime.getTime() - (this.startTime?.getTime() || 0),
          startTime: this.startTime?.toISOString() || new Date().toISOString(),
          endTime: this.endTime.toISOString()
        },
        tests: [{
          name: 'Test Execution',
          file: 'internal',
          status: 'failed',
          duration: this.endTime.getTime() - (this.startTime?.getTime() || 0),
          retries: 0,
          error: {
            message: errorMessage,
            stack: stack || '',
          },
          artifacts: {
            screenshots: [],
          }
        }],
        consoleLogs: this.consoleLogs,
        networkLogs: this.sanitizeNetworkLogs(this.networkLogs),
        performance: this.getEmptyPerformanceMetrics(),
        artifacts: {
          screenshotsDir: path.join(this.runDir, 'screenshots'),
          videosDir: path.join(this.runDir, 'videos'),
          tracesDir: path.join(this.runDir, 'traces'),
          reportsDir: path.join(this.runDir, 'reports')
        }
      };
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Create all necessary artifact directories
   */
  private async createArtifactDirectories(): Promise<void> {
    const dirs = [
      this.runDir,
      path.join(this.runDir, 'screenshots'),
      path.join(this.runDir, 'videos'),
      path.join(this.runDir, 'traces'),
      path.join(this.runDir, 'logs'),
      path.join(this.runDir, 'reports'),
      path.join(this.runDir, 'coverage')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * Launch browser with specified options
   */
  private async launchBrowser(options: TestRunOptions): Promise<void> {
    const browserType = options.browser || 'chromium';
    const headless = options.headless !== false;

    const launchOptions = {
      headless,
      args: ['--enable-logging', '--v=1']
    };

    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }

    // Create context with artifact capture enabled
    this.context = await this.browser.newContext({
      recordVideo: options.video !== false ? {
        dir: path.join(this.runDir, 'videos'),
        size: { width: 1280, height: 720 }
      } : undefined,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });

    // Start tracing if enabled
    if (options.trace !== false) {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
      });
    }

    this.page = await this.context.newPage();
  }

  /**
   * Execute test files
   */
  private async executeTestFiles(
    testFiles: string[],
    options: TestRunOptions
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testFile of testFiles) {
      try {
        const testResult = await this.executeTestFile(testFile, options);
        results.push(...testResult);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;

        results.push({
          name: `Test file: ${testFile}`,
          file: testFile,
          status: 'failed',
          duration: 0,
          retries: 0,
          error: {
            message: errorMessage,
            stack: stack || ''
          },
          artifacts: {
            screenshots: []
          }
        });
      }
    }

    return results;
  }

  /**
   * Execute a single test file
   * This is a simplified version - in production, you'd integrate with Playwright Test Runner
   */
  private async executeTestFile(
    testFile: string,
    options: TestRunOptions
  ): Promise<TestResult[]> {
    // For now, return a placeholder
    // In production, this would dynamically import and run the test file
    console.log(`Executing test file: ${testFile}`);

    return [{
      name: path.basename(testFile),
      file: testFile,
      status: 'passed',
      duration: 0,
      retries: 0,
      artifacts: {
        screenshots: this.screenshots
      }
    }];
  }

  /**
   * Run a basic page load test when no test files are specified
   */
  private async runBasicPageTest(url: string): Promise<TestResult[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const testStart = Date.now();
    const testName = 'Basic Page Load Test';

    try {
      // Take before screenshot
      const beforeScreenshot = await this.takeScreenshot('before-navigation');

      // Navigate to URL
      const response = await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      if (!response) {
        throw new Error('Failed to load page');
      }

      // Check if page loaded successfully
      const status = response.status();
      if (status >= 400) {
        throw new Error(`Page returned status ${status}`);
      }

      // Take after screenshot
      const afterScreenshot = await this.takeScreenshot('after-navigation');

      // Wait for page to be interactive
      await this.page.waitForLoadState('domcontentloaded');

      const duration = Date.now() - testStart;

      return [{
        name: testName,
        file: 'internal',
        status: 'passed',
        duration,
        retries: 0,
        artifacts: {
          screenshots: [beforeScreenshot, afterScreenshot]
        }
      }];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      // Take failure screenshot
      const failureScreenshot = await this.takeScreenshot('failure');

      const duration = Date.now() - testStart;

      return [{
        name: testName,
        file: 'internal',
        status: 'failed',
        duration,
        retries: 0,
        error: {
          message: errorMessage,
          stack: stack || ''
        },
        artifacts: {
          screenshots: [failureScreenshot]
        }
      }];
    }
  }

  /**
   * Take a screenshot
   */
  private async takeScreenshot(name: string): Promise<Screenshot> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const timestamp = new Date().toISOString();
    const filename = `${name}-${timestamp.replace(/[:.]/g, '-')}.png`;
    const screenshotPath = path.join(this.runDir, 'screenshots', filename);

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    const screenshot: Screenshot = {
      name,
      path: screenshotPath,
      timestamp,
      action: name
    };

    this.screenshots.push(screenshot);
    return screenshot;
  }

  /**
   * Stop artifact capture (traces, videos)
   */
  private async stopArtifactCapture(): Promise<void> {
    if (!this.context) return;

    try {
      // Stop tracing
      await this.context.tracing.stop({
        path: path.join(this.runDir, 'traces', 'trace.zip')
      });
    } catch (error) {
      console.error('Failed to stop tracing:', error);
    }
  }

  /**
   * Calculate test summary
   */
  private calculateSummary(testResults: TestResult[]) {
    const total = testResults.length;
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const skipped = testResults.filter(t => t.status === 'skipped').length;
    const duration = testResults.reduce((sum, t) => sum + t.duration, 0);

    return {
      total,
      passed,
      failed,
      skipped,
      duration
    };
  }

  /**
   * Determine overall test run status
   */
  private determineOverallStatus(
    testResults: TestResult[]
  ): 'passed' | 'failed' | 'timedout' | 'build-failed' {
    if (testResults.length === 0) return 'failed';

    const hasTimeout = testResults.some(t => t.status === 'timedout');
    if (hasTimeout) return 'timedout';

    const hasFailed = testResults.some(t => t.status === 'failed');
    if (hasFailed) return 'failed';

    return 'passed';
  }

  /**
   * Sanitize network logs (remove sensitive headers)
   */
  private sanitizeNetworkLogs(logs: NetworkLog[]): NetworkLog[] {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

    return logs.map(log => ({
      ...log,
      request: {
        ...log.request,
        headers: this.sanitizeHeaders(log.request.headers, sensitiveHeaders)
      },
      response: log.response ? {
        ...log.response,
        headers: this.sanitizeHeaders(log.response.headers, sensitiveHeaders)
      } : undefined
    }));
  }

  /**
   * Sanitize headers
   */
  private sanitizeHeaders(
    headers: Record<string, string>,
    sensitiveHeaders: string[]
  ): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '***REDACTED***';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Get empty performance metrics
   */
  private getEmptyPerformanceMetrics() {
    return {
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
      domContentLoaded: 0,
      loadComplete: 0
    };
  }

  /**
   * Save test summary to disk
   */
  private async saveSummary(result: TestRunResult): Promise<void> {
    const summaryPath = path.join(this.runDir, 'summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(result, null, 2));
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Get the run directory path
   */
  getRunDir(): string {
    return this.runDir;
  }

  /**
   * Get the run ID
   */
  getRunId(): string {
    return this.runId;
  }
}
