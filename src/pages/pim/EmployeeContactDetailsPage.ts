import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * PIM > Employee > Contact Details. Path is parameterised by empNumber.
 */
export class EmployeeContactDetailsPage extends BasePage {
  readonly path = '/web/index.php/pim/contactDetails';

  readonly header = this.page.getByRole('heading', { name: 'Contact Details' });
  readonly mobileInput = this.fieldByLabel('Mobile');
  readonly workEmailInput = this.fieldByLabel('Work Email');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });

  async gotoFor(empNumber: string): Promise<void> {
    await this.page.goto(`${this.path}/empNumber/${empNumber}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/contactDetails\/empNumber\/\d+/);
    await expect(this.header).toBeVisible();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await expect(this.page.locator('.oxd-toast')).toBeVisible();
  }
}
