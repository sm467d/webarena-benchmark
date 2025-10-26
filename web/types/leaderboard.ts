export interface LeaderboardEntry {
  a: string | null; // Date
  'Open?': string | null;
  'Model Size (billion)': string | null;
  Model: string;
  'Success Rate (%)': string;
  'Result Source': string | null;
  Work: string | null;
  Traj: string | null;
  Note: string | null;
}

export interface LeaderboardData {
  last_updated: string;
  leaderboard: LeaderboardEntry[];
}
