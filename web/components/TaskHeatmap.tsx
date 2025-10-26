'use client';

import { useState, useMemo } from 'react';
import { HeatmapData, Model, TaskDifficulty } from '@/types/normalized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskHeatmapProps {
  heatmapData: HeatmapData;
  models: Model[];
  taskDifficulty: TaskDifficulty[];
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard' | 'very_hard';

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 dark:bg-green-950',
  medium: 'bg-yellow-100 dark:bg-yellow-950',
  hard: 'bg-orange-100 dark:bg-orange-950',
  very_hard: 'bg-red-100 dark:bg-red-950',
};

export default function TaskHeatmap({ heatmapData, models, taskDifficulty }: TaskHeatmapProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [hoveredCell, setHoveredCell] = useState<{ task: number; model: string } | null>(null);

  // Filter tasks by difficulty
  const filteredTaskIds = useMemo(() => {
    if (difficultyFilter === 'all') return heatmapData.task_ids;

    return heatmapData.task_ids.filter(taskId => {
      const difficulty = taskDifficulty.find(t => t.id === taskId);
      return difficulty?.difficulty === difficultyFilter;
    });
  }, [difficultyFilter, heatmapData.task_ids, taskDifficulty]);

  const stats = useMemo(() => {
    let totalCells = 0;
    let successCells = 0;
    let failCells = 0;

    filteredTaskIds.forEach(taskId => {
      const taskIndex = heatmapData.task_ids.indexOf(taskId);
      if (taskIndex !== -1) {
        heatmapData.model_ids.forEach((_, modelIndex) => {
          const value = heatmapData.matrix[taskIndex][modelIndex];
          if (value !== null) {
            totalCells++;
            if (value === 1) successCells++;
            else failCells++;
          }
        });
      }
    });

    return {
      total: totalCells,
      success: successCells,
      fail: failCells,
      rate: totalCells > 0 ? ((successCells / totalCells) * 100).toFixed(1) : '0',
    };
  }, [filteredTaskIds, heatmapData]);

  // Get model info
  const getModel = (modelId: string) => {
    return models.find(m => m.id === modelId);
  };

  // Get task info
  const getTask = (taskId: number) => {
    return taskDifficulty.find(t => t.id === taskId);
  };

  // Cell size (responsive)
  const cellSize = 8;
  const gap = 1;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold">Task Performance Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTaskIds.length} tasks × {heatmapData.model_ids.length} models
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="very_hard">Very Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Matrix</CardTitle>
          <CardDescription>
            Green = Success, Red = Failure, Gray = No Data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Model headers */}
            <div className="mb-4 flex gap-4">
              <div className="w-16 flex-shrink-0" /> {/* Spacer for task IDs */}
              <div className="flex gap-2">
                {heatmapData.model_ids.map(modelId => {
                  const model = getModel(modelId);
                  return (
                    <div
                      key={modelId}
                      className="flex-shrink-0"
                      style={{ width: `${cellSize}px` }}
                    >
                      <div
                        className="text-[10px] font-medium text-muted-foreground transform -rotate-45 origin-bottom-left whitespace-nowrap"
                        style={{ width: '100px' }}
                      >
                        {model?.name || modelId}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heatmap grid */}
            <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
              {filteredTaskIds.map(taskId => {
                const taskIndex = heatmapData.task_ids.indexOf(taskId);
                const task = getTask(taskId);

                if (taskIndex === -1) return null;

                return (
                  <div key={taskId} className="flex gap-4 items-center group">
                    {/* Task ID */}
                    <div className="w-16 flex-shrink-0 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${task ? DIFFICULTY_COLORS[task.difficulty] : ''}`}
                      >
                        #{taskId}
                      </Badge>
                    </div>

                    {/* Cells */}
                    <div className="flex gap-0.5">
                      {heatmapData.model_ids.map((modelId, modelIndex) => {
                        const value = heatmapData.matrix[taskIndex][modelIndex];
                        const isHovered = hoveredCell?.task === taskId && hoveredCell?.model === modelId;

                        let bgColor = 'bg-gray-200 dark:bg-gray-800'; // No data
                        if (value === 1) bgColor = 'bg-green-500 dark:bg-green-600';
                        else if (value === 0) bgColor = 'bg-red-500 dark:bg-red-600';

                        return (
                          <div
                            key={`${taskId}-${modelId}`}
                            className={`
                              ${bgColor}
                              ${isHovered ? 'ring-2 ring-primary scale-125 z-10' : ''}
                              transition-all duration-200 cursor-pointer
                            `}
                            style={{
                              width: `${cellSize}px`,
                              height: `${cellSize}px`,
                            }}
                            onMouseEnter={() => setHoveredCell({ task: taskId, model: modelId })}
                            onMouseLeave={() => setHoveredCell(null)}
                            title={`Task ${taskId} - ${getModel(modelId)?.name}: ${
                              value === 1 ? 'Success' : value === 0 ? 'Fail' : 'No data'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Task stats on hover */}
                    {task && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {task.success_count}/{heatmapData.model_ids.length} pass
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded" />
              <span>Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded" />
              <span>Failure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              <span>No Data</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover details */}
      {hoveredCell && (
        <Card className="bg-primary/5 border-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Task #{hoveredCell.task}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Model: {getModel(hoveredCell.model)?.name}
                </p>
              </div>
              <div className="text-right">
                {(() => {
                  const taskIndex = heatmapData.task_ids.indexOf(hoveredCell.task);
                  const modelIndex = heatmapData.model_ids.indexOf(hoveredCell.model);
                  const value = heatmapData.matrix[taskIndex][modelIndex];
                  return (
                    <Badge variant={value === 1 ? 'default' : 'destructive'}>
                      {value === 1 ? 'Success' : value === 0 ? 'Failed' : 'No Data'}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
