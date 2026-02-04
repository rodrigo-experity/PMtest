import { Page, FrameLocator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

/**
 * Page Object for Bulk Scanning page
 * NOTE: All elements are inside an iframe with ID="content"
 */
export class BulkScanningPage extends BasePage {
  // IFrame accessor
  private get iframe(): FrameLocator {
    return this.page.frameLocator('#content');
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Bulk Scanning page through menu
   */
  async navigateToBulkScanning() {
    const patientMenu = this.page.locator('#tdMenuBarItemPatient');
    await patientMenu.click();

    const scanDocumentsMenuItem = this.page.locator('#menu_Patient_BulkScanning');
    await scanDocumentsMenuItem.click();

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for page and iframe to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000); // Wait for Angular to render
  }

  // ==================== FORM FIELD LOCATORS ====================

  /**
   * Description field (mat-select dropdown)
   */
  get descriptionField() {
    return this.iframe.locator('#mat-select-ng-cli-universal3');
  }

  /**
   * Category field (mat-select dropdown)
   */
  get categoryField() {
    return this.iframe.locator('#mat-select-ng-cli-universal4');
  }

  /**
   * Notes field (input)
   */
  get notesField() {
    return this.iframe.locator('#mat-input-ng-cli-universal4');
  }

  /**
   * DOB (Date of Birth) field (input)
   * Note: Swapped IDs - universal3 is DOB, universal2 is Last Name
   */
  get dobField() {
    return this.iframe.locator('#mat-input-ng-cli-universal3');
  }

  /**
   * Last Name field (input)
   * Note: Swapped IDs - universal2 is Last Name, universal3 is DOB
   */
  get lastNameField() {
    return this.iframe.locator('#mat-input-ng-cli-universal2');
  }

  /**
   * Upload button (must click this first to reveal file input)
   */
  get uploadButton() {
    return this.iframe.locator('button:has-text("Upload")').first();
  }

  /**
   * File input for uploading documents (appears after clicking Upload button)
   */
  get fileInput() {
    return this.iframe.locator('input[type="file"]').first();
  }

  /**
   * Upload dialog/modal
   */
  get uploadDialog() {
    return this.iframe.locator('[role="dialog"], .modal, .dialog').first();
  }

  /**
   * Close button for dialogs/modals
   */
  get closeButton() {
    return this.iframe.locator('button:has-text("Close"), button:has-text("×"), button.close, [aria-label="Close"]').first();
  }

  /**
   * Scan control overlay/container that may block interactions
   */
  get scanControlOverlay() {
    return this.iframe.locator('.scan-control-container, .cdk-overlay-container').first();
  }

  /**
   * Search button (for patient search, typically a search icon button)
   */
  get searchButton() {
    return this.iframe.locator('button[type="submit"]:near(:text("DOB")), button.search-btn, [class*="search-btn"]').first();
  }

  /**
   * Save button (appears in dialog/overlay after upload)
   */
  get saveButton() {
    return this.iframe.locator('.cdk-overlay-container button:has-text("Save"), .modal button:has-text("Save"), #btn-save, button:has-text("Save")').first();
  }

  /**
   * Cancel button
   */
  get cancelButton() {
    return this.iframe.locator('button:has-text("Cancel"), input[type="button"][value="Cancel"]').first();
  }

  // ==================== MESSAGE LOCATORS ====================

  /**
   * Success message
   */
  get successMessage() {
    return this.iframe.locator('.success-message, .alert-success, [class*="success"]').first();
  }

  /**
   * Error message (includes toast notifications)
   */
  get errorMessage() {
    return this.iframe.locator('.error-message, .alert-error, [class*="error"], .toast-error, .ngx-toastr').first();
  }

  /**
   * Toast error notification (ngx-toastr)
   */
  get toastError() {
    return this.iframe.locator('.toast-error, .ngx-toastr, [class*="toast-error"]').first();
  }

  // ==================== DOCUMENT LIST LOCATORS ====================

  /**
   * Document list container
   */
  get documentList() {
    return this.iframe.locator('.document-list, table, [class*="list"], [class*="grid"]').first();
  }

  /**
   * First document row/item in the list (mat-row in the data table)
   */
  get firstDocument() {
    return this.iframe.locator('mat-row.mat-mdc-row, .mat-mdc-row[role="row"]').first();
  }

  /**
   * All document rows (mat-rows in the data table)
   */
  get documentRows() {
    return this.iframe.locator('mat-row.mat-mdc-row, .mat-mdc-row[role="row"]');
  }

  /**
   * Document counter badge (shows total document count)
   */
  get documentCounter() {
    return this.iframe.locator('.rounded-border, .counter, .badge, [class*="count"]').first();
  }

  // ==================== PREVIEW LOCATORS ====================

  /**
   * Document preview/center panel
   */
  get documentPreview() {
    return this.iframe.locator('.center-panel, .preview-panel, .document-preview, [class*="preview"]').first();
  }

  // ==================== PATIENT SEARCH LOCATORS ====================

  /**
   * Patient search results (table or list)
   */
  get searchResults() {
    return this.iframe.locator('.search-results, .patient-results, table.results, mat-table, [class*="results"], [class*="patient-list"]').first();
  }

  /**
   * Patient name in search results (searches for text match)
   */
  patientNameResult(patientName: string) {
    // Look for the patient name in any visible text
    return this.iframe.locator(`text=${patientName}`).first();
  }

  /**
   * DOS (Date of Service) date selector - selects any date cell in search results
   */
  get dosDate() {
    return this.iframe.locator('td.mat-mdc-cell, .dos-date, [data-testid=dos-date]').first();
  }

  /**
   * +Pat Docs option (div with dashed-border class to associate document with patient)
   * Note: Multiple elements exist, need to filter for visible one
   */
  get patDocsOption() {
    return this.iframe.locator('div.dashed-border:has-text("+ Pat Docs")').filter({ hasText: '+ Pat Docs' });
  }

  /**
   * Recent patient section
   */
  get recentPatientSection() {
    return this.iframe.locator('.recent-patient, #recentPatients, [class*="recent"]').first();
  }

  /**
   * Visit type indicator
   */
  get visitType() {
    return this.iframe.locator('text="visit", [data-type="visit"]').first();
  }

  /**
   * Patient type indicator
   */
  get patientType() {
    return this.iframe.locator('text="Patient", [data-type="Patient"]').first();
  }

  /**
   * mat-option selector (for dropdowns)
   */
  get matOptions() {
    return this.iframe.locator('mat-option');
  }

  // ==================== FIELD STATE CHECKS ====================

  /**
   * Check if description field is disabled
   */
  async isDescriptionDisabled(): Promise<boolean> {
    const ariaDisabled = await this.descriptionField.getAttribute('aria-disabled');
    return ariaDisabled === 'true';
  }

  /**
   * Check if category field is disabled
   */
  async isCategoryDisabled(): Promise<boolean> {
    const ariaDisabled = await this.categoryField.getAttribute('aria-disabled');
    return ariaDisabled === 'true';
  }

  /**
   * Check if notes field is disabled
   */
  async isNotesDisabled(): Promise<boolean> {
    return await this.notesField.isDisabled();
  }

  /**
   * Check if DOB field is disabled
   */
  async isDobDisabled(): Promise<boolean> {
    return await this.dobField.isDisabled();
  }

  /**
   * Check if Last Name field is disabled
   */
  async isLastNameDisabled(): Promise<boolean> {
    return await this.lastNameField.isDisabled();
  }

  // ==================== ACTIONS ====================

  /**
   * Upload a single document
   * NOTE: This clicks the Upload button first to reveal the file input
   * After uploading, you need to click Save in the dialog to commit the uploads
   */
  async uploadDocument(filePath: string) {
    // Click Upload button to open file picker dialog
    await this.uploadButton.click();
    await this.page.waitForTimeout(1000);

    // Now file input should be visible
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(2000); // Wait for upload to process

    // NOTE: Dialog stays open - caller should click Save to commit the upload
  }

  /**
   * Upload multiple documents
   * NOTE: This clicks the Upload button first to reveal the file input
   * After uploading, you need to click Save in the dialog to commit the uploads
   */
  async uploadMultipleDocuments(filePaths: string[]) {
    // Click Upload button to open file picker dialog
    await this.uploadButton.click();
    await this.page.waitForTimeout(1000);

    // Now file input should be visible
    await this.fileInput.setInputFiles(filePaths);
    await this.page.waitForTimeout(2000);

    // NOTE: Dialog stays open - caller should click Save to commit the upload
  }

  /**
   * Select the first uploaded document from the list
   */
  async selectFirstDocument() {
    const count = await this.firstDocument.count();
    if (count > 0) {
      // Try normal click first, if blocked try force click
      try {
        await this.firstDocument.click({ timeout: 5000 });
      } catch (error) {
        // If click is blocked by overlay, try force click
        await this.firstDocument.click({ force: true });
      }
      await this.page.waitForTimeout(500);
      return true;
    }
    return false;
  }

  /**
   * Select Description from dropdown
   */
  async selectDescription(optionIndex: number = 1) {
    const isDisabled = await this.isDescriptionDisabled();
    if (!isDisabled) {
      await this.descriptionField.click();
      await this.page.waitForTimeout(500);
      await this.matOptions.nth(optionIndex - 1).click();
      await this.page.waitForTimeout(500);
      return true;
    }
    return false;
  }

  /**
   * Select Category from dropdown
   */
  async selectCategory(optionIndex: number = 1) {
    const isDisabled = await this.isCategoryDisabled();
    if (!isDisabled) {
      await this.categoryField.click();
      await this.page.waitForTimeout(500);
      await this.matOptions.nth(optionIndex - 1).click();
      await this.page.waitForTimeout(500);
      return true;
    }
    return false;
  }

  /**
   * Fill Last Name field
   */
  async fillLastName(lastName: string) {
    const isDisabled = await this.isLastNameDisabled();
    if (!isDisabled) {
      await this.lastNameField.fill(lastName);
      return true;
    }
    return false;
  }

  /**
   * Fill DOB field
   */
  async fillDOB(dob: string) {
    const isDisabled = await this.isDobDisabled();
    if (!isDisabled) {
      await this.dobField.fill(dob);
      return true;
    }
    return false;
  }

  /**
   * Fill Notes field
   */
  async fillNotes(notes: string) {
    const isDisabled = await this.isNotesDisabled();
    if (!isDisabled) {
      await this.notesField.fill(notes);
      return true;
    }
    return false;
  }

  /**
   * Click search button (for patient search)
   */
  async clickSearch() {
    const count = await this.searchButton.count();
    if (count > 0) {
      const visible = await this.searchButton.isVisible().catch(() => false);
      if (visible) {
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
        return true;
      }
    }
    return false;
  }

  /**
   * Click save button (waits for it to become visible)
   */
  async clickSave() {
    // Try to find Save button in dialog overlay first
    const dialogSaveBtn = this.iframe.locator('.cdk-overlay-container button:has-text("Save")');
    const dialogCount = await dialogSaveBtn.count();

    if (dialogCount > 0) {
      try {
        await dialogSaveBtn.waitFor({ state: 'visible', timeout: 5000 });
        await dialogSaveBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        console.log('✅ Save button clicked in overlay dialog');
        return true;
      } catch (error) {
        console.log('⚠️ Dialog Save button found but not clickable');
      }
    }

    // Fallback to regular save button
    const count = await this.saveButton.count();
    if (count > 0) {
      try {
        await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        return true;
      } catch (error) {
        console.log('⚠️ Save button not visible or clickable');
        return false;
      }
    }
    return false;
  }

  /**
   * Search for a patient by last name and DOB
   */
  async searchPatient(lastName: string, dob: string) {
    await this.fillLastName(lastName);
    await this.fillDOB(dob);
    await this.clickSearch();
  }

  /**
   * Select a patient from search results (clicks on patient name)
   */
  async selectPatient(patientName: string) {
    // Wait a bit for results to fully load
    await this.page.waitForTimeout(1000);

    const patient = this.patientNameResult(patientName);
    const count = await patient.count();

    if (count > 0) {
      // Check if visible
      const visible = await patient.isVisible().catch(() => false);
      if (visible) {
        await patient.click();
        await this.page.waitForTimeout(2000);
        return true;
      }
    }

    // If not found, log what patients are visible
    console.log(`  ⚠️ "${patientName}" not found, looking for any patient names...`);
    const allPatients = await this.iframe.locator('mat-cell, td').allTextContents();
    const patientTexts = allPatients.filter(t => t.trim().length > 0).slice(0, 10);
    if (patientTexts.length > 0) {
      console.log(`  Found ${patientTexts.length} cells: ${patientTexts.join(', ')}`);
    }

    return false;
  }

  /**
   * Select DOS date
   */
  async selectDosDate() {
    const count = await this.dosDate.count();
    if (count > 0) {
      await this.dosDate.click();
      await this.page.waitForTimeout(1000);
      return true;
    }
    return false;
  }

  /**
   * Select +Pat Docs option (waits for visibility)
   * Note: Multiple dashed-border elements exist, need to find the visible one
   */
  async selectPatDocs() {
    // Wait a moment for the option to appear after selecting patient
    await this.page.waitForTimeout(2000);

    // Get all +Pat Docs elements
    const allPatDocs = this.iframe.locator('div.dashed-border:has-text("+ Pat Docs")');
    const count = await allPatDocs.count();

    if (count > 0) {
      // Find the visible one
      for (let i = 0; i < count; i++) {
        const elem = allPatDocs.nth(i);
        const visible = await elem.isVisible().catch(() => false);
        if (visible) {
          await elem.click();
          await this.page.waitForTimeout(1000);
          return true;
        }
      }
    }
    return false;
  }

  // ==================== VERIFICATION HELPERS ====================

  /**
   * Get document count from document rows
   */
  async getDocumentCount(): Promise<number> {
    return await this.documentRows.count();
  }

  /**
   * Get document counter value (from rounded-border element)
   */
  async getDocumentCounterValue(): Promise<number> {
    const count = await this.documentCounter.count();
    if (count > 0) {
      const text = await this.documentCounter.textContent();
      const value = parseInt(text?.trim() || '0', 10);
      return isNaN(value) ? 0 : value;
    }
    return 0;
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    const count = await this.successMessage.count();
    if (count > 0) {
      return await this.successMessage.isVisible({ timeout: 5000 }).catch(() => false);
    }
    return false;
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    const count = await this.errorMessage.count();
    if (count > 0) {
      return await this.errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
    }
    return false;
  }

  /**
   * Get success message text
   */
  async getSuccessMessageText(): Promise<string | null> {
    const visible = await this.isSuccessMessageVisible();
    if (visible) {
      return await this.successMessage.textContent();
    }
    return null;
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string | null> {
    const visible = await this.isErrorMessageVisible();
    if (visible) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Check if document list is visible
   */
  async isDocumentListVisible(): Promise<boolean> {
    const count = await this.documentList.count();
    if (count > 0) {
      return await this.documentList.isVisible().catch(() => false);
    }
    return false;
  }

  /**
   * Check if document preview is visible
   */
  async isDocumentPreviewVisible(): Promise<boolean> {
    const count = await this.documentPreview.count();
    if (count > 0) {
      return await this.documentPreview.isVisible().catch(() => false);
    }
    return false;
  }

  /**
   * Check if search results are visible (checks multiple possible result indicators)
   */
  async areSearchResultsVisible(): Promise<boolean> {
    // Check if search results container is visible
    const count = await this.searchResults.count();
    if (count > 0 && await this.searchResults.isVisible({ timeout: 5000 }).catch(() => false)) {
      return true;
    }

    // Also check if patient name results appeared
    await this.page.waitForTimeout(1000);
    const anyText = await this.iframe.locator('mat-cell, td, .patient-name, [class*="patient"]').count();
    return anyText > 0;
  }

  /**
   * Check if recent patient section is visible
   */
  async isRecentPatientSectionVisible(): Promise<boolean> {
    const count = await this.recentPatientSection.count();
    if (count > 0) {
      return await this.recentPatientSection.isVisible().catch(() => false);
    }
    return false;
  }

  // ==================== WORKFLOW METHODS ====================

  /**
   * Complete workflow: Upload and select document, then select description and category
   */
  async uploadAndPrepareDocument(filePath: string) {
    await this.uploadDocument(filePath);
    const selected = await this.selectFirstDocument();
    if (selected) {
      await this.selectDescription();
      await this.selectCategory();
    }
    return selected;
  }

  /**
   * Complete workflow: Upload, prepare document, and search for patient
   */
  async uploadAndSearchPatient(filePath: string, lastName: string, dob: string) {
    await this.uploadAndPrepareDocument(filePath);
    await this.searchPatient(lastName, dob);
  }

  /**
   * Associate document with patient visit (DOS)
   */
  async associateWithPatientVisit(filePath: string, lastName: string, dob: string, patientName: string) {
    await this.uploadAndSearchPatient(filePath, lastName, dob);
    await this.selectPatient(patientName);
    await this.selectDosDate();
  }

  /**
   * Associate document with patient account (+Pat Docs)
   */
  async associateWithPatientAccount(filePath: string, lastName: string, dob: string, patientName: string) {
    await this.uploadAndSearchPatient(filePath, lastName, dob);
    await this.selectPatient(patientName);
    await this.selectPatDocs();
  }
}
