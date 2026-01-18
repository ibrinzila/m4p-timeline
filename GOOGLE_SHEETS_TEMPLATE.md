# Google Sheets Template Setup Guide

**Purpose:** Step-by-step guide to create the Google Sheets database for M4P Timeline.

## Overview

Create a Google Sheets workbook with 7 sheets in this order:
1. Phases
2. Events
3. Sources
4. Event_Source_Map
5. Claims
6. Claim_Sources
7. Entities

## Sheet 1: Phases

**Purpose:** Define story map phases for narrative structure.

### Column Setup

| Column | A | B | C | D | E | F | G | H | I |
|--------|---|---|---|---|---|---|---|---|---|
| Header | phase_id | name | period_start | period_end | description | narrative | color | order | icon |
| Width | 100 | 200 | 120 | 120 | 300 | 400 | 100 | 60 | 100 |

### Row 1: Headers
```
phase_id | name | period_start | period_end | description | narrative | color | order | icon
```

### Data Validation

**Column A (phase_id):**
- Custom formula: `=REGEXMATCH(A2,"^PHASE-[0-9]+$")`
- Error message: "Must match format PHASE-N (e.g., PHASE-1)"

**Column C (period_start):**
- Date format: Custom format `dd.mm.yyyy`
- Data validation: Date is valid

**Column D (period_end):**
- Date format: Custom format `dd.mm.yyyy`
- Data validation: Date is valid OR empty

**Column G (color):**
- Custom formula: `=REGEXMATCH(G2,"^#[0-9A-Fa-f]{6}$")`
- Error message: "Must be hex color (e.g., #0046AE)"

**Column H (order):**
- Data validation: Number, whole number, >= 1
- Error message: "Must be positive integer"

### Sample Data

| phase_id | name | period_start | period_end | description | narrative | color | order | icon |
|----------|------|-------------|------------|------------|-----------|-------|-------|------|
| PHASE-1 | Foundation | 01.01.2022 | 31.12.2022 | M4P constituted as civic initiative | In response to the invasion of Ukraine... | #0046AE | 1 | foundation |
| PHASE-2 | Growth | 01.01.2023 | 31.12.2024 | Statute formalized, organizational development | During this period, M4P formalized... | #007A50 | 2 | growth |
| PHASE-3 | Response | 01.01.2025 | | Transnistria crisis response | The energy crisis in Transnistria... | #CC092F | 3 | response |

---

## Sheet 2: Events

**Purpose:** Core timeline events.

### Column Setup

| Column | A | B | C | D | E | F | G | H | I | J | K | L | M |
|--------|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Header | event_id | phase_id | date_start | date_end | title | event_type | program_area | summary_1line | status | sensitivity | primary_org | tags | location | notes |
| Width | 200 | 100 | 100 | 100 | 400 | 150 | 200 | 300 | 100 | 100 | 150 | 200 | 150 | 300 |

### Row 1: Headers
```
event_id | phase_id | date_start | date_end | title | event_type | program_area | summary_1line | status | sensitivity | primary_org | tags | location | notes
```

### Data Validation

**Column A (event_id):**
- Custom formula: `=REGEXMATCH(A2,"^EV-[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z0-9-]+$")`
- Error message: "Must match format EV-YYYY-MM-DD-SLUG"

**Column B (phase_id):**
- Data validation: List from range `Phases!A:A`
- Error message: "Must select a valid phase"
- **CRITICAL:** This creates the foreign key relationship

**Column C (date_start):**
- Date format: Custom format `dd.mm.yyyy`
- Data validation: Date is valid
- Required: Yes

**Column D (date_end):**
- Date format: Custom format `dd.mm.yyyy`
- Data validation: Date is valid OR empty
- Custom formula (if date_end provided): `=OR(D2="",D2>=C2)`
- Error message: "End date must be >= start date"

**Column F (event_type):**
- Data validation: List of items
- Values: `Pivot, Campaign, Project, Crisis, Meeting, Activity, Internal governance`
- Error message: "Must select from list"

**Column G (program_area):**
- Data validation: List of items
- Values: `Humanitarian aid, Peacebuilding, Organisational development, Social cohesion`
- Error message: "Must select from list"

**Column I (status):**
- Data validation: List of items
- Values: `Verified, Needs review, Draft`
- Error message: "Must select from list"

**Column J (sensitivity):**
- Data validation: List of items
- Values: `Public, Internal, Confidential`
- Error message: "Must select from list"

**Column L (tags):**
- Format: Comma-separated, no spaces after commas
- Example: `founding,governance,rights-based`

### Conditional Formatting

