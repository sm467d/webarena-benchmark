'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types/normalized';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardWithTabsProps {
  entries: LeaderboardEntry[];
}

type Domain = 'all' | 'gitlab' | 'map' | 'reddit' | 'shopping' | 'shopping_admin' | 'wikipedia';

const DOMAIN_LABELS: Record<Domain, string> = {
  all: 'Overall',
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Shopping Admin',
  wikipedia: 'Wikipedia',
};

const DOMAIN_COLORS: Record<Domain, string> = {
  all: 'bg-primary/10 text-primary',
  gitlab: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
  map: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  reddit: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
  shopping: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  shopping_admin: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  wikipedia: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
};

export default function LeaderboardWithTabs({ entries }: LeaderboardWithTabsProps) {
  const [activeTab, setActiveTab] = useState<Domain>('all');

  // Get sorted entries for a specific domain
  const getSortedEntries = (domain: Domain) => {
    if (domain === 'all') {
      return [...entries].sort((a, b) => b.success_rate - a.success_rate);
    }

    return [...entries]
      .filter(entry => entry.domain_breakdown[domain])
      .map(entry => ({
        ...entry,
        domain_rate: entry.domain_breakdown[domain]?.rate || 0,
        domain_successes: entry.domain_breakdown[domain]?.success || 0,
        domain_total: entry.domain_breakdown[domain]?.total || 0,
      }))
      .sort((a, b) => (b.domain_rate || 0) - (a.domain_rate || 0));
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-lg font-semibold text-muted-foreground">#{rank}</span>;
  };

  const renderTable = (domain: Domain) => {
    const sortedEntries = getSortedEntries(domain);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground w-16">
                Rank
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Model
              </th>
              <th className="text-right py-4 px-4 font-medium text-sm text-muted-foreground">
                Success Rate
              </th>
              <th className="text-right py-4 px-4 font-medium text-sm text-muted-foreground">
                Tasks
              </th>
              {domain !== 'all' && (
                <th className="text-center py-4 px-4 font-medium text-sm text-muted-foreground">
                  Overall
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => {
              const domainSpecific = domain !== 'all' && 'domain_rate' in entry;
              const successRate = domainSpecific ? entry.domain_rate : entry.success_rate;
              const successes = domainSpecific ? entry.domain_successes : entry.successes;
              const total = domainSpecific ? entry.domain_total : entry.total_tasks;

              return (
                <tr
                  key={entry.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    {getRankBadge(index + 1)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        {entry.has_trajectories && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Trajectories
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-2xl font-bold">
                        {successRate?.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-muted-foreground">
                    {successes}/{total}
                  </td>
                  {domainSpecific && (
                    <td className="py-4 px-4 text-center">
                      <Badge variant="secondary" className="font-mono">
                        {entry.success_rate.toFixed(1)}%
                      </Badge>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Calculate domain stats for tabs
  const domainStats = (domain: Domain) => {
    if (domain === 'all') {
      return { total: entries.length, topRate: entries[0]?.success_rate || 0 };
    }
    const domainEntries = entries.filter(e => e.domain_breakdown[domain]);
    const topRate = Math.max(...domainEntries.map(e => e.domain_breakdown[domain]?.rate || 0));
    return {
      total: domainEntries.length,
      topRate,
      totalTasks: domainEntries[0]?.domain_breakdown[domain]?.total || 0,
    };
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Domain)}>
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
          {Object.entries(DOMAIN_LABELS).map(([key, label]) => {
            const stats = domainStats(key as Domain);
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium">{label}</span>
                  {key !== 'all' && stats.totalTasks && (
                    <span className="text-[10px] text-muted-foreground">
                      {stats.totalTasks} tasks
                    </span>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(DOMAIN_LABELS).map((domain) => (
          <TabsContent key={domain} value={domain} className="mt-6">
            <Card>
              <CardContent className="p-0">
                {renderTable(domain as Domain)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Top Model</p>
                <p className="text-2xl font-bold">{entries[0]?.success_rate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">{entries[0]?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Models Evaluated</p>
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground mt-1">With trajectories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Benchmark Tasks</p>
                <p className="text-2xl font-bold">{entries[0]?.total_tasks || 812}</p>
                <p className="text-xs text-muted-foreground mt-1">Across 6 domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
