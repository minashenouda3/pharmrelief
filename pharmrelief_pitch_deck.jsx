import { useState } from "react";

const SLIDES = [
  {
    id: "cover",
    label: "Cover",
    content: ({ next }) => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center", padding: "40px" }}>
        <div style={{ background: "#E1F5EE", borderRadius: 16, padding: "12px 20px", marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, color: "#1D9E75" }}>💊</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#085041", letterSpacing: 2, textTransform: "uppercase" }}>PharmRelief</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 500, lineHeight: 1.1, color: "#04342C", marginBottom: 20, maxWidth: 600 }}>
          Canada's OCP-verified pharmacy relief platform
        </h1>
        <p style={{ fontSize: 18, color: "#5F5E5A", maxWidth: 480, lineHeight: 1.6, marginBottom: 36 }}>
          Connecting independent pharmacies, Shoppers Associates, and Walmart Canada with qualified relief pharmacists — instantly.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {["28,909 OCP-verified pharmacists", "5,416 active pharmacy locations", "Real-time booking + payroll", "QuickBooks · RBC · Stripe integrated"].map(t => (
            <span key={t} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 20, background: "#E1F5EE", color: "#085041", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <button onClick={next} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
          View pitch →
        </button>
        <p style={{ fontSize: 11, color: "#888780", marginTop: 16 }}>Pilot launch · June 2026 · Hamilton, Ontario</p>
      </div>
    )
  },

  {
    id: "problem",
    label: "The problem",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>The problem</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 500, color: "#04342C", marginBottom: 8, lineHeight: 1.15 }}>
          A pharmacist calls in sick.<br />The pharmacy cannot legally open.
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 36, maxWidth: 560 }}>This happens across Ontario hundreds of times a week. The current "solution" is frantic phone calls, Facebook groups, and paying whatever rate is demanded under pressure.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[
            ["4–6 hrs", "Average time to find emergency coverage today", "#FCEBEB", "#A32D2D"],
            ["$120–160/hr", "Emergency premium paid when panicking", "#FAEEDA", "#633806"],
            ["0 verification", "No OCP check before a stranger dispenses medications", "#FCEBEB", "#A32D2D"],
          ].map(([v, l, bg, col]) => (
            <div key={v} style={{ background: bg, borderRadius: 14, padding: "20px 18px" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: col, marginBottom: 6 }}>{v}</div>
              <div style={{ fontSize: 13, color: col, lineHeight: 1.5 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["For pharmacy owners", ["No central registry of available relief pharmacists", "No way to verify OCP status instantly", "Invoices are manual — QuickBooks entry every time", "No history of who worked, what was paid"]],
            ["For pharmacists", ["No transparent platform to list availability", "Payments arrive 30–60 days late", "No formal contract or shift confirmation", "Competing through word-of-mouth only"]],
          ].map(([title, points]) => (
            <div key={title} style={{ background: "#F1EFE8", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#444441", marginBottom: 10 }}>{title}</div>
              {points.map(p => <div key={p} style={{ fontSize: 12, color: "#5F5E5A", padding: "3px 0", display: "flex", gap: 7 }}><span style={{ color: "#A32D2D" }}>✗</span>{p}</div>)}
            </div>
          ))}
        </div>
      </div>
    )
  },

  {
    id: "solution",
    label: "The solution",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>The solution</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          Book a verified pharmacist in under 10 minutes
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 32 }}>One platform. OCP-verified roster. Instant booking. Automated payroll. QuickBooks sync.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            ["🔍", "Verify", "Every pharmacist cross-referenced against OCP public register before they appear on the platform"],
            ["📅", "Book", "4-step wizard — pharmacist, pharmacy, shift details, confirm. Live fee calculator with HST"],
            ["💬", "Coordinate", "Built-in messaging, logistics notes, conflict detection, travel arrangements"],
            ["💰", "Pay", "Automated payroll with HST, instant pay via Stripe, QuickBooks sync, bank reconciliation"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#E1F5EE", borderRadius: 14, padding: "18px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#085041", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 11, color: "#0F6E56", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#04342C", borderRadius: 14, padding: "20px 22px", color: "#E1F5EE" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "#5DCAA5" }}>For pharmacy owners</div>
            {["Post a shift in 2 minutes", "Receive 3+ matched pharmacist options instantly", "OCP number verified in real time", "Invoice auto-generated, QuickBooks synced", "Same-day response SLA on urgent requests"].map(p => (
              <div key={p} style={{ fontSize: 12, padding: "4px 0", display: "flex", gap: 7, color: "#9FE1CB" }}><span style={{ color: "#5DCAA5" }}>✓</span>{p}</div>
            ))}
          </div>
          <div style={{ background: "#042C53", borderRadius: 14, padding: "20px 22px", color: "#E6F1FB" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "#85B7EB" }}>For pharmacists</div>
            {["List availability, get matched to shifts", "OCP registration displayed and verified", "Confirmed booking with digital contract", "Same-day pay via Stripe (instant pay option)", "Ratings and shift history build credibility"].map(p => (
              <div key={p} style={{ fontSize: 12, padding: "4px 0", display: "flex", gap: 7, color: "#B5D4F4" }}><span style={{ color: "#85B7EB" }}>✓</span>{p}</div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  {
    id: "market",
    label: "Market",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>Market opportunity</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          Ontario alone is a $180M addressable market
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 28 }}>Pharmacy relief staffing is fragmented, manual, and untracked. No dominant platform exists in Canada.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[
            ["~4,000", "Independent pharmacies in Ontario", "#1D9E75"],
            ["~500", "Shoppers Associates (ON) — individual clients", "#CC0000"],
            ["~180", "Walmart Canada pharmacy locations (ON)", "#0071CE"],
            ["28,909", "OCP-registered pharmacists in Ontario", "#534AB7"],
          ].map(([v, l, col]) => (
            <div key={v} style={{ background: "#F8F8F6", borderRadius: 12, padding: "18px 14px", borderTop: `3px solid ${col}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: col, marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 12, color: "#5F5E5A", lineHeight: 1.5 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#444441", marginBottom: 12 }}>Market structure (corrected)</div>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                {["Segment", "Client", "Stores (ON)", "TAM/yr"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: 11 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ["Shoppers Associates", "Individual Associate-owner", "~500", "$9M"],
                  ["Independent / banner", "Owner-pharmacist", "~2,500", "$30M"],
                  ["Walmart Canada", "Corporate (central)", "~180", "$21.6M"],
                  ["Rexall / Sobeys / Costco", "Corporate / regional", "~350", "$42M"],
                  ["Long-term care pharmacy", "LTC operator", "~200", "$24M"],
                ].map(row => (
                  <tr key={row[0]} style={{ borderBottom: "0.5px solid #F0F0F0" }}>
                    {row.map((cell, i) => <td key={i} style={{ padding: "7px 8px", fontWeight: i === 0 ? 600 : 400, color: i === 3 ? "#1D9E75" : "#333" }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#085041", marginBottom: 12 }}>Why now?</div>
            {[
              ["Post-COVID pharmacist shortage", "Ontario pharmacist vacancies at 10-yr high"],
              ["Expanded pharmacy scope (2023+)", "More services = more hours = more relief needed"],
              ["OCP registry is public", "We can verify every pharmacist programmatically"],
              ["No dominant competitor", "Existing agencies use phone and email only"],
            ].map(([t, d]) => (
              <div key={t} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#085041" }}>{t}</div>
                <div style={{ fontSize: 11, color: "#0F6E56" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  {
    id: "earlyadopters",
    label: "Early adopters",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>Early adopter program</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          Pilot with 15 pharmacies · 30 pharmacists · 8 weeks
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 28 }}>Structured pilot in Hamilton-Burlington corridor — close enough to manage personally, diverse enough to prove the model.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#04342C", borderRadius: 14, padding: "22px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5DCAA5", marginBottom: 14 }}>🏥 Target pharmacies (15)</div>
            {[
              ["5 Shoppers Associates", "Hamilton/Burlington district · direct outreach to Associates through OPA contacts", "#1D9E75"],
              ["5 Independent pharmacies", "OCP registry search · Hamilton, Ancaster, Dundas, Stoney Creek · owner-operated", "#5DCAA5"],
              ["3 Guardian/IDA banner stores", "Banner group outreach · preferred-supplier conversation with regional rep", "#9FE1CB"],
              ["2 Long-term care pharmacies", "LTC operators · highest shift frequency · captive audience", "#E1F5EE"],
            ].map(([t, d, col]) => (
              <div key={t} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: col, marginBottom: 3 }}>{t}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#042C53", borderRadius: 14, padding: "22px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#85B7EB", marginBottom: 14 }}>👤 Target pharmacists (30)</div>
            {[
              ["20 RPh / PharmD — active relief", "OCP search: Hamilton + surrounding · filter: Active status · personally onboard each one", "#85B7EB"],
              ["5 recently licensed (interns)", "New grads looking for experience and income · LinkedIn + UWaterloo/UofT pharmacy programs", "#B5D4F4"],
              ["5 part-time relief already", "Pharmacists already doing relief via word-of-mouth · convert them to the platform", "#E6F1FB"],
            ].map(([t, d, col]) => (
              <div key={t} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: col, marginBottom: 3 }}>{t}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            ["Week 1–2", "Setup & onboard", "Platform live. Personal onboarding of all 30 pharmacists. Pharmacy portals configured. OCP verified."],
            ["Week 3–4", "First bookings", "Target: 20 shifts booked. Handle manually + via platform. Capture every friction point."],
            ["Week 5–6", "Iterate fast", "Fix top 5 issues from feedback. Test payroll flow. QuickBooks sync with 3 pilot pharmacies."],
            ["Week 7–8", "Prove & document", "Compile metrics: fill rate, time-to-fill, NPS, revenue, pharmacist satisfaction. Prepare scale deck."],
          ].map(([t, title, desc]) => (
            <div key={t} style={{ background: "#F8F8F6", borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 11, color: "#5F5E5A", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: "#E1F5EE", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#085041" }}>Pilot incentive for early adopters</div>
            <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 2 }}>Free Standard plan for 6 months · $0 platform fee · 5% agency markup (vs 12% standard) · guaranteed 2hr response SLA</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#085041", fontWeight: 600 }}>In exchange:</div>
            <div style={{ fontSize: 11, color: "#0F6E56" }}>3 referrals · NPS survey · monthly call · testimonial</div>
          </div>
        </div>
      </div>
    )
  },

  {
    id: "budget",
    label: "Budget",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>Starter budget</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          Live in 30 days for under $28,000
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 28 }}>Lean, fast, founder-operated. No office, no sales team, no enterprise deals until the model is proven.</p>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 12 }}>8-week pilot budget breakdown</div>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1.5px solid #E5E5E5" }}>
                {["Item", "Cost", "Notes"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: 11 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ["Technology", "", "", true],
                  ["Domain + hosting (Vercel/Netlify)", "$20/mo", "Negligible"],
                  ["Supabase (database + auth)", "$25/mo", "Free tier sufficient for pilot"],
                  ["Stripe (payments + instant pay)", "0.3% + $0.30/txn", "~$180 on $60k pilot volume"],
                  ["Twilio (SMS notifications)", "$50/mo", "Per-message for alerts"],
                  ["QuickBooks API (sandbox)", "$50/mo", "Developer account"],
                  ["", "", "", true],
                  ["Legal & compliance", "", "", true],
                  ["Terms of service + privacy policy", "$800", "Lawyer review, 1-time"],
                  ["Independent contractor agreements", "$600", "Template set for pharmacists"],
                  ["OCP data use confirmation", "$0", "Public data — no fee"],
                  ["", "", "", true],
                  ["Operations", "", "", true],
                  ["Founder salary (8 weeks)", "$8,000", "Lean — reinvest after revenue"],
                  ["Personal outreach + travel", "$1,200", "Hamilton-Burlington in-person"],
                  ["OPA conference / booth", "$2,400", "Biggest pharmacy network event"],
                  ["", "", "", true],
                  ["Marketing", "", "", true],
                  ["LinkedIn ads (pharmacist targeting)", "$1,500", "Targeted Ontario pharmacists"],
                  ["1-page pitch card (print)", "$300", "500 cards for DM meetings"],
                  ["Google Ads (pharmacy owner)", "$800", "'pharmacy relief Hamilton' etc."],
                  ["", "", "", true],
                  ["Contingency (15%)", "$2,200", "Buffer for unexpected"],
                ].map((row, i) => row[3] ? (
                  <tr key={i}><td colSpan={3} style={{ padding: "10px 8px 4px", fontSize: 11, fontWeight: 700, color: "#1D9E75", background: "#F8F8F6" }}>{row[0]}</td></tr>
                ) : (
                  <tr key={i} style={{ borderBottom: "0.5px solid #F5F5F3" }}>
                    <td style={{ padding: "6px 8px", color: "#333" }}>{row[0]}</td>
                    <td style={{ padding: "6px 8px", fontWeight: 600, color: row[1].includes("0.3") ? "#888" : "#333", whiteSpace: "nowrap" }}>{row[1]}</td>
                    <td style={{ padding: "6px 8px", color: "#888", fontSize: 11 }}>{row[2]}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "1.5px solid #1D9E75", background: "#E1F5EE" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, fontSize: 13, color: "#085041" }}>Total pilot budget</td>
                  <td style={{ padding: "10px 8px", fontWeight: 700, fontSize: 16, color: "#085041" }}>~$18,000</td>
                  <td style={{ padding: "10px 8px", fontSize: 11, color: "#0F6E56" }}>8-week runway</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style={{ background: "#04342C", borderRadius: 14, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5DCAA5", marginBottom: 14 }}>Pilot revenue projection</div>
              {[
                ["15 pharmacies × avg 5 shifts", "75 shifts"],
                ["Avg invoice per shift", "$720 (inc markup)"],
                ["Total pilot billings", "$54,000"],
                ["Agency margin (12%)", "$6,480"],
                ["Platform fees (waived pilot)", "$0"],
                ["HST collected (13%)", "$7,020"],
                ["Net pilot profit", "~$6,480"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#E1F5EE" }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "10px", background: "rgba(29,158,117,0.2)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#5DCAA5" }}>Pilot is cash-flow positive by week 4 if we book 30+ shifts.</div>
              </div>
            </div>
            <div style={{ background: "#E6F1FB", borderRadius: 14, padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0C447C", marginBottom: 12 }}>Scale budget (Month 3–12)</div>
              {[
                ["Product dev (contractor)", "$4,000/mo"],
                ["Sales (founder-led)", "$0"],
                ["Marketing (digital)", "$2,000/mo"],
                ["Ops + admin", "$800/mo"],
                ["Total burn rate", "$6,800/mo"],
                ["Break-even at", "40 pharmacies"],
              ].map(([l, v], i) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "0.5px solid rgba(24,95,165,0.15)", borderTop: i === 5 ? "1.5px solid #185FA5" : "none" }}>
                  <span style={{ fontSize: i === 5 ? 13 : 11, fontWeight: i === 5 ? 700 : 400, color: i === 5 ? "#0C447C" : "#185FA5" }}>{l}</span>
                  <span style={{ fontSize: i === 5 ? 13 : 12, fontWeight: 700, color: "#0C447C" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },

  {
    id: "timeline",
    label: "Go-live timeline",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>Go-live timeline</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          Live for testing in 72 hours · pilot revenue in 2 weeks
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 32 }}>The platform is built. What remains is configuration, legal, and onboarding — not development.</p>
        <div style={{ marginBottom: 28 }}>
          {[
            { phase: "Now → 72 hrs", title: "Platform live for testing", color: "#1D9E75", bg: "#E1F5EE", tasks: [
              "Deploy web platform to Vercel (free tier)", "Configure Supabase database with OCP data", "Set up Stripe test mode for payment flows", "Domain registered + SSL", "3 pharmacy test accounts + 5 pharmacist accounts", "Internal smoke testing of all 8 modules"
            ]},
            { phase: "Day 4–10", title: "Legal & early adopter outreach", color: "#185FA5", bg: "#E6F1FB", tasks: [
              "Lawyer review of T&C and contractor agreements", "Personal calls to 5 Shoppers Associates (warm contacts)", "OCP data use confirmation with platform team", "Onboard first 10 pharmacists — personal video call each", "QuickBooks sandbox integration tested", "Soft launch: platform accessible but not publicly listed"
            ]},
            { phase: "Day 11–20", title: "First live bookings", color: "#534AB7", bg: "#EEEDFE", tasks: [
              "First paid shift booked through platform", "Payroll flow tested with real transaction", "Pharmacist app (Expo) distributed via TestFlight", "Feedback loop: daily call with each pharmacy", "First QuickBooks sync verified with pilot pharmacy", "Stripe instant pay tested — pharmacist receives funds"
            ]},
            { phase: "Day 21–56", title: "Pilot: 15 pharmacies, 30 pharmacists", color: "#BA7517", bg: "#FAEEDA", tasks: [
              "Full roster of 30 OCP-verified pharmacists onboarded", "15 pharmacy portals configured and active", "50+ shifts booked and completed", "First invoices generated and paid", "NPS surveys collected — iterate on top issues", "Compile pilot data package for scale pitch"
            ]},
            { phase: "Month 3+", title: "Scale", color: "#04342C", bg: "#E1F5EE", tasks: [
              "OPA conference — launch publicly to Ontario pharmacists", "Guardian/IDA/Pharmasave preferred-supplier approach", "Android app published to Play Store", "QuickBooks Marketplace listing (drives organic leads)", "Walmart Canada vendor registration submitted", "Target: 40 pharmacies = break-even"
            ]},
          ].map(({ phase, title, color, bg, tasks }) => (
            <div key={phase} style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ minWidth: 110, paddingTop: 14, textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.8 }}>{phase}</div>
              </div>
              <div style={{ width: 2, background: color, borderRadius: 2, flexShrink: 0, margin: "0 4px" }} />
              <div style={{ flex: 1, background: bg, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px 16px" }}>
                  {tasks.map(t => <div key={t} style={{ fontSize: 11, color: "#444", padding: "1px 0", display: "flex", gap: 5 }}><span style={{ color }}>·</span>{t}</div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },

  {
    id: "traction",
    label: "Traction metrics",
    content: () => (
      <div style={{ padding: "40px 48px" }}>
        <Label>Success metrics</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          What does a successful pilot look like?
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 28 }}>These are the numbers that prove the model is real — and justify raising or scaling.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            ["Fill rate", ">90%", "Shifts posted that get filled within 4 hours", "#1D9E75"],
            ["Time to fill", "<2 hrs", "From shift posted to pharmacist confirmed", "#1D9E75"],
            ["NPS — pharmacies", ">70", "Would recommend PharmRelief to another pharmacy owner", "#185FA5"],
            ["NPS — pharmacists", ">75", "Would recommend to a colleague", "#534AB7"],
            ["Shift repeat rate", ">60%", "Pharmacies that book a 2nd shift within 30 days", "#BA7517"],
            ["Payroll accuracy", "100%", "Zero payroll errors in pilot — non-negotiable", "#1D9E75"],
            ["Pharmacist retention", ">80%", "Still active on platform after 8 weeks", "#1D9E75"],
            ["Revenue week 8", ">$12k", "Platform is financially sustainable post-pilot", "#085041"],
            ["Referrals generated", ">8", "Each pharmacy refers at least 0.5 new clients", "#534AB7"],
          ].map(([metric, target, desc, col]) => (
            <div key={metric} style={{ background: "#F8F8F6", borderRadius: 12, padding: "16px 14px", borderLeft: `3px solid ${col}` }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 600 }}>{metric}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: col, marginBottom: 4 }}>{target}</div>
              <div style={{ fontSize: 11, color: "#5F5E5A", lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#085041", marginBottom: 10 }}>What failure looks like (and what we'd do)</div>
            {[
              ["Fill rate < 70%", "Roster too small → aggressive pharmacist recruitment campaign"],
              ["NPS < 50", "UX problem → 2-week sprint on friction points identified"],
              ["Pharmacies churn", "Price objection → revisit markup, add more value with reports"],
              ["Payroll errors", "Stop and fix → integrity is the product"],
            ].map(([t, d]) => (
              <div key={t} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#A32D2D" }}>{t}</div>
                <div style={{ fontSize: 11, color: "#0F6E56" }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#EEEDFE", borderRadius: 12, padding: "18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3C3489", marginBottom: 10 }}>What success unlocks</div>
            {[
              ["Proof of 90%+ fill rate", "Approach Pharmasave/Guardian for preferred-supplier deal"],
              ["10 happy pharmacy clients", "Case studies for OPA conference — credibility built"],
              ["$54k revenue in 8 weeks", "Platform is self-funding — no outside capital needed"],
              ["3 Shoppers Associates onboarded", "Proof that the model works at the hardest client type"],
              ["Pharmacist NPS > 75", "Pharmacists recruit each other — organic growth flywheel"],
            ].map(([t, d]) => (
              <div key={t} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#534AB7" }}>{t}</div>
                <div style={{ fontSize: 11, color: "#3C3489" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  {
    id: "ask",
    label: "The ask",
    content: () => (
      <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <Label>What we need</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 500, color: "#04342C", marginBottom: 8 }}>
          We are ready to launch.<br />We need three things.
        </h2>
        <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 36, maxWidth: 560 }}>The platform is built and tested. The OCP data is loaded. The first pharmacists are identified. We need warm introductions, early adopters, and optional seed capital.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[
            { num: "1", title: "15 early adopter pharmacies", desc: "Specifically: Shoppers Associates or Hamilton-area independents. A 30-minute call is all it takes. We handle everything else.", cta: "Intro a pharmacy owner →", color: "#1D9E75", bg: "#E1F5EE" },
            { num: "2", title: "30 registered pharmacists", desc: "OCP-active, available for relief shifts. Hamilton / Burlington / Ancaster preferred. We onboard, verify, and list them — they earn more.", cta: "Refer a pharmacist →", color: "#185FA5", bg: "#E6F1FB" },
            { num: "3", title: "$28,000 seed (optional)", desc: "Covers 8-week pilot runway. Platform is self-funding from week 4. Investor gets 8% equity or 2× revenue share on first $200k billed.", cta: "Discuss terms →", color: "#534AB7", bg: "#EEEDFE" },
          ].map(({ num, title, desc, cta, color, bg }) => (
            <div key={num} style={{ background: bg, borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color, marginBottom: 8, fontFamily: "'Fraunces', serif" }}>{num}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#5F5E5A", lineHeight: 1.6, marginBottom: 14 }}>{desc}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color }}>{cta}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "#04342C", borderRadius: 12, padding: "16px 24px", color: "#E1F5EE" }}>
            <div style={{ fontSize: 11, color: "#5DCAA5", marginBottom: 2, fontWeight: 700 }}>Contact</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>pharmrelief.ca · hello@pharmrelief.ca</div>
          </div>
          <div style={{ flex: 1, background: "#F8F8F6", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Built on</div>
            <div style={{ fontSize: 12, color: "#333" }}>OCP public registry · 28,909 verified pharmacists · Stripe · QuickBooks · RBC Banking API · React Native iOS/Android app</div>
          </div>
          <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#085041", marginBottom: 2 }}>Live demo</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>Available now</div>
          </div>
        </div>
      </div>
    )
  },
];

function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "#1D9E75", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F8F6", minHeight: "100vh", padding: 16 }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Slide nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setCurrent(i)}
              style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", background: i === current ? "#1D9E75" : "#E1F5EE", color: i === current ? "#fff" : "#085041", fontWeight: i === current ? 700 : 400 }}>
              {i + 1}. {s.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>Slide {current + 1} of {SLIDES.length}</div>
      </div>

      {/* Slide */}
      <div style={{ background: "#fff", borderRadius: 20, minHeight: 560, border: "0.5px solid #E5E5E5", overflow: "hidden", position: "relative" }}>
        {slide.content({ next: () => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), prev: () => setCurrent(c => Math.max(c - 1, 0)) })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button onClick={() => setCurrent(c => Math.max(c - 1, 0))} disabled={current === 0}
          style={{ background: current === 0 ? "#F0F0F0" : "#E1F5EE", color: current === 0 ? "#ccc" : "#085041", border: "none", borderRadius: 10, padding: "10px 22px", cursor: current === 0 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>
          ← Previous
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {SLIDES.map((_, i) => <div key={i} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? "#1D9E75" : "#D0D0D0", transition: "width 0.2s" }} />)}
        </div>
        <button onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1}
          style={{ background: current === SLIDES.length - 1 ? "#F0F0F0" : "#1D9E75", color: current === SLIDES.length - 1 ? "#ccc" : "#fff", border: "none", borderRadius: 10, padding: "10px 22px", cursor: current === SLIDES.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>
          Next →
        </button>
      </div>
    </div>
  );
}
