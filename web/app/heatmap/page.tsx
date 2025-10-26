import TaskHeatmap from '@/components/TaskHeatmap';
import { HeatmapData, Model, TaskDifficulty } from '@/types/normalized';
import { promises as fs } from 'fs';
import path from 'path';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getData() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const [heatmapData, models, taskDifficulty] = await Promise.all([
    fs.readFile(path.join(dataDir, 'heatmap_data.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'models.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'task_difficulty.json'), 'utf8').then(JSON.parse),
  ]);

  return {
    heatmapData: heatmapData as HeatmapData,
    models: models as Model[],
    taskDifficulty: taskDifficulty as TaskDifficulty[],
  };
}

export default async function HeatmapPage() {
  const { heatmapData, models, taskDifficulty } = await getData();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Leaderboard
                </Button>
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">
                Performance Heatmap
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Visual representation of model performance across all {heatmapData.task_ids.length} benchmark tasks.
            Each cell shows whether a model succeeded (green) or failed (red) on a specific task.
          </p>
        </div>

        {/* Heatmap */}
        <TaskHeatmap
          heatmapData={heatmapData}
          models={models}
          taskDifficulty={taskDifficulty}
        />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Heatmap visualization of {heatmapData.task_ids.length} tasks across {heatmapData.model_ids.length} models.
            Filter by difficulty to focus on specific task categories.
          </p>
        </div>
      </div>
    </main>
  );
}
