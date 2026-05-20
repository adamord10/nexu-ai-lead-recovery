# Lead Rescue Copilot — PRD v2
**Nexu AI Hackathon · Demo Thu May 21, 2026 · 15:00**

*Product Lead: [Your name] · Team: Endpoints, Dashboard, Data*
*Status: Reflects deployed state · Last updated: Tue May 19 · v2*

> **Live build:** https://nexu-ai-lead-recovery.vercel.app

---

## 1. What we're building, in one sentence

An AI copilot that watches **every Nexu financing lead** — new, warm, and cooling — understands where each one is stuck and why, drafts a stage-appropriate WhatsApp message in Spanish, and lets commercial ops approve the send with one click. Closes the gap between intent and placement, end-to-end.

**Tagline:** *Rescue intent before it cools — at every stage of the funnel.*

---

## 2. Why this matters (business case)

Nexu's growth is gated by **placement volume**, and the funnel leaks at every stage — not just the end. New leads sit untouched. Warm leads stall on documents. Cooling leads ghost. Across 3,000+ dealerships this work is manual, inconsistent, and unscalable.

Lead Rescue Copilot turns the full lead lifecycle into an AI-orchestrated workflow. The human stays in the loop on every send, but the *thinking* (who to contact, why, when, with what message) is autonomous.

**Target impact (illustrative — fill Thursday morning):**
*N leads/month intervened × R% incremental conversion × $ avg loan = $Z MXN/month in incremental placement.*

---

## 3. Where we are right now (honest state)

| Component | Status |
|---|---|
| **Screen 1 — Recovery Dashboard** | ✅ Deployed on Vercel, branded, Spanish copy, table + metric cards |
| **Screen 2 — Lead Detail** | 🔴 Not built. Highest-priority next build. |
| **Screen 3 — WhatsApp Conversation** | 🔴 Not built. The demo's hero moment. |
| **Backend (FastAPI + Claude)** | 🟡 Not built. May be faked (see §6). |
| **SQL / Real data** | 🟡 Frontend is hardcoded mock data. CRM export status: unknown. |
| **Bot Maker access** | 🟡 Unknown. One person owns finding out. |
| **Demo script** | 🔴 Not written. |
| **3 hero demo leads** | 🔴 Not designed. |
| **Business-impact math** | 🔴 Not assembled. |

**Time to demo: ~48 hours.** Scope discipline matters more than any single feature.

---

## 4. The three funnel stages — the core product concept

Every lead lives in one of three stages. The AI behaves differently per stage. **This is the product's intelligence.**

| Stage | Definition | What's gone wrong | AI's job |
|---|---|---|---|
| **NEW** | Created ≤ 48h, ≤ 1 touch | Nothing yet — momentum dies fast | Warm welcome, qualify vehicle + intent |
| **WARM** | Started a step, stalled 2–7 days | Specific friction — usually docs or payment math | Surface blocker, offer path forward |
| **COOLING** | Inactive 7–30 days | Lost momentum, may be talking to competitors | Reignite with low-pressure outreach + flexible terms |

After 30 days inactivity → auto-mark `cold_lead`, no further outreach.

Stage is **computed**, not stored — single source of truth from `created_at` + `last_activity_at` + `prior_touches`.

---

## 5. Scope for Thursday demo

### In scope (must ship)
- **Screen 1 — Lifecycle Dashboard** ✅ already deployed
   - Add: stage filter chips (NEW / WARM / COOLING) at top
   - Fix: inconsistent empty `Etapa` fields in table rows
- **Screen 2 — Lead Detail** 🔴
   - Lead summary header (name masked, vehicle, financing amount, monthly income band)
   - Behavioral Timeline (chronological events)
   - **AI Insight Panel** (one-sentence, non-obvious)
   - **AI Reasoning** (why this lead matters now)
   - Stage-aware Next Best Action with rationale
   - "Generate message" button → opens Screen 3
