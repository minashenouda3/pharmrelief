# PharmRelief — Consolidated Record

Compiled 20 Aug 2026 by reconciling five prior build conversations
(Jun 4 – Aug 20) against the actual contents of the repository.

Where a past session's record and the code disagree, **the code wins** and
the discrepancy is noted. Several do disagree.

---

## 1. URGENT — the platform is not password-protected

Every session since June has assumed the app sits behind basic auth
(`pharmrelief` / `testing`). **It does not.** The `_headers` file protects
only three paths:

```
/pharmrelief_phase3.html
/dashboard/*
/app/*
```

Everything else is publicly reachable by anyone who knows or guesses the
filename:

| File | Protected? | Contains |
|---|---|---|
| `pharmrelief_booking.html` | **No** | Live app: real auth, shifts, timesheets |
| `pharmforum.html` | **No** | Live community, real accounts |
| `pharmrelief_ocp_hub.html` | **No** | OCP registry data |
| `pharmrelief_complete.html` | **No** | Mockup |
| `pharmrelief_mobile.html` | **No** | Mockup |
| `pharmrelief_support.html` | **No** | Support chat |
| `pharmrelief_phase3.html` | Yes | Mockup |

Only the mockup is behind a password. The two live apps are not.

This was flagged on 8 Aug and never actioned. Row-level security still
protects the *data* — a stranger cannot read another pharmacy's shifts — but
anyone can reach the signup pages and create accounts. Fix before real
pharmacy names or contacts go in.

**Fix:** add to `_headers`:

```
/pharmrelief_booking.html
  Basic-Auth: pharmrelief:testing

/pharmforum.html
  Basic-Auth: pharmrelief:testing

/pharmrelief_ocp_hub.html
  Basic-Auth: pharmrelief:testing

/pharmrelief_complete.html
  Basic-Auth: pharmrelief:testing

/pharmrelief_mobile.html
  Basic-Auth: pharmrelief:testing

/pharmrelief_support.html
  Basic-Auth: pharmrelief:testing
```

---

## 2. "Phase 3 complete" is not accurate

The June session recorded Phase 3 as complete — eight modules built and
deployed: ops dashboard, dispatch portal, GPS mileage tracker, job postings,
candidates, financials export, notifications, AI support chat.

**What is actually in the repo:** `pharmrelief_phase3.html`,
`pharmrelief_complete.html` and `pharmrelief_mobile.html` contain **no
database access whatsoever** — no Supabase client, no fetch, no storage.
They are static UI mockups with hardcoded arrays that reset on refresh.

So Phase 3 is *designed and demonstrable*, not *functional*. None of those
eight modules persists anything. This matters for planning: building them for
real is remaining work, not finished work.

The 8 Aug session reached the same conclusion independently.

**What is genuinely functional:**

| Module | State |
|---|---|
| `pharmrelief_booking.html` | Real — Supabase auth, RLS, 7 tables |
| `pharmforum.html` | Real — Supabase auth, 3 tables |
| `pharmrelief_ocp_hub.html` | Partial — reads `ocp_snapshot`, `sync_log` |
| everything else | Mockup |

---

## 3. ClinicalWriter was built but never deployed

The Aug 10 session built ClinicalWriter — institutional telehealth and
clinical documentation, five note formats, 5-minute auto-delete. **It is not
in this repository.** Either it lives elsewhere or it was lost. Worth
locating before rebuilding.

Decision on record: institutional B2B only, never individuals.

---

## 4. Decisions made across sessions (still current)

**Product**
- Free first, to build brand awareness; paid products as the brand matures.
- Pricing scoped but **not built**: Starter free, Professional $89/mo,
  Agency $249/mo, Enterprise custom, Pharmacist Premium $19/mo, plus an
  early-adopter programme.
- Beta target: 5 pilot pharmacies.
- PharmAssist (free minor-ailments algorithm) planned, awaiting clinical
  source material.

**Corporate**
- "Pharm" brand family; a new entity will own the brand, not Cyrilmina.
- Ontario provincial incorporation (~$360) preferred over federal.
- PharmRelief Inc. becomes a separate OpCo at first paying customer.
- **Cyrilmina Pharmaceuticals must not appear anywhere in the platform UI.**
- Infrastructure cost of $31–51/month acceptable pre-revenue.
- Footer for marketing phase: 1-30 Lesmill Road, North York, ON M3B 2T5 /
  1-888-727-7672. Social: Facebook, Instagram, TikTok, LinkedIn, Telegram.

