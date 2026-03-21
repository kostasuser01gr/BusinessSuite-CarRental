import { test, expect } from '@playwright/test';

test.describe('AdaptiveAI Business Suite - Core Flows', () => {
  const testUser = {
    name: 'E2E Tester',
    email: `test-${Date.now()}@example.com`,
    password: 'password123'
  };

  test('full user journey: signup -> dashboard tasks/notes -> logout', async ({ page }) => {
    // 1. Signup
    await page.goto('/signup');
    await page.fill('input[id="name"]', testUser.name);
    await page.fill('input[id="email"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);
    await page.fill('input[id="confirmPassword"]', testUser.password);
    
    await page.click('button[type="submit"]');

    // 2. Dashboard Verification
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator('text=E2E Tester')).toBeVisible();

    // 3. Task Interaction
    const newTaskTitle = 'Verify Production Readiness';
    await page.fill('input[placeholder="Add new task..."]', newTaskTitle);
    await page.click('button[aria-label="Add task submit"]');
    await expect(page.locator(`text=${newTaskTitle}`)).toBeVisible();

    // Mark task complete
    await page.click(`button[aria-label="Mark as complete"]`);
    await expect(page.locator(`text=${newTaskTitle}`)).toHaveClass(/line-through/);
    
    // 4. Note Interaction
    await page.click('button[aria-label="Add new note"]'); 
    await page.fill('input[aria-label="Edit note title input"]', 'Deployment Checklist');
    await page.fill('textarea[aria-label="Edit note content textarea"]', '1. Tests pass\n2. Build works\n3. Lint clean');
    await page.click('button[aria-label="Save note changes"]'); 

    await expect(page.locator('text=Deployment Checklist')).toBeVisible();

    // 5. Navigation & Protected Routes
    await page.click('text=Settings');
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();

    // 6. Logout
    await page.click('button:has-text("Sign out")');
    await expect(page).toHaveURL(/\/login/);

    // 7. Verification of protection
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login flow', async ({ page }) => {
    const loginUser = {
      name: 'Login User',
      email: `login-${Date.now()}@example.com`,
      password: 'password123'
    };

    // First signup to create the user
    await page.goto('/signup');
    await page.fill('input[id="name"]', loginUser.name);
    await page.fill('input[id="email"]', loginUser.email);
    await page.fill('input[id="password"]', loginUser.password);
    await page.fill('input[id="confirmPassword"]', loginUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.click('button:has-text("Sign out")');
    await expect(page).toHaveURL(/\/login/);

    // Login
    await page.fill('input[id="email"]', loginUser.email);
    await page.fill('input[id="password"]', loginUser.password);
    await page.click('button[type="submit"]');

    // Verification
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(`text=${loginUser.name}`)).toBeVisible();
  });

  test('unauthorized users are redirected to login', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/settings', '/customers', '/bookings', '/assets', '/maintenance', '/workspace'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
