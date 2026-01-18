# M4P Timeline Database Schema

**Version:** 1.0  
**Last Updated:** 2026-01-18  
**Format:** Google Sheets → JSON export

## Overview

This schema defines the complete data structure for the Moldova for Peace (M4P) Timeline dashboard. The data is maintained in Google Sheets and exported as JSON for the static dashboard.

## Entity Relationship Diagram

```
┌─────────────┐
│   Phases    │ ← Story map phases (NEW)
└─────────────┘
       │
       │ 1:N (phase_id)
       ▼
┌─────────────┐
│   Events    │ ← Core timeline events
└─────────────┘
       │
       ├─── N:M ───► ┌─────────────┐
       │             │   Sources    │ ← Reference documents
       │             └─────────────┘
       │                   │
       │                   │ N:M (via Event_Source_Map)
       │                   ▼
       │             ┌─────────────────┐
       │             │ Event_Source_Map│
       │             └─────────────────┘
       │
       └─── 1:N ───► ┌─────────────┐
                     │   Claims    │ ← Metrics/outcomes
                     └─────────────┘
                           │
                           │ N:M (via Claim_Sources)
                           ▼
                     ┌─────────────────┐
                     │ Claim_Sources   │
                     └─────────────────┘
                           │
                           │ N:M
                           ▼
                     ┌─────────────┐
                     │   Sources    │
                     └─────────────┘
```

## Table Definitions

### 1. Phases

**Purpose:** Define story map phases for narrative structure and visual organization.

**Google Sheet:** "Phases"  
**Typical Rows:** 3-5 (one per phase)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| phase_id | Text | Yes | Yes | Unique identifier (format: PHASE-N) | PHASE-1 |
| name | Text | Yes | No | Phase name | Foundation |
| period_start | Date (dd.mm.yyyy) | Yes | No | Phase start date | 01.01.2022 |
| period_end | Date (dd.mm.yyyy) | No | No | Phase end date (empty = ongoing) | 31.12.2022 |
| description | Text | Yes | No | Short description (1-2 sentences) | M4P constituted as a civic initiative |
| narrative | Text (long) | Yes | No | Full narrative story (2-4 paragraphs) | In response to the invasion of Ukraine... |
| color | Text (hex) | Yes | No | Phase color for UI visualization | #0046AE |
| order | Number | Yes | No | Display order (1, 2, 3...) | 1 |
| icon | Text | No | No | Optional icon identifier | foundation |

