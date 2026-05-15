import { test, expect } from '../../src/fixtures/test-fixtures';
import { generateCandidate } from '../../src/data/candidate-factory';

test.describe('Recruitment — Add Candidate', () => {
  test.beforeEach(async ({ addCandidatePage }) => {
    await addCandidatePage.goto();
    await addCandidatePage.expectLoaded();
  });

  test('creates a candidate with required fields and lands on the candidate profile', async ({
    page,
    addCandidatePage,
  }) => {
    const candidate = generateCandidate();

    await addCandidatePage.fillRequired(candidate);
    await addCandidatePage.save();

    // save() already asserts the post-save redirect URL; double-check the form
    // re-renders with our candidate data attached.
    await expect(page).toHaveURL(/\/recruitment\/addCandidate\/\d+/);
    await expect(addCandidatePage.firstNameInput).toHaveValue(candidate.firstName);
    await expect(addCandidatePage.lastNameInput).toHaveValue(candidate.lastName);
    await expect(addCandidatePage.emailInput).toHaveValue(candidate.email);
  });

  test('shows required-field validation when first/last name and email are empty', async ({
    addCandidatePage,
  }) => {
    await addCandidatePage.saveButton.click();

    // First name, last name, email are all required.
    await expect(addCandidatePage.fieldErrors).toHaveCount(3);
    await expect(addCandidatePage.fieldErrors.first()).toHaveText(/required/i);
  });
});
