# Research

> **Status:** Living document. Last revised 2026-04-19.
> **Purpose.** A rolling list of open questions that need deeper investigation *before* we commit to a direction. Paired with [ITERATION.md](ITERATION.md) — this doc is "what we don't yet know"; that doc is "what works but we may want to change."
> **Process.** Reviewed at every phase boundary (see [ROADMAP.md](ROADMAP.md)) and on an automated cadence (see "Auto-research mechanism" below).

---

## How entries work

Each entry has:
- **Question** — what we need to answer.
- **Why it matters** — the decision it unblocks.
- **Current lean** — best guess today, if any.
- **Inputs to gather** — sources, benchmarks, or experiments.
- **Decision horizon** — which phase/boundary this must resolve by.
- **Last refreshed** — date of last update.

Entries don't leave this file. When resolved they move to an ADR in [DECISIONS.md](DECISIONS.md) and the research entry is marked `Resolved → ADR-XXXX`.

---

## Auto-research mechanism

This is itself an open research item, but here's the starting frame.

**Goal.** On a schedule (weekly or monthly), re-survey the landscape for each open entry and refresh "current lean" + "inputs" sections. Escalate to human review when the landscape shift is material.

**Candidate mechanisms:**

1. **Claude Code hook** — a `SessionStart` or custom scheduled hook that runs a `/refresh-research` skill which iterates open entries and does a web survey + diff.
2. **External cron + Claude Agent SDK** — a cron job or CI schedule invoking a headless Claude to refresh this file, open a PR with proposed updates.
3. **Manual but tool-assisted** — `/refresh-research` invoked on demand, not scheduled.

Choice depends on: where the repo lives, whether CI minutes are cheap, and how noisy the refresh signal is. Start with **(3)** (manual with tooling) and graduate to **(2)** once the process is worth automating.

Pattern reference: follow a spirit akin to Cognition Labs / agentic continuous-improvement loops — the agent proposes, the human merges. Auto-research should never directly modify DECISIONS.md; it may only update RESEARCH.md entries and flag candidates for promotion.

---

## Open research entries

### R-001 — Storage layer: git-as-DB vs Google Sheets vs hybrid

- **Why it matters.** Storage choice affects write path (Phase 6), productisation (Phase 8), and long-term audit/diff story.
- **Current lean.** Keep adapter seam clean now (ADR-0005); migrate to git-as-DB (markdown front-matter + YAML) around Phase 8.
- **Inputs to gather.**
  - Existing tools: Obsidian + Dataview, Decap CMS, TinaCMS, Forestry, Zettlr, Logseq — what do they do well on markdown-as-DB?
  - Git-based CMSes for structured content (e.g. Netlify CMS history, Keystatic).
  - Performance: how does a 10k-row corpus behave with per-row `.md` files vs monolithic YAML/CSV?
  - Diff UX on structured front-matter (do reviewers actually find it readable?).
- **Decision horizon.** Phase 8.
- **Last refreshed.** 2026-04-19.

### R-002 — Graph representation: derived vs dedicated DB

- **Why it matters.** Drives Phase 7 scope and whether we add infrastructure.
- **Current lean.** Derived only (ADR-0004). Escape hatch via GraphML / JSON-LD export.
- **Inputs to gather.**
  - KùzuDB (embedded, wasm-capable — could run in-browser).
  - DuckDB property-graph queries.
  - Neo4j (server) vs neo4j-desktop.
  - Client-side graph libs: cytoscape.js, sigma.js, d3-force, vis-network.
  - How big do real M4P-scale derived graphs get? (~1k–10k nodes expected.)
- **Decision horizon.** Start of Phase 7.
- **Last refreshed.** 2026-04-19.

### R-003 — Tech stack re-evaluation

- **Why it matters.** Current vanilla JS + monolithic `index.html` is provisional (see ITERATION.md).
- **Current lean.** None — genuinely open.
- **Inputs to gather.**
  - Astro (static-first, islands of interactivity) — strongest fit if we stay content-centric.
  - SvelteKit / SolidStart — if we need more interactivity.
  - Next.js — probably over-specified for our needs.
  - Eleventy — minimal, markdown-native.
  - Stay on vanilla — cost of added dependencies often outweighs benefits.
- **Decision horizon.** No later than Phase 8; possibly earlier if `index.html` becomes unmaintainable.
- **Last refreshed.** 2026-04-19.

### R-004 — Karpathy LLM Wiki extensions

