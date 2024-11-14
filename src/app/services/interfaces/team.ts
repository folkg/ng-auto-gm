import { Leagues } from 'src/app/shared/interfaces/Leagues';
import {
  object,
  string,
  number,
  boolean,
  record,
  optional,
  Infer,
  union,
  nullable,
} from 'superstruct';

export const TeamFirestore = object({
  uid: string(),
  team_key: string(),
  game_code: Leagues,
  start_date: number(),
  end_date: number(),
  weekly_deadline: union([string(), number()]),
  roster_positions: record(string(), number()),
  num_teams: number(),
  allow_transactions: boolean(),
  allow_dropping: boolean(),
  allow_adding: boolean(),
  allow_add_drops: boolean(),
  allow_waiver_adds: boolean(),
  automated_transaction_processing: optional(boolean()),
  last_updated: number(),
  lineups_paused_at: optional(number()),
  is_subscribed: boolean(),
  is_setting_lineups: boolean(),
});

export const Team = object({
  ...TeamFirestore.schema,
  edit_key: string(),
  faab_balance: number(),
  current_weekly_adds: number(),
  current_season_adds: number(),
  scoring_type: string(),
  team_name: string(),
  league_name: string(),
  max_weekly_adds: number(),
  max_season_adds: number(),
  waiver_rule: string(),
  max_games_played: number(),
  max_innings_pitched: number(),
  game_name: string(),
  game_season: string(),
  game_is_over: union([boolean(), number()]),
  team_url: string(),
  team_logo: string(),
  rank: union([string(), number()]),
  points_for: nullable(union([string(), number()])),
  points_against: nullable(union([string(), number()])),
  points_back: nullable(union([string(), number()])),
  outcome_totals: object({
    wins: union([string(), number()]),
    losses: union([string(), number()]),
    ties: union([string(), number()]),
    percentage: union([string(), number()]),
  }),
});

export type TeamFirestore = Infer<typeof TeamFirestore>;
export type Team = Infer<typeof Team>;
