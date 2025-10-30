/**
 * Example: Form interaction tests
 * Tests form filling, validation, and submission
 */

import { test, expect } from '@playwright/test';

test.describe('Form Interaction Tests', () => {
  test('should fill and validate a contact form', async ({ page }) => {
    // Navigate to a page with a form (adjust URL as needed)
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Look for common form fields
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const messageInput = page.locator('textarea, input[name="message"]').first();

    // Check if form exists
    const hasForm = (await nameInput.count() > 0) ||
                    (await emailInput.count() > 0) ||
                    (await messageInput.count() > 0);

    if (hasForm) {
      console.log('Form found, testing interaction');

      // Fill in form fields
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
      }
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
      }
      if (await messageInput.count() > 0) {
        await messageInput.fill('This is a test message from automated testing.');
      }

      // Take screenshot
      await page.screenshot({ path: 'test-results/screenshots/form-filled.png' });

      console.log('Form fields filled successfully');
    } else {
      console.log('No form found on this page');
    }
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Try to submit empty form if it exists
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();

    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(1000);

      // Take screenshot of validation state
      await page.screenshot({ path: 'test-results/screenshots/form-validation.png' });

      console.log('Form submission attempted');
    }
  });

  test('should test search functionality', async ({ page }) => {
    await page.goto('/');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      console.log('Search input found');

      // Type search query
      await searchInput.fill('test query');
      await page.waitForTimeout(500);

      // Take screenshot
      await page.screenshot({ path: 'test-results/screenshots/search-filled.png' });

      // Try to submit search
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);

      // Take screenshot of results
      await page.screenshot({ path: 'test-results/screenshots/search-results.png' });

      console.log('Search submitted');
    } else {
      console.log('No search functionality found');
    }
  });

  test('should handle file upload', async ({ page }) => {
    await page.goto('/');

    // Look for file input
    const fileInput = page.locator('input[type="file"]').first();

    if (await fileInput.count() > 0) {
      console.log('File input found');

      // Note: In real tests, you would upload an actual file
      // This is just checking if the input exists and is interactive
      const isEnabled = await fileInput.isEnabled();
      expect(isEnabled).toBe(true);

      console.log('File input is enabled and ready');
    } else {
      console.log('No file upload functionality found');
    }
  });

  test('should test dropdown/select interactions', async ({ page }) => {
    await page.goto('/');

    // Look for select elements
    const selects = await page.locator('select').all();

    if (selects.length > 0) {
      console.log(`Found ${selects.length} select elements`);

      for (let i = 0; i < selects.length; i++) {
        try {
          // Get options
          const options = await selects[i].locator('option').all();
          console.log(`Select ${i} has ${options.length} options`);

          if (options.length > 1) {
            // Select the second option
            const value = await options[1].getAttribute('value');
            if (value) {
              await selects[i].selectOption(value);
              console.log(`Selected option: ${value}`);
            }
          }
        } catch (error) {
          console.log(`Error testing select ${i}:`, error);
        }
      }

      // Take screenshot
      await page.screenshot({ path: 'test-results/screenshots/selects-tested.png' });
    }
  });

  test('should test checkbox and radio interactions', async ({ page }) => {
    await page.goto('/');

    // Test checkboxes
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    if (checkboxes.length > 0) {
      console.log(`Found ${checkboxes.length} checkboxes`);

      for (let i = 0; i < Math.min(checkboxes.length, 3); i++) {
        try {
          await checkboxes[i].check();
          const isChecked = await checkboxes[i].isChecked();
          console.log(`Checkbox ${i} checked:`, isChecked);
        } catch (error) {
          console.log(`Error checking checkbox ${i}:`, error);
        }
      }
    }

    // Test radio buttons
    const radios = await page.locator('input[type="radio"]').all();
    if (radios.length > 0) {
      console.log(`Found ${radios.length} radio buttons`);

      if (radios.length > 0) {
        try {
          await radios[0].check();
          console.log('First radio button checked');
        } catch (error) {
          console.log('Error checking radio button:', error);
        }
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/inputs-tested.png' });
  });
});
