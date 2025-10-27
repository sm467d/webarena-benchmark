'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry } from '@/types/normalized';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RadarChartProps {
  entries: LeaderboardEntry[];
}

const DOMAINS = ['gitlab', 'map', 'reddit', 'shopping', 'shopping_admin', 'wikipedia'] as const;
const DOMAIN_LABELS: Record<string, string> = {
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Admin',
  wikipedia: 'Wikipedia',
};

// Distinct pastel colors for up to 10 models
const MODEL_COLORS = [
  '#93c5fd', // pastel blue
  '#fca5a5', // pastel red
  '#6ee7b7', // pastel green
  '#fcd34d', // pastel amber
  '#c4b5fd', // pastel violet
  '#f9a8d4', // pastel pink
  '#5eead4', // pastel teal
  '#fdba74', // pastel orange
  '#a5b4fc', // pastel indigo
  '#bef264', // pastel lime
];

export default function RadarChart({ entries }: RadarChartProps) {
  // Filter models with meaningful domain data (not all zeros, exclude Narada AI)
  const entriesWithDomains = entries.filter(e => {
    if (!e.has_trajectories || !e.domain_breakdown) return false;

    // Exclude Narada AI (insufficient data quality)
    if (e.id === 'narada') return false;

    // Check if model has at least some non-zero success rates
    const hasData = DOMAINS.some(domain => {
      const rate = e.domain_breakdown?.[domain]?.rate || 0;
      return rate > 0;
    });

    return hasData;
  });

  const top3 = entriesWithDomains.slice(0, 3).map(e => e.id);

  const [selectedModels, setSelectedModels] = useState<string[]>(top3);

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Radar chart dimensions
  const size = 400;
  const center = size / 2;
  const maxRadius = size / 2 - 60;
  const levels = 5;

  // Calculate points on radar chart
  const getPoint = (domainIndex: number, value: number): { x: number; y: number } => {
    const angle = (Math.PI * 2 * domainIndex) / DOMAINS.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Get axis point (for labels)
  const getAxisPoint = (domainIndex: number): { x: number; y: number } => {
    return getPoint(domainIndex, 100);
  };

  // Generate path for a model
  const getPolygonPath = (entry: LeaderboardEntry): string => {
    const points = DOMAINS.map((domain, i) => {
      const rate = entry.domain_breakdown?.[domain]?.rate || 0;
      const point = getPoint(i, rate);
      return `${point.x},${point.y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  const selectedEntries = entriesWithDomains.filter(e => selectedModels.includes(e.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Radar Chart</CardTitle>
        <CardDescription>
          Compare model performance across all domains (select up to 5 models)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Radar Chart */}
          <div className="flex-1 flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background circles (grid) */}
              {Array.from({ length: levels }, (_, i) => {
                const radius = ((i + 1) / levels) * maxRadius;
                return (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-muted-foreground/20"
                  />
                );
              })}

              {/* Axes */}
              {DOMAINS.map((domain, i) => {
                const point = getAxisPoint(i);
                return (
                  <line
                    key={domain}
                    x1={center}
                    y1={center}
                    x2={point.x}
                    y2={point.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-muted-foreground/30"
                  />
                );
              })}

              {/* Labels */}
              {DOMAINS.map((domain, i) => {
                const axisPoint = getAxisPoint(i);
                const angle = (Math.PI * 2 * i) / DOMAINS.length - Math.PI / 2;
                const labelRadius = maxRadius + 30;
                const labelX = center + labelRadius * Math.cos(angle);
                const labelY = center + labelRadius * Math.sin(angle);

                return (
                  <text
                    key={`label-${domain}`}
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-semibold fill-current"
                  >
                    {DOMAIN_LABELS[domain]}
                  </text>
                );
              })}

              {/* Data polygons */}
              {selectedEntries.map((entry, index) => {
                const color = MODEL_COLORS[index % MODEL_COLORS.length];
                return (
                  <g key={entry.id}>
                    {/* Filled polygon */}
                    <path
                      d={getPolygonPath(entry)}
                      fill={color}
                      fillOpacity="0.15"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {DOMAINS.map((domain, i) => {
                      const rate = entry.domain_breakdown?.[domain]?.rate || 0;
                      const point = getPoint(i, rate);
                      return (
                        <circle
                          key={`${entry.id}-${domain}`}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={color}
                          stroke="white"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Center point */}
              <circle
                cx={center}
                cy={center}
                r="3"
                fill="currentColor"
                className="text-muted-foreground"
              />
            </svg>
          </div>

          {/* Model Selection */}
          <div className="lg:w-64 space-y-3">
            <div className="text-sm font-semibold mb-4">Select Models (max 5)</div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {entriesWithDomains.slice(0, 10).map((entry, index) => {
                const color = MODEL_COLORS[index % MODEL_COLORS.length];
                const isSelected = selectedModels.includes(entry.id);
                const canSelect = selectedModels.length < 5 || isSelected;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`model-${entry.id}`}
                      checked={isSelected}
                      onCheckedChange={() => canSelect && toggleModel(entry.id)}
                      disabled={!canSelect}
                    />
                    <Label
                      htmlFor={`model-${entry.id}`}
                      className={`flex-1 cursor-pointer text-sm ${!canSelect ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate">{entry.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {entry.success_rate.toFixed(1)}% overall
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            The radar chart shows success rates (0-100%) across all six domains.
            Each vertex represents a domain, with distance from center indicating performance.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
