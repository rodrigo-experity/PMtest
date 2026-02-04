import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class PatientRegistrationForm extends BasePage {
  // Form fields
  readonly lastNameField: Locator;
  readonly firstNameField: Locator;
  readonly dobField: Locator;
  readonly suffixField: Locator;
  readonly ssnField: Locator;
  readonly phoneField: Locator;
  readonly cellPhoneField: Locator;
  readonly patientNumberField: Locator;
  readonly reasonForVisitDropdown: Locator;
  readonly quickVisitCheckbox: Locator;

  // Buttons
  readonly registerButton: Locator;
  readonly verifyButton: Locator;
  readonly eRegisterButton: Locator;
  readonly cancelButton: Locator;

  // Modal/Dialog
  readonly modalDialog: Locator;

  constructor(page: Page) {
    super(page);

    // Required fields
    this.lastNameField = page.locator('#txt_enterpriseSearch_LastName');
    this.dobField = page.locator('#txt_enterpriseSearch_DOB');
    this.reasonForVisitDropdown = page.locator('#ddlReasonForVisitSelect');

    // Optional fields
    this.firstNameField = page.locator('#txtFirstName');
    this.suffixField = page.locator('#txtSuffix');
    this.ssnField = page.locator('#txtSSN');
    this.phoneField = page.locator('#txtPhone');
    this.cellPhoneField = page.locator('#txtCellPhone');
    this.patientNumberField = page.locator('#txtPatNum');
    this.quickVisitCheckbox = page.locator('#cbQuickVisit');

    // Buttons
    this.registerButton = page.locator('#btnRegisterPatient');
    this.verifyButton = page.locator('#btnVerify');
    this.eRegisterButton = page.locator('#btnSendPatToKiosk');
    this.cancelButton = page.locator('.Button-Exit').first();

    // Modal
    this.modalDialog = page.locator('#colorbox[role="dialog"]');
  }

  // Wait for form to be visible
  async waitForFormToLoad() {
    await this.lastNameField.waitFor({ state: 'visible', timeout: 10000 });
    await this.dobField.waitFor({ state: 'visible' });
    await this.registerButton.waitFor({ state: 'visible' });
  }

  // Fill required fields
  async fillRequiredFields(lastName: string, dob: string, reasonForVisit: string) {
    await this.lastNameField.fill(lastName);
    await this.dobField.fill(dob);

    // Wait for dropdown to be ready and select option
    await this.reasonForVisitDropdown.waitFor({ state: 'visible' });
    await this.reasonForVisitDropdown.selectOption({ label: reasonForVisit });

    // Wait a bit for validation
    await this.page.waitForTimeout(500);
  }

  // Fill optional fields
  async fillOptionalFields(data: {
    firstName?: string;
    suffix?: string;
    ssn?: string;
    phone?: string;
    cellPhone?: string;
    patientNumber?: string;
  }) {
    if (data.firstName) {
      await this.firstNameField.fill(data.firstName);
    }
    if (data.suffix) {
      await this.suffixField.fill(data.suffix);
    }
    if (data.ssn) {
      await this.ssnField.fill(data.ssn);
    }
    if (data.phone) {
      await this.phoneField.fill(data.phone);
    }
    if (data.cellPhone) {
      await this.cellPhoneField.fill(data.cellPhone);
    }
    if (data.patientNumber) {
      await this.patientNumberField.fill(data.patientNumber);
    }
  }

  // Fill complete patient information
  async fillPatientInformation(data: {
    lastName: string;
    firstName: string;
    dob: string;
    reasonForVisit: string;
    suffix?: string;
    ssn?: string;
    phone?: string;
    cellPhone?: string;
  }) {
    await this.fillRequiredFields(data.lastName, data.dob, data.reasonForVisit);
    await this.fillOptionalFields({
      firstName: data.firstName,
      suffix: data.suffix,
      ssn: data.ssn,
      phone: data.phone,
      cellPhone: data.cellPhone
    });
  }

  // Actions
  async clickRegister() {
    // Check if button is enabled, if not use force
    const isEnabled = await this.registerButton.isEnabled();
    if (isEnabled) {
      await this.registerButton.click();
    } else {
      // Force click if validation hasn't run yet
      await this.registerButton.click({ force: true });
    }
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickERegister() {
    await this.eRegisterButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async checkQuickVisit() {
    await this.quickVisitCheckbox.check();
  }

  async uncheckQuickVisit() {
    await this.quickVisitCheckbox.uncheck();
  }

  // Visibility checks
  async isFormVisible() {
    return await this.modalDialog.isVisible();
  }

  async isRegisterButtonVisible() {
    return await this.registerButton.isVisible();
  }

  async isRegisterButtonEnabled() {
    return await this.registerButton.isEnabled();
  }

  // Get field values
  async getLastName() {
    return await this.lastNameField.inputValue();
  }

  async getFirstName() {
    return await this.firstNameField.inputValue();
  }

  async getDOB() {
    return await this.dobField.inputValue();
  }

  /**
   * Verify patient and register if not found - common workflow
   * Fills patient info, clicks verify, then clicks register
   */
  async verifyAndRegisterNewPatient(data: {
    lastName: string;
    firstName: string;
    dob: string;
    reasonForVisit: string;
    ssn?: string;
    phone?: string;
    cellPhone?: string;
  }): Promise<void> {
    // Fill patient information
    await this.fillPatientInformation(data);

    // Verify patient (expect not found)
    await this.clickVerify();
    await this.page.waitForTimeout(2000);

    // Register patient
    await this.clickRegister();
    await this.page.waitForTimeout(3000);
  }
}
