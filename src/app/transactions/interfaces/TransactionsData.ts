export type TransactionsData = {
  dropPlayerTransactions: PlayerTransaction[][] | null;
  lineupChanges: LineupChanges[] | null;
  addSwapTransactions: PlayerTransaction[][] | null;
};

export interface PlayerTransaction {
  teamName: string;
  leagueName: string;
  teamKey: string;
  sameDayTransactions: boolean;
  reason: string;
  isFaabRequired?: boolean;
  players: TPlayer[];
  key?: number; // a temporary key to track transactions in the frontend
  selected?: boolean; // a temporary flag to track transactions in the frontend
}

type TPlayer = {
  playerKey: string;
  transactionType: TransactionType;
  isInactiveList: boolean;
  isFromWaivers?: boolean;
};

type TransactionType = 'add' | 'drop' | 'add/drop';

export interface LineupChanges {
  teamKey: string;
  coverageType: string;
  coveragePeriod: string;
  newPlayerPositions: { [key: string]: string };
}
