import LeaderboardWithTabs from '@/components/LeaderboardWithTabs';
import { LeaderboardEntry } from '@/types/normalized';
import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

async function getLeaderboardData() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  // Load official leaderboard for Overall tab (all 43 models)
  const officialLeaderboard = await fs.readFile(path.join(process.cwd(), '..', 'data', 'leaderboard.json'), 'utf8');
  const officialData = JSON.parse(officialLeaderboard);

  // Load normalized leaderboard for domain tabs (only models with trajectory data)
  const normalizedLeaderboard = await fs.readFile(path.join(dataDir, 'leaderboard.json'), 'utf8');
  const normalizedEntries: LeaderboardEntry[] = JSON.parse(normalizedLeaderboard);

  return {
    officialEntries: officialData.leaderboard,
    normalizedEntries
  };
}

export default async function Home() {
  const { officialEntries, normalizedEntries } = await getLeaderboardData();
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-4xl font-bold tracking-tight">
              WebArena Leaderboard
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-base max-w-3xl">
            Performance tracking for autonomous agents on WebArena — a realistic benchmark
            environment testing complex web navigation and task completion capabilities.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex gap-4 text-sm flex-wrap">
              <a
                href="https://webarena.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Official Site
              </a>
              <a
                href="https://github.com/web-arena-x/webarena"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                GitHub
              </a>
              <a
                href="https://arxiv.org/abs/2307.13854"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Paper
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <Link
                href="/heatmap"
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 font-medium"
              >
                Visualizations →
              </Link>
              <Link
                href="/tasks"
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 font-medium"
              >
                Browse Tasks →
              </Link>
            </div>
          </div>
        </div>

        {/* Leaderboard with Tabs */}
        <div className="mb-8">
          <LeaderboardWithTabs
            officialEntries={officialEntries}
            normalizedEntries={normalizedEntries}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Data extracted from official{' '}
            <a
              href="https://github.com/web-arena-x/webarena"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              WebArena trajectory files
            </a>
            . Performance metrics computed from actual agent runs.
          </p>
          <p className="mt-2">
            Open source on{' '}
            <a
              href="https://github.com/yourusername/webarena-benchmark"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
