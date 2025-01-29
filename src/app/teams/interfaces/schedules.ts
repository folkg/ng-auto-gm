import { type } from "arktype";

export const Schedule = type({
  date: "string",
  games: type({ "['mlb'|'nba'|'nfl'|'nhl']": "number[]" }), // TODO: How to re-use Leagues here?
});

export type Schedule = typeof Schedule.infer;
