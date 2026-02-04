import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class PersonalPage extends BasePage {
  // Personal submenu items
  readonly profileMenuItem: Locator;

  // Personal menu dropdown
  readonly personalMenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Personal menu dropdown
    this.personalMenuDropdown = page.locator('#tdMenuBarItemPersonl .dropdown-menu');

    // Personal submenu items
    this.profileMenuItem = page.locator('#menu_Personl_Info');
  }

  // Visibility checks
  async isPersonalMenuDropdownVisible() {
    return await this.personalMenuDropdown.isVisible();
  }

  async isProfileMenuItemVisible() {
    return await this.profileMenuItem.isVisible();
  }

  // Click actions
  async clickProfile() {
    await this.profileMenuItem.click();
  }

  // Get text from menu items
  async getProfileText() {
    return await this.profileMenuItem.textContent();
  }

  // Utility methods
  async getAllPersonalMenuItems() {
    return this.page.locator('#tdMenuBarItemPersonl .dropdown-menu li');
  }

  async getPersonalMenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemPersonl .dropdown-menu li').count();
  }

  async waitForPersonalMenuToOpen() {
    await this.personalMenuDropdown.waitFor({ state: 'visible' });
  }
}
