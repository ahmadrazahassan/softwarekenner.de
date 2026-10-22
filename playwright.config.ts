import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/** Local test mail provider (lib/mail): every message lands as JSON in this folder. */
export const OUTBOX_DIR = path.join(process.cwd(), ".e2e-outbox");

// Runs against the production build: `pnpm build` first, then `pnpm test:e2e`.
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      ...(process.env as Record<string, string>),
      MAIL_OUTBOX_DIR: OUTBOX_DIR,
      FORM_TOKEN_SECRET: "e2e-nur-fuer-tests-0123456789abcdef",
      FORM_RATE_LIMIT: "1000",
    },
  },
});
