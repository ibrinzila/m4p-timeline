# Decisions (ADR log)

> **Status:** Living log. Append-only. Last revised 2026-04-19.
> Every non-trivial architectural or strategic decision gets recorded here so future-you (or a future agent) doesn't relitigate it from scratch. Format inspired by Michael Nygard's ADR template.

---

## How to use this log

- **Append, don't rewrite.** A superseded decision stays in the log, marked `Superseded by ADR-XXXX`.
- **One ADR per decision.** Not per feature, not per phase — per *decision*.
- **Link from code and other docs** using the ADR number.
- **Minimum fields per ADR:** date, status, context, decision, consequences.
- **Status values:** `Proposed`, `Accepted`, `Deprecated`, `Superseded by ADR-XXXX`.

Template at the bottom of this file.

---

## Index

| ID | Status | Title |
|---|---|---|
| ADR-0001 | Accepted | Adopt the Karpathy LLM Wiki pattern (compile, don't retrieve) |
| ADR-0002 | Accepted | Dual-license posture (provisional) |
| ADR-0003 | Accepted | Stay single-repo until Phase 8, then split engine and corpus |
| ADR-0004 | Accepted | Defer knowledge-graph infrastructure; start derived |
| ADR-0005 | Accepted | Long-term migration off Google Sheets to git-as-DB — intent, not commitment |
| ADR-0006 | Accepted | Defer product naming until Phase 8 |
| ADR-0007 | Accepted | Institute continuous auto-research and iteration-review processes |
| ADR-0008 | Accepted | Structured DB is the single source of truth; all other artefacts are derived |

---

## ADR-0001 — Adopt the Karpathy LLM Wiki pattern (compile, don't retrieve)

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
LLMs, agents, and humans lose context across sessions. Traditional RAG retrieves from raw chunks each time and never lets knowledge compound. Karpathy's LLM Wiki pattern treats the wiki itself as memory: an LLM acts as a compiler that turns raw inputs into curated markdown pages which the LLM then loads directly into its context window.

**Decision.**
Adopt the LLM Wiki pattern as the core memory model. The structured DB compiles into a markdown wiki (Phase 5). Queries run against the compiled wiki in-context, not against embeddings over raw text.

**Consequences.**
- We do *not* invest in vector-DB infrastructure.
- We *do* invest in a clean compile step (DB → wiki).
- Wiki size must fit within a modern context window (~128K–1M tokens). If corpus grows beyond that, we revisit (hierarchical wikis, per-domain compilation, etc.).
- Every event / entity / source gets its own markdown page with cross-links.

---

## ADR-0002 — Dual-license posture (provisional)

- **Date:** 2026-04-19
- **Status:** Accepted (provisional — finalise at Phase 8)

**Context.**
Two concerns pull in opposite directions: (a) M4P corpus and engine benefit from being open so others can fork and verify; (b) the longer-term product needs a path to monetisation.

**Decision.**
Carry a **dual-license intent** through Phases 3–7 without finalising terms. Concretely: don't do anything that would foreclose either an OSS core + commercial hosted option, or an open-source engine + proprietary extensions model. Final licence terms are picked at Phase 8.

**Consequences.**
- Do not accept third-party contributions that lock us to a single licence model without a CLA.
- Do not pull in dependencies whose licences would contaminate either path (e.g. strong copyleft in the engine core).
- Revisit at Phase 8 with proper legal input.

---

## ADR-0003 — Stay single-repo until Phase 8, then split engine and corpus

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
Should the engine (reusable substrate) and the M4P corpus (first real instance) live in one repo or two? Splitting too early creates friction while the abstraction isn't proven. Splitting too late creates coupling that's painful to unwind.

**Decision.**
Stay single-repo through Phases 3–7. Use Phases 3–7 to pressure-test the substrate on the real M4P corpus. Split at Phase 8 once the abstraction is validated. Target structure post-split: `engine/` reusable + `corpus/m4p/` as first instance.

**Consequences.**
- Phase 3–7 code should be written to *assume* a future split even though it doesn't enforce one (e.g. keep M4P-specific vocabularies configurable, not hard-coded).
- Before Phase 8, audit for hard-coded M4P assumptions; those become config at split time.

---

## ADR-0004 — Defer knowledge-graph infrastructure; start derived

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
Some target use-cases (chain-of-evidence, multi-hop entity queries) are natively graph-shaped. The temptation is to stand up Neo4j / KùzuDB / DuckDB-PGQ early. That's a new piece of infrastructure, a new hosting concern, and another thing to keep in sync with the source-of-truth DB.

**Decision.**
Do **not** add graph-DB infrastructure in Phases 3–7. Derive a graph representation from the structured tables at query time (in-browser or in a small compile step). Provide an **escape hatch**: export to GraphML / JSON-LD so power users can load the graph into Neo4j/KùzuDB themselves.

Re-evaluate at the start of Phase 7 based on concrete query needs. Candidate is an open research item in [RESEARCH.md](RESEARCH.md).

**Consequences.**
- Simpler infra; no new service to run.
- Graph queries limited to what a derived in-memory graph can answer (likely fine for corpora of M4P scale).
- If a future corpus needs heavier graph queries, adopt a graph DB *then*, not pre-emptively.

---

## ADR-0005 — Long-term migration off Google Sheets to git-as-DB — intent, not commitment

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
Google Sheets is great for fast human editing but poor for diffing, branching, and audit trails. Long-term, git-as-DB (markdown files with YAML front-matter, one file per row) is the more aligned storage — it makes every edit a reviewable commit, supports branching for experiments, and needs no API quota.

**Decision.**
State the intent to migrate, but do **not** commit to it yet. Instead: keep a clean **storage adapter seam** from Phase 6 onward so the storage layer can be swapped without rewriting the rest of the engine. Storage migration becomes a concrete Phase 8 (or later) decision.

**Consequences.**
- Write-path code (Phase 6) must go through an adapter interface, not call the Sheets API directly.
- Decision to actually flip the switch can be informed by real usage; we're not pre-optimising.
- Candidate listed in [RESEARCH.md](RESEARCH.md) for ongoing evaluation (format, tooling, diff UX).

---

## ADR-0006 — Defer product naming until Phase 8

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
"M4P Timeline" is a project name; the generalised engine needs its own. Naming before the thing is proven risks early commitments (domains, trademarks, mental models) on an artefact whose shape isn't final.

**Decision.**
Defer product naming until Phase 8. Until then the substrate is referred to as "the engine" or by working-title only in internal docs.

**Consequences.**
- Avoids premature trademark / domain spend.
- No marketing push before Phase 8.
- Naming exercise is a Phase 8 task, not a sidequest.

---

## ADR-0007 — Institute continuous auto-research and iteration-review processes

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
The tech stack, storage layer, and ecosystem around LLM wikis are all moving fast. A decision that's right in April 2026 may be wrong in October 2026. Relying on ad-hoc re-evaluation means we'll drift.

**Decision.**
Run two ongoing processes:

1. **Auto-research** (see [RESEARCH.md](RESEARCH.md)). A rolling list of research candidates. Reviewed at every phase boundary and by an automated mechanism (Claude hook or cron/schedule) that refreshes findings on a cadence.
2. **Iteration review** (see [ITERATION.md](ITERATION.md)). A rolling list of things that work today but are flagged for future re-evaluation. Also reviewed at every phase boundary.

Both lists feed into ROADMAP scope-setting for the next phase.

**Consequences.**
- No decision is permanent. Everything is revisitable.
- Requires discipline to actually do the reviews at phase boundaries — ROADMAP already mandates this.
- Mechanism for the automated research cadence (Claude hook vs external schedule) is itself a research item — see RESEARCH.md.

---

## ADR-0008 — Structured DB is the single source of truth; all other artefacts are derived

- **Date:** 2026-04-19
- **Status:** Accepted

**Context.**
As we add a markdown wiki (Phase 5) and a graph view (Phase 7) alongside the existing timeline UI, the risk is three systems that drift out of sync.

**Decision.**
The structured DB is authoritative. The timeline UI, the wiki, and the graph are **derived artefacts**, always regenerable. If a derived artefact disagrees with the DB, the artefact is wrong.

**Consequences.**
- Derived artefacts can be thrown away and rebuilt without data loss.
- Compile steps (DB → wiki, DB → graph) must be idempotent.
- Any feature that would require writing to a derived artefact directly is a design smell — route it through the DB.

---

## Template

```
## ADR-XXXX — <title>

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYYY

**Context.**
<what situation or forces are at play>

**Decision.**
<what we decided>

**Consequences.**
<what becomes easier, what becomes harder, what we're accepting as a trade>
```
