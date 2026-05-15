import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/config/env';

// Login tests must start unauthenticated, regardless of the shared admin session
// produced by the `setup` project.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication — Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.expectLoaded();
  });

  test('logs in successfully with valid admin credentials', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(env.adminUser, env.adminPassword);
    await dashboardPage.expectLoaded();
    await expect(dashboardPage.userDropdown).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(env.adminUser, 'definitely-wrong-password');
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toHaveText(/invalid credentials/i);
  });

  test('shows required-field validation when submitting empty form', async ({ loginPage }) => {
    await loginPage.submitButton.click();
    await expect(loginPage.requiredFieldErrors).toHaveCount(2);
    await expect(loginPage.requiredFieldErrors.first()).toHaveText(/required/i);
  });
});
