import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class SystemPage extends BasePage {
  // System submenu items
  readonly userListMenuItem: Locator;
  readonly spuEmulationMenuItem: Locator;
  readonly menuListMenuItem: Locator;
  readonly utilityMenuItem: Locator;
  readonly toolsMenuItem: Locator;
  readonly appErrorLogMenuItem: Locator;
  readonly quickVisitsMenuItem: Locator;
  readonly reAdminPortalMenuItem: Locator;

  // System menu dropdown
  readonly systemMenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main System menu dropdown
    this.systemMenuDropdown = page.locator('#tdMenuBarItemSystem .dropdown-menu');

    // System submenu items
    this.userListMenuItem = page.locator('#menu_System_UserList');
    this.spuEmulationMenuItem = page.locator('#menu_System_SPUEmulation');
    this.menuListMenuItem = page.locator('#menu_System_MenuList');
    this.utilityMenuItem = page.locator('#menu_System_UtilList');
    this.toolsMenuItem = page.locator('#menu_System_Tools');
    this.appErrorLogMenuItem = page.locator('#menu_System_ErrSearch');
    this.quickVisitsMenuItem = page.locator('#menu_System_QuickVisitUI');
    this.reAdminPortalMenuItem = page.locator('#menu_System_RulesEngineAdmin');
  }

  // Visibility checks
  async isSystemMenuDropdownVisible() {
    return await this.systemMenuDropdown.isVisible();
  }

  async isUserListMenuItemVisible() {
    return await this.userListMenuItem.isVisible();
  }

  async isSpuEmulationMenuItemVisible() {
    return await this.spuEmulationMenuItem.isVisible();
  }

  async isMenuListMenuItemVisible() {
    return await this.menuListMenuItem.isVisible();
  }

  async isUtilityMenuItemVisible() {
    return await this.utilityMenuItem.isVisible();
  }

  async isToolsMenuItemVisible() {
    return await this.toolsMenuItem.isVisible();
  }

  async isAppErrorLogMenuItemVisible() {
    return await this.appErrorLogMenuItem.isVisible();
  }

  async isQuickVisitsMenuItemVisible() {
    return await this.quickVisitsMenuItem.isVisible();
  }

  async isReAdminPortalMenuItemVisible() {
    return await this.reAdminPortalMenuItem.isVisible();
  }

  // Click actions
  async clickUserList() {
    await this.userListMenuItem.click();
  }

  async clickSpuEmulation() {
    await this.spuEmulationMenuItem.click();
  }

  async clickMenuList() {
    await this.menuListMenuItem.click();
  }

  async clickUtility() {
    await this.utilityMenuItem.click();
  }

  async clickTools() {
    await this.toolsMenuItem.click();
  }

  async clickAppErrorLog() {
    await this.appErrorLogMenuItem.click();
  }

  async clickQuickVisits() {
    await this.quickVisitsMenuItem.click();
  }

  async clickReAdminPortal() {
    await this.reAdminPortalMenuItem.click();
  }

  // Get text from menu items
  async getUserListText() {
    return await this.userListMenuItem.textContent();
  }

  async getSpuEmulationText() {
    return await this.spuEmulationMenuItem.textContent();
  }

  async getMenuListText() {
    return await this.menuListMenuItem.textContent();
  }

  async getUtilityText() {
    return await this.utilityMenuItem.textContent();
  }

  async getToolsText() {
    return await this.toolsMenuItem.textContent();
  }

  async getAppErrorLogText() {
    return await this.appErrorLogMenuItem.textContent();
  }

  async getQuickVisitsText() {
    return await this.quickVisitsMenuItem.textContent();
  }

  async getReAdminPortalText() {
    return await this.reAdminPortalMenuItem.textContent();
  }

  // Utility methods
  async getAllSystemMenuItems() {
    return this.page.locator('#tdMenuBarItemSystem .dropdown-menu li');
  }

  async getSystemMenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemSystem .dropdown-menu li').count();
  }

  async waitForSystemMenuToOpen() {
    await this.systemMenuDropdown.waitFor({ state: 'visible' });
  }
}
