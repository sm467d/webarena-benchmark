# WebArena Benchmark Leaderboard

A free, open-source website to visualize [WebArena](https://webarena.dev/) benchmark results. Automatically updates daily from the official Google Sheets leaderboard.

## Features

- 📊 **Live Leaderboard**: Displays the latest WebArena benchmark results
- 🔄 **Auto-Updates**: GitHub Actions fetches data daily from Google Sheets
- 📈 **Performance Metrics**: View success rates, model sizes, and open-source status
- 🎨 **Clean UI**: Built with Next.js and Tailwind CSS
- 💰 **100% Free Hosting**: Deploy on Vercel for free

## Architecture

### Data Pipeline

1. **Daily Update Job** (GitHub Actions)
   - Runs every day at 00:00 UTC
   - Fetches data from [official Google Sheet](https://docs.google.com/spreadsheets/d/1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ/edit)
   - Converts CSV to JSON
   - Commits updated data to repository

2. **Storage**
   - Data stored as JSON in `/data/leaderboard.json`
   - Copied to `/web/public/data/` for Next.js access
   - Version controlled via Git

3. **Website**
   - Next.js 15 with App Router
   - TypeScript for type safety
   - Tailwind CSS for styling
   - Static generation for fast loading

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+ (for data fetching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/webarena-benchmark.git
cd webarena-benchmark
```

2. Install web dependencies:
```bash
cd web
npm install
```

3. Install Python dependencies:
```bash
pip install pandas
```

### Development

1. Fetch the latest data:
```bash
python scripts/fetch_leaderboard.py
```

2. Start the development server:
```bash
cd web
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and configure the build
5. Deploy!

The GitHub Action will automatically update the data daily, and Vercel will rebuild the site with the latest data.

### Manual Data Update

To manually trigger a data update:

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Update Leaderboard Data"
4. Click "Run workflow"

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── update-leaderboard.yml  # Daily data fetch job
├── data/
│   └── leaderboard.json           # Latest benchmark data
├── scripts/
│   └── fetch_leaderboard.py       # Data fetching script
└── web/                           # Next.js application
    ├── app/
    │   ├── layout.tsx            # Root layout
    │   └── page.tsx              # Home page
    ├── components/
    │   └── LeaderboardTable.tsx  # Main table component
    ├── types/
    │   └── leaderboard.ts        # TypeScript types
    └── public/
        └── data/
            └── leaderboard.json  # Data for the website
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Data Source

Data is sourced from the official WebArena leaderboard:
- Google Sheet: https://docs.google.com/spreadsheets/d/1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ/edit
- Official Site: https://webarena.dev/
- Paper: https://arxiv.org/abs/2307.13854

## License

Apache 2.0 License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- WebArena team for creating the benchmark
- All researchers who have submitted their results