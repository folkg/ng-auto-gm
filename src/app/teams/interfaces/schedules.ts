export interface Schedule {
  date: string;
  games: { [key: string]: number[] };
}
