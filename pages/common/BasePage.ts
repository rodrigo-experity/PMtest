import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Click on an element
   */
  async click(locator: Locator) {
    await locator.click();
  }

  /**
   * Fill input field with text
   */
  async fill(locator: Locator, text: string) {
    await locator.fill(text);
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator) {
    return await locator.textContent();
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator) {
    return await locator.isVisible();
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator) {
    return await locator.isEnabled();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Take a screenshot
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Wait for URL to change
   */
  async waitForURL(url: string | RegExp | ((url: URL) => boolean), options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }) {
    await this.page.waitForURL(url, options);
  }

  /**
   * Wait for page load state
   */
  async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await this.page.title();
  }
}
