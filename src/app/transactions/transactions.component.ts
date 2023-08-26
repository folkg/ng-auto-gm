import { Component } from '@angular/core';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import {
  LineupChanges,
  PlayerTransaction,
  TransactionsData,
} from './interfaces/TransactionsData';
import { SyncTeamsService } from '../services/sync-teams.service';
import { Team } from '../services/interfaces/team';
import { Subscription } from 'rxjs';

type GroupedPlayerTransactions = {
  [key: string]: PlayerTransaction[];
};

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  public teams: Team[] = [];
  private transactions: TransactionsData | undefined;
  public displayTransactions: GroupedPlayerTransactions | undefined;
  private teamsSubscription: Subscription | undefined;

  constructor(private fns: Functions, private sts: SyncTeamsService) {
    this.teamsSubscription = this.sts.teams$.subscribe((teams) => {
      this.teams = teams;
    });
  }

  async ngOnInit(): Promise<void> {
    // await this.fetchTransactions();
    const { transactionsData } = await import('./sample/sampleTransactions');
    this.transactions = transactionsData;
    this.setDisplayTransactions();
  }

  ngOnDestroy(): void {
    this.teamsSubscription?.unsubscribe();
  }

  private async fetchTransactions(): Promise<void> {
    const fetchTransactions: HttpsCallable<null, TransactionsData> =
      httpsCallableFromURL(
        this.fns,
        'https://transactions-gettransactions-nw73xubluq-uc.a.run.app'
        // 'https://fantasyautocoach.com/api/gettransactions'
      );
    try {
      const result = await fetchTransactions();
      const transactions = result.data;

      this.transactions = transactions;

      this.setDisplayTransactions();
    } catch (err: any) {
      console.error(
        'Error fetching transactions from Firebase: ' + err.message
      );
    }
  }

  private setDisplayTransactions() {
    if (!this.transactions) {
      return;
    }

    const { dropPlayerTransactions, addSwapTransactions } = this.transactions;

    const proposedTransactions: PlayerTransaction[] = (
      dropPlayerTransactions ?? []
    )
      .concat(addSwapTransactions ?? [])
      .flat();

    // assign a unique key (index) to each transaction so we can track them later
    proposedTransactions.forEach((t, i) => {
      t.key = i;
    });

    this.displayTransactions =
      this.groupTransactionsByTeam(proposedTransactions);
  }

  private groupTransactionsByTeam(
    transactions: PlayerTransaction[]
  ): GroupedPlayerTransactions {
    const result: { [key: string]: PlayerTransaction[] } = {};

    transactions.forEach((t) => {
      if (result[t.teamKey]) {
        result[t.teamKey].push(t);
      } else {
        result[t.teamKey] = [t];
      }
    });

    return result;
  }

  private async submitTransactions(): Promise<void> {
    // TODO: Implement logic to get the selected transactions from the UI, group them as expected, and post them to Firebase
  }

  private regroupTransactions(
    transactions: PlayerTransaction[],
    lineupChanges: LineupChanges[]
  ): TransactionsData {
    const dropPlayerTransactions: PlayerTransaction[][] = [];
    const addSwapTransactions: PlayerTransaction[][] = [];

    // TODO: Implement logic

    return {
      dropPlayerTransactions,
      lineupChanges,
      addSwapTransactions,
    };
  }

  private async postTransactions(
    transactions: TransactionsData
  ): Promise<void> {
    const postTransactions: HttpsCallable<TransactionsData, boolean> =
      httpsCallableFromURL(
        this.fns,
        'https://transactions-posttransactions-nw73xubluq-uc.a.run.app'
        //'https://fantasyautocoach.com/api/posttransactions'
      );
    try {
      const result = await postTransactions(transactions);
      console.log('Result of posting transactions:', result.data);
    } catch (err: any) {
      console.error('Error posting transactions to Firebase: ' + err.message);
    }
  }
}
