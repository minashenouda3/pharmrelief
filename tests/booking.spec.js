// End-to-end coverage of the PharmRelief booking loop.
//
// Requires two confirmed accounts, supplied via environment:
//   PHARMACY_EMAIL / PHARMACY_PASSWORD    (account_type 'pharmacy')
//   PHARMACIST_EMAIL / PHARMACIST_PASSWORD
//   BASIC_AUTH_USER / BASIC_AUTH_PASS     (Netlify gate)
//   BASE_URL                              (defaults to production)
//
// Run: npx playwright test

const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'https://pharmrelief.ca';
const APP = `${BASE}/pharmrelief_booking.html`;

// A date far enough out that it will not collide with real shifts.
const futureDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().slice(0, 10);
})();

const marker = `E2E-${Date.now()}`;

async function signIn(page, email, password) {
  await page.goto(APP);
  await page.waitForSelector('#loginForm', { state: 'visible' });
  await page.fill('#loginEmail', email);
  await page.fill('#loginPassword', password);
  await page.click('#loginBtn');
  // The app shell only appears once a profile row resolves.
  await expect(page.locator('#appShell')).toHaveClass(/visible/, { timeout: 15000 });
}

async function signOut(page) {
  const btn = page.locator('text=Sign out').first();
  if (await btn.isVisible().catch(() => false)) await btn.click();
}

test.describe('Auth surface', () => {
  test('login form renders with recovery affordances', async ({ page }) => {
    await page.goto(APP);
    await expect(page.locator('#loginForm')).toBeVisible();
    await expect(page.locator('text=Forgot your password?')).toBeVisible();
    await expect(page.locator('text=Resend confirmation')).toBeVisible();
    // Role tabs must NOT appear on sign-in: role comes from the account.
    await expect(page.locator('#loginForm .role-tab')).toHaveCount(0);
  });

  test('forgot-password panel opens and carries the email across', async ({ page }) => {
    await page.goto(APP);
    await page.fill('#loginEmail', 'carry@example.com');
    await page.click('text=Forgot your password?');
    await expect(page.locator('#forgotForm')).toBeVisible();
    await expect(page.locator('#forgotEmail')).toHaveValue('carry@example.com');
  });

  test('signup exposes all three roles and toggles their fields', async ({ page }) => {
    await page.goto(APP);
    await page.click('text=Create account');
    const tabs = page.locator('#signupForm .role-tab');
    await expect(tabs).toHaveCount(3);

    await page.click("#signupForm .role-tab:has-text('Agency')");
    await expect(page.locator('#agencyFields')).toBeVisible();
    await expect(page.locator('#pharmacyFields')).toBeHidden();

    await page.click("#signupForm .role-tab:has-text('Pharmacist')");
    await expect(page.locator('#pharmacistFields')).toBeVisible();
    await expect(page.locator('#agencyFields')).toBeHidden();
  });

  test('mismatched passwords are rejected before hitting the API', async ({ page }) => {
    await page.goto(APP);
    await page.click('text=Create account');
    await page.fill('#signupEmail', `nope-${Date.now()}@example.com`);
    await page.fill('#signupPassword', 'validpassword123');
    await page.fill('#signupPassword2', 'differentpassword123');
    await page.click("#signupForm button:has-text('Create account')");
    await expect(page.locator('#signupError')).toContainText('do not match');
  });

  test('bad credentials produce a human-readable error', async ({ page }) => {
    await page.goto(APP);
    await page.fill('#loginEmail', 'nobody@example.com');
    await page.fill('#loginPassword', 'wrongpassword123');
    await page.click('#loginBtn');
    await expect(page.locator('#loginError')).toContainText(/not recognised|not recognized/i, { timeout: 10000 });
  });

  test('expired confirmation links explain themselves', async ({ page }) => {
    await page.goto(`${APP}#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`);
    await expect(page.locator('#loginError')).toContainText('expired', { timeout: 10000 });
  });
});

