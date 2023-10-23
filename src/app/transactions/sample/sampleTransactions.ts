import { TransactionsData } from '../interfaces/TransactionsData';

export const transactionsData: TransactionsData = {
  dropPlayerTransactions: [
    [
      {
        teamName: 'Team A',
        leagueName: 'League 1',
        teamKey: '422.l.17808.t.2',
        sameDayTransactions: true,
        description: 'Injury',
        players: [
          {
            playerKey: 'player-1-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
          {
            playerKey: 'player-2-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
      {
        teamName: 'Team A',
        leagueName: 'League 1',
        teamKey: '422.l.17808.t.2',
        sameDayTransactions: false,
        description: 'Poor Performance',
        players: [
          {
            playerKey: 'player-6-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team B',
        leagueName: 'League 1',
        teamKey: '422.l.34143.t.10',
        sameDayTransactions: true,
        description: 'Poor Performance',
        players: [
          {
            playerKey: 'player-3-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
      {
        teamName: 'Team B',
        leagueName: 'League 1',
        teamKey: '422.l.34143.t.10',
        sameDayTransactions: false,
        description: 'Trade',
        players: [
          {
            playerKey: 'player-7-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team C',
        leagueName: 'League 2',
        teamKey: '422.l.58716.t.20',
        sameDayTransactions: false,
        description: 'Trade',
        players: [
          {
            playerKey: 'player-4-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team D',
        leagueName: 'League 2',
        teamKey: '422.l.90351.t.2',
        sameDayTransactions: true,
        description: 'Injury',
        players: [
          {
            playerKey: 'player-5-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
  ],
  lineupChanges: [
    {
      teamKey: '422.l.17808.t.2',
      coverageType: 'daily',
      coveragePeriod: '2022-01-01',
      newPlayerPositions: {
        'player-1-key': 'C',
        'player-2-key': '1B',
      },
    },
    {
      teamKey: '422.l.34143.t.10',
      coverageType: 'weekly',
      coveragePeriod: '2022-01-01',
      newPlayerPositions: {
        'player-3-key': 'OF',
      },
    },
    {
      teamKey: '422.l.58716.t.20',
      coverageType: 'daily',
      coveragePeriod: '2022-01-01',
      newPlayerPositions: {
        'player-4-key': 'SP',
      },
    },
    {
      teamKey: '422.l.90351.t.2',
      coverageType: 'weekly',
      coveragePeriod: '2022-01-01',
      newPlayerPositions: {
        'player-5-key': 'RP',
      },
    },
  ],
  addSwapTransactions: [
    [
      {
        teamName: 'Team A',
        leagueName: 'League 1',
        teamKey: '422.l.17808.t.2',
        sameDayTransactions: true,
        description: 'Injury',
        players: [
          {
            playerKey: 'player-8-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-9-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
      {
        teamName: 'Team A',
        leagueName: 'League 1',
        teamKey: '422.l.17808.t.2',
        sameDayTransactions: false,
        description: 'Poor Performance',
        players: [
          {
            playerKey: 'player-16-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-17-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team B',
        leagueName: 'League 1',
        teamKey: '422.l.34143.t.10',
        sameDayTransactions: true,
        description: 'Poor Performance',
        players: [
          {
            playerKey: 'player-10-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-11-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
      {
        teamName: 'Team B',
        leagueName: 'League 1',
        teamKey: '422.l.34143.t.10',
        sameDayTransactions: false,
        description: 'Trade',
        players: [
          {
            playerKey: 'player-18-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-19-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team C',
        leagueName: 'League 2',
        teamKey: '422.l.58716.t.20',
        sameDayTransactions: false,
        description: 'Trade',
        players: [
          {
            playerKey: 'player-12-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-13-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
    [
      {
        teamName: 'Team D',
        leagueName: 'League 2',
        teamKey: '422.l.90351.t.2',
        sameDayTransactions: true,
        description: 'Injury',
        players: [
          {
            playerKey: 'player-14-key',
            transactionType: 'add',
            isInactiveList: false,
          },
          {
            playerKey: 'player-15-key',
            transactionType: 'drop',
            isInactiveList: false,
          },
        ],
      },
    ],
  ],
};
