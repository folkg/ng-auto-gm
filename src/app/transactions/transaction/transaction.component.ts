import { Component, Input } from '@angular/core';
import { PlayerTransaction } from '../interfaces/TransactionsData';
import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-transaction[transaction]',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() transaction: PlayerTransaction | undefined;

  constructor(private transactionsService: TransactionsService) {}

  toggleSelected(): void {
    if (!this.transaction) {
      return;
    }
    this.transaction.selected = !this.transaction.selected;
    this.transactionsService.updateTransaction(this.transaction);
  }
}
