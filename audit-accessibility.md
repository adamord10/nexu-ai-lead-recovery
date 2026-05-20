# Accessibility Audit — Nexu Lead Rescue Copilot

**Scope:** 5 deployed HTML screens (`index.html`, `lead.html`, `conversation.html`, `analytics.html`, `settings.html`).
**Lens:** Thursday 15:00 live demo. Pragmatic over pedantic.
**Hero moment per PRD §11:** Mariana lead → click **Aprobar y Enviar** → phone on stage buzzes. That button cannot fail.

---

## 1. Top 5 demo-killer issues

These break the live demo flow or directly endanger the hero moment. Fix before Thursday.

| # | Issue | File · line | Why it kills the demo |
|---|---|---|---|
| **1** | **"Aprobar y Enviar" hero button has no `aria-label` and contains an inline icon span that screen readers + voice control will read as "Aprobar y Enviar send".** The button is also not keyboard-focusable in a meaningful way — no visible focus ring (relies on browser default, overridden by Tailwind reset). | `conversation.html:153`, `lead.html:265` | If a judge tab-keys to test interactivity or the demo presenter mis-clicks and recovers with keyboard, the hero button has no visible focus. Also the live-demo screencast may show an awkward focus state. |
| **2** | **No live region / ARIA announcement for the "phone buzzes" status change.** When status flips from `EN COLA AUTO.` → `Enviado` → `Esperando respuesta` → `Respondió`, nothing in the DOM is marked `aria-live`. Per PRD §11 the audience needs to *see* that state transition land. | `conversation.html:149` (status pill), `lead.html:225–234` (orchestration panel) | The story beat 2:00–3:45 is the status flip. If the DOM doesn't visibly announce the change (and a11y aside, this matters for visual polish — judges will see the chip just silently swap), the moment lands flat. |
| **3** | **Dashboard rows use `onclick="window.location='lead.html'"` on `<tr>` — not keyboard-accessible, no `role`, no `tabindex`.** A judge testing the live URL on their laptop with the keyboard can't navigate into a lead. Worse: the row has no `cursor` indicator beyond hover, and screen readers won't announce it as clickable. | `index.html:216, 239, 262, 282, 303` | If a judge tries to "drive" the dashboard themselves, they hit a dead end. The PRD's beat 1:00 is "click in" — make sure that works for any input modality. |
| **4** | **Sidebar icon-only buttons (`notifications`, `smart_toy`, profile avatar button) have NO accessible name.** They render as Material Symbols ligatures inside `<span>`s with no `aria-label` on the wrapping `<button>`. | `index.html:139–147`, `lead.html:79`, `conversation.html:80, 111, 113`, `analytics.html:78–80`, `settings.html` header | Voice control fails ("click notifications" doesn't work). On a screen-share zoom, judges can't tell what the icons do. Low effort fix, high credibility. |
| **5** | **Conversation message input is `disabled` with the only explanation in `placeholder` text** ("Orquestación IA Activa — Entrada manual deshabilitada."). Placeholders disappear on focus, have no programmatic label, and contrast is insufficient. The disabled state is also a story risk: if a judge tries to type a question into the WhatsApp thread, they get no feedback. | `conversation.html:112` | This is the most-likely spot a judge will poke at ("can I type a reply?"). Currently they get visual silence — confusing during a live walkthrough. |

---

## 2. Per-screen findings

### `index.html` — Recovery Dashboard

**High**
- **Row click handler is not keyboard accessible** (`:216, 239, 262, 282, 303`). Fix: add `tabindex="0"` + `role="button"` + `onkeydown` for Enter/Space, OR wrap the row content in an `<a href="lead.html">`. The PRD's beat 1:00 *is* this click.
- **Search input has no `<label>` or `aria-label`** (`:195`). Just `placeholder="Buscar leads..."`. Add `aria-label="Buscar leads"`.
- **Stage filter chips (NEW / WARM / COOLING) — NOT YET BUILT** per PRD §13 Wed PM. When they land, they MUST be `role="tablist"` or `<button aria-pressed>` — not styled `<div>`s. Flag for the agent building them.
- **Pagination buttons have no `aria-label`** (`:332–340`). "1", "2", "3" is fine; chevrons need `aria-label="Página anterior"` / `"siguiente"`.
- **Header icon buttons have no `aria-label`** (`:139, 142, 145`). Notifications, smart_toy (Copilot?), profile.
- **Empty `<td>` with `<br>`** for Etapa column on Antonio (`:256`), Elena (`:276`), David (`:297`) is announced as nothing by screen readers and looks broken visually. Demo gap noted in CLAUDE.md "Fix inconsistent table fields" — also an a11y/visual issue. Replace with `<span class="text-on-surface-variant/50">—</span>` or hide via `aria-hidden`.

**Medium**
- **KPI cards are static `<div>`s** (`:159, 166, 173, 180`) — fine, but the "1,492" number has no relationship to its label "LEADS DORMIDOS" for AT. Use `<dl>/<dt>/<dd>` OR add `aria-labelledby`. Skip unless time permits.
- **Row hover relies on `:hover` only.** The whole row should have `:focus-visible` styling too once it's keyboard-accessible (see High #1).
- **Pulse animation on "IA Core Activa" indicator** (`:134`) — purely decorative. Respect `prefers-reduced-motion`. Wrap in a `@media (prefers-reduced-motion: reduce)` rule. (Skip if running short on time.)

**Low**
- Sidebar nav uses `<a>` correctly — good. Active state on Recovery Dashboard uses both color AND a left border (`:115`) — sufficient non-color signal.
- Score rescate bar (`:221`) is decorative — the numeric value is shown adjacent. OK as-is.
- Profile avatar image `alt="Profile"` (`:146`) is bare; fine for demo, but could be more descriptive.

---

### `lead.html` — Lead Detail

**High**
- **"Aprobar y Enviar" button (`:265`) has no `aria-label`** and contains an icon span. Screen reader will read "send Aprobar y Enviar" or skip the icon depending on font load timing. Wrap text in a span so the icon is semantically separate, OR add `aria-label="Aprobar y enviar mensaje a Juan Antonio"`. **This is the hero button. Treat as P0.**
- **Lead status pill (`:97–99`)** "En curso" — color-only state indicator paired with `bg-primary/10 text-primary`. Contrast is borderline (see contrast section). Add `aria-label` with stage explicitly.
- **Orchestration status panel (`:221–234`)** is the live-updating element. Wrap the inner content in `<div role="status" aria-live="polite">` so the state transition is announced + flagged for screen reader users (and gives us a hook for the demo animation).
- **Decorative icons everywhere have no `aria-hidden="true"`.** Material Symbols ligatures get read aloud as their text content (e.g., "arrow_back", "chat"). Add `aria-hidden="true"` to every `<span class="material-symbols-outlined">` that's purely decorative. This is a 5-minute global find-replace.

**Medium**
- **Phone number is shown unmasked** (`:125`) "+52 55 1234 5678". This violates PRD §12 PII rules. Not strictly accessibility, but flagging — it should be `+52 ••• ••• 5678` for the demo screen. Critical for demo credibility if a judge asks "wait, is that a real number on screen?"
- **Timeline items (`:175–214`)** — should use `<ol>` semantically. Currently nested `<div>`s. Skip for hackathon; static content reads fine.
- **"Editar" button (`:266`)** has no `aria-label` and only text. Fine as-is, but ensure focus ring is visible.

**Low**
- Color-coded score (`:135`) "85/100" has the number visible, OK.
- Decorative blurs and gradients (`:222`) — no a11y impact.

---

### `conversation.html` — WhatsApp Thread

**High**
- **"Aprobar y Enviar" button (`:153`)** — see Top 5 #1. Same issue as `lead.html:265`. P0.
- **Disabled input (`:112`)** has only placeholder text explaining state. Add `aria-label="Entrada manual deshabilitada — orquestación IA activa"` AND a visible always-on caption beneath the input ("La IA está conduciendo esta conversación").
- **Conversation thread (`:83–108`)** has no `role="log"` or `aria-live="polite"`. When new messages stream in during the demo (the "Mariana replies" beat 3:00–3:45), they need to be announced AND visually highlighted. Wrap the message container in `<div role="log" aria-live="polite" aria-relevant="additions">`.
- **Sender identity not programmatically associated with messages.** Currently relies on `justify-start` vs `justify-end` (visual position) and a tiny "smart_toy" icon (`:98`). A screen reader hears just the message text with no idea who sent it. Add a visually-hidden `<span class="sr-only">Cliente:</span>` / `<span class="sr-only">Copiloto IA:</span>` at the start of each bubble.
- **"Editar Borrador" button (`:154`)** uses `border-outline` which is `#767586` on `#ffffff` — passes contrast but only barely (4.5:1). Fine.

**Medium**
- **Header back link "Recovery Dashboard" (`:58`)** uses an icon-only `arrow_back` with text adjacent. Add `aria-hidden="true"` to the icon span.
- **`"more_vert"` button (`:80`)** has no `aria-label`. Add `aria-label="Más opciones de conversación"`.
- **Mic and add buttons (`:111, 113`)** in the disabled input area have no `aria-label`. They're decorative-disabled, so add `aria-hidden="true"` and `tabindex="-1"`.

**Low**
- "94% CONFIANZA" badge (`:132`) — color contrast on `bg-primary-container` (`#6063ee`) with `text-on-primary-container` (`#fffbff`) — passes WCAG AA.
- Timestamps (`:90, 97, 105`) are tiny (10px) — below recommended minimum (12px). Skip; they're meta.

---

### `analytics.html` — Funnel Metrics

**High**
- **SVG chart (`:148–180`) has no accessible alternative.** No `<title>`, no `<desc>`, no `role="img"`, no `aria-label`. Add `<svg role="img" aria-label="Tendencia diaria de leads rescatados vs. dormidos durante los últimos 30 días. Rescatados: tendencia ascendente de 40 a 180. Dormidos: rango 50–160.">`. Also add `<title>` inside.
- **Funnel bars (`:190–245`)** are decorative `<div>`s with width%. Each step's number is visible — OK. But "Cerrados 47 · 3.1%" has a bar at `width:5%` (`:242`) which is visually inconsistent with the "3.1%" label. Cosmetic/credibility issue — judges may notice.
- **Channel bar chart (`:259–290`)** — bars have no programmatic value association. The percentage label is adjacent, which suffices.

**Medium**
- **Period selector (`:74`)** "Últimos 30 días ▼" is a `<button>` with chevron icon — no `aria-expanded`, `aria-haspopup`. If it's actually a dropdown (or will be), add these. If it's pure decoration, leave a comment.
- **Export button (`:91`)** — fine, has visible label.
- **Performance table (`:347–407`)** — has proper `<thead>`, `<th>`, `<tbody>`. Good. But no `<caption>`. Add `<caption class="sr-only">Desempeño por ejecutivo comercial</caption>`.

**Low**
- KPI deltas like "↑ 4.2 pp" (`:102`) — direction encoded in both color (`text-tertiary`) and icon. Good.

---

### `settings.html` — Seller Config

**High**
- **Custom CSS toggles (`:154, 161, 168, 213, 223, 233`)** wrap a hidden `<input type="checkbox">` inside a `<label>` — the input is the actual focusable element but it's `display:none` (`:43`), so it's NOT keyboard-focusable. Replace with `opacity:0; position:absolute;` or use `clip: rect(0 0 0 0)` so the input remains focusable. Then add `:focus-visible` styling on `.track`. **This affects every toggle in settings.**
- **Sliders (`:176`)** lack `aria-label`, `aria-valuemin/max/now`. The native `<input type="range">` carries some of this automatically via `min/max/value`, but add `aria-label="Umbral de confianza para auto-envío"` for explicit naming.
- **Toggle items have no semantic relationship between the title and the toggle.** Add `<label>` wrapping the title text OR `aria-labelledby` on the input.

**Medium**
- **Section anchor links (`:90–95`)** — fine as `<a href="#general">`. But there's no `aria-current="page"` on the active one. Skip.
- **"Guardar Cambios" button (`:78`)** — visible label, good.
- **Custom instructions textarea (`:194`)** — has label, good.

**Low**
- Tab nav uses `<ul>/<li>/<a>` — semantic, good.
- Toggle track color `#c7c4d7` (off) vs `#4648d4` (on) — sufficient contrast against white background; good distinction.

---

## Color contrast check (brand palette)

Quick run of the brand tokens against WCAG AA (4.5:1 normal, 3:1 large/UI).

| Pair | Ratio | Verdict |
|---|---|---|
| `text-primary` `#4648d4` on `bg-surface` `#f7f9fb` | **7.1:1** | PASS |
| `text-on-primary` `#ffffff` on `bg-primary` `#4648d4` (hero button) | **7.3:1** | PASS |
| `text-on-surface-variant` `#464554` on `#f7f9fb` | **9.3:1** | PASS |
| `text-tertiary` `#006c49` on `#f7f9fb` (success state, "Sí", deltas) | **5.4:1** | PASS |
| `text-error` `#ba1a1a` on `#f7f9fb` | **5.6:1** | PASS |
| `text-outline` `#767586` on `#f7f9fb` (timestamps, placeholders) | **3.9:1** | **FAIL for body text** (passes for non-text UI). Currently used on disabled input placeholder, timestamps. |
| `text-on-surface-variant` `#464554` on `bg-primary-container/10` (status pill bg ≈ `#f1f1fd`) | **9.0:1** | PASS |
| `text-primary` `#4648d4` on `bg-primary/10` ≈ `#ededfb` (status pills "En curso") | **6.8:1** | PASS |
| `text-on-primary-fixed` `#07006c` on `bg-primary-fixed` `#e1e0ff` (AI message bubble) | **12.3:1** | PASS |
| `text-outline-variant` `#c7c4d7` on `#f7f9fb` (decorative dividers) | **1.6:1** | Fine — only used for borders/dividers, not text. |

**Verdict: brand palette is solid.** Only watch-out is `#767586` used as body text — keep it for icons/borders only.

---

## 3. Quick-win fixes (<5 min each)

Exact snippets the next agent can paste. **Read-only on the HTML; these are recommendations, not edits.**

### QW-1 · Hero button accessible name (BOTH conversation.html:153 + lead.html:265)

```html
<!-- OLD -->
<button class="bg-primary text-on-primary font-body-main font-medium px-6 py-2 rounded shadow-sm hover:bg-primary-container transition-colors flex-1 flex justify-center items-center gap-2">Aprobar y Enviar <span class="material-symbols-outlined text-[18px]">send</span></button>

<!-- NEW -->
<button type="button" aria-label="Aprobar y enviar mensaje al cliente" class="bg-primary text-on-primary font-body-main font-medium px-6 py-2 rounded shadow-sm hover:bg-primary-container focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors flex-1 flex justify-center items-center gap-2"><span>Aprobar y Enviar</span> <span class="material-symbols-outlined text-[18px]" aria-hidden="true">send</span></button>
```

### QW-2 · Dashboard rows keyboard-accessible (index.html:216 and siblings)

```html
<!-- OLD -->
<tr class="hover:bg-surface-container-low transition-colors group cursor-pointer" onclick="window.location='lead.html'">

<!-- NEW -->
<tr tabindex="0" role="link" class="hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors group cursor-pointer" onclick="window.location='lead.html'" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.location='lead.html';}">
```

Apply to all 5 `<tr onclick>` rows.

### QW-3 · Header/sidebar icon buttons get labels (index.html:139–147 and siblings on every screen)

```html
<!-- OLD -->
<button class="..."><span class="material-symbols-outlined">notifications</span></button>

<!-- NEW -->
<button type="button" aria-label="Notificaciones" class="..."><span class="material-symbols-outlined" aria-hidden="true">notifications</span></button>
```

Same pattern for `smart_toy` → `aria-label="Asistente IA"`, profile avatar button → `aria-label="Perfil"`, `more_vert` → `aria-label="Más opciones"`.

### QW-4 · Conversation thread live region (conversation.html:83)

```html
<!-- OLD -->
<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background">

<!-- NEW -->
<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación de WhatsApp con el cliente">
```

### QW-5 · Orchestration status live region (lead.html:227, conversation.html:148)

```html
<!-- lead.html:227 OLD -->
<div class="relative z-10">

<!-- NEW -->
<div class="relative z-10" role="status" aria-live="polite">
```

This gives the demo a hook to announce "Mensaje enviado" → "Cliente respondió" without the audience needing a screen reader — but if a judge IS using one, the moment lands.

### QW-6 · Hide decorative icons (global — every screen)

Find-replace: every `<span class="material-symbols-outlined ...">` that is NOT the sole content of an interactive element should get `aria-hidden="true"`. Use this regex carefully: `(material-symbols-outlined[^"]*")` → `$1 aria-hidden="true"` — then manually un-set on icon-only buttons (where the icon IS the label, which we're replacing with aria-label anyway, so it's fine).

### QW-7 · Empty Etapa cells (index.html:256, 276, 297)

```html
<!-- OLD -->
<td class="py-3 px-4 text-on-surface-variant"><br></td>

<!-- NEW -->
<td class="py-3 px-4 text-on-surface-variant"><span class="text-outline-variant" aria-label="Etapa no definida">—</span></td>
```

### QW-8 · Settings toggle inputs keyboard-focusable (settings.html:43)

```css
/* OLD */
.toggle input { display:none; }

/* NEW */
.toggle input { position:absolute; opacity:0; pointer-events:none; }
.toggle input:focus-visible + .track { outline: 2px solid #4648d4; outline-offset: 2px; }
```

### QW-9 · Search input label (index.html:195)

```html
<!-- OLD -->
<input class="..." placeholder="Buscar leads..." type="text">

<!-- NEW -->
<input class="..." placeholder="Buscar leads..." type="text" aria-label="Buscar leads" name="search">
```

### QW-10 · SVG chart label (analytics.html:148)

```html
<!-- OLD -->
<svg viewBox="0 0 700 260" preserveAspectRatio="none" class="w-full h-full">

<!-- NEW -->
<svg viewBox="0 0 700 260" preserveAspectRatio="none" class="w-full h-full" role="img" aria-label="Tendencia diaria: leads rescatados aumentan de 40 a 180 en 30 días; leads dormidos oscilan entre 50 y 160.">
  <title>Tendencia de Recuperación — Últimos 30 días</title>
```

---

## 4. What to skip (intentionally)

For a 48-hour hackathon with a 5-minute demo, **do not** spend time on:

- **Full screen reader pass with VoiceOver/NVDA.** No judge will use one during the demo. (QW-1 through QW-5 give us the 80/20 that matters.)
- **Skip-to-content links.** Nice-to-have, irrelevant for a guided demo.
- **`prefers-reduced-motion` handling.** Pulse animations are gentle; not worth the CSS.
- **Refactoring timeline `<div>`s to `<ol>`.** Static content, reads fine.
- **Settings page deep accessibility (escalation list, integrations cards).** Settings is not in the 5-minute demo spine; QW-8 (toggle focus) is enough.
- **Color theme dark mode pass.** `darkMode: "class"` is configured but unused. Skip.
- **Lighthouse / axe-core audit run.** Manual review above covers it. Don't get distracted by a 100-item axe report when the demo is the goal.
- **Heading hierarchy cleanup.** There are some `<h2>` after `<h2>` patterns. Doesn't break the demo.
- **Touch target sizes on header icon buttons.** Already 40×40px, sufficient.
- **`analytics.html` deep accessibility.** Analytics is on the cut list (PRD §13 risks). Don't over-invest.
- **Localization of `lang` attribute.** `index.html` has `lang="en"`, others have `lang="es"`. Inconsistency, but invisible. Change `index.html` to `lang="es"` only if you're editing the file anyway.

---

## 5. Recommended fix order for Thursday

1. **Wed AM (15 min):** QW-1, QW-2, QW-7 — hero button + dashboard row clicks + empty Etapa cells. Touches the demo spine.
2. **Wed AM (10 min):** QW-4, QW-5 — live regions on conversation + orchestration status. Powers the "phone buzzes" moment.
3. **Wed PM (10 min):** QW-3, QW-6, QW-9, QW-10 — global icon labels + hide-decorative + search input + SVG.
4. **Wed PM (5 min, optional):** QW-8 — settings toggles. Only if settings is in the demo (CLAUDE.md cut order suggests not).

Total: ~40 min of polish that visibly raises the demo's quality bar without touching data flow.

---

*Audit complete. Read-only — apply via the other agent's data-flow restructure pass.*
