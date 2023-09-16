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
  private flatTransactions: PlayerTransaction[] | undefined;
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
    this.formatTransactions();
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
      this.formatTransactions();
    } catch (err: any) {
      console.error(
        'Error fetching transactions from Firebase: ' + err.message
      );
    }
  }

  private formatTransactions() {
    if (!this.transactions) {
      return;
    }

    const { dropPlayerTransactions, addSwapTransactions } = this.transactions;

    this.flatTransactions = (dropPlayerTransactions ?? [])
      .concat(addSwapTransactions ?? [])
      .flat();

    // assign a unique key (index) to each transaction so we can track them later
    this.flatTransactions.forEach((t, i) => {
      t.key = i;
      t.selected = false;
    });

    this.displayTransactions = this.groupTransactionsByTeam(
      this.flatTransactions
    );
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

  public get selectedTransactions(): PlayerTransaction[] {
    return this.flatTransactions?.filter((t) => t.selected) ?? [];
  }

  public get numSelectedTransactions(): number {
    return this.selectedTransactions.length;
  }

  private async submitTransactions(): Promise<void> {
    // TODO: Implement logic to get the selected transactions from the UI, group them as expected, and post them to Firebase
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
