'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry } from '@/types/normalized';

interface CompactMatrixProps {
  entries: LeaderboardEntry[];
}

const DOMAINS = ['gitlab', 'map', 'reddit', 'shopping', 'shopping_admin', 'wikipedia'] as const;
const DOMAIN_LABELS: Record<string, string> = {
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Admin',
  wikipedia: 'Wiki',
};

export default function CompactMatrix({ entries }: CompactMatrixProps) {
  // Filter entries that have domain data
  const entriesWithDomains = entries.filter(e => e.domain_breakdown && Object.keys(e.domain_breakdown).length > 0);

  // Get color based on success rate (soft pastel colors)
  const getColor = (rate: number) => {
    if (rate >= 70) return 'bg-green-100 dark:bg-green-200 text-green-800';
    if (rate >= 50) return 'bg-emerald-100 dark:bg-emerald-200 text-emerald-800';
    if (rate >= 30) return 'bg-yellow-100 dark:bg-yellow-200 text-yellow-800';
    if (rate >= 15) return 'bg-orange-100 dark:bg-orange-200 text-orange-800';
    if (rate > 0) return 'bg-rose-100 dark:bg-rose-200 text-rose-800';
    // Return gray for zero (no data)
    return 'bg-gray-100 dark:bg-gray-800 text-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model × Domain Success Matrix</CardTitle>
        <CardDescription>
          Compact view of success rates across domains (only models with trajectory data)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-sm font-semibold border-b-2">Model</th>
                <th className="text-center py-2 px-2 text-xs font-semibold border-b-2">Overall</th>
                {DOMAINS.map((domain) => (
                  <th key={domain} className="text-center py-2 px-2 text-xs font-semibold border-b-2">
                    {DOMAIN_LABELS[domain]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entriesWithDomains.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-3 text-sm font-medium">{entry.name}</td>

                  {/* Overall */}
                  <td className="py-2 px-2 text-center">
                    <div className={`inline-flex items-center justify-center min-w-[50px] px-2 py-1 rounded text-xs font-bold ${getColor(entry.success_rate)}`}>
                      {entry.success_rate.toFixed(1)}%
                    </div>
                  </td>

                  {/* Domain cells */}
                  {DOMAINS.map((domain) => {
                    const domainData = entry.domain_breakdown?.[domain];
                    if (!domainData) {
                      return (
                        <td key={domain} className="py-2 px-2 text-center">
                          <div className="inline-flex items-center justify-center min-w-[50px] px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                            —
                          </div>
                        </td>
                      );
                    }

                    const rate = domainData.rate || 0;

                    return (
                      <td key={domain} className="py-2 px-2 text-center group relative">
                        <div className={`inline-flex items-center justify-center min-w-[50px] px-2 py-1 rounded text-xs font-bold ${getColor(rate)}`}>
                          {rate === 0 ? '—' : `${rate.toFixed(1)}%`}
                        </div>

                        {/* Tooltip */}
                        {rate > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border">
                            {domainData.success}/{domainData.total} tasks
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs flex-wrap">
          <span className="font-semibold">Success Rate:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-200 rounded" />
            <span>≥70%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-200 rounded" />
            <span>50-70%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-200 rounded" />
            <span>30-50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-100 dark:bg-orange-200 rounded" />
            <span>15-30%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-rose-100 dark:bg-rose-200 rounded" />
            <span>&lt;15%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
