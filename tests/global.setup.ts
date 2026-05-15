import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';
import { env } from '../src/config/env';
import { ADMIN_STORAGE_STATE } from '../src/config/paths';

setup('authenticate as admin', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await login.goto();
  await login.login(env.adminUser, env.adminPassword);
  await dashboard.expectLoaded();

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
