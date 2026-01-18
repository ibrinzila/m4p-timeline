# Data Formatting Requirements for Google Sheets

This document specifies the exact formatting requirements for each field in all 7 sheets. Use this to populate your Google Sheets correctly.

## Sheet 1: Phases

**Purpose:** Story map phases for narrative structure

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | phase_id | Text: `PHASE-N` where N is 1, 2, 3... | Yes | `PHASE-1` | Must be unique, format: PHASE-1, PHASE-2, PHASE-3 |
| B | name | Text | Yes | `Foundation` | Short phase name |
| C | period_start | Date: `dd.mm.yyyy` | Yes | `01.01.2022` | **CRITICAL: Must be actual Date value in Sheets, formatted as dd.mm.yyyy** |
| D | period_end | Date: `dd.mm.yyyy` OR empty | No | `31.12.2022` or `` | **CRITICAL: Must be actual Date value if provided, formatted as dd.mm.yyyy** |
| E | description | Text (short) | Yes | `M4P constituted as a civic initiative` | One-line description |
| F | narrative | Text (long) | Yes | `In response to the invasion...` | Full narrative story (can be multiple sentences) |
| G | color | Text: Hex color code | Yes | `#0046AE` | Must start with #, 6 hex digits |
| H | order | Number: 1, 2, 3... | Yes | `1` | Integer, determines display order |
| I | icon | Text | No | `foundation` | Optional icon identifier |

**Date Formatting Instructions:**
- Enter dates as actual Date values in Google Sheets (not text)
- Format cells: Format → Number → Custom date format → `dd.mm.yyyy`
- Example: Type `01/01/2022` and Sheets will convert to Date, then format as `01.01.2022`

---

## Sheet 2: Events

**Purpose:** Core timeline events

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | event_id | Text: `EV-YYYY-MM-DD-CODE` | Yes | `EV-2022-02-26-FOUNDING` | Must be unique, format: EV-YYYY-MM-DD-DESCRIPTIVE |
| B | phase_id | Text: Must match Phases sheet | Yes | `PHASE-1` | **Foreign key: Must exist in Phases!A:A** |
| C | date_start | Date: `dd.mm.yyyy` | Yes | `26.02.2022` | **CRITICAL: Actual Date value, formatted as dd.mm.yyyy** |
| D | date_end | Date: `dd.mm.yyyy` OR empty | No | `` | **CRITICAL: Actual Date value if provided, formatted as dd.mm.yyyy** |
| E | title | Text | Yes | `Moldova pentru Pace is constituted...` | Full event title |
| F | event_type | Dropdown: See values below | Yes | `Pivot` | Must be from controlled list |
| G | program_area | Dropdown: See values below | Yes | `Humanitarian aid` | Must be from controlled list |
| H | summary_1line | Text | Yes | `Constituted as an un-institutionalized...` | One-line summary |
| I | status | Dropdown: See values below | Yes | `Verified` | Must be from controlled list |
| J | sensitivity | Dropdown: See values below | Yes | `Public` | Must be from controlled list |
| K | primary_org | Text | Yes | `M4P` | Organization name |
| L | tags | Text: Comma-separated, no spaces | No | `founding,governance,rights-based` | **Format: word1,word2,word3 (no spaces after commas)** |
| M | location | Text | No | `Chișinău` | Location name |
| N | notes | Text | No | `` | Optional notes |

**Controlled Vocabulary:**

**event_type (Column F):**
- `Pivot`
- `Campaign`
- `Project`
- `Crisis`
- `Meeting`
- `Activity`
- `Internal governance`

**program_area (Column G):**
- `Humanitarian aid`
- `Peacebuilding`
- `Organisational development`
- `Social cohesion`

**status (Column I):**
- `Verified`
- `Needs review`
- `Draft`

**sensitivity (Column J):**
- `Public`
- `Internal`
- `Confidential`

**Date Formatting Instructions:**
- Enter dates as actual Date values (not text)
- Format: Format → Number → Custom date format → `dd.mm.yyyy`
- Example: Type `26/02/2022` → Sheets converts to Date → Format displays as `26.02.2022`

---

## Sheet 3: Sources

**Purpose:** Reference documents and evidence

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | source_id | Text: `SRC-CODE` | Yes | `SRC-STATUTE` | Must be unique, format: SRC-UPPERCASE-CODE |
| B | source_type | Dropdown: See values below | Yes | `Doc` | Must be from controlled list |
| C | title | Text | Yes | `Statutul Inițiativei Moldova pentru Pace...` | Full source title |
| D | owner | Text | Yes | `Internal` | Source owner |
| E | date_published | Date: `dd.mm.yyyy` OR empty | No | `01.01.2023` | **Actual Date value if provided, formatted as dd.mm.yyyy** |
| F | url_or_drive_path | Text | No | `turn0file2` | URL or file identifier |
| G | credibility | Dropdown: See values below | Yes | `Primary` | Must be from controlled list |
| H | access | Dropdown: See values below | Yes | `Internal` | Must be from controlled list |
| I | excerpt_or_notes | Text (long) | No | `Constituted 26.02.2022...` | Notes or excerpt |

