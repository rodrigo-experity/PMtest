import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class PatientPage extends BasePage {
  // Patient submenu items
  readonly logBookMenuItem: Locator;
  readonly summaryMenuItem: Locator;
  readonly demographicMenuItem: Locator;
  readonly payerInsuranceMenuItem: Locator;
  readonly receivableMenuItem: Locator;
  readonly carequalityMenuItem: Locator;
  readonly scanDocumentsMenuItem: Locator;

  // Patient menu dropdown
  readonly patientMenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Patient menu dropdown
    this.patientMenuDropdown = page.locator('#tdMenuBarItemPatient .dropdown-menu');

    // Patient submenu items
    this.logBookMenuItem = page.locator('#menu_Patient_LogBook');
    this.summaryMenuItem = page.locator('#menu_Patient_PatSummary');
    this.demographicMenuItem = page.locator('#menu_Patient_PatInfo');
    this.payerInsuranceMenuItem = page.locator('#menu_Patient_PatBilling');
    this.receivableMenuItem = page.locator('#menu_Patient_PatAR');
    this.carequalityMenuItem = page.locator('#menu_Patient_Carequality');
    this.scanDocumentsMenuItem = page.locator('#menu_Patient_BulkScanning');
  }

  // Visibility checks
  async isPatientMenuDropdownVisible() {
    return await this.patientMenuDropdown.isVisible();
  }

  async isLogBookMenuItemVisible() {
    return await this.logBookMenuItem.isVisible();
  }

  async isSummaryMenuItemVisible() {
    return await this.summaryMenuItem.isVisible();
  }

  async isDemographicMenuItemVisible() {
    return await this.demographicMenuItem.isVisible();
  }

  async isPayerInsuranceMenuItemVisible() {
    return await this.payerInsuranceMenuItem.isVisible();
  }

  async isReceivableMenuItemVisible() {
    return await this.receivableMenuItem.isVisible();
  }

  async isCarequalityMenuItemVisible() {
    return await this.carequalityMenuItem.isVisible();
  }

  async isScanDocumentsMenuItemVisible() {
    return await this.scanDocumentsMenuItem.isVisible();
  }

  // Click actions
  async clickLogBook() {
    await this.logBookMenuItem.click();
  }

  async clickSummary() {
    await this.summaryMenuItem.click();
  }

  async clickDemographic() {
    await this.demographicMenuItem.click();
  }

  async clickPayerInsurance() {
    await this.payerInsuranceMenuItem.click();
  }

  async clickReceivable() {
    await this.receivableMenuItem.click();
  }

  async clickCarequality() {
    await this.carequalityMenuItem.click();
  }

  async clickScanDocuments() {
    await this.scanDocumentsMenuItem.click();
  }

  // Get text from menu items
  async getLogBookText() {
    return await this.logBookMenuItem.textContent();
  }

  async getSummaryText() {
    return await this.summaryMenuItem.textContent();
  }

  async getDemographicText() {
    return await this.demographicMenuItem.textContent();
  }

  async getPayerInsuranceText() {
    return await this.payerInsuranceMenuItem.textContent();
  }

  async getReceivableText() {
    return await this.receivableMenuItem.textContent();
  }

  async getCarequalityText() {
    return await this.carequalityMenuItem.textContent();
  }

  async getScanDocumentsText() {
    return await this.scanDocumentsMenuItem.textContent();
  }

  // Utility methods
  async getAllPatientMenuItems() {
    return this.page.locator('#tdMenuBarItemPatient .dropdown-menu li');
  }

  async getPatientMenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemPatient .dropdown-menu li').count();
  }

  async waitForPatientMenuToOpen() {
    await this.patientMenuDropdown.waitFor({ state: 'visible' });
  }
}
