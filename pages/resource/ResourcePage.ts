import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class ResourcePage extends BasePage {
  // Resource submenu items
  readonly diagnosisSearchMenuItem: Locator;
  readonly procedureSearchMenuItem: Locator;
  readonly practiceClinicMenuItem: Locator;
  readonly providerSearchMenuItem: Locator;
  readonly primaryPhysicianInfoMenuItem: Locator;
  readonly facilityMenuItem: Locator;
  readonly statusesThresholdsMenuItem: Locator;

  // Resource menu dropdown
  readonly resourceMenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Resource menu dropdown
    this.resourceMenuDropdown = page.locator('#tdMenuBarItemResource .dropdown-menu');

    // Resource submenu items
    this.diagnosisSearchMenuItem = page.locator('#menu_Resource_DiagSearch');
    this.procedureSearchMenuItem = page.locator('#menu_Resource_ProcSearch');
    this.practiceClinicMenuItem = page.locator('#menu_Resource_ClinicInfo');
    this.providerSearchMenuItem = page.locator('#menu_Resource_PhySearch');
    this.primaryPhysicianInfoMenuItem = page.locator('#menu_Resource_PrimPhySearch');
    this.facilityMenuItem = page.locator('#menu_Resource_Facility');
    this.statusesThresholdsMenuItem = page.locator('#menu_Resource_StatusThreshold');
  }

  // Visibility checks
  async isResourceMenuDropdownVisible() {
    return await this.resourceMenuDropdown.isVisible();
  }

  async isDiagnosisSearchMenuItemVisible() {
    return await this.diagnosisSearchMenuItem.isVisible();
  }

  async isProcedureSearchMenuItemVisible() {
    return await this.procedureSearchMenuItem.isVisible();
  }

  async isPracticeClinicMenuItemVisible() {
    return await this.practiceClinicMenuItem.isVisible();
  }

  async isProviderSearchMenuItemVisible() {
    return await this.providerSearchMenuItem.isVisible();
  }

  async isPrimaryPhysicianInfoMenuItemVisible() {
    return await this.primaryPhysicianInfoMenuItem.isVisible();
  }

  async isFacilityMenuItemVisible() {
    return await this.facilityMenuItem.isVisible();
  }

  async isStatusesThresholdsMenuItemVisible() {
    return await this.statusesThresholdsMenuItem.isVisible();
  }

  // Click actions
  async clickDiagnosisSearch() {
    await this.diagnosisSearchMenuItem.click();
  }

  async clickProcedureSearch() {
    await this.procedureSearchMenuItem.click();
  }

  async clickPracticeClinic() {
    await this.practiceClinicMenuItem.click();
  }

  async clickProviderSearch() {
    await this.providerSearchMenuItem.click();
  }

  async clickPrimaryPhysicianInfo() {
    await this.primaryPhysicianInfoMenuItem.click();
  }

  async clickFacility() {
    await this.facilityMenuItem.click();
  }

  async clickStatusesThresholds() {
    await this.statusesThresholdsMenuItem.click();
  }

  // Get text from menu items
  async getDiagnosisSearchText() {
    return await this.diagnosisSearchMenuItem.textContent();
  }

  async getProcedureSearchText() {
    return await this.procedureSearchMenuItem.textContent();
  }

  async getPracticeClinicText() {
    return await this.practiceClinicMenuItem.textContent();
  }

  async getProviderSearchText() {
    return await this.providerSearchMenuItem.textContent();
  }

  async getPrimaryPhysicianInfoText() {
    return await this.primaryPhysicianInfoMenuItem.textContent();
  }

  async getFacilityText() {
    return await this.facilityMenuItem.textContent();
  }

  async getStatusesThresholdsText() {
    return await this.statusesThresholdsMenuItem.textContent();
  }

  // Utility methods
  async getAllResourceMenuItems() {
    return this.page.locator('#tdMenuBarItemResource .dropdown-menu li');
  }

  async getResourceMenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemResource .dropdown-menu li').count();
  }

  async waitForResourceMenuToOpen() {
    await this.resourceMenuDropdown.waitFor({ state: 'visible' });
  }
}