**Column I (status):**
- If "Needs review" → Yellow background (#FFF3E0)
- If "Verified" → Green background (#E8F5E9)

---

## Sheet 3: Sources

**Purpose:** Reference documents and evidence.

### Column Setup

| Column | A | B | C | D | E | F | G | H | I |
|--------|---|---|---|---|---|---|---|---|---|
| Header | source_id | source_type | title | owner | date_published | url_or_drive_path | credibility | access | excerpt_or_notes |
| Width | 150 | 120 | 400 | 150 | 120 | 200 | 120 | 120 | 400 |

### Row 1: Headers
```
source_id | source_type | title | owner | date_published | url_or_drive_path | credibility | access | excerpt_or_notes
```

### Data Validation

**Column A (source_id):**
- Custom formula: `=REGEXMATCH(A2,"^SRC-[A-Z0-9-]+$")`
- Error message: "Must match format SRC-CODE"

**Column B (source_type):**
- Data validation: List of items
- Values: `Doc, Article, Report, Meeting Notes, Email, Other`

**Column E (date_published):**
- Date format: Custom format `dd.mm.yyyy`
- Data validation: Date is valid OR empty

**Column G (credibility):**
- Data validation: List of items
- Values: `Primary, Secondary, Tertiary`

**Column H (access):**
- Data validation: List of items
- Values: `Public, Internal, Confidential`

---

## Sheet 4: Event_Source_Map

**Purpose:** Link events to sources with pointers.

### Column Setup

| Column | A | B | C | D | E |
|--------|---|---|---|---|---|
| Header | event_id | source_id | relevance | pointer | notes |
| Width | 200 | 150 | 150 | 400 | 300 |

### Row 1: Headers
```
event_id | source_id | relevance | pointer | notes
```

### Data Validation

**Column A (event_id):**
- Data validation: List from range `Events!A:A`
- Error message: "Must exist in Events sheet"

**Column B (source_id):**
- Data validation: List from range `Sources!A:A`
- Error message: "Must exist in Sources sheet"

**Column C (relevance):**
- Data validation: List of items
- Values: `Primary evidence, Supporting, Contextual, Contradicts`

### Conditional Formatting

**Column C (relevance):**
- If "Primary evidence" → Green text
- If "Supporting" → Blue text
- If "Contradicts" → Red text

---

## Sheet 5: Claims

**Purpose:** Metrics and outcomes.

### Column Setup

| Column | A | B | C | D | E | F | G | H | I | J |
|--------|---|---|---|---|---|---|---|---|---|---|
| Header | claim_id | event_id | claim_text | claim_type | value_num | value_text | unit | time_scope | verification | sensitivity | notes |
| Width | 100 | 200 | 400 | 120 | 100 | 150 | 80 | 120 | 120 | 120 | 300 |

### Row 1: Headers
```
claim_id | event_id | claim_text | claim_type | value_num | value_text | unit | time_scope | verification | sensitivity | notes
```

### Data Validation

**Column A (claim_id):**
- Custom formula: `=REGEXMATCH(A2,"^CL-[0-9]{4}$")`
- Error message: "Must match format CL-NNNN"

**Column B (event_id):**
- Data validation: List from range `Events!A:A`
- Error message: "Must exist in Events sheet"

**Column D (claim_type):**
- Data validation: List of items
- Values: `Metric, Outcome, Impact, Qualitative`

**Column H (time_scope):**
- Data validation: List of items
- Values: `Cumulative, Point in time, Project period, Annual, Other`

**Column I (verification):**
- Data validation: List of items
- Values: `Verified, Partially verified, Unverified, Disputed`

**Column J (sensitivity):**
- Data validation: List of items
- Values: `Public, Internal, Confidential`

---

## Sheet 6: Claim_Sources

**Purpose:** Link claims to sources.

### Column Setup

| Column | A | B | C | D | E |
|--------|---|---|---|---|---|
| Header | claim_id | source_id | pointer | confidence | notes |
| Width | 100 | 150 | 400 | 120 | 300 |

### Row 1: Headers
```
claim_id | source_id | pointer | confidence | notes
```

### Data Validation

**Column A (claim_id):**
- Data validation: List from range `Claims!A:A`
- Error message: "Must exist in Claims sheet"

**Column B (source_id):**
- Data validation: List from range `Sources!A:A`
- Error message: "Must exist in Sources sheet"

**Column D (confidence):**
- Data validation: List of items
- Values: `High, Medium, Low`

---

## Sheet 7: Entities

**Purpose:** Organizations, people, places.

### Column Setup

| Column | A | B | C | D | E |
|--------|---|---|---|---|---|
| Header | entity_id | entity_type | name | description | tags | notes |
| Width | 150 | 150 | 300 | 400 | 200 | 300 |

### Row 1: Headers
```
entity_id | entity_type | name | description | tags | notes
```

### Data Validation

**Column A (entity_id):**
- Custom formula: `=REGEXMATCH(A2,"^ENT-[A-Z0-9-]+$")`
- Error message: "Must match format ENT-CODE"

**Column B (entity_type):**
- Data validation: List of items
- Values: `Organization, Person, Location, Project, Initiative, Other`

**Column E (tags):**
- Format: Comma-separated, no spaces after commas

### Sample Data

| entity_id | entity_type | name | description | tags | notes |
|-----------|-------------|------|-------------|------|-------|
| ENT-M4P | Organization | Moldova for Peace | Civic initiative for peacebuilding and humanitarian aid | peacebuilding,humanitarian | |
| ENT-DOPOMOHA | Organization | Dopomoha.md | Digital platform for assistance coordination | platform,digital,humanitarian | |
| ENT-CC151 | Project | Community Center 151 | Community center offering counseling and safe spaces | community,center,counseling | |

---

## Google Apps Script Export Function

Create a script to export all sheets to JSON format.

### Setup Steps

1. In Google Sheets: **Extensions → Apps Script**
2. Create new script file
3. Paste the export function (see below)
4. Save and authorize
5. Deploy as web app (Execute as: Me, Who has access: Anyone)

### Export Script Template

```javascript
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const data = {
    meta: {
      project: "Moldova for Peace (M4P) Timeline",
      timezone: "Europe/Chisinau",
      date_format: "dd.mm.yyyy",
      generated_at: Utilities.formatDate(new Date(), "Europe/Chisinau", "dd.MM.yyyy"),
      version: "1.0"
    },
    phases: getSheetData(ss, "Phases"),
    events: getSheetData(ss, "Events"),
    sources: getSheetData(ss, "Sources"),
    event_source_map: getSheetData(ss, "Event_Source_Map"),
    claims: getSheetData(ss, "Claims"),
    claim_sources: getSheetData(ss, "Claim_Sources"),
    entities: getSheetData(ss, "Entities")
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows
    .filter(row => row[0]) // Skip empty rows
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        let value = row[i];
        
        // Handle empty cells
        if (value === "" || value === null) {
          obj[header] = "";
        }
        // Handle dates
        else if (header.includes("date") && value instanceof Date) {
          const day = String(value.getDate()).padStart(2, "0");
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const year = value.getFullYear();
          obj[header] = `${day}.${month}.${year}`;
        }
        // Handle tags (comma-separated to array)
        else if (header === "tags" && typeof value === "string") {
          obj[header] = value ? value.split(",").map(t => t.trim()) : [];
        }
        // Handle numbers
        else if (typeof value === "number") {
          obj[header] = value;
        }
        // Everything else as string
        else {
          obj[header] = String(value);
        }
      });
      return obj;
    });
}
```

### Alternative: Publish to Web

If you prefer not to use Apps Script:
1. **File → Share → Publish to web**
2. Select sheet tabs to publish
3. Format: CSV (then convert to JSON via external tool)
4. **Note:** This method is less ideal as it requires manual JSON conversion

---

## Best Practices

### Data Entry
1. **Always use dropdowns** for validated fields (don't type manually)
2. **Check foreign keys** before entering (e.g., verify phase_id exists)
3. **Use consistent naming** for IDs (follow conventions)
4. **Fill required fields** before marking as "Verified"
5. **Add sources** for all verified events

### Maintenance
1. **Regular backups** of Google Sheets
2. **Version control** via Google Sheets version history
3. **Review validation queue** regularly (events with "Needs review")
4. **Update phases** as M4P evolves (add new phases, update narratives)
5. **Archive old data** if needed (create "Archive" sheets)

### Quality Assurance
1. **Test foreign key relationships** (no orphaned records)
2. **Verify date formats** (all dates in dd.mm.yyyy)
3. **Check required fields** (no empty required cells)
4. **Validate JSON export** (test export script regularly)
5. **Review phase assignments** (ensure all events have valid phase_id)

---

## Quick Start Checklist

- [ ] Create Google Sheets workbook
- [ ] Create 7 sheets in correct order
- [ ] Set up column headers (Row 1)
- [ ] Configure data validation rules
- [ ] Add conditional formatting (optional)
- [ ] Enter sample data (Phases first, then Events)
- [ ] Test foreign key relationships
- [ ] Set up Apps Script export function
- [ ] Test JSON export
- [ ] Verify JSON structure matches schema
- [ ] Document any customizations

---

## Troubleshooting

**Problem:** Foreign key validation not working
- **Solution:** Ensure sheet names match exactly (case-sensitive)

**Problem:** Date format not working
- **Solution:** Set custom date format `dd.mm.yyyy` in Format → Number → Custom

**Problem:** Tags not exporting as array
- **Solution:** Check export script handles comma-separated → array conversion

**Problem:** Empty cells causing issues
- **Solution:** Export script should handle empty cells as empty strings or null

**Problem:** Apps Script permissions
- **Solution:** Authorize script with your Google account, deploy as web app with "Anyone" access
