import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { config } from '../../config';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: logout if logged in to maintain test isolation
    const logoutButton = page.locator('#tdMenuBarItemlogout');
    if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await logoutButton.click();
    }
  });

  test('should display username input field', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('should display next button', async () => {
    await expect(loginPage.nextButton).toBeVisible();
  });

  test('should show password field after entering username', async () => {
    await loginPage.enterUsername(config.loginUsername);
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('should successfully login with valid credentials', async () => {
    await loginPage.login(config.loginUsername, config.loginPassword);
    await expect(loginPage.logoutButton).toBeVisible();
  });

  test('should display error message with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should accept and retain username input value', async () => {
    await loginPage.usernameInput.fill('testuser');
    await expect(loginPage.usernameInput).toHaveValue('testuser');
  });

  test('should allow clearing username field', async () => {
    await loginPage.usernameInput.fill('testuser');
    await expect(loginPage.usernameInput).toHaveValue('testuser');

    await loginPage.usernameInput.clear();
    await expect(loginPage.usernameInput).toHaveValue('');
  });
});
