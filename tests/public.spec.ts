import { test, expect } from '@playwright/test';

test.describe('Public Routes', () => {
    test('home page shows get started and create account buttons', async ({ page }) => {
        await page.goto('/');

        // Check main elements
        await expect(page.getByRole('heading', { name: 'Project Management' })).toBeVisible();
        await expect(page.getByText('Streamline your workflow')).toBeVisible();

        // Check navigation buttons
        const getStartedButton = page.getByRole('link', { name: 'Get Started' });
        const createAccountButton = page.getByRole('link', { name: 'Create Account' });

        await expect(getStartedButton).toBeVisible();
        await expect(createAccountButton).toBeVisible();

        // Verify links
        await expect(getStartedButton).toHaveAttribute('href', '/signin');
        await expect(createAccountButton).toHaveAttribute('href', '/signup');
    });
});