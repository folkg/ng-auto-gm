import { Component, OnInit } from '@angular/core';
import { SetLineupEvent } from './interfaces/set-lineup-event';
import { Team } from './interfaces/team';
import { SyncTeamsService } from './services/sync-teams.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [SyncTeamsService],
})
export class TeamsComponent implements OnInit {
  public teams: Team[];

  constructor(private sts: SyncTeamsService) {
    try {
      this.teams = JSON.parse(sessionStorage.getItem('yahooTeams') || '');
    } catch {
      this.teams = [];
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.teams.length === 0) {
      // If teams doesn't exist in sessionStorage, retrieve from APIs
      this.teams = await this.sts.buildTeams();
    }
  }

  async setLineupBoolean($event: SetLineupEvent): Promise<void> {
    //TODO: Add failure dialog with error message (server comm error, team not paid for, etc)
    console.log($event.team.team_key, $event.state);
    try {
      await this.sts.setLineupsBooleanTransaction($event.team, $event.state);
    } catch (e) {
      // revert the change if the database write failed
      // TODO: add a dialog to show the error message
      $event.team.is_setting_lineups = !$event.state;
    }
  }
}
