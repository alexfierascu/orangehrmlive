import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  readonly usernameInput = this.page.locator('input[name="username"]');
  readonly passwordInput = this.page.locator('input[name="password"]');
  readonly submitButton = this.page.getByRole('button', { name: 'Login' });
  readonly errorAlert = this.page.locator('.oxd-alert-content--error');
  readonly requiredFieldErrors = this.page.locator('.oxd-input-field-error-message');

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login$/);
    await expect(this.submitButton).toBeVisible();
  }
}
