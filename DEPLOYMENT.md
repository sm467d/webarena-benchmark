# Deployment Guide

## Deploying to Vercel (Recommended - Free)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit: WebArena benchmark site"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `webarena-benchmark` repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Click "Deploy"

### Step 3: Verify Automatic Updates

The GitHub Action is already configured to:
- Run daily at 00:00 UTC
- Fetch latest data from Google Sheets
- Commit updates to the repository
- Trigger Vercel redeployment automatically

To test the automatic update:
1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Update Leaderboard Data"
4. Click "Run workflow" > "Run workflow"
5. Wait for it to complete
6. Vercel will automatically rebuild and deploy

## Alternative: Deploy to Netlify

### Step 1: Create netlify.toml

Create a file at the root: `netlify.toml`

```toml
[build]
  base = "web"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Netlify will auto-detect the configuration
5. Click "Deploy site"

## Deployment Costs

Both Vercel and Netlify offer generous free tiers:

### Vercel Free Tier
- ✅ Unlimited personal projects
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Automatic deployments on git push
- ✅ Perfect for this project

### Netlify Free Tier
- ✅ 300 build minutes/month
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Automatic deployments on git push
- ✅ Perfect for this project

**Recommendation**: Either platform works great. Vercel has slightly better Next.js integration since they created Next.js.

## Custom Domain (Optional)

### On Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### On Netlify:
1. Go to your site settings
2. Click "Domain management"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

### Check if data is updating:
1. Visit your deployed site
2. Look at "Last updated" date at the top of the leaderboard
3. Should update daily

### Troubleshooting GitHub Actions:
1. Go to your GitHub repository
2. Click "Actions" tab
3. Check the status of recent runs
4. Click on a run to see detailed logs

### Common Issues:

**Problem**: GitHub Action fails
- **Solution**: Check that the Google Sheet is publicly accessible
- **Solution**: Verify the sheet ID in `scripts/fetch_leaderboard.py` is correct

**Problem**: Site doesn't update after Action runs
- **Solution**: Check that Vercel is connected to your GitHub repo
- **Solution**: Verify that Vercel has "Auto Deploy" enabled for your main branch

**Problem**: Build fails on Vercel
- **Solution**: Make sure `web/public/data/leaderboard.json` exists in your repo
- **Solution**: Run `python scripts/fetch_leaderboard.py` locally and commit the data

## Need Help?

Open an issue on GitHub or check the main [README.md](README.md) for more information.
