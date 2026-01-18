# GitHub Repository Setup with Cloudflare Pages Auto-Deployment

## Step 1: Initialize Git Repository (if not already done)

```bash
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
git init
```

## Step 2: Add and Commit Files

```bash
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status

# Create initial commit
git commit -m "Initial commit: M4P Timeline Dashboard with Evidence View and enhanced features"
```

## Step 3: Create GitHub Repository

**Option A: Using GitHub CLI (recommended)**

```bash
# Make sure you're logged in to GitHub CLI
gh auth login

# Create repository (private or public)
gh repo create m4p-timeline --public --source=. --remote=origin --push
```

**Option B: Manual Creation**

1. Go to https://github.com/new
2. Repository name: `m4p-timeline`
3. Description: "Moldova for Peace Timeline Dashboard"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

Then connect and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/m4p-timeline.git
git branch -M main
git push -u origin main
```

## Step 4: Connect Cloudflare Pages to GitHub

### Via Cloudflare Dashboard:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: **Workers & Pages** → **Pages**

2. **Connect to Git**
   - Click **"Create a project"** or **"Connect to Git"**
   - Select **GitHub** as your Git provider
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `m4p-timeline`
   - Click **"Begin setup"**

3. **Configure Build Settings**
   - **Project name**: `m4p-timeline` (or keep default)
   - **Production branch**: `main`
   - **Build command**: Leave empty (static site, no build needed)
   - **Build output directory**: Leave empty or set to `/` (root)
   - **Root directory**: Leave empty (or `/` if needed)

4. **Environment Variables** (if needed)
   - Usually not needed for static sites
   - Click **"Save and Deploy"**

5. **Wait for Deployment**
   - First deployment will take 1-2 minutes
   - You'll get a URL like: `https://m4p-timeline.pages.dev`

## Step 5: Verify Auto-Deployment

1. **Make a test change**:
   ```bash
   # Edit a file (e.g., add a comment to README.md)
   echo "# Test auto-deployment" >> README.md
   git add README.md
   git commit -m "Test: Verify auto-deployment"
   git push
   ```

2. **Check Cloudflare Dashboard**:
   - Go to Pages → `m4p-timeline`
   - You should see a new deployment starting automatically
   - Wait for it to complete (usually 1-2 minutes)

3. **Verify the change is live**:
   - Visit your Pages URL
   - The change should appear after deployment completes

## Step 6: Configure Production Branch (Optional)

By default, Cloudflare Pages deploys:
- **Production**: `main` branch
- **Preview**: All other branches and pull requests

To change this:
1. Go to Pages → `m4p-timeline` → **Settings** → **Builds & deployments**
2. Configure branch settings as needed

## Troubleshooting

### If GitHub CLI not installed:
```bash
# Install GitHub CLI
brew install gh

# Or download from: https://cli.github.com/
```

### If push fails:
```bash
# Check remote URL
git remote -v

# Update remote if needed
git remote set-url origin https://github.com/YOUR_USERNAME/m4p-timeline.git
```

### If Cloudflare doesn't detect changes:
- Make sure you're pushing to the `main` branch
- Check Cloudflare Pages → Settings → Builds & deployments
- Verify the correct branch is set for production

### If deployment fails:
- Check Cloudflare Pages → Deployments → View logs
- Verify all required files are in the repository
- Check that `config.json` has the correct Apps Script URL

## Quick Reference Commands

```bash
# Initialize and commit
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push (using GitHub CLI)
gh repo create m4p-timeline --public --source=. --remote=origin --push

# Or manually connect
git remote add origin https://github.com/YOUR_USERNAME/m4p-timeline.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
# Cloudflare will auto-deploy!
```

## What Gets Deployed

Cloudflare Pages will automatically deploy:
- ✅ All files in the repository
- ✅ Respects `.gitignore` (excludes `data.json`, `.DS_Store`, etc.)
- ✅ `index.html` (main dashboard)
- ✅ `config.json` (with your Apps Script URL)
- ✅ All documentation files
- ✅ Alternative timeline views

## Security Notes

- `config.json` contains your Apps Script URL (safe to commit - it's public anyway)
- `data.json` is excluded via `.gitignore` (data comes from Google Sheets)
- No sensitive credentials in the repository

---

**Ready to set up?** Run the commands above in your terminal!
