import { Player } from './Player';

export type TransactionsData = {
  dropPlayerTransactions: PlayerTransaction[][] | null;
  lineupChanges: LineupChanges[] | null;
  addSwapTransactions: PlayerTransaction[][] | null;
};

export type PostTransactionsResult = {
  success: boolean;
  transactionResults: TransactionResults;
};

export type TransactionResults = {
  postedTransactions: PlayerTransaction[];
  failedReasons: string[];
};

export interface PlayerTransaction {
  teamName: string;
  leagueName: string;
  teamKey: string;
  sameDayTransactions: boolean;
  description: string;
  reason: string | null;
  isFaabRequired?: boolean;
  players: TPlayer[];
  selected?: boolean; // a temporary flag to track transactions in the frontend
  id: string; // a temporary flag to track transactions in the frontend
}

type TPlayer = {
  playerKey: string;
  transactionType: TransactionType;
  isInactiveList: boolean;
  player: Player;
  isFromWaivers?: boolean;
};

type TransactionType = 'add' | 'drop' | 'add/drop';

export interface LineupChanges {
  teamKey: string;
  coverageType: string;
  coveragePeriod: string;
  newPlayerPositions: { [key: string]: string };
}
