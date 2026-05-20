// api.js — Lead Rescue Copilot client. PRD §9 endpoints, mock-first.
//
// Each function has identical signature in 'mock' and 'live' mode. To swap in
// the real FastAPI backend, flip MODE to 'live' and the fetch() blocks below
// become the real network calls. Mock state is in-memory only — reload to reset.

import { computeFunnelStage } from "./stage.js";

export const MODE = "mock"; // 'mock' | 'live'
const API_BASE = ""; // e.g. "https://api.nexu-ai-lead-recovery.vercel.app" when live

// ---------- internal mock store ----------
let _leadsCache = null;

async function _loadLeads() {
  if (_leadsCache) return _leadsCache;
  const res = await fetch("data/leads.json");
  const raw = await res.json();
  // Re-compute funnel_stage from timestamps so the seed file's stage is
  // authoritative-but-overridable. (PRD §4: stage is computed, not stored.)
  _leadsCache = raw.map((l) => ({
    ...l,
    funnel_stage: computeFunnelStage(l) || l.funnel_stage,
  }));
  return _leadsCache;
}

// ---------- GET /api/leads?stage= ----------
export async function getLeads({ stage } = {}) {
  if (MODE === "mock") {
    const all = await _loadLeads();
    return stage ? all.filter((l) => l.funnel_stage === stage) : all;
  }
  // TODO live:
  // const qs = stage ? `?stage=${encodeURIComponent(stage)}` : "";
  // return fetch(`${API_BASE}/api/leads${qs}`).then((r) => r.json());
}

// ---------- GET /api/leads/{id} ----------
export async function getLead(id) {
  if (MODE === "mock") {
    const all = await _loadLeads();
    return all.find((l) => l.id === id) || null;
  }
  // TODO live:
  // return fetch(`${API_BASE}/api/leads/${id}`).then((r) => r.json());
}

// ---------- POST /api/leads/{id}/generate-action ----------
// Option A (PRD §6): hero leads return pre-cached insight/reasoning/draft.
// Non-hero leads in 'mock' mode return null fields — in 'live' mode this is
// the endpoint that fires Claude Jobs A + B + C.
export async function generateAction(id) {
  if (MODE === "mock") {
    const lead = await getLead(id);
    if (!lead) return null;
    return {
      id: lead.id,
      funnel_stage: lead.funnel_stage,
      ai_insight: lead.ai_insight,
      ai_reasoning: lead.ai_reasoning,
      next_best_action: lead.next_best_action,
      draft_message_es: lead.draft_message_es,
      intent_score: lead.intent_score,
    };
  }
  // TODO live:
  // return fetch(`${API_BASE}/api/leads/${id}/generate-action`, {
  //   method: "POST",
  // }).then((r) => r.json());
}

// ---------- POST /api/leads/{id}/approve-send ----------
// Simulates the human-in-loop send. Mutates in-memory cache so subsequent
// getLead() reflects the new action_status — that's what the conversation
// screen polls.
export async function approveSend(id) {
  if (MODE === "mock") {
    const all = await _loadLeads();
    const lead = all.find((l) => l.id === id);
    if (!lead) return null;
    lead.action_status = "approved_sent";
    lead.updated_at = new Date().toISOString();
    return { id, action_status: lead.action_status, sent_at: lead.updated_at };
  }
  // TODO live:
  // return fetch(`${API_BASE}/api/leads/${id}/approve-send`, {
  //   method: "POST",
  // }).then((r) => r.json());
}

// ---------- GET /api/metrics/summary ----------
export async function getMetricsSummary() {
  if (MODE === "mock") {
    const all = await _loadLeads();
    const byStage = { new: 0, warm: 0, cooling: 0, cold_lead: 0, recovered: 0 };
    let approvedSent = 0;
    let awaitingApproval = 0;
    for (const l of all) {
      byStage[l.funnel_stage] = (byStage[l.funnel_stage] || 0) + 1;
      if (l.action_status === "approved_sent") approvedSent++;
      if (l.action_status === "awaiting_approval") awaitingApproval++;
    }
    return {
      total: all.length,
      by_stage: byStage,
      awaiting_approval: awaitingApproval,
      approved_sent: approvedSent,
    };
  }
  // TODO live:
  // return fetch(`${API_BASE}/api/metrics/summary`).then((r) => r.json());
}
