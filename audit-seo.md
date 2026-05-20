# SEO / Share-Readiness Audit — Nexu Lead Rescue Copilot

**Context:** This is a 48-hour internal hackathon demo, not a marketing site. Search ranking is irrelevant. What matters: the Vercel URL (`https://nexu-ai-lead-recovery.vercel.app`) will be pasted into Slack/WhatsApp for judges and Nexu execs, so **link previews and tab titles** are the audit's real targets. Demo is Thursday 2026-05-22 15:00.

**Note on file naming:** The brief lists `lead.html`, but the actual file is `lead-juan-marquez.html`. The dashboard row also points to `lead.html` (line 216 of `index.html`) — that's a broken link separate from this audit. Audit findings below use the real filename.

---

## 1. Link-preview readiness (TOP PRIORITY)

### Current state

| File | `<title>` | `<meta description>` | `og:*` | `twitter:*` |
|---|---|---|---|---|
| `index.html` | `Recovery AI Dashboard` (generic, English, no brand) | missing | missing | missing |
| `lead-juan-marquez.html` | `Detalle de Lead — Nexu TEAM` | missing | missing | missing |
| `conversation.html` | `Vista de Conversación IA — Nexu TEAM` | missing | missing | missing |
| `analytics.html` | `Analítica — Nexu TEAM` | missing | missing | missing |
| `settings.html` | `Configuración — Nexu TEAM` | missing | missing | missing |

**Verdict:** Paste the Vercel URL into Slack right now and you get a blank-white unfurl with the title "Recovery AI Dashboard" — looks like an unfinished side project, not a serious pitch. This is the single biggest perception gap before the demo. **Fix this first.**

### `og:image` strategy

Produce **one** PNG, reuse across all five pages.

- **File:** `/og-image.png`, committed to repo root so Vercel serves it at `https://nexu-ai-lead-recovery.vercel.app/og-image.png`
- **Dimensions:** 1200×630 (Open Graph standard; Twitter renders this correctly as `summary_large_image`)
- **Format:** PNG (or JPG ≤ 300 KB)
- **Content suggestion (in order of effort vs. payoff):**
  1. **Easy path (5 min):** Take a clean screenshot of the dashboard at `index.html` showing the KPI row (`1,492 LEADS dormidos`) and the lead table. Crop to 1200×630. Overlay top-left: `Nexu Lead Rescue Copilot`. Overlay bottom-left tagline: `Rescatar la intención antes de que se enfríe.` (Spanish version of the PRD §1 tagline.)
  2. **Polished path (20 min):** Same screenshot, but with a 40% dark gradient on the left third, brand purple (`#4648d4`) "Nexu TEAM" wordmark, and the Spanish tagline in white Geist. Right two-thirds shows the dashboard chrome.
- **Why screenshot, not logo:** Judges scrolling Slack at 14:50 should see *the product*, not a brand mark. The product looks credible; a bare logo doesn't.

### Exact tag set for `index.html` (copy-paste, insert after line 4)

