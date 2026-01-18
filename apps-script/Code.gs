/**
 * M4P Timeline - Google Apps Script Data Export
 * 
 * This script exports all sheets from the Google Spreadsheet to JSON format
 * for use by the M4P Timeline dashboard.
 * 
 * Setup:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Save and authorize
 * 5. Deploy as web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL and add it to config.json
 */

function doGet() {
  try {
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
    
    // Sort phases by order
    if (data.phases && data.phases.length > 0) {
      data.phases.sort((a, b) => {
        const orderA = parseInt(a.order) || 0;
        const orderB = parseInt(b.order) || 0;
        return orderA - orderB;
      });
    }
    
    // Sort events by date_start
    if (data.events && data.events.length > 0) {
      data.events.sort((a, b) => {
        const dateA = parseDMY(a.date_start);
        const dateB = parseDMY(b.date_start);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA - dateB;
      });
    }
    
    const output = ContentService.createTextOutput(JSON.stringify(data, null, 2));
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Add CORS headers for web access
    return output;
  } catch (error) {
    // Return error as JSON
    const errorOutput = ContentService.createTextOutput(JSON.stringify({
      error: true,
      message: error.toString(),
      stack: error.stack
    }, null, 2));
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

/**
 * Get data from a specific sheet and convert to array of objects
 */
function getSheetData(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      console.warn(`Sheet "${sheetName}" not found, returning empty array`);
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      // Only headers or empty sheet
      return [];
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows
      .filter(row => row[0]) // Skip empty rows (check first column)
      .map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          let value = row[i];
          
          // Handle empty cells
          if (value === "" || value === null || value === undefined) {
            obj[header] = "";
          }
          // Handle dates - check for date-related headers
          else if ((header.includes("date") || header.includes("period_start") || header.includes("period_end")) && value instanceof Date) {
            const day = String(value.getDate()).padStart(2, "0");
            const month = String(value.getMonth() + 1).padStart(2, "0");
            const year = value.getFullYear();
            obj[header] = `${day}.${month}.${year}`;
          }
          // Handle dates that might be stored as strings in dd.mm.yyyy format already
          else if ((header.includes("date") || header.includes("period_start") || header.includes("period_end")) && typeof value === "string" && value.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
            // Already in correct format, keep as is
            obj[header] = value;
          }
          // Handle tags (comma-separated to array)
          else if (header === "tags" && typeof value === "string") {
            obj[header] = value ? value.split(",").map(t => t.trim()).filter(t => t) : [];
          }
          // Handle numbers
          else if (typeof value === "number") {
            obj[header] = value;
          }
          // Handle booleans
          else if (typeof value === "boolean") {
            obj[header] = value;
          }
          // Everything else as string
          else {
            obj[header] = String(value);
          }
        });
        return obj;
      });
  } catch (error) {
    console.error(`Error reading sheet "${sheetName}":`, error);
    return [];
  }
}

/**
 * Parse dd.mm.yyyy date string to Date object for sorting
 */
function parseDMY(dateString) {
  if (!dateString || typeof dateString !== "string") return null;
  const parts = dateString.split(".");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}
