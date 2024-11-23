import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';

import { PlayerTransaction } from '../interfaces/TransactionsData';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-transaction[transaction]',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  imports: [
    NgClass,
    NgIf,
    MatCheckbox,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    NgFor,
    PlayerComponent,
  ],
})
export class TransactionComponent {
  @Input() transaction: PlayerTransaction | undefined;
}
