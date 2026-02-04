import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Merchant Dashboard', () => {

    // In a real scenario, we'd have a global setup to authenticate as merchant
    // For now, we'll assume the /merchant route redirects to login if not authenticated
    // OR we can mock the auth state if we had a way to inject cookies/localstorage

    test.beforeEach(async ({ page }) => {
        // Mock authentication or login flow
        await page.goto('/login');
        await page.fill('input[type="email"]', 'merchant@shipex.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        // Wait for redirection
        await page.waitForURL('/merchant');
    });

    test('Dashboard should render with key metrics', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Overview');

        // Check for stats cards
        await expect(page.getByText('Total Shipments')).toBeVisible();
        await expect(page.getByText('Active Orders')).toBeVisible();

        // Accessibility Check
        const results = await new AxeBuilder({ page }).include('main').analyze();
        expect(results.violations).toEqual([]);
    });

    test('Should navigate to New Order page', async ({ page }) => {
        await page.getByRole('link', { name: 'New Order' }).click();
        await expect(page).toHaveURL(/\/merchant\/orders\/new/);

        await expect(page.getByText('Create New Order')).toBeVisible();
    });
});
