# Git Workflow — Nexu AI Lead Recovery Copilot (Hackathon Edition)

**For:** 3 builders, 48 hours, demo Thursday 2026-05-22 15:00.
**Principle:** Git is a coordination tool, not a quality gate. Don't lose work. Don't overwrite each other. Ship.

This doc supersedes any "production best practices" you've read. The post-hackathon version is at the bottom.

---

## Branch layout

```
main                    ← always deployable, Vercel auto-deploys this
├── feat/lead-detail    ← frontend person
├── feat/backend-api    ← backend/endpoints person
└── feat/sql-schema     ← data person
```

Three long-lived feature branches, **one per builder**. NOT a new branch per task — too much friction at this speed.

---

## The 4 rules that matter

### 1. `main` must always be deployable
Vercel auto-deploys from `main` to `nexu-ai-lead-recovery.vercel.app`. If `main` breaks, the demo URL breaks. Never push something to `main` you haven't run locally.

### 2. Each builder owns their lane
- Frontend → `/app`, `/components`, `/styles`, the HTML screens
- Backend → `/api`, `/lib/ai`, `/lib/messaging`
- Data → `/db`, `/scripts`, `/sql`, `/data`

Merge conflicts happen when two people edit the same file. Stay in your lane and they disappear.

### 3. Merge to `main` twice a day, on a schedule
- **13:00** — lunch merge
- **20:00** — end-of-day merge

Not "when a feature is done." On the clock. Forces integration before the gap gets scary.

**Wednesday 20:00:** everyone must be merged to `main` with end-to-end working — even ugly. Non-negotiable. This is PRD §13's dress-rehearsal milestone.

### 4. Skip PR reviews. Use 60-second screen-shares.
Before merging, jump on Zoom for 60 seconds and show the other two what you're pushing. That's the review. Faster than GitHub PRs, catches more real issues because the context is live.

---

## Commit pattern

Don't bother with conventional commits or semantic versioning. Just:

```bash
git add .
git commit -m "lead detail page renders mariana"
git push
```

Short, present-tense, what-it-does. Save the discipline for after the hackathon.

---

## Branch protection — OFF

Standard advice says "protect main, require approvals." Wrong for a 48-hour hackathon. If someone needs to hotfix at 14:30 Thursday with 30 min until demo, you don't want to be waiting for a PR review.

**Mitigations** (in case someone pushes broken code):
- Vercel preview deploys on every branch — test your branch's preview URL before merging
- The 60-second Zoom walkthrough catches obvious breaks
- Worst case: `git revert <commit>` rolls back in 30 seconds

---

## The merge ritual (memorize this)

```bash
# Step 1: pull latest main
git checkout main
git pull origin main

# Step 2: pull main into your branch and resolve conflicts on YOUR branch
git checkout feat/my-branch
git merge main
# fix conflicts here — your problem, not main's

# Step 3: test that your branch still works
# (open the Vercel preview URL or run locally)

# Step 4: merge your branch into main and push
git checkout main
git merge feat/my-branch
git push origin main
```

**Key idea:** conflicts get resolved on your branch, never on main. Main stays clean.

---

## If things go sideways

| Situation | What to do |
|---|---|
| You broke `main` | `git revert <commit-hash>` then `git push`. Restores in 30s. |
| Two people edited the same file | Whoever merges second resolves the conflict on their branch first. |
| You committed to the wrong branch | `git stash` → `git switch <correct-branch>` → `git stash pop` |
| You can't merge cleanly | Slack the other two, screen-share, fix it together in 5 min |
| Vercel deploy broken | Check Vercel logs. Revert the last commit if needed. |

---

## The product lead's only Git job

You don't need to know branch internals. You need to be the person who at 13:00 and 20:00 says:

> "Everyone push to `main` now. Let's see the live site work end-to-end."

That's a 5-minute ceremony, twice a day. It's what keeps the team integrated without you ever opening a code file.

---

## Explicitly NOT doing during the hackathon

- ❌ One branch per task
- ❌ Required PR reviews on `main`
- ❌ Conventional commit messages (`feat:`, `fix:`)
- ❌ Squash-and-merge ceremonies
- ❌ Rebase workflows (force-pushes are landmines for tired teams)
- ❌ A `develop` branch alongside `main`
- ❌ Branch protection rules
- ❌ GitFlow

All appropriate for a 6-person team shipping over months. All slow you down over 48 hours.

---

## After the hackathon

If Lead Rescue gets the leadership-sponsored v1 continuation, adopt the real thing:

- Protected `main`
- PR reviews required
- One branch per task / per feature
- Staging + production environments
- Conventional commits, semantic versioning
- CI checks before merge

That's the right answer for *that* phase. Not this one.

---

*Print this. Pin it in the team channel. The 13:00 / 20:00 merge ceremony is non-negotiable.*
