import TaskViewer from '@/components/TaskViewer';
import { Task, Result, Model, TaskDifficulty } from '@/types/normalized';
import { promises as fs } from 'fs';
import path from 'path';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getData() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const [tasks, results, models, taskDifficulty] = await Promise.all([
    fs.readFile(path.join(dataDir, 'tasks.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'results.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'models.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(dataDir, 'task_difficulty.json'), 'utf8').then(JSON.parse),
  ]);

  return {
    tasks: tasks as Task[],
    results: results as Result[],
    models: models as Model[],
    taskDifficulty: taskDifficulty as TaskDifficulty[],
  };
}

export default async function TasksPage() {
  const { tasks, results, models, taskDifficulty } = await getData();

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
                Task Browser
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Browse and filter through all {tasks.length} WebArena benchmark tasks.
            View task details, difficulty ratings, and model performance on each task.
          </p>
        </div>

        {/* Task Viewer */}
        <TaskViewer
          tasks={tasks}
          results={results}
          models={models}
          taskDifficulty={taskDifficulty}
        />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Task difficulty is calculated based on model success rates across all evaluated models.
            Green checkmarks indicate success, red X marks indicate failure.
          </p>
        </div>
      </div>
    </main>
  );
}
