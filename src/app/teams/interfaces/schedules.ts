export interface Schedule {
  date: string;
  games: GameStartTimes[];
}

export interface GameStartTimes {
  league: string;
  gameTimestamps: number[];
}
