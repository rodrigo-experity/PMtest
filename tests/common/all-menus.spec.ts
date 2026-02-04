import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { DashboardPage } from '../../pages';
import { Admin1Page } from '../../pages';
import { Admin2Page } from '../../pages';
import { ResourcePage } from '../../pages';
import { PersonalPage } from '../../pages';
import { SystemPage } from '../../pages';
import { HelpPage } from '../../pages';
import { config } from '../../config';

test.describe('All Menu Navigation Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(config.loginUsername, config.loginPassword);
    await expect(dashboardPage.logoutButton).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const logoutButton = page.locator('#tdMenuBarItemlogout');
    if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await logoutButton.click();
    }
  });

  test('should display Admin1 menu with correct item count', async ({ page }) => {
    const admin1Page = new Admin1Page(page);

    await dashboardPage.admin1MenuItem.click();
    await admin1Page.waitForAdmin1MenuToOpen();

    const count = await admin1Page.getAdmin1MenuItemsCount();
    expect(count).toBe(9);
  });

  test('should display Admin2 menu with correct item count', async ({ page }) => {
    const admin2Page = new Admin2Page(page);

    await dashboardPage.admin2MenuItem.click();
    await admin2Page.waitForAdmin2MenuToOpen();

    const count = await admin2Page.getAdmin2MenuItemsCount();
    expect(count).toBe(13);
  });

  test('should display Resource menu with correct item count', async ({ page }) => {
    const resourcePage = new ResourcePage(page);

    await dashboardPage.resourceMenuItem.click();
    await resourcePage.waitForResourceMenuToOpen();

    const count = await resourcePage.getResourceMenuItemsCount();
    expect(count).toBe(7);
  });

  test('should display Personal menu with correct item count', async ({ page }) => {
    const personalPage = new PersonalPage(page);

    await dashboardPage.personalMenuItem.click();
    await personalPage.waitForPersonalMenuToOpen();

    const count = await personalPage.getPersonalMenuItemsCount();
    expect(count).toBe(1);
  });

  test('should display System menu with correct item count', async ({ page }) => {
    const systemPage = new SystemPage(page);

    await dashboardPage.systemMenuItem.click();
    await systemPage.waitForSystemMenuToOpen();

    const count = await systemPage.getSystemMenuItemsCount();
    expect(count).toBe(8);
  });

  test('should display Help menu with correct item count', async ({ page }) => {
    const helpPage = new HelpPage(page);

    await dashboardPage.helpMenuItem.click();
    await helpPage.waitForHelpMenuToOpen();

    const count = await helpPage.getHelpMenuItemsCount();
    expect(count).toBe(3);
  });

  test('should display all Admin1 submenu items', async ({ page }) => {
    const admin1Page = new Admin1Page(page);

    await dashboardPage.admin1MenuItem.click();
    await admin1Page.waitForAdmin1MenuToOpen();

    await expect(admin1Page.chargeEntryMenuItem).toBeVisible();
    await expect(admin1Page.paymentMenuItem).toBeVisible();
    await expect(admin1Page.feeScheduleMenuItem).toBeVisible();
    await expect(admin1Page.managedCareMenuItem).toBeVisible();
    await expect(admin1Page.insuranceMenuItem).toBeVisible();
    await expect(admin1Page.empProtocolMenuItem).toBeVisible();
    await expect(admin1Page.empStatementReviewMenuItem).toBeVisible();
    await expect(admin1Page.chartReviewMenuItem).toBeVisible();
    await expect(admin1Page.occMedWorkQueueMenuItem).toBeVisible();
  });

  test('should display correct text for Resource menu items', async ({ page }) => {
    const resourcePage = new ResourcePage(page);

    await dashboardPage.resourceMenuItem.click();
    await resourcePage.waitForResourceMenuToOpen();

    expect(await resourcePage.getDiagnosisSearchText()).toBe('Diagnosis Search');
    expect(await resourcePage.getProcedureSearchText()).toBe('Procedure Search');
    expect(await resourcePage.getPracticeClinicText()).toBe('Practice/Clinic');
  });

  test('should display correct text for Help menu items', async ({ page }) => {
    const helpPage = new HelpPage(page);

    await dashboardPage.helpMenuItem.click();
    await helpPage.waitForHelpMenuToOpen();

    expect(await helpPage.getHelpResourcesText()).toBe('Help Resources');
    expect(await helpPage.getKnowledgeBaseText()).toBe('Knowledge Base');
    expect(await helpPage.getHomePageText()).toBe('Home Page');
  });

  test('should be able to click Personal Profile menu item', async ({ page }) => {
    const personalPage = new PersonalPage(page);

    await dashboardPage.personalMenuItem.click();
    await personalPage.waitForPersonalMenuToOpen();

    await personalPage.clickProfile();
    await page.waitForLoadState('domcontentloaded');

    // Verify navigation occurred (URL or page element check)
    expect(page.url()).toContain('Info.aspx');
  });
});