- **Screen 3 — WhatsApp Conversation** 🔴
   - AI-drafted Spanish message in chat-style preview
   - **One-click Approve & Send** button
   - After send: chat thread shows sent message → waiting → customer reply → intent label
- **One live WhatsApp send** to a phone on stage during the demo
- **3 hero demo leads — one per stage**

### Stretch goals
- Screen 4 — Orchestration Flow (cinematic node view)
- Screen 5 — Seller Escalation & Handoff
- Simulación de recuperación chart by stage

### Explicitly out of scope
- Authentication, multi-user login
- CRM write-back to Nexu's real system
- Background job orchestration (Celery, queues)
- ML model training (scoring = rules + LLM rationale)
- Mobile app, settings, admin screens
- Fully autonomous send (human always approves in v1 — this is a *feature*)

**Rule:** if it doesn't show up in the 5-minute demo, we don't build it.

---

## 6. The "real vs. faked AI" decision

**Decision: TBD by team — must lock today (Tue).**

| | **Option A — Pre-cached** | **Option B — Real Claude live** |
|---|---|---|
| Build effort | 6–10 hrs | 18–24 hrs |
| Demo risk | Very low | Higher (latency, API, network) |
| Looks "real" to judges | Depends on insight quality | Yes if it works |
| Recommended | ✅ For 48-hr timeline | Only if backend already 80% built |

**Recommendation: Option A + 1 live moment.** Pre-cache the 3 hero leads. Wire Claude for ONE non-hero lead so when a judge says "do another one," it generates live. Safety + proof.

---

## 7. Core product loop

```
Lead enters or stalls
       ↓
Stage computed (NEW / WARM / COOLING)
       ↓
AI generates Insight + Reasoning
       ↓
AI decides Next Best Action (stage-specific)
       ↓
AI drafts Spanish WhatsApp message
       ↓
Ops user reviews → ONE-CLICK APPROVE
       ↓
Sent via Bot Maker (or fallback)
       ↓
Reply received → intent classified
       ↓
HIGH intent → flag for escalation
LOW intent  → loop back to AI for next nudge
```

**Frame human-in-the-loop as a feature, not a limitation:**
*"Nexu's risk team will never accept a black box messaging customers. We built the AI so it does all the thinking — the human keeps full control."*

---

## 8. The "lead" object — shared data contract

```json
{
  "id": "lead_abc123",
  "name_masked": "Mariana G.",
  "phone_last4": "4421",
  "vehicle_interest": "Mazda 2 2023",
  "financing_amount_mxn": 285000,
  "down_payment_mxn": 45000,
  "monthly_income_band": "25k-40k",

  "created_at": "2026-05-15T10:00:00Z",
  "last_activity_at": "2026-05-17T14:30:00Z",
  "stage_reached": "biometric_validation",
  "stuck_at_step": "income_proof_upload",
  "prior_touches": 2,
  "source_channel": "agency_referral",

  "funnel_stage": "warm",
  "intent_score": 78,
  "recovery_probability": 0.62,

  "ai_insight": "Lead returned to simulator twice in last 24h.",
  "ai_reasoning": "Stuck on income docs. Profile suggests freelancer — likely friction with formal payroll proof.",
  "next_best_action": "send_whatsapp_flexible_docs",
  "draft_message_es": "Hola Mariana 👋 ...",
  "action_status": "awaiting_approval",

  "is_hero_demo": true,
  "updated_at": "2026-05-21T10:14:00Z"
}
```

**`funnel_stage` enum:** `new` · `warm` · `cooling` · `cold_lead` · `recovered`
**`action_status` enum:** `awaiting_approval` · `approved_sent` · `awaiting_reply` · `replied_high_intent` · `replied_low_intent` · `escalated`

**Owner of the contract:** Product Lead. Changes go in this doc, not Slack.

---

