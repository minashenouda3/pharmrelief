# STATUS — read this first

Last updated: 20 Aug 2026

This file is the record. Chats end; this doesn't. Anyone (human or AI)
picking up work should read this and `CLAUDE.md`, then start.

---

## Do these three things and everything unblocks

1. **Sign in to Supabase**, then run in the SQL editor:
   - `migration_phase4.sql` — ratings, avatars, verification, worklogs
   - `migration_phase5_lock_trigger.sql` — server-side shift locking

   Nothing in Phase 4 works until these run. Both are idempotent.

2. **Create a pharmacy-role account.** Sign up at
   `pharmrelief.ca/pharmrelief_booking.html` (basic auth: `pharmrelief` /
   `testing`) choosing the **Pharmacy** tab. Use a different email from the
   pharmacist account — `shenoudamina09+pharmacy@gmail.com` works, Gmail
   delivers aliases to the same inbox.

   Alternative: convert the existing `moscarven@hotmail.com` account using
   the **Change account role** workflow in the Actions tab (needs step 3).

3. **Add repository secrets** (Settings → Secrets and variables → Actions).
   Four of seven are already set.

   | Secret | Status |
   |---|---|
   | `BASIC_AUTH_USER` | set (`pharmrelief`) |
   | `BASIC_AUTH_PASS` | set (`testing`) |
   | `PHARMACIST_EMAIL` | set |
   | `PHARMACIST_PASSWORD` | set |
   | `SUPABASE_DB_URL` | **missing** — Supabase → Database Settings → Session pooler → URI, with `[YOUR-PASSWORD]` substituted |
   | `PHARMACY_EMAIL` | **missing** — needs step 2 |
   | `PHARMACY_PASSWORD` | **missing** — needs step 2 |

   `SUPABASE_DB_URL` is the important one: with it, migrations and role
   changes run from the Actions tab and no browser session is needed.

---

## Security — outstanding

- **Resend API key** was exposed in a chat log. Live and in use for all auth
  email. Rotate at resend.com → API keys, then update the Supabase SMTP
  password (Authentication → Emails → SMTP Settings).
- **GitHub personal access token** likewise exposed. Regenerate with **repo**
  *and* **workflow** scope.

Neither has caused a known incident. Rotate anyway.

---

## What works today

- Email via Resend; `pharmrelief.ca` verified (DKIM/SPF/DMARC). Rate limit
  200/hr. Confirmation and reset emails deliver.
- Auth: signup, login, email confirmation, forgot/reset password, resend
  confirmation, duplicate-signup detection, expired-link handling.
- Three account types: pharmacy, agency, pharmacist.
- Booking: post shift, browse, apply, double-confirm, lock.
- Phase 4 UI is deployed but **inert until the migrations run**.

## What has never been tested end to end

The booking loop. Post → apply → confirm → confirm → lock has not once
completed with two real accounts. This is the single most important gap.
`tests/booking.spec.js` covers it; run `npx playwright test` once the
secrets exist, or trigger the **End-to-end tests** workflow.

---

## Bugs fixed 19–20 Aug (all deployed)

Recorded because several were silent — they would not have surfaced through
manual clicking, and similar patterns may exist elsewhere.

1. **Profile rows were never created.** `signUp()` returns no session when
   email confirmation is required, so the profile insert hit RLS and failed.
   The error was unchecked, so every signup reported success with no profile.
   Now written from user metadata on first authenticated sign-in.
2. `.single()` threw on zero rows → `.maybeSingle()`.
3. Application `status` was set to fixed strings regardless of the other
   party's state; confirming out of order produced wrong values.
4. **False success on duplicate signup.** Supabase returns no error when an
   email already has an unconfirmed user (anti-enumeration). The UI claimed
   the account was created and no email was sent. Detected via
   `data.user.identities.length === 0`.
5. Signup recorded the wrong role — two role-tab groups shared one global,
   so the highlighted tab and the stored value could diverge.
6. **Stored XSS in the booking app** — 36 interpolation points.
7. **Stored XSS in PharmForum** — post titles, bodies, usernames.
8. **Stored XSS in the support chat** — messages rendered as HTML.
9. Forum had no password reset and the same false-success signup bug.
10. **The shift lock lied.** Client updated `shifts.status='locked'`, but RLS
    restricts that table to the owning pharmacy — so when the pharmacist
    confirmed second the update was silently rejected while both users saw
    "locked". Fixed with a database trigger.
