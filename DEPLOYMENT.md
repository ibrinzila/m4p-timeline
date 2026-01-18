# M4P Timeline - Production Deployment Guide

Complete step-by-step guide for deploying the M4P Timeline dashboard to production.

## Overview

This guide covers:
1. Google Apps Script setup and deployment
2. Configuration
3. Local testing
4. Cloudflare Pages deployment
5. Troubleshooting

## Prerequisites

- Google Sheet with data (see [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md))
- Google account with access to Google Sheets
- Cloudflare account (free tier is sufficient)
- Node.js installed (for Wrangler CLI)

## Phase 1: Google Apps Script Setup

### Step 1: Open Apps Script Editor

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. A new tab opens with the Apps Script editor

### Step 2: Paste the Code

1. Delete any existing code in the editor
2. Open `apps-script/Code.gs` from this repository
3. Copy the entire contents
4. Paste into the Apps Script editor
5. Click **Save** (or press Ctrl+S / Cmd+S)
6. Name the project: "M4P Timeline Export" (or any name you prefer)

### Step 3: Authorize the Script

1. Click **Run** (play button) or select `doGet` from the function dropdown and click Run
2. You'll be prompted to authorize the script
3. Click **Review Permissions**
4. Select your Google account
5. Click **Advanced → Go to [Project Name] (unsafe)**
6. Click **Allow**
7. The script will run (may show an error about "doGet" - this is normal, we'll deploy it next)

### Step 4: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure deployment:
   - **Description**: "M4P Timeline Data Export" (optional)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (important: must be "Anyone" for public access)
5. Click **Deploy**
6. Click **Authorize access** if prompted
7. **Copy the Web app URL** - this is your Apps Script endpoint
   - Format: `https://script.google.com/macros/s/AKfycby.../exec`
   - Save this URL - you'll need it for config.json

### Step 5: Test the Endpoint

1. Open the Web app URL in a new browser tab
2. You should see JSON data
3. Verify the structure includes:
   - `meta` object
   - `phases` array
   - `events` array
   - Other arrays (sources, claims, etc.)

**If you see an error:**
- Check Apps Script execution log (View → Execution log)
- Verify all 7 sheets exist with correct names
- Ensure sheet headers match the schema

## Phase 2: Configuration

### Step 1: Update config.json

1. Open `config.json` in this repository
2. Find the line: `"dataEndpoint": "YOUR_APPS_SCRIPT_URL_HERE"`
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with your Apps Script URL (from Phase 1, Step 4)
4. Save the file

**Example:**
```json
{
  "dataEndpoint": "https://script.google.com/macros/s/AKfycby123456/exec",
  "cacheEnabled": true,
  ...
}
```

### Step 2: Optional Configuration

You can customize these settings in `config.json`:

- `cacheEnabled`: Set to `false` to disable caching (default: `true`)
- `cacheMaxAge`: Cache expiration in milliseconds (default: `3600000` = 1 hour)
- `defaultSensitivity`: Default filter (default: `"Internal"`)
- `ui.projectName`: Customize project name
- `ui.timezone`: Timezone (default: `"Europe/Chisinau"`)
- `ui.dateFormat`: Date format (default: `"dd.mm.yyyy"`)

## Phase 3: Local Testing

### Step 3: Local Testing (Optional)

**Note:** The dashboard is designed for Cloudflare Pages deployment. The config is embedded in `index.html`, so it will work when opening the file directly, but for best results, deploy to Cloudflare Pages.

**Quick Test (Opening file directly):**
1. Open `index.html` in a web browser
2. The dashboard should load using the embedded config
3. Data will be fetched from your Apps Script endpoint
4. If Apps Script is not accessible, you'll see an error (this is expected until Apps Script is properly deployed)

**For Full Testing (Recommended):**
Deploy to Cloudflare Pages first (see Phase 4), then test the deployed URL. This ensures the same environment as production.

### Step 2: Test Features

- **Filters**: Test all filter dropdowns
- **Search**: Try searching for events
- **Event Details**: Click an event to see details drawer
- **Refresh Button**: Click refresh button (top right) to force update
- **Cache**: Close and reopen browser - should load instantly from cache

### Step 3: Test Error Scenarios

1. **Invalid URL**: Temporarily change `dataEndpoint` to invalid URL
   - Should show error message with retry button
2. **Offline**: Disconnect internet, refresh page
   - Should use cached data if available
   - Should show error if no cache

### Step 4: Verify Data

- Check that all phases appear
- Verify events are grouped correctly by quarter
- Confirm swimlanes show correct program areas
- Test that filters work correctly

## Phase 4: Cloudflare Pages Deployment

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

**Verify installation:**
```bash
wrangler --version
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authorize Wrangler with Cloudflare.

### Step 3: Deploy

Navigate to the project directory and deploy:

```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
wrangler pages deploy . --project-name=m4p-timeline
```

**First deployment:**
- Wrangler will ask you to create a new project
- Confirm the project name
- Wait for deployment to complete

**Subsequent deployments:**
- Simply run the same command
- Wrangler will update the existing project

### Step 4: Verify Deployment

1. Wrangler will provide a URL after deployment
   - Format: `https://m4p-timeline.pages.dev` (or similar)
2. Open the URL in a browser
3. Verify the dashboard loads correctly
4. Test all features

### Step 5: Set Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click **Custom domains**
3. Add your domain
4. Follow DNS setup instructions

## Phase 5: Ongoing Maintenance

### Updating Data

1. Edit data in Google Sheets
2. Changes are automatically reflected (no rebuild needed)
3. Users see updates on next page load or refresh

### Updating Code

1. Make changes to `index.html` or other files
2. Deploy again: `wrangler pages deploy . --project-name=m4p-timeline`
3. Changes go live immediately

### Monitoring

- Check Cloudflare Pages dashboard for deployment status
- Monitor Apps Script execution log for errors
- Check browser console for client-side errors

## Troubleshooting

### Apps Script Issues

**Problem:** "Script function not found"
- **Solution:** Ensure function is named `doGet` (case-sensitive)

**Problem:** "Access denied" when opening web app URL
- **Solution:** Verify deployment has "Who has access: Anyone"

**Problem:** JSON structure is incorrect
- **Solution:** Check sheet names match exactly (case-sensitive)
- **Solution:** Verify headers in first row of each sheet

**Problem:** Dates not formatting correctly
- **Solution:** Ensure dates in Sheets are actual date values, not text
- **Solution:** Check Apps Script date formatting code

### Configuration Issues

**Problem:** Dashboard shows "Unable to connect to data source"
- **Solution:** Verify `config.json` has correct Apps Script URL
- **Solution:** Test Apps Script URL directly in browser
- **Solution:** Check URL doesn't have extra spaces or characters

**Problem:** Cache not working
- **Solution:** Check browser allows localStorage
- **Solution:** Verify `cacheEnabled: true` in config.json
- **Solution:** Clear browser cache and try again

### Deployment Issues

**Problem:** Wrangler login fails
- **Solution:** Ensure you have Cloudflare account
- **Solution:** Try `wrangler logout` then `wrangler login` again

**Problem:** Deployment fails
- **Solution:** Check you're in the correct directory
- **Solution:** Verify all files are present
- **Solution:** Check Cloudflare dashboard for error messages

**Problem:** Site loads but data doesn't appear
- **Solution:** Check browser console for CORS errors
- **Solution:** Verify Apps Script URL is accessible
- **Solution:** Test Apps Script URL directly

### Data Issues

**Problem:** Missing phases or events
- **Solution:** Check Google Sheets has data in all sheets
- **Solution:** Verify sheet names match exactly: "Phases", "Events", etc.
- **Solution:** Check Apps Script execution log for errors

**Problem:** Events not grouped correctly
- **Solution:** Verify `phase_id` column exists in Events sheet
- **Solution:** Check `phase_id` values match `phase_id` in Phases sheet
- **Solution:** Ensure dates are in correct format (dd.mm.yyyy)

## Best Practices

### Google Sheets

1. **Backup regularly**: Use Google Sheets version history
2. **Validate data**: Use data validation rules (see GOOGLE_SHEETS_TEMPLATE.md)
3. **Test changes**: Test Apps Script after major data changes
4. **Document changes**: Use sheet notes for important updates

### Apps Script

1. **Version control**: Keep a copy of Code.gs in repository
2. **Test before deploy**: Test script in editor before deploying
3. **Monitor logs**: Check execution log regularly
4. **Update carefully**: Test updates in a copy before updating production

### Dashboard

1. **Test locally first**: Always test changes locally before deploying
2. **Monitor errors**: Check browser console for errors
3. **User feedback**: Monitor user reports of issues
4. **Regular updates**: Keep dependencies and code updated

## Security Considerations

### Apps Script

- Deploy as "Anyone" access is safe for read-only public data
- No authentication needed for public timeline
- Rate limiting handled automatically by Google

### Config.json

- No sensitive data stored
- Apps Script URL is public (safe to commit to git)
- Local overrides in `.gitignore` (not committed)

### Caching

- localStorage is client-side only
- No sensitive data cached
- Users can clear cache via browser settings

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for data structure
3. Check [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md) for Sheets setup
4. Review browser console for error messages

## Next Steps

After successful deployment:

1. Share the dashboard URL with your team
2. Set up monitoring (optional)
3. Document any customizations
4. Plan regular data updates
5. Consider adding analytics (optional)