**Validation Rules:**
- `phase_id`: Must match pattern `PHASE-[0-9]+`
- `period_start`: Must be valid date in dd.mm.yyyy format
- `period_end`: Must be valid date in dd.mm.yyyy format OR empty
- `color`: Must be valid hex color (#RRGGBB)
- `order`: Must be positive integer, unique within dataset

**Relationships:**
- One Phase has many Events (via `Events.phase_id`)

---

### 2. Events

**Purpose:** Core timeline events with full metadata.

**Google Sheet:** "Events"  
**Typical Rows:** 50-500+ (grows over time)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| event_id | Text | Yes | Yes | Unique identifier (format: EV-YYYY-MM-DD-SLUG) | EV-2022-02-26-FOUNDING |
| phase_id | Text | Yes | No | Foreign key to Phases | PHASE-1 |
| date_start | Date (dd.mm.yyyy) | Yes | No | Event start date | 26.02.2022 |
| date_end | Date (dd.mm.yyyy) | No | No | Event end date (empty = single day) | |
| title | Text | Yes | No | Event title (full sentence) | Moldova pentru Pace is constituted... |
| event_type | Text | Yes | No | Type category | Pivot |
| program_area | Text | Yes | No | Category for swimlanes | Humanitarian aid |
| summary_1line | Text | Yes | No | One-line summary | Constituted as an un-institutionalized... |
| status | Text | Yes | No | Verification status | Verified |
| sensitivity | Text | Yes | No | Access level | Public |
| primary_org | Text | Yes | No | Primary organization | M4P |
| tags | Text (comma-separated) | No | No | Tags for filtering | founding, governance, rights-based |
| location | Text | No | No | Geographic location | Chișinău |
| notes | Text (long) | No | No | Internal notes | |

**Validation Rules:**
- `event_id`: Must match pattern `EV-[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z0-9-]+`
- `phase_id`: Must exist in Phases.phase_id (dropdown validation)
- `date_start`: Must be valid date in dd.mm.yyyy format
- `date_end`: Must be valid date in dd.mm.yyyy format OR empty, must be >= date_start if provided
- `event_type`: Dropdown: "Pivot", "Campaign", "Project", "Crisis", "Meeting", "Activity", "Internal governance"
- `program_area`: Dropdown: "Humanitarian aid", "Peacebuilding", "Organisational development", "Social cohesion"
- `status`: Dropdown: "Verified", "Needs review", "Draft"
- `sensitivity`: Dropdown: "Public", "Internal", "Confidential"
- `tags`: Comma-separated list, no spaces after commas

**Relationships:**
- Many Events belong to one Phase (via `phase_id`)
- One Event has many Claims (via `Claims.event_id`)
- Many Events link to many Sources (via `Event_Source_Map`)

---

### 3. Sources

**Purpose:** Reference documents, evidence, and source materials.

**Google Sheet:** "Sources"  
**Typical Rows:** 20-100+ (grows over time)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| source_id | Text | Yes | Yes | Unique identifier (format: SRC-CODE) | SRC-STATUTE |
| source_type | Text | Yes | No | Type of source | Doc |
| title | Text | Yes | No | Source title | Statutul Inițiativei... |
| owner | Text | Yes | No | Source owner | Internal |
| date_published | Date (dd.mm.yyyy) | No | No | Publication date | 01.01.2023 |
| url_or_drive_path | Text | No | No | Link or file path | turn0file2 |
| credibility | Text | Yes | No | Credibility level | Primary |
| access | Text | Yes | No | Access level | Internal |
| excerpt_or_notes | Text | No | No | Notes or excerpt | Constituted 26.02.2022... |

**Validation Rules:**
- `source_id`: Must match pattern `SRC-[A-Z0-9-]+`
- `source_type`: Dropdown: "Doc", "Article", "Report", "Meeting Notes", "Email", "Other"
- `credibility`: Dropdown: "Primary", "Secondary", "Tertiary"
- `access`: Dropdown: "Public", "Internal", "Confidential"
- `date_published`: Must be valid date in dd.mm.yyyy format OR empty

**Relationships:**
- Many Sources link to many Events (via `Event_Source_Map`)
- Many Sources link to many Claims (via `Claim_Sources`)

---

### 4. Event_Source_Map

**Purpose:** Link events to their supporting sources with specific pointers.

**Google Sheet:** "Event_Source_Map"  
**Typical Rows:** 1-5 per event (varies)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| event_id | Text | Yes | No | Foreign key to Events | EV-2022-02-26-FOUNDING |
| source_id | Text | Yes | No | Foreign key to Sources | SRC-STATUTE |
| relevance | Text | Yes | No | Relevance level | Primary evidence |
| pointer | Text | Yes | No | Location/reference in source | Capitolul I, pct. 1... |
| notes | Text | No | No | Additional notes | |

**Validation Rules:**
- `event_id`: Must exist in Events.event_id (data validation)
- `source_id`: Must exist in Sources.source_id (data validation)
- `relevance`: Dropdown: "Primary evidence", "Supporting", "Contextual", "Contradicts"
- Combination of `event_id` + `source_id` should be unique (one pointer per event-source pair)

**Relationships:**
- Many-to-many: Events ↔ Sources

---

### 5. Claims

**Purpose:** Metrics, outcomes, and quantitative/qualitative claims linked to events.

**Google Sheet:** "Claims"  
**Typical Rows:** 0-10 per event (varies, many events have none)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| claim_id | Text | Yes | Yes | Unique identifier (format: CL-NNNN) | CL-0001 |
| event_id | Text | Yes | No | Foreign key to Events | EV-2022-02-24-CF-LAUNCH |
| claim_text | Text | Yes | No | Claim description (full sentence) | For more than a year... |
| claim_type | Text | Yes | No | Type of claim | Metric |
| value_num | Number | No | No | Numeric value | 96000 |
| value_text | Text | No | No | Text value | more than 96,000 |
| unit | Text | No | No | Unit of measure | EUR |
| time_scope | Text | Yes | No | Time scope | Cumulative |
| verification | Text | Yes | No | Verification status | Partially verified |
| sensitivity | Text | Yes | No | Access level | Public |
| notes | Text | No | No | Additional notes | |

**Validation Rules:**
- `claim_id`: Must match pattern `CL-[0-9]{4}`
- `event_id`: Must exist in Events.event_id (data validation)
- `claim_type`: Dropdown: "Metric", "Outcome", "Impact", "Qualitative"
- `time_scope`: Dropdown: "Cumulative", "Point in time", "Project period", "Annual", "Other"
- `verification`: Dropdown: "Verified", "Partially verified", "Unverified", "Disputed"
- `sensitivity`: Dropdown: "Public", "Internal", "Confidential"
- Either `value_num` OR `value_text` should be provided (not both required, but at least one recommended)

**Relationships:**
- Many Claims belong to one Event (via `event_id`)
- Many Claims link to many Sources (via `Claim_Sources`)

---

### 6. Claim_Sources

**Purpose:** Link claims to their supporting sources with confidence levels.

**Google Sheet:** "Claim_Sources"  
**Typical Rows:** 1-3 per claim (varies)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| claim_id | Text | Yes | No | Foreign key to Claims | CL-0001 |
| source_id | Text | Yes | No | Foreign key to Sources | SRC-CF |
| pointer | Text | Yes | No | Location/reference in source | Crowdfunding collected... |
| confidence | Text | Yes | No | Confidence level | Medium |
| notes | Text | No | No | Additional notes | |

**Validation Rules:**
- `claim_id`: Must exist in Claims.claim_id (data validation)
- `source_id`: Must exist in Sources.source_id (data validation)
- `confidence`: Dropdown: "High", "Medium", "Low"
- Combination of `claim_id` + `source_id` should be unique

**Relationships:**
- Many-to-many: Claims ↔ Sources

---

### 7. Entities

**Purpose:** Organizations, people, places, and other entities referenced in events.

**Google Sheet:** "Entities"  
**Typical Rows:** 10-50+ (grows over time)

| Column | Type | Required | Unique | Description | Example |
|--------|------|----------|--------|-------------|---------|
| entity_id | Text | Yes | Yes | Unique identifier (format: ENT-CODE) | ENT-M4P |
| entity_type | Text | Yes | No | Type of entity | Organization |
| name | Text | Yes | No | Entity name | Moldova for Peace |
| description | Text | No | No | Description | Civic initiative for... |
| tags | Text (comma-separated) | No | No | Tags | peacebuilding, humanitarian |
| notes | Text | No | No | Additional notes | |

**Validation Rules:**
- `entity_id`: Must match pattern `ENT-[A-Z0-9-]+`
- `entity_type`: Dropdown: "Organization", "Person", "Location", "Project", "Initiative", "Other"
- `tags`: Comma-separated list, no spaces after commas

**Relationships:**
- Currently referenced in Events via `primary_org` (text match, not foreign key)
- Future: Could link Events to Entities via junction table if needed

---

## JSON Export Structure

The Google Sheets export should produce JSON in this structure:

```json
{
  "meta": {
    "project": "Moldova for Peace (M4P) Timeline",
    "timezone": "Europe/Chisinau",
    "date_format": "dd.mm.yyyy",
    "generated_at": "18.01.2026",
    "version": "1.0",
    "notes": "..."
  },
  "phases": [...],
  "events": [...],
  "sources": [...],
  "event_source_map": [...],
  "claims": [...],
  "claim_sources": [...],
  "entities": [...]
}
```

## Naming Conventions

### IDs
- **Phases:** `PHASE-1`, `PHASE-2`, etc.
- **Events:** `EV-YYYY-MM-DD-SLUG` (e.g., `EV-2022-02-26-FOUNDING`)
- **Sources:** `SRC-CODE` (e.g., `SRC-STATUTE`, `SRC-CF`)
- **Claims:** `CL-NNNN` (e.g., `CL-0001`, `CL-0002`)
- **Entities:** `ENT-CODE` (e.g., `ENT-M4P`, `ENT-DOPOMOHA`)

### Controlled Vocabularies

**event_type:**
- Pivot
- Campaign
- Project
- Crisis
- Meeting
- Activity
- Internal governance

**program_area:**
- Humanitarian aid
- Peacebuilding
- Organisational development
- Social cohesion

**status:**
- Verified
- Needs review
- Draft

**sensitivity:**
- Public
- Internal
- Confidential

**source_type:**
- Doc
- Article
- Report
- Meeting Notes
- Email
- Other

**credibility:**
- Primary
- Secondary
- Tertiary

**claim_type:**
- Metric
- Outcome
- Impact
- Qualitative

**entity_type:**
- Organization
- Person
- Location
- Project
- Initiative
- Other

## Data Quality Rules

1. **Required Fields:** All required fields must be populated
2. **Foreign Keys:** All foreign key references must exist in parent tables
3. **Date Format:** All dates must be in dd.mm.yyyy format
4. **Date Logic:** `date_end` must be >= `date_start` if both provided
5. **Phase Coverage:** Every event must have a valid `phase_id`
6. **Evidence Chain:** Events should have at least one source link (recommended)
7. **Validation Status:** Events with "Needs review" should be flagged for attention

## Export Requirements

The Google Sheets → JSON export script must:
1. Preserve all fields exactly as defined
2. Maintain data types (text, number, date)
3. Handle empty cells as empty strings or null
4. Preserve array structures (tags as comma-separated → JSON arrays)
5. Include metadata (generated_at, version)
6. Validate foreign key relationships
7. Sort arrays by appropriate fields (phases by order, events by date_start)

## Version History

- **v1.0 (2026-01-18):** Initial schema with Phases, Events, Sources, Claims, Entities
