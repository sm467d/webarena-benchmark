import TaskHeatmap from '@/components/TaskHeatmap';
import DomainBarChart from '@/components/visualizations/DomainBarChart';
import CompactMatrix from '@/components/visualizations/CompactMatrix';
import DifficultyDistribution from '@/components/visualizations/DifficultyDistribution';
import ScatterPlot from '@/components/visualizations/ScatterPlot';
import RadarChart from '@/components/visualizations/RadarChart';
import { HeatmapData, Model, TaskDifficulty, LeaderboardEntry } from '@/types/normalized';
import { promises as fs } from 'fs';
import path from 'path';

async function getData() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const [heatmapData, models, taskDifficulty, leaderboard] = await Promise.all([
    fs.readFile(path.join(dataDir, 'heatmap_data.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'models.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'task_difficulty.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'leaderboard.json'), 'utf8').then(JSON.parse),
  ]);

  return {
    heatmapData: heatmapData as HeatmapData,
    models: models as Model[],
    taskDifficulty: taskDifficulty as TaskDifficulty[],
    leaderboard: leaderboard as LeaderboardEntry[],
  };
}

export default async function HeatmapPage() {
  const { heatmapData, models, taskDifficulty, leaderboard } = await getData();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Performance Visualizations
          </h1>
          <p className="text-muted-foreground text-base max-w-3xl">
            Interactive visualizations showing model performance across domains, difficulty levels, and individual tasks.
          </p>
        </div>

        {/* Visualizations */}
        <div className="space-y-8">
          {/* Radar Chart */}
          <RadarChart entries={leaderboard} />

          {/* Compact Matrix */}
          <CompactMatrix entries={leaderboard} />

          {/* Difficulty Distribution */}
          <DifficultyDistribution
            taskDifficulty={taskDifficulty}
            models={models}
          />

          {/* Scatter Plot */}
          <ScatterPlot
            taskDifficulty={taskDifficulty}
            entries={leaderboard}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            All visualizations based on {heatmapData.task_ids.length} tasks across {heatmapData.model_ids.length} models with trajectory data.
          </p>
        </div>
      </div>
    </main>
  );
}
