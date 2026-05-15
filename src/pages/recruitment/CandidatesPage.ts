import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * Recruitment > Candidates — list, search filters, results table.
 */
export class CandidatesPage extends BasePage {
  readonly path = '/web/index.php/recruitment/viewCandidates';

  readonly header = this.page.getByRole('heading', { name: 'Candidates' });
  readonly addButton = this.page.getByRole('button', { name: /Add/ });

  // Filter form lookup is scoped to avoid colliding with same-named buttons elsewhere.
  private readonly filterForm = this.page.locator('.oxd-table-filter');
  readonly searchButton = this.filterForm.getByRole('button', { name: 'Search' });
  readonly resetButton = this.filterForm.getByRole('button', { name: 'Reset' });
  readonly candidateNameInput = this.fieldByLabel('Candidate Name');

  // Results
  readonly resultRows = this.page.locator('.oxd-table-card');
  readonly recordsFoundText = this.page
    .locator('.orangehrm-horizontal-padding span')
    .filter({ hasText: /Record(s)? Found/ });

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/recruitment\/viewCandidates$/, { timeout: 15_000 });
    await expect(this.header).toBeVisible();
  }

  /** Type the candidate name into the autocomplete and pick the first suggestion. */
  async searchByCandidateName(name: string): Promise<void> {
    await this.candidateNameInput.fill(name);
    const firstOption = this.page.locator('[role="option"]').first();
    await firstOption.waitFor({ state: 'visible' });
    await firstOption.click();
    await this.searchButton.click();
    await this.waitForResults();
  }

  private async waitForResults(): Promise<void> {
    const spinner = this.page.locator('.oxd-loading-spinner');
    await spinner
      .first()
      .waitFor({ state: 'hidden' })
      .catch(() => undefined);
  }
}
