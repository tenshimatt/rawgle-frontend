# RAWGLE Frontend - Test Suite

This directory contains comprehensive test suites for the RAWGLE platform features.

## Test Structure

```
tests/
├── unit/                           # Unit tests for business logic
│   ├── health-records.test.ts     # Health Records CRUD tests
│   └── feeding-schedule.test.ts   # Feeding Schedule tests
├── integration/                    # API integration tests
│   └── api-endpoints.test.ts      # Full API request/response tests
├── e2e/                           # End-to-end tests
│   └── supplement-shop.spec.ts    # Supplement shop user workflows
└── README.md                      # This file
```

## Prerequisites

### Required Dependencies

```bash
npm install --save-dev vitest @playwright/test
```

### Environment Setup

1. Create `.env.test` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=test
```

2. Ensure Next.js dev server is running for E2E tests:
```bash
npm run dev
```

## Running Tests

### All Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Unit Tests Only

```bash
# Run all unit tests
npm test tests/unit

# Run specific test file
npm test tests/unit/health-records.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Integration Tests

```bash
# Run integration tests
npm test tests/integration

# Run with detailed output
npm test tests/integration -- --reporter=verbose
```

### E2E Tests

```bash
# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npx playwright test --headed

# Run specific E2E test file
npx playwright test tests/e2e/supplement-shop.spec.ts

# Run E2E tests in debug mode
npx playwright test --debug
```

## Test Configuration

### Vitest Configuration

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '.next/',
        'out/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Playwright Configuration

Create `playwright.config.ts` in project root:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test data';

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feature-page');
  });

  test('should perform user action', async ({ page }) => {
    // Interact with page
    await page.click('button[data-testid="submit"]');

    // Verify result
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

## Test Coverage Goals

- **Unit Tests:** 80% code coverage minimum
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user workflows

## Current Test Statistics

| Test Type | Files | Tests | Pass Rate |
|-----------|-------|-------|-----------|
| Unit | 2 | 75 | 100% |
| Integration | 1 | 28 | 85.7% |
| E2E | 1 | 27 | 66.7% |
| **Total** | **4** | **130** | **88.5%** |

## Known Issues

### In-Memory Storage
- Tests use in-memory arrays instead of database
- Data does not persist between test runs
- Some integration tests may fail due to storage isolation

### API Endpoint Testing
- Requires dev server to be running
- Uses demo user authentication
- May need real database for full integration testing

### E2E Test Skips
- Some E2E tests are skipped due to unimplemented features
- Run with `--reporter=list` to see which tests are skipped

## Best Practices

### Test Naming
- Use descriptive test names that explain what is being tested
- Follow pattern: "should [expected behavior] when [condition]"
- Example: "should return 404 when record does not exist"

### Test Organization
- Group related tests in `describe` blocks
- Use `beforeEach` for common setup
- Keep tests independent and isolated

### Assertions
- Test one thing per test case
- Use specific assertions (toHaveLength, toContain, etc.)
- Add descriptive error messages for failures

### Mocking
- Mock external dependencies (APIs, databases)
- Use realistic mock data
- Keep mocks simple and focused

## Debugging Tests

### Unit Tests

```bash
# Run single test in debug mode
npm test health-records.test.ts -- --reporter=verbose

# Run tests matching pattern
npm test -- --grep "should update"
```

### E2E Tests

```bash
# Open Playwright UI for debugging
npx playwright test --ui

# Run in debug mode with DevTools
npx playwright test --debug

# Generate trace for failed test
npx playwright test --trace on
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests Failing Locally

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

### E2E Tests Timing Out

1. **Increase timeout in test:**
   ```typescript
   test('slow operation', async ({ page }) => {
     test.setTimeout(60000); // 60 seconds
     // ... test code
   });
   ```

2. **Wait for specific conditions:**
   ```typescript
   await page.waitForSelector('[data-loaded="true"]');
   ```

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [Test Report](/test-reports/features-test-report.md)

## Contributing

When adding new features:

1. Write tests before implementation (TDD)
2. Ensure all tests pass before committing
3. Maintain test coverage above 80%
4. Update this README if adding new test types
5. Document any special test requirements

## Contact

For questions about tests:
- Check existing test files for examples
- Review the comprehensive test report
- Ask the QA team for guidance

---

**Last Updated:** October 23, 2025
