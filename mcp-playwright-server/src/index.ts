#!/usr/bin/env node
/**
 * MCP Playwright Test Runner - Main Entry Point
 *
 * This is the entry point for the MCP server that provides Playwright testing
 * capabilities to Claude via the Model Context Protocol (MCP).
 *
 * The server uses stdio transport for communication with n8n or other MCP clients.
 *
 * Usage:
 *   node dist/index.js
 *
 * The server exposes three main tools:
 * 1. run_tests - Execute Playwright tests with full artifact capture
 * 2. get_test_artifacts - Retrieve specific test artifacts
 * 3. analyze_failure - Get detailed failure analysis with suggestions
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PlaywrightMCPServer } from './server.js';

/**
 * Main server initialization
 */
async function main() {
  try {
    // Create the MCP server instance
    const mcpServer = new PlaywrightMCPServer();

    // Create stdio transport for n8n integration
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    await mcpServer.getServer().connect(transport);

    // Log startup (to stderr to avoid interfering with stdio protocol)
    console.error('MCP Playwright Test Runner started successfully');
    console.error('Server Name: playwright-test-runner');
    console.error('Version: 1.0.0');
    console.error('Transport: stdio');
    console.error('Available Tools:');
    console.error('  - run_tests: Execute Playwright tests with artifact capture');
    console.error('  - get_test_artifacts: Retrieve test artifacts');
    console.error('  - analyze_failure: Analyze failed tests with suggestions');
    console.error('');
    console.error('Server ready for MCP requests...');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('\nReceived SIGINT, shutting down gracefully...');
      await gracefulShutdown(mcpServer);
    });

    process.on('SIGTERM', async () => {
      console.error('\nReceived SIGTERM, shutting down gracefully...');
      await gracefulShutdown(mcpServer);
    });

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      console.error('Stack:', error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise);
      console.error('Reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start MCP Playwright Test Runner:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(server: PlaywrightMCPServer) {
  try {
    console.error('Closing MCP server connection...');
    await server.getServer().close();
    console.error('Server closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

/**
 * Validate environment and dependencies
 */
async function validateEnvironment() {
  // Check Node version
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

  if (majorVersion < 18) {
    throw new Error(`Node.js version 18 or higher is required. Current version: ${nodeVersion}`);
  }

  // Check if Playwright browsers are installed
  try {
    const { execSync } = await import('child_process');
    execSync('npx playwright --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('Warning: Playwright may not be properly installed');
    console.error('Run: npx playwright install');
  }

  console.error('Environment validation passed');
}

/**
 * Display usage information
 */
function displayUsage() {
  console.error('');
  console.error('MCP Playwright Test Runner');
  console.error('==========================');
  console.error('');
  console.error('Usage:');
  console.error('  node dist/index.js');
  console.error('');
  console.error('Environment Variables:');
  console.error('  TEST_RESULTS_DIR - Directory for test artifacts (default: ./test-results)');
  console.error('  MAX_CONCURRENT_RUNS - Maximum concurrent test runs (default: 3)');
  console.error('  MAX_TEST_DURATION - Maximum test duration in ms (default: 300000)');
  console.error('  BROWSER_TIMEOUT - Browser timeout in ms (default: 30000)');
  console.error('');
  console.error('Available Tools:');
  console.error('  run_tests(url, testFiles?, options?)');
  console.error('    - Execute Playwright tests with full artifact capture');
  console.error('    - Returns: TestRunResult with screenshots, videos, traces, logs');
  console.error('');
  console.error('  get_test_artifacts(runId, artifactTypes?, testName?)');
  console.error('    - Retrieve specific artifacts from a test run');
  console.error('    - Returns: Array of TestArtifact objects');
  console.error('');
  console.error('  analyze_failure(runId, testName)');
  console.error('    - Analyze a failed test with detailed diagnostics');
  console.error('    - Returns: FailureAnalysis with suggestions');
  console.error('');
  console.error('For more information, see: BP-MCP-V1.md');
  console.error('');
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  // Validate environment before starting
  validateEnvironment()
    .then(() => {
      // Display usage information on startup
      if (process.env.SHOW_USAGE !== 'false') {
        displayUsage();
      }

      // Start the main server
      return main();
    })
    .catch((error) => {
      console.error('Startup failed:', error);
      process.exit(1);
    });
}

// Export for testing
export { main, gracefulShutdown, validateEnvironment };
