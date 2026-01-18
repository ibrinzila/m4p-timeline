# M4P Timeline Dashboard — Complete Specification

Build a static timeline dashboard for Moldova for Peace (M4P) backed by a Google Sheets dataset exported as JSON.

## Data Model

The complete database structure consists of 7 core tables with defined relationships:

1. **Phases** — Story map phases for narrative structure (NEW)
2. **Events** — Core timeline events (with `phase_id` foreign key)
3. **Sources** — Reference documents and evidence
4. **Event_Source_Map** — Links events to sources with pointers
5. **Claims** — Metrics and outcomes linked to events
6. **Claim_Sources** — Links claims to their supporting sources
7. **Entities** — Organizations, people, places referenced in events

**Complete schema documentation:** See `DATABASE_SCHEMA.md` for full field definitions, validation rules, and relationships.

**Key relationships:**
- Phases (1) → Events (N) — Each event belongs to one phase
- Events (1) → Claims (N) — Each claim belongs to one event
- Events (N) ↔ Sources (N) — Many-to-many via Event_Source_Map
- Claims (N) ↔ Sources (N) — Many-to-many via Claim_Sources

**Data requirements:**
- Each Event must show linked Sources (via Event_Source_Map)
- Claims are optional and can be hidden by sensitivity
- Every Event must have a valid `phase_id` (required foreign key)

## Functional Requirements

### 1) Timeline View

**Primary visualization:** Combined approach with Phases + Vertical Timeline + Quarter Sections + Category Swimlanes

- **Phase Headers:** Expandable/collapsible phase sections with narrative stories
- **Vertical Timeline Spine:** Color-coded by phase, continuous flow
- **Quarter Sections:** Events organized by year/quarter within phases
- **Category Swimlanes:** Events grouped by `program_area` within each quarter
- **Zoom levels:** Year/quarter/month (default: quarter view)

**Filters:**
- `event_type` (Pivot, Campaign, Project, Crisis, Meeting, Activity, Internal governance)
- `program_area` (Humanitarian aid, Peacebuilding, Organisational development, Social cohesion)
- `status` (Verified, Needs review, Draft)
- `sensitivity` (Public, Internal, Confidential)
- `primary_org` (text search)
- `tags` (multi-select or text search)
- `phase_id` (filter by phase)

**Search:**
- Full-text search across: `title`, `summary_1line`, `tags`, entity names (from Entities table)
- Search should work across all visible events regardless of filters

**Interactions:**
- Click event → open details drawer
- Click phase header → expand/collapse narrative
- Hover event → highlight
- Filter changes → update timeline dynamically

### 2) Event Details Drawer

On event click, show:
- **Header:** Title, date range (dd.mm.yyyy format)
- **Metadata:** Event ID, type, program area, status, sensitivity, primary org
- **Summary:** One-line summary
- **Tags:** All tags as chips
- **Verification status:** Visual indicator (Verified = green, Needs review = yellow/red)
- **Sources:** List all linked sources (from Event_Source_Map) with:
  - Source title
  - Relevance level
  - Pointer (location in source)
  - Notes
- **Claims (metrics/outcomes):** 
  - Only show if `sensitivity != "Confidential"`
  - Include toggle "Show metrics" (global setting)
  - When shown, display:
    - Claim text
    - Claim type, value, unit
    - Verification status
    - Linked sources (from Claim_Sources) with confidence levels

### 3) Evidence View

**Table listing all Sources:**
- Columns: Source ID, Type, Title, Owner, Date Published, Credibility, Access
- Sortable by any column
- Filterable by: source_type, credibility, access
- Searchable by title, notes

**On source click:**
- Show source details
- List all Events supported by that source (from Event_Source_Map)
- Show all Claims supported by that source (from Claim_Sources)
- Display pointer notes for each link

### 4) Validation Queue

**List events where `status = "Needs review"`:**
- Display: Date, Title, Event ID
- Highlight missing required fields:
  - Missing `phase_id`
  - Missing `date_start`
  - Missing `program_area`
  - Missing `summary_1line`
