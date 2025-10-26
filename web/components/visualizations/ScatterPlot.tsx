'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskDifficulty, LeaderboardEntry } from '@/types/normalized';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScatterPlotProps {
  taskDifficulty: TaskDifficulty[];
  entries: LeaderboardEntry[];
}

const DIFFICULTY_SCORES: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  very_hard: 4,
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Very Hard',
};

type GroupBy = 'overall' | 'difficulty';

export default function ScatterPlot({ taskDifficulty, entries }: ScatterPlotProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('difficulty');

  // Filter entries with domain data
  const entriesWithData = entries.filter(e => e.domain_breakdown && Object.keys(e.domain_breakdown).length > 0);

  // Calculate average difficulty score for each model
  const modelData = entriesWithData.map(entry => {
    const modelTasks = taskDifficulty.filter(t => t.passing_models.includes(entry.id));
    const avgDifficulty = modelTasks.length > 0
      ? modelTasks.reduce((sum, t) => sum + DIFFICULTY_SCORES[t.difficulty], 0) / modelTasks.length
      : 0;

    return {
      name: entry.name,
      successRate: entry.success_rate,
      tasksCompleted: entry.successes,
      avgDifficulty,
    };
  });

  // Chart dimensions
  const width = 800;
  const height = 500;
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scales
  const maxSuccess = Math.max(...modelData.map(d => d.successRate));
  const maxTasks = Math.max(...modelData.map(d => d.tasksCompleted));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Model Performance Scatter Plot</CardTitle>
            <CardDescription>
              Visualize relationship between success rate, task completion, and difficulty
            </CardDescription>
          </div>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">By Task Count</SelectItem>
              <SelectItem value="difficulty">By Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg width={width} height={height} className="mx-auto">
            {/* Grid lines */}
            {[0, 20, 40, 60, 80, 100].map(value => {
              const y = padding.top + chartHeight - (value / 100) * chartHeight;
              return (
                <g key={`grid-${value}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                  />
                  <text
                    x={padding.left - 10}
                    y={y}
                    textAnchor="end"
                    fontSize="12"
                    fill="currentColor"
                    opacity={0.6}
                    dominantBaseline="middle"
                  >
                    {value}%
                  </text>
                </g>
              );
            })}

            {/* X-axis difficulty labels */}
            {groupBy === 'difficulty' && [1, 2, 3, 4].map(diff => {
              const x = padding.left + ((diff - 0.5) / 4) * chartWidth;
              return (
                <text
                  key={`x-label-${diff}`}
                  x={x}
                  y={height - padding.bottom + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  opacity={0.8}
                >
                  {DIFFICULTY_LABELS[diff]}
                </text>
              );
            })}

            {/* Axis labels */}
            <text
              x={padding.left + chartWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="14"
              fill="currentColor"
              fontWeight="600"
            >
              {groupBy === 'difficulty' ? 'Average Task Difficulty' : 'Tasks Completed'}
            </text>
            <text
              x={15}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              fontSize="14"
              fill="currentColor"
              fontWeight="600"
              transform={`rotate(-90, 15, ${padding.top + chartHeight / 2})`}
            >
              Success Rate (%)
            </text>

            {/* Data points */}
            {modelData.map((model, i) => {
              const x = groupBy === 'difficulty'
                ? padding.left + ((model.avgDifficulty - 0.5) / 4) * chartWidth
                : padding.left + (model.tasksCompleted / maxTasks) * chartWidth;

              const y = padding.top + chartHeight - (model.successRate / 100) * chartHeight;

              const radius = 6 + (model.tasksCompleted / maxTasks) * 8;

              return (
                <g key={model.name}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="hsl(var(--primary))"
                    opacity={0.7}
                    className="hover:opacity-100 transition-opacity cursor-pointer"
                  />
                  {i < 5 && (
                    <text
                      x={x}
                      y={y - radius - 5}
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      opacity={0.8}
                      fontWeight="500"
                    >
                      {model.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Circle size represents number of tasks completed. Larger circles = more tasks.
        </div>
      </CardContent>
    </Card>
  );
}
