import { type Page } from '@playwright/test';

export async function loginUser(page: Page) {
    await page.goto('/signin');
    await page.getByLabel('Email').fill('playwright@test.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('/dashboard');
}