// Playwright config for PharmRelief.
// The site sits behind a Netlify basic-auth gate, so httpCredentials are
// required or every request 401s before any test logic runs.

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // The booking loop mutates shared database state, so parallel runs
  // would interfere with each other.
  workers: 1,
  fullyParallel: false,
  retries: 1,
  timeout: 45000,
  expect: { timeout: 12000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://pharmrelief.ca',
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER || 'pharmrelief',
      password: process.env.BASIC_AUTH_PASS || 'testing'
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
