# Nexu AI Lead Recovery Copilot

AI copilot that recovers stalled auto-financing leads at Nexu by spotting cooling deals, drafting personalized WhatsApp follow-ups in Spanish, and surfacing them for one-click seller approval.

**Hackathon demo target:** Thursday 2026-05-22, 15:00.

---

## What this is

Sellers at Nexu manage hundreds of leads across the financing funnel. Most cool off silently — no one notices, no one follows up, deals die. This copilot watches the funnel, classifies every lead (NEW / WARM / COOLING), drafts the next message in the seller's voice, and sends it via WhatsApp on approval.

The pitch in one sentence: **turn 247 stalled leads into recovered revenue without hiring another seller.**

---

## Current state (2026-05-20)

| Piece | Status |
|---|---|
| Screen 1 — Dashboard (`index.html`) | Built, deployed, mocked data |
| Screen 2 — Lead Detail (`lead.html`) | Built, mocked |
| Screen 3 — Conversation view (`conversation.html`) | Built, mocked |
| Analytics (`analytics.html`) | Built, mocked |
| Settings (`settings.html`) | Built, mocked |
| Backend / Claude integration | Not started |
| WhatsApp send (Bot Maker) | Access pending |
| Demo script | Not written |
| Hero leads with stories | Not written |

All UI is static HTML + Tailwind. No backend, no live AI calls.

---

## Screens

- `index.html` — Recovery dashboard. Lead table with score, stage, and risk band.
- `lead.html` — Lead detail. Insight, reasoning, draft message.
- `conversation.html` — WhatsApp-style thread with approve-and-send.
- `analytics.html` — Funnel and recovery metrics.
- `settings.html` — Seller config, voice tone, escalation rules.

Open any file directly in a browser — no build step.

---

## 48-hour gap audit

### Demo-killers
1. Lead Detail not yet linked from dashboard row click.
2. One-click approve → message sends → phone buzzes flow not wired end-to-end.
3. Live WhatsApp send unverified (Bot Maker access).
4. AI generation: faked or real — decision pending.

### Important
5. 5-minute demo script, memorized.
6. 3 hero leads (one NEW, one WARM, one COOLING) with crafted stories.
7. Business-impact closing math (247 leads × Y% × $Z).
8. Inconsistent table fields (e.g., Antonio Poveda — score 42, no Etapa).

### Nice-to-have
9. Orchestration flow screen.
10. Seller escalation handoff.
11. Recovery simulation chart.

---

## Build plan

### Tue 2026-05-20 (today → midnight)
- Decide: pre-cached AI (Option A) vs. live Claude (Option B). Recommended: A + one live moment.
- Write 3 hero lead stories.
- Wire dashboard → Lead Detail.
- End-to-end happy path on hero lead #1 by 10 PM.

### Wed 2026-05-21
- AM: All 3 hero leads working in detail view, Spanish drafts ready.
- Mid-day: Bot Maker (or Twilio fallback) sending real WhatsApp to team phone.
- PM: Filters (NEW / WARM / COOLING), fix inconsistent fields, write demo script.
- 8 PM: Dress rehearsal #1.

### Thu 2026-05-22
- 9 AM: Dress rehearsal #2.
- 12 PM: Dress rehearsal #3 — target 4:30 to leave stage buffer.
- 15:00: Demo.

---

## Open decisions

- **Fake vs. real AI for demo.** Pre-cached is safer; live Claude scores higher on AI depth (25% of judging) if it works.
- **WhatsApp send path.** Bot Maker primary, Twilio sandbox fallback, simulated UI if both fail.
- **Hero lead names and stories.** Not yet drafted.
