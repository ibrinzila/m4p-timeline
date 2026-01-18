# M4P Timeline Dashboard

A production-ready timeline dashboard for Moldova for Peace (M4P) that displays events, sources, and claims from Google Sheets via Google Apps Script.

## Features

- **Combined Timeline View**: Phases + Vertical Timeline + Quarter Sections + Category Swimlanes
- **Real-time Data**: Fetches data from Google Sheets via Apps Script (no rebuilds needed)
- **Smart Caching**: localStorage caching with automatic background refresh
- **Filters**: Search, phase, event type, program area, status, and sensitivity filters
- **Event Details**: Click any event to see full details, linked sources, and claims
- **Validation Queue**: Lists all events marked "Needs review"
- **Metrics Toggle**: Show/hide claims (metrics/outcomes) for events
- **Manual Refresh**: Refresh button to force data update
- **Error Handling**: Robust error handling with user-friendly messages

## Architecture

The dashboard uses a three-tier architecture:

1. **Google Sheets** - Data source (7 sheets: Phases, Events, Sources, Event_Source_Map, Claims, Claim_Sources, Entities)
2. **Google Apps Script** - Web app endpoint that exports Sheets to JSON
3. **Static Dashboard** - Client-side application with caching

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## Quick Start (Production)

### Prerequisites

- Google Sheet with data (see [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md))
- Google Apps Script deployed as web app
- Cloudflare account (for hosting)

### Setup Steps

1. **Deploy Google Apps Script**
   - Open your Google Sheet
   - Go to Extensions → Apps Script
   - Paste code from `apps-script/Code.gs`
   - Deploy as web app (Anyone access)
   - Copy the web app URL

2. **Configure Dashboard**
   - Open `config.json`
   - Paste your Apps Script URL into `dataEndpoint`
   - Save the file

3. **Test Locally**
   - Open `index.html` in a web browser
   - Verify data loads correctly
   - Test refresh button
   - Check cache functionality

4. **Deploy to Cloudflare Pages**
   - Install Wrangler CLI: `npm install -g wrangler`
   - Login: `wrangler login`
   - Deploy: `wrangler pages deploy . --project-name=m4p-timeline`
   - Verify deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions.

## Configuration

Edit `config.json` to customize:

- `dataEndpoint`: Google Apps Script web app URL
- `cacheEnabled`: Enable/disable localStorage caching (default: true)
- `cacheMaxAge`: Cache expiration time in milliseconds (default: 3600000 = 1 hour)
- `defaultSensitivity`: Default sensitivity filter (default: "Internal")
- `ui`: UI customization (project name, timezone, date format)

## Data Structure

The dashboard expects JSON data with the following structure (see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete schema):

- `meta`: Metadata (project, timezone, date format, generated_at, version)
- `phases`: Array of phase objects (sorted by order)
- `events`: Array of event objects (sorted by date_start)
- `sources`: Array of source documents
- `event_source_map`: Links events to sources
- `claims`: Metrics and outcomes
- `claim_sources`: Links claims to sources
- `entities`: Organizations, people, places

## Date Format

All dates are displayed in `dd.mm.yyyy` format (European format).

## Caching

The dashboard uses localStorage to cache data:

- **Automatic caching**: Successful fetches are cached automatically
- **Background refresh**: Cached data is displayed instantly, then refreshed in background
- **Manual refresh**: Use the refresh button to force a fresh fetch
- **Cache expiration**: Configurable via `cacheMaxAge` in config.json (default: 1 hour)

## Error Handling

The dashboard includes robust error handling:

- **Network errors**: Shows user-friendly message with retry button
- **Invalid data**: Validates data structure and shows specific errors
- **Cache fallback**: Falls back to cached data if fetch fails
- **Timeout protection**: 30-second timeout prevents hanging requests

## Deployment

### Cloudflare Pages (Recommended)

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy: `wrangler pages deploy . --project-name=m4p-timeline`
4. Set custom domain (optional)

### Alternative Hosting

This is a static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload all files (except `data.json` which is served from Google Sheets).

## Development

### Local Development

**Important:** The dashboard requires HTTP/HTTPS to work (not file:// protocol). 

**For local testing, use a local server:**

```bash
# Python 3
python3 -m http.server 8000

# Or Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open: `http://localhost:8000/index.html`

**Note:** The dashboard is designed for Cloudflare Pages deployment. Local testing is optional - you can deploy directly to Cloudflare Pages without local testing.

### File Structure

```
M4P Timeline/
├── index.html              # Main dashboard
├── timeline-simple.html     # Alternative simple view
├── timeline-options.html    # Visualization options showcase
├── config.json             # Configuration (edit with your Apps Script URL)
├── data.json               # Local fallback (not in git)
├── apps-script/
│   └── Code.gs             # Google Apps Script export function
├── DATABASE_SCHEMA.md      # Complete database schema documentation
├── GOOGLE_SHEETS_TEMPLATE.md # Google Sheets setup guide
├── DEPLOYMENT.md           # Deployment instructions
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

## Troubleshooting

### Data Not Loading

1. Check `config.json` has valid Apps Script URL
2. Verify Apps Script is deployed as web app with "Anyone" access
3. Test Apps Script URL directly in browser (should return JSON)
4. Check browser console for errors
5. Try manual refresh button

### Cache Issues

1. Clear browser localStorage
2. Use refresh button to force fresh fetch
3. Check `cacheMaxAge` in config.json
4. Disable cache temporarily: set `cacheEnabled: false` in config.json

### Google Apps Script Errors

1. Check Apps Script execution log
2. Verify all 7 sheets exist with correct names
3. Ensure sheet headers match schema (see DATABASE_SCHEMA.md)
4. Check for empty required fields

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting tips.

## Documentation

- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)**: Complete database schema with field definitions
- **[GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md)**: Step-by-step Google Sheets setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Production deployment guide
- **[instruction.md](instruction.md)**: Original specification and requirements

## License

This project is part of Moldova for Peace (M4P) initiative.
