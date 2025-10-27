'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  rank?: number;
  model: string;
  organization?: string;
  success_rate: number;
  date?: string;
  open?: boolean;
  note?: string;
  model_size?: string;
  isHuman?: boolean;
}

interface SimpleLeaderboardProps {
  entries: LeaderboardEntry[];
}

export function SimpleLeaderboard({ entries }: SimpleLeaderboardProps) {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-20">Rank</TableHead>
            <TableHead className="w-auto">Model</TableHead>
            <TableHead className="text-right w-28">Success Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            return (
              <TableRow
                key={index}
                className={entry.isHuman ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}
              >
                <TableCell className="text-muted-foreground tabular-nums">
                  {entry.isHuman ? '—' : entry.rank}
                </TableCell>

                <TableCell className="pr-8">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-medium">
                      {entry.model}
                    </div>
                    {entry.note && (
                      <div className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                        {entry.note}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className="tabular-nums bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                  >
                    {entry.success_rate.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
