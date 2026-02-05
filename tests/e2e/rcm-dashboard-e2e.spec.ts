import { test, expect, Page } from '@playwright/test';
import {
  LoginPage,
  DashboardPage,
  PatientPage,
  LogBookPage,
  Admin2Page,
  RCMDashboardPage,
} from '../../pages';
import { config } from '../../config';

/**
 * E2E RCM Dashboard Permission Validation Test
 *
 * This test suite validates RCM Dashboard menu visibility based on practice permissions:
 * 1. Login and navigation to Log Book
 * 2. Practice selection (with/without RCM permissions)
 * 3. Navigate to Admin2 menu
 * 4. Verify RCM Dashboard visibility based on practice permissions
 */

// Test data constants
const TEST_DATA = {
  practiceWithoutRcm: {
    practice: 'TEST2', // Practice without RCM dashboard permissions
    clinic: 'TEST', // Clinic for TEST2
  },
  practiceWithRcm: {
    practice: 'LOWUC', // Practice with RCM dashboard permissions
    clinic: 'BELLS', // Clinic for LOWUC (TEST doesn't exist for LOWUC)
  },
};

// Page objects interface
interface PageObjects {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  patientPage: PatientPage;
  logBookPage: LogBookPage;
  admin2Page: Admin2Page;
  rcmDashboardPage: RCMDashboardPage;
}

