# Glossary

> **Status:** Stub — grows alongside the schema and the ontology. Last revised 2026-04-19.
> **Purpose.** Single place where domain terms are defined. If two docs use the same word differently, they're both wrong — fix it here first.

---

## Core data model

### Phase
A high-level narrative segment of the M4P story arc. Groups events in time. Has a title, colour, order, and optional narrative summary. Every Event belongs to exactly one Phase. See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

### Event
A dated occurrence with a title, type, program area, status, sensitivity, and at least one linked source (after Phase 3). The atomic unit of the timeline.

### Source
A document, article, recording, or other evidence artefact. Carries a type, owner, credibility rating, and access level. Referenced by Events (via Event_Source_Map) and by Claims (via Claim_Sources).

### Event_Source_Map
Many-to-many link between Events and Sources. Each entry carries a **relevance level** (Primary / Supporting / Contextual), a **pointer** (location within the source — page, paragraph, timestamp, quoted span), and optional notes.

### Claim
A metric, outcome, or factual assertion tied to an Event. Has a type, value, unit, verification status, and sensitivity. Claims are optional per event and respect sensitivity filters.

### Claim_Sources
Many-to-many link between Claims and Sources, with a **confidence** level per link.

### Entity
An organisation, person, or place referenced by events. Phase 4 promotes entities from lookup table to first-class nodes with their own pages and relationships.

---

## Quality & provenance

### Sensitivity
One of `Public`, `Internal`, `Confidential`. First-class on every content row. Derived artefacts must carry the most-sensitive input's level. See [DESIGN.md](DESIGN.md) "Sensitivity model."

### Relevance (of a source link)
`Primary` — directly attests to the event. `Supporting` — corroborates. `Contextual` — provides background but does not directly attest.

### Confidence (of a claim link)
`Low` / `Medium` / `High` — how strongly the linked source supports the claim. Open ontology work in RESEARCH R-005.

### Verification status
`Verified` / `Needs review` / `Draft`. Drives the Validation Queue.

### Pointer
The exact location within a source that supports an event or claim. Examples: `p. 12, para 3`, `00:14:20`, `"exact quoted span"`. Round-trip-stable pointers are a RESEARCH R-009 concern.

---

## LLM Wiki concepts

### Wiki (our sense)
The derived markdown representation of the structured DB: one page per event, entity, phase, source, with cross-links. Compiles from the DB (Phase 5). Read directly by LLMs into their context windows.

### Compile (verb)
To produce a derived artefact (wiki page, graph node) from the structured DB. Idempotent by construction. Re-runnable at any time.

### Retrieve vs compile
**Retrieve** — fetch relevant raw chunks at query time (RAG). **Compile** — transform raw into a curated, persistent representation once; query the representation. We compile; we don't retrieve. See ADR-0001.

### Context window
The amount of text an LLM can hold in its working memory for a single turn. Our Phase 5 bet is that the whole wiki fits inside one. RESEARCH R-010 tracks what happens when it doesn't.

### Compounding knowledge
The property that new information integrates into existing structure (updates, cross-links, reconciles) rather than sitting as another undifferentiated chunk. The goal of the wiki layer.

### Agent-writable substrate
A system where autonomous agents can propose structured edits (new events, claims, entity links) with evidence, subject to human review before merge. Phase 6.

---

## Terms we use specifically

### Derived artefact
Any output produced from the structured DB (timeline UI, wiki, graph). Regenerable. Throwaway. Never the source of truth.

### Source of truth
The structured database. Whatever is there is authoritative. See ADR-0008.

### Storage adapter
The interface through which the engine reads and writes the structured DB. Pluggable (ADR-0005): Google Sheets today, git-as-DB candidate tomorrow.

### Escape hatch (for graphs)
Export of the derived graph to a standard format (GraphML, JSON-LD) so power users can load it into external graph DBs without the engine taking on that infrastructure dependency.

### Engine
The reusable substrate code. Today it's interleaved with M4P content. Phase 8 extracts it into `engine/` with corpora like `corpus/m4p/` sitting alongside.

### Corpus
One filled-in instance of the engine. `corpus/m4p/` is the first. Phase 8 enables additional corpora.

### Auto-research
The process (ADR-0007, RESEARCH R-011) that periodically re-surveys the ecosystem for open research questions and refreshes [RESEARCH.md](RESEARCH.md).

### Iteration item
A thing that works today but is flagged for future re-evaluation. Lives in [ITERATION.md](ITERATION.md). Distinct from a bug (must fix) or a research question (need more information).

---

## Terms to add (stubs)

Expand when phases hit these concepts:

- **Narrative** — the human-readable, per-phase story surface.
- **Evidence ladder** — the ordered set of relevance + confidence classifications.
- **Review queue** — Phase 6's extension of today's Validation Queue.
- **Audit record** — per-edit provenance (who, when, what, why, source).
- **Relation type** — Phase 4 entity-to-entity edge labels (controlled vocabulary).
- **Derived graph** — the in-memory graph built from structured rows at query time (Phase 7).
- **Escape format** — GraphML / JSON-LD export.
