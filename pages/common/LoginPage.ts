import { Page, Locator } from '@playwright/test';
import { config } from '../../config';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#txtLogin');
    this.nextButton = page.locator('#btnNext'); // Adjust ID if different
    this.passwordInput = page.locator('#txtPassword');
    this.loginButton = page.locator('#btnSubmit');
    this.errorMessage = page.locator('#BadPass');
    this.logoutButton = page.locator('#tdMenuBarItemlogout');
  }

  async goto() {
    await this.page.goto(config.appUrl);
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
    await this.nextButton.click();
    // Wait for password field to appear
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }


  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }
}
