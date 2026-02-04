import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { DashboardPage } from '../../pages';
import { PatientPage } from '../../pages';
import { config } from '../../config';

test.describe('Patient Menu Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let patientPage: PatientPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    patientPage = new PatientPage(page);

    await loginPage.goto();
    await loginPage.login(config.loginUsername, config.loginPassword);

    // Wait for dashboard to load
    await expect(dashboardPage.logoutButton).toBeVisible();

    // Open Patient menu
    await dashboardPage.clickPatientMenuItem();
    await patientPage.waitForPatientMenuToOpen();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: logout if logged in to maintain test isolation
    const logoutButton = page.locator('#tdMenuBarItemlogout');
    if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await logoutButton.click();
    }
  });

  test('should display all Patient submenu items', async () => {
    await expect(patientPage.logBookMenuItem).toBeVisible();
    await expect(patientPage.summaryMenuItem).toBeVisible();
    await expect(patientPage.demographicMenuItem).toBeVisible();
    await expect(patientPage.payerInsuranceMenuItem).toBeVisible();
    await expect(patientPage.receivableMenuItem).toBeVisible();
    await expect(patientPage.carequalityMenuItem).toBeVisible();
    await expect(patientPage.scanDocumentsMenuItem).toBeVisible();
  });

  test('should have correct count of Patient menu items', async () => {
    const count = await patientPage.getPatientMenuItemsCount();
    expect(count).toBe(7);
  });

  test('should display correct text for Log Book menu item', async () => {
    const text = await patientPage.getLogBookText();
    expect(text).toBe('Log Book');
  });

  test('should display correct text for Summary menu item', async () => {
    const text = await patientPage.getSummaryText();
    expect(text).toBe('Summary');
  });

  test('should display correct text for Demographic menu item', async () => {
    const text = await patientPage.getDemographicText();
    expect(text).toBe('Demographic');
  });

  test('should display correct text for Payer/Insurance menu item', async () => {
    const text = await patientPage.getPayerInsuranceText();
    expect(text).toBe('Payer/Insurance');
  });

  test('should display correct text for Receivable menu item', async () => {
    const text = await patientPage.getReceivableText();
    expect(text).toBe('Receivable');
  });

  test('should display correct text for Carequality menu item', async () => {
    const text = await patientPage.getCarequalityText();
    expect(text).toBe('Carequality');
  });

  test('should display correct text for Scan Documents menu item', async () => {
    const text = await patientPage.getScanDocumentsText();
    expect(text).toBe('Scan Documents');
  });

  test('should be able to click Log Book menu item', async ({ page }) => {
    await patientPage.clickLogBook();
    // Wait for navigation
    await page.waitForLoadState('domcontentloaded');
    // Verify URL contains LogBook
    expect(page.url()).toContain('LogBook.aspx');
  });

  test('should be able to click Summary menu item', async ({ page }) => {
    await patientPage.clickSummary();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('PatSummary.aspx');
  });

  test('should be able to click Demographic menu item', async ({ page }) => {
    await patientPage.clickDemographic();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('PatInfo.aspx');
  });
});
