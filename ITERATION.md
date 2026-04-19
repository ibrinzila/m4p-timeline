# Iteration

> **Status:** Living document. Last revised 2026-04-19.
> **Purpose.** A rolling list of things that **work today but are flagged for future revision.** Paired with [RESEARCH.md](RESEARCH.md) — that doc is "what we don't yet know"; this doc is "what works but we may want to change."
> **Process.** Reviewed at every phase boundary (see [ROADMAP.md](ROADMAP.md)). No item in this list justifies mid-phase churn — it only informs the *next* phase's scope.

---

## How entries work

Each entry has:
- **What works today** — a factual description of the current state.
- **Why it's flagged** — the latent cost or future friction.
- **Trigger to act** — the condition under which we revise (e.g. "if file exceeds 150 KB," "at Phase 8 split," "if perceived maintenance cost exceeds X").
- **Owner / review point** — which phase boundary or review this surfaces at.
- **Last refreshed** — date.

Entries don't leave this file. When acted on, they either move to an ADR (if the revision is a significant decision) or just get crossed out with a pointer to the commit that resolved them.

---

## Discipline

- **This file is not a TODO list.** TODOs belong in code (or issues). This is a register of *intentional provisional choices*.
- **Not every nit goes here** — only things with a real downstream cost, or that users/agents will feel over time.
- **A new entry should identify the cost**, not just a vague "feels off."

---

## Open iteration items

### I-001 — Monolithic `index.html` (~75 KB)

- **What works today.** All UI + logic + styles live in a single `index.html`. No build step, trivial to deploy, easy to inspect.
- **Why it's flagged.** Searching / editing is already awkward at 75 KB. As Phase 3–4 add features, the file will bloat past the point of being comfortable. Risk of regressions grows with unseparated concerns.
- **Trigger to act.** Any of: file exceeds ~150 KB; merge conflicts become frequent; need to share code between surfaces (timeline + wiki + graph).
- **Owner / review point.** End of Phase 3.
- **Last refreshed.** 2026-04-19.

### I-002 — Google Sheets as source of truth

- **What works today.** Non-technical editors can contribute directly. Zero infrastructure.
- **Why it's flagged.** No diffs, no branching, no PR review, no audit trail of *why* an edit happened. API quotas and cold-start latency on the Apps Script endpoint. Harder to support agent-writable substrate (Phase 6) cleanly.
- **Trigger to act.** Phase 6 introduces the storage-adapter seam (ADR-0005); Phase 8 is the likely flip point. Earlier if Sheets quotas or latency become user-visible.
- **Owner / review point.** Start of Phase 6 (adapter seam); Phase 8 (possible migration).
- **Last refreshed.** 2026-04-19.

### I-003 — Tech stack (vanilla JS + no build)

- **What works today.** Minimal dependencies, fast load, no toolchain to maintain. Optimal for Phase 0 speed.
- **Why it's flagged.** As the UI grows (wiki renderer, graph view, drawer states, routing), vanilla starts to feel thin. The moment we want true components, HMR, or type safety, the decision comes due.
- **Trigger to act.** (a) We need two distinct pages with shared state; (b) a concrete bug is traced to the monolithic file's lack of structure; (c) Phase 8 productisation demands a framework anyway.
- **Owner / review point.** End of Phase 4.
- **Last refreshed.** 2026-04-19.

### I-004 — No build step → no type safety, no linter

- **What works today.** Zero-config dev loop.
- **Why it's flagged.** Silent breakage as the code grows. No enforcement of data-shape invariants; a schema change in Sheets can reach the UI unnoticed.
- **Trigger to act.** First silent-breakage incident attributable to absence of type checks. Otherwise: bundled with I-003 when we reconsider the stack.
- **Owner / review point.** Review alongside I-003.
- **Last refreshed.** 2026-04-19.

### I-005 — Apps Script endpoint (auth, quotas, cold start)

- **What works today.** Free, easy to deploy, "anyone" access tier is good enough.
- **Why it's flagged.** No real authentication, public-URL model doesn't scale to confidential content, Google's quotas and cold starts are outside our control.
- **Trigger to act.** Any of: need to serve Confidential content in the timeline UI; quotas hit in practice; we move to git-as-DB (which replaces this).
- **Owner / review point.** Phase 6 or storage migration.
- **Last refreshed.** 2026-04-19.

### I-006 — localStorage caching strategy

- **What works today.** Fast first paint; background refresh on subsequent loads.
- **Why it's flagged.** No cache-busting on schema change. A client with a stale cache from a prior schema version could render incorrectly. Cache is per-browser, so agents/bots don't share it.
- **Trigger to act.** First schema change that would confuse stale clients. Otherwise: attach a schema version check to cache key.
- **Owner / review point.** End of Phase 3.
- **Last refreshed.** 2026-04-19.

