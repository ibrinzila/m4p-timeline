# Quick Start: GitHub + Cloudflare Auto-Deployment

## Run These Commands (in order):

```bash
# 1. Navigate to project
cd "/Users/user/Documents/clean-dopomoha/M4P Timeline"

# 2. Initialize git (if not already)
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: M4P Timeline Dashboard"

# 5. Create GitHub repo and push (using GitHub CLI)
gh repo create m4p-timeline --public --source=. --remote=origin --push
```

**If you don't have GitHub CLI**, create the repo manually at https://github.com/new, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/m4p-timeline.git
git branch -M main
git push -u origin main
```

## Connect Cloudflare Pages to GitHub:

1. Go to: https://dash.cloudflare.com → **Workers & Pages** → **Pages**
2. Click **"Create a project"** → **"Connect to Git"**
3. Select **GitHub** → Authorize → Select `m4p-timeline` repo
4. **Build settings**:
   - Production branch: `main`
   - Build command: (leave empty)
   - Build output: (leave empty)
5. Click **"Save and Deploy"**

## Done! 

Now every `git push` to `main` will automatically deploy to Cloudflare Pages.

**Test it:**
```bash
echo "# Auto-deployment test" >> README.md
git add README.md
git commit -m "Test auto-deployment"
git push
# Check Cloudflare Dashboard - new deployment should start automatically!
```