test.describe('RCM Dashboard E2E', () => {
  let pages: PageObjects;

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    pages = {
      loginPage: new LoginPage(page),
      dashboardPage: new DashboardPage(page),
      patientPage: new PatientPage(page),
      logBookPage: new LogBookPage(page),
      admin2Page: new Admin2Page(page),
      rcmDashboardPage: new RCMDashboardPage(page),
    };

    // Perform login
    await loginToApplication(pages);
  });

  test('Validate RCM Dashboard visibility for practices with and without permissions', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n🔍 RCM DASHBOARD PERMISSION VALIDATION TEST\n');
    console.log('=' .repeat(70));

    // SCENARIO 1: Practice WITHOUT RCM Dashboard Permissions
    console.log('\n📋 SCENARIO 1: Practice WITHOUT RCM Permissions');
    console.log('-'.repeat(70));

    await navigateToLogBookAndSelectPractice(page, pages, TEST_DATA.practiceWithoutRcm.practice, TEST_DATA.practiceWithoutRcm.clinic);
    await navigateToAdmin2Menu(pages);

    const isRcmVisibleWithoutPermissions = await pages.admin2Page.isRcmDashboardMenuItemVisible();
    expect(isRcmVisibleWithoutPermissions, `RCM Dashboard should NOT be visible for practice ${TEST_DATA.practiceWithoutRcm.practice}`).toBe(false);

    console.log(`✅ ${TEST_DATA.practiceWithoutRcm.practice}: RCM Dashboard is correctly HIDDEN`);
    console.log('✅ Scenario 1 PASSED: Permissions working as expected\n');

    // Navigate back to Log Book to change practice
    console.log('🔄 Switching to different practice...\n');
    await pages.logBookPage.navigateFromDashboard(pages.dashboardPage, pages.patientPage);

    // SCENARIO 2: Practice WITH RCM Dashboard Permissions
    console.log('📋 SCENARIO 2: Practice WITH RCM Permissions');
    console.log('-'.repeat(70));

    await pages.logBookPage.selectPracticeAndClinic(TEST_DATA.practiceWithRcm.practice, TEST_DATA.practiceWithRcm.clinic);
    await page.waitForTimeout(2000); // Increased wait time for permissions to load
    console.log(`✅ Practice selected: ${TEST_DATA.practiceWithRcm.practice}, Clinic: ${TEST_DATA.practiceWithRcm.clinic}`);

    await navigateToAdmin2Menu(pages);

    // Debug: Check if Admin2 menu is open
    const isAdmin2MenuOpen = await pages.admin2Page.isAdmin2MenuDropdownVisible();
    console.log(`🔍 Debug: Admin2 menu visible: ${isAdmin2MenuOpen}`);

    // Debug: Get all menu items count
    const menuItemsCount = await pages.admin2Page.getAdmin2MenuItemsCount();
    console.log(`🔍 Debug: Admin2 menu has ${menuItemsCount} items`);

    // Debug: Check if RCM Dashboard element exists in DOM
    const rcmExists = await pages.admin2Page.rcmDashboardMenuItemExists();
    console.log(`🔍 Debug: RCM Dashboard element exists in DOM: ${rcmExists}`);

    const isRcmVisibleWithPermissions = await pages.admin2Page.isRcmDashboardMenuItemVisible();
    console.log(`🔍 Debug: RCM Dashboard visible: ${isRcmVisibleWithPermissions}`);

    expect(isRcmVisibleWithPermissions, `RCM Dashboard should be visible for practice ${TEST_DATA.practiceWithRcm.practice}`).toBe(true);

    console.log(`✅ ${TEST_DATA.practiceWithRcm.practice}: RCM Dashboard is correctly VISIBLE`);
    console.log('✅ Scenario 2 PASSED: Permissions working as expected\n');

    // Final validation - Verify the results are different
    expect(isRcmVisibleWithoutPermissions).not.toBe(isRcmVisibleWithPermissions);

    // SCENARIO 3: Click RCM Dashboard and validate iframe
    console.log('📋 SCENARIO 3: Validate RCM Dashboard Page and Iframe');
    console.log('-'.repeat(70));

    console.log('\n📋 Step 5: Clicking RCM Dashboard menu item...');
    await pages.admin2Page.clickRcmDashboard();
    await pages.rcmDashboardPage.waitForPageToLoad();
    console.log('✅ RCM Dashboard page loaded');

    // Validate iframe
    console.log('\n📋 Step 6: Validating RCM Dashboard iframe...');

    // First, list all iframes on the page
    const allIframes = await pages.rcmDashboardPage.getAllIframes();
    console.log(`\n🔍 Debug: Found ${allIframes.length} iframe(s) on the page:`);
    allIframes.forEach((iframe, index) => {
      console.log(`   ${index + 1}. Name: "${iframe.name}", ID: "${iframe.id}", Src: "${iframe.src}"`);
    });

    const iframeValidation = await pages.rcmDashboardPage.validateRcmDashboardIframe();

    console.log(`\n🔍 Debug: ${iframeValidation.details}`);
    console.log(`🔍 Debug: Iframe present: ${iframeValidation.isPresent}`);
    console.log(`🔍 Debug: Iframe visible: ${iframeValidation.isVisible}`);
    console.log(`🔍 Debug: Has name="rcmDashboard": ${iframeValidation.hasCorrectName}`);
    console.log(`🔍 Debug: Is Tableau iframe: ${iframeValidation.isTableauIframe}`);

    // Assertions for iframe
    expect(iframeValidation.isPresent, 'RCM Dashboard iframe should be present').toBe(true);
    expect(iframeValidation.isVisible, 'RCM Dashboard iframe should be visible').toBe(true);

    // The iframe should either have name="rcmDashboard" OR be a Tableau iframe
    const hasValidIframe = iframeValidation.hasCorrectName || iframeValidation.isTableauIframe;
    expect(hasValidIframe, 'Iframe should have name="rcmDashboard" or be a Tableau iframe').toBe(true);

    if (iframeValidation.isTableauIframe) {
      console.log('\n✅ RCM Dashboard iframe validated successfully (Tableau dashboard)');
    } else {
      console.log('\n✅ RCM Dashboard iframe validated successfully (name="rcmDashboard")');
    }
    console.log('✅ Scenario 3 PASSED: Iframe is present and displaying RCM Dashboard\n');

    console.log('=' .repeat(70));
    console.log('✅ ✅ ✅ RCM DASHBOARD PERMISSION VALIDATION SUCCESSFUL ✅ ✅ ✅');
    console.log('=' .repeat(70));
    console.log(`\n📊 TEST SUMMARY:`);
    console.log(`   • ${TEST_DATA.practiceWithoutRcm.practice}: RCM Dashboard HIDDEN ✓`);
    console.log(`   • ${TEST_DATA.practiceWithRcm.practice}: RCM Dashboard VISIBLE ✓`);
    console.log(`   • ${TEST_DATA.practiceWithRcm.practice}: RCM Dashboard iframe VALIDATED ✓`);
    console.log(`   • Permission-based access control: WORKING ✓\n`);
  });

  test('Validate error message when iframe fails to load', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n🔍 RCM DASHBOARD ERROR HANDLING TEST\n');
    console.log('=' .repeat(70));

    // Block the RCM token API endpoint - this is what triggers the error message
    console.log('\n📋 Step 1: Setting up route blocking for RCM token endpoint...');
    await page.route('**/RcmDashboard/getrcmtoken**', route => {
      console.log('🚫 Blocking RCM token request:', route.request().url());
      // Return a 404 or 500 error to trigger the error message
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    console.log('✅ Route interception configured - RCM token endpoint will return error');

    // Navigate to Log Book and select practice with RCM permissions
    console.log('\n📋 Step 2: Setting up practice with RCM permissions...');
    await pages.logBookPage.navigateFromDashboard(pages.dashboardPage, pages.patientPage);
    await pages.logBookPage.selectPracticeAndClinic(TEST_DATA.practiceWithRcm.practice, TEST_DATA.practiceWithRcm.clinic);
    await page.waitForTimeout(2000);
    console.log(`✅ Practice selected: ${TEST_DATA.practiceWithRcm.practice}`);

    // Navigate to Admin2 menu
    console.log('\n📋 Step 3: Opening Admin2 menu...');
    await pages.dashboardPage.navigateToAdmin2Menu();
    await pages.admin2Page.waitForAdmin2MenuToOpen();
    console.log('✅ Admin2 menu opened');

    // Verify RCM Dashboard is visible
    const isRcmVisible = await pages.admin2Page.isRcmDashboardMenuItemVisible();
    expect(isRcmVisible).toBe(true);
    console.log('✅ RCM Dashboard menu item is visible');

    // Click RCM Dashboard
    console.log('\n📋 Step 4: Navigating to RCM Dashboard...');
    await pages.admin2Page.clickRcmDashboard();
    await page.waitForTimeout(2000);
    console.log('✅ RCM Dashboard page opened');

    // Refresh the page to trigger error state with blocked token endpoint
    console.log('\n📋 Step 5: Refreshing page to trigger error state...');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for error message to appear
    console.log('✅ Page refreshed - error state should be triggered');

    // Validate the iframe error message
    console.log('\n📋 Step 6: Validating iframe error message...');
    const errorValidation = await pages.rcmDashboardPage.validateIframeErrorMessage();

    // Assertions for error message visibility and content
    expect(errorValidation.isVisible, 'Error message should be visible when token endpoint fails').toBe(true);
    expect(errorValidation.message, 'Error message text should match expected value').toBe(
      'The dashboard could not be loaded at this time. Please try again later.'
    );
    expect(errorValidation.hasExpectedText, 'Error message should have exact expected text').toBe(true);

    // Assertions for error element structure and attributes
    expect(errorValidation.attributes.id, 'Error element should have id="errorMessage"').toBe('errorMessage');
    expect(errorValidation.attributes.class, 'Error element should have class="error"').toBe('error');
    expect(errorValidation.attributes.role, 'Error element should have role="alert"').toBe('alert');
    expect(errorValidation.attributes.ariaLive, 'Error element should have aria-live="assertive"').toBe('assertive');
    expect(errorValidation.attributes.ariaAtomic, 'Error element should have aria-atomic="true"').toBe('true');

    console.log('\n✅ Error message validated successfully!');
    console.log(`   • Message: "${errorValidation.message}"`);
    console.log(`   • Element: #errorMessage with correct ARIA attributes`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ ✅ ✅ ERROR HANDLING VALIDATION SUCCESSFUL ✅ ✅ ✅');
    console.log('=' .repeat(70));
    console.log('\n📊 TEST SUMMARY:');
    console.log('   • RCM token endpoint blocked (returns 500 error) ✓');
    console.log('   • Page refreshed to trigger error state ✓');
    console.log('   • Error message displayed in UI ✓');
    console.log('   • Error message text validated ✓');
    console.log('   • Error element structure validated ✓');
    console.log('   • ARIA accessibility attributes validated ✓\n');
  });
});

