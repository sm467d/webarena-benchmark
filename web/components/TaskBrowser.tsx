'use client';

import { useState, useMemo } from 'react';
import { Task, Result, Model, TaskDifficulty } from '@/types/normalized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, X, Search, ChevronRight, ChevronLeft } from 'lucide-react';

interface TaskBrowserProps {
  tasks: Task[];
  results: Result[];
  models: Model[];
  taskDifficulty: TaskDifficulty[];
}

type SiteFilter = 'all' | 'gitlab' | 'map' | 'reddit' | 'shopping' | 'shopping_admin' | 'wikipedia';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard' | 'very_hard';
type SortOrder = 'id' | 'success_rate_asc' | 'success_rate_desc';

const SITE_LABELS: Record<string, string> = {
  all: 'All Sites',
  gitlab: 'GitLab',
  map: 'Map',
  reddit: 'Reddit',
  shopping: 'Shopping',
  shopping_admin: 'Shopping Admin',
  wikipedia: 'Wikipedia',
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 dark:bg-green-200 text-green-800',
  medium: 'bg-yellow-100 dark:bg-yellow-200 text-yellow-800',
  hard: 'bg-orange-100 dark:bg-orange-200 text-orange-800',
  very_hard: 'bg-rose-100 dark:bg-rose-200 text-rose-800',
};

const TASKS_PER_PAGE = 20;

export default function TaskBrowser({ tasks, results, models, taskDifficulty }: TaskBrowserProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('id');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
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

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'id') {
        return a.id - b.id;
      }

      const aDifficulty = taskDifficulty.find(t => t.id === a.id);
      const bDifficulty = taskDifficulty.find(t => t.id === b.id);
      const aRate = aDifficulty?.success_rate || 0;
      const bRate = bDifficulty?.success_rate || 0;

      if (sortOrder === 'success_rate_asc') {
        return aRate - bRate;
      } else {
        return bRate - aRate;
      }
    });

    return sorted;
  }, [tasks, searchQuery, siteFilter, difficultyFilter, sortOrder, taskDifficulty]);

  // Get results for selected task
  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedTaskResults = useMemo(() => {
    if (!selectedTaskId) return [];
    return results.filter(r => r.t === selectedTaskId);
  }, [selectedTaskId, results]);

  const selectedTaskDifficulty = taskDifficulty.find(t => t.id === selectedTaskId);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, siteFilter, difficultyFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks by description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={siteFilter} onValueChange={(v) => setSiteFilter(v as SiteFilter)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SITE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="very_hard">Very Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Sort by ID</SelectItem>
                  <SelectItem value="success_rate_desc">Highest Success Rate</SelectItem>
                  <SelectItem value="success_rate_asc">Lowest Success Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid gap-3">
        {paginatedTasks.map(task => {
          const difficulty = taskDifficulty.find(t => t.id === task.id);
          const isSelected = selectedTaskId === task.id;

          return (
            <Card
              key={task.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Task header */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground font-semibold">
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
                      {difficulty && (
                        <span className="text-xs text-muted-foreground">
                          {difficulty.success_count}/{models.length} models passed
                        </span>
                      )}
                    </div>

                    {/* Task description */}
                    <p className="text-sm mb-3">{task.intent}</p>

                    {/* Expanded details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in-50 duration-200">
                        {/* Expected Answer */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Expected Answer
                          </h4>
                          <p className="text-sm bg-muted/50 p-3 rounded font-mono">
                            {task.reference_answer}
                          </p>
                        </div>

                        {/* Model Performance */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                            Model Performance ({selectedTaskResults.length} results)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {models.map(model => {
                              const result = selectedTaskResults.find(r => r.m === model.id);
                              const success = result?.s === 1;
                              const hasData = result !== undefined;

                              return (
                                <div
                                  key={model.id}
                                  className="flex items-center gap-2 p-2 rounded bg-muted/30"
                                >
                                  {hasData ? (
                                    success ? (
                                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    )
                                  ) : (
                                    <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
                                  )}
                                  <span className="text-xs truncate">{model.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stats */}
                        {selectedTaskDifficulty && (
                          <div className="flex gap-4 text-sm">
                            <div className="bg-muted/50 px-3 py-2 rounded">
                              <span className="text-muted-foreground">Success Rate:</span>{' '}
                              <span className="font-semibold">
                                {selectedTaskDifficulty.success_rate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="bg-muted/50 px-3 py-2 rounded">
                              <span className="text-muted-foreground">Difficulty:</span>{' '}
                              <span className="font-semibold capitalize">
                                {selectedTaskDifficulty.difficulty.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expand indicator */}
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      isSelected ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks match your filters. Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
