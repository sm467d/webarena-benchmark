'use client';

import { LeaderboardEntry } from '@/types/leaderboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
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
            const rank = index + 1;

            return (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground tabular-nums">
                  {rank}
                </TableCell>

                <TableCell className="pr-8">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-medium">
                      {entry.Model}
                    </div>
                    {entry.Note && (
                      <div className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                        {entry.Note}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className="tabular-nums bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                  >
                    {entry['Success Rate (%)']}%
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