## 9. Endpoints (v1)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/leads?stage=new\|warm\|cooling` | List leads filtered by stage |
| `GET` | `/api/leads/{id}` | Full detail with insight + reasoning |
| `POST` | `/api/leads/{id}/generate-action` | Claude → stage-aware action + drafted message |
| `POST` | `/api/leads/{id}/approve-send` | Human-approved send via messaging pipe |
| `POST` | `/api/webhook/inbound` | Customer reply → classify intent → update state |
| `GET` | `/api/metrics/summary` | Dashboard top numbers, by stage |

For Option A (pre-cached): these can return hardcoded responses for hero leads, real Claude for non-hero.

---

## 10. AI behavior — what Claude actually does

Four jobs. Each returns structured JSON. **Stage is an input to all of them.**

**Job A — Insight + Reasoning (stage-aware)**
> *Given this lead's stage, behavioral history and drop-off context, produce: (1) a one-sentence insight a human would find non-obvious; (2) a reasoning paragraph explaining why this lead matters NOW; (3) intent score 0–100.*

**Job B — Next Best Action (stage-gated menu)**
> *Choose the best next action from the stage-specific menu. Return action + 1-line justification.*

| Stage | Action menu |
|---|---|
| NEW | `send_whatsapp_welcome_qualifier` · `send_whatsapp_vehicle_confirm` |
| WARM | `send_whatsapp_doc_help` · `send_whatsapp_payment_options` · `send_whatsapp_reassurance` |
| COOLING | `send_whatsapp_reignite` · `send_whatsapp_flexible_terms` · `escalate_to_seller` · `mark_cold` |

**Job C — Message Generation (stage-toned)**
> *Draft a warm, consultative WhatsApp in Mexican Spanish. Tone: NEW = welcoming, WARM = helpful + specific, COOLING = low-pressure + open-ended. Max 3 sentences. No emoji spam. Never promise rates or approvals.*

**Job D — Inbound Classification (on reply)**
> *Classify reply: HIGH_INTENT / NEUTRAL / LOW_INTENT / OBJECTION / OFF_TOPIC. Return label + confidence + one-line summary.*

**Hard rules in every prompt:**
- All customer-facing text in Mexican Spanish
- Never quote rates, approval guarantees, or amounts not in the lead record
- Never share PII to the model — only the masked payload
- If uncertain, recommend escalation, don't fabricate

---

## 11. Demo storyboard — Thursday 15:00

5 minutes, memorized. **One hero lead per stage** is the demo's spine.

| Time | Beat | Screen | What the audience sees |
|---|---|---|---|
| 0:00–0:30 | The hook | Title card | "Nexu's funnel leaks at every stage. Here's how we fix all of them." |
| 0:30–1:00 | Dashboard | Screen 1 | Lifecycle dashboard. 1,492 dormidos. Stage filters. Live KPIs. |
| 1:00–2:00 | Hero #1: Cooling lead (Mariana) | Screen 2 | Click in. Timeline, AI Insight, AI Reasoning. *"This is the thinking Nexu can't do at scale today."* |
| 2:00–3:00 | The send | Screen 3 | Claude-drafted Spanish message. One-click Approve. **Phone on stage buzzes.** |
| 3:00–3:45 | Mariana replies | Screen 3 | Reply comes back, classified HIGH_INTENT. Status updates to "Escalated." |
| 3:45–4:15 | Hero #2 + #3 quick cut | Dashboard | Click NEW (Juan, just registered) → different tone. Click WARM (Carlos, stuck on docs) → different action. *Same brain, different stages.* |
| 4:15–5:00 | The math | Closing slide | "N leads × R% × avg ticket = $Z MXN/month. Ship in 4 weeks." |

---

## 12. Non-negotiables