- Highlight missing primary evidence:
  - Events with no linked sources (no Event_Source_Map entries)
  - Events with no "Primary evidence" sources (only "Supporting" or "Contextual")
- Sort by date_start (oldest first)
- Respect sensitivity filter (only show events user has access to)

## Non-Functional Requirements

### Deployment
- Must run as a static site (Cloudflare Pages compatible)
- No server-side processing required
- All data loaded client-side from JSON

### Data Source
- Fetch JSON from configurable endpoint:
  - Google Apps Script web app, OR
  - Published JSON URL (Google Sheets → Publish to web → JSON)
- Provide simple config file (`config.json`) for:
  - Data endpoint URL
  - UI text labels
  - Which sensitivities are visible by default
  - Phase display settings

### Caching
- Cache fetched JSON in localStorage
- Include "Last updated at" indicator based on JSON `meta.generated_at`
- Provide refresh button to clear cache and reload
- Show cache age (e.g., "Data cached 2 hours ago")

### Internationalization
- Default: English UI
- Dates must display in `dd.mm.yyyy` format (European format)
- Timezone: Europe/Chisinau (from meta.timezone)
- Future: Support Romanian language (optional)

### Performance
- Support 100-1000+ events without performance degradation
- Lazy loading for large datasets
- Efficient filtering/search without backend

## Implementation Notes

### Technology Stack
- **Framework:** Vanilla JavaScript (or lightweight framework)
- **No build step required** (or minimal: just copy files)
- **Styling:** CSS with Moldova color palette (see color scheme in code)
- **Data:** JSON loaded via fetch API

### Color Scheme
Based on Moldova flag and Dopomoha.md design:
- **Primary Blue:** #0046AE (headers, timeline spine, primary elements)
- **Accent Yellow:** #FFD200 (highlights, hover states)
- **Action Red:** #CC092F (urgent items, warnings)
- **Success Green:** #007A50 (verified status, positive outcomes)
- **Supporting Brown:** #B07E5B (secondary elements)
- **Background:** #FFFBF0 (warm light background)
- **Panels:** #FFFFFF (white cards)

### Phase Color Coding
- Each phase has its own color (from Phases.color)
- Timeline spine changes color by phase
- Phase headers use phase color for background

### Quarter Derivation
- Computed from `date_start` in code
- Formula: Extract year and quarter (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
- No database field needed

### Category Swimlanes
- Uses `program_area` field from Events
- Controlled vocabulary (see DATABASE_SCHEMA.md)
- Empty lanes shown with "No events" message (can be hidden via toggle)

## Deliverables

1. **Complete source code repository:**
   - `index.html` — Main dashboard
   - `data.json` — Sample data (or fetch from endpoint)
   - `config.json` — Configuration file
   - `DATABASE_SCHEMA.md` — Complete schema documentation
   - `GOOGLE_SHEETS_TEMPLATE.md` — Google Sheets setup guide
   - `README.md` — Setup and deployment instructions

2. **Build output:**
   - Static files ready for Cloudflare Pages
   - No build process required (or minimal)
   - All assets self-contained

3. **Documentation:**
   - **README.md:** How to connect Google Sheet → JSON endpoint → dashboard
   - **DATABASE_SCHEMA.md:** Complete field definitions and relationships
   - **GOOGLE_SHEETS_TEMPLATE.md:** Step-by-step Google Sheets setup

## Google Sheets Setup

See `GOOGLE_SHEETS_TEMPLATE.md` for:
- Sheet structure and order
- Column definitions
- Data validation rules
- Export script setup
- Naming conventions

## Data Export Format

The Google Sheets export must produce JSON matching the structure defined in `DATABASE_SCHEMA.md`, including:
- `meta` object with project info, timezone, date format, generated_at
- `phases` array (sorted by order)
- `events` array (sorted by date_start)
- `sources` array
- `event_source_map` array
- `claims` array
- `claim_sources` array
- `entities` array

## Version

**Schema Version:** 1.0  
**Last Updated:** 2026-01-18
