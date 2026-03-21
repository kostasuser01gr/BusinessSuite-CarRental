import { test, expect } from '@playwright/test';

test.describe('Dashboard - Module Verification', () => {
  const testUser = {
    name: 'Dashboard Tester',
    email: `dash-${Date.now()}@example.com`,
    password: 'password123'
  };

  test.beforeEach(async ({ page }) => {
    // 1. Signup to get to dashboard
    await page.goto('/signup');
    await page.fill('input[id="name"]', testUser.name);
    await page.fill('input[id="email"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);
    await page.fill('input[id="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('KPI module is rendered with values', async ({ page }) => {
    const kpiContainer = page.getByTestId('kpi-container');
    await expect(kpiContainer).toBeVisible();
    await expect(kpiContainer.locator('text=Revenue')).toBeVisible();
    await expect(kpiContainer.locator('text=$45,231')).toBeVisible();
  });

  test('Task lifecycle: add, complete, delete', async ({ page }) => {
    const taskModule = page.getByTestId('tasks-module');
    const newTaskTitle = 'E2E Task ' + Date.now();

    // Add
    await taskModule.getByPlaceholder(/Add new task/i).fill(newTaskTitle);
    await taskModule.getByLabel(/Add task submit/i).click();
    await expect(taskModule.locator(`text=${newTaskTitle}`)).toBeVisible();

    // Complete
    await taskModule.locator('button', { has: page.locator('svg.lucide-clock') }).first().click();
    // Verification of completion style (line-through)
    await expect(taskModule.locator(`text=${newTaskTitle}`)).toHaveClass(/line-through/);

    // Delete
    await taskModule.getByLabel(`Delete task ${newTaskTitle}`).click();
    await expect(taskModule.locator(`text=${newTaskTitle}`)).not.toBeVisible();
  });

  test('Assistant interaction: suggested action', async ({ page }) => {
    const assistant = page.getByTestId('assistant-module');
    await assistant.getByPlaceholder(/Ask anything/i).fill('create a task for meeting');
    await assistant.locator('button', { has: page.locator('svg.lucide-send') }).click();

    // Should see an action chip
    const actionChip = assistant.getByRole('button', { name: /Create Task/i });
    await expect(actionChip).toBeVisible();
    
    // Click action chip
    await actionChip.click();
    
    // Verify task was added to TasksModule
    const taskModule = page.getByTestId('tasks-module');
    await expect(taskModule.locator('text=create a task for meeting')).toBeVisible();
  });

  test('Settings: toggle widget visibility', async ({ page }) => {
    // Go to settings
    await page.click('text=Settings');
    await page.click('button:has-text("Dashboard")');

    // Toggle KPI visibility (it is visible by default)
    const kpiToggle = page.locator('div:has-text("KPI Overview")').getByRole('button', { name: /Visible/i });
    await kpiToggle.click();
    await expect(kpiToggle).toHaveText(/Hidden/i);

    // Go back to dashboard
    await page.click('text=Dashboard');
    
    // KPI should not be visible
    await expect(page.getByTestId('kpi-container')).not.toBeVisible();
  });
});
