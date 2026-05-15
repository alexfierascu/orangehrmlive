import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * PIM > Add Employee.
 */
export class AddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';

  readonly header = this.page.getByRole('heading', { name: 'Add Employee' });
  readonly firstNameInput = this.page.locator('input[name="firstName"]');
  readonly middleNameInput = this.page.locator('input[name="middleName"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"]');
  readonly employeeIdInput = this.fieldByLabel('Employee Id');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  readonly fieldErrors = this.page.locator('.oxd-input-field-error-message');

  // "Create Login Details" toggle and the credential inputs it reveals.
  readonly createLoginToggle = this.page.locator('.oxd-switch-input');
  readonly usernameInput = this.fieldByLabel('Username');
  readonly passwordInput = this.fieldByLabel('Password');
  readonly confirmPasswordInput = this.fieldByLabel('Confirm Password');

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/addEmployee$/);
    await expect(this.header).toBeVisible();
    // Employee Id is auto-populated by the backend; wait for that before
    // any test that asserts on or relies on its value.
    await expect(this.employeeIdInput).not.toHaveValue('');
  }

  async fillName(firstName: string, lastName: string, middleName?: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    if (middleName !== undefined) {
      await this.middleNameInput.fill(middleName);
    }
    await this.lastNameInput.fill(lastName);
  }

  async setEmployeeId(id: string): Promise<void> {
    await this.employeeIdInput.fill(id);
  }

  /** Reveals the credential fields and fills them. Toggle is a Vue switch. */
  async enableLoginDetails(username: string, password: string): Promise<void> {
    await this.createLoginToggle.click();
    // The credential fields render below; pressSequentially because these inputs
    // share the v-model behaviour we hit on Contact Details.
    await this.usernameInput.click();
    await this.usernameInput.pressSequentially(username);
    await this.passwordInput.click();
    await this.passwordInput.pressSequentially(password);
    await this.confirmPasswordInput.click();
    await this.confirmPasswordInput.pressSequentially(password);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}