### I-007 — Multiple HTML variants (`index.html`, `timeline-simple.html`, `timeline-options.html`)

- **What works today.** Sandbox files for experimenting with layouts.
- **Why it's flagged.** Repo clutter; unclear which is canonical; risk of divergence. A newcomer won't know which to read.
- **Trigger to act.** Decide per-file: promote, archive (move to `_archive/`), or delete. Phase 3 is the natural time.
- **Owner / review point.** Start of Phase 3.
- **Last refreshed.** 2026-04-19.

### I-008 — Many top-level markdown docs

- **What works today.** Everything is in the root; easy to find.
- **Why it's flagged.** 10+ top-level `.md` files is visually noisy. Some (`DEPLOY_NOW.md`, `QUICK_START_GITHUB.md`, `GITHUB_SETUP.md`) may be stale or redundant. Planning docs (VISION, ROADMAP, DESIGN, DECISIONS, RESEARCH, ITERATION, GLOSSARY, CHANGELOG) are now the load-bearing set.
- **Trigger to act.** Phase 8 cleanup at the latest. Earlier if any doc is flagged as actively wrong.
- **Owner / review point.** Phase 8 productisation cleanup.
- **Last refreshed.** 2026-04-19.

### I-009 — "M4P Timeline" naming baked into user-facing strings

- **What works today.** Clear to current users.
- **Why it's flagged.** At Phase 8 the engine needs its own name; any hard-coded "M4P" in engine code becomes a rename task.
- **Trigger to act.** When extracting `engine/` from `corpus/m4p/` at Phase 8.
- **Owner / review point.** Phase 8.
- **Last refreshed.** 2026-04-19.

### I-010 — Accessibility (a11y) — not yet audited

- **What works today.** Basic semantic HTML.
- **Why it's flagged.** No keyboard-navigation audit, no screen-reader pass, no colour-contrast check beyond intuition.
- **Trigger to act.** Before any meaningful external launch, certainly before Phase 8.
- **Owner / review point.** Phase 7 or Phase 8.
- **Last refreshed.** 2026-04-19.

### I-011 — Performance characterisation at scale

- **What works today.** Current M4P corpus renders fast.
- **Why it's flagged.** No benchmark. We don't know whether 1k / 5k / 10k events break anything. Claim in `instruction.md` is "100–1000+ events without degradation" but unverified.
- **Trigger to act.** Before Phase 8; or when corpus approaches 500 events in practice.
- **Owner / review point.** End of Phase 4.
- **Last refreshed.** 2026-04-19.

### I-012 — Sensitivity enforcement only at render time

- **What works today.** Client-side filter based on `sensitivity`.
- **Why it's flagged.** If we ever build a "public" static site of the wiki, we must filter at *build* time — not at render time in a browser where anyone can inspect network traffic.
- **Trigger to act.** Phase 5 (wiki export) is the forcing function.
- **Owner / review point.** Start of Phase 5.
- **Last refreshed.** 2026-04-19.

### I-013 — No CI, no deploy checks

- **What works today.** Manual `wrangler pages deploy`.
- **Why it's flagged.** Nothing catches a broken `config.json`, a broken JSON export, or a schema violation before it hits prod.
- **Trigger to act.** First production regression that CI would've caught. Otherwise: add a smoke test + schema validation in Phase 5.
- **Owner / review point.** Phase 5.
- **Last refreshed.** 2026-04-19.

### I-014 — Audit trail is implicit (git log only)

- **What works today.** For engine changes, git log suffices.
- **Why it's flagged.** For *content* changes (which happen in Sheets, not git), we have nothing. Who added this event? When? Why? Unanswerable today.
- **Trigger to act.** Phase 6 (agent-writable substrate) requires this by construction. Don't add it earlier; don't defer past.
- **Owner / review point.** Phase 6.
- **Last refreshed.** 2026-04-19.

### I-015 — `data.json` fallback pattern

- **What works today.** Local JSON snapshot as a fallback if the endpoint fails.
- **Why it's flagged.** Can silently go stale. If the fallback triggers, users may not realise they're seeing old data.
- **Trigger to act.** Either auto-regenerate `data.json` on every deploy, or drop the fallback and make failure modes explicit.
- **Owner / review point.** End of Phase 3.
- **Last refreshed.** 2026-04-19.

---

## Process for adding a new entry

1. Notice something that works *but* you wouldn't choose it from scratch today.
2. Check it's actually an iteration item (latent cost, future friction) and not a bug / TODO / research question.
3. Add an entry with the fields above.
4. At the next phase boundary, triage: act on it, defer it with an updated trigger, or drop it if no longer relevant.
