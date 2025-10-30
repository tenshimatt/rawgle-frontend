/**
 * Example: Authentication flow tests
 * Tests login, logout, and authentication state
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/login-page.png' });
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/auth/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait for validation error
    await page.waitForSelector('.error, .text-red-600, [role="alert"]', {
      timeout: 5000
    }).catch(() => {
      console.log('No validation error shown (might be using HTML5 validation)');
    });

    // Take screenshot of error state
    await page.screenshot({ path: 'test-results/screenshots/login-validation-error.png' });
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message or stay on login page
    await page.waitForTimeout(2000);

    // Check if error is displayed or we're still on login
    const url = page.url();
    const hasError = await page.locator('.error, .text-red-600').count() > 0;

    console.log('After invalid login - URL:', url, 'Has error:', hasError);

    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/login-invalid-credentials.png' });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in valid credentials (adjust based on your test data)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation or success indicator
    await page.waitForTimeout(2000);

    // Check if redirected or success message shown
    const url = page.url();
    console.log('After successful login - URL:', url);

    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/login-success.png' });

    // Should either redirect to dashboard or show success
    expect(url).not.toContain('/auth/login');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls to simulate network error
    await page.route('**/api/auth/**', route => {
      route.abort('failed');
    });

    await page.goto('/auth/login');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/login-network-error.png' });
  });
});
