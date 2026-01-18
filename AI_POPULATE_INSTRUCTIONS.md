# Instructions for AI Assistant: Populate M4P Timeline Google Sheets

## Task
Populate the Google Sheets with data following the exact formatting requirements below. The spreadsheet already has the correct structure with headers.

## Critical Formatting Rules

### 1. DATES (MOST IMPORTANT - READ CAREFULLY)

**For ALL date columns (period_start, period_end, date_start, date_end, date_published):**

- **DO NOT** enter as text strings like `"26.02.2022"`
- **DO** enter as actual Date values in Google Sheets
- **How to enter:**
  1. Type the date in any format: `26/02/2022` or `26-02-2022` or `26 Feb 2022`
  2. Google Sheets will automatically convert it to a Date object
  3. Then format the column: Format → Number → Custom date format → Enter `dd.mm.yyyy`
  4. The cell will display as `26.02.2022` but be stored as a Date object

**Why this matters:** The Apps Script needs Date objects to format them correctly. Text strings will cause the dashboard to fail.

### 2. Tags Format

**For tags columns (Events column L, Entities column E):**
- Format: `word1,word2,word3` (comma-separated, NO spaces after commas)
- ✅ Correct: `founding,governance,rights-based`
- ❌ Wrong: `founding, governance, rights-based` (has spaces)

### 3. Foreign Key Relationships

**MUST match existing IDs:**
- Events.phase_id → Must exist in Phases.phase_id column
- Event_Source_Map.event_id → Must exist in Events.event_id column
- Event_Source_Map.source_id → Must exist in Sources.source_id column
- Claims.event_id → Must exist in Events.event_id column
- Claim_Sources.claim_id → Must exist in Claims.claim_id column
- Claim_Sources.source_id → Must exist in Sources.source_id column

---

## Sheet-by-Sheet Requirements

### Sheet 1: Phases

**Minimum: 3 rows (PHASE-1, PHASE-2, PHASE-3)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | phase_id | Text: `PHASE-N` | Yes | `PHASE-1` | Must be: PHASE-1, PHASE-2, PHASE-3 (uppercase) |
| B | name | Text | Yes | `Foundation` | Short name |
| C | period_start | **Date (dd.mm.yyyy)** | Yes | `01.01.2022` | **Actual Date value, formatted as dd.mm.yyyy** |
| D | period_end | **Date (dd.mm.yyyy)** OR empty | No | `31.12.2022` | **Actual Date value if provided** |
| E | description | Text | Yes | `M4P constituted as civic initiative` | One-line |
| F | narrative | Text (long) | Yes | `In response to the invasion of Ukraine...` | Full story (2-4 sentences) |
| G | color | Hex color | Yes | `#0046AE` | Must start with #, 6 hex digits |
| H | order | Number | Yes | `1` | Integer: 1, 2, 3... |
| I | icon | Text | No | `foundation` | Optional |

**Sample Data:**
```
PHASE-1 | Foundation | 01.01.2022 | 31.12.2022 | M4P constituted as civic initiative | In response to the invasion of Ukraine, Moldova for Peace emerged as an un-institutionalized civic platform for organizing and coordinating assistance. This phase established the foundational values, operational model, and initial humanitarian response mechanisms. | #0046AE | 1 | foundation

PHASE-2 | Growth | 01.01.2023 | 31.12.2024 | Statute formalized, organizational development | During this period, M4P formalized its structure through the statute document, which defined vision, mission, values, departments, and consensus-based governance. | #007A50 | 2 | growth

PHASE-3 | Response | 01.01.2025 | [empty] | Transnistria crisis response, solidarity campaigns | The energy crisis in Transnistria prompted M4P to launch solidarity campaigns, demonstrating the organization's commitment to peacebuilding and "No One Left Behind" principles. | #CC092F | 3 | response
```

---

### Sheet 2: Events

