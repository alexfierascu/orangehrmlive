import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';

  readonly header = this.page.getByRole('heading', { name: 'Dashboard' });
  readonly userDropdown = this.page.locator('.oxd-userdropdown-name');

  async expectLoaded(): Promise<void> {
    // Post-login redirect goes via /auth/validate; can be slow on the shared demo.
    await expect(this.page).toHaveURL(/\/dashboard\/index$/, { timeout: 15_000 });
    await expect(this.header).toBeVisible();
  }
}
