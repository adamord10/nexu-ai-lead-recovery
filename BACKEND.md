# Backend Integration Guide

For the endpoint engineer wiring the Nexu Lead Rescue Copilot UI to a real API.

## Single integration point

All UI data flows through `js/data.js`. It exposes `window.NexuData` with four async functions. **The UI never touches data anywhere else.** Swap the function bodies and everything else just works.

| Function | Returns | Suggested endpoint |
|---|---|---|
| `NexuData.listLeads()` | `Lead[]` | `GET /api/leads` |
| `NexuData.getLead(id)` | `Lead \| null` | `GET /api/leads/:id` |
| `NexuData.listConversations()` | `ConversationSummary[]` | `GET /api/conversations` |
| `NexuData.getConversation(leadId)` | `Conversation \| null` | `GET /api/leads/:id/conversation` |
| `NexuData.listEscalations()` | `EscalationSummary[]` | `GET /api/escalations` |
| `NexuData.getEscalation(escId)` | `Escalation \| null` | `GET /api/escalations/:id` |
| `NexuData.getEscalationByLead(leadId)` | `Escalation \| null` | `GET /api/leads/:id/escalation` |

All functions return Promises, so a fetch swap is one line per function.

## Example swap

Today:

```js
async getLead(id) {
  return Promise.resolve(LEADS.find(l => l.id === id) || null);
}
```

After:

```js
async getLead(id) {
  const res = await fetch(`/api/leads/${id}`);
  if (!res.ok) return null;
  return res.json();
}
```

That's it. No HTML or component changes required.

## Data shapes

### `Lead`

```ts
{
  id: string;            // slug, used in URLs: ?id=juan-marquez
  leadId: string;        // human-readable ID shown in UI: "ID-84729"
  name: string;
  initials: string;      // 2 chars, used for avatar
  location: string;
  phone: string;
  email: string;
  incomeVerified: boolean;
  score: number;         // 0-100, rescue score

  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    transmission: string;
    price: number;       // MXN
    term: number;        // months
    downPct: number;     // 0-100
    downAmount: number;  // MXN
    monthly: number;     // MXN
  };

  status: {
    key: "in_progress" | "waiting" | "escalated" | "at_risk";
    label: string;       // shown in badges
    stage: string | null;
  };

  aiInsight: {
    tag: string;                 // "Alta Intención", etc.
    summary: string;
    positive: string[];          // bullet points (green +)
    negative: string[];          // bullet points (red −)
  };

  recommendedAction: {
    title: string;
    detail: string;
  };
}
```

### `Conversation`

```ts
{
  intent: { label: string; confidence: number };       // 0-100
  sentiment: { label: string; trend: string };
  nextBestAction: { title: string; body: string };
  messages: Array<{
    role: "lead" | "ai";   // "ai" = outgoing copilot message
    text: string;
    time: string;          // already-formatted, e.g. "10:42 AM" or "Ayer, 4:20 PM"
  }>;
}
```

### `ConversationSummary` (list view)

Returned by `listConversations()`. Derived from `Lead` + `Conversation` for list rendering.

```ts
{
  leadId: string;
  leadName: string;
  initials: string;
  vehicle: string;                              // "2022 Mazda CX-5"
  status: Lead["status"];
  score: number;
  intent: Conversation["intent"] | null;
  sentiment: Conversation["sentiment"] | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastMessageRole: "lead" | "ai" | null;
  messageCount: number;
}
```

## Pages that consume this

- `conversations.html` — calls `listConversations()` to render the archive
- `conversation.html?id={leadId}` — calls `getLeadWithConversation(id)` to render the chat
- `escalations.html` — calls `listEscalations()` to render the queue
- `handoff.html?id={escalationId}` — calls `getEscalationWithLead(escId)` to render the review card
- Lead detail pages (`lead-*.html`) — currently hardcoded HTML; safe to migrate to `getLead(id)` later

### `Escalation`

```ts
{
  id: string;             // ESC-ID like "8839-AX"
  leadId: string;         // FK to Lead
  reason: string;         // short label shown in the list
  status: { key: "urgent" | "in_review" | "pending" | "accepted"; label: string };
  priority: "critical" | "high" | "medium" | "low";  // drives UI accent
  createdAt: string;      // pre-formatted display string
  assignedTo: { id: string; name: string; role: string; initials: string } | null;

  // Long-form fields shown on the detail page
  headline: string;       // big H3 in the alert card
  subhead: string;        // sub-line
  contextSummary: string; // paragraph
  recommendedPitch: string;  // quoted draft, pre-formatted with quotes
  objection: { title: string; body: string };
}
```

### `EscalationSummary` (list view)

```ts
{
  id: string;
  leadId: string;
  leadName: string;
  initials: string;
  vehicle: string;
  score: number;
  reason: string;
  status: Escalation["status"];
  priority: Escalation["priority"];
  createdAt: string;
  assignedTo: Escalation["assignedTo"];
}
```

## Status keys

The UI maps `status.key` to colored badges and dot animations. Keep these literals stable:

| key | meaning | UI treatment |
|---|---|---|
| `in_progress` | AI is actively conversing with the lead | indigo, pulsing |
| `waiting` | sent, awaiting reply | grey, static |
| `escalated` | handed off to a human seller | emerald, static |
| `at_risk` | sentiment dropped below threshold | red, pulsing |

## Things the UI already assumes

- Messages arrive pre-formatted with display-ready timestamps. If your API returns ISO strings, format them inside `getConversation()` before returning.
- `intent.confidence` and `score` are integers (no formatting needed).
- Currency values come as raw numbers and are formatted with `toLocaleString("es-MX")` in the UI.
- All copy is Spanish (MX). The data layer is locale-agnostic; localize on the server if needed.

## Suggested next steps

1. Stand up the four endpoints above.
2. Replace the four function bodies in `js/data.js` with `fetch` calls.
3. Add error/loading states inside `js/data.js` (the UI shows a "Conversación no encontrada" panel when `getConversation()` returns null — keep that contract).
4. For real-time updates, layer a WebSocket / SSE channel on top of `NexuData` and re-render the affected pages.
