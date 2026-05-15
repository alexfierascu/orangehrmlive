import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Recruitment — Candidates List', () => {
  test('loads the candidates list with at least one record', async ({ candidatesPage }) => {
    await candidatesPage.goto();
    await candidatesPage.expectLoaded();

    // The shared demo always has seeded candidates; assert at least one record
    // is rendered without depending on a specific count.
    await expect(candidatesPage.recordsFoundText.first()).toBeVisible();
    await expect(candidatesPage.resultRows.first()).toBeVisible();
  });
});