```html
<meta name="description" content="AI copilot que clasifica cada lead de financiamiento Nexu (NEW · WARM · COOLING), redacta un seguimiento por WhatsApp en español y deja que comercial apruebe el envío con un clic.">
<link rel="canonical" href="https://nexu-ai-lead-recovery.vercel.app/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nexu Lead Rescue Copilot">
<meta property="og:title" content="Nexu Lead Rescue Copilot — Recovery Dashboard">
<meta property="og:description" content="Rescatar la intención antes de que se enfríe. AI copilot que sigue cada lead de Nexu y redacta el WhatsApp en español, listo para aprobar.">
<meta property="og:url" content="https://nexu-ai-lead-recovery.vercel.app/">
<meta property="og:image" content="https://nexu-ai-lead-recovery.vercel.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Nexu Lead Rescue Copilot dashboard showing 1,492 dormant leads and the active recovery queue.">
<meta property="og:locale" content="es_MX">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Nexu Lead Rescue Copilot">
<meta name="twitter:description" content="Rescatar la intención antes de que se enfríe. AI copilot de seguimiento de leads para Nexu.">
<meta name="twitter:image" content="https://nexu-ai-lead-recovery.vercel.app/og-image.png">

<!-- Favicon (one line, optional but visually completes the unfurl) -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

The other four pages need the same block with their page-specific `og:title` / `og:url` (see §2). They can share the same `og:image` — judges won't deep-link to `analytics.html`.

---

## 2. Page titles + meta descriptions

Format chosen: `[Specific page] · Nexu Lead Rescue Copilot`. The middle dot reads cleaner than em-dash in narrow Slack tabs; "Nexu TEAM" is replaced with the full product name so a 5-tabs-open judge can tell *which* product. Customer-facing copy stays Spanish per PRD §12; app chrome blends Spanish nouns + product-name English (matches what's already in each file).

| File | New `<title>` (≤ 60 chars) | `<meta description>` (≤ 160 chars) |
|---|---|---|
| `index.html` | `Recovery Dashboard · Nexu Lead Rescue Copilot` | `AI copilot que clasifica cada lead de financiamiento Nexu y redacta el seguimiento por WhatsApp en español. Aprobar el envío con un clic.` |
| `lead-juan-marquez.html` | `Detalle de Lead · Nexu Lead Rescue Copilot` | `Vista de un lead: línea de tiempo, AI Insight, razonamiento y el mensaje stage-aware listo para aprobar.` |
| `conversation.html` | `Conversación WhatsApp · Nexu Lead Rescue Copilot` | `Hilo de WhatsApp con borrador generado por Claude en español mexicano. Un clic para enviar al lead.` |
| `analytics.html` | `Analítica · Nexu Lead Rescue Copilot` | `Funnel y métricas de recuperación: tasa de rescate por etapa (NEW · WARM · COOLING) y placement incremental.` |
| `settings.html` | `Configuración · Nexu Lead Rescue Copilot` | `Configuración del seller, voz de la IA y reglas de escalación para el copiloto de recuperación de leads.` |

Also change `index.html` line 1: `<html lang="en">` → `<html lang="es-MX">` (the actual visible copy on the dashboard is Spanish — `LEADS dormidos`, `Buscar leads...`, `Filtrar`). The other four pages already declare `lang="es"`; bump them to `es-MX` while you're there if it's cheap. **30-second fix.**

---

## 3. Semantic HTML gaps

Good news: most pages already use `<header>`, `<main>`, `<nav>`, `<aside>`, and on `settings.html` proper `<section id="...">` blocks. The gaps below are all under-2-minute edits. Cite format: `file:line`.

### Real gaps (worth fixing)

1. **`index.html:111` — `<h1>Nexu TEAM</h1>` inside the sidebar is competing for `<h1>` with the actual page topic.** The KPI/table region uses `<h2>Recovery Dashboard</h2>` at line 153. The sidebar brand should be a `<p>` or `<span>`, and the page heading promoted to `<h1>`. This is the only file where the heading hierarchy is genuinely inverted — same pattern repeats in all five files (`lead-juan-marquez.html:46`, `conversation.html:42`, `analytics.html:50`, `settings.html:54`). One-line fix per file: change `<h1 class="font-display...">Nexu TEAM</h1>` to `<p class="font-display...">Nexu TEAM</p>`, and promote each page's main heading (`<h2>Recovery Dashboard</h2>` at `index.html:153`, `<h2>Analítica</h2>` at `analytics.html:88`, etc.) from `<h2>` to `<h1>`. ~30 seconds × 5 files.

2. **`index.html:189` — the "Active Recovery Operations" table is wrapped in a bare `<div>`.** Should be `<section aria-labelledby="recovery-ops-title">` with the `<h3>` at line 191 getting `id="recovery-ops-title"`. This is the demo's hero region; making it a landmark helps screen-reader judges (and future SSR). ~1 min.

3. **`index.html:158` — KPI grid is a bare `<div class="grid grid-cols-1 md:grid-cols-4">`.** Wrap in `<section aria-label="KPIs de recuperación">`. ~30 sec.

4. **`lead-juan-marquez.html`** — without re-reading the full file: the timeline, AI Insight, and AI Reasoning regions are almost certainly `<div>`s. Each should be a `<section>` with a heading. This is the screen judges read longest during the demo (1:00–2:00 per PRD §11). ~3 min total, but skip if pressed.

### Already good (no change)

- All five files have `<header>`, `<main>`, `<nav>`, `<aside>` (`index.html:109/131/150`, etc.).
- `settings.html` already wraps each config block in `<section id="...">` (lines 106, 142, 199, 249, 318, 394). No change.
- `nav` correctly contains the route list; no role attributes needed.

---

## 4. Skip list (do NOT bother before Thursday)

| Item | Why skip |
|---|---|
| `robots.txt` | Site is not meant to rank. Vercel auto-serves a permissive default. Zero demo payoff. |
| `sitemap.xml` | 5 internal pages, no crawl budget concern, no SEO goal. Zero demo payoff. |
| Canonical URLs on every page | One canonical on `index.html` (already in the tag set above) is enough. No duplicate-content risk on a 5-page demo. |
| JSON-LD structured data (`Organization`, `SoftwareApplication`, `Product`) | No rich results possible without an indexed, ranking site. Zero demo payoff. |
| Hreflang | Single-language audience (Mexican Spanish). N/A. |
| Image alt-text audit | Mostly decorative chrome icons and one stock headshot. Not worth the sweep — except the `og:image:alt` above, which IS worth it because it's the screen-reader version of the link unfurl. |
| Core Web Vitals tuning | Tailwind CDN + Google Fonts is "fine" for a demo. Real perf work is a post-hackathon problem. |
| Lighthouse score | Auditing for a number is busywork. The link-preview fix is the only thing a judge will perceive. |

**Exception worth considering (~5-min payoff):** drop a 32×32 SVG favicon at `/favicon.svg`. Slack and browser tabs show a generic globe otherwise, which silently downgrades perceived polish. Use the Nexu purple `#4648d4` with a "N" or the `queue_play_next` Material icon. Defensible 5 minutes.

---

## Priority order (if you only have 15 minutes)

1. **Drop the OG tag block into `index.html`** (the one shareable URL). 3 min.
2. **Screenshot the dashboard → save as `/og-image.png`.** 5 min.
3. **Fix `index.html` `lang="en"` → `lang="es-MX"`.** 10 sec.
4. **Update titles on all 5 pages per §2.** 2 min.
5. **Add favicon.** 5 min.

Skip everything else until after the demo.
