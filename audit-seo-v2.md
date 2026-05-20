# SEO / Share-Readiness Audit v2 — Verification Pass

**Context:** Re-audit of the 5 modified HTML files against `audit-seo.md` recommendations. Read-only. Demo: 2026-05-22 15:00.

> **Note:** No `seo` skill was available in this session (not in deferred-tool list or skill registry). Audit performed manually against `audit-seo.md` checklist.

---

## 1. Status table

| File | `<title>` | meta desc | OG tags | Twitter tags | Canonical | `lang` |
|---|---|---|---|---|---|---|
| `index.html` | ✅ L4 | ✅ L5 | ✅ full set L7-16 (type, site_name, title, desc, url, image+w/h/alt, locale) | ✅ full L17-20 (card, title, desc, image) | ✅ L6 | ✅ `es-MX` L1 |
| `lead-juan-marquez.html` | ✅ L6 | ✅ L7 | ⚠️ L8-13 — missing `og:url`, `og:image:width/height/alt` | ⚠️ L14-15 — only `card` + `image`; missing `twitter:title`, `twitter:description` | ❌ none | ✅ `es-MX` L2 |
| `conversation.html` | ✅ L6 | ✅ L7 | ⚠️ L8-13 — same gaps as above | ⚠️ L14-15 — same gaps | ❌ none | ✅ `es-MX` L2 |
| `analytics.html` | ✅ L6 | ✅ L7 | ⚠️ L8-13 — same gaps | ⚠️ L14-15 — same gaps | ❌ none | ✅ `es-MX` L2 |
| `settings.html` | ✅ L6 | ✅ L7 | ⚠️ L8-13 — same gaps | ⚠️ L14-15 — same gaps | ❌ none | ✅ `es-MX` L2 |

All five `<title>` and `<meta description>` strings match the recommended text in `audit-seo.md` §2 verbatim.

---

## 2. Link-preview readiness

**Verdict: YES, share-ready (ignoring missing `og-image.png`).** Pasting `https://nexu-ai-lead-recovery.vercel.app` into Slack/WhatsApp will now unfurl with:
- Title: `Nexu Lead Rescue Copilot — Recovery Dashboard`
- Description: full Spanish tagline + value prop
- Site name: `Nexu Lead Rescue Copilot`
- Card type: `summary_large_image` (Twitter/X)
- Locale hint: `es_MX`

**Worst-case render today:** Slack/WhatsApp fetch `og-image` URL → 404 → unfurl falls back to text-only card. Still reads as a finished product (title + tagline + brand line), no longer a blank white card. Acceptable, not optimal.

**Caveat:** deep-links to other pages (e.g., judge shares `/analytics.html`) lose `og:url`, `twitter:title`, `twitter:description`. Slack will still render — it falls back to `og:title` for the Twitter card and synthesizes URL from the link itself. Functional but inconsistent across platforms (X may show domain only as title).

---

## 3. Inconsistencies between pages

1. **`index.html` `og:title` vs `<title>` word order mismatch.** `<title>` (L4) = `Recovery Dashboard · Nexu Lead Rescue Copilot`; `og:title` (L9) = `Nexu Lead Rescue Copilot — Recovery Dashboard`. Both intentional per the audit recs, but the em-dash vs middle-dot and reversed order means the browser tab and the Slack unfurl read differently. Low impact, worth knowing.
2. **`conversation.html` `<h1>` is `Juan Antonio Márquez` (L85)** — the lead's name, not the page topic. Other pages use topic headings (`Recovery Dashboard`, `Analítica`, `Configuración`, `Detalles del Lead`). Defensible (the conversation IS about that lead) but inconsistent.
3. **`lead-juan-marquez.html` `<h1>` (L104) uses `font-headline-section` (20px)** while the other three promoted `<h1>`s use `font-display` (32px). Visually the `<h1>` reads as a subheading. Cosmetic, not semantic.
4. **No description contradictions** — all 5 page descriptions stay on-message and PRD-aligned.

---

## 4. Open assets / work needed before demo

| Asset | Spec | Effort |
|---|---|---|
| `/og-image.png` | 1200×630 PNG, ≤300 KB. Content: dashboard screenshot showing `1,492 LEADS dormidos` KPI row + lead table. Overlay top-left `Nexu Lead Rescue Copilot`, bottom-left Spanish tagline `Rescatar la intención antes de que se enfríe.` Brand purple `#4648d4`. | 5-10 min |
| `/favicon.svg` | 32×32 SVG. Nexu purple `#4648d4` background, white "N" or the `queue_play_next` Material icon. | 5 min |
| OG tag completion on 4 non-index pages | Add `og:url`, `og:image:width=1200`, `og:image:height=630`, `og:image:alt`, `twitter:title`, `twitter:description`, `<link rel="canonical">`, `<link rel="icon" href="/favicon.svg">`. Copy index.html L13-15, L18-19, L6 as templates. | 3 min |
| Broken link `index.html` L216 → `lead.html` | Should point to `lead-juan-marquez.html`. Flagged in `audit-seo.md` §intro, unverified here — not in scope but blocks the demo's row-click moment. | 30 sec |

---

## 5. Semantic HTML status

✅ **All 5 files now have exactly one `<h1>`** and the sidebar `Nexu TEAM` is a `<p>` everywhere:

| File | Sidebar `<p>Nexu TEAM</p>` | Page `<h1>` |
|---|---|---|
| `index.html` | L127 ✅ | L169 `Recovery Dashboard` |
| `lead-juan-marquez.html` | L55 ✅ | L104 `Detalles del Lead` (⚠️ headline-section sizing) |
| `conversation.html` | L51 ✅ | L85 `Juan Antonio Márquez` (⚠️ lead name not topic) |
| `analytics.html` | L59 ✅ | L97 `Analítica` |
| `settings.html` | L63 ✅ | L110 `Configuración` |

`grep -c '<h1'` returns exactly 1 per file. Heading hierarchy inversion from v1 is fully resolved. Other gaps from `audit-seo.md` §3 items 2-4 (KPI grid `<section>`, lead-detail region landmarks) were not part of this pass and remain open — none blocking for demo.
