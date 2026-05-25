import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * PIM > Employee > Personal Details. URL contains the empNumber, so this
 * page object is constructed once an employee exists; use `currentEmpNumber()`
 * to capture the id from the URL after creation.
 */
export class EmployeePersonalDetailsPage extends BasePage {
  // No fixed path — navigated to after Save on the Add form, or via:
  //   `${empNumber}` in the URL. `goto()` is intentionally not used here.
  readonly path = '/web/index.php/pim/viewPersonalDetails';

  readonly header = this.page.getByRole('heading', { name: 'Personal Details' });
  readonly firstNameInput = this.page.locator('input[name="firstName"]');
  readonly middleNameInput = this.page.locator('input[name="middleName"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"]');
  readonly employeeIdInput = this.fieldByLabel('Employee Id');
  readonly otherIdInput = this.fieldByLabel('Other Id');
  readonly licenseNumberInput = this.fieldByLabel("Driver's License Number");
  readonly nicknameInput = this.fieldByLabel('Nick Name');

  // Personal details form has its own Save button (one per form on the page).
  readonly personalDetailsSaveButton = this.page
    .locator('form')
    .filter({ has: this.page.locator('input[name="firstName"]') })
    .getByRole('button', { name: 'Save' });

  async expectLoaded(): Promise<void> {
    // Post-save redirect from Add Employee can be slow on the shared demo;
    // override the default expect timeout for this navigation specifically.
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, {
      timeout: 15_000,
    });
    await expect(this.header).toBeVisible();
    // Wait for the form-loader overlay to clear; while it's up, any click on
    // an input is intercepted by the overlay div, leading to misleading
    // "click timeout" failures on slow page loads.
    await this.page
      .locator('.oxd-form-loader')
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => undefined);
  }

  async empNumber(): Promise<string> {
    const match = this.page.url().match(/empNumber\/(\d+)/);
    if (!match) throw new Error(`Could not extract empNumber from URL: ${this.page.url()}`);
    return match[1];
  }

  async savePersonalDetails(): Promise<void> {
    await this.personalDetailsSaveButton.click();
    // OrangeHRM shows a success toast on save; wait for it then dismiss.
    await expect(this.page.locator('.oxd-toast')).toBeVisible();

    //network - html request was succesfully (intercept request + 201)
  }
}
