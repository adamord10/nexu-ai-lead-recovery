# Backend Wiring Guide — Lead Rescue Copilot

How to drop a real FastAPI + Claude backend behind the existing static frontend with minimal churn. PRD references are to `lead-rescue-prd.md` v2.

---

## 1. Swap pattern (the only frontend change)

In `js/api.js`, flip `MODE = "live"` and set `API_BASE`. Each function's `// TODO live:` block becomes the active path. Signatures and return shapes already match the live contract — HTML callers don't change.

---

## 2. Endpoint map

| `js/api.js` function | HTTP | PRD §9 path | Claude jobs invoked |
|---|---|---|---|
| `getLeads({ stage })` | GET | `/api/leads?stage=` | — |
| `getLead(id)` | GET | `/api/leads/{id}` | — |
| `generateAction(id)` | POST | `/api/leads/{id}/generate-action` | A + B + C |
| `approveSend(id)` | POST | `/api/leads/{id}/approve-send` | — (calls Bot Maker) |
| `getMetricsSummary()` | GET | `/api/metrics/summary` | — |
| _(inbound webhook)_ | POST | `/api/webhook/inbound` | D |

---

## 3. FastAPI handler stubs

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

app = FastAPI()

FunnelStage = Literal["new", "warm", "cooling", "cold_lead", "recovered"]
ActionStatus = Literal[
    "awaiting_approval", "approved_sent", "awaiting_reply",
    "replied_high_intent", "replied_low_intent", "escalated",
]

class Lead(BaseModel):
    id: str
    name_masked: str
    phone_last4: str
    vehicle_interest: str
    financing_amount_mxn: int
    down_payment_mxn: int
    monthly_income_band: str
    created_at: datetime
    last_activity_at: datetime
    stage_reached: str
    stuck_at_step: Optional[str] = None
    prior_touches: int
    source_channel: str
    funnel_stage: FunnelStage
    intent_score: int
    recovery_probability: float
    ai_insight: Optional[str] = None
    ai_reasoning: Optional[str] = None
    next_best_action: Optional[str] = None
    draft_message_es: Optional[str] = None
    action_status: ActionStatus
    is_hero_demo: bool = False
    updated_at: datetime

@app.get("/api/leads", response_model=list[Lead])
def list_leads(stage: Optional[FunnelStage] = None):
    rows = store.all()
    return [r for r in rows if stage is None or r.funnel_stage == stage]

@app.get("/api/leads/{lead_id}", response_model=Lead)
def get_lead(lead_id: str):
    lead = store.get(lead_id)
    if not lead:
        raise HTTPException(404)
    return lead

class GenerateActionResponse(BaseModel):
    id: str
    funnel_stage: FunnelStage
    ai_insight: str
    ai_reasoning: str
    next_best_action: str
    draft_message_es: str
    intent_score: int

@app.post("/api/leads/{lead_id}/generate-action", response_model=GenerateActionResponse)
def generate_action(lead_id: str):
    lead = store.get(lead_id)
    if not lead:
        raise HTTPException(404)
    if lead.is_hero_demo:
        # Option A: return pre-cached fields verbatim.
        return GenerateActionResponse(**lead.dict())
    # Option A + 1 live moment: real Claude only for non-hero leads.
    return run_claude_jobs_abc(lead)

class ApproveResponse(BaseModel):
    id: str
    action_status: ActionStatus
    sent_at: datetime

@app.post("/api/leads/{lead_id}/approve-send", response_model=ApproveResponse)
def approve_send(lead_id: str):
    lead = store.get(lead_id)
    bot_maker.send_whatsapp(lead.phone_last4_to_full(), lead.draft_message_es)
    store.update(lead_id, action_status="approved_sent", updated_at=datetime.utcnow())
    return ApproveResponse(id=lead_id, action_status="approved_sent", sent_at=datetime.utcnow())

class MetricsSummary(BaseModel):
    total: int
    by_stage: dict[str, int]
    awaiting_approval: int
    approved_sent: int

@app.get("/api/metrics/summary", response_model=MetricsSummary)
def metrics_summary():
    return store.compute_summary()
```

Note: `funnel_stage` should be **computed server-side** on every read using the same logic as `js/stage.js` (PRD §4) — single source of truth.

---

## 4. Anthropic API calls

Use the masked payload only (see PII checklist below). Recommended model: `claude-opus-4-7` for hero quality on Job A/C, `claude-sonnet-4-7` if rate-limited.

### Job A — Insight + Reasoning (PRD §10)

```python
from anthropic import Anthropic
client = Anthropic()