- **Why it matters.** Informs Phase 5 (compile layer) and Phase 6 (agent-writable substrate).
- **Current lean.** Start from Karpathy's base pattern; adopt v2/agentmemory-derived extensions selectively.
- **Inputs to gather.**
  - [llm-wiki (Karpathy gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
  - [LLM Wiki v2 — agentmemory extensions](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2)
  - [Beyond the Wiki: scaling for multi-agent production (18 extensions)](https://gist.github.com/redmizt/968165ae7f1a408b0e60af02d68b90b6)
  - Concrete needs: lifecycle management, conflict resolution, cross-linking discipline, quality gates.
- **Decision horizon.** Start of Phase 5.
- **Last refreshed.** 2026-04-19.

### R-005 — Evidence confidence model

- **Why it matters.** Phase 3 hardens evidence; need a principled model for "how sure are we?" beyond today's qualitative relevance field.
- **Current lean.** Qualitative (Primary / Supporting / Contextual) + explicit `confidence` field (Low / Medium / High) per claim.
- **Inputs to gather.**
  - Wikipedia's verifiability / reliable-sources framework.
  - Intelligence community's estimative-probability ladders (ICD 203).
  - Academic citation-quality models.
  - Fact-checking workflows (Bellingcat, Full Fact).
- **Decision horizon.** During Phase 3.
- **Last refreshed.** 2026-04-19.

### R-006 — Ontology for entities and relationships

- **Why it matters.** Phase 4 promotes entities to first-class and defines relations. Poor ontology now = pain in Phase 7 graph queries.
- **Current lean.** Start minimal and controlled; grow the vocabulary only when a real M4P use-case demands a new relation type.
- **Inputs to gather.**
  - schema.org (Organization, Person, Place, Event).
  - Wikidata's property catalogue (subset).
  - CIDOC CRM (cultural heritage — overkill but well thought-out).
  - FOAF (people / relationships).
- **Decision horizon.** Start of Phase 4.
- **Last refreshed.** 2026-04-19.

### R-007 — Licensing posture

- **Why it matters.** Can't finalise at Phase 8 without inputs gathered earlier.
- **Current lean.** Dual-license intent (ADR-0002). Concrete terms deferred.
- **Inputs to gather.**
  - Open core models (GitLab, Sentry).
  - BSL / SSPL / Elastic License 2.0 comparisons.
  - AGPL + commercial dual license (MongoDB pre-SSPL era).
  - Data-license implications for corpora contributed by third-party orgs.
- **Decision horizon.** Phase 8.
- **Last refreshed.** 2026-04-19.

### R-008 — Competitive landscape / prior art

- **Why it matters.** Before naming and pitching a product, we need to know what already exists.
- **Current lean.** None — need a survey.
- **Inputs to gather.**
  - Timeline tools: Timeline JS, TimelineJS3, Knight Lab, Tiki-Toki, Preceden.
  - Graph knowledge tools: Obsidian, Logseq, Roam, TheBrain, Tana.
  - Evidence/intelligence tools: Maltego, i2 Analyst's Notebook, Bellingcat OSINT stack.
  - LLM-memory products: mem0, Letta (formerly MemGPT), Zep.
  - What's unique about our thesis vs each of these.
- **Decision horizon.** Before Phase 8.
- **Last refreshed.** 2026-04-19.

### R-009 — Agent ingest pipeline architecture

- **Why it matters.** Phase 6 core design.
- **Current lean.** None yet — depends on R-001 (storage).
- **Inputs to gather.**
  - How Keystatic / Decap handle structured proposals.
  - Claude Agent SDK patterns for tool-constrained ingest.
  - Existing document → structured-extraction workflows (Docling, Unstructured, LlamaParse).
  - Citation-pointer formats that survive round-tripping (page #, paragraph, quoted span).
- **Decision horizon.** Start of Phase 6.
- **Last refreshed.** 2026-04-19.

### R-010 — Context-window strategy at scale

- **Why it matters.** Phase 5 bet — the wiki fits in context. What if it doesn't?
- **Current lean.** Unknown bound. At M4P scale (~hundreds of events), comfortable fit. At thousands, needs strategy.
- **Inputs to gather.**
  - Hierarchical wiki (domain overview + drill-down on demand).
  - Retrieval-as-fallback (only when context overflow).
  - Summary compression levels (full / compact / outline).
  - Modern context windows (Claude, Gemini) — growth rate.
- **Decision horizon.** End of Phase 5, to inform Phase 6.
- **Last refreshed.** 2026-04-19.

### R-011 — Auto-research mechanism (meta)

- **Why it matters.** Implements ADR-0007.
- **Current lean.** Manual with `/refresh-research` skill; automate later.
- **Inputs to gather.**
  - Claude Code hooks (SessionStart, custom scheduled).
  - Claude Agent SDK headless patterns.
  - GitHub Actions schedules vs external cron.
  - How to bound the agent so it only proposes, never merges.
- **Decision horizon.** Phase 6 at latest (by then we have agent-ingest anyway).
- **Last refreshed.** 2026-04-19.

### R-012 — Internationalisation (Romanian, others)

- **Why it matters.** M4P's primary audience is Romanian-speaking. Out of scope today, but a known-future concern.
- **Current lean.** English-first UI; data-model is already language-neutral. UI i18n deferred.
- **Inputs to gather.**
  - Multi-language wikis (how does Wikipedia handle per-article translation + cross-links?).
  - Per-field translation in the data model vs separate translated rows.
- **Decision horizon.** Phase 8 or later.
- **Last refreshed.** 2026-04-19.

---

## Process for adding a new entry

1. Encounter an open question that you can't answer from memory and that blocks a concrete decision.
2. Add an entry with the fields above.
3. Link to it from the relevant ROADMAP phase or DESIGN section.
4. On resolution, file an ADR in [DECISIONS.md](DECISIONS.md) and mark the entry `Resolved → ADR-XXXX`.
