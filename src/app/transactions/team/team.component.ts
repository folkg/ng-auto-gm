import { Component, Input, SimpleChanges } from '@angular/core';
import { Team } from 'src/app/services/interfaces/team';

import { PlayerTransaction } from '../interfaces/TransactionsData';

@Component({
  selector: 'app-team[team][allTransactions]',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  @Input({ required: true }) team!: Team;
  @Input({ required: true }) allTransactions: PlayerTransaction[] = [];
  public transactions: PlayerTransaction[] = [];
  public scoringType: { [key: string]: string } = {
    head: 'Head to Head Scoring',
    roto: 'Rotisserie Scoring',
    point: 'Points Scoring',
    headpoint: 'Head to Head (Points) Scoring',
    headone: 'Head to Head (One Win) Scoring',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['allTransactions'].currentValue !==
      changes['allTransactions'].previousValue
    ) {
      this.transactions = this.allTransactions.filter(
        (transaction) => transaction.teamKey === this.team.team_key
      );
    }
  }

  gotoExternalDomain(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
