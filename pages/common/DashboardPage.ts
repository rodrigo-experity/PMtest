import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly userGreeting: Locator;
  readonly logoutButton: Locator;
  readonly mainContent: Locator;
  readonly navigationMenu: Locator;
  readonly patientMenuItem: Locator;
  readonly admin1MenuItem: Locator;
  readonly admin2MenuItem: Locator;
  readonly resourceMenuItem: Locator;
  readonly personalMenuItem: Locator;
  readonly systemMenuItem: Locator;
  readonly helpMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.userGreeting = page.locator('.user-greeting, [data-testid="user-greeting"], .welcome-message');
    this.logoutButton = page.locator('#tdMenuBarItemlogout');
    this.mainContent = page.locator('#main-content, [data-testid="main-content"], .dashboard-content');
    this.navigationMenu = page.locator('ul.nav.navbar-nav.navbar-right.clear');
    this.patientMenuItem = page.locator('#tdMenuBarItemPatient');
    this.admin1MenuItem = page.locator('#tdMenuBarItemAdmin1');
    this.admin2MenuItem = page.locator('#tdMenuBarItemAdmin2');
    this.resourceMenuItem = page.locator('#tdMenuBarItemResource');
    this.personalMenuItem = page.locator('#tdMenuBarItemPersonl');
    this.systemMenuItem = page.locator('#tdMenuBarItemSystem');
    this.helpMenuItem = page.locator('#tdMenuBarItemHelp');
  }

  async isUserGreetingVisible() {
    return await this.userGreeting.isVisible();
  }

  async isMainContentVisible() {
    return await this.mainContent.isVisible();
  }

  async isNavigationMenuVisible() {
    return await this.navigationMenu.isVisible();
  }

  async isLogoutButtonVisible() {
    return await this.logoutButton.isVisible();
  }

  async getUserGreetingText() {
    return await this.userGreeting.textContent();
  }

  async isPatientMenuItemVisible() {
    return await this.patientMenuItem.isVisible();
  }

  async clickPatientMenuItem() {
    await this.patientMenuItem.click();
  }

  async isAdmin2MenuItemVisible() {
    return await this.admin2MenuItem.isVisible();
  }

  async clickAdmin2MenuItem() {
    await this.admin2MenuItem.click();
  }

  getAllMenuItems() {
    return this.page.locator('ul.nav.navbar-nav.navbar-right.clear > li');
  }

  getMenuItemsCount() {
    return this.page.locator('ul.nav.navbar-nav.navbar-right.clear > li').count();
  }

  /**
   * Navigate to Log Book page - common workflow
   * Clicks Patient menu item and waits for navigation
   * Note: This method only navigates to the Patient menu.
   * You still need to use PatientPage.clickLogBook() to access Log Book.
   */
  async navigateToPatientMenu(): Promise<void> {
    await this.clickPatientMenuItem();
  }

  /**
   * Navigate to Admin2 menu - common workflow
   * Clicks Admin2 menu item to open the dropdown
   */
  async navigateToAdmin2Menu(): Promise<void> {
    await this.clickAdmin2MenuItem();
  }
}
