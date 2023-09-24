export interface Team {
  team_key: string;
  game_code: string;
  start_date: number;
  end_date: number;
  num_teams: number;
  weekly_deadline: string | number;
  faab_balance: number;
  waiver_rule: string;
  current_weekly_adds: number;
  current_season_adds: number;
  scoring_type: string;
  edit_key: string;
  max_weekly_adds: number;
  max_season_adds: number;
  max_games_played: number;
  max_innings_pitched: number;
  game_name: string;
  game_season: string;
  game_is_over: boolean | number;
  team_name: string;
  team_url: string;
  team_logo: string;
  league_name: string;
  rank: string | number;
  points_for: string | number | null;
  points_against: string | number | null;
  points_back: string | number | null;
  outcome_totals: {
    wins: string | number;
    losses: string | number;
    ties: string | number;
    percentage: string | number;
  };
  is_subscribed: boolean;
  is_setting_lineups: boolean;
  last_updated: number;
  allow_transactions: boolean;
  allow_dropping: boolean;
  allow_adding: boolean;
  allow_add_drops: boolean;
  allow_waiver_adds: boolean;
  automated_transaction_processing?: boolean;
}

export function getEmptyTeamObject(): Team {
  return {
    game_name: '',
    game_code: '',
    game_season: '',
    game_is_over: false,
    team_key: '',
    team_name: '',
    team_url: '',
    team_logo: '',
    league_name: '',
    num_teams: 0,
    rank: '',
    points_for: 0,
    points_against: 0,
    points_back: 0,
    outcome_totals: {
      wins: 0,
      losses: 0,
      ties: 0,
      percentage: 0,
    },
    scoring_type: '',
    start_date: 0,
    end_date: 0,
    weekly_deadline: 0,
    edit_key: '',
    is_subscribed: false,
    is_setting_lineups: false,
    last_updated: 0,
    faab_balance: 0,
    waiver_rule: '',
    current_weekly_adds: 0,
    current_season_adds: 0,
    max_weekly_adds: 0,
    max_season_adds: 0,
    max_games_played: 0,
    max_innings_pitched: 0,
    allow_transactions: false,
    allow_dropping: false,
    allow_adding: false,
    allow_add_drops: false,
    allow_waiver_adds: false,
    automated_transaction_processing: false,
  };
}
