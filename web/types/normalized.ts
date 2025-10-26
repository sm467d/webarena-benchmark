// Normalized data types matching our generated JSON files

export interface Model {
  id: string;
  name: string;
  date: string;
  open: boolean;
  size_b: string | null;
  success_rate: number;
  has_trajectories: boolean;
}

export interface Task {
  id: number;
  intent: string;
  site: string;
  template_id: number;
  eval_type: string;
  reference_answer: string;
}

export interface Result {
  t: number;  // task_id
  m: string;  // model_id
  s: number;  // success (0/1)
}

export interface DomainStats {
  success: number;
  total: number;
  rate: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  total_tasks: number;
  successes: number;
  success_rate: number;
  rank: number;
  domain_breakdown: Record<string, DomainStats>;
}

export interface TaskDifficulty {
  id: number;
  success_count: number;
  success_rate: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  passing_models: string[];
}

export interface HeatmapData {
  model_ids: string[];
  task_ids: number[];
  matrix: (number | null)[][];
}