- **PII never touches the LLM.** Mask names to first-name + initial. Hash phones (keep last 4). Strip RFC/CURP/INE/full addresses.
- **All customer-facing text in Mexican Spanish.** Reviewed by a native speaker before demo.
- **Every Claude output cites the lead fields it used.** No hallucinated facts.
- **The WhatsApp send is real** — a phone in the room must receive a message live.
- **Hero leads must look real.** Mexican names, real vehicles, realistic income bands. No `John Doe / 555-1234`.

---

## 13. 48-hour build plan

### Tuesday (today → midnight)
| Owner | Task |
|---|---|
| You + designer | Write 3 hero lead stories — names, vehicles, financials, timelines, frictions. *Most valuable thing tonight.* |
| You | Lock Option A vs B decision with team (15 min) |
| You | One person owns Bot Maker access hunt |
| Frontend | Build Lead Detail page (Screen 2). Static, hardcoded to one hero lead first. |
| Backend / Data | Option A: hand-write the 3 hero leads' pre-cached insight + reasoning + message. Option B: minimal FastAPI + Claude for Job A. |
| **Tue 22:00 milestone** | Click on Mariana row → detail page renders → AI insight visible. Even if 100% static. |

### Wednesday (Day 1)
| Time | Task |
|---|---|
| AM | Build WhatsApp Conversation screen (Screen 3) with one-click approve |
| AM | All 3 hero leads working in detail view; Spanish messages drafted |
| Mid-day | Bot Maker integration *or* Twilio sandbox *or* polished simulated send. Real send to a team phone. |
| PM | Stage filter chips on dashboard. Fill inconsistent table fields. |
| PM | You: write the 5-min demo script, word by word |
| **Wed 20:00 milestone** | **End-to-end dress rehearsal #1.** Full 5-min flow works, even ugly. |
| Late | Polish — animations, loading states, transitions |

### Thursday (demo day)
| Time | Task |
|---|---|
| 09:00 | Dress rehearsal #2 — full script, real app, real phone |
| 10:00 | Bug fixes from rehearsal |
| 12:00 | Dress rehearsal #3 — time it. Should be 4:30, not 5:00. |
| 14:00 | Coffee. **Do not touch code.** |
| **15:00** | Demo. You drive. |

---

## 14. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Bot Maker API access not secured | High | Fallback chain: Bot Maker → Twilio sandbox → simulated send with great UI |
| WhatsApp template not approved | Medium | Submit Tue. Fallback: send to a number already in 24-hr open window |
| Claude latency on stage | Low (Option A) / Medium (Option B) | Pre-cache hero leads. Live Claude only on non-hero "encore" lead. |
| Integration broken Wed 20:00 | Medium | Hard milestone. If slipped, cut in this order: Screen 4 → Screen 5 → live Claude → real send (final fallback: simulated send) |
| Empty/inconsistent table fields | Already visible | 30 min frontend fix Tue night |
| Demo overruns | Medium | Rehearsals × 3. Target 4:30. |

---

## 15. Judging criteria → how we win each

| Criterion | Weight | How we win it |
|---|---|---|
| **Business impact** | 30% | §2 + §11 closing math · "ship in 4 weeks" framing |
| **Use of AI depth** | 25% | 4 distinct AI jobs (Insight, Action, Message, Classification) · stage-aware reasoning · Spanish drafting |
| **Feasibility** | 25% | Bot Maker (production path, not sandbox) · clean architecture · human-in-loop framing |
| **Demo quality** | 20% | Live WhatsApp send · 3 hero leads × 3 stages · brand-polished UI · memorized script |

---

## 16. What we'd ship next (post-hackathon roadmap)

For the closing slide:

1. **Weeks 1–2:** Production Bot Maker integration · real CRM write-back · 100-lead pilot with one ops user
2. **Weeks 3–6:** Recoverability model trained on Nexu's own conversion data · multi-channel (email + SMS fallback) · seller escalation in production
3. **Weeks 7–12:** Per-dealership routing · A/B testing message variants · revenue attribution dashboard for execs

---

*End of PRD v2. Changes go in this doc, not Slack DMs.*
