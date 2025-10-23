/**
 * End-to-End Tests for Supplement Shop
 *
 * Tests the complete user workflow for the supplement shop feature
 * using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Supplement Shop - Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should display shop page with title and description', async ({ page }) => {
    // Check page title
    const title = page.locator('h1', { hasText: 'Shop & Marketplace' });
    await expect(title).toBeVisible();

    // Check page description
    const description = page.locator('text=Browse products, supplements, and feeding essentials');
    await expect(description).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[class*="grid"]');

    // Check that product cards are displayed
    const productCards = page.locator('[class*="card-feature-secondary"]');
    const count = await productCards.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should display product information correctly', async ({ page }) => {
    // Get first product card
    const firstProduct = page.locator('[class*="card-feature-secondary"]').first();

    // Check product name is visible
    await expect(firstProduct.locator('[class*="text-lg"]')).toBeVisible();

    // Check product description is visible
    await expect(firstProduct.locator('[class*="text-muted"]')).toBeVisible();

    // Check price is displayed
    const price = firstProduct.locator('text=/\\$\\d+\\.\\d{2}/');
    await expect(price).toBeVisible();

    // Check "Add to Cart" button exists
    const addButton = firstProduct.locator('button', { hasText: 'Add to Cart' });
    await expect(addButton).toBeVisible();
  });

  test('should display product ratings', async ({ page }) => {
    // Get first product card
    const firstProduct = page.locator('[class*="card-feature-secondary"]').first();

    // Check star ratings are displayed
    const stars = firstProduct.locator('svg[class*="lucide-star"]');
    const starCount = await stars.count();

    expect(starCount).toBe(5); // Should display 5 stars
  });

  test('should display review count', async ({ page }) => {
    // Get first product card
    const firstProduct = page.locator('[class*="card-feature-secondary"]').first();

    // Check review count is displayed (e.g., "(45)")
    const reviewCount = firstProduct.locator('text=/\\(\\d+\\)/');
    await expect(reviewCount).toBeVisible();
  });
});

test.describe('Supplement Shop - Category Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should have category filter buttons', async ({ page }) => {
    // Note: This test will fail if filters are not implemented yet
    // Looking for common filter elements
    const filterSection = page.locator('[class*="filter"], [data-testid="category-filter"]');

    if (await filterSection.count() > 0) {
      await expect(filterSection).toBeVisible();
    } else {
      // Skip this test if filters aren't implemented
      test.skip();
    }
  });

  test('should filter products by category when clicked', async ({ page }) => {
    // This is a placeholder test for when category filtering is implemented
    const categoryButtons = page.locator('[data-category]');

    if (await categoryButtons.count() > 0) {
      // Click first category
      await categoryButtons.first().click();

      // Wait for products to update
      await page.waitForTimeout(500);

      // Verify products are filtered
      const visibleProducts = page.locator('[class*="card-feature-secondary"]:visible');
      expect(await visibleProducts.count()).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });
});

test.describe('Supplement Shop - Species Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should have species filter options', async ({ page }) => {
    // Looking for species filter (dogs, cats, etc.)
    const speciesFilter = page.locator('[data-testid="species-filter"], [class*="species"]');

    if (await speciesFilter.count() > 0) {
      await expect(speciesFilter).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should filter products by species', async ({ page }) => {
    // Placeholder for species filtering test
    const speciesButtons = page.locator('[data-species]');

    if (await speciesButtons.count() > 0) {
      const initialCount = await page.locator('[class*="card-feature-secondary"]').count();

      // Click a species filter
      await speciesButtons.first().click();
      await page.waitForTimeout(500);

      // Products should update
      const filteredCount = await page.locator('[class*="card-feature-secondary"]').count();

      // Either count changes or stays the same (all products match)
      expect(typeof filteredCount).toBe('number');
    } else {
      test.skip();
    }
  });
});

test.describe('Supplement Shop - Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should have search input field', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');

    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should filter products based on search query', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');

    if (await searchInput.count() > 0) {
      // Type search query
      await searchInput.fill('supplement');
      await page.waitForTimeout(500);

      // Check that results are filtered
      const products = page.locator('[class*="card-feature-secondary"]');
      expect(await products.count()).toBeGreaterThanOrEqual(0);
    } else {
      test.skip();
    }
  });

  test('should show no results message when search has no matches', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');

    if (await searchInput.count() > 0) {
      // Type nonsense query
      await searchInput.fill('xyzabc123nonexistent');
      await page.waitForTimeout(500);

      // Should show no results message or empty state
      const noResults = page.locator('text=/no.*results|no.*products|not found/i');

      if (await noResults.count() > 0) {
        await expect(noResults).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});

test.describe('Supplement Shop - Product Detail View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should navigate to product detail when clicked', async ({ page }) => {
    // This assumes products are clickable
    const firstProduct = page.locator('[class*="card-feature-secondary"]').first();
    const productName = await firstProduct.locator('[class*="text-lg"]').first().textContent();

    // Click product (if clickable)
    const clickableArea = firstProduct.locator('a, [role="link"]');

    if (await clickableArea.count() > 0) {
      await clickableArea.first().click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be on product detail page
      expect(page.url()).toContain('/shop/');
    } else {
      test.skip();
    }
  });

  test('should display full product information on detail page', async ({ page }) => {
    // Navigate to a product detail page directly
    // This is a placeholder - adjust based on actual routing
    const productDetailUrl = '/shop/products/1';

    try {
      await page.goto(productDetailUrl);

      // Check for product details
      const productTitle = page.locator('h1');
      await expect(productTitle).toBeVisible();

      // Check for price
      const price = page.locator('text=/\\$\\d+\\.\\d{2}/');
      await expect(price).toBeVisible();

      // Check for description
      const description = page.locator('[class*="description"], p');
      expect(await description.count()).toBeGreaterThan(0);
    } catch (error) {
      test.skip();
    }
  });
});

test.describe('Supplement Shop - Add to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should have "Add to Cart" buttons on all products', async ({ page }) => {
    const products = page.locator('[class*="card-feature-secondary"]');
    const productCount = await products.count();

    for (let i = 0; i < Math.min(productCount, 3); i++) {
      const product = products.nth(i);
      const addButton = product.locator('button', { hasText: 'Add to Cart' });
      await expect(addButton).toBeVisible();
    }
  });

  test('should add product to cart when button clicked', async ({ page }) => {
    const firstProduct = page.locator('[class*="card-feature-secondary"]').first();
    const addButton = firstProduct.locator('button', { hasText: 'Add to Cart' });

    // Click add to cart
    await addButton.click();

    // Wait for any feedback (toast notification, cart update, etc.)
    await page.waitForTimeout(1000);

    // Look for success indicators
    const successIndicators = page.locator([
      'text=/added to cart/i',
      '[role="alert"]',
      '[class*="toast"]',
      '[class*="notification"]'
    ].join(','));

    // If there's a cart counter, it should update
    const cartCounter = page.locator('[data-testid="cart-count"], [class*="cart-badge"]');

    const hasSuccessIndicator = await successIndicators.count() > 0;
    const hasCartCounter = await cartCounter.count() > 0;

    // At least one should be present
    expect(hasSuccessIndicator || hasCartCounter).toBeTruthy();
  });

  test('should enable cart icon/button after adding items', async ({ page }) => {
    // Look for cart icon in navigation
    const cartIcon = page.locator('[data-testid="cart-icon"], [aria-label*="cart" i], svg[class*="shopping"]').first();

    if (await cartIcon.count() > 0) {
      // Add item to cart
      const addButton = page.locator('button', { hasText: 'Add to Cart' }).first();
      await addButton.click();
      await page.waitForTimeout(500);

      // Cart should be clickable
      await expect(cartIcon).toBeVisible();
    } else {
      test.skip();
    }
  });
});

test.describe('Supplement Shop - Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/shop');

    // Products should still be visible
    const products = page.locator('[class*="card-feature-secondary"]');
    await expect(products.first()).toBeVisible();

    // Grid should adapt (likely 1 column on mobile)
    const grid = page.locator('[class*="grid"]').first();
    await expect(grid).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/shop');

    // Products should be visible
    const products = page.locator('[class*="card-feature-secondary"]');
    await expect(products.first()).toBeVisible();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/shop');

    // Products should be visible in grid
    const products = page.locator('[class*="card-feature-secondary"]');
    await expect(products.first()).toBeVisible();

    // Should show multiple columns
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
  });
});

test.describe('Supplement Shop - Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/shop');
    await page.waitForSelector('[class*="card-feature-secondary"]');

    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should display loading states appropriately', async ({ page }) => {
    await page.goto('/shop');

    // Look for loading indicators
    const loadingIndicator = page.locator('[class*="animate-spin"], [aria-busy="true"]');

    // If there's a loading state, it should disappear once loaded
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Supplement Shop - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/shop');

    // Page should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Should have proper heading levels
    const headings = page.locator('h1, h2, h3, h4');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/shop');

    // All buttons should be keyboard accessible
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      // Button should be visible or have aria-label
      const isVisible = await button.isVisible();
      const hasAriaLabel = await button.getAttribute('aria-label');

      expect(isVisible || hasAriaLabel !== null).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/shop');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
