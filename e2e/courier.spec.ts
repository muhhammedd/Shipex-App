import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Courier Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        // Login as courier
        await page.goto('/login');
        await page.fill('input[type="email"]', 'courier@shipex.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/courier');
    });

    test('Should display assigned orders', async ({ page }) => {
        await expect(page.getByText('My Deliveries')).toBeVisible();

        // Check for at least one order card or "No deliveries" message
        // This depends on seed data
        const hasOrders = await page.locator('.order-card').count() > 0;
        const hasEmptyState = await page.getByText('No deliveries').isVisible();

        expect(hasOrders || hasEmptyState).toBeTruthy();

        // Accessibility
        const results = await new AxeBuilder({ page }).include('main').analyze();
        expect(results.violations).toEqual([]);
    });
});
