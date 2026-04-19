# Vision

> **Status:** Living document. Last revised 2026-04-19.
> **Owner:** @ibrinzila
> **Read this first.** Every other planning doc (ROADMAP, DESIGN, DECISIONS, RESEARCH, ITERATION) is downstream of what's written here.

---

## Mission

Build a living, verifiable record of Moldova for Peace (M4P) — events, sources, claims, actors — that **humans and LLM agents can read, write, and reason over without losing context between sessions**.

Use the M4P corpus as the forcing function to prove a general substrate for **persistent, compounding knowledge** — and, once proven, extract that substrate into a standalone product.

## The problem

LLMs forget. Agents forget. The humans steering them forget. Every new chat starts at zero.

Organisations accumulate decisions, evidence, narrative arcs, and relationships that live in chat logs, Google Docs, Slack threads, and people's heads. That context decays the moment anyone steps away — or the moment a new model is spun up.

RAG is not the answer. Retrieval-Augmented Generation retrieves from raw chunks each time; knowledge never **compounds**. The system is perpetually amnesiac — capable but unable to grow.

## The bet

Following Andrej Karpathy's **LLM Wiki** pattern: the wiki *is* the memory. The LLM acts as a **compiler** that transforms raw inputs into a curated, cross-linked knowledge base. Queries run against the compiled representation, not raw chunks. Knowledge **compiles once** and then gets **updated**, rather than being re-derived on every query.

Applied to M4P: a structured database (events, sources, claims, entities, phases) generates a derived markdown wiki and a derived knowledge graph. A fresh agent given the wiki alone can reconstruct the narrative and cite its evidence — without ever touching a vector store.

## Scope

### Today — M4P instance
A timeline dashboard over a curated Google Sheets dataset:
- 7 structured tables (Phases, Events, Sources, Event_Source_Map, Claims, Claim_Sources, Entities)
- Static client, no server-side processing
- Google Apps Script → JSON export
- Moldova for Peace is the first real-world corpus and the forcing function for every design decision

### Tomorrow — LLM Wiki product
Generalise the M4P substrate into a reusable product:
- Any org / project / research domain can stand one up
- Markdown-first wiki layer on top of the structured DB (agent-ingestible)
- Agent-writable: LLMs propose edits, humans verify
- Knowledge graph layer (entities, relationships, claims) for reasoning beyond the timeline
- Evidence-first: every claim traceable to a source with a pointer and a confidence
- Forkable: every instance is a repo; governance is a pull request

## Principles

1. **Compile, don't retrieve.** Prefer a curated wiki the model reads directly over embeddings.
2. **Evidence or it didn't happen.** Every claim links to a source with a pointer and a confidence level.
3. **Plain text beats black boxes.** Markdown + JSON + CSV so humans, git, and agents all read the same thing.
4. **Structured DB is the source of truth.** Wiki and graph are *derived artefacts*, always regenerable.
5. **Static-first deploy.** No servers required to read; dynamic only on write.
6. **Sensitivity-aware.** Public / Internal / Confidential is a first-class concept, not an afterthought.
7. **Forkable & auditable.** Every instance is a repo. Every change has provenance.
8. **Continuous re-evaluation.** Tech-stack and architecture choices are explicitly revisited on a schedule (see ITERATION.md and RESEARCH.md). No decision is permanent.

## Non-goals (for now)

- Real-time collaboration
- Generic LLM chat UI
- Multi-tenant SaaS
- Authentication / permission system beyond sensitivity tagging
- Mobile-first design (desktop first; responsive later)
- Romanian/multi-language UI (English first)

These are *after* the substrate proves it holds.

## Success signals

- **M4P.** A newcomer to M4P can reconstruct the narrative + evidence without asking a person. A user can audit any event back to its primary sources in ≤2 clicks.
- **LLM Wiki.** A fresh agent, given only the wiki, answers domain questions more accurately than the same agent with RAG over the raw corpus.
- **Product.** At least one external organisation runs it for their own timeline/knowledge base.

## North star, stated plainly

When this works, an organisation's institutional memory stops depending on whoever happens to be in the room — and an LLM agent stops being amnesiac the moment its context window closes.

## Related documents

- [ROADMAP.md](ROADMAP.md) — phased plan (completed + upcoming)
- [DESIGN.md](DESIGN.md) — architecture, current and target
- [DECISIONS.md](DECISIONS.md) — ADR log; *why* choices were made
- [RESEARCH.md](RESEARCH.md) — open research questions and auto-research process
- [ITERATION.md](ITERATION.md) — things working now but flagged for later revision
- [GLOSSARY.md](GLOSSARY.md) — terms and ontology
- [CHANGELOG.md](CHANGELOG.md) — human-readable release log
- [instruction.md](instruction.md) — original M4P specification
