# ROADMAP — every feature, and what is actually true of it

Compiled 20 Aug 2026 by checking the code, not by trusting prior summaries.
Earlier records described Phase 3 as complete; the files contain no database
access at all. This document exists so that does not happen again.

**Legend**

| Mark | Meaning |
|---|---|
| **LIVE** | Deployed, backed by the database, exercised by a real person |
| **BUILT** | Code deployed and reviewed, never run by a user |
| **BLOCKED** | Code deployed, waiting on a migration |
| **MOCKUP** | UI exists, no database, hardcoded data |
| **NOT BUILT** | Does not exist |

---

## Phase 1–2 — Core booking

| Feature | State | Notes |
|---|---|---|
| Pharmacy signup / login | **LIVE** | |
| Pharmacist signup / login | **LIVE** | |
| Agency account type | **BUILT** | Added 20 Aug |
| Email confirmation | **LIVE** | Resend, domain verified |
| Forgot / reset password | **BUILT** | |
| Resend confirmation | **BUILT** | |
| Duplicate-signup detection | **BUILT** | |
| Role setup recovery | **BUILT** | For profile-less accounts |
| Post a shift | **BUILT** | |
| Browse shifts | **BUILT** | |
| Apply to a shift | **BUILT** | |
| Double-confirm both parties | **BUILT** | **The core promise. Never completed once.** |
| Lock shift on double-confirm | **BLOCKED** | phase5 trigger |
| Cancel a shift | **BUILT** | |
| Preferred pharmacies | **BUILT** | |
| Row-level security | **LIVE** | Verified: blocks cross-account writes |
| XSS escaping | **LIVE** | All three live modules |

## Phase 3 — Operations

Recorded in June as complete. **None of it is.** These files contain no
Supabase client, no fetch, and no storage — the data resets on refresh.

| Feature | State |
|---|---|
| Ops dashboard (fill rate, no-show, response time) | **MOCKUP** |
| Dispatch portal — no-show alerts, auto-replacement | **MOCKUP** |
| SMS / call escalation list | **NOT BUILT** |
| Resolution log | **MOCKUP** |
| Regional task assignment | **MOCKUP** |
| GPS-verified mileage tracker | **MOCKUP** |
| Automated shift reminders (push) | **NOT BUILT** |
| Job posting module (ADP-style) | **MOCKUP** |
| Training / compliance doc enforcement | **NOT BUILT** |
| Digital contracts | **NOT BUILT** |
| Candidate compliance tracking | **MOCKUP** |
| Cross-agency blacklist prevention | **NOT BUILT** |
| Financials export | **BUILT** (rewritten 20 Aug — see Phase 4) |
| AI live chat support | **MOCKUP** |

Rebuilding these for real is remaining work. Treat the June record as a
design artefact, not a delivery.

## Phase 4 — Trust, money, retention

| Feature | State | Migration |
|---|---|---|
| Two-way ratings (overall, reliability, professionalism) | **BLOCKED** | phase4 |
| Rating summary view | **BLOCKED** | phase4 |
| Profile photos | **BLOCKED** | phase4 |
| OCP-based verification workflow | **BLOCKED** | phase4 |
| Extended profiles (bio, phone, experience) | **BLOCKED** | phase4 |
| Timesheets — submit hours | **BLOCKED** | phase4 |
| Approve / dispute / mark paid | **BLOCKED** | phase4 |
| Earnings and payment summaries | **BLOCKED** | phase4 |
| Outside shifts (work booked elsewhere) | **BLOCKED** | phase6 |
| CSV export (QuickBooks Online, Xero) | **BUILT** | none |
| QuickBooks Desktop .iif export | **BUILT** | none |
| Ontario pharmacy directory | **BLOCKED** | phase7 |
| Directory import script | **BUILT** | none — tested, 7/7 unit tests |
| Feature flags | **BUILT** | none |

**Not built:** PharmAssist (minor ailments tool), membership tiers and
pricing, early adopter programme, beta onboarding portal, directory browse
and claim UI.

## Other modules

| Module | State |
|---|---|
| PharmForum | Auth **LIVE**, content **MOCKUP** — empty DB, hardcoded posts, invented 7,154 members |
| OCP Hub | Partially real — reads `ocp_snapshot`, `sync_log` |
| Support chat | **MOCKUP** |
| Landing page + waitlist | **LIVE** — Formspree |
| ClinicalWriter | Built Aug 10, **not in this repository** |

---

## Migrations queued — nothing in Phase 4 works until these run

| File | Unlocks |
|---|---|
| `migration_phase4.sql` | ratings, photos, verification, timesheets |
| `migration_phase5_lock_trigger.sql` | server-side shift locking |
| `migration_phase6_external_shifts.sql` | outside shifts |
| `migration_phase7_pharmacy_directory.sql` | Ontario directory |

All are idempotent. Run in any order.

**How to run them.** The dashboard SQL editor has failed to render across
several sessions. The reliable path is the `SUPABASE_DB_URL` repository
secret plus the **Run database migration** workflow in the Actions tab —
that runs server-side and needs no browser.

---

## The honest summary

Roughly 30 features have working code. **One — authentication — has been
used by a real person.**

The booking loop is the product. Post → apply → confirm → confirm → lock has
never completed end to end, not once. Everything else is built on top of a
foundation nobody has walked across.

Two accounts and one test shift would change that, and it is the highest
value hour available on this project.