msg = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=600,
    system=(
      "You are a Mexican auto-financing analyst. Given a lead's masked profile "
      "and behavioral context, return strict JSON with keys: insight (one "
      "sentence, non-obvious), reasoning (one paragraph, cites specific lead "
      "fields), intent_score (0-100 integer). Never invent facts. Never quote "
      "rates or approval guarantees."
    ),
    messages=[{
      "role": "user",
      "content": json.dumps({
        "funnel_stage": lead.funnel_stage,
        "vehicle_interest": lead.vehicle_interest,
        "financing_amount_mxn": lead.financing_amount_mxn,
        "monthly_income_band": lead.monthly_income_band,
        "stage_reached": lead.stage_reached,
        "stuck_at_step": lead.stuck_at_step,
        "prior_touches": lead.prior_touches,
        "days_since_activity": days_since(lead.last_activity_at),
        "source_channel": lead.source_channel,
      })
    }],
)
parsed = json.loads(msg.content[0].text)
```

### Job C — Spanish message (PRD §10)

```python
msg = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=300,
    system=(
      "Eres asistente de Nexu en español mexicano. Escribe un WhatsApp cálido "
      f"y consultivo. Etapa = {lead.funnel_stage}. Tono: NEW=bienvenida, "
      "WARM=específico y útil, COOLING=baja presión. Máx 3 oraciones. Sin "
      "emoji spam. Nunca prometas tasas ni aprobaciones. Usa solo el nombre "
      "enmascarado."
    ),
    messages=[{
      "role": "user",
      "content": json.dumps({
        "name_masked": lead.name_masked,
        "vehicle_interest": lead.vehicle_interest,
        "stuck_at_step": lead.stuck_at_step,
        "next_best_action": lead.next_best_action,
      })
    }],
)
draft_message_es = msg.content[0].text.strip()
```

Job B (Next Best Action) is a stage-gated menu pick — see PRD §10 table. Cheap to do as a deterministic rule or a small Claude call. Job D (Inbound Classification) runs from the `/api/webhook/inbound` handler.

---

## 5. PII masking checklist (PRD §12)

Before any data leaves the backend toward Claude, confirm:

- [ ] `name` reduced to first name + initial → `name_masked` (e.g. "Mariana G.")
- [ ] Phone reduced to last 4 digits → `phone_last4`. Full number lives only in the Bot Maker send path, never in Claude payload.
- [ ] No RFC, no CURP, no INE number, no full street address in any LLM prompt.
- [ ] Email (if collected) is omitted from LLM payload entirely.
- [ ] Lead `id` is an opaque token (`lead_abc123`), not a customer-derived identifier.
- [ ] Every Claude output cites lead fields used — verified in the response, no hallucinated amounts.
- [ ] Customer-facing strings are Mexican Spanish, ≤ 3 sentences, no rate or approval promises.

---

## 6. Option A + 1 live moment — which leads are which

| Lead ID | Name | Stage | Mode |
|---|---|---|---|
| `lead_juan_001` | Juan A. | new | **pre-cached** (hero) |
| `lead_carlos_002` | Carlos R. | warm | **pre-cached** (hero) |
| `lead_mariana_003` | Mariana G. | cooling | **pre-cached** (hero) |
| `lead_ana_004` … `lead_paola_010` | various | mixed | **live Claude** when `generate-action` is called |

Hero leads have `is_hero_demo: true` and ship with non-null `ai_insight` / `ai_reasoning` / `draft_message_es`. Non-hero leads ship those fields as `null` — the live Claude path fills them on first call.

This gives the demo a safety net (heroes always look perfect) plus a credibility moment (judge says "do another one" → live generation runs on a non-hero lead).

---

## 7. Known frontend-vs-PRD mismatches (reconcile before live wire)

The existing HTML files (`index.html`, `lead.html`) currently hardcode full names like "Juan Antonio Marquez" and "Antonio Poveda Martínez". **PRD §12 mandates `name_masked` = first name + initial only.** The seed in `data/leads.json` follows the PRD. When backend data starts flowing, the HTML rows will need to read `name_masked` from the lead object rather than render the hardcoded full name. Note for the HTML auditing agents: this is a PRD-wins reconciliation, not a bug in the data layer.

Same applies to phone — full numbers do not exist in the lead contract; only `phone_last4`. Any HTML that shows a full phone must switch to `••• ••• ${phone_last4}`.

---

## 8. Inbound webhook (Job D, brief)

`POST /api/webhook/inbound` body shape (Bot Maker → us):

```json
{ "lead_id": "lead_mariana_003", "text": "Sí, me interesa cuándo podemos platicar" }
```

Handler runs Job D, updates `action_status` to `replied_high_intent` / `replied_low_intent` / `escalated` per the classification, and the conversation screen polls `getLead(id)` to pick up the change.

---

End of guide. Sync with PRD §8/§9/§10. PRD wins on conflicts.
