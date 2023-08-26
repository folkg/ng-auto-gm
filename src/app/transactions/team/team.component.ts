import { Component, Input } from '@angular/core';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { PlayerTransaction } from '../interfaces/TransactionsData';
import { Team, getEmptyTeamObject } from 'src/app/services/interfaces/team';

@Component({
  selector: 'app-team[team]',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  @Input() team: Team = getEmptyTeamObject();
  @Input() transactions: PlayerTransaction[] = [];
  public scoringType: { [key: string]: string } = {
    head: 'Head to Head Scoring',
    roto: 'Rotisserie Scoring',
    point: 'Points Scoring',
    headpoint: 'Head to Head (Points) Scoring',
    headone: 'Head to Head (One Win) Scoring',
  };

  constructor(public os: OnlineStatusService) {}

  gotoExternalDomain(url: string) {
    if (url) {
      (window as any).open(url, '_blank');
    }
  }
}
