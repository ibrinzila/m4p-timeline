# Quick Deployment Guide - Cloudflare Pages

## Prerequisites Check

1. **Node.js installed**: Run `node --version` (should show v16+)
2. **Cloudflare account**: Sign up at https://dash.cloudflare.com/sign-up (free)

## Step 1: Install Wrangler CLI

Open Terminal and run:

```bash
npm install -g wrangler
```

If you get permission errors, try:
```bash
sudo npm install -g wrangler
```

Or install locally in the project:
```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
npm install wrangler
```

Then use: `npx wrangler` instead of `wrangler`

## Step 2: Login to Cloudflare

```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
wrangler login
```

This will:
- Open your browser
- Ask you to authorize Wrangler with Cloudflare
- Complete the authentication

## Step 3: Verify Configuration

Your `config.json` already has the Apps Script URL configured:
- ✅ `dataEndpoint`: Set to your Apps Script URL
- ✅ All other settings are configured

## Step 4: Deploy

Run the deployment command:

```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
wrangler pages deploy . --project-name=m4p-timeline
```

**First time deployment:**
- Wrangler will ask: "Create a new project?"
- Type: `y` and press Enter
- Confirm project name: `m4p-timeline` (or press Enter for default)

**Wait for deployment** (usually 1-2 minutes)

## Step 5: Get Your URL

After deployment completes, Wrangler will show:
```
✨ Deployment complete! Take a sneak peek at your worker:
https://m4p-timeline-xxxxx.pages.dev
```

**Copy this URL** - this is your live dashboard!

## Step 6: Test Your Deployment

1. Open the URL in your browser
2. Verify:
   - ✅ Dashboard loads
   - ✅ Data loads from Google Sheets (via Apps Script)
   - ✅ Filters work
   - ✅ Timeline displays events
   - ✅ Evidence View works
   - ✅ Event details drawer works

## Troubleshooting

### If wrangler command not found:
```bash
# Check if installed
which wrangler

# If not found, install again
npm install -g wrangler

# Or use npx
npx wrangler pages deploy . --project-name=m4p-timeline
```

### If login fails:
- Make sure you have a Cloudflare account
- Try: `wrangler logout` then `wrangler login` again

### If deployment fails:
- Check you're in the correct directory
- Verify all files are present (especially `index.html`, `config.json`)
- Check Cloudflare dashboard for error messages

### If dashboard loads but no data:
- Verify Apps Script URL in `config.json` is correct
- Test Apps Script URL directly in browser (should return JSON)
- Check browser console for errors (F12)

## Future Updates

To update the dashboard after making changes:

```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
wrangler pages deploy . --project-name=m4p-timeline
```

Changes go live immediately!

## Optional: Custom Domain

1. Go to Cloudflare Dashboard → Pages → `m4p-timeline`
2. Click "Custom domains"
3. Add your domain
4. Follow DNS setup instructions

---

## Quick Reference Commands

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy . --project-name=m4p-timeline

# Check status
wrangler pages project list
```

---

**Ready to deploy?** Run the commands above in your terminal!
