import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class RCMDashboardPage extends BasePage {
  // RCM Dashboard iframe
  readonly rcmDashboardIframe: Locator;

  // Page container
  readonly pageContainer: Locator;

  // Error message element
  readonly errorMessageElement: Locator;

  constructor(page: Page) {
    super(page);

    // RCM Dashboard iframe - using multiple locator strategies
    this.rcmDashboardIframe = page.frameLocator('iframe[name="rcmDashboard"]');

    // Alternative locators for the iframe element itself
    this.pageContainer = page.locator('.content, #content, [role="main"]').first();

    // Specific error message element for iframe load failures
    this.errorMessageElement = page.locator('#errorMessage');
  }

  /**
   * Wait for RCM Dashboard page to load
   */
  async waitForPageToLoad(): Promise<void> {
    // Wait for page to load (use 'load' instead of 'networkidle' as it's more reliable)
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000); // Wait for iframe to load
  }

  /**
   * Check if RCM Dashboard iframe exists
   * The iframe may not have name="rcmDashboard", so we check for Tableau iframe
   */
  async isRcmDashboardIframePresent(): Promise<boolean> {
    // Try name="rcmDashboard" first
    let iframeElement = this.page.locator('iframe[name="rcmDashboard"]');
    let count = await iframeElement.count();

    if (count > 0) {
      return true;
    }

    // If not found, look for Tableau iframe (contains tableau.com in src)
    iframeElement = this.page.locator('iframe[src*="tableau.com"]');
    count = await iframeElement.count();
    return count > 0;
  }

  /**
   * Check if RCM Dashboard iframe is visible
   */
  async isRcmDashboardIframeVisible(): Promise<boolean> {
    try {
      const iframeElement = this.page.locator('iframe[name="rcmDashboard"]');
      await iframeElement.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get iframe element details for debugging
   */
  async getIframeDetails(): Promise<{
    exists: boolean;
    isVisible: boolean;
    src: string | null;
    name: string | null;
    id: string | null;
  }> {
    const iframeElement = this.page.locator('iframe[name="rcmDashboard"]');
    const exists = (await iframeElement.count()) > 0;

    if (!exists) {
      return {
        exists: false,
        isVisible: false,
        src: null,
        name: null,
        id: null,
      };
    }

    const isVisible = await iframeElement.isVisible().catch(() => false);
    const src = await iframeElement.getAttribute('src').catch(() => null);
    const name = await iframeElement.getAttribute('name').catch(() => null);
    const id = await iframeElement.getAttribute('id').catch(() => null);

    return {
      exists,
      isVisible,
      src,
      name,
      id,
    };
  }

  /**
   * Validate RCM Dashboard iframe is loaded correctly
   * Checks for either name="rcmDashboard" or Tableau iframe
   * @returns Object with validation results
   */
  async validateRcmDashboardIframe(): Promise<{
    isPresent: boolean;
    isVisible: boolean;
    hasCorrectName: boolean;
    isTableauIframe: boolean;
    details: string;
  }> {
    const iframeDetails = await this.getIframeDetails();

    let isPresent = iframeDetails.exists;
    let isVisible = iframeDetails.isVisible;
    const hasCorrectName = iframeDetails.name === 'rcmDashboard';
    let isTableauIframe = false;

    let details = '';

    // Check if it's the named iframe
    if (isPresent && hasCorrectName) {
      details = `Iframe found with name="rcmDashboard" - ID: "${iframeDetails.id}", Visible: ${isVisible}`;
      if (iframeDetails.src) {
        details += `, Src: "${iframeDetails.src}"`;
      }
    } else {
      // Check for Tableau iframe
      const tableauIframe = this.page.locator('iframe[src*="tableau.com"]');
      const tableauCount = await tableauIframe.count();

      if (tableauCount > 0) {
        isPresent = true;
        isTableauIframe = true;
        isVisible = await tableauIframe.first().isVisible().catch(() => false);
        const tableauSrc = await tableauIframe.first().getAttribute('src').catch(() => null);
        details = `Tableau RCM Dashboard iframe found - Visible: ${isVisible}, Src: "${tableauSrc}"`;
      } else {
        details = 'No RCM Dashboard iframe found (neither name="rcmDashboard" nor Tableau iframe)';
      }
    }

    return {
      isPresent,
      isVisible,
      hasCorrectName,
      isTableauIframe,
      details,
    };
  }

  /**
   * Get all iframes on the page for debugging
   */
  async getAllIframes(): Promise<Array<{
    name: string | null;
    id: string | null;
    src: string | null;
  }>> {
    const allIframes = await this.page.locator('iframe').all();
    const iframeDetails = [];

    for (const iframe of allIframes) {
      const name = await iframe.getAttribute('name').catch(() => null);
      const id = await iframe.getAttribute('id').catch(() => null);
      const src = await iframe.getAttribute('src').catch(() => null);
      iframeDetails.push({ name, id, src });
    }

    return iframeDetails;
  }

  /**
   * Check for error messages on the page
   * @returns Object with error detection results
   */
  async checkForErrorMessages(): Promise<{
    hasError: boolean;
    errorMessages: string[];
    errorKeywords: string[];
    errorElements: Array<{ selector: string; text: string }>;
  }> {
    const errorKeywords = [
      'error',
      'failed',
      'unable to load',
      'could not load',
      'not available',
      'cannot display',
      'connection error',
      'timeout',
      'not found',
      'unavailable',
    ];

    // Get all text content from the page
    const pageText = await this.page.textContent('body');
    const lowerPageText = pageText?.toLowerCase() || '';

    // Check for error keywords
    const foundKeywords: string[] = [];
    for (const keyword of errorKeywords) {
      if (lowerPageText.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }

    // Look for error UI elements
    const errorSelectors = [
      '.error',
      '.alert',
      '.alert-danger',
      '.alert-error',
      '.error-message',
      '.message-error',
      '[role="alert"]',
      '.notification-error',
      '.toast-error',
    ];

    const errorElements: Array<{ selector: string; text: string }> = [];
    const errorMessages: string[] = [];

    for (const selector of errorSelectors) {
      const element = this.page.locator(selector);
      const count = await element.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const el = element.nth(i);
          const isVisible = await el.isVisible().catch(() => false);

          if (isVisible) {
            const text = await el.textContent().catch(() => '');
            if (text && text.trim()) {
              errorElements.push({ selector, text: text.trim() });
              errorMessages.push(text.trim());
            }
          }
        }
      }
    }

    const hasError = foundKeywords.length > 0 || errorElements.length > 0;

    return {
      hasError,
      errorMessages,
      errorKeywords: foundKeywords,
      errorElements,
    };
  }

  /**
   * Get specific error text from common error containers
   */
  async getErrorText(): Promise<string | null> {
    const errorSelectors = [
      '.error-message',
      '.alert-danger',
      '.error',
      '[role="alert"]',
    ];

    for (const selector of errorSelectors) {
      const element = this.page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        const text = await element.textContent();
        if (text) {
          return text.trim();
        }
      }
    }

    return null;
  }

  /**
   * Check if the specific iframe error message is visible
   * Element: <span id="errorMessage" class="error" role="alert">
   */
  async isIframeErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessageElement.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      // Check if element is in viewport and has content
      const count = await this.errorMessageElement.count();
      if (count > 0) {
        const text = await this.errorMessageElement.textContent().catch(() => '');
        const display = await this.errorMessageElement.evaluate((el) =>
          window.getComputedStyle(el).display
        ).catch(() => 'none');

        // If it has content and display is not none, consider it "visible"
        return text.trim().length > 0 && display !== 'none';
      }
      return false;
    }
  }

  /**
   * Get the iframe error message text
   * Expected: "The dashboard could not be loaded at this time. Please try again later."
   */
  async getIframeErrorMessage(): Promise<string | null> {
    const isVisible = await this.isIframeErrorMessageVisible();
    if (!isVisible) {
      return null;
    }

    const text = await this.errorMessageElement.textContent();
    return text?.trim() || null;
  }

  /**
   * Validate the iframe error message
   * @returns Object with validation results
   */
  async validateIframeErrorMessage(): Promise<{
    isVisible: boolean;
    message: string | null;
    hasExpectedText: boolean;
    attributes: {
      id: string | null;
      class: string | null;
      role: string | null;
      ariaLive: string | null;
      ariaAtomic: string | null;
    };
  }> {
    const isVisible = await this.isIframeErrorMessageVisible();
    const message = isVisible ? await this.getIframeErrorMessage() : null;

    const expectedText = 'The dashboard could not be loaded at this time. Please try again later.';
    const hasExpectedText = message === expectedText;

    // Get attributes
    const id = await this.errorMessageElement.getAttribute('id').catch(() => null);
    const classAttr = await this.errorMessageElement.getAttribute('class').catch(() => null);
    const role = await this.errorMessageElement.getAttribute('role').catch(() => null);
    const ariaLive = await this.errorMessageElement.getAttribute('aria-live').catch(() => null);
    const ariaAtomic = await this.errorMessageElement.getAttribute('aria-atomic').catch(() => null);

    return {
      isVisible,
      message,
      hasExpectedText,
      attributes: {
        id,
        class: classAttr,
        role,
        ariaLive,
        ariaAtomic,
      },
    };
  }
}
