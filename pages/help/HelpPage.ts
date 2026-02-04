import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class HelpPage extends BasePage {
  // Help submenu items
  readonly helpResourcesMenuItem: Locator;
  readonly knowledgeBaseMenuItem: Locator;
  readonly homePageMenuItem: Locator;

  // Help menu dropdown
  readonly helpMenuDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // Main Help menu dropdown
    this.helpMenuDropdown = page.locator('#tdMenuBarItemHelp .dropdown-menu');

    // Help submenu items
    this.helpResourcesMenuItem = page.locator('#menu_Help_HelpDocument');
    this.knowledgeBaseMenuItem = page.locator('#menu_Help_KnowledgeBase');
    this.homePageMenuItem = page.locator('#menu_Help_Announcement');
  }

  // Visibility checks
  async isHelpMenuDropdownVisible() {
    return await this.helpMenuDropdown.isVisible();
  }

  async isHelpResourcesMenuItemVisible() {
    return await this.helpResourcesMenuItem.isVisible();
  }

  async isKnowledgeBaseMenuItemVisible() {
    return await this.knowledgeBaseMenuItem.isVisible();
  }

  async isHomePageMenuItemVisible() {
    return await this.homePageMenuItem.isVisible();
  }

  // Click actions
  async clickHelpResources() {
    await this.helpResourcesMenuItem.click();
  }

  async clickKnowledgeBase() {
    await this.knowledgeBaseMenuItem.click();
  }

  async clickHomePage() {
    await this.homePageMenuItem.click();
  }

  // Get text from menu items
  async getHelpResourcesText() {
    return await this.helpResourcesMenuItem.textContent();
  }

  async getKnowledgeBaseText() {
    return await this.knowledgeBaseMenuItem.textContent();
  }

  async getHomePageText() {
    return await this.homePageMenuItem.textContent();
  }

  // Utility methods
  async getAllHelpMenuItems() {
    return this.page.locator('#tdMenuBarItemHelp .dropdown-menu li');
  }

  async getHelpMenuItemsCount() {
    return await this.page.locator('#tdMenuBarItemHelp .dropdown-menu li').count();
  }

  async waitForHelpMenuToOpen() {
    await this.helpMenuDropdown.waitFor({ state: 'visible' });
  }
}
