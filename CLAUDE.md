# CLAUDE.md — Nexu AI Lead Recovery Copilot

Context for any Claude session working in this repo. Read this before touching code.

The authoritative product spec is `lead-rescue-prd.md` (v2). This file is the working playbook — what to do, what not to do, and how to move fast.

---

## Project in one line

AI copilot that watches every Nexu auto-financing lead, classifies it (NEW / WARM / COOLING), drafts a Spanish WhatsApp follow-up, and lets ops approve the send with one click.

**Demo: Thursday 2026-05-22, 15:00. Live URL: https://nexu-ai-lead-recovery.vercel.app**

---

## Current state (2026-05-20)

| Piece | Status |
|---|---|
| Screen 1 — Dashboard (`index.html`) | Deployed, mocked data |
| Screen 2 — Lead Detail (`lead.html`) | Built, mocked, not linked from dashboard |
| Screen 3 — Conversation (`conversation.html`) | Built, mocked |
| Analytics (`analytics.html`) | Built, mocked |
| Settings (`settings.html`) | Built, mocked |
| Backend (FastAPI + Claude) | Not started |
| WhatsApp send (Bot Maker) | Access pending |
| 3 hero leads with stories | Not written |
| Demo script | Not written |

All UI is static HTML + Tailwind via CDN. No build step. Open files directly in a browser.

---

## Repo layout

```
index.html          Screen 1 — Recovery dashboard (lead table, KPIs)
lead.html           Screen 2 — Lead detail (timeline, insight, reasoning, draft)
conversation.html   Screen 3 — WhatsApp thread + one-click approve
analytics.html      Funnel and recovery metrics
settings.html       Seller config, voice, escalation rules
README.md           Short project overview + gap audit
lead-rescue-prd.md  Authoritative PRD v2 — product source of truth
stitch_nexu_lead_rescue_copilot/  Design assets / Stitch export
```

---

## The product concept (must know)

Every lead lives in one of three computed stages. **Stage is the product's intelligence — the AI behaves differently per stage.**

| Stage | Definition | AI's job |
|---|---|---|
| **NEW** | ≤ 48h old, ≤ 1 touch | Welcoming qualifier — vehicle + intent |
| **WARM** | Started a step, stalled 2–7 days | Surface specific blocker, offer path forward |
| **COOLING** | Inactive 7–30 days | Low-pressure reignite + flexible terms |

After 30 days → `cold_lead`, no outreach. Stage is computed from `created_at + last_activity_at + prior_touches`, not stored.

The shared `lead` object contract is defined in PRD §8. **Don't drift from it.** Changes go in the PRD, not in code comments.

---

## Demo decision: faked vs. real AI

**Recommended: Option A + 1 live moment.** Pre-cache the 3 hero leads' insight, reasoning, and Spanish message. Wire real Claude for ONE non-hero lead so a judge's "do another one" lands live. Safety + proof.

Decision is locked by the team — confirm before building either path.

---

## Conventions

### Code
- Static HTML + Tailwind (CDN). No build tooling unless we add a backend.
- Fonts: Geist + JetBrains Mono + Material Symbols Outlined.
- Color tokens are defined inline in each file's `tailwind.config` — keep them consistent across screens.
- All customer-facing copy in **Mexican Spanish**. UI chrome can be English or Spanish — match what's already in the file.

### Data / AI
- The shape of a lead is fixed by PRD §8. New fields → update the PRD first.
- Four Claude jobs only: Insight+Reasoning, Next Best Action (stage-gated), Message Generation, Inbound Classification. See PRD §10.
- Action menu is stage-gated. Don't offer COOLING actions on a NEW lead.

### Non-negotiables (PRD §12)
- **PII never goes to the LLM.** Mask name to first name + initial. Hash phone, keep last 4. Strip RFC / CURP / INE / full address.
- Never quote rates, approval guarantees, or amounts not in the lead record.
- Every Claude output must cite the lead fields it used. No hallucinated facts.
- The WhatsApp send is real on stage — a phone in the room must receive a message live.
- Hero leads must look real: Mexican names, real vehicles, realistic income bands. **No `John Doe / 555-1234`.**

---

## Scope discipline

**Rule: if it doesn't appear in the 5-minute demo, we don't build it.**

In scope: dashboard stage filters, Lead Detail wired from dashboard, WhatsApp conversation + one-click approve, real WhatsApp send to a phone, 3 hero leads.

Out of scope: auth, real CRM write-back, background queues, ML training, mobile app, admin screens, fully autonomous send (human always approves — frame as a feature).

If asked to build something outside scope, push back and point to PRD §5.

---

## 48-hour plan (ordered)

### Tue 2026-05-20 (now → midnight)
1. Lock Option A vs B (15 min team decision).
2. Write 3 hero lead stories (NEW / WARM / COOLING) — names, vehicles, financials, timelines, frictions. **Most valuable thing tonight.**
3. Wire dashboard row click → Lead Detail.
4. Option A: hand-write pre-cached insight + reasoning + Spanish message for the 3 hero leads. Option B: minimal FastAPI + Claude for Job A.
5. **22:00 milestone:** click on Mariana row → detail page renders → AI insight visible. Even if 100% static.

### Wed 2026-05-21
- AM: All 3 hero leads working in detail view + Spanish drafts.
- Mid-day: Bot Maker → Twilio sandbox → polished simulated send (in that fallback order). Real send to a team phone.
- PM: Stage filter chips on dashboard. Fix inconsistent table fields (e.g. Antonio Poveda — score 42, no Etapa). Write 5-min demo script word-by-word.
- **20:00 milestone:** end-to-end dress rehearsal #1.

### Thu 2026-05-22 (demo day)
- 09:00 rehearsal #2 · 10:00 bug fixes · 12:00 rehearsal #3 (target 4:30, not 5:00) · 14:00 no code · **15:00 demo.**

---

## Cut order if behind

If Wed 20:00 dress rehearsal slips, cut in this order:

1. Screen 4 (Orchestration Flow)
2. Screen 5 (Seller Escalation)
3. Live Claude on encore lead
4. Real WhatsApp send → fall back to simulated send with great UI

Never cut: dashboard, Lead Detail for hero leads, conversation screen, demo script.

---

## Demo storyboard (memorize)

5 minutes. One hero lead per stage is the spine. See PRD §11 for the beat-by-beat. Key moment: **0:30 of stage time on Mariana → click Approve → phone on stage buzzes.** That moment is the demo.

---

## Open questions (must resolve)

- Option A vs B locked? (PRD §6)
- Bot Maker access secured? (owner: one person)
- 3 hero lead names + stories drafted?
- Demo script written?
- Business-impact math filled in (N × R% × $ = $Z)?

---

## Working style for Claude in this repo

- Be terse. We have 48 hours.
- Default to editing existing HTML files, not creating new ones.
- Don't introduce a build tool, framework, or backend without explicit agreement.
- Don't add features beyond the in-scope list in PRD §5.
- When ambiguous, ask once and proceed — don't stall on questions.
- If something is mocked, say so. Never claim "AI is generating this" when it's hardcoded.
- The PRD is source of truth. If code and PRD disagree, the PRD wins — update code or flag the PRD for an update.
