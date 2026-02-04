import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class PatientDetailsPage extends BasePage {
  // Patient Information Section
  readonly sexAtBirthMaleRadio: Locator;
  readonly sexAtBirthFemaleRadio: Locator;
  readonly addressField: Locator;
  readonly zipField: Locator;
  readonly cityField: Locator;
  readonly stateDropdown: Locator;
  readonly employerNameField: Locator;

  // Patient Portal Access
  readonly patientPortalYesRadio: Locator;
  readonly patientPortalNoRadio: Locator;

  // Demographics Section
  readonly raceCheckboxWhite: Locator; // value="2106-3"
  readonly raceCheckboxBlack: Locator; // value="2054-5"
  readonly raceCheckboxAsian: Locator; // value="2028-9"
  readonly raceCheckboxNativeAmerican: Locator; // value="1002-5"
  readonly raceCheckboxPacificIslander: Locator; // value="2076-8"
  readonly raceCheckboxOther: Locator; // value="2131-1"
  readonly ethnicityHispanic: Locator; // rblEthnicity_1, value="4"
  readonly ethnicityNotHispanic: Locator; // rblEthnicity_0, value="2"
  readonly ethnicityUnknown: Locator; // rblEthnicity_2, value="8"
  readonly preferredLanguageDropdown: Locator;

  // HIPAA Date
  readonly hipaaDateField: Locator;
  readonly hipaaDateTodayButton: Locator;

  // Save Button
  readonly saveButton: Locator;

  // Balance Summary Section (Success indicator)
  readonly balanceSummarySection: Locator;
  readonly totalBalance: Locator;

  constructor(page: Page) {
    super(page);

    // Patient Information - Using actual IDs from debug
    this.sexAtBirthMaleRadio = page.locator('#rblSex_1'); // Male
    this.sexAtBirthFemaleRadio = page.locator('#rblSex_0'); // Female
    this.addressField = page.locator('input[name="ctl00$contentMain$txtAddress1"]');
    this.zipField = page.locator('input[name="ctl00$contentMain$ctlZipToCity$txtZipCode"]');
    this.cityField = page.locator('input[name="ctl00$contentMain$ctlZipToCity$txtCity"]');
    this.stateDropdown = page.locator('select[name="ctl00$contentMain$ctlZipToCity$ddlState"]');
    this.employerNameField = page.locator('#txtCompany');

    // Patient Portal - Confirmed from debug
    this.patientPortalYesRadio = page.locator('#rbPatPortal_0'); // value="1"
    this.patientPortalNoRadio = page.locator('#rbPatPortal_1'); // value="0"

    // Demographics - Checkboxes and radios (not dropdowns!)
    this.raceCheckboxWhite = page.locator('input[name="chckRace_group"][value="2106-3"]');
    this.raceCheckboxBlack = page.locator('input[name="chckRace_group"][value="2054-5"]');
    this.raceCheckboxAsian = page.locator('input[name="chckRace_group"][value="2028-9"]');
    this.raceCheckboxNativeAmerican = page.locator('input[name="chckRace_group"][value="1002-5"]');
    this.raceCheckboxPacificIslander = page.locator('input[name="chckRace_group"][value="2076-8"]');
    this.raceCheckboxOther = page.locator('input[name="chckRace_group"][value="2131-1"]');
    this.ethnicityHispanic = page.locator('#rblEthnicity_1'); // value="4"
    this.ethnicityNotHispanic = page.locator('#rblEthnicity_0'); // value="2"
    this.ethnicityUnknown = page.locator('#rblEthnicity_2'); // value="8"
    this.preferredLanguageDropdown = page.locator('#ddlLanguage'); // Confirmed: id="ddlLanguage"

    // HIPAA - Confirmed from debug
    this.hipaaDateField = page.locator('#txtHIPAADate'); // Confirmed: id="txtHIPAADate"
    this.hipaaDateTodayButton = page.locator('#Button1'); // First "Today" button

    // Save - Confirmed from debug
    this.saveButton = page.locator('#btnSave');

    // Success indicators
    this.balanceSummarySection = page.locator('#divBalanceSummary, [class*="balance"], [id*="Balance"]').first();
    this.totalBalance = page.locator(':text("$0.00")').first();
  }

  // Fill patient information
  async fillPatientInfo(data: {
    sexAtBirth: 'Male' | 'Female';
    address: string;
    zip: string;
    city: string;
    employerName?: string;
  }) {
    // Select sex at birth
    if (data.sexAtBirth === 'Male') {
      await this.sexAtBirthMaleRadio.check({ force: true });
    } else {
      await this.sexAtBirthFemaleRadio.check({ force: true });
    }
    await this.page.waitForTimeout(300);

    // Fill employer name (if provided - for Worker Comp and EPS)
    if (data.employerName) {
      await this.employerNameField.fill(data.employerName);
      await this.page.waitForTimeout(300);
    }

    // Fill address
    await this.addressField.fill(data.address);
    await this.page.waitForTimeout(300);

    // Fill ZIP (this might auto-populate city/state)
    await this.zipField.fill(data.zip);
    await this.page.waitForTimeout(1000); // Wait for city/state to auto-populate

    // Check if city was auto-populated, if not fill it
    const cityValue = await this.cityField.inputValue();
    if (!cityValue || cityValue === '') {
      await this.cityField.fill(data.city);
    }
  }

  // Set patient portal access
  async setPatientPortalAccess(hasAccess: boolean) {
    if (hasAccess) {
      await this.patientPortalYesRadio.check({ force: true });
    } else {
      await this.patientPortalNoRadio.check({ force: true });
    }
    await this.page.waitForTimeout(300);
  }

  // Fill demographics
  async fillDemographics(data: {
    race?: 'White' | 'Black' | 'Asian' | 'NativeAmerican' | 'PacificIslander' | 'Other';
    ethnicity?: 'Hispanic' | 'NotHispanic' | 'Unknown';
    preferredLanguage?: string;
  }) {
    // Scroll to demographics section
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);

    // Select race checkbox (if specified)
    if (data.race) {
      const raceCheckboxMap = {
        White: this.raceCheckboxWhite,
        Black: this.raceCheckboxBlack,
        Asian: this.raceCheckboxAsian,
        NativeAmerican: this.raceCheckboxNativeAmerican,
        PacificIslander: this.raceCheckboxPacificIslander,
        Other: this.raceCheckboxOther,
      };
      const checkbox = raceCheckboxMap[data.race];
      if (checkbox) {
        // Use JavaScript click since checkbox is styled/hidden
        await checkbox.evaluate((el: HTMLInputElement) => el.click());
        await this.page.waitForTimeout(300);
      }
    }

    // Select ethnicity radio button (if specified)
    if (data.ethnicity) {
      const ethnicityRadioMap = {
        Hispanic: this.ethnicityHispanic,
        NotHispanic: this.ethnicityNotHispanic,
        Unknown: this.ethnicityUnknown,
      };
      const radio = ethnicityRadioMap[data.ethnicity];
      if (radio) {
        // Use JavaScript click since radio is styled/hidden
        await radio.evaluate((el: HTMLInputElement) => el.click());
        await this.page.waitForTimeout(300);
      }
    }

    // Select preferred language (if available)
    if (data.preferredLanguage) {
      const langCount = await this.preferredLanguageDropdown.count();
      if (langCount > 0 && await this.preferredLanguageDropdown.isVisible().catch(() => false)) {
        await this.preferredLanguageDropdown.selectOption({ label: data.preferredLanguage });
        await this.page.waitForTimeout(300);
      }
    }
  }

  // Set HIPAA date to today
  async setHipaaDateToToday() {
    // Wait for any overlays to disappear
    await this.page.waitForTimeout(1000);

    // Try to click Today button, but if overlay is present, fill date manually
    try {
      await this.hipaaDateTodayButton.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    } catch {
      // If Today button doesn't work, fill date manually
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const year = today.getFullYear();
      const dateString = `${month}/${day}/${year}`;

      await this.hipaaDateField.fill(dateString);
      await this.page.waitForTimeout(500);
    }
  }

  // Click save button
  async clickSave() {
    // Scroll to top first to avoid footer overlay
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);

    // Try normal click first
    try {
      await this.saveButton.click({ timeout: 3000 });
    } catch {
      // If normal click fails due to overlay, use JavaScript click
      await this.saveButton.evaluate((el: HTMLInputElement) => el.click());
    }

    await this.page.waitForTimeout(2000);
  }

  // Handle HIPAA alert dialog
  async handleHipaaAlert(clickNo: boolean = true) {
    // Wait for alert dialog
    this.page.once('dialog', async (dialog) => {
      console.log(`Alert message: ${dialog.message()}`);
      if (clickNo) {
        await dialog.dismiss(); // Click "No"
      } else {
        await dialog.accept(); // Click "Yes"
      }
    });
  }

  // Verify registration success
  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      await this.balanceSummarySection.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyBalanceIsZero(): Promise<boolean> {
    const balanceText = await this.totalBalance.textContent();
    return balanceText?.includes('$0.00') || false;
  }

  /**
   * Save patient with HIPAA handling - common workflow
   * Attempts first save (may trigger alert), sets HIPAA date, then saves again
   * @param handleAlert - Whether to handle and dismiss the HIPAA alert dialog
   */
  async saveWithHipaaHandling(handleAlert: boolean = true): Promise<void> {
    // First save attempt (may trigger alert)
    if (handleAlert) {
      // Set up dialog handler
      this.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
    }

    await this.clickSave();
    await this.page.waitForTimeout(2000);

    // Set HIPAA date to today
    await this.setHipaaDateToToday();

    // Final save
    await this.clickSave();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify successful registration with optional balance check
   * @returns Object with registration success status and balance verification
   */
  async verifySuccessfulRegistration(): Promise<{
    isSuccessful: boolean;
    hasZeroBalance: boolean;
  }> {
    const isSuccessful = await this.isRegistrationSuccessful();
    let hasZeroBalance = false;

    // Try to verify balance (may not always be available immediately)
    if (isSuccessful) {
      try {
        hasZeroBalance = await this.verifyBalanceIsZero();
      } catch (error) {
        // Balance verification not available immediately
        hasZeroBalance = false;
      }
    }

    return { isSuccessful, hasZeroBalance };
  }
}
