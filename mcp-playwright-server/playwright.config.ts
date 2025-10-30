import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for MCP test runner
 * Configured to capture ALL artifacts for LLM analysis
 */
export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Maximum time for entire test suite
  globalTimeout: 5 * 60 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { open: 'never', outputFolder: 'test-results/html-report' }],
    ['list']
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for tests
    baseURL: process.env.TEST_URL || 'http://localhost:3005',

    // Collect trace on failure for debugging
    trace: 'on',

    // Take screenshot on failure
    screenshot: 'on',

    // Record video on failure
    video: 'on',

    // Maximum time each action can take
    actionTimeout: 10 * 1000,

    // Maximum time for page navigation
    navigationTimeout: 30 * 1000,

    // Capture console logs
    launchOptions: {
      args: ['--enable-logging', '--v=1']
    }
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable coverage collection
        contextOptions: {
          recordVideo: {
            dir: 'test-results/videos',
            size: { width: 1280, height: 720 }
          }
        }
      }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] }
    }
  ],

  // Run local dev server before starting tests
  webServer: process.env.START_DEV_SERVER === 'true' ? {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  } : undefined
});
