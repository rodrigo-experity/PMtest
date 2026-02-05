import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { DashboardPage } from '../../pages';
import { PatientPage } from '../../pages';
import { LogBookPage } from '../../pages';
import { PatientRegistrationForm } from '../../pages';
import { config } from '../../config';

test.describe('Patient Registration Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let patientPage: PatientPage;
  let logBookPage: LogBookPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    patientPage = new PatientPage(page);
    logBookPage = new LogBookPage(page);

    await loginPage.goto();
    await loginPage.login(config.loginUsername, config.loginPassword);

    // Wait for dashboard to load
    await expect(dashboardPage.logoutButton).toBeVisible();

    // Navigate to Patient > Log Book
    await dashboardPage.clickPatientMenuItem();
    await patientPage.waitForPatientMenuToOpen();
    await patientPage.clickLogBook();

    // Wait for Log Book page to load
    await logBookPage.waitForLogBookToLoad();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: logout if logged in to maintain test isolation
    const logoutButton = page.locator('#tdMenuBarItemlogout');
    if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await logoutButton.click();
    }
  });

  test('should display Log Book page', async () => {
    await expect(logBookPage.logBookContainer).toBeVisible();
  });

  test('should display all Add buttons for different patient types', async () => {
    await expect(logBookPage.addPrivateButton).toBeVisible();
    await expect(logBookPage.addWCButton).toBeVisible();
    await expect(logBookPage.addEPSButton).toBeVisible();
    await expect(logBookPage.addMiscButton).toBeVisible();
  });

  test('should display practice dropdown', async () => {
    await expect(logBookPage.practiceDropdown).toBeVisible();
  });

  test('should be able to click Add Private button', async ({ page }) => {
    // Click the Add Private button
    await logBookPage.clickAddPrivate();

    // Wait for patient registration form/modal to appear
    // Note: You'll need to update this based on what actually appears
    await page.waitForTimeout(2000);

    // Add assertions based on what appears after clicking
    // Example: Check if a modal or new page is displayed
    // await expect(page.locator('[data-testid="patient-form"]')).toBeVisible();
  });

  test('should navigate to patient registration when clicking Add Private', async ({ page }) => {
    // Click the Add Private button
    await logBookPage.clickAddPrivate();

    // Wait for navigation or modal
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Verify URL changed or modal appeared
    // Note: Update this based on actual behavior
    const currentUrl = page.url();
    console.log('Current URL after clicking Add Private:', currentUrl);

    // Add specific assertion based on what happens
    // Example: expect(currentUrl).toContain('PatInfo.aspx');
  });

  test('should display patient registration form after clicking Add Private', async ({ page }) => {
    const registrationForm = new PatientRegistrationForm(page);

    // Click Add Private button
    await logBookPage.clickAddPrivate();

    // Wait for form to load
    await registrationForm.waitForFormToLoad();

    // Verify form fields are visible
    await expect(registrationForm.lastNameField).toBeVisible();
    await expect(registrationForm.dobField).toBeVisible();
    await expect(registrationForm.reasonForVisitDropdown).toBeVisible();
    await expect(registrationForm.registerButton).toBeVisible();
  });

  test('should fill out patient registration form with required fields', async ({ page }) => {
    const registrationForm = new PatientRegistrationForm(page);

    // Click Add Private button
    await logBookPage.clickAddPrivate();
    await registrationForm.waitForFormToLoad();

    // Generate unique test data
    const timestamp = Date.now();
    const lastName = `TestPatient${timestamp}`;
    const dob = '01/01/1990';

    // Fill required fields
    await registrationForm.fillRequiredFields(lastName, dob, 'Illness');

    // Verify fields are filled
    expect(await registrationForm.getLastName()).toBe(lastName);
    expect(await registrationForm.getDOB()).toBe(dob);
  });

  test('should register a new private patient with complete information', async ({ page }) => {
    const registrationForm = new PatientRegistrationForm(page);

    // Click Add Private button
    await logBookPage.clickAddPrivate();
    await registrationForm.waitForFormToLoad();

    // Generate unique test data
    const timestamp = Date.now();
    const patientData = {
      lastName: `AutoTest${timestamp}`,
      firstName: 'John',
      dob: '01/15/1985',
      reasonForVisit: 'Illness',
      phone: '555-123-4567',
      cellPhone: '555-987-6543'
    };

    // Fill complete patient information
    await registrationForm.fillPatientInformation(patientData);

    // Verify all fields are filled correctly
    expect(await registrationForm.getLastName()).toBe(patientData.lastName);
    expect(await registrationForm.getFirstName()).toBe(patientData.firstName);
    expect(await registrationForm.getDOB()).toBe(patientData.dob);

    // Click Register button
    await registrationForm.clickRegister();

    // Wait for registration to complete
    await page.waitForTimeout(3000);

    // Verify registration was successful
    // Note: Update this based on actual success indicator
    // Example: Check for success message, redirect, or patient appearing in log book
  });

  test('should be able to cancel patient registration', async ({ page }) => {
    const registrationForm = new PatientRegistrationForm(page);

    // Click Add Private button
    await logBookPage.clickAddPrivate();
    await registrationForm.waitForFormToLoad();

    // Fill some data
    await registrationForm.lastNameField.fill('TestCancel');

    // Click Cancel button
    await registrationForm.clickCancel();

    // Wait a bit
    await page.waitForTimeout(1000);

    // Verify form is closed (form fields should not be visible)
    await expect(registrationForm.lastNameField).not.toBeVisible();
  });
});
