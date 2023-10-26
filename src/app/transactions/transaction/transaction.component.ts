import { Component, Input } from '@angular/core';
import {
  PlayerTransaction,
  TransactionType,
} from '../interfaces/TransactionsData';
import { TransactionsService } from '../transactions.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  EditTransactionComponent,
  EditTransactionDialogData,
} from '../edit-transaction/edit-transaction.component';
import { lastValueFrom } from 'rxjs';
import { Player } from '../interfaces/Player';

@Component({
  selector: 'app-transaction[transaction]',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() transaction: PlayerTransaction | undefined;

  constructor(
    private transactionsService: TransactionsService,
    public dialog: MatDialog
  ) {}

  toggleSelected(): void {
    if (!this.transaction) {
      return;
    }

    const updateTransaction = {
      ...this.transaction,
      selected: !this.transaction.selected,
    };
    this.transactionsService.updateTransaction(updateTransaction);
  }

  getCandidatePlayersList(transactionType: TransactionType): Player[] {
    if (!this.transaction) {
      return [];
    } else if (transactionType === 'add') {
      return this.transactionsService.getTopAddCandidatesList(
        this.transaction.teamKey
      );
    } else {
      return this.transactionsService.getTopDropCandidatesList(
        this.transaction.teamKey
      );
    }
  }

  async openEditDialog(
    playerKey: string,
    transactionType: TransactionType
  ): Promise<void> {
    if (!this.transaction) {
      return;
    }

    const dialogData: EditTransactionDialogData = {
      playerKey,
      playersList: this.getCandidatePlayersList(transactionType),
    };

    const dialogRef: MatDialogRef<
      EditTransactionComponent,
      string | undefined
    > = this.dialog.open(EditTransactionComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90%',
      data: dialogData,
    });

    const selectedPlayerKey = await lastValueFrom(dialogRef.afterClosed());
    console.log('selectedPlayerKey', selectedPlayerKey);
    // TODO: If not 'undefined', Call a function with the selectedPlayerKey + transactionId to update the transaction.
  }
}
