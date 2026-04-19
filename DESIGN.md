# Design

> **Status:** Living document. Last revised 2026-04-19.
> **Read [VISION.md](VISION.md) and [ROADMAP.md](ROADMAP.md) first.**
> This doc describes the **architecture**: current state, target state, and the path between them. Per-decision rationale lives in [DECISIONS.md](DECISIONS.md). Implementation detail lives in code.

---

## Guiding invariant

> **The structured database is the source of truth. Every other artefact — the timeline UI, the markdown wiki, the knowledge graph — is a *derived*, regenerable view.**

If a derived artefact disagrees with the DB, the artefact is wrong. If the DB disagrees with reality, that's a data issue, not an architecture issue.

Corollary: we can throw away and rebuild any derived surface without data loss.

---

## Current architecture (Phase 0–2)

Three tiers, strictly read-only at the edge:

```
┌──────────────────┐      ┌──────────────────────┐      ┌───────────────────────┐
│  Google Sheets   │ ───▶ │ Google Apps Script   │ ───▶ │ Static client (HTML)  │
│  (7 tables)      │      │ (JSON export)        │      │ fetch + localStorage  │
└──────────────────┘      └──────────────────────┘      └───────────────────────┘
   source of truth          serialisation layer              read-only UI
```

**Tier 1 — Google Sheets.** Seven sheets: `Phases`, `Events`, `Sources`, `Event_Source_Map`, `Claims`, `Claim_Sources`, `Entities`. Schema in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md). Humans edit here directly.

**Tier 2 — Apps Script.** `apps-script/Code.gs` exports all seven sheets as a single JSON payload with a `meta` envelope (project, timezone, date format, generated_at, schema version).

**Tier 3 — Static client.** A single `index.html` does fetch → parse → render. localStorage caches the JSON. Filters, search, drawer, validation queue all client-side. No server-side code. Deployable to any static host (Cloudflare Pages currently).

**Known limits.**
- Write path is entirely manual (a human in Google Sheets).
- No graph representation.
- No agent-ingest path.
- No derived wiki.
- `index.html` is a monolith (~75 KB) — see [ITERATION.md](ITERATION.md).
- Apps Script endpoint has Google's rate limits and cold-start latency.

---

## Target architecture (Phase 5–8)

The substrate grows two new derived surfaces and a write path.

```
                     ┌────────────────────────────┐
                     │     Structured DB          │  ← source of truth
                     │  (Sheets today; git later) │
                     └────────────┬───────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             ▼                    ▼                    ▼
    ┌────────────────┐   ┌────────────────┐   ┌─────────────────┐
    │  Timeline UI   │   │ Markdown wiki  │   │ Knowledge graph │
    │  (existing)    │   │ (Phase 5)      │   │ (Phase 7)       │
    └────────────────┘   └────────┬───────┘   └─────────────────┘
       human reader          LLM reader            reasoner
                                  │
                                  ▼
                         ┌────────────────────┐
                         │  LLM agent         │
                         │  ingests wiki,     │
                         │  proposes edits    │
                         └────────┬───────────┘
                                  │
                                  ▼
                         ┌────────────────────┐
                         │ Review queue       │  ← Phase 6
                         │ (human merge)      │
                         └────────┬───────────┘
                                  │
                                  ▼  writes back
                         ┌────────────────────┐
                         │  Structured DB     │
                         └────────────────────┘
```

### The three reader surfaces

Each surface is **read-optimised for a different consumer**:

1. **Timeline UI** (human reader). What we have today, evolved. Optimises for scanning, filtering, drawer-based detail.
2. **Markdown wiki** (LLM reader). Phase 5. One page per event, entity, phase, source. Cross-linked. Fits in a modern context window. Sensitivity filter applied at build time.
3. **Knowledge graph** (reasoner). Phase 7. Derived from the DB; queried in-browser; exportable to standard graph formats as escape hatch. **No new infrastructure commitment** — see DECISIONS ADR-0004.

### The write path (Phase 6)

Evolves from "humans type into Google Sheets" to:

1. Agent ingests a raw source (PDF, URL, article).
2. Agent proposes a structured edit: new events, new claims, new entity links, each with source pointer and confidence.
3. Proposal lands in the review queue.
4. Human reviewer approves, rejects, or edits.
5. Approved edits are written back to the DB with full audit trail.

This keeps humans in the loop while letting the substrate compound via agent effort.

---

## LLM integration points

Three places where the engine meets LLMs:

| Point | Direction | Purpose |
|---|---|---|
| **Ingest** | raw → DB | Agent proposes structured additions from a raw source (Phase 6). |
| **Compile** | DB → wiki | Agent (or deterministic codegen) produces the markdown wiki (Phase 5). |
| **Query** | wiki → agent context | Agent loads the wiki into its context window and answers. |

Note: **compile** can start deterministic (templated markdown from DB rows). LLM assistance on compile (summarisation, narrative smoothing) is an optimisation, not a requirement.

---

## Sensitivity model

`sensitivity ∈ {Public, Internal, Confidential}` is first-class on every row that carries content (Events, Sources, Claims).

Propagation rules:

- Public wiki build includes only `Public`.
- Internal wiki build includes `Public + Internal`.
- Confidential content is never exported to any wiki by default; only visible in the timeline UI to authenticated sessions (post-Phase 8).
- Derived artefacts **must** carry the sensitivity of their most sensitive input.
- Metric/claim visibility follows the containing event's sensitivity unless the claim itself is marked stricter.

---

## Storage evolution

Explicitly deferred, but direction is known (see DECISIONS ADR-0005):

| Phase | Storage | Trade-off |
|---|---|---|
| Today | Google Sheets | Easy human editing; poor diffing, no branching, API quotas. |
| Phase 6 | Google Sheets + audit log | Buys us agent-writability without migration. |
| Phase 8 | Pluggable: Sheets adapter + git-as-DB adapter | git-as-DB uses markdown front-matter + YAML for each row; diffs, PR review, full history. |

We do **not** commit to git-as-DB yet. We commit to *keeping the adapter seam clean* so we can swap later.

---

## Tech-stack posture

Today: vanilla HTML/CSS/JS, single file, no build step. Chosen for speed-to-first-corpus, not for long-term fit.

Explicit stance: **the current stack is provisional**. See [ITERATION.md](ITERATION.md) entry on stack re-evaluation and [RESEARCH.md](RESEARCH.md) for frameworks/tools under consideration. Stack change is a Phase 8 decision at the latest, possibly earlier if the monolithic `index.html` becomes unmaintainable first.

Principles that survive any stack change:
- Static-first deploy for read surfaces.
- Plain-text artefacts (markdown, JSON, CSV) at every boundary.
- No mandatory build step for contributors who just want to read/edit content.

---

## Security & provenance (forward-looking)

Not in scope until Phase 6/8, but the design must leave room for:

- **Per-edit provenance** — who proposed, who approved, what source, what confidence.
- **Signed edits** — agent edits cryptographically distinguishable from human edits.
- **Sensitivity enforcement at build time**, not just at render time (a Confidential row should never be baked into a Public static build).
- **Supply-chain posture** for any future dependencies — minimise, pin, audit.

---

## What this design explicitly does NOT do

- Does not commit to a graph database.
- Does not commit to a framework or build tool.
- Does not commit to a hosting provider beyond "static-compatible".
- Does not solve real-time collaboration.
- Does not solve auth beyond sensitivity tagging.
- Does not attempt to be a general-purpose CMS.

Everything above is deliberately deferred — see ROADMAP, RESEARCH, and ITERATION for where each is tracked.
