import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import type { DashboardPage } from '../common/DashboardPage';
import type { PatientPage } from './PatientPage';

export class LogBookPage extends BasePage {
  // Add buttons for different patient types
  readonly addPrivateButton: Locator;
  readonly addWCButton: Locator;
  readonly addEPSButton: Locator;
  readonly addMiscButton: Locator;

  // Practice and Clinic dropdowns
  readonly practiceDropdown: Locator;
  readonly clinicDropdown: Locator;

  // Log book container
  readonly logBookContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Add buttons for different patient types
    this.addPrivateButton = page.locator('#Button-Add-New-Priv');
    this.addWCButton = page.locator('#Button-Add-New-WC');
    this.addEPSButton = page.locator('#Button-Add-New-EPS');
    this.addMiscButton = page.locator('#Button-Add-New-Misc');

    // Practice and Clinic dropdowns
    this.practiceDropdown = page.locator('#ddlPractice');
    this.clinicDropdown = page.locator('#ddlClinic');

    // Log book container
    this.logBookContainer = page.locator('#log-book');
  }

  // Visibility checks
  async isLogBookContainerVisible() {
    return await this.logBookContainer.isVisible();
  }

  async isAddPrivateButtonVisible() {
    return await this.addPrivateButton.isVisible();
  }

  async isAddWCButtonVisible() {
    return await this.addWCButton.isVisible();
  }

  async isAddEPSButtonVisible() {
    return await this.addEPSButton.isVisible();
  }

  async isAddMiscButtonVisible() {
    return await this.addMiscButton.isVisible();
  }

  async isPracticeDropdownVisible() {
    return await this.practiceDropdown.isVisible();
  }

  // Click actions
  async clickAddPrivate() {
    await this.addPrivateButton.click();
  }

  async clickAddWC() {
    await this.addWCButton.click();
  }

  async clickAddEPS() {
    await this.addEPSButton.click();
  }

  async clickAddMisc() {
    await this.addMiscButton.click();
  }

  // Practice dropdown actions
  async selectPractice(practiceValue: string) {
    await this.practiceDropdown.selectOption({ label: practiceValue });
    await this.page.waitForTimeout(1000); // Wait for clinic dropdown to populate
  }

  async getSelectedPractice() {
    return await this.practiceDropdown.inputValue();
  }

  // Clinic dropdown actions
  async selectClinic(clinicValue: string) {
    await this.clinicDropdown.selectOption({ label: clinicValue });
    await this.page.waitForTimeout(500);
  }

  async getSelectedClinic() {
    return await this.clinicDropdown.inputValue();
  }

  async isClinicDropdownVisible() {
    return await this.clinicDropdown.isVisible();
  }

  // Wait for page to load
  async waitForLogBookToLoad() {
    await this.logBookContainer.waitFor({ state: 'visible' });
  }

  /**
   * Select practice and clinic - common workflow
   * @param practice - Practice name to select
   * @param clinic - Clinic name to select
   */
  async selectPracticeAndClinic(practice: string, clinic: string): Promise<void> {
    await this.selectPractice(practice);
    await this.selectClinic(clinic);
  }

  /**
   * Click the appropriate Add Patient button based on type
   * @param patientType - Type of patient to add (Private, WorkerComp, or EPS)
   */
  async addPatientByType(patientType: 'Private' | 'WorkerComp' | 'EPS'): Promise<void> {
    switch (patientType) {
      case 'Private':
        await this.clickAddPrivate();
        break;
      case 'WorkerComp':
        await this.clickAddWC();
        break;
      case 'EPS':
        await this.clickAddEPS();
        break;
    }
  }

  /**
   * Navigate to Log Book from Dashboard - complete workflow
   * @param dashboardPage - DashboardPage instance for navigation
   * @param patientPage - PatientPage instance for menu navigation
   */
  async navigateFromDashboard(
    dashboardPage: DashboardPage,
    patientPage: PatientPage
  ): Promise<void> {
    await dashboardPage.navigateToPatientMenu();
    await patientPage.waitForPatientMenuToOpen();
    await patientPage.clickLogBook();
    await this.waitForLogBookToLoad();
  }
}
