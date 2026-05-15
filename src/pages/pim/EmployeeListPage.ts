import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * PIM > Employee List — search + results table.
 */
export class EmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  readonly header = this.page.getByRole('heading', { name: 'Employee Information' });
  readonly addButton = this.page.getByRole('button', { name: ' Add' });

  // Filter form — scope every search-control lookup so we never collide with
  // the same-named buttons elsewhere on the page.
  private readonly filterForm = this.page.locator('.oxd-table-filter');
  readonly searchButton = this.filterForm.getByRole('button', { name: 'Search' });
  readonly resetButton = this.filterForm.getByRole('button', { name: 'Reset' });
  readonly employeeNameInput = this.fieldByLabel('Employee Name');
  readonly employeeIdInput = this.fieldByLabel('Employee Id');

  // Results
  readonly resultRows = this.page.locator('.oxd-table-card');
  readonly recordsFoundText = this.page
    .locator('.orangehrm-horizontal-padding span')
    .filter({ hasText: /Record(s)? Found/ });

  // Delete confirmation dialog buttons (unique on the page while dialog is open).
  readonly confirmDeleteButton = this.page.getByRole('button', { name: /Yes, Delete/ });
  readonly cancelDeleteButton = this.page.getByRole('button', { name: /No, Cancel/ });

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList$/);
    await expect(this.header).toBeVisible();
  }

  /** Type into the autocomplete and select the first suggestion. */
  async searchByEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    const firstOption = this.page.locator('[role="option"]').first();
    await firstOption.waitFor({ state: 'visible' });
    await firstOption.click();
    await this.searchButton.click();
    await this.waitForResults();
  }

  async searchByEmployeeId(id: string): Promise<void> {
    // Set the value via the native input setter and fire input/change events.
    // This is more reliable than fill()/pressSequentially against this Vue
    // v-model under load — it bypasses keystroke timing entirely.
    await this.employeeIdInput.evaluate((el, value) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, id);
    await this.searchButton.click();
    await this.waitForResults();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
    await this.waitForResults();
  }

  async getResultCount(): Promise<number> {
    const text = (await this.recordsFoundText.first().textContent()) ?? '';
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Click the trash icon on the first result row. Callers should have searched
   * to a single result before calling this so it's unambiguous which row dies.
   */
  async deleteFirstResult(confirm = true): Promise<void> {
    await this.resultRows.first().locator('button:has(i.bi-trash)').click();
    if (confirm) {
      await this.confirmDeleteButton.click();
    } else {
      await this.cancelDeleteButton.click();
    }
  }

  /** Click the pencil icon on the first result row → navigates to Personal Details. */
  async editFirstResult(): Promise<void> {
    await this.resultRows.first().locator('button:has(i.bi-pencil-fill)').click();
  }

  private async waitForResults(): Promise<void> {
    // OrangeHRM shows a brief loading spinner. Wait for it to clear.
    const spinner = this.page.locator('.oxd-loading-spinner');
    await spinner
      .first()
      .waitFor({ state: 'hidden' })
      .catch(() => undefined);
  }
}
