import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright@test.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('body')).toContainText('Your Tasks');
  await expect(page.locator('body')).toContainText('Project Overview');
  await page.getByRole('link', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('body')).toContainText('Create Task');
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByPlaceholder('Task title').click();
  await page.getByPlaceholder('Task title').fill('Testing');
  await page.getByPlaceholder('Task description').click();
  await page.getByPlaceholder('Task description').fill('Test Desc');
  await page.getByLabel('Priority').click();
  await page.getByLabel('Medium').click();
  await page.getByLabel('Due Date').fill('2025-01-25');
  await page.getByLabel('Assign To').click();
  await page.getByLabel('Test-playwright').click();
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByRole('heading', { name: 'Testing' }).click();
  await expect(page.locator('h3')).toContainText('Testing');
  await expect(page.locator('body')).toContainText('MEDIUM');
});