**Controlled Vocabulary:**

**source_type (Column B):**
- `Doc`
- `Article`
- `Report`
- `Meeting Notes`
- `Email`
- `Other`

**credibility (Column G):**
- `Primary`
- `Secondary`
- `Tertiary`

**access (Column H):**
- `Public`
- `Internal`
- `Confidential`

---

## Sheet 4: Event_Source_Map

**Purpose:** Link events to sources with pointers

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | event_id | Text: Must match Events sheet | Yes | `EV-2022-02-26-FOUNDING` | **Foreign key: Must exist in Events!A:A** |
| B | source_id | Text: Must match Sources sheet | Yes | `SRC-STATUTE` | **Foreign key: Must exist in Sources!A:A** |
| C | relevance | Text | Yes | `Primary evidence` | Description of relevance |
| D | pointer | Text | No | `Capitolul I, pct. 1 (constituită pe 26 februarie 2022)` | Specific location in source |
| E | notes | Text | No | `` | Optional notes |

**Important:** Both event_id and source_id must exist in their respective sheets.

---

## Sheet 5: Claims

**Purpose:** Metrics and outcomes linked to events

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | claim_id | Text: `CL-NNNN` where NNNN is 4 digits | Yes | `CL-0001` | Must be unique, format: CL-0001, CL-0002, etc. |
| B | event_id | Text: Must match Events sheet | Yes | `EV-2022-02-24-CF-LAUNCH` | **Foreign key: Must exist in Events!A:A** |
| C | claim_text | Text (long) | Yes | `For more than a year, more than 96,000 EUR were collected...` | Full claim statement |
| D | claim_type | Dropdown: See values below | Yes | `Metric` | Must be from controlled list |
| E | value_num | Number OR empty | No | `96000` | Numeric value if applicable |
| F | value_text | Text OR empty | No | `more than 96,000` | Text representation of value |
| G | unit | Text OR empty | No | `EUR` | Unit of measurement |
| H | time_scope | Dropdown: See values below | Yes | `Cumulative` | Must be from controlled list |
| I | verification | Dropdown: See values below | Yes | `Partially verified` | Must be from controlled list |
| J | sensitivity | Dropdown: See values below | Yes | `Public` | Must be from controlled list |
| K | notes | Text | No | `Exact final amount...` | Optional notes |

**Controlled Vocabulary:**

**claim_type (Column D):**
- `Metric`
- `Outcome`
- `Impact`
- `Qualitative`

**time_scope (Column H):**
- `Cumulative`
- `Point in time`
- `Project period`
- `Annual`
- `Other`

**verification (Column I):**
- `Verified`
- `Partially verified`
- `Unverified`
- `Disputed`

**sensitivity (Column J):**
- `Public`
- `Internal`
- `Confidential`

---

## Sheet 6: Claim_Sources

**Purpose:** Link claims to their supporting sources

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | claim_id | Text: Must match Claims sheet | Yes | `CL-0001` | **Foreign key: Must exist in Claims!A:A** |
| B | source_id | Text: Must match Sources sheet | Yes | `SRC-CF` | **Foreign key: Must exist in Sources!A:A** |
| C | pointer | Text | No | `Crowdfunding collected 96,000+ EUR` | Specific location in source |
| D | confidence | Dropdown: See values below | Yes | `Medium` | Must be from controlled list |
| E | notes | Text | No | `` | Optional notes |

**Controlled Vocabulary:**

**confidence (Column D):**
- `High`
- `Medium`
- `Low`

---

## Sheet 7: Entities

**Purpose:** Organizations, people, places referenced in events

| Column | Field Name | Format | Required | Example | Notes |
|--------|------------|--------|----------|---------|-------|
| A | entity_id | Text: `ENT-CODE` | Yes | `ENT-M4P` | Must be unique, format: ENT-UPPERCASE-CODE |
| B | entity_type | Dropdown: See values below | Yes | `Organization` | Must be from controlled list |
| C | name | Text | Yes | `Moldova for Peace` | Entity name |
| D | description | Text (long) | Yes | `Civic initiative for peacebuilding...` | Full description |
| E | tags | Text: Comma-separated, no spaces | No | `peacebuilding,humanitarian,civic initiative` | **Format: word1,word2,word3 (no spaces after commas)** |
| F | notes | Text | No | `` | Optional notes |

**Controlled Vocabulary:**

**entity_type (Column B):**
- `Organization`
- `Person`
- `Location`
- `Project`
- `Initiative`
- `Other`

---

## Critical Formatting Rules

### 1. Dates (MOST IMPORTANT)

**For ALL date fields (date_start, date_end, period_start, period_end, date_published):**

1. **Enter as actual Date values** (not text strings)
2. **How to enter:**
   - Type: `26/02/2022` or `26-02-2022` or `26 Feb 2022`
   - Google Sheets will automatically convert to Date
3. **Format the cells:**
   - Select the date column
   - Format → Number → Custom date format
   - Enter: `dd.mm.yyyy`
   - Click Apply
4. **Result:** Cell shows `26.02.2022` but is stored as Date object

**Why this matters:** Apps Script needs Date objects to format them correctly. Text strings won't work.

