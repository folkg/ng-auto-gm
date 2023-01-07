export interface Team {
  game_name: string;
  game_code: string;
  game_season: string;
  game_is_over: boolean;
  team_key: string;
  team_name: string;
  team_url: string;
  team_logo: string;
  league_name: string;
  num_teams: number;
  rank: string | number;
  points_for: string | number;
  points_against: string | number;
  points_back: string | number;
  outcome_totals: {
    wins: string | number;
    losses: string | number;
    ties: string | number;
    percentage: string | number;
  };
  scoring_type: string;
  current_week: string;
  end_week: string;
  start_date: number;
  end_date: number;
  edit_key: string;
  is_approved: boolean;
  is_setting_lineups: boolean;
  last_updated: number;
}
