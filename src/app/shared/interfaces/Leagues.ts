import { union, literal, type Infer } from 'superstruct';

export const Leagues = union([
  literal('mlb'),
  literal('nba'),
  literal('nfl'),
  literal('nhl'),
]);

export type Leagues = Infer<typeof Leagues>;
