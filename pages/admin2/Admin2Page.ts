import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class Admin2Page extends BasePage {
  // Admin2 submenu items
  readonly billingTasksMenuItem: Locator;
  readonly refundsBatchMenuItem: Locator;
  readonly billingDashboardMenuItem: Locator;
  readonly documentsMenuItem: Locator;
  readonly workListMenuItem: Locator;
  readonly monthEndMenuItem: Locator;
  readonly reportsMenuItem: Locator;
  readonly firstDataAdminMenuItem: Locator;
  readonly patientStatementsMenuItem: Locator;
  readonly denialsManagementMenuItem: Locator;
  readonly patientRemindersMenuItem: Locator;
  readonly claimsTrackingMenuItem: Locator;
  readonly rcmDashboardMenuItem: Locator;

  // Admin2 menu dropdown
  readonly admin2MenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Admin2 menu dropdown
    this.admin2MenuDropdown = page.locator('#tdMenuBarItemAdmin2 .dropdown-menu');

    // Admin2 submenu items
    this.billingTasksMenuItem = page.locator('#menu_Admin2_Billing');
    this.refundsBatchMenuItem = page.locator('#menu_Admin2_RefundsBatch');
    this.billingDashboardMenuItem = page.locator('#menu_Admin2_BillingDashboard');
    this.documentsMenuItem = page.locator('#menu_Admin2_DocList');
    this.workListMenuItem = page.locator('#menu_Admin2_WorkList');
    this.monthEndMenuItem = page.locator('#menu_Admin2_MonthEnd');
    this.reportsMenuItem = page.locator('#menu_Admin2_Reports');
    this.firstDataAdminMenuItem = page.locator('#menu_Admin2_FDManager');
    this.patientStatementsMenuItem = page.locator('#menu_Admin2_AutoPatStmt');
    this.denialsManagementMenuItem = page.locator('#menu_Admin2_DenialsManagement');
    this.patientRemindersMenuItem = page.locator('#menu_Admin2_PatReminder');
    this.claimsTrackingMenuItem = page.locator('#menu_Admin2_ClaimsTracking');
    this.rcmDashboardMenuItem = page.locator('#menu_Admin2_RcmDashboard');
  }

  // Visibility checks
  async isAdmin2MenuDropdownVisible() {
    return await this.admin2MenuDropdown.isVisible();
  }

  async isBillingTasksMenuItemVisible() {
    return await this.billingTasksMenuItem.isVisible();
  }

  async isRefundsBatchMenuItemVisible() {
    return await this.refundsBatchMenuItem.isVisible();
  }

  async isBillingDashboardMenuItemVisible() {
    return await this.billingDashboardMenuItem.isVisible();
  }

  async isDocumentsMenuItemVisible() {
    return await this.documentsMenuItem.isVisible();
  }

  async isWorkListMenuItemVisible() {
    return await this.workListMenuItem.isVisible();
  }

  async isMonthEndMenuItemVisible() {
    return await this.monthEndMenuItem.isVisible();
  }

  async isReportsMenuItemVisible() {
    return await this.reportsMenuItem.isVisible();
  }

  async isFirstDataAdminMenuItemVisible() {
    return await this.firstDataAdminMenuItem.isVisible();
  }

  async isPatientStatementsMenuItemVisible() {
    return await this.patientStatementsMenuItem.isVisible();
  }

  async isDenialsManagementMenuItemVisible() {
    return await this.denialsManagementMenuItem.isVisible();
  }

  async isPatientRemindersMenuItemVisible() {
    return await this.patientRemindersMenuItem.isVisible();
  }

  async isClaimsTrackingMenuItemVisible() {
    return await this.claimsTrackingMenuItem.isVisible();
  }

  async isRcmDashboardMenuItemVisible() {
    return await this.rcmDashboardMenuItem.isVisible();
  }

  // Click actions
  async clickBillingTasks() {
    await this.billingTasksMenuItem.click();
  }

  async clickRefundsBatch() {
    await this.refundsBatchMenuItem.click();
  }

  async clickBillingDashboard() {
    await this.billingDashboardMenuItem.click();
  }

  async clickDocuments() {
    await this.documentsMenuItem.click();
  }

  async clickWorkList() {
    await this.workListMenuItem.click();
  }

  async clickMonthEnd() {
    await this.monthEndMenuItem.click();
  }

  async clickReports() {
    await this.reportsMenuItem.click();
  }

  async clickFirstDataAdmin() {
    await this.firstDataAdminMenuItem.click();
  }

  async clickPatientStatements() {
    await this.patientStatementsMenuItem.click();
  }

  async clickDenialsManagement() {
    await this.denialsManagementMenuItem.click();
  }

  async clickPatientReminders() {
    await this.patientRemindersMenuItem.click();
  }

  async clickClaimsTracking() {
    await this.claimsTrackingMenuItem.click();
  }

  async clickRcmDashboard() {
    await this.rcmDashboardMenuItem.click();
  }

  // Get text from menu items
  async getBillingTasksText() {
    return await this.billingTasksMenuItem.textContent();
  }

  async getRefundsBatchText() {
    return await this.refundsBatchMenuItem.textContent();
  }

  async getBillingDashboardText() {
    return await this.billingDashboardMenuItem.textContent();
  }

  async getDocumentsText() {
    return await this.documentsMenuItem.textContent();
  }

  async getWorkListText() {
    return await this.workListMenuItem.textContent();
  }

  async getMonthEndText() {
    return await this.monthEndMenuItem.textContent();
  }

  async getReportsText() {
    return await this.reportsMenuItem.textContent();
  }

  async getFirstDataAdminText() {
    return await this.firstDataAdminMenuItem.textContent();
  }

  async getPatientStatementsText() {
    return await this.patientStatementsMenuItem.textContent();
  }

  async getDenialsManagementText() {
    return await this.denialsManagementMenuItem.textContent();
  }

  async getPatientRemindersText() {
    return await this.patientRemindersMenuItem.textContent();
  }

  async getClaimsTrackingText() {
    return await this.claimsTrackingMenuItem.textContent();
  }

  async getRcmDashboardText() {
    return await this.rcmDashboardMenuItem.textContent();
  }

  // Utility methods
  async getAllAdmin2MenuItems() {
    return this.page.locator('#tdMenuBarItemAdmin2 .dropdown-menu li');
  }

  async getAdmin2MenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemAdmin2 .dropdown-menu li').count();
  }

  async waitForAdmin2MenuToOpen() {
    await this.admin2MenuDropdown.waitFor({ state: 'visible' });
  }

  /**
   * Check if RCM Dashboard menu item exists in the DOM
   * This is useful for permission-based visibility checks
   * @returns Promise<boolean> - true if element exists (visible or hidden), false if not in DOM
   */
  async rcmDashboardMenuItemExists(): Promise<boolean> {
    const count = await this.rcmDashboardMenuItem.count();
    return count > 0;
  }

  /**
   * Validate RCM Dashboard visibility based on expected permission
   * @param shouldBeVisible - Expected visibility state
   * @returns Promise<{ isVisible: boolean, meetsExpectation: boolean, message: string }>
   */
  async validateRcmDashboardVisibility(shouldBeVisible: boolean): Promise<{
    isVisible: boolean;
    meetsExpectation: boolean;
    message: string;
  }> {
    const isVisible = await this.isRcmDashboardMenuItemVisible();
    const meetsExpectation = isVisible === shouldBeVisible;

    const message = meetsExpectation
      ? `RCM Dashboard is correctly ${isVisible ? 'VISIBLE' : 'HIDDEN'}`
      : `RCM Dashboard visibility mismatch: Expected ${shouldBeVisible ? 'VISIBLE' : 'HIDDEN'}, but was ${isVisible ? 'VISIBLE' : 'HIDDEN'}`;

    return {
      isVisible,
      meetsExpectation,
      message,
    };
  }
}
