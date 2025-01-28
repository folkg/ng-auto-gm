import { type Infer, literal, union } from "superstruct";

export const Leagues = union([
  literal("mlb"),
  literal("nba"),
  literal("nfl"),
  literal("nhl"),
]);

export type Leagues = Infer<typeof Leagues>;
