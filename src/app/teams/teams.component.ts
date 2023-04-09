import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [SyncTeamsService],
})
export class TeamsComponent implements OnInit, OnDestroy {
  public teams: Team[] = [];
  public schedule: Schedule | null = null;
  private isDirty: boolean = false;
  user: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private sts: SyncTeamsService,
    private auth: AuthService,
    public dialog: MatDialog,
    public os: OnlineStatusService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.teams = JSON.parse(sessionStorage.getItem('yahooTeams') || '[]');
    this.schedule = JSON.parse(sessionStorage.getItem('schedules') || 'null');

    this.userSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    let snackBarRef: MatSnackBarRef<TextOnlySnackBar> | undefined;
    try {
      if (this.teams.length === 0) {
        // If teams doesn't exist in sessionStorage, show old teams from
        // localstorage and retrieve fresh from APIs
        snackBarRef = this._snackBar.open('Refreshing Teams');
        this.teams = JSON.parse(localStorage.getItem('yahooTeams') || '[]');
        this.teams = await this.sts.fetchTeamsFromYahoo();
        await this.fetchTeamPropertiesFromFirestore();
        snackBarRef.dismiss();
        localStorage.setItem('yahooTeams', JSON.stringify(this.teams));
      } else {
        // If teams exist in sessionStorage, just refresh properties from firestore
        await this.fetchTeamPropertiesFromFirestore();
      }
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (err: Error | any) {
      snackBarRef?.dismiss();
      await this.handleFetchTeamsError(err);
    }

    await this.fetchLeagueSchedules();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private async fetchTeamPropertiesFromFirestore() {
    const firestoreTeams = await this.sts.fetchTeamsFromFirestore();
    this.teams.forEach((team) => {
      const firestoreTeam = firestoreTeams.find(
        (t: any) => t.team_key === team.team_key
      );
      // patch all properties from firestoreTeam to team
      Object.assign(team, firestoreTeam);
    });
  }

  private async fetchLeagueSchedules() {
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

  private async handleFetchTeamsError(err: any) {
    if (err.message === 'Refresh Token Error') {
      const result = await this.errorDialog(
        'Your teams are currently not being managed!\n' +
          'Please sign in again below to grant access for Fantasy AutoCoach to continue managing your teams.',
        'Yahoo Access Has Expired',
        'Sign in with Yahoo',
        'Cancel'
      );
      if (result) {
        this.sts.reauthenticateYahoo();
      }
    } else if (err.message) {
      this.errorDialog(err.message, 'ERROR Fetching Teams');
    } else {
      this.errorDialog(
        'Please ensure you are connected to the internet and try again',
        'ERROR Fetching Teams'
      );
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

  public onDirtyChange(dirty: boolean): void {
    this.isDirty = dirty;
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return !this.isDirty;
  }

  private async errorDialog(
    message: string,
    title: string = 'ERROR',
    trueButton: string = 'OK',
    falseButton: string | null = null
  ): Promise<boolean> {
    const dialogData: DialogData = {
      title,
      message,
      trueButton: trueButton,
    };
    if (falseButton) {
      dialogData.falseButton = falseButton;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });

    return await lastValueFrom(dialogRef.afterClosed());
  }
}
