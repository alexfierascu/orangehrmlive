import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Candidate } from '../../data/candidate-factory';

/**
 * Recruitment > Add Candidate.
 */
export class AddCandidatePage extends BasePage {
  readonly path = '/web/index.php/recruitment/addCandidate';

  readonly header = this.page.getByRole('heading', { name: 'Add Candidate' });
  readonly firstNameInput = this.page.locator('input[name="firstName"]');
  readonly middleNameInput = this.page.locator('input[name="middleName"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"]');
  readonly emailInput = this.fieldByLabel('Email');
  readonly contactNumberInput = this.fieldByLabel('Contact Number');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly fieldErrors = this.page.locator('.oxd-input-field-error-message');

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/recruitment\/addCandidate$/);
    await expect(this.header).toBeVisible();
  }

  /** Fill the required-field set (first/last/email) for a new candidate. */
  async fillRequired(candidate: Candidate): Promise<void> {
    await this.firstNameInput.fill(candidate.firstName);
    await this.lastNameInput.fill(candidate.lastName);
    // Email uses the v-model.lazy pattern we hit elsewhere; use real keystrokes.
    await this.emailInput.click();
    await this.emailInput.pressSequentially(candidate.email);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    // Successful save redirects to the candidate's profile (/addCandidate/{id}).
    await expect(this.page).toHaveURL(/\/recruitment\/addCandidate\/\d+/, { timeout: 15_000 });
  }
}
