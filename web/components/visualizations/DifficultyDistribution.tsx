'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskDifficulty, Model } from '@/types/normalized';

interface DifficultyDistributionProps {
  taskDifficulty: TaskDifficulty[];
  models: Model[];
}

const DIFFICULTY_ORDER = ['medium', 'hard', 'very_hard'] as const;
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  very_hard: 'Very Hard',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#d1fae5',
  medium: '#fef9c3',
  hard: '#fed7aa',
  very_hard: '#fecdd3',
};

export default function DifficultyDistribution({ taskDifficulty, models }: DifficultyDistributionProps) {
  // Group tasks by difficulty
  const tasksByDifficulty = DIFFICULTY_ORDER.map(difficulty => ({
    difficulty,
    tasks: taskDifficulty.filter(t => t.difficulty === difficulty),
  }));

  // Calculate per-model performance on each difficulty
  const modelPerformance = models
    .filter(m => m.has_trajectories)
    .filter(m => m.id !== 'narada') // Exclude Narada AI
    .map(model => {
      const byDifficulty = DIFFICULTY_ORDER.map(difficulty => {
        const tasks = tasksByDifficulty.find(d => d.difficulty === difficulty)?.tasks || [];
        const completed = tasks.filter(t => t.passing_models.includes(model.id)).length;
        const total = tasks.length;
        return {
          difficulty,
          completed,
          total,
          rate: total > 0 ? (completed / total) * 100 : 0,
        };
      });

      return {
        model,
        byDifficulty,
      };
    })
    .filter(({ byDifficulty }) => {
      // Exclude models with all zeros (no meaningful data)
      const totalCompleted = byDifficulty.reduce((sum, d) => sum + d.completed, 0);
      return totalCompleted > 0;
    })
    .sort((a, b) => {
      // Sort by overall completion rate
      const aTotal = a.byDifficulty.reduce((sum, d) => sum + d.completed, 0);
      const bTotal = b.byDifficulty.reduce((sum, d) => sum + d.completed, 0);
      return bTotal - aTotal;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Task Difficulty</CardTitle>
        <CardDescription>
          How models perform on easy vs. hard tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Difficulty breakdown header */}
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            <div>Model</div>
            {DIFFICULTY_ORDER.map(difficulty => (
              <div key={difficulty} className="text-center">
                {DIFFICULTY_LABELS[difficulty]}
                <div className="text-muted-foreground font-normal">
                  {tasksByDifficulty.find(d => d.difficulty === difficulty)?.tasks.length || 0} tasks
                </div>
              </div>
            ))}
          </div>

          {/* Model rows */}
          {modelPerformance.slice(0, 10).map(({ model, byDifficulty }) => (
            <div key={model.id} className="space-y-1">
              <div className="text-sm font-medium">{model.name}</div>
              <div className="grid grid-cols-4 gap-2">
                <div /> {/* Spacer for model name column */}
                {byDifficulty.map(({ difficulty, completed, total, rate }) => (
                  <div key={difficulty} className="space-y-1">
                    <div className="h-6 bg-muted rounded overflow-hidden relative group">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${rate}%`,
                          backgroundColor: DIFFICULTY_COLORS[difficulty],
                        }}
                      />

                      {/* Tooltip */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium pointer-events-none">
                        <span className={rate > 30 ? 'text-gray-800 dark:text-gray-900' : 'text-foreground'}>
                          {rate > 15 ? `${rate.toFixed(0)}%` : ''}
                        </span>
                      </div>

                      {/* Hover info */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border">
                        {completed}/{total} ({rate.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {completed}/{total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="text-sm font-semibold">Task Distribution:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tasksByDifficulty.map(({ difficulty, tasks }) => (
              <div key={difficulty} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: DIFFICULTY_COLORS[difficulty] }}
                />
                <div className="text-sm">
                  <span className="font-medium">{DIFFICULTY_LABELS[difficulty]}:</span>{' '}
                  <span className="text-muted-foreground">{tasks.length} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