**Minimum: 10-15 events (at least 3 per phase)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | event_id | Text: `EV-YYYY-MM-DD-CODE` | Yes | `EV-2022-02-26-FOUNDING` | Format: EV-YYYY-MM-DD-DESCRIPTIVE (uppercase) |
| B | phase_id | Text | Yes | `PHASE-1` | **MUST exist in Phases!A:A** |
| C | date_start | **Date (dd.mm.yyyy)** | Yes | `26.02.2022` | **Actual Date value, formatted as dd.mm.yyyy** |
| D | date_end | **Date (dd.mm.yyyy)** OR empty | No | `` | **Actual Date value if provided** |
| E | title | Text | Yes | `Moldova pentru Pace is constituted...` | Full sentence |
| F | event_type | Dropdown | Yes | `Pivot` | Must be: Pivot, Campaign, Project, Crisis, Meeting, Activity, Internal governance |
| G | program_area | Dropdown | Yes | `Humanitarian aid` | Must be: Humanitarian aid, Peacebuilding, Organisational development, Social cohesion |
| H | summary_1line | Text | Yes | `Constituted as an un-institutionalized...` | One-line summary |
| I | status | Dropdown | Yes | `Verified` | Must be: Verified, Needs review, Draft |
| J | sensitivity | Dropdown | Yes | `Public` | Must be: Public, Internal, Confidential |
| K | primary_org | Text | Yes | `M4P` | Organization name |
| L | tags | Text: `word1,word2,word3` | No | `founding,governance,rights-based` | **NO spaces after commas** |
| M | location | Text | No | `Chișinău` | Location name |
| N | notes | Text | No | `` | Optional |

**Sample Events (copy these exactly):**

```
EV-2022-02-26-FOUNDING | PHASE-1 | 26.02.2022 | [empty] | Moldova pentru Pace is constituted as a civic initiative (platform for organizing and coordinating assistance). | Pivot | Humanitarian aid | Constituted as an un-institutionalized civic initiative, anchored in rights-based assistance and integration objectives. | Verified | Public | M4P | founding,governance,rights-based | Chișinău | [empty]

EV-2022-02-24-CF-LAUNCH | PHASE-1 | 24.02.2022 | [empty] | Crowdfunding campaign launched (approx. late Feb 2022, aligned with first invasion weeks). | Campaign | Humanitarian aid | Crowdfunding initiated to fund emergency response and operational capacity. | Needs review | Public | M4P | fundraising,emergency,crowdfunding | [empty] | [empty]

EV-2022-03-11-DOPOMOHA | PHASE-1 | 11.03.2022 | [empty] | Dopomoha.md platform launched. | Project | Humanitarian aid | Digital platform launched to support assistance coordination; cited as key channel for reaching people in need. | Verified | Public | Dopomoha | platform,coordination,digital | [empty] | [empty]

EV-2023-01-01-STATUTE | PHASE-2 | 01.01.2023 | [empty] | Statute document published/compiled (year 2023). | Internal governance | Organisational development | Statute defines vision, mission, values, departments, and consensus-based governance. | Needs review | Internal | M4P | statute,values,mission,structure | Chișinău | [empty]

EV-2024-12-31-DOPOMOHA-MODEL | PHASE-2 | 31.12.2024 | [empty] | Dopomoha model positioned as caretaker of M4P legacy/assets and a social innovation vehicle (by end of 2024). | Pivot | Social cohesion | Strategic evolution: Dopomoha as caretaker + experimentation with sustainability and fundraising models. | Needs review | Internal | M4P / Dopomoha | sustainability,social innovation,governance | [empty] | [empty]

EV-2025-01-01-TRANS-CRISIS | PHASE-3 | 01.01.2025 | [empty] | Transnistria energy crisis: gas-consumption limits and household heating/hot-water cuts begin. | Crisis | Peacebuilding | Households/companies face heat/hot-water cuts; power supply strain begins. | Verified | Public | Context | transnistria,energy,humanitarian context | Transnistria | [empty]

EV-2025-01-03-BLACKOUTS | PHASE-3 | 03.01.2025 | [empty] | Rolling blackouts instituted in Transnistria (initially 1 hour each evening). | Crisis | Peacebuilding | Grid failures lead to controlled outages; schedule-based power cuts begin. | Verified | Public | Context | transnistria,blackouts,energy | Transnistria | [empty]

EV-2025-01-07-8H | PHASE-3 | 07.01.2025 | [empty] | Rolling blackouts increase to 8 hours/day (4h morning + 4h evening). | Crisis | Peacebuilding | Outages escalate substantially; impacts extend to water pressure and services. | Verified | Public | Context | transnistria,blackouts,services | Transnistria | [empty]

EV-2025-01-08-SEC-COUNCIL | PHASE-3 | 08.01.2025 | [empty] | Transnistrian security council meeting discusses flawed forecasting for energy shortfall. | Crisis | Peacebuilding | Forecasting model based on 2009 proved wrong; electric heating demand contributed to system strain. | Verified | Public | Context | transnistria,forecasting,narratives | Transnistria | [empty]

EV-2025-01-09-M4P-BRAINSTORM | PHASE-3 | 09.01.2025 | [empty] | M4P brainstorming meeting: Solidarity campaign for Transnistria (key messages + action plan). | Meeting | Peacebuilding | Defines messaging frame (Solidarity / No One Left Behind / Positive Peace) and rapid drafting workflow. | Verified | Internal | M4P | transnistria,solidarity,campaign,messaging | Chișinău | [empty]

EV-2025-01-10-REVIEW | PHASE-3 | 10.01.2025 | [empty] | Planned: review & adjust solidarity campaign draft (team contribution). | Activity | Peacebuilding | Step in the rapid workflow: review/adjust draft on Friday following the meeting. | Verified | Internal | M4P | workflow,drafting | [empty] | [empty]

EV-2025-01-11-PUBLISH | PHASE-3 | 11.01.2025 | [empty] | Planned: publish & distribute solidarity campaign materials (Saturday). | Campaign | Peacebuilding | Step in the rapid workflow: publish/distribute on Saturday, roles assigned afterwards. | Verified | Internal | M4P | workflow,distribution | [empty] | [empty]
```