### 2. Tags Fields

**For tags columns (Events!L, Entities!E):**

- Format: `word1,word2,word3` (comma-separated, NO spaces after commas)
- Example: `founding,governance,rights-based` ✅
- Wrong: `founding, governance, rights-based` ❌ (has spaces)

### 3. Foreign Keys

**Critical relationships:**

- Events.phase_id → Must exist in Phases.phase_id
- Event_Source_Map.event_id → Must exist in Events.event_id
- Event_Source_Map.source_id → Must exist in Sources.source_id
- Claims.event_id → Must exist in Events.event_id
- Claim_Sources.claim_id → Must exist in Claims.claim_id
- Claim_Sources.source_id → Must exist in Sources.source_id

### 4. ID Formats

- **phase_id:** `PHASE-1`, `PHASE-2`, `PHASE-3` (uppercase, hyphen, number)
- **event_id:** `EV-2022-02-26-FOUNDING` (EV-YYYY-MM-DD-DESCRIPTIVE)
- **source_id:** `SRC-STATUTE` (SRC-UPPERCASE-CODE)
- **claim_id:** `CL-0001` (CL-####, 4 digits)
- **entity_id:** `ENT-M4P` (ENT-UPPERCASE-CODE)

### 5. Required vs Optional

- **Required fields:** Must have a value (cannot be empty)
- **Optional fields:** Can be empty (leave blank if not applicable)

---

## Sample Data for Testing

### Phases Sheet (Minimum 3 rows)

| phase_id | name | period_start | period_end | description | narrative | color | order | icon |
|----------|------|--------------|------------|-------------|-----------|-------|-------|------|
| PHASE-1 | Foundation | 01.01.2022 | 31.12.2022 | M4P constituted as civic initiative | In response to the invasion of Ukraine... | #0046AE | 1 | foundation |
| PHASE-2 | Growth | 01.01.2023 | 31.12.2024 | Statute formalized, organizational development | During this period, M4P formalized... | #007A50 | 2 | growth |
| PHASE-3 | Response | 01.01.2025 | | Transnistria crisis response | The energy crisis in Transnistria... | #CC092F | 3 | response |

### Events Sheet (Minimum 1 row for testing)

| event_id | phase_id | date_start | date_end | title | event_type | program_area | summary_1line | status | sensitivity | primary_org | tags | location | notes |
|----------|----------|------------|----------|-------|------------|--------------|----------------|--------|-------------|-------------|------|----------|-------|
| EV-2022-02-26-FOUNDING | PHASE-1 | 26.02.2022 | | Moldova pentru Pace is constituted... | Pivot | Humanitarian aid | Constituted as an un-institutionalized... | Verified | Public | M4P | founding,governance,rights-based | Chișinău | |

---

## Common Mistakes to Avoid

1. **Dates as text:** Don't type `"26.02.2022"` as text. Type `26/02/2022` and let Sheets convert it.
2. **Spaces in tags:** Don't use `word1, word2` - use `word1,word2`
3. **Wrong phase_id format:** Don't use `phase-1` or `Phase-1` - use `PHASE-1`
4. **Missing foreign keys:** Ensure all IDs referenced actually exist
5. **Empty required fields:** Don't leave required fields blank
6. **Wrong dropdown values:** Use exact values from controlled vocabulary lists

---

## Validation Checklist

Before running Apps Script, verify:

- [ ] All date columns are formatted as `dd.mm.yyyy` (Format → Number → Custom)
- [ ] All dates are actual Date values (not text)
- [ ] All phase_id values in Events match Phases sheet
- [ ] All event_id values in Event_Source_Map and Claims match Events sheet
- [ ] All source_id values match Sources sheet
- [ ] Tags have no spaces after commas
- [ ] All required fields are filled
- [ ] All dropdown values match controlled vocabulary
- [ ] ID formats are correct (PHASE-1, EV-2022-02-26-FOUNDING, etc.)

---

## Quick Reference: Sheet Order

1. **Phases** (must be first - Events reference it)
2. **Events** (references Phases)
3. **Sources** (referenced by Event_Source_Map and Claim_Sources)
4. **Event_Source_Map** (references Events and Sources)
5. **Claims** (references Events)
6. **Claim_Sources** (references Claims and Sources)
7. **Entities** (standalone, no dependencies)

---

## For AI Assistant: Populate Instructions

**Task:** Populate the Google Sheets with sample data following the formatting requirements above.

**Priority:**
1. **Phases sheet** - Must have at least 3 phases (PHASE-1, PHASE-2, PHASE-3)
2. **Events sheet** - Must have at least 5-10 events with valid phase_id references
3. **Sources sheet** - At least 3-5 sources
4. **Event_Source_Map** - Link events to sources
5. **Claims** - At least 2-3 claims linked to events
6. **Claim_Sources** - Link claims to sources
7. **Entities** - At least 3-5 entities

**Critical:** 
- All dates must be entered as Date values (not text) and formatted as `dd.mm.yyyy`
- All foreign keys must reference existing IDs
- Tags must be comma-separated with NO spaces after commas
- Use exact values from controlled vocabulary lists