**Privacy**
- No member flagging.
- Compliance stats (attendance, reliability, completion) tracked
  automatically, visible **only to the platform owner** — never to
  pharmacies or third parties.
- No government ID storage; OCP register is the verification source.
- Platform does not move money.

---

## 5. Infrastructure

| Thing | Value |
|---|---|
| Repo | `minashenouda3/pharmrelief` |
| Host | Netlify, GitHub App integration (not PAT) |
| Netlify team slug | `shenoudamina09` — **not** `minashenouda3` |
| Netlify site ID | `98e6704c-a84b-4f2e-b048-5b7e0b745ada` |
| Supabase project | `wnktrcqrwidapxcdnmpi`, Canada region |
| Domain | pharmrelief.ca, Namecheap (user `minashenouda`) |
| Nameservers | `dns1-4.p07.nsone.net` (Netlify DNS) |
| Email | Resend, domain verified, 200/hr limit |
| Waitlist | Formspree `xkoajyoa` |

**Superseded:** RxNova (`minashenouda3/RxNova`, fancy-crepe-8304e5.netlify.app)
— earlier pharmacy concept, replaced by PharmRelief.

**Stale credentials:** two Netlify PATs (one expired Jun 13, one expiring
Sep 4). Nothing uses them — deploys go through the GitHub App. Let both
expire.

**Outstanding admin:** WHOIS privacy + company name update on pharmrelief.ca
was unlocked 4 Aug 2026 and has not been done.

---

## 6. Recurring operational lesson

Browser automation degrades in long conversations — connections drop and
cannot be re-established in the same session. This was recorded in the Aug 10
session and repeated six times on Aug 20. **Start a new chat rather than
troubleshooting the connection.** `STATUS.md` exists so a new session loses
nothing.

---

## 7. True current state

**Working:** email infrastructure, full auth suite (signup, confirm,
forgot/reset, resend, duplicate detection), three account types
(pharmacy/agency/pharmacist), shift posting, browsing, applying,
double-confirm.

**Deployed but inert** until the two migrations run: ratings, profile photos,
OCP verification, timesheets and the payment ledger.

**Never tested end to end:** the booking loop. Post → apply → confirm →
confirm → lock has not once completed with two real accounts.

**Eleven bugs fixed 19–20 Aug**, including three stored-XSS vulnerabilities,
four silent data-integrity failures, and a timesheet that billed 24 hours for
a mistyped end time. See `STATUS.md` for the full list.

---

## 8. PharmForum shows fabricated content

Verified 20 Aug against the live site and database.

The forum displays 38 posts, a **7,154 member** count, and community
membership figures in the hundreds. The database behind it returns **0
posts, 0 communities, 0 profiles**. All visible content comes from a
hardcoded `DEMO_POSTS` array in the page, with invented usernames
(`PharmMgr_GTA`, `RPh_Ontario`) and vote and comment counts.

The Supabase *auth* is real — signup, login and OCP fields work, and a real
account can be created. The *content* is not, and nothing a member posts
joins the demo feed in any meaningful way.

This matters for two reasons:

1. **Planning.** The Aug 10 record reads "PharmForum is live." The auth is
   live; the community is empty. Seeding or launching it is remaining work.
2. **Credibility.** Inventing 7,154 members and specific member complaints
   is fine as a design mock. Showing it to a pilot pharmacy as though the
   community exists would be a misrepresentation, and pharmacists talk to
   each other. Either seed it with disclosed sample content clearly labelled
   as such, or empty it before anyone outside sees it.

Also unverified: whether the forum tables are empty or whether RLS blocks
anonymous reads. Queries return zero rows without error, which means the
tables exist. Worth checking before assuming data was lost.

---

## 9. Fixed on 20 Aug during consolidation

- `_headers` now gates every app page behind basic auth. Previously only the
  phase-3 mockup was protected while both live apps were open.
- Lock trigger corrected so a cancelled shift cannot be revived to locked by
  a late confirmation.
