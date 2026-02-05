import { test, expect, Page } from '@playwright/test';
import {
  LoginPage,
  DashboardPage,
  PatientPage,
  LogBookPage,
  PatientRegistrationForm,
  PatientDetailsPage,
} from '../../pages';
import { config } from '../../config';
import { generateRandomDOB, generateRandomPatient } from '../../utils/testDataHelpers';

/**
 * E2E Patient Registration Workflow Test
 *
 * This test suite covers the complete patient registration workflow:
 * 1. Login and navigation to Log Book
 * 2. Practice and Clinic selection
 * 3. Patient type selection (Private/WC/EPS)
 * 4. Patient search and verification
 * 5. Patient registration
 * 6. Patient details completion
 * 7. Demographics and HIPAA information
 * 8. Save and verify registration success
 */

// Test data constants
const TEST_DATA = {
  practice: 'TEST',
  clinic: 'TEST',
  lastName: 'RTEST',
  address: '123 test street',
  zip: '85710',
  city: 'TUCSON',
  ssn: '000-00-0000',
  phone: '6027999999',
  reasonForVisit: 'Injury',
  employerName: 'Test Company Inc',
  demographics: {
    race: 'White' as const,
    ethnicity: 'NotHispanic' as const,
    language: 'English',
  },
};

// Page objects interface
interface PageObjects {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  patientPage: PatientPage;
  logBookPage: LogBookPage;
  registrationForm: PatientRegistrationForm;
  patientDetailsPage: PatientDetailsPage;
}

// Patient registration options
interface RegistrationOptions {
  patientType: 'Private' | 'WorkerComp' | 'EPS';
  portalAccess: boolean;
  requiresEmployer?: boolean;
  verbose?: boolean;
}

// Patient data interface
interface PatientData {
  firstName: string;
  sex: 'Male' | 'Female';
  dob: string;
}

test.describe('Patient Registration E2E', () => {
  let pages: PageObjects;

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    pages = {
      loginPage: new LoginPage(page),
      dashboardPage: new DashboardPage(page),
      patientPage: new PatientPage(page),
      logBookPage: new LogBookPage(page),
      registrationForm: new PatientRegistrationForm(page),
      patientDetailsPage: new PatientDetailsPage(page),
    };

    // Perform login and navigation
    await loginAndNavigateToLogBook(page, pages);
  });

  test('Complete patient registration workflow - Private patient', async ({ page }) => {
    test.setTimeout(120000);

    await registerPatient(page, pages, {
      patientType: 'Private',
      portalAccess: true,
      verbose: true,
    });
  });

  test('Patient registration workflow - Worker Comp patient', async ({ page }) => {
    test.setTimeout(120000);

    await registerPatient(page, pages, {
      patientType: 'WorkerComp',
      portalAccess: true,
      requiresEmployer: true,
    });
  });

  test('Patient registration workflow - EPS patient', async ({ page }) => {
    test.setTimeout(120000);

    await registerPatient(page, pages, {
      patientType: 'EPS',
      portalAccess: false,
      requiresEmployer: true,
    });
  });
});

/**
 * Login and navigate to Log Book
 */
async function loginAndNavigateToLogBook(page: Page, pages: PageObjects): Promise<void> {
  await pages.loginPage.goto();
  await pages.loginPage.login(config.loginUsername, config.loginPassword);
  await expect(pages.dashboardPage.logoutButton).toBeVisible();
  console.log('✅ Login successful');

  await pages.logBookPage.navigateFromDashboard(pages.dashboardPage, pages.patientPage);
  console.log('✅ Navigated to Log Book');
}

/**
 * Select practice and clinic
 */
async function selectPracticeAndClinic(pages: PageObjects, verbose = false): Promise<void> {
  if (verbose) console.log('\n📋 Step 1: Selecting Practice and Clinic...');

  await pages.logBookPage.selectPracticeAndClinic(TEST_DATA.practice, TEST_DATA.clinic);

  if (verbose) console.log(`✅ Practice: ${TEST_DATA.practice}, Clinic: ${TEST_DATA.clinic} selected`);
}

/**
 * Click the appropriate Add button based on patient type
 */
async function clickAddPatientButton(
  pages: PageObjects,
  patientType: 'Private' | 'WorkerComp' | 'EPS',
  verbose = false
): Promise<void> {
  if (verbose) console.log(`\n📋 Step 2: Clicking Add ${patientType} button...`);

  await pages.logBookPage.addPatientByType(patientType);
  await pages.registrationForm.waitForFormToLoad();

  if (verbose) console.log('✅ LogDetail page loaded');
}

/**
 * Fill patient search form and verify/register
 */
async function fillPatientSearchAndRegister(
  page: Page,
  pages: PageObjects,
  verbose = false
): Promise<PatientData> {
  const patient = generateRandomPatient();
  const dob = generateRandomDOB();

  if (verbose) console.log('\n📋 Step 3: Filling patient search parameters...');

  const searchData = {
    lastName: TEST_DATA.lastName,
    firstName: patient.firstName,
    dob: dob,
    ssn: TEST_DATA.ssn,
    phone: TEST_DATA.phone,
    cellPhone: TEST_DATA.phone,
    reasonForVisit: TEST_DATA.reasonForVisit,
  };

  if (verbose) console.log(`✅ Patient data: ${patient.firstName} ${TEST_DATA.lastName}, DOB: ${dob}`);

  if (verbose) console.log('\n📋 Step 4-5: Verifying and registering patient...');

  await pages.registrationForm.verifyAndRegisterNewPatient(searchData);

  if (verbose) console.log('✅ Patient verified and registered - navigated to patient details page');

  return { ...patient, dob };
}