11. **Timesheet billed 24 hours** when start and end times were identical;
    zero-length was treated as an overnight shift.

---

## Deliberate design decisions — don't undo these

- **No government ID upload.** Pharmacist verification is by OCP registration
  number against the public register. Storing ID documents would create
  PIPEDA custodian obligations for no added assurance.
- **The platform does not move money.** `shift_worklogs` tracks hours and
  payment status; settlement happens outside. Moving funds has FINTRAC
  implications and needs legal review first.
- **Agency-posted shifts must name the client pharmacy.** Pharmacists need to
  know which site they are walking into.
- **No role tabs on the sign-in form.** Role comes from the account.

Two tests exist purely to guard the first and last of these.

---

## Known gaps

- No admin UI for approving verification — set `verification_status` in SQL.
- Confirmation emails land in spam on Hotmail/Outlook. New sending domain
  with no reputation. `pharmrelief.ca` has no MX record on the root domain,
  which does not help. See `email_templates.md`.
- Netlify PAT `pharmrelief-deploy` expires 4 Sep 2026. **Nothing uses it** —
  deploys go through the Netlify GitHub App. Safe to let expire.

---

## Architecture — how the pieces fit (audited 20 Aug 2026)

Work has spanned several sessions. This section records how the modules
relate so future changes don't collide at a layer someone forgot about.

**Only two files touch the database.** `pharmrelief_booking.html` and
`pharmforum.html` have live Supabase clients. `pharmrelief_complete.html`,
`pharmrelief_mobile.html` and `pharmrelief_phase3.html` have none — no
client, no fetch, no storage. They are static mockups. Phase 3 features
shown there are **not implemented**.

**Table ownership, so writes don't compete:**

| Table | Written by |
|---|---|
| `pharmacies`, `pharmacist_profiles`, `shifts`, `shift_applications`, `ratings`, `shift_worklogs`, `preferred_pharmacies` | booking app only |
| `profiles`, `posts`, `communities` | forum only |

**Shift status has exactly one writer per transition.** The client sets the
two boolean confirm flags; the `trg_lock_shift` trigger derives
`shift_applications.status` and locks the shift. The client must never
write either of those directly — that was the original bug, and the trigger
now owns it. `cancelShift()` is the one exception: it writes
`shifts.status = 'cancelled'`, and the trigger only locks shifts whose
status is `'open'` so a late confirmation cannot revive a cancelled shift.

**The two migrations are independent.** No shared tables or columns; phase 5
depends only on original-schema columns. Either order works.

**Known seam — one identity, two profile tables.** Booking and forum share
`auth.users` but write to `pharmacist_profiles` and `profiles`
respectively. An account created in one has no profile in the other. Both
sides now handle this (the forum builds a profile from signup metadata; the
booking app prompts for role setup rather than guessing pharmacist). This
works, but a single shared identity across the Pharm brand family would
need a deliberate merge — decide before adding a third product.

---

## Outside shifts (added 20 Aug)

Pharmacists can log shifts booked directly or through another agency, so
PharmRelief holds their complete hours and income record rather than only
the work it sourced. Found under **Earnings → Add outside shift**.

Requires `migration_phase6_external_shifts.sql`. Until it runs, the earnings
panel still works — it falls back to platform shifts only rather than
erroring.

Design notes:
- Separate `external_shifts` table, not a flag on `shifts`. Reusing `shifts`
  would mean dropping the foreign key that stops fabricated pharmacy ids.
- Rows are private to the pharmacist (`auth.uid() = pharmacist_id` for read
  and write). These may name pharmacies that compete with PharmRelief
  customers, and they are a personal record, not marketplace data.
- Hours and payment status live on the row. There is no counterparty to
  approve a timesheet, so the `shift_worklogs` approval flow does not apply.
- Earnings totals combine both sources, with an "of which outside" figure
  so platform-sourced income stays visible separately.

Why it matters commercially: it makes the platform a pharmacist's single
income record — useful at tax time — which is a reason to keep using it even
in a month when no shifts came through PharmRelief.
