import { SimpleLeaderboard } from '@/components/SimpleLeaderboard';
import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const rootDataDir = path.join(process.cwd(), '..', 'data');
  const visualWebArena = await fs.readFile(path.join(rootDataDir, 'visualwebarena_leaderboard.json'), 'utf8');
  const visualData = JSON.parse(visualWebArena);
  return visualData;
}

export default async function VisualWebArenaPage() {
  const visualWebArena = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white dark:from-amber-950/10 dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            VisualWebArena
          </h1>
          <p className="text-muted-foreground text-base max-w-3xl">
            Evaluating multimodal agents on realistic visual web tasks.
            {visualWebArena.total_tasks} tasks requiring visual reasoning across {visualWebArena.environments.join(', ')}.
          </p>
          <div className="mt-4 flex gap-4 text-sm flex-wrap">
            <a
              href="https://jykoh.com/vwa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Official Site
            </a>
            <a
              href="https://github.com/web-arena-x/visualwebarena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href="https://arxiv.org/abs/2401.13649"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Paper
            </a>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <SimpleLeaderboard entries={visualWebArena.leaderboard} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Data from the official VisualWebArena benchmark. Updated {visualWebArena.updated}.
          </p>
        </div>
      </div>
    </main>
  );
}
