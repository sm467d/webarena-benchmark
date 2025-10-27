import { SimpleLeaderboard } from '@/components/SimpleLeaderboard';
import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const rootDataDir = path.join(process.cwd(), '..', 'data');
  const econWebArena = await fs.readFile(path.join(rootDataDir, 'econwebarena_leaderboard.json'), 'utf8');
  const econData = JSON.parse(econWebArena);
  return econData;
}

export default async function EconWebArenaPage() {
  const econWebArena = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white dark:from-amber-950/10 dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            EconWebArena
          </h1>
          <p className="text-muted-foreground text-base max-w-3xl">
            Benchmarking autonomous agents on economic tasks in realistic web environments.
            {econWebArena.total_tasks} tasks from {econWebArena.websites} authoritative websites
            spanning macroeconomics, labor, finance, trade, and public policy.
          </p>
          <div className="mt-4 flex gap-4 text-sm flex-wrap">
            <a
              href="https://econwebarena.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Official Site
            </a>
            <a
              href="https://arxiv.org/abs/2506.08136"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Paper
            </a>
            <a
              href="https://huggingface.co/datasets/EconWebArena/EconWebArena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Dataset
            </a>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <SimpleLeaderboard entries={econWebArena.leaderboard} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Data from the official EconWebArena benchmark. Updated {econWebArena.updated}.
          </p>
        </div>
      </div>
    </main>
  );
}
