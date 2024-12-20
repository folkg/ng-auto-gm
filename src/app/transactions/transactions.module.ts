import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../shared/shared.module';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { PlayerComponent } from './player/player.component';
import { SortTeamsByTransactionsPipe } from './sort-teams-by-transactions.pipe';
import { TeamComponent } from './team/team.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
  declarations: [
    TransactionsComponent,
    TeamComponent,
    TransactionComponent,
    SortTeamsByTransactionsPipe,
    EditTransactionComponent,
    PlayerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TransactionsRoutingModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
  ],
})
export class TransactionsModule {}
