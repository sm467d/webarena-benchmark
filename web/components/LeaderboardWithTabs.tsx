'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types/normalized';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Trophy, Medal, Award, User } from 'lucide-react';
import { getCompanyLogoUrl } from '@/lib/company-logos';
import { getOrganizationName, getModelLLM } from '@/lib/model-organizations';
import Image from 'next/image';

interface LeaderboardWithTabsProps {
  officialEntries: any[]; // Raw entries from data/leaderboard.json
  normalizedEntries: LeaderboardEntry[]; // Normalized entries with domain breakdown
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

export default function LeaderboardWithTabs({ officialEntries, normalizedEntries }: LeaderboardWithTabsProps) {
  const [activeTab, setActiveTab] = useState<Domain>('all');

  // Get sorted entries for a specific domain
  const getSortedEntries = (domain: Domain) => {
    if (domain === 'all') {
      // Use official leaderboard data for Overall tab - convert to our format
      const entries = officialEntries.map((entry, index) => {
        // Handle malformed entries (AutoGuide, AutoManual, Human) where columns are shifted
        let modelName = entry.Model;
        let successRate = parseFloat(entry['Success Rate (%)']) || 0;
        let modelSize = entry['Model Size (billion)'];
        let organization = entry['Result Source'] || entry.Work;

        // Detect and fix malformed entries where success rate is actually the model name
        if (isNaN(parseFloat(entry.Model)) === false) {
          // Model field contains a number (success rate), columns are shifted
          successRate = parseFloat(entry.Model) || 0;
          modelName = modelSize || entry['Success Rate (%)'] || 'Unknown';
          modelSize = null;
          organization = entry['Success Rate (%)'];
        }

        const totalTasks = 812; // Standard WebArena task count
        const successes = Math.round((successRate / 100) * totalTasks);

        // Generate unique ID by combining model name and index to avoid duplicates
        const uniqueId = `${modelName.toLowerCase().replace(/\s+/g, '_')}_${index}`;

        return {
          id: uniqueId,
          name: modelName,
          organization: organization,
          total_tasks: totalTasks,
          successes: successes,
          success_rate: successRate,
          rank: index + 1,
          has_trajectories: entry.Traj && entry.Traj !== 'null' && entry.Traj !== '✓' && entry.Traj !== '✔',
          date: entry.a,
          open: entry['Open?'] === '✓' || entry['Open?'] === '✔',
          model_size: modelSize,
          isHuman: modelName === 'Human',
          isSubset: modelName === 'AutoGuide' || modelName === 'AutoManual',
          note: entry.Note,
        };
      }).sort((a, b) => b.success_rate - a.success_rate);

      // Separate Human and Reddit subset entries from full benchmark models
      const humanEntry = entries.find(e => e.isHuman);
      const subsetEntries = entries.filter(e => e.isSubset);
      const modelEntries = entries.filter(e => !e.isHuman && !e.isSubset).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      // Return Human first, then numbered full benchmark models, then subset entries without ranks
      return humanEntry
        ? [humanEntry, ...modelEntries, ...subsetEntries]
        : [...modelEntries, ...subsetEntries];
    }

    return [...normalizedEntries]
      .filter(entry => entry.domain_breakdown && entry.domain_breakdown[domain])
      .map(entry => ({
        ...entry,
        domain_rate: entry.domain_breakdown[domain]?.rate || 0,
        domain_successes: entry.domain_breakdown[domain]?.success || 0,
        domain_total: entry.domain_breakdown[domain]?.total || 0,
      }))
      .sort((a, b) => (b.domain_rate || 0) - (a.domain_rate || 0));
  };

  const getRankBadge = (rank: number, isHuman?: boolean, isSubset?: boolean) => {
    if (isHuman || isSubset) return <span className="text-sm font-semibold text-foreground/40">—</span>;
    return <span className="text-sm font-semibold text-foreground">#{rank}</span>;
  };

  const getRowBackground = (index: number, isHuman?: boolean, isSubset?: boolean, rank?: number) => {
    if (isHuman || isSubset) return '';
    // Use rank if provided, otherwise use index (for domain tabs)
    const effectiveRank = rank || index + 1;
    if (effectiveRank === 1) return 'bg-yellow-100/30 dark:bg-yellow-950/20';
    if (effectiveRank === 2) return 'bg-yellow-100/30 dark:bg-yellow-950/20';
    if (effectiveRank === 3) return 'bg-yellow-100/30 dark:bg-yellow-950/20';
    return '';
  };

  const renderTable = (domain: Domain) => {
    const sortedEntries = getSortedEntries(domain);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-foreground/20">
              {domain === 'all' ? (
                <th className="text-left py-3 px-4 font-semibold text-sm text-foreground w-16">
                  Rank
                </th>
              ) : (
                <>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-foreground w-16">
                    Domain Rank
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-foreground w-16">
                    Overall Rank
                  </th>
                </>
              )}
              <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                Model
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                Organization
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                LLM
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-foreground w-24">
                Success Rate
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-foreground">
                Tasks
              </th>
              <th className="text-center py-3 px-4 font-semibold text-sm text-foreground">
                Trajectories
              </th>
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
                  className={`border-b border-foreground/10 hover:bg-accent/50 transition-colors ${getRowBackground(index, entry.isHuman, entry.isSubset, entry.rank)}`}
                >
                  {domain === 'all' ? (
                    <td className="py-3 px-4">
                      {getRankBadge(entry.rank, entry.isHuman, entry.isSubset)}
                    </td>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-semibold text-foreground">#{index + 1}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-foreground/60">#{entry.rank}</span>
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                        {entry.name === 'Human' ? (
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                        ) : (
                          <Image
                            src={getCompanyLogoUrl(entry.name, 64)}
                            alt={`${entry.name} logo`}
                            width={20}
                            height={20}
                            className="rounded object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{entry.name}</span>
                          {entry.open && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                              OS
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1 items-center">
                          {entry.model_size && entry.model_size !== '-' && (
                            <span className="text-xs text-muted-foreground">
                              {entry.model_size}B params
                            </span>
                          )}
                          {entry.isSubset && entry.note && (
                            <Badge variant="secondary" className="text-xs">
                              {entry.note}
                            </Badge>
                          )}
                          {domain !== 'all' && !domainSpecific && (
                            <Badge variant="secondary" className="text-xs">
                              No domain data
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground/70">
                    {getOrganizationName(entry.name)}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground/70">
                    {getModelLLM(entry.name) || <span className="text-foreground/30">—</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {successRate?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-foreground/70 font-medium">
                    {successes}/{total}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {entry.has_trajectories ? (
                      <a href="#" className="text-sm text-primary hover:underline font-medium">
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-foreground/30">—</span>
                    )}
                  </td>
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
      const topRate = officialEntries.length > 0
        ? parseFloat(officialEntries[0]['Success Rate (%)']) || 0
        : 0;
      return { total: officialEntries.length, topRate };
    }
    const domainEntries = normalizedEntries.filter(e => e.domain_breakdown && e.domain_breakdown[domain]);
    const topRate = domainEntries.length > 0
      ? Math.max(...domainEntries.map(e => e.domain_breakdown![domain]?.rate || 0))
      : 0;
    return {
      total: domainEntries.length,
      topRate,
      totalTasks: domainEntries[0]?.domain_breakdown![domain]?.total || 0,
    };
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Domain)}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-9 w-full lg:w-auto">
            {Object.entries(DOMAIN_LABELS).map(([key, label]) => {
              const stats = domainStats(key as Domain);
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative px-4 py-2"
                >
                  <span className="font-medium text-sm whitespace-nowrap">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

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
    </div>
  );
}
