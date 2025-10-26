'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry } from '@/types/normalized';

interface DomainBarChartProps {
  entries: LeaderboardEntry[];
}

const DOMAINS = ['gitlab', 'map', 'reddit', 'shopping', 'shopping_admin', 'wikipedia'] as const;
const DOMAIN_LABELS: Record<string, string> = {
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Shopping Admin',
  wikipedia: 'Wikipedia',
};

const DOMAIN_COLORS: Record<string, string> = {
  gitlab: '#f97316',
  map: '#22c55e',
  reddit: '#ef4444',
  shopping: '#3b82f6',
  shopping_admin: '#a855f7',
  wikipedia: '#6b7280',
};

export default function DomainBarChart({ entries }: DomainBarChartProps) {
  // Filter entries that have domain data
  const entriesWithDomains = entries.filter(e => e.domain_breakdown && Object.keys(e.domain_breakdown).length > 0);

  // Get top 10 models by overall success rate
  const topModels = entriesWithDomains.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Domain</CardTitle>
        <CardDescription>
          Success rates across different benchmark domains for top 10 models with trajectory data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topModels.map((entry) => (
            <div key={entry.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{entry.name}</span>
                <span className="text-xs text-muted-foreground">
                  {entry.success_rate.toFixed(1)}% overall
                </span>
              </div>

              {/* Domain bars */}
              <div className="flex gap-1 h-8">
                {DOMAINS.map((domain) => {
                  const domainData = entry.domain_breakdown?.[domain];
                  if (!domainData) return null;

                  const rate = domainData.rate || 0;
                  const width = (rate / 100) * 100;

                  return (
                    <div
                      key={domain}
                      className="relative group flex-1"
                      style={{ minWidth: '60px' }}
                    >
                      <div className="h-full bg-muted rounded overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 flex items-center justify-center text-xs font-medium text-white"
                          style={{
                            width: `${width}%`,
                            backgroundColor: DOMAIN_COLORS[domain],
                          }}
                        >
                          {rate > 20 && `${rate.toFixed(0)}%`}
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border">
                        {DOMAIN_LABELS[domain]}: {rate.toFixed(1)}%
                        <br />
                        {domainData.success}/{domainData.total} tasks
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend for this model */}
              <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                {DOMAINS.map((domain) => {
                  const domainData = entry.domain_breakdown?.[domain];
                  if (!domainData) return null;

                  return (
                    <div key={domain} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: DOMAIN_COLORS[domain] }}
                      />
                      <span>{DOMAIN_LABELS[domain]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
