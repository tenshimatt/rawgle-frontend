/**
 * Example: Responsive design tests
 * Tests layout and functionality across different viewport sizes
 */

import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },      // iPhone SE
  { name: 'tablet', width: 768, height: 1024 },     // iPad
  { name: 'desktop', width: 1920, height: 1080 }    // Desktop
];

test.describe('Responsive Design Tests', () => {
  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name}`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `test-results/screenshots/responsive-${viewport.name}.png`,
        fullPage: true
      });

      // Check if navigation is visible or in a menu
      const nav = page.locator('nav');
      const isVisible = await nav.isVisible();
      console.log(`Navigation visible on ${viewport.name}:`, isVisible);

      // For mobile, check if hamburger menu exists
      if (viewport.name === 'mobile') {
        const mobileMenu = page.locator('[aria-label*="menu" i], button:has-text("Menu")').first();
        const hasMobileMenu = await mobileMenu.count() > 0;
        console.log('Mobile menu found:', hasMobileMenu);

        if (hasMobileMenu) {
          // Try to open mobile menu
          await mobileMenu.click();
          await page.waitForTimeout(500);

          // Take screenshot with menu open
          await page.screenshot({
            path: `test-results/screenshots/mobile-menu-open.png`
          });
        }
      }
    });
  }

  test('should handle orientation changes', async ({ page }) => {
    // Portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/screenshots/portrait.png' });

    // Landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/landscape.png' });

    console.log('Orientation change tested');
  });

  test('should have touch-friendly targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all clickable elements
    const clickable = await page.locator('button, a, input[type="submit"]').all();

    console.log(`Found ${clickable.length} clickable elements`);

    // Check size of first few elements
    for (let i = 0; i < Math.min(clickable.length, 5); i++) {
      try {
        const box = await clickable[i].boundingBox();
        if (box) {
          console.log(`Element ${i} size: ${box.width}x${box.height}`);

          // Recommended minimum touch target size is 44x44px
          const isTouchFriendly = box.width >= 44 && box.height >= 44;
          if (!isTouchFriendly) {
            console.warn(`Element ${i} may be too small for touch: ${box.width}x${box.height}`);
          }
        }
      } catch (error) {
        console.log(`Could not check element ${i}:`, error);
      }
    }
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    console.log('Has horizontal scroll:', hasHorizontalScroll);

    if (hasHorizontalScroll) {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      console.warn(`Page is too wide: ${scrollWidth}px (should be ${clientWidth}px)`);
    }

    expect(hasHorizontalScroll).toBe(false);
  });

  test('should load images appropriately for viewport', async ({ page }) => {
    const viewport = { width: 375, height: 667 };
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all images
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images`);

    let oversizedImages = 0;

    for (let i = 0; i < images.length; i++) {
      try {
        const naturalWidth = await images[i].evaluate((img: HTMLImageElement) => img.naturalWidth);
        const displayedWidth = await images[i].evaluate((img: HTMLImageElement) => img.clientWidth);

        // Check if image is significantly larger than needed
        if (naturalWidth > displayedWidth * 2) {
          console.warn(`Image ${i} is oversized: ${naturalWidth}px loaded for ${displayedWidth}px display`);
          oversizedImages++;
        }
      } catch (error) {
        console.log(`Could not check image ${i}:`, error);
      }
    }

    console.log(`Oversized images: ${oversizedImages}/${images.length}`);
  });
});
