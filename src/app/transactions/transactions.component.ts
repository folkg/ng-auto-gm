import { Component } from '@angular/core';
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
  TransactionResults,
} from './interfaces/TransactionsData';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  private teamsSubscription: Subscription | undefined;
  private transactionsSubscription: Subscription | undefined;

  public teams: Team[] = [];
  public transactions: PlayerTransaction[] | undefined;
  public postTransactionsResults: TransactionResults | undefined;
  public postTransactionsSuccess: boolean | undefined;

  constructor(
    private syncTeamsService: SyncTeamsService,
    private transactionsService: TransactionsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.teamsSubscription = this.syncTeamsService.teams$.subscribe((teams) => {
      this.teams = teams.filter((team) => team.allow_transactions);
    });

    this.transactionsSubscription =
      this.transactionsService.transactions$.subscribe((transactions) => {
        this.transactions = transactions;
      });
  }

  ngOnDestroy(): void {
    this.teamsSubscription?.unsubscribe();
    this.transactionsSubscription?.unsubscribe();
  }

  public get numSelectedTransactions(): number {
    return this.transactionsService.numSelectedTransactions;
  }

  public async submitTransactions(): Promise<void> {
    const userSelectionConfirmed = await this.confirmDialog();
    if (userSelectionConfirmed) {
      const result = await this.transactionsService.postTransactions();
      this.postTransactionsSuccess = result.success;
      this.postTransactionsResults = result.transactionResults;
    } else {
      console.log('User Cancelled');
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
