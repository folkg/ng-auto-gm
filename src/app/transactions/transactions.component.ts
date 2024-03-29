import { Component } from '@angular/core';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, lastValueFrom } from 'rxjs';
import { Team } from '../services/interfaces/team';
import { SyncTeamsService } from '../services/sync-teams.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from '../shared/confirm-dialog/confirm-dialog.component';
import {
  PlayerTransaction,
  PostTransactionsResult,
  TransactionResults,
  TransactionsData,
} from './interfaces/TransactionsData';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  public teams: Team[] = [];
  private transactions: TransactionsData | undefined;
  public flatTransactions: PlayerTransaction[] | undefined;
  private teamsSubscription: Subscription | undefined;
  public success: boolean | null = null;
  public transactionResults?: TransactionResults;

  constructor(
    private fns: Functions,
    private sts: SyncTeamsService,
    private dialog: MatDialog
  ) {
    this.teamsSubscription = this.sts.teams$.subscribe((teams) => {
      this.teams = teams.filter((team) => team.allow_transactions);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.fetchTransactions();
  }

  ngOnDestroy(): void {
    this.teamsSubscription?.unsubscribe();
  }

  private async fetchTransactions(): Promise<void> {
    const fetchTransactions: HttpsCallable<null, TransactionsData> =
      httpsCallableFromURL(
        this.fns,
        // 'https://transactions-gettransactions-nw73xubluq-uc.a.run.app'
        'https://fantasyautocoach.com/api/gettransactions'
      );
    try {
      const result = await fetchTransactions();
      const transactions = result.data;

      console.log('transactions: ', transactions);

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

    this.flatTransactions.forEach((t) => {
      t.selected = false;
    });
  }

  public get selectedTransactions(): PlayerTransaction[] {
    return this.flatTransactions?.filter((t) => t.selected) ?? [];
  }

  public get numSelectedTransactions(): number {
    return this.selectedTransactions.length;
  }

  private selectedTransactionsData(): TransactionsData {
    const result: TransactionsData = {
      dropPlayerTransactions: null,
      lineupChanges: null,
      addSwapTransactions: null,
    };

    if (!this.transactions) {
      return result;
    }

    const { dropPlayerTransactions, lineupChanges, addSwapTransactions } =
      this.transactions;

    result.dropPlayerTransactions = this.filterSelectedTransactionsData(
      dropPlayerTransactions
    );

    result.addSwapTransactions =
      this.filterSelectedTransactionsData(addSwapTransactions);

    // Keep all the lineup changes for the teams that have selected transactions, even if we don't need them all
    const teamsWithTransactions: Set<string> = new Set(
      this.selectedTransactions.map((t) => t.teamKey)
    );
    result.lineupChanges =
      lineupChanges?.filter((lc) => teamsWithTransactions.has(lc.teamKey)) ??
      null;

    return result;
  }

  private filterSelectedTransactionsData(
    playerTransactions: PlayerTransaction[][] | null
  ): PlayerTransaction[][] | null {
    if (!playerTransactions) {
      return null;
    }

    return playerTransactions
      .map((teamTransactions) =>
        teamTransactions.filter((transaction) => transaction.selected)
      )
      .filter((selectedTransactions) => selectedTransactions.length > 0);
  }

  public async submitTransactions(): Promise<void> {
    const userSelectionConfirmed = await this.confirmDialog();
    if (userSelectionConfirmed) {
      const transactions = this.selectedTransactionsData();
      await this.postTransactions(transactions);
    } else {
      console.log('User Cancelled');
    }
  }

  private async postTransactions(
    transactions: TransactionsData
  ): Promise<void> {
    const postTransactions: HttpsCallable<
      { transactions: TransactionsData },
      PostTransactionsResult
    > = httpsCallableFromURL(
      this.fns,
      // 'https://transactions-posttransactions-nw73xubluq-uc.a.run.app'
      'https://fantasyautocoach.com/api/posttransactions'
    );
    try {
      const result = await postTransactions({ transactions });
      this.success = result.data.success;
      this.transactionResults = result.data.transactionResults;
    } catch (err: any) {
      console.error('Error posting transactions to Firebase: ' + err.message);
      this.success = false;
    }
  }

  async confirmDialog(): Promise<boolean> {
    const numSelectedTransactions = this.numSelectedTransactions;
    const title = 'WARNING: Permanent Action';
    const message = `These transactions will be permanent. Click Proceed to officially process your ${
      numSelectedTransactions || ''
    } selected transaction${
      numSelectedTransactions !== 1 ? 's' : ''
    } with Yahoo, or Cancel to return to the transactions page.`;
    const dialogData: DialogData = {
      title,
      message,
      trueButton: 'Proceed',
      falseButton: 'Cancel',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });
    return await lastValueFrom(dialogRef.afterClosed());
  }
}