---

### Sheet 3: Sources

**Minimum: 5 sources**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | source_id | Text: `SRC-CODE` | Yes | `SRC-STATUTE` | Format: SRC-UPPERCASE-CODE |
| B | source_type | Dropdown | Yes | `Doc` | Must be: Doc, Article, Report, Meeting Notes, Email, Other |
| C | title | Text | Yes | `Statutul Inițiativei Moldova pentru Pace...` | Full title |
| D | owner | Text | Yes | `Internal` | Owner name |
| E | date_published | **Date (dd.mm.yyyy)** OR empty | No | `01.01.2023` | **Actual Date value if provided** |
| F | url_or_drive_path | Text | No | `turn0file2` | URL or file path |
| G | credibility | Dropdown | Yes | `Primary` | Must be: Primary, Secondary, Tertiary |
| H | access | Dropdown | Yes | `Internal` | Must be: Public, Internal, Confidential |
| I | excerpt_or_notes | Text | No | `Constituted 26.02.2022...` | Notes or excerpt |

**Sample Sources:**
```
SRC-M4P2 | Doc | Moldova for Peace 2.0: Strategic Evolution Anchored in Foundational Values and Principles | Internal | [empty] | turn0file0 | Primary | Internal | Strategic evolution: initiative→movement, strategic initiatives for 2025, Dopomoha model by end of 2024.

SRC-STATUTE | Doc | Statutul Inițiativei Moldova pentru Pace (Chișinău 2023) | Internal | 01.01.2023 | turn0file2 | Primary | Internal | Constituted 26.02.2022; vision/mission/values; departments; governance by consensus.

SRC-CF | Doc | Crowdfunding: Moldova for Peace // Solidarity for Ukraine | Internal/Public text | [empty] | turn0file1 | Primary | Internal | Crowdfunding launched in Feb (with invasion), collected 96,000+ EUR; Dopomoha.md launched 11 March; Community Center 151.

SRC-TRANS | Doc | The Situation in Transnistria | Internal | [empty] | turn0file5 | Primary | Internal | Energy crisis timeline: gas/heat cuts from 01.01; rolling blackouts from 03.01; escalation by 07.01; security council 08.01.

SRC-BRAIN | Doc | 9 Jan 2025 | Brainstorming: Campanie de Solidaritate pentru Transnistria | Internal | 09.01.2025 | turn0file3 | Primary | Internal | Meeting attendees + plan: draft Thu (Ion), review Fri, publish Sat; key messages: solidarity, No One Left Behind, Positive Peace.
```

---

### Sheet 4: Event_Source_Map

**Link events to sources (minimum: 10-12 mappings)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | event_id | Text | Yes | `EV-2022-02-26-FOUNDING` | **MUST exist in Events!A:A** |
| B | source_id | Text | Yes | `SRC-STATUTE` | **MUST exist in Sources!A:A** |
| C | relevance | Text | Yes | `Primary evidence` | Description |
| D | pointer | Text | No | `Capitolul I, pct. 1...` | Specific location in source |
| E | notes | Text | No | `` | Optional |

