import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class Admin1Page extends BasePage {
  // Admin1 submenu items
  readonly chargeEntryMenuItem: Locator;
  readonly paymentMenuItem: Locator;
  readonly feeScheduleMenuItem: Locator;
  readonly managedCareMenuItem: Locator;
  readonly insuranceMenuItem: Locator;
  readonly empProtocolMenuItem: Locator;
  readonly empStatementReviewMenuItem: Locator;
  readonly chartReviewMenuItem: Locator;
  readonly occMedWorkQueueMenuItem: Locator;

  // Admin1 menu dropdown
  readonly admin1MenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Admin1 menu dropdown
    this.admin1MenuDropdown = page.locator('#tdMenuBarItemAdmin1 .dropdown-menu');

    // Admin1 submenu items
    this.chargeEntryMenuItem = page.locator('#menu_Admin1_CrgSummary');
    this.paymentMenuItem = page.locator('#menu_Admin1_PymtBatch');
    this.feeScheduleMenuItem = page.locator('#menu_Admin1_FeeSchedule');
    this.managedCareMenuItem = page.locator('#menu_Admin1_ManagedCare');
    this.insuranceMenuItem = page.locator('#menu_Admin1_InsSearch');
    this.empProtocolMenuItem = page.locator('#menu_Admin1_CmpSearch');
    this.empStatementReviewMenuItem = page.locator('#menu_Admin1_EmpStatementReview');
    this.chartReviewMenuItem = page.locator('#menu_Admin1_reviewworklist');
    this.occMedWorkQueueMenuItem = page.locator('#menu_Admin1_EPSWorkQueue');
  }

  // Visibility checks
  async isAdmin1MenuDropdownVisible() {
    return await this.admin1MenuDropdown.isVisible();
  }

  async isChargeEntryMenuItemVisible() {
    return await this.chargeEntryMenuItem.isVisible();
  }

  async isPaymentMenuItemVisible() {
    return await this.paymentMenuItem.isVisible();
  }

  async isFeeScheduleMenuItemVisible() {
    return await this.feeScheduleMenuItem.isVisible();
  }

  async isManagedCareMenuItemVisible() {
    return await this.managedCareMenuItem.isVisible();
  }

  async isInsuranceMenuItemVisible() {
    return await this.insuranceMenuItem.isVisible();
  }

  async isEmpProtocolMenuItemVisible() {
    return await this.empProtocolMenuItem.isVisible();
  }

  async isEmpStatementReviewMenuItemVisible() {
    return await this.empStatementReviewMenuItem.isVisible();
  }

  async isChartReviewMenuItemVisible() {
    return await this.chartReviewMenuItem.isVisible();
  }

  async isOccMedWorkQueueMenuItemVisible() {
    return await this.occMedWorkQueueMenuItem.isVisible();
  }

  // Click actions
  async clickChargeEntry() {
    await this.chargeEntryMenuItem.click();
  }

  async clickPayment() {
    await this.paymentMenuItem.click();
  }

  async clickFeeSchedule() {
    await this.feeScheduleMenuItem.click();
  }

  async clickManagedCare() {
    await this.managedCareMenuItem.click();
  }

  async clickInsurance() {
    await this.insuranceMenuItem.click();
  }

  async clickEmpProtocol() {
    await this.empProtocolMenuItem.click();
  }

  async clickEmpStatementReview() {
    await this.empStatementReviewMenuItem.click();
  }

  async clickChartReview() {
    await this.chartReviewMenuItem.click();
  }

  async clickOccMedWorkQueue() {
    await this.occMedWorkQueueMenuItem.click();
  }

  // Get text from menu items
  async getChargeEntryText() {
    return await this.chargeEntryMenuItem.textContent();
  }

  async getPaymentText() {
    return await this.paymentMenuItem.textContent();
  }

  async getFeeScheduleText() {
    return await this.feeScheduleMenuItem.textContent();
  }

  async getManagedCareText() {
    return await this.managedCareMenuItem.textContent();
  }

  async getInsuranceText() {
    return await this.insuranceMenuItem.textContent();
  }

  async getEmpProtocolText() {
    return await this.empProtocolMenuItem.textContent();
  }

  async getEmpStatementReviewText() {
    return await this.empStatementReviewMenuItem.textContent();
  }

  async getChartReviewText() {
    return await this.chartReviewMenuItem.textContent();
  }

  async getOccMedWorkQueueText() {
    return await this.occMedWorkQueueMenuItem.textContent();
  }

  // Utility methods
  async getAllAdmin1MenuItems() {
    return this.page.locator('#tdMenuBarItemAdmin1 .dropdown-menu li');
  }

  async getAdmin1MenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemAdmin1 .dropdown-menu li').count();
  }

  async waitForAdmin1MenuToOpen() {
    await this.admin1MenuDropdown.waitFor({ state: 'visible' });
  }
}
