# WebArena Benchmark Deployment Guide

## ✅ Pre-Deployment Checklist

### Build Status
- [x] Production build passes (`npm run build`)
- [x] TypeScript compilation successful
- [x] All pages generate successfully (/, /heatmap, /tasks)

### Data Files
- [x] All JSON files generated in `web/public/data/`
  - models.json (1.7 KB)
  - tasks.json (202 KB)
  - results.json (439 KB)
  - leaderboard.json (7.5 KB)
  - task_difficulty.json (128 KB)
  - heatmap_data.json (104 KB)

### Configuration
- [x] Vercel config exists (`vercel.json`)
- [x] Build commands configured
- [x] Output directory set to `web/.next`

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Navigate to project root
cd /Users/morotioyeyemi/repos/webarena-benchmark

# Deploy
vercel

# Production deployment
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select your GitHub repo (or upload manually)
4. Vercel will auto-detect Next.js and use settings from `vercel.json`
5. Click "Deploy"

### Option 3: Deploy via GitHub Integration

1. Push code to GitHub
2. Connect repo to Vercel
3. Auto-deploys on every push to main

## 📝 Post-Deployment

### Custom Domain Setup
1. Add domain: `webarena-benchmark.com`
2. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Environment Variables
None required - all data is static

### Performance
- All pages are statically generated (SSG)
- No server-side rendering needed
- Fast load times expected

## 🧹 Optional: Clean Up Large Files

To reduce repo size from 19GB to ~650MB:

```bash
# Remove trajectory files (already processed)
rm -rf data/trajectories

# Or move to backup
mv data/trajectories ~/Desktop/webarena-trajectories-backup
```

**Note:** Trajectory files are not needed for deployment. All required data is in `web/public/data/`.

## 🔧 Troubleshooting

### Build Fails
```bash
cd web
npm install
npm run build
```

### Missing Data Files
```bash
python3 scripts/normalize_data.py
```

### TypeScript Errors
Check `web/types/normalized.ts` matches data structure

## 📊 Site Structure

- `/` - Main leaderboard with tabs (Overall, GitLab, Map, Reddit, Shopping, Admin, Wikipedia)
- `/heatmap` - Performance visualizations (Radar Chart, Matrix, Difficulty Distribution, Scatter Plot)
- `/tasks` - Task browser with search, filter, and sort

## 🎯 Ready to Deploy!

Your site is production-ready. No blockers found.