test.describe('Booking loop', () => {
  test.describe.configure({ mode: 'serial' });

  let shiftLabel;

  test('pharmacy posts a shift', async ({ page }) => {
    await signIn(page, process.env.PHARMACY_EMAIL, process.env.PHARMACY_PASSWORD);
    await expect(page.locator('#roleBadge')).toContainText(/Pharmacy|Agency/);

    await page.click("button:has-text('Post Shift')");
    await page.fill('#shiftDate', futureDate);
    await page.fill('#shiftStart', '09:00');
    await page.fill('#shiftEnd', '17:00');
    await page.fill('#shiftRate', '62.50');
    await page.fill('#shiftLocation', `${marker} Test Location`);
    await page.fill('#shiftNotes', marker);
    await page.click("button:has-text('Post Shift')");

    await page.click("button:has-text('My Shifts')");
    await expect(page.locator('#myShiftsPharmacyList')).toContainText(marker, { timeout: 15000 });
    shiftLabel = marker;
    await signOut(page);
  });

  test('pharmacist sees and applies to the shift', async ({ page }) => {
    await signIn(page, process.env.PHARMACIST_EMAIL, process.env.PHARMACIST_PASSWORD);
    await expect(page.locator('#roleBadge')).toContainText('Pharmacist');

    await expect(page.locator('#browseShiftsList')).toContainText(shiftLabel, { timeout: 15000 });
    const card = page.locator('.shift-card', { hasText: shiftLabel });
    await card.locator("button:has-text('Apply')").click();

    await page.click("button:has-text('My Applications')");
    await expect(page.locator('#myApplicationsList')).toContainText(shiftLabel, { timeout: 15000 });
    await signOut(page);
  });

  test('pharmacy confirms the applicant', async ({ page }) => {
    await signIn(page, process.env.PHARMACY_EMAIL, process.env.PHARMACY_PASSWORD);
    await page.click("button:has-text('My Shifts')");
    const card = page.locator('.shift-card', { hasText: shiftLabel });
    await card.locator("button:has-text('Confirm')").first().click();
    // Not locked yet — the pharmacist has not confirmed.
    await expect(card).not.toContainText('Locked', { timeout: 10000 });
    await signOut(page);
  });

  test('pharmacist confirms and the shift locks', async ({ page }) => {
    await signIn(page, process.env.PHARMACIST_EMAIL, process.env.PHARMACIST_PASSWORD);
    await page.click("button:has-text('My Applications')");
    const card = page.locator('.shift-card', { hasText: shiftLabel });
    await card.locator("button:has-text('Confirm')").first().click();

    await page.click("button:has-text('Confirmed Shifts')");
    await expect(page.locator('#myConfirmedList')).toContainText(shiftLabel, { timeout: 15000 });
    await signOut(page);
  });
});

test.describe('Profile and ratings', () => {
  test('pharmacist profile exposes verification without asking for ID', async ({ page }) => {
    await signIn(page, process.env.PHARMACIST_EMAIL, process.env.PHARMACIST_PASSWORD);
    await page.click("button:has-text('Profile')");
    await expect(page.locator('#profileBody')).toContainText('Professional verification', { timeout: 15000 });
    await expect(page.locator('#pfOcp')).toBeVisible();
    // Guard the deliberate design choice: no identity-document upload.
    await expect(page.locator('#profileBody')).toContainText('never ask for government ID');
  });

  test('profile edits persist across a reload', async ({ page }) => {
    await signIn(page, process.env.PHARMACIST_EMAIL, process.env.PHARMACIST_PASSWORD);
    await page.click("button:has-text('Profile')");
    await page.waitForSelector('#pfBio');
    const bio = `Bio ${Date.now()}`;
    await page.fill('#pfBio', bio);
    await page.click('#profileSaveBtn');
    await page.waitForTimeout(2500);
    await page.reload();
    await page.click("button:has-text('Profile')");
    await expect(page.locator('#pfBio')).toHaveValue(bio, { timeout: 15000 });
  });

  test('earnings panel loads with running totals', async ({ page }) => {
    await signIn(page, process.env.PHARMACIST_EMAIL, process.env.PHARMACIST_PASSWORD);
    await page.click("button:has-text('Earnings')");
    await expect(page.locator('#finSummaryPharmacist')).toContainText('Outstanding', { timeout: 15000 });
  });

  test('timesheet panel loads for the pharmacy', async ({ page }) => {
    await signIn(page, process.env.PHARMACY_EMAIL, process.env.PHARMACY_PASSWORD);
    await page.click("button:has-text('Timesheets')");
    await expect(page.locator('#finSummaryPharmacy')).toContainText('Awaiting approval', { timeout: 15000 });
  });
});

test.describe('Hours arithmetic', () => {
  // calcHours is pure, so exercise it directly rather than through the UI.
  test('handles normal, overnight and break cases', async ({ page }) => {
    await page.goto(APP);
    const results = await page.evaluate(() => ({
      plain:     calcHours('09:00', '17:00', 0),
      withBreak: calcHours('09:00', '17:00', 30),
      overnight: calcHours('22:00', '06:00', 0),
      invalid:   calcHours('09:00', '09:00', 0)
    }));
    expect(results.plain).toBe(8);
    expect(results.withBreak).toBe(7.5);
    expect(results.overnight).toBe(8);
    expect(results.invalid).toBeNull();
  });
});
