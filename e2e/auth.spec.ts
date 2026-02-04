import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Authentication & Accessibility', () => {

    test('Login page should be accessible', async ({ page }) => {
        await page.goto('/login');

        // Wait for form to be visible
        await expect(page.locator('form')).toBeVisible();

        // Run Accessibility Scan
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('main')
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Should handle invalid login', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Expect error toast or message
        // Adjust selector based on your actual UI implementation
        // await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    // Mock successful login check if we had a persistent seed data
    // test('Should redirect to dashboard on success', async ({ page }) => { ... });
});
