import { Component, OnInit } from '@angular/core';
import { Schedule } from './interfaces/schedules';
import { SetLineupEvent } from './interfaces/set-lineup-event';
import { Team } from './interfaces/team';
import { SyncTeamsService } from './services/sync-teams.service';
import {
  DialogData,
  ConfirmDialogComponent,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlineStatusService } from '../services/online-status.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [SyncTeamsService],
})
export class TeamsComponent implements OnInit {
  public teams: Team[] = [];
  public schedule: Schedule | null = null;

  constructor(
    private sts: SyncTeamsService,
    public dialog: MatDialog,
    public os: OnlineStatusService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.teams = JSON.parse(sessionStorage.getItem('yahooTeams') || '[]');
    this.schedule = JSON.parse(sessionStorage.getItem('schedules') || 'null');

    try {
      if (this.teams.length === 0) {
        // If teams doesn't exist in sessionStorage, show old teams from
        // localstorage and retrieve fresh from APIs
        const snackBarRef = this._snackBar.open('Refreshing Teams');
        this.teams = JSON.parse(localStorage.getItem('yahooTeams') || '[]');
        this.teams = await this.sts.fetchTeamsFromYahoo();
        snackBarRef.dismiss();
        localStorage.setItem('yahooTeams', JSON.stringify(this.teams));
      } else {
        // If teams exist in sessionStorage, just refresh properties from firestore
        const firestoreTeams = await this.sts.fetchTeamsFromFirestore();
        this.teams.forEach((team) => {
          const firestoreTeam = firestoreTeams.find(
            (t: any) => t.team_key === team.team_key
          );
          // patch all properties from firestoreTeam to team
          Object.assign(team, firestoreTeam);
        });
      }
      // save teams to sessionStorage
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (err: Error | any) {
      this.errorDialog(
        err.message +
          ' Please ensure you are connected to the internet and try again later.',
        'ERROR Fetching Teams'
      );
    }

    if (!this.schedule) {
      try {
        this.schedule = await this.sts.fetchSchedulesFromFirestore();
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
    // console.log($event.team.team_key, $event.state);
    try {
      await this.sts.setLineupsBooleanFirestore($event.team, $event.state);
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (err) {
      // revert the change if the database write failed
      $event.team.is_setting_lineups = !$event.state;
      this.errorDialog(
        "Could not update team's status on the server. Please check your internet connection and try again later."
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
