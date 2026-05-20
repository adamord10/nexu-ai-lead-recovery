// stage.js — pure funnel-stage computation per PRD §4.
// Stage is computed, never stored. Single source of truth.
//
// Rules (PRD §4):
//   NEW      → created ≤ 48h AND prior_touches ≤ 1
//   WARM     → last_activity within 2–7 days
//   COOLING  → inactive 7–30 days
//   COLD     → inactive > 30 days → cold_lead
//
// Inputs are ISO-8601 strings. Pure function, no I/O, no Date.now() unless
// `nowIso` is omitted (then defaults to wall clock — handy for the running app,
// awkward for tests, which is why nowIso is injectable).

export function computeFunnelStage({ created_at, last_activity_at, prior_touches }, nowIso) {
  const now = nowIso ? new Date(nowIso) : new Date();
  const created = new Date(created_at);
  const lastActivity = new Date(last_activity_at || created_at);

  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;

  const hoursSinceCreated = (now - created) / HOUR;
  const daysSinceActivity = (now - lastActivity) / DAY;

  if (hoursSinceCreated <= 48 && (prior_touches ?? 0) <= 1) return "new";
  if (daysSinceActivity > 30) return "cold_lead";
  if (daysSinceActivity >= 7) return "cooling";
  if (daysSinceActivity >= 2) return "warm";

  // Fresh activity but no longer in NEW window → treat as warm (active engagement).
  return "warm";
}

// ---------- inline assertions ----------
// Run with: node js/stage.js   (or load in browser; check console)

function assert(label, actual, expected) {
  const ok = actual === expected;
  const tag = ok ? "PASS" : "FAIL";
  // eslint-disable-next-line no-console
  console.log(`[stage.js] ${tag} — ${label}: got "${actual}", expected "${expected}"`);
  return ok;
}

const NOW = "2026-05-20T12:00:00Z";

assert(
  "freshly created, zero touches → new",
  computeFunnelStage({ created_at: "2026-05-19T16:00:00Z", last_activity_at: "2026-05-19T16:00:00Z", prior_touches: 0 }, NOW),
  "new"
);

assert(
  "created 5 days ago, last activity 3 days ago → warm",
  computeFunnelStage({ created_at: "2026-05-15T12:00:00Z", last_activity_at: "2026-05-17T12:00:00Z", prior_touches: 2 }, NOW),
  "warm"
);

assert(
  "inactive 16 days → cooling",
  computeFunnelStage({ created_at: "2026-04-22T10:00:00Z", last_activity_at: "2026-05-04T12:00:00Z", prior_touches: 3 }, NOW),
  "cooling"
);

assert(
  "inactive 45 days → cold_lead",
  computeFunnelStage({ created_at: "2026-03-15T10:00:00Z", last_activity_at: "2026-04-05T12:00:00Z", prior_touches: 4 }, NOW),
  "cold_lead"
);

assert(
  "created 12h ago but already 2 touches → warm (out of NEW window by touches)",
  computeFunnelStage({ created_at: "2026-05-20T00:00:00Z", last_activity_at: "2026-05-20T01:00:00Z", prior_touches: 2 }, NOW),
  "warm"
);
