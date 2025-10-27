'use client';

import { useState, useMemo } from 'react';
import { Task, Result, Model, TaskDifficulty } from '@/types/normalized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskViewerProps {
  tasks: Task[];
  results: Result[];
  models: Model[];
  taskDifficulty: TaskDifficulty[];
}

type SiteFilter = 'all' | 'gitlab' | 'map' | 'reddit' | 'shopping' | 'shopping_admin' | 'wikipedia';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard' | 'very_hard';

const SITE_LABELS: Record<string, string> = {
  all: 'All Sites',
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Shopping Admin',
  wikipedia: 'Wikipedia',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  all: 'All Difficulties',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  very_hard: 'Very Hard',
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  medium: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
  hard: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
  very_hard: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
};

export default function TaskViewer({ tasks, results, models, taskDifficulty }: TaskViewerProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.intent.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Site filter
      if (siteFilter !== 'all' && task.site !== siteFilter) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all') {
        const difficulty = taskDifficulty.find(t => t.id === task.id);
        if (difficulty?.difficulty !== difficultyFilter) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, siteFilter, difficultyFilter, taskDifficulty]);

  // Get results for selected task
  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedTaskResults = useMemo(() => {
    if (!selectedTaskId) return [];
    return results.filter(r => r.t === selectedTaskId);
  }, [selectedTaskId, results]);

  const selectedTaskDifficulty = taskDifficulty.find(t => t.id === selectedTaskId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Task List */}
      <div className="space-y-4 lg:h-screen lg:sticky lg:top-4">
        <Card>
          <CardHeader>
            <CardDescription>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select value={siteFilter} onValueChange={(v) => setSiteFilter(v as SiteFilter)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SITE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredTasks.map(task => {
                const difficulty = taskDifficulty.find(t => t.id === task.id);
                const isSelected = selectedTaskId === task.id;

                return (
                  <Card
                    key={task.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              #{task.id}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.site}
                            </Badge>
                            {difficulty && (
                              <Badge className={`text-xs ${DIFFICULTY_COLORS[difficulty.difficulty]}`}>
                                {difficulty.difficulty.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{task.intent}</p>
                        </div>
                        {difficulty && (
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {difficulty.success_count}/{models.length}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Details */}
      <div>
        {selectedTask ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Task #{selectedTask.id}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedTask.site} • {selectedTask.eval_type}
                  </CardDescription>
                </div>
                {selectedTaskDifficulty && (
                  <Badge className={DIFFICULTY_COLORS[selectedTaskDifficulty.difficulty]}>
                    {selectedTaskDifficulty.difficulty.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Intent */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Task Intent</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.intent}</p>
              </div>

              {/* Reference Answer */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Expected Answer</h4>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-md">
                  {selectedTask.reference_answer}
                </p>
              </div>

              {/* Stats */}
              {selectedTaskDifficulty && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {selectedTaskDifficulty.success_rate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Models Passed</p>
                    <p className="text-2xl font-bold">
                      {selectedTaskDifficulty.success_count}/{models.length}
                    </p>
                  </div>
                </div>
              )}

              {/* Model Results */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Model Performance</h4>
                <div className="space-y-2">
                  {selectedTaskResults.length > 0 ? (
                    models.map(model => {
                      const result = selectedTaskResults.find(r => r.m === model.id);
                      const success = result?.s === 1;
                      const hasData = result !== undefined;

                      return (
                        <div
                          key={model.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            {hasData ? (
                              success ? (
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                              )
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{model.name}</p>
                              {!hasData && (
                                <p className="text-xs text-muted-foreground">No data</p>
                              )}
                            </div>
                          </div>
                          {model.has_trajectories && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Trajectory
                            </Button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No results available for this task
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Select a task from the list to view details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
