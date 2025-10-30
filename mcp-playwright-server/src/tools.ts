/**
 * MCP Tool Definitions for Playwright Test Runner
 *
 * Defines the three core tools exposed to Claude:
 * 1. run_tests - Execute Playwright tests and capture artifacts
 * 2. get_test_artifacts - Retrieve specific artifacts from a test run
 * 3. analyze_failure - Get detailed failure analysis with suggestions
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Tool: run_tests
 *
 * Runs Playwright tests on a URL and returns comprehensive results including:
 * - Test execution summary
 * - Individual test results with artifacts
 * - Console and network logs
 * - Performance metrics
 * - Accessibility violations
 */
export const runTestsTool: Tool = {
  name: 'run_tests',
  description: 'Run Playwright tests on a URL and return comprehensive results with full artifact capture (screenshots, videos, traces, console logs, network logs, performance metrics)',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to test (e.g., Vercel preview URL or localhost URL)'
      },
      testFiles: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of test file paths to execute (relative to project root). If not provided, runs all tests.'
      },
      options: {
        type: 'object',
        description: 'Optional test execution configuration',
        properties: {
          browser: {
            type: 'string',
            enum: ['chromium', 'firefox', 'webkit'],
            default: 'chromium',
            description: 'Browser engine to use for testing'
          },
          headless: {
            type: 'boolean',
            default: true,
            description: 'Run browser in headless mode'
          },
          video: {
            type: 'boolean',
            default: true,
            description: 'Record video of test execution'
          },
          screenshot: {
            type: 'string',
            enum: ['on', 'off', 'only-on-failure'],
            default: 'on',
            description: 'Screenshot capture strategy'
          },
          trace: {
            type: 'boolean',
            default: true,
            description: 'Enable Playwright trace recording for debugging'
          },
          timeout: {
            type: 'number',
            default: 30000,
            description: 'Test timeout in milliseconds'
          }
        }
      }
    },
    required: ['url']
  }
};

/**
 * Tool: get_test_artifacts
 *
 * Retrieves specific artifacts from a completed test run.
 * Useful for getting detailed artifact data after initial test execution.
 */
export const getTestArtifactsTool: Tool = {
  name: 'get_test_artifacts',
  description: 'Retrieve specific artifacts from a test run (screenshots, videos, traces, HAR files, coverage reports)',
  inputSchema: {
    type: 'object',
    properties: {
      runId: {
        type: 'string',
        description: 'The unique run ID from a previous test execution'
      },
      artifactTypes: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['screenshots', 'videos', 'traces', 'har', 'coverage']
        },
        description: 'Types of artifacts to retrieve. If not specified, returns all available artifacts.'
      },
      testName: {
        type: 'string',
        description: 'Optional: filter artifacts by specific test name'
      }
    },
    required: ['runId']
  }
};

/**
 * Tool: analyze_failure
 *
 * Provides detailed analysis of a failed test including:
 * - Failure reason and error messages
 * - Screenshots at failure moment
 * - Console errors and warnings
 * - Network failures and timing issues
 * - DOM snapshot at failure
 * - AI-generated suggestions based on error patterns
 */
export const analyzeFailureTool: Tool = {
  name: 'analyze_failure',
  description: 'Get detailed analysis of why a specific test failed, including screenshots, console logs, network failures, and AI-generated suggestions',
  inputSchema: {
    type: 'object',
    properties: {
      runId: {
        type: 'string',
        description: 'The unique run ID from the test execution'
      },
      testName: {
        type: 'string',
        description: 'The name of the failed test to analyze'
      }
    },
    required: ['runId', 'testName']
  }
};

/**
 * All available tools for the MCP server
 */
export const allTools: Tool[] = [
  runTestsTool,
  getTestArtifactsTool,
  analyzeFailureTool
];
