# PharmRelief — Project Context

Ontario pharmacy relief shift-booking platform. Connects pharmacies and
relief agencies posting shifts with licensed pharmacists filling them.

## Stack

- **Frontend:** static HTML files, vanilla JS, no build step. Each module is
  one self-contained `.html` file with inline `<script>` and `<style>`.
- **Backend:** Supabase (Postgres + Auth + Storage), project ref
  `wnktrcqrwidapxcdnmpi`, Canada region.
- **Hosting:** Netlify, auto-deploys from `main` on push. Team slug
  `shenoudamina09` (NOT `minashenouda3` — that 404s).
- **Email:** Resend via Supabase SMTP. Domain `pharmrelief.ca` verified
  (DKIM/SPF/DMARC). Sender `noreply@pharmrelief.ca`.
- **DNS:** Netlify nameservers (`dns1-4.p07.nsone.net`), domain at Namecheap.

## Files

| File | Purpose |
|---|---|
| `index.html` | Public landing page, Formspree waitlist (id `xkoajyoa`) |
| `pharmrelief_booking.html` | **Main app** — auth, shift posting/browsing/applying, double-confirm, ratings, timesheets, profiles |
| `pharmforum.html` | Reddit-style verified community |
| `pharmrelief_ocp_hub.html` | OCP resource hub |
| `pharmrelief_support.html` | Support / live chat |
| `_headers` | Netlify basic-auth gate (`pharmrelief` / `testing`) |

## Environment

`.env` (gitignored, never commit):
```
SUPABASE_DB_URL=postgresql://...   # Settings > Database > Connection string > URI
```

Public anon key is inline in the HTML by design — RLS is the security
boundary, not key secrecy.

## Database

Tables: `pharmacies`, `pharmacist_profiles`, `shifts`,
`shift_applications`, `preferred_pharmacies`, `ratings`,
`shift_worklogs`. Plus forum tables: `communities`, `posts`, `comments`,
`votes`, `community_members`. View: `rating_summary`.

**Roles.** Pharmacies and agencies share the `pharmacies` table,
discriminated by `account_type` (`'pharmacy'` | `'agency'`). Pharmacists
live in `pharmacist_profiles`. A user's role is derived from which table
holds their row — never from a client-side variable.

**RLS is on for every table.** All writes require `auth.uid()` to match
the owning id. Consequence worth remembering: `signUp()` returns no
session when email confirmation is required, so profile rows *cannot* be
written at signup time. They are created from `user_metadata` on first
authenticated sign-in via `ensureProfile()`. This has caused a
silent-failure bug once already — don't reintroduce it.

**Booking flow:** pharmacy/agency posts shift → pharmacist applies →
both parties confirm independently → shift locks. `status` on
`shift_applications` is *derived* from the two boolean confirm flags in
`checkLockShift()`, never set directly.

**Money:** `shift_worklogs` records hours and amounts owed and tracks
payment status. The platform does **not** move funds — doing so has
FINTRAC implications. Don't add fund transfer without legal review.

**Identity:** pharmacist verification is by OCP registration number
checked against the OCP public register, reviewed manually
(`verification_status`: unverified → pending → verified/rejected).
Deliberately does **not** store government ID documents — that would
create PIPEDA custodian obligations. Don't add ID upload.

## Conventions

- Migrations are idempotent (`if not exists`, guarded `do $$` blocks) and
  live in `migration_*.sql`. Safe to re-run.
- Use `.maybeSingle()` not `.single()` — the latter throws on zero rows.
- Always check the `error` field on Supabase calls. Several bugs here came
  from unchecked errors producing false success messages.
- `emailRedirectTo` must be passed on every `signUp()` and reset call, or
  links fall back to the Site URL and land on the wrong page.
- Supabase returns **no error** when signing up an email that already has
  an unconfirmed user. Detect it via `data.user.identities.length === 0`.

## Commands

```bash
psql "$SUPABASE_DB_URL" -f migration_phase4.sql   # run a migration
npx playwright test                                # run e2e suite
git push                                           # triggers Netlify deploy
```

## Current state / known gaps

- Phase 4 (ratings, avatars, verification, worklogs) is **pushed but
  untested**. Syntax verified only.
- No admin UI for approving verification — flip `verification_status`
  in SQL for now.
- Booking loop has never been tested end to end; needs one pharmacy-role
  and one pharmacist-role account.
- New sending domain, so confirmation emails land in spam on
  Hotmail/Outlook. Reputation builds with volume; root domain has no MX
  record, which doesn't help.
