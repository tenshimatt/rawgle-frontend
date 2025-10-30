/**
 * Example: Basic page load test
 * Tests that a page loads successfully with proper elements
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Page Load Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page).toHaveTitle(/Rawgle/);

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/screenshots/homepage-loaded.png' });
  });

  test('should render main navigation', async ({ page }) => {
    await page.goto('/');

    // Check for common navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Log any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    // Capture JavaScript errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert no JavaScript errors occurred
    expect(errors).toHaveLength(0);
  });

  test('should have acceptable performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart
      };
    });

    console.log('Performance metrics:', metrics);

    // Assert reasonable load times (adjust based on your needs)
    expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds
    expect(metrics.domContentLoaded).toBeLessThan(3000); // 3 seconds
  });
});
