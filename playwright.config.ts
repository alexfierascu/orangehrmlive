import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { ADMIN_STORAGE_STATE } from './src/config/paths';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: env.baseUrl,
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      // Pin setup to Chromium explicitly: cookies in `storageState` are not
      // browser-specific, so we always use the cheapest/fastest engine for the
      // login dance regardless of which engine the test projects target.
      // CI must therefore install chromium alongside the matrix browser.
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: ADMIN_STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: ADMIN_STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
