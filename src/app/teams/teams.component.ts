import { Component, OnInit } from '@angular/core';
import { Schedule } from './interfaces/schedules';
import { SetLineupEvent } from './interfaces/set-lineup-event';
import { Team } from './interfaces/team';
import { SyncTeamsService } from './services/sync-teams.service';
import {
  DialogData,
  ConfirmDialogComponent,
} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlineStatusService } from '../services/online-status.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [SyncTeamsService],
})
export class TeamsComponent implements OnInit {
  public teams: Team[];
  public schedule: Schedule | null;

  constructor(
    private sts: SyncTeamsService,
    public dialog: MatDialog,
    public os: OnlineStatusService
  ) {
    // load teams from sessionStorage if it exists
    this.teams = JSON.parse(sessionStorage.getItem('yahooTeams') || '[]');

    // load schedules from sessionStorage if it exists
    try {
      this.schedule = JSON.parse(sessionStorage.getItem('schedules') || 'null');
    } catch {
      this.schedule = null;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.teams.length === 0) {
      // If teams doesn't exist in sessionStorage, retrieve from APIs
      try {
        this.teams = await this.sts.buildTeams();
      } catch (err: Error | any) {
        this.errorDialog(
          err.message +
            ' Please ensure you are connected to the internet and try again later.',
          'ERROR Fetching Teams'
        );
      }
    }
    if (!this.schedule) {
      // If schedules doesn't exist in sessionStorage, retrieve from APIs
      try {
        this.schedule = await this.sts.fetchSchedulesFromFirebase();
      } catch (err: Error | any) {
        this.errorDialog(
          err.message +
            ' Please ensure you are connected to the internet and try again later.',
          'ERROR Fetching Schedules'
        );
      }
    }
  }

  async setLineupBoolean($event: SetLineupEvent): Promise<void> {
    console.log($event.team.team_key, $event.state);
    try {
      await this.sts.setLineupsBooleanFirebase($event.team, $event.state);
      // make the change in sessionStorage as well
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (err) {
      // revert the change if the database write failed
      $event.team.is_setting_lineups = !$event.state;
      this.errorDialog(
        "Could not update team's status on the server. Please ensure try again later."
      );
    }
  }

  errorDialog(message: string, title: string = 'ERROR'): void {
    const dialogData: DialogData = {
      title,
      message,
      trueButton: 'OK',
    };
    this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });
  }
}
