import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Admin Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@shipex.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');
    });

    test('Should load analytics overview', async ({ page }) => {
        await expect(page.getByText('System Online')).toBeVisible();

        // Accessibility
        const results = await new AxeBuilder({ page }).include('main').analyze();
        expect(results.violations).toEqual([]);
    });

    test('Should navigate to User Management', async ({ page }) => {
        await page.goto('/admin/merchants');
        await expect(page.getByText('Merchants')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Merchant' })).toBeVisible();
    });
});