/**
 * Fill patient details form
 */
async function fillPatientDetails(
  pages: PageObjects,
  patientData: PatientData,
  portalAccess: boolean,
  requiresEmployer: boolean,
  verbose = false
): Promise<void> {
  // Fill basic patient information
  if (verbose) console.log('\n📋 Step 6: Filling patient information...');

  await pages.patientDetailsPage.fillPatientInfo({
    sexAtBirth: patientData.sex,
    address: TEST_DATA.address,
    zip: TEST_DATA.zip,
    city: TEST_DATA.city,
    employerName: requiresEmployer ? TEST_DATA.employerName : undefined,
  });

  if (verbose) {
    const employerInfo = requiresEmployer ? `, Employer: ${TEST_DATA.employerName}` : '';
    console.log(`✅ Patient info filled: ${patientData.sex}, ${TEST_DATA.address}, ${TEST_DATA.zip}, ${TEST_DATA.city}${employerInfo}`);
  }

  // Set patient portal access
  if (verbose) console.log('\n📋 Step 7: Setting patient portal access...');
  await pages.patientDetailsPage.setPatientPortalAccess(portalAccess);
  if (verbose) console.log(`✅ Patient portal access: ${portalAccess ? 'Yes' : 'No'}`);

  // Fill demographics
  if (verbose) console.log('\n📋 Step 8: Filling demographics...');

  await pages.patientDetailsPage.fillDemographics({
    race: TEST_DATA.demographics.race,
    ethnicity: TEST_DATA.demographics.ethnicity,
    preferredLanguage: TEST_DATA.demographics.language,
  });

  if (verbose) {
    console.log(`✅ Demographics filled: ${TEST_DATA.demographics.race}, Not Hispanic or Latino, ${TEST_DATA.demographics.language}`);
  }
}

/**
 * Save patient with HIPAA handling
 */
async function savePatientWithHIPAA(page: Page, pages: PageObjects, verbose = false): Promise<void> {
  if (verbose) console.log('\n📋 Step 9-11: Saving patient with HIPAA handling...');

  // Set up dialog handler for verbose logging
  if (verbose) {
    page.once('dialog', async (dialog) => {
      console.log(`⚠️  Alert: ${dialog.message()}`);
      console.log('✅ Alert will be dismissed');
    });
  }

  await pages.patientDetailsPage.saveWithHipaaHandling(true);

  if (verbose) console.log('✅ Patient saved with HIPAA date');
}

/**
 * Verify registration success
 */
async function verifyRegistrationSuccess(
  page: Page,
  pages: PageObjects,
  patientData: PatientData,
  verbose = false
): Promise<void> {
  if (verbose) console.log('\n📋 Step 12: Verifying registration success...');

  const result = await pages.patientDetailsPage.verifySuccessfulRegistration();
  expect(result.isSuccessful, 'Patient should be registered successfully').toBe(true);

  if (verbose) {
    console.log('✅ Balance summary section is visible');

    if (result.hasZeroBalance) {
      console.log('✅ Total balance is $0.00');
    } else {
      console.log('⚠️  Balance verification skipped (not immediately available)');
    }
  }

  if (verbose) {
    console.log('\n✅ ✅ ✅ PATIENT REGISTRATION COMPLETED SUCCESSFULLY ✅ ✅ ✅\n');
    console.log(`Registered Patient: ${patientData.firstName} ${TEST_DATA.lastName} (${patientData.sex})`);
    console.log(`Date of Birth: ${patientData.dob}`);
    console.log(`Registration completed at: ${new Date().toLocaleString()}`);
  } else {
    console.log(`✅ ${patientData.firstName} ${TEST_DATA.lastName} (${patientData.sex}) registered successfully`);
  }
}

/**
 * Main registration workflow - orchestrates all steps
 */
async function registerPatient(
  page: Page,
  pages: PageObjects,
  options: RegistrationOptions
): Promise<void> {
  const { patientType, portalAccess, requiresEmployer = false, verbose = false } = options;

  // Step 1: Select Practice and Clinic
  await selectPracticeAndClinic(pages, verbose);

  // Step 2: Click appropriate Add button
  await clickAddPatientButton(pages, patientType, verbose);

  // Steps 3-5: Fill search form, verify, and register
  const patientData = await fillPatientSearchAndRegister(page, pages, verbose);

  // Steps 6-8: Fill patient details
  await fillPatientDetails(pages, patientData, portalAccess, requiresEmployer, verbose);

  // Steps 9-11: Save with HIPAA handling
  await savePatientWithHIPAA(page, pages, verbose);

  // Step 12: Verify success
  await verifyRegistrationSuccess(page, pages, patientData, verbose);
}
