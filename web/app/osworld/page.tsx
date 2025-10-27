import { SimpleLeaderboard } from '@/components/SimpleLeaderboard';
import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const rootDataDir = path.join(process.cwd(), '..', 'data');
  const osWorld = await fs.readFile(path.join(rootDataDir, 'osworld_leaderboard.json'), 'utf8');
  const osData = JSON.parse(osWorld);
  return osData;
}

export default async function OSWorldPage() {
  const osWorld = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white dark:from-amber-950/10 dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            OSWorld-Verified
          </h1>
          <p className="text-muted-foreground text-base max-w-3xl">
            Benchmarking multimodal agents for open-ended tasks in real computer environments.
            {osWorld.total_tasks} tasks across {osWorld.environments.join(', ')} operating systems
            and applications like {osWorld.applications.slice(0, 3).join(', ')}.
          </p>
          <div className="mt-4 flex gap-4 text-sm flex-wrap">
            <a
              href="https://os-world.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Official Site
            </a>
            <a
              href="https://github.com/xlang-ai/OSWorld"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href="https://xlang.ai/blog/osworld-verified"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Blog
            </a>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <SimpleLeaderboard entries={osWorld.leaderboard} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Data from the official OSWorld-Verified benchmark. Updated {osWorld.updated}.
          </p>
        </div>
      </div>
    </main>
  );
}
