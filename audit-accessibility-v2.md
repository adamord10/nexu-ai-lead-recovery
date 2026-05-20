# Accessibility Audit v2 — Post Code-Quality Fix Verification

**Scope:** Re-audit of the 5 demo screens after the code-quality-only fix pass (no UI/layout changes).
**Source of truth:** `audit-accessibility.md` (QW-1 → QW-10).
**Date:** 2026-05-20 (T-2 days to demo).

---

## 1. Status of QW-1 → QW-10

| QW | Fix | Status | Evidence |
|----|-----|--------|----------|
| **QW-1** | Hero button `aria-label` + icon `aria-hidden` + text span | ✅ landed | `conversation.html:162` (`aria-label="Aprobar y enviar mensaje al cliente"`, `<span>` wraps text, icon has `aria-hidden="true"`). `lead-juan-marquez.html:274` same pattern. **Focus ring CSS deferred per constraint.** |
| **QW-2** | Dashboard `<tr>` keyboard-accessible | ⚠️ partial — semantically incorrect (see §2) | `index.html:232, 255, 278, 298, 319` — all 5 rows have `tabindex="0"`, `onkeydown` Enter/Space, descriptive `aria-label`. But `role="link"` is on a `<tr>` (see §2). |
| **QW-3** | Header icon-button labels | ⚠️ partial | Landed on `index.html:155, 158, 161`, `analytics.html:87, 88`, `lead-juan-marquez.html:88`, `conversation.html:89` (more_vert). NOT landed on `lead-juan-marquez.html:99` (back-arrow span — has `aria-hidden`, OK), but the JA-avatar pseudo-button (`lead-juan-marquez.html:89`, `analytics.html:89`, `conversation.html:83`) is a `<div>`, not a button — never had a label, audit didn't flag it. **Settings header (`settings.html:78–91`) has no icon buttons to label — N/A.** |
| **QW-4** | Conversation thread `role="log"` + `aria-live` | ✅ landed | `conversation.html:92` — `role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación de WhatsApp con el cliente"`. |
| **QW-5** | Orchestration status panel `role="status" aria-live` | ⚠️ partial | Landed on `lead-juan-marquez.html:236`. **NOT landed on `conversation.html`** — the "Acción Recomendada" panel (`conversation.html:152–165`) and the `EN COLA AUTO.` chip (`:158`) have no live region. This is the panel the demo storyboard expects to flip status during the "phone buzzes" beat. |
| **QW-6** | Hide decorative icons globally | ⚠️ partial | Hero/send/back-arrow/notifications/more_vert icons got `aria-hidden="true"` (e.g. `lead-juan-marquez.html:99, 233, 274`, `conversation.html:89, 162`, `index.html:156, 159`). But dozens of decorative Material Symbols still un-hidden: `index.html:179, 186, 193, 210, 214, 252, 275, 316, 339, 349, 355`; `lead-juan-marquez.html:124, 130, 138, 151, 182, 188, 196, 202, 204, 211, 219, 249`; `conversation.html:67, 106, 120, 122, 155`; `analytics.html:83, 101, 111, 119, 127, 135`. Screen readers will still vocalize "arrow_upward", "directions_car", "calculate", etc. |
| **QW-7** | Empty Etapa cells → em-dash | ❌ deferred (UI) | `index.html:272, 292, 313` still contain `<td …><br></td>`. Per constraint — visible change, intentionally skipped. |
| **QW-8** | Settings toggle inputs keyboard-focusable | ❌ deferred (UI) | `settings.html:52` still `.toggle input { display:none; }`. Every toggle on the page is unreachable via keyboard. Per constraint — CSS visible-state change skipped. |
| **QW-9** | Search input `aria-label` | ✅ landed | `index.html:211` — `aria-label="Buscar leads" name="search"`. |
| **QW-10** | SVG chart `role="img"` + `aria-label` + `<title>` | ✅ landed | `analytics.html:157–158`. |

**Cleanly landed: 5 (QW-1, QW-4, QW-9, QW-10, and QW-3 covers the hot path).** Partial: QW-2, QW-5, QW-6. Deferred per constraint: QW-7, QW-8.

---

## 2. New issues introduced by the fixes

1. **`role="link"` on a `<tr>` breaks table semantics.** `index.html:232, 255, 278, 298, 319`. ARIA role on a `<tr>` overrides its implicit `row` role — screen readers will stop announcing "row 1 of 5, column Nombre…" and instead announce each row as a flat link, losing the column-header association. The intent (keyboard-clickable row) is achieved by `tabindex="0"` + `onkeydown` alone; the `role="link"` is doing harm. Recommend dropping `role="link"` (keep `tabindex`/`onkeydown`/`aria-label`), or migrating to `role="button"` if a role is required.
2. **QW-5 mis-applied to wrong file.** Live region landed on `lead-juan-marquez.html` but NOT on `conversation.html` (the right-hand "Acción Recomendada" / "EN COLA AUTO." panel at `:152–165`). The demo storyboard's status flip during the hero moment happens on the conversation screen, not the lead detail. As shipped, the status pill swap will not announce.
3. **`mic` and `add` buttons in disabled input** (`conversation.html:120, 122`) remain unlabelled and still focusable. Audit (§Medium) asked for `aria-hidden="true" tabindex="-1"`. Not landed. Minor.
4. **`title="AI Generated"` plus `aria-label="Generado por IA"` on a `<span>`** (`conversation.html:107`). Non-interactive `<span>` with `aria-label` is ignored by most screen readers — the `title` tooltip works visually. Cosmetic, not a regression, but worth knowing.
5. **No new heading-hierarchy regressions.** All 5 audited files have exactly one `<h1>`. Good.
6. **No mismatched-name regression.** Spot-checked: every `aria-label` on the row links and on `lead-juan-marquez.html` matches the actual lead in the file. The orchestration `role="status"` block on `lead-juan-marquez.html:236` does not mention any lead by name — clean.

---

## 3. Top 3 remaining demo-killers

1. **Settings toggles still keyboard-dead** (`settings.html:52`, `display:none` on the input). If a judge tabs through the settings page (or any toggle gets demoed), all 6+ toggles are unreachable. Demo storyboard cuts settings, so risk is low — but if it's shown, it's a visible fail. *Deferred per constraint, acknowledged.*
2. **Conversation orchestration panel has no live region** (QW-5 gap). The "EN COLA AUTO. → Enviado → Esperando respuesta → Respondió" beat at 2:00–3:45 has no `aria-live` hook on the conversation screen. The lead-detail screen has one, but the demo lingers on conversation. ~30 seconds to fix on `conversation.html:152` (wrap the inner block in `role="status" aria-live="polite"`).
3. **Dashboard rows announce as bare links, not table rows** (new bug §2 #1). A judge using VoiceOver will hear "Abrir detalle del lead Juan Antonio Marquez, link" with no column context. Drop `role="link"` from the 5 `<tr>`s to fix in one find/replace.

---

## 4. What's actually shippable now

The demo URL passes the "judge does not use a screen reader" floor cleanly — hero button labeled, dashboard rows keyboard-clickable, live region on the WhatsApp thread, SVG chart described, search input labeled. Two real gaps remain (`role="link"` on `<tr>` and missing live region on the conversation orchestration panel) and should be fixed before Thursday; everything else is either cosmetic or intentionally deferred.
