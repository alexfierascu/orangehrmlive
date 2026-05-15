/**
 * Centralised environment / runtime configuration.
 *
 * Credentials are intentionally NOT defaulted here — they must be supplied
 * via the runtime environment (`.env` locally, repo secrets in CI). Missing
 * values fail fast with a clear message rather than silently using a default.
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required env var: ${key}. Copy .env.example to .env and fill it in (or set the variable in your CI secrets).`,
    );
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  adminUser: required('ADMIN_USER'),
  adminPassword: required('ADMIN_PASSWORD'),
} as const;
