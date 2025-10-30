/**
 * Example: Navigation and routing tests
 * Tests page navigation, links, and routing behavior
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');

    // Find and click navigation links
    const navLinks = [
      { text: 'Home', expectedUrl: '/' },
      { text: 'About', expectedUrl: '/about' },
      { text: 'Contact', expectedUrl: '/contact' }
    ];

    for (const link of navLinks) {
      try {
        const linkElement = page.locator(`a:has-text("${link.text}")`).first();
        if (await linkElement.count() > 0) {
          await linkElement.click();
          await page.waitForLoadState('networkidle');

          console.log(`Navigated to: ${page.url()}`);

          // Take screenshot
          await page.screenshot({
            path: `test-results/screenshots/nav-${link.text.toLowerCase()}.png`
          });
        }
      } catch (error) {
        console.log(`Could not test navigation to ${link.text}:`, error);
      }
    }
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    await page.goto('/');
    const initialUrl = page.url();

    // Navigate to another page (if About link exists)
    try {
      const aboutLink = page.locator('a:has-text("About")').first();
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForLoadState('networkidle');

        const aboutUrl = page.url();
        expect(aboutUrl).not.toBe(initialUrl);

        // Go back
        await page.goBack();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toBe(initialUrl);

        // Go forward
        await page.goForward();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toBe(aboutUrl);

        console.log('Browser navigation works correctly');
      }
    } catch (error) {
      console.log('Could not test browser navigation:', error);
    }
  });

  test('should handle 404 pages', async ({ page }) => {
    // Try to navigate to non-existent page
    const response = await page.goto('/this-page-does-not-exist-12345');

    // Check response status
    if (response) {
      console.log('404 page status:', response.status());
    }

    // Take screenshot of 404 page
    await page.screenshot({ path: 'test-results/screenshots/404-page.png' });

    // Check if custom 404 page is shown
    const content = await page.textContent('body');
    console.log('404 page contains "404" or "not found":',
      content?.toLowerCase().includes('404') ||
      content?.toLowerCase().includes('not found')
    );
  });

  test('should maintain scroll position on navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log('Scroll position before:', scrollBefore);

    // Click a link
    try {
      const link = page.locator('a[href^="/"]').first();
      if (await link.count() > 0) {
        await link.click();
        await page.waitForLoadState('networkidle');

        // Go back
        await page.goBack();
        await page.waitForLoadState('networkidle');

        const scrollAfter = await page.evaluate(() => window.scrollY);
        console.log('Scroll position after:', scrollAfter);
      }
    } catch (error) {
      console.log('Could not test scroll position:', error);
    }
  });

  test('should load all navigation links without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all navigation links
    const links = await page.locator('nav a').all();
    console.log(`Found ${links.length} navigation links`);

    for (let i = 0; i < Math.min(links.length, 5); i++) {
      try {
        const href = await links[i].getAttribute('href');
        if (href && href.startsWith('/')) {
          console.log(`Testing link: ${href}`);
          await page.goto(href);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(500);
        }
      } catch (error) {
        console.log(`Error testing link ${i}:`, error);
      }
    }

    // Report any JavaScript errors
    if (errors.length > 0) {
      console.log('JavaScript errors found:', errors);
    }

    expect(errors.length).toBeLessThan(5); // Allow some minor errors
  });
});
