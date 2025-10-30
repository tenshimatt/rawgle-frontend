/**
 * Type definitions for MCP Playwright Test Runner
 */

export interface TestRunOptions {
  url: string;
  testFiles?: string[];
  browser?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  video?: boolean;
  screenshot?: 'on' | 'off' | 'only-on-failure';
  trace?: boolean;
  timeout?: number;
}

export interface TestRunResult {
  runId: string;
  status: 'passed' | 'failed' | 'timedout' | 'build-failed';
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    startTime: string;
    endTime: string;
  };
  tests: TestResult[];
  consoleLogs: ConsoleLog[];
  networkLogs: NetworkLog[];
  coverage?: CoverageReport;
  performance: PerformanceMetrics;
  accessibility?: AccessibilityReport;
  artifacts: {
    screenshotsDir: string;
    videosDir: string;
    tracesDir: string;
    reportsDir: string;
    reportUrl?: string;
  };
}

export interface TestResult {
  name: string;
  file: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedout';
  duration: number;
  retries: number;
  error?: {
    message: string;
    stack: string;
    location?: {
      file: string;
      line: number;
      column: number;
    };
  };
  artifacts: {
    screenshots: Screenshot[];
    video?: string;
    trace?: string;
  };
  steps?: TestStep[];
}

export interface Screenshot {
  name: string;
  path: string;
  base64?: string;
  timestamp: string;
  action?: string;
}

export interface TestStep {
  title: string;
  duration: number;
  error?: string;
}

export interface ConsoleLog {
  type: 'log' | 'info' | 'warning' | 'error' | 'debug';
  message: string;
  location?: string;
  stackTrace?: string;
  timestamp: string;
  args?: any[];
}

export interface NetworkLog {
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
    timing?: {
      dns: number;
      connect: number;
      tls: number;
      request: number;
      response: number;
      total: number;
    };
  };
  error?: string;
}

export interface CoverageReport {
  total: number;
  byFile: Record<string, {
    covered: number;
    uncovered: number[];
    branches: {
      covered: number;
      total: number;
    };
  }>;
}

export interface PerformanceMetrics {
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

export interface AccessibilityReport {
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  score?: number;
}

export interface AccessibilityViolation {
  rule: string;
  element: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  message: string;
  helpUrl: string;
  html?: string;
}

export interface TestArtifact {
  runId: string;
  testName: string;
  type: 'screenshot' | 'video' | 'trace' | 'har' | 'coverage';
  path: string;
  base64?: string;
  metadata?: Record<string, any>;
}

export interface FailureAnalysis {
  testName: string;
  failureReason: string;
  screenshot?: string;
  consoleLogs: ConsoleLog[];
  networkFailures: NetworkLog[];
  domSnapshot?: string;
  suggestions: string[];
  relatedErrors: string[];
}
