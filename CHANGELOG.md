# Changelog

> **Status:** Human-readable release log, distinct from git history. Last revised 2026-04-19.
> Updated **at the end of each phase**, not during. Format loosely based on [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- Planning doc set: `VISION.md`, `ROADMAP.md`, `DESIGN.md`, `DECISIONS.md`, `RESEARCH.md`, `ITERATION.md`, `GLOSSARY.md`, `CHANGELOG.md`.

---

## Phase 2 — Category state persistence

**Shipped 2026-01-21** · commit `578a3c6`

### Added
- `loadCategoryState()` and `saveCategoryState()` for localStorage persistence.
- Load saved preferences on page initialisation.
- Save state automatically when categories are toggled.
- Merge saved preferences with smart defaults.
- Error handling for localStorage failures.

### Changed
- User category-expansion preferences now persist across sessions.

---

## Phase 1 — Expandable categories with smart defaults

**Shipped** · commit `2c9e456`

### Added
- Expandable/collapsible category swimlanes.
- Smart defaults for which categories start expanded.

---

## Phase 0 — Foundation

**Shipped** · commits `5030536` → `dac5671`

### Added
- Static dashboard (`index.html`) with combined timeline view (phases + vertical spine + quarter sections + category swimlanes).
- Google Sheets → Apps Script → JSON data pipeline.
- localStorage caching with automatic background refresh.
- Filters: search, phase, event type, program area, status, sensitivity.
- Event detail drawer with linked sources and claims.
- Validation queue for events marked "Needs review."
- Metrics toggle (show/hide claims).
- Manual refresh button.
- Error handling with retry.
- Cloudflare Pages deployment config (`wrangler.toml`).

### Fixed
- Timeline visibility: 1-column default layout, removed reflow hacks (`dac5671`).
- Timeline stays visible when filters are hidden (`afc04eb`, `26bc9e7`, `baa805b`).
- Timeline responsive expansion when filters hidden (`bb1529a`, `ecc0677`).
- Timeline rendering and button styling (`b9d0eaf`).
- Hide filters by default; improve button styling (`3f7b75c`).

---

## Conventions

- **Phase entries** are updated at phase-boundary; changes during a phase live in git until then.
- **Commit SHAs** are included for traceability.
- **Categories:** `Added` (new), `Changed` (modified), `Deprecated` (soon-to-remove), `Removed` (gone), `Fixed` (bugs), `Security` (vulns).
- Unreleased changes sit under `[Unreleased]` and roll up into a phase entry when that phase ships.
