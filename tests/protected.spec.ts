import { test, expect } from '@playwright/test';
import { loginUser } from './utils/auth-helpers';

test.describe('Protected Routes', () => {
  // Setup authentication before tests
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('dashboard page shows user content', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify authenticated content
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    // await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
  });

  test('profile page shows user information', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();

    // Check form fields
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Bio')).toBeVisible();
    await expect(page.getByLabel('Role')).toBeVisible();
    await expect(page.getByLabel('Department')).toBeVisible();

    // Verify submit button
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  });

  test('unauthorized access redirects to login', async ({ page }) => {
    // Clear storage to simulate logged out state
    await page.context().clearCookies();

    // Attempt to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL('/signin');
  });
});