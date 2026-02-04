import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { DashboardPage } from '../../pages';
import { config } from '../../config';

test.describe('Dashboard Page Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    // Login before each test
    await loginPage.login(config.loginUsername, config.loginPassword);
  });

  test('should display logout button on dashboard', async ({ page }) => {
    // await page.pause();
     await expect(dashboardPage.logoutButton).toBeVisible();
  });

//   test('should display user greeting on dashboard', async () => {
//     const isGreetingVisible = await dashboardPage.isUserGreetingVisible();
//     expect(isGreetingVisible).toBe(true);
//   });

//   test('should display main content area', async () => {
//     const isContentVisible = await dashboardPage.isMainContentVisible();
//     expect(isContentVisible).toBe(true);
//   });

  test('should display navigation menu', async () => {
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });

//   test('should have all dashboard elements visible', async () => {
//     await expect(dashboardPage.logoutButton).toBeVisible();
//     await expect(dashboardPage.mainContent).toBeVisible();
//     await expect(dashboardPage.navigationMenu).toBeVisible();
//   });

  test('should display all menu items', async () => {
    const menuItems = dashboardPage.getAllMenuItems();
    await menuItems.first().waitFor({ state: 'visible' });
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
    await expect(menuItems.nth(i)).toBeVisible();
    } 
  });
});