/**
 * Login to the application
 */
async function loginToApplication(pages: PageObjects): Promise<void> {
  await pages.loginPage.goto();
  await pages.loginPage.login(config.loginUsername, config.loginPassword);
  await expect(pages.dashboardPage.logoutButton).toBeVisible();
  console.log('✅ Login successful');
}

/**
 * Navigate to Log Book and select a specific practice and clinic
 */
async function navigateToLogBookAndSelectPractice(
  page: Page,
  pages: PageObjects,
  practiceName: string,
  clinicName: string
): Promise<void> {
  console.log(`\n📋 Step 1: Navigating to Log Book...`);
  await pages.logBookPage.navigateFromDashboard(pages.dashboardPage, pages.patientPage);
  console.log('✅ Navigated to Log Book');

  console.log(`\n📋 Step 2: Selecting practice: ${practiceName}, clinic: ${clinicName}...`);
  await pages.logBookPage.selectPracticeAndClinic(practiceName, clinicName);
  await page.waitForTimeout(1000); // Wait for permissions to load
  console.log(`✅ Practice and clinic selected: ${practiceName} / ${clinicName}`);
}

/**
 * Navigate to Admin2 menu
 */
async function navigateToAdmin2Menu(pages: PageObjects): Promise<void> {
  console.log('\n📋 Step 3: Opening Admin2 menu...');
  await pages.dashboardPage.navigateToAdmin2Menu();
  await pages.admin2Page.waitForAdmin2MenuToOpen();
  console.log('✅ Admin2 menu opened');

  console.log('\n📋 Step 4: Checking RCM Dashboard visibility...');
}