**Sample Mappings:**
```
EV-2022-02-26-FOUNDING | SRC-STATUTE | Primary evidence | Capitolul I, pct. 1 (constituită pe 26 februarie 2022) | [empty]

EV-2022-02-24-CF-LAUNCH | SRC-CF | Supporting | Crowdfunding launched in February with the invasion | Exact day in Feb needs confirmation.

EV-2022-03-11-DOPOMOHA | SRC-CF | Primary evidence | Mentions Dopomoha.md platform (launched March 11) | [empty]

EV-2023-01-01-STATUTE | SRC-STATUTE | Primary evidence | Document header: Chișinău 2023 | Exact adoption/signing date not in snippet; confirm later.

EV-2024-12-31-DOPOMOHA-MODEL | SRC-M4P2 | Primary evidence | Mentions model launched by end of 2024 (caretaker + social innovation) | Exact month/day needs confirmation.

EV-2025-01-01-TRANS-CRISIS | SRC-TRANS | Primary evidence | Starting on January 1st: heat/hot water cuts; MGRES emergency coal | [empty]

EV-2025-01-03-BLACKOUTS | SRC-TRANS | Primary evidence | Rolling blackouts instituted Jan 3rd | [empty]

EV-2025-01-07-8H | SRC-TRANS | Primary evidence | By Jan 7th: 8 hours/day rolling blackouts | [empty]

EV-2025-01-08-SEC-COUNCIL | SRC-TRANS | Primary evidence | On Jan 8th: security council meeting | [empty]

EV-2025-01-09-M4P-BRAINSTORM | SRC-BRAIN | Primary evidence | Attendees + agenda + key messages + plan | [empty]

EV-2025-01-10-REVIEW | SRC-BRAIN | Primary evidence | Plan: REVIEW & ADJUST - Friday | [empty]

EV-2025-01-11-PUBLISH | SRC-BRAIN | Primary evidence | Plan: PUBLISH & DISTRIBUTE - Saturday | [empty]
```

---

### Sheet 5: Claims

**Metrics and outcomes (minimum: 4 claims)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | claim_id | Text: `CL-NNNN` | Yes | `CL-0001` | Format: CL-#### (4 digits) |
| B | event_id | Text | Yes | `EV-2022-02-24-CF-LAUNCH` | **MUST exist in Events!A:A** |
| C | claim_text | Text (long) | Yes | `For more than a year, more than 96,000 EUR were collected...` | Full claim statement |
| D | claim_type | Dropdown | Yes | `Metric` | Must be: Metric, Outcome, Impact, Qualitative |
| E | value_num | Number OR empty | No | `96000` | Numeric value |
| F | value_text | Text OR empty | No | `more than 96,000` | Text representation |
| G | unit | Text OR empty | No | `EUR` | Unit of measurement |
| H | time_scope | Dropdown | Yes | `Cumulative` | Must be: Cumulative, Point in time, Project period, Annual, Other |
| I | verification | Dropdown | Yes | `Partially verified` | Must be: Verified, Partially verified, Unverified, Disputed |
| J | sensitivity | Dropdown | Yes | `Public` | Must be: Public, Internal, Confidential |
| K | notes | Text | No | `Exact final amount...` | Optional |

**Sample Claims:**
```
CL-0001 | EV-2022-02-24-CF-LAUNCH | For more than a year, more than 96,000 EUR were collected in the crowdfunding campaign. | Metric | 96000 | more than 96,000 | EUR | Cumulative | Partially verified | Public | Exact final amount and date range should be confirmed from the original campaign page/report.

CL-0002 | EV-2022-02-24-CF-LAUNCH | Approximately 5% of crowdfunding spending was for communication (posters, leaflets, ads). | Metric | 5 | 5% | % | Cumulative | Partially verified | Public | [empty]

CL-0003 | EV-2022-02-24-CF-LAUNCH | Crowdfunding funds supported rent and setup of a community center (Community Center 151) offering counseling, children's activities, and a women's safe space. | Outcome | [empty] | Community Center 151 established/operated | [empty] | Project period | Partially verified | Public | [empty]

CL-0004 | EV-2022-03-11-DOPOMOHA | The Moldova Peace Initiative helped 10,000+ people in the first month, and later 19,000+ via Dopomoha.md (launched March 11). | Metric | 19000 | 10,000+ first month; 19,000+ via Dopomoha.md | people | Cumulative | Partially verified | Public | Numbers are stated in the crowdfunding text; should be cross-checked with annual report / platform stats.
```

