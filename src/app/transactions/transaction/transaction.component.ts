import { Component, Input } from '@angular/core';
import { PlayerTransaction } from '../interfaces/TransactionsData';

@Component({
  selector: 'app-transaction[transaction]',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() transaction: PlayerTransaction | undefined;
}
