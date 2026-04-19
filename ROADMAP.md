# Roadmap

> **Status:** Living document. Last revised 2026-04-19.
> **Read [VISION.md](VISION.md) first.**
> Each phase has a concrete deliverable and a completion signal. Scope can shrink, not silently grow. New ideas go to [ITERATION.md](ITERATION.md) or [RESEARCH.md](RESEARCH.md) first.

---

## How to read this

- **Phases are sequential** — not calendar dates. Finish-before-next.
- **Phase 0–2** are shipped and locked (see [CHANGELOG.md](CHANGELOG.md)).
- **Phase 3+** are proposed. Scope is redrawn at the start of each phase after reviewing RESEARCH and ITERATION.
- Everything before **Phase 8** is M4P-first. Phase 8 is where the engine gets extracted into a product.

---

## Phase 0 — Foundation ✅ *shipped*

Static dashboard, Google Sheets → Apps Script → JSON pipeline, caching, filters, event details, validation queue.
Commits: `5030536` → `dac5671`.

## Phase 1 — Expandable categories with smart defaults ✅ *shipped*

Commit: `2c9e456`.

## Phase 2 — Category state persistence (localStorage) ✅ *shipped*

Commit: `578a3c6`.

---

## Phase 3 — Evidence-first hardening *(next)*

**Why.** The dashboard already lists events but evidence is secondary. An M4P user should not be able to look at a claim without seeing what backs it.

**Scope.**
- Source-centric "Evidence" tab (see [EVIDENCE_TAB_ANALYSIS.md](EVIDENCE_TAB_ANALYSIS.md)).
- Event drawer: primary / supporting / contextual source badges with pointers.
- Validation queue: flag events with no primary source; flag unsourced claims.
- Confidence level visible on every claim.

**Deliverable.** An M4P user can audit any event back to its primary sources in ≤2 clicks.

**Completion signal.** Zero events in production have "Verified" status without at least one primary-evidence source.

---

## Phase 4 — Entity & relationship layer

**Why.** Right now `entities` is a lookup table. To reason about M4P ("which orgs co-signed the most declarations?", "who shows up across which phases?") entities need to be first-class.

**Scope.**
- Entity profile pages (rendered, not raw JSON).
- Explicit relations: event ↔ entity ↔ entity edges (participated_in, funded_by, signed, attended, etc.).
- "Given an entity X" view → timeline + claims + co-actors.
- Entity filter on main timeline.

**Deliverable.** Timeline is navigable by entity, not just by event.

**Completion signal.** Every entity referenced in ≥2 events has a profile page.

---

## Phase 5 — Markdown wiki export (the Karpathy layer)

**Why.** This is where the project crosses from dashboard to *LLM Wiki*. The structured DB becomes the source; the wiki becomes the compiled, agent-readable representation.

**Scope.**
- Auto-generate a `/wiki/` tree from the structured DB: one page per event, entity, phase, source.
- `index.md` + `log.md` + cross-links (see Karpathy's `llm-wiki` gist).
- Publishable alongside the static site.
- Fit within a modern context window (~128K–1M tokens) so an LLM can load the whole thing.
- Sensitivity propagation: Confidential content excluded from public build.

**Deliverable.** Drop the wiki into Claude or GPT context → coherent Q&A over M4P without RAG.

**Completion signal.** A fresh agent with wiki-in-context outperforms the same agent with RAG-over-raw-corpus on a fixed M4P eval set.

---

## Phase 6 — Agent-writable substrate

**Why.** Until now, humans type into Google Sheets. To make the substrate compound, agents need to propose changes.

**Scope.**
- Structured "proposed edit" format (claim + source + pointer + confidence).
- Human review queue (extends Phase 3 validation queue).
- Audit trail: who (human/agent) changed what, when, why, with what evidence.
- Ingest flow: drop a PDF/article/URL → agent proposes additions → human merges.

**Deliverable.** An LLM can ingest a new source and propose structured additions to the DB; a human reviews and merges.

**Completion signal.** At least 10 M4P events are added end-to-end via agent-proposal → human-merge.

---

## Phase 7 — Knowledge graph layer

**Why.** Some questions are fundamentally graph questions: "chain of evidence for claim Z," "all events where X and Y co-occur," "shortest path between two orgs."

**Scope — no new infra yet.**
- Graph representation is **derived** from structured tables (see [DECISIONS.md](DECISIONS.md) ADR-0004).
- Graph-shaped queries in-browser (likely via a small JS graph lib).
- Visualisation as a second tab: force-directed, matrix, or both.
- Escape hatch: export to standard graph formats (e.g. GraphML, JSON-LD) so power users can load into Neo4j/KùzuDB externally.

**Deliverable.** Answer multi-hop questions the timeline alone can't.

**Completion signal.** Three concrete M4P research questions answered only via the graph view.

---

## Phase 8 — Productisation (engine extraction)

**Why.** This is the extraction point. Before Phase 8 we stay single-repo (see DECISIONS ADR-0003). Phases 3–7 have proven the substrate works on one real corpus. Now we generalise.

**Scope.**
- Split engine from corpus: `engine/` reusable, `corpus/m4p/` as first instance.
- Schema-as-config: fields, controlled vocabularies, phase model, sensitivity levels all customisable.
- Storage layer pluggable: Google Sheets adapter + git-as-DB adapter (markdown front-matter + YAML — see RESEARCH.md).
- Onboarding: "new wiki in ≤30 min."
- Naming: pick a product name (deferred until now — see DECISIONS ADR-0006).
- Licensing: finalise dual-license posture (see DECISIONS ADR-0002).
- Pricing & hosted-option exploration.

**Deliverable.** A second organisation runs the engine end-to-end on their own corpus.

**Completion signal.** Two live instances (M4P + one external) running off the same engine codebase.

---

## Phase 9 — Federation *(speculative)*

**Why.** Once multiple orgs run their own wikis, cross-wiki citation becomes valuable.

**Scope (to be refined).**
- Linking across wikis (cite another org's event).
- Shared entity registry.
- Federated queries.

**Deliverable.** TBD.

**Completion signal.** TBD.

---

## Sequencing rules

1. **Phase N+1 does not start until Phase N's completion signal is met.** If it drags, cut scope; don't carry debt forward.
2. **Before starting any phase, revisit [RESEARCH.md](RESEARCH.md) and [ITERATION.md](ITERATION.md).** A research outcome or iteration note may change the phase's shape.
3. **Every phase produces at least one DECISIONS.md entry** (ADR) documenting the trade-offs taken.
4. **CHANGELOG.md is updated at the end of every phase**, not during.

## Scope-creep filter

If an idea arrives mid-phase, it goes to one of three places:
- If it extends the **current** phase without new risk → note in the phase's scope.
- If it belongs to a **later** phase → append to that phase's scope.
- If it's uncertain → log in [RESEARCH.md](RESEARCH.md) or [ITERATION.md](ITERATION.md) and forget it until the next phase-boundary review.

Nothing gets silently added to what's in flight.