---

### Sheet 6: Claim_Sources

**Link claims to sources (minimum: 4 mappings)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | claim_id | Text | Yes | `CL-0001` | **MUST exist in Claims!A:A** |
| B | source_id | Text | Yes | `SRC-CF` | **MUST exist in Sources!A:A** |
| C | pointer | Text | No | `Crowdfunding collected 96,000+ EUR` | Specific location |
| D | confidence | Dropdown | Yes | `Medium` | Must be: High, Medium, Low |
| E | notes | Text | No | `` | Optional |

**Sample Mappings:**
```
CL-0001 | SRC-CF | Crowdfunding collected 96,000+ EUR | Medium | [empty]

CL-0002 | SRC-CF | 5% communication spending | Medium | [empty]

CL-0003 | SRC-CF | Community Center 151 described | Medium | [empty]

CL-0004 | SRC-CF | 10,000+ first month; 19,000+ via Dopomoha.md | Medium | [empty]
```

---

### Sheet 7: Entities

**Organizations, people, places (minimum: 6 entities)**

| Column | Header | Format | Required | Example | Validation |
|--------|--------|--------|----------|---------|------------|
| A | entity_id | Text: `ENT-CODE` | Yes | `ENT-M4P` | Format: ENT-UPPERCASE-CODE |
| B | entity_type | Dropdown | Yes | `Organization` | Must be: Organization, Person, Location, Project, Initiative, Other |
| C | name | Text | Yes | `Moldova for Peace` | Entity name |
| D | description | Text (long) | Yes | `Civic initiative for peacebuilding...` | Full description |
| E | tags | Text: `word1,word2,word3` | No | `peacebuilding,humanitarian,civic initiative` | **NO spaces after commas** |
| F | notes | Text | No | `` | Optional |

**Sample Entities:**
```
ENT-M4P | Organization | Moldova for Peace | Civic initiative for peacebuilding and humanitarian aid, constituted as an un-institutionalized platform for organizing and coordinating assistance. | peacebuilding,humanitarian,civic initiative | [empty]

ENT-DOPOMOHA | Organization | Dopomoha.md | Digital platform for assistance coordination, launched as a key channel for reaching people in need. Positioned as caretaker of M4P legacy and social innovation vehicle. | platform,digital,humanitarian,coordination | [empty]

ENT-CC151 | Project | Community Center 151 | Community center offering counseling, children's activities, and a women's safe space. Supported by crowdfunding funds. | community,center,counseling,safe space | [empty]

ENT-TRANS | Location | Transnistria | Breakaway region of Moldova, location of energy crisis in 2025. | location,region,crisis | [empty]

ENT-CHISINAU | Location | Chișinău | Capital city of Moldova, location of M4P operations. | location,capital,moldova | [empty]

ENT-CONTEXT | Organization | Context | External context events (not directly M4P activities but relevant to timeline). | context,external | Used for events that are contextual (e.g., Transnistria crisis) but not direct M4P activities
```

---

## Step-by-Step Population Instructions

1. **Start with Phases sheet** - Populate all 3 phases first (required for Events)
2. **Then Events sheet** - Populate events, ensuring phase_id matches Phases
3. **Then Sources sheet** - Populate sources (required for mappings)
4. **Then Event_Source_Map** - Link events to sources
5. **Then Claims** - Populate claims linked to events
6. **Then Claim_Sources** - Link claims to sources
7. **Finally Entities** - Populate entities (standalone)

## Critical Reminders

1. **Dates:** Enter as Date values (not text), then format as `dd.mm.yyyy`
2. **Tags:** No spaces after commas: `word1,word2,word3`
3. **Foreign keys:** All IDs must match existing IDs in referenced sheets
4. **Dropdown values:** Use exact values from controlled vocabulary
5. **Required fields:** Cannot be empty

## Validation After Population

- [ ] All date columns formatted as `dd.mm.yyyy`
- [ ] All dates are Date values (not text)
- [ ] All phase_id in Events exist in Phases
- [ ] All event_id in Event_Source_Map and Claims exist in Events
- [ ] All source_id exist in Sources
- [ ] Tags have no spaces after commas
- [ ] All required fields filled
- [ ] Dropdown values match controlled vocabulary